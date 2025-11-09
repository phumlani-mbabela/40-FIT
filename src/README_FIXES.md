# BodyShape auto-fixes

This bundle provides two options to automatically fix invalid JSX anchors that cause errors like:

```
Unexpected token, expected "jsxTagEnd"
<h6 className="title"><a href={href("/blog-details")}/blog-details>…</a></h6>
```

The fixes do three things:

1. Convert `href={href("/x")}/slug` → `href={href("/x")}`
2. Convert self-closing anchors `<a .../>` → `<a ...>` (and leave the closing `</a>`)
3. Fix `<a .../> <img .../> </a>` → `<a ...><img .../></a>`

## Option A — Node script (cross‑platform)

1. Copy **apply-bodyshape-fixes.js** into your project **root** (same folder as `package.json`).
2. Run:
   ```bash
   node apply-bodyshape-fixes.js
   ```
3. Start the app:
   ```bash
   npm start
   ```

## Option B — PowerShell (Windows)

From the project root run:
```powershell
powershell -ExecutionPolicy Bypass -File .\apply-bodyshape-fixes.ps1
```

Then run `npm start` again.

If you still see errors, send the new error **file + line** and I’ll adjust the patterns immediately.
