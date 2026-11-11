$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')
if (-not $IsWindows -and $env:OS -ne 'Windows_NT') { throw 'Windows is required' }
foreach ($tool in @('node','npm','cargo','rustc')) { if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) { throw "Missing prerequisite: $tool" } }
$vswhere = "${env:ProgramFiles(x86)}\Microsoft Visual Studio\Installer\vswhere.exe"
if (-not (Test-Path $vswhere)) { throw 'Install Visual Studio C++ Build Tools and Windows SDK' }
$vs = & $vswhere -latest -products '*' -requires Microsoft.VisualStudio.Component.VC.Tools.x86.x64 -property installationPath
if (-not $vs) { throw 'MSVC x64 build tools were not found' }
& npm ci
if ($LASTEXITCODE -ne 0) { throw 'npm ci failed' }
& npm test
if ($LASTEXITCODE -ne 0) { throw 'Tests failed' }
& npm run tauri build -- --no-bundle
if ($LASTEXITCODE -ne 0) { throw 'Tauri build failed' }
$source = 'src-tauri/target/release/hvac-duct-calculator.exe'
if (-not (Test-Path $source) -or (Get-Item $source).Length -eq 0) { throw 'Release EXE missing or empty' }
New-Item -ItemType Directory -Force 'dist/portable' | Out-Null
$dest = 'dist/portable/HVAC-Duct-Calculator.exe'
Copy-Item $source $dest -Force
if ((Get-Item $dest).Length -eq 0) { throw 'Copied EXE is empty' }
$hash = (Get-FileHash $dest -Algorithm SHA256).Hash.ToLower()
"$hash  HVAC-Duct-Calculator.exe" | Set-Content 'dist/portable/SHA256SUMS.txt' -Encoding ascii
Write-Host "Output: $((Resolve-Path $dest).Path)"
Write-Host "Bytes: $((Get-Item $dest).Length)"
Write-Host "SHA256: $hash"
