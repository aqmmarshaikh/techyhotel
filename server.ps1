$port = 8080
$root = $PSScriptRoot
$prefix = 'http://localhost:8080/'

$mime = @{}
$mime['.html'] = 'text/html'
$mime['.css']  = 'text/css'
$mime['.js']   = 'application/javascript'
$mime['.json'] = 'application/json'
$mime['.png']  = 'image/png'
$mime['.jpg']  = 'image/jpeg'
$mime['.jpeg'] = 'image/jpeg'
$mime['.svg']  = 'image/svg+xml'
$mime['.ico']  = 'image/x-icon'
$mime['.webp'] = 'image/webp'
$mime['.gif']  = 'image/gif'
$mime['.woff'] = 'font/woff'
$mime['.woff2']= 'font/woff2'
$mime['.ttf']  = 'font/ttf'
$mime['.mp4']  = 'video/mp4'

$http = New-Object System.Net.HttpListener
$http.Prefixes.Add($prefix)
$http.Start()

Write-Host ''
Write-Host '  Grand Mehta Palace - Dev Server' -ForegroundColor Yellow
Write-Host '  Running at: http://localhost:8080' -ForegroundColor Cyan
Write-Host '  Press Ctrl+C to stop' -ForegroundColor Gray
Write-Host ''

Start-Process 'http://localhost:8080'

while ($http.IsListening) {
    try {
        $ctx = $http.GetContext()
        $req = $ctx.Request
        $res = $ctx.Response

        $path = $req.Url.LocalPath
        if ($path -eq '/') { $path = '/index.html' }

        $clean = $path.TrimStart('/').Replace('/', '\')
        $file  = Join-Path $root $clean

        $res.Headers.Add('Access-Control-Allow-Origin', '*')
        $res.Headers.Add('Cache-Control', 'no-cache')

        if (Test-Path $file -PathType Leaf) {
            $ext  = [IO.Path]::GetExtension($file).ToLower()
            $type = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' }
            $buf  = [IO.File]::ReadAllBytes($file)
            $res.ContentType     = $type
            $res.ContentLength64 = $buf.Length
            $res.StatusCode      = 200
            $res.OutputStream.Write($buf, 0, $buf.Length)
        } else {
            $msg = [Text.Encoding]::UTF8.GetBytes('404 Not Found')
            $res.StatusCode      = 404
            $res.ContentType     = 'text/plain'
            $res.ContentLength64 = $msg.Length
            $res.OutputStream.Write($msg, 0, $msg.Length)
        }

        $res.OutputStream.Close()
    } catch { }
}
