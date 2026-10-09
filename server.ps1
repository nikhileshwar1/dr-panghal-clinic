$port = 5000
$basePath = "c:\Users\nikhi\Downloads\dr-panghal-clinic"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Output "Server running at http://localhost:$port/"

$mimeTypes = @{
    ".html"  = "text/html; charset=utf-8"
    ".css"   = "text/css; charset=utf-8"
    ".js"    = "application/javascript; charset=utf-8"
    ".json"  = "application/json; charset=utf-8"
    ".png"   = "image/png"
    ".jpg"   = "image/jpeg"
    ".jpeg"  = "image/jpeg"
    ".webp"  = "image/webp"
    ".svg"   = "image/svg+xml"
    ".ico"   = "image/x-icon"
    ".woff2" = "font/woff2"
    ".mp4"   = "video/mp4"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        try {
            $request = $context.Request
            $response = $context.Response

            $urlPath = [System.Uri]::UnescapeDataString($request.Url.LocalPath)
            if ($urlPath -eq "/" -or [string]::IsNullOrEmpty($urlPath)) {
                $urlPath = "/index.html"
            }

            $localFilePath = Join-Path $basePath $urlPath.TrimStart('/')

            # If path is a directory, look for index.html inside it
            if (Test-Path $localFilePath -PathType Container) {
                $localFilePath = Join-Path $localFilePath "index.html"
            } elseif (-not (Test-Path $localFilePath -PathType Leaf)) {
                # Try appending /index.html if requesting without trailing slash
                $asDir = Join-Path $basePath ($urlPath.TrimStart('/') + "\index.html")
                if (Test-Path $asDir -PathType Leaf) {
                    $localFilePath = $asDir
                }
            }

            if (Test-Path $localFilePath -PathType Leaf) {
                $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
                $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                $response.ContentType = $mime
                $response.AddHeader("Cache-Control", "no-cache, no-store, must-revalidate")
                $response.AddHeader("Pragma", "no-cache")
                $response.AddHeader("Expires", "0")
                $response.AddHeader("Accept-Ranges", "bytes")
                
                $fileInfo = New-Object System.IO.FileInfo($localFilePath)
                $response.ContentLength64 = $fileInfo.Length

                if ($request.HttpMethod -ne "HEAD") {
                    $stream = [System.IO.File]::OpenRead($localFilePath)
                    try {
                        $stream.CopyTo($response.OutputStream)
                    } finally {
                        $stream.Dispose()
                    }
                }
            } else {
                $response.StatusCode = 404
                $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
                $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
            }
        } catch {
            Write-Warning "Error serving request: $_"
        } finally {
            try { $context.Response.OutputStream.Close() } catch {}
        }
    }
} finally {
    $listener.Stop()
}
