# Static file server on TcpListener (binds 0.0.0.0, no admin/urlacl needed)
param([int]$Port = 8080)
$ErrorActionPreference = 'SilentlyContinue'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$mime = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css; charset=utf-8'; '.js'='application/javascript; charset=utf-8';
  '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png'; '.svg'='image/svg+xml';
  '.gif'='image/gif'; '.webp'='image/webp'; '.ico'='image/x-icon'; '.json'='application/json'; '.md'='text/plain; charset=utf-8' }

$listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Any, $Port)
$listener.Start()
Write-Host "Serving $root on http://0.0.0.0:$Port/"

while ($true) {
  $client = $listener.AcceptTcpClient()
  try {
    $stream = $client.GetStream()
    $reader = New-Object System.IO.StreamReader($stream)
    $requestLine = $reader.ReadLine()
    if (-not $requestLine) { $client.Close(); continue }
    # drain headers (non-blocking-ish)
    while ($stream.DataAvailable) { [void]$reader.ReadLine() }

    $parts = $requestLine -split ' '
    $rawPath = if ($parts.Count -ge 2) { $parts[1] } else { '/' }
    $path = [Uri]::UnescapeDataString(($rawPath -split '\?')[0])
    if ($path -eq '/' ) { $path = '/index.html' }
    $rel = ($path.TrimStart('/') -replace '/', '\')
    $file = Join-Path $root $rel

    $writer = New-Object System.IO.BinaryWriter($stream)
    if ((Test-Path $file -PathType Leaf) -and ($file.StartsWith($root))) {
      $bytes = [System.IO.File]::ReadAllBytes($file)
      $ext = [System.IO.Path]::GetExtension($file).ToLower()
      $ct = $mime[$ext]; if (-not $ct) { $ct = 'application/octet-stream' }
      $head = "HTTP/1.1 200 OK`r`nContent-Type: $ct`r`nContent-Length: $($bytes.Length)`r`nCache-Control: no-cache`r`nConnection: close`r`n`r`n"
      $writer.Write([System.Text.Encoding]::ASCII.GetBytes($head))
      $writer.Write($bytes)
    } else {
      $body = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $path")
      $head = "HTTP/1.1 404 Not Found`r`nContent-Type: text/plain; charset=utf-8`r`nContent-Length: $($body.Length)`r`nConnection: close`r`n`r`n"
      $writer.Write([System.Text.Encoding]::ASCII.GetBytes($head))
      $writer.Write($body)
    }
    $writer.Flush()
  } catch { }
  finally { $client.Close() }
}
