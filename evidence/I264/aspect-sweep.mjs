#!/usr/bin/env node
// I264 — aspect-ratio sweep for gridtheory.app screenshots.
//
// Drives headless Chrome over the DevTools Protocol (raw WebSocket, no
// puppeteer) at three viewport widths x two colour schemes, on three pages,
// and checks that every screenshot `<img>` keeps the aspect ratio implied by
// its `width`/`height` attributes, and that no page overflows horizontally.
//
// Usage:
//   node aspect-sweep.mjs sweep <baseUrl> <outJsonPath>
//     Runs the sweep against a running static server (e.g.
//     `python3 -m http.server -d dist 8000`, baseUrl http://127.0.0.1:8000)
//     and writes the raw results as JSON.
//
//   node aspect-sweep.mjs report <label1>=<json1> [<label2>=<json2> ...] <outMdPath>
//     Reads one or more sweep JSON files and writes a combined markdown
//     table + summary to outMdPath.
//
// One headless Chrome process is used at a time; it is always killed before
// the script exits.

import { spawn } from "node:child_process";
import { accessSync } from "node:fs";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const VIEWPORTS = [390, 1024, 1280];
const SCHEMES = ["light", "dark"];
const PAGES = ["/", "/support/", "/privacy/"];
const RATIO_TOLERANCE = 0.01;
const VIEWPORT_HEIGHT = 2400; // tall enough that lazy images are reachable by scroll

function findChromeBinary() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ];
  for (const c of candidates) {
    try {
      accessSync(c);
      return c;
    } catch {}
  }
  return process.env.CHROME_BIN || candidates[0];
}

async function waitForDebugger(port) {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (res.ok) return await res.json();
    } catch {}
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("chrome remote debugger did not come up in time");
}

class Chrome {
  constructor() {
    this.nextId = 0;
    this.pending = new Map();
    this.eventListeners = new Map(); // sessionId -> Map(method -> [cb])
  }

  async launch() {
    const chromeBin = findChromeBinary();
    this.port = 9312 + Math.floor(Math.random() * 500);
    this.userDataDir = await mkdtemp(join(tmpdir(), "i264-cdp-"));
    this.proc = spawn(
      chromeBin,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
        "--hide-scrollbars",
        `--remote-debugging-port=${this.port}`,
        `--user-data-dir=${this.userDataDir}`,
        "about:blank",
      ],
      { stdio: "ignore" },
    );
    const info = await waitForDebugger(this.port);
    this.ws = new WebSocket(info.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (ev) => this._onMessage(ev));
  }

  _onMessage(ev) {
    const msg = JSON.parse(ev.data);
    if (msg.id !== undefined) {
      const key = `${msg.sessionId || ""}:${msg.id}`;
      const resolver = this.pending.get(key);
      if (resolver) {
        this.pending.delete(key);
        resolver(msg);
      }
      return;
    }
    if (msg.method) {
      const sid = msg.sessionId || "";
      const listeners = this.eventListeners.get(sid);
      const cbs = listeners && listeners.get(msg.method);
      if (cbs) cbs.forEach((cb) => cb(msg.params));
    }
  }

  send(method, params = {}, sessionId = undefined) {
    const id = ++this.nextId;
    const key = `${sessionId || ""}:${id}`;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    return new Promise((resolve, reject) => {
      this.pending.set(key, (msg) => {
        if (msg.error) reject(new Error(`${method}: ${JSON.stringify(msg.error)}`));
        else resolve(msg.result);
      });
      this.ws.send(JSON.stringify(payload));
    });
  }

  once(sessionId, method) {
    return new Promise((resolve) => {
      const sid = sessionId || "";
      if (!this.eventListeners.has(sid)) this.eventListeners.set(sid, new Map());
      const m = this.eventListeners.get(sid);
      const cb = (params) => {
        const arr = m.get(method);
        arr.splice(arr.indexOf(cb), 1);
        resolve(params);
      };
      if (!m.has(method)) m.set(method, []);
      m.get(method).push(cb);
    });
  }

  async newSession() {
    const { targetId } = await this.send("Target.createTarget", { url: "about:blank" });
    const { sessionId } = await this.send("Target.attachToTarget", {
      targetId,
      flatten: true,
    });
    await this.send("Page.enable", {}, sessionId);
    await this.send("Runtime.enable", {}, sessionId);
    return { targetId, sessionId };
  }

  async closeSession({ targetId }) {
    await this.send("Target.closeTarget", { targetId });
  }

  async close() {
    try {
      this.ws.close();
    } catch {}
    if (this.proc) this.proc.kill("SIGKILL");
    if (this.userDataDir) await rm(this.userDataDir, { recursive: true, force: true });
  }
}

async function navigate(chrome, sessionId, url) {
  const loaded = chrome.once(sessionId, "Page.loadEventFired");
  await chrome.send("Page.navigate", { url }, sessionId);
  await loaded;
}

async function evaluate(chrome, sessionId, expression) {
  const result = await chrome.send(
    "Runtime.evaluate",
    { expression, returnByValue: true, awaitPromise: true },
    sessionId,
  );
  if (result.exceptionDetails) {
    throw new Error(`evaluate failed: ${JSON.stringify(result.exceptionDetails)}`);
  }
  return result.result.value;
}

// Forces every lazy image to load, then waits (bounded) until every
// screenshot img is complete with a real natural size.
async function forceImagesLoaded(chrome, sessionId) {
  await evaluate(
    chrome,
    sessionId,
    `(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
        img.loading = "eager";
        img.scrollIntoView({ block: "center" });
      });
      return true;
    })()`,
  );
  const deadline = Date.now() + 5000;
  for (;;) {
    const ready = await evaluate(
      chrome,
      sessionId,
      `Array.from(document.images)
        .filter((img) => ((img.currentSrc || img.src || "").includes("/screens/")))
        .every((img) => img.complete && img.naturalWidth > 0)`,
    );
    if (ready) return;
    if (Date.now() > deadline) return; // measurement below records whatever state we're in
    await new Promise((r) => setTimeout(r, 100));
  }
}

async function measure(chrome, sessionId) {
  return evaluate(
    chrome,
    sessionId,
    `(() => {
      const imgs = Array.from(document.images)
        .filter((img) => ((img.currentSrc || img.src || "").includes("/screens/")))
        .map((img) => {
          const rect = img.getBoundingClientRect();
          const src = img.currentSrc || img.src;
          return {
            src: src.replace(location.origin, ""),
            boxW: rect.width,
            boxH: rect.height,
            clientW: img.clientWidth,
            clientH: img.clientHeight,
            attrW: Number(img.getAttribute("width")),
            attrH: Number(img.getAttribute("height")),
            complete: img.complete,
            naturalWidth: img.naturalWidth,
          };
        });
      return {
        imgs,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      };
    })()`,
  );
}

async function runSweep(baseUrl) {
  const chrome = new Chrome();
  await chrome.launch();
  const records = [];
  try {
    for (const viewport of VIEWPORTS) {
      for (const scheme of SCHEMES) {
        const { targetId, sessionId } = await chrome.newSession();
        try {
          await chrome.send(
            "Emulation.setDeviceMetricsOverride",
            {
              width: viewport,
              height: VIEWPORT_HEIGHT,
              deviceScaleFactor: 1,
              mobile: viewport < 700,
            },
            sessionId,
          );
          await chrome.send(
            "Emulation.setEmulatedMedia",
            { features: [{ name: "prefers-color-scheme", value: scheme }] },
            sessionId,
          );
          for (const page of PAGES) {
            await navigate(chrome, sessionId, new URL(page, baseUrl).toString());
            await forceImagesLoaded(chrome, sessionId);
            const { imgs, scrollWidth, innerWidth } = await measure(chrome, sessionId);
            for (const img of imgs) {
              // Pass criterion measures the CONTENT box (clientWidth/clientHeight,
              // no border/padding). getBoundingClientRect includes the border, so
              // an aspect-ratio pin on the border box can distort the painted
              // (content-box) image even while the border-box ratio matches.
              const boxRatio = img.boxW / img.boxH;
              const contentRatio = img.clientW / img.clientH;
              const attrRatio = img.attrW / img.attrH;
              const ratioDelta = Math.abs(contentRatio / attrRatio - 1);
              const borderRatioDelta = Math.abs(boxRatio / attrRatio - 1);
              records.push({
                page,
                viewport,
                scheme,
                src: img.src,
                boxW: img.boxW,
                boxH: img.boxH,
                clientW: img.clientW,
                clientH: img.clientH,
                attrW: img.attrW,
                attrH: img.attrH,
                ratioDelta,
                borderRatioDelta,
                ratioOk: ratioDelta <= RATIO_TOLERANCE,
              });
            }
            records.push({
              page,
              viewport,
              scheme,
              scrollWidth,
              innerWidth,
              scrollOk: scrollWidth <= innerWidth,
              kind: "scroll",
            });
          }
        } finally {
          await chrome.closeSession({ targetId });
        }
      }
    }
  } finally {
    await chrome.close();
  }
  return records;
}

function fmt(n) {
  return Number.isFinite(n) ? n.toFixed(3) : String(n);
}

function buildMarkdown(labelledResults) {
  const lines = [];
  lines.push("# I264 — aspect-ratio sweep");
  lines.push("");
  lines.push(
    "Viewports: 390, 1024, 1280px. Schemes: light, dark. Pages: /, /support/, /privacy/.",
  );
  lines.push(
    "Pass criterion per image: `|(clientW/clientH) / (attrW/attrH) - 1| <= 0.01`, measured on the " +
      "CONTENT box (`img.clientWidth`/`img.clientHeight`; excludes border/padding). The border-box " +
      "ratio (`getBoundingClientRect`, includes the border) is also recorded for comparison. " +
      "Pass criterion per page: `scrollWidth <= innerWidth`.",
  );
  lines.push("");

  for (const { label, records } of labelledResults) {
    const imgRows = records.filter((r) => r.kind !== "scroll");
    const scrollRows = records.filter((r) => r.kind === "scroll");
    const imgFails = imgRows.filter((r) => !r.ratioOk);
    const scrollFails = scrollRows.filter((r) => !r.scrollOk);

    lines.push(`## ${label}`);
    lines.push("");
    lines.push(
      `${imgRows.length} image measurements, ${imgFails.length} failing ratio check. ` +
        `${scrollRows.length} page/config checks, ${scrollFails.length} failing scroll-width check.`,
    );
    lines.push("");
    lines.push(
      "| page | viewport | scheme | src | border box (w x h) | content box (w x h) | attrs (w x h) | border ratio delta | content ratio delta | ok |",
    );
    lines.push("|---|---|---|---|---|---|---|---|---|---|");
    for (const r of imgRows) {
      lines.push(
        `| ${r.page} | ${r.viewport} | ${r.scheme} | ${r.src} | ${fmt(r.boxW)} x ${fmt(r.boxH)} | ${fmt(r.clientW)} x ${fmt(r.clientH)} | ${r.attrW} x ${r.attrH} | ${fmt(r.borderRatioDelta)} | ${fmt(r.ratioDelta)} | ${r.ratioOk ? "yes" : "**NO**"} |`,
      );
    }
    lines.push("");
    lines.push("| page | viewport | scheme | scrollWidth | innerWidth | ok |");
    lines.push("|---|---|---|---|---|---|");
    for (const r of scrollRows) {
      lines.push(
        `| ${r.page} | ${r.viewport} | ${r.scheme} | ${r.scrollWidth} | ${r.innerWidth} | ${r.scrollOk ? "yes" : "**NO**"} |`,
      );
    }
    lines.push("");

    if (imgFails.length) {
      lines.push("**Failing rows quoted:**");
      lines.push("");
      for (const r of imgFails) {
        lines.push(
          `- \`${label}\` ${r.page} @ ${r.viewport}px, ${r.scheme}: \`${r.src}\` content box ${fmt(r.clientW)}x${fmt(r.clientH)} (ratio ${fmt(r.clientW / r.clientH)}) vs attrs ${r.attrW}x${r.attrH} (ratio ${fmt(r.attrW / r.attrH)}), delta ${fmt(r.ratioDelta)}.`,
        );
      }
      lines.push("");
    }
  }

  return lines.join("\n") + "\n";
}

async function main() {
  const [, , mode, ...rest] = process.argv;
  if (mode === "sweep") {
    const [baseUrl, outJsonPath] = rest;
    if (!baseUrl || !outJsonPath) {
      throw new Error("usage: aspect-sweep.mjs sweep <baseUrl> <outJsonPath>");
    }
    const records = await runSweep(baseUrl);
    await writeFile(outJsonPath, JSON.stringify(records, null, 2));
    const fails = records.filter((r) => (r.kind === "scroll" ? !r.scrollOk : !r.ratioOk));
    console.log(`wrote ${records.length} records to ${outJsonPath}; ${fails.length} failing`);
    process.exit(fails.length ? 1 : 0);
  } else if (mode === "report") {
    const outMdPath = rest[rest.length - 1];
    const pairs = rest.slice(0, -1);
    const labelledResults = [];
    for (const pair of pairs) {
      const eq = pair.indexOf("=");
      const label = pair.slice(0, eq);
      const jsonPath = pair.slice(eq + 1);
      const records = JSON.parse(await readFile(jsonPath, "utf8"));
      labelledResults.push({ label, records });
    }
    const md = buildMarkdown(labelledResults);
    await writeFile(outMdPath, md);
    console.log(`wrote report to ${outMdPath}`);
  } else {
    throw new Error("usage: aspect-sweep.mjs <sweep|report> ...");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(2);
});
