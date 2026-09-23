(function () {
  "use strict";

  // RFC 6068: the addr-spec's "@" is not a reserved delimiter for the
  // mailto scheme and should stay literal; every other character still
  // gets percent-encoded.
  function mailtoAddress(address) {
    return encodeURIComponent(address).replace(/%40/g, "@");
  }

  // Builds the mailto: URL for the feedback form. Kept as a standalone named
  // function (the address is passed in, never a literal here) so it can be
  // exercised in isolation without a DOM.
  function buildFeedbackMailto(address, fields) {
    var subject = "GridTheory feedback: " + fields.category;
    var body = [
      "Category: " + fields.category,
      "Device: " + fields.device,
      "iOS version: " + fields.ios,
      "App version: " + fields.appVersion,
      "",
      "Message:",
      fields.message
    ].join("\n");

    return (
      "mailto:" + mailtoAddress(address) +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body)
    );
  }

  function fallback(value) {
    var trimmed = (value || "").trim();
    return trimmed.length ? trimmed : "(not given)";
  }

  // An aria-live region only speaks on a text mutation, so repeating the
  // same status message (e.g. two empty submits in a row) needs a clear
  // first, or a screen reader stays silent on the second attempt.
  function announce(status, message) {
    if (!status) return;
    status.textContent = "";
    window.setTimeout(function () {
      status.textContent = message;
    }, 0);
  }

  function markInvalid(field, invalid) {
    if (!field) return;
    if (invalid) {
      field.setAttribute("aria-invalid", "true");
    } else {
      field.removeAttribute("aria-invalid");
    }
  }

  function init() {
    var form = document.getElementById("feedback-form");
    if (!form) return;

    var address = form.getAttribute("data-support-email");
    var link = form.querySelector("[data-support-email-link]");
    if (link && address) {
      link.href = "mailto:" + mailtoAddress(address);
      link.textContent = address;
    }

    var status = form.querySelector(".form-status");

    // The submit button ships `disabled` in the markup so a page load that
    // never runs this script (no-JS, or a slow/blocked script) cannot
    // submit at all -- the browser has no enabled submit control to invoke,
    // so there is no accidental GET back to this page. Enabling it here is
    // the sign the handler below is actually wired up.
    var submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = false;

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var categoryField = form.elements.category;
      var messageField = form.elements.message;
      var category = (categoryField.value || "").trim();
      var message = (messageField.value || "").trim();

      markInvalid(categoryField, !category);
      markInvalid(messageField, !message);

      if (!category || !message) {
        announce(status, "Please choose a category and add a message before sending.");
        (!category ? categoryField : messageField).focus();
        return;
      }

      var url = buildFeedbackMailto(address, {
        category: category,
        device: fallback(form.elements.device.value),
        ios: fallback(form.elements.ios.value),
        appVersion: fallback(form.elements.appVersion.value),
        message: message
      });

      announce(status, "Opening your mail app…");
      window.location.href = url;
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = { buildFeedbackMailto: buildFeedbackMailto };
  }
})();
