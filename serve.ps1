# pix3lhaze Portfolio — Local HTTP Server
# Run this, then open http://localhost:8080

$port   = 8080
$root   = Split-Path -Parent $MyInvocation.MyCommand.Path
$prefix = "http://localhost:$port/"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)
$listener.Start()

Write-Host "  pix3lhaze Portfolio Server Running!" -ForegroundColor Yellow
Write-Host "  Open: http://localhost:$port" -ForegroundColor Cyan
Write-Host "  Press Ctrl+C to stop." -ForegroundColor Gray

$mime = @{ '.html'='text/html';'.css'='text/css';'.js'='application/javascript';'.mp4'='video/mp4';'.jpg'='image/jpeg';'.png'='image/png';'.svg'='image/svg+xml';'.webp'='image/webp';'.ico'='image/x-icon' }

Start-Process "http://localhost:$port"

while ($listener.IsListening) {
  try {
    $ctx = $listener.GetContext()
    $urlPath = $ctx.Request.Url.AbsolutePath
    if ($urlPath -eq '/') { $urlPath = '/index.html' }
    $filePath = Join-Path $root ($urlPath.TrimStart('/').Replace('/','\'))
    $resp = $ctx.Response
    if (Test-Path $filePath -PathType Leaf) {
      $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
      $bytes = [System.IO.File]::ReadAllBytes($filePath)
      $resp.ContentType = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' }
      $resp.ContentLength64 = $bytes.Length
      $resp.StatusCode = 200
      $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
      $resp.StatusCode = 404
      $b = [System.Text.Encoding]::UTF8.GetBytes('404 Not Found')
      $resp.OutputStream.Write($b, 0, $b.Length)
    }
    $resp.OutputStream.Close()
  } catch {}
}
