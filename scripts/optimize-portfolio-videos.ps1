param(
  [Parameter(Mandatory = $true)]
  [string]$FfmpegPath,
  [int]$MaxParallel = 1,
  [string]$VideoDirectoryRelative = "public\assets\commercial\uploads",
  [string]$BackupDirectoryRelative = "source-assets\commercial-videos-original",
  [string]$VideoBitrate = "5M",
  [string]$VideoMaxRate = "6M",
  [string]$VideoBufferSize = "12M"
)

$ErrorActionPreference = "Stop"
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot ".."))
$videoDirectory = [IO.Path]::GetFullPath(
  (Join-Path $projectRoot $VideoDirectoryRelative)
)
$backupDirectory = [IO.Path]::GetFullPath(
  (Join-Path $projectRoot $BackupDirectoryRelative)
)

if (-not (Test-Path -LiteralPath $FfmpegPath)) {
  throw "ffmpeg not found: $FfmpegPath"
}
if (-not $videoDirectory.StartsWith($projectRoot, [StringComparison]::OrdinalIgnoreCase)) {
  throw "Unsafe video directory: $videoDirectory"
}
if (-not $backupDirectory.StartsWith($projectRoot, [StringComparison]::OrdinalIgnoreCase)) {
  throw "Unsafe backup directory: $backupDirectory"
}

New-Item -ItemType Directory -Force -Path $backupDirectory | Out-Null
$files = Get-ChildItem -LiteralPath $videoDirectory -File -Filter *.mp4 |
  Where-Object { $_.Name -notlike "*.web-optimized.mp4" }
$pending = [Collections.Generic.Queue[IO.FileInfo]]::new()
$files | ForEach-Object { $pending.Enqueue($_) }
$running = @{}
$completed = 0

function Start-VideoJob([IO.FileInfo]$file) {
  $temporaryOutput = Join-Path $file.DirectoryName ($file.BaseName + ".web-optimized.mp4")
  if (Test-Path -LiteralPath $temporaryOutput) {
    Remove-Item -LiteralPath $temporaryOutput -Force
  }

  $job = Start-Job -ScriptBlock {
    param($ffmpeg, $inputPath, $outputPath, $bitrate, $maxRate, $bufferSize)
    & $ffmpeg `
      -y `
      -hide_banner `
      -loglevel error `
      -i $inputPath `
      -map 0:v:0 `
      -map "0:a?" `
      -vf "scale='if(gt(iw,ih),min(1920,iw),-2)':'if(gt(iw,ih),-2,min(1920,ih))'" `
      -r 30 `
      -c:v h264_nvenc `
      -preset fast `
      -profile:v high `
      -b:v $bitrate `
      -maxrate $maxRate `
      -bufsize $bufferSize `
      -pix_fmt yuv420p `
      -c:a aac `
      -b:a 128k `
      -ac 2 `
      -movflags +faststart `
      $outputPath

    if ($LASTEXITCODE -ne 0) {
      throw "ffmpeg exited with code $LASTEXITCODE"
    }
  } -ArgumentList `
    $FfmpegPath,
    $file.FullName,
    $temporaryOutput,
    $VideoBitrate,
    $VideoMaxRate,
    $VideoBufferSize

  return [pscustomobject]@{
    Job = $job
    File = $file
    TemporaryOutput = $temporaryOutput
  }
}

while ($pending.Count -gt 0 -or $running.Count -gt 0) {
  while ($pending.Count -gt 0 -and $running.Count -lt $MaxParallel) {
    $file = $pending.Dequeue()
    $backupPath = Join-Path $backupDirectory $file.Name
    if (Test-Path -LiteralPath $backupPath) {
      Write-Output "SKIP $($file.Name) (backup already exists)"
      continue
    }
    $info = Start-VideoJob $file
    $running[$info.Job.Id] = $info
    Write-Output "START $($file.Name)"
  }

  if ($running.Count -eq 0) {
    continue
  }

  $finishedJob = Wait-Job -Job ($running.Values.Job) -Any -Timeout 2
  if (-not $finishedJob) {
    continue
  }

  $info = $running[$finishedJob.Id]
  try {
    Receive-Job -Job $finishedJob -ErrorAction Stop | Out-Null
    if (
      $finishedJob.State -ne "Completed" -or
      -not (Test-Path -LiteralPath $info.TemporaryOutput) -or
      (Get-Item -LiteralPath $info.TemporaryOutput).Length -le 0
    ) {
      throw "Optimization failed for $($info.File.Name)"
    }

    $backupPath = Join-Path $backupDirectory $info.File.Name
    $originalSize = $info.File.Length
    Move-Item -LiteralPath $info.File.FullName -Destination $backupPath
    Move-Item -LiteralPath $info.TemporaryOutput -Destination $info.File.FullName
    $optimizedSize = (Get-Item -LiteralPath $info.File.FullName).Length
    $completed += 1
    Write-Output (
      "DONE {0} {1:N1}MB -> {2:N1}MB ({3}/{4})" -f `
        $info.File.Name,
        ($originalSize / 1MB),
        ($optimizedSize / 1MB),
        $completed,
        $files.Count
    )
  } catch {
    if (Test-Path -LiteralPath $info.TemporaryOutput) {
      Remove-Item -LiteralPath $info.TemporaryOutput -Force
    }
    Write-Output "FAILED $($info.File.Name): $($_.Exception.Message)"
  } finally {
    Remove-Job -Job $finishedJob -Force
    $running.Remove($finishedJob.Id)
  }
}

Write-Output "COMPLETE optimized=$completed total=$($files.Count)"
