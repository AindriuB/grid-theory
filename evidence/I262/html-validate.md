# I262 — captured `html-validate` output

Command:
```
npx --yes html-validate 'dist/**/*.html'
```

Exit code: `0`

stdout/stderr: empty (html-validate prints nothing when there are zero
errors and zero warnings — no output is the pass signal for this tool, not
an omission).

Re-run at attempt 2, from the same branch's `dist/` (no `dist/` changes made
in attempt 2 beyond attempt 1's already-committed footer fix): same result,
exit `0`, no output.
