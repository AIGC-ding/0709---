$ErrorActionPreference = "Stop"

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$SiteUrl = "http://127.0.0.1:5177/"
$OutputDir = Join-Path $ProjectRoot "output"
$StdoutLog = Join-Path $OutputDir "website-server.log"
$StderrLog = Join-Path $OutputDir "website-server-error.log"
$PidFile = Join-Path $OutputDir "website-server.pid"

function Test-SiteReady {
    try {
        $response = Invoke-WebRequest -Uri $SiteUrl -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -ge 200 -and $response.StatusCode -lt 500
    }
    catch {
        return $false
    }
}

function Open-Site {
    Start-Process $SiteUrl
    Write-Host "Website opened successfully: $SiteUrl" -ForegroundColor Green
}

Set-Location -LiteralPath $ProjectRoot
New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null

if (Test-SiteReady) {
    Write-Host "Website is already running. Opening the browser..." -ForegroundColor Cyan
    Open-Site
    exit 0
}

if (-not (Get-Command node.exe -ErrorAction SilentlyContinue)) {
    Write-Host "Node.js was not found. Install Node.js LTS, then run the launcher again." -ForegroundColor Red
    Start-Process "https://nodejs.org/zh-cn/download"
    exit 1
}

if (-not (Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    Write-Host "npm was not found. Reinstall Node.js LTS." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path -LiteralPath (Join-Path $ProjectRoot "node_modules"))) {
    Write-Host "First launch: installing website dependencies..." -ForegroundColor Yellow
    & npm.cmd install
    if ($LASTEXITCODE -ne 0) {
        throw "Dependency installation failed."
    }
}

Remove-Item -LiteralPath $StdoutLog, $StderrLog -Force -ErrorAction SilentlyContinue

Write-Host "Starting the portfolio website..." -ForegroundColor Cyan
$server = Start-Process -FilePath "npm.cmd" `
    -ArgumentList @("run", "dev") `
    -WorkingDirectory $ProjectRoot `
    -WindowStyle Hidden `
    -RedirectStandardOutput $StdoutLog `
    -RedirectStandardError $StderrLog `
    -PassThru

Set-Content -LiteralPath $PidFile -Value $server.Id -Encoding ascii

for ($attempt = 0; $attempt -lt 40; $attempt++) {
    if (Test-SiteReady) {
        Open-Site
        exit 0
    }

    if ($server.HasExited) {
        break
    }

    Start-Sleep -Milliseconds 500
}

Write-Host "The website failed to start. Recent error output:" -ForegroundColor Red
if (Test-Path -LiteralPath $StderrLog) {
    Get-Content -LiteralPath $StderrLog -Tail 30
}
exit 1
