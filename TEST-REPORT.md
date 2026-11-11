# Verification report

Environment: Linux x64, Node 24.22.1, npm 11.9.0.

Passed:
- npm install: dependency lockfile generated.
- npm test: 11 tests, 11 passed, 0 failed. Tests cover independent airflow examples, inverse velocity, round sizing, all rectangular aspect ratios and both increments, invalid/empty numbers, inch/mm conversion, FPM and repeated unit round trips.
- npm run build: Vite 6.4.6 production frontend built successfully.
- Installed Tauri CLI build help confirms --no-bundle syntax.

Not performed:
- Rust compilation and Windows release EXE creation: no Windows/MSVC or Rust here.
- GitHub Actions run: repository not yet supplied or created. Workflow is included, not run.
- Browser UI automation: attempted Playwright launch but browser binary is absent; no UI interaction checks claimed.
- Native clipboard, Windows offline runtime, USB, clean VM, scaling and WebView2-present/absent tests remain pending.
- No EXE SHA256 is available yet; the PowerShell script generates it after a successful Windows build.

Correction to input specification: exact dimensional conversion gives 1367.0166229221345 CFM for 10 inch × 10 inch at 10 m/s. Initial test using the specification's inconsistent expected number failed; corrected independent expected number passes. Calculation code was not altered to fit the wrong example.
