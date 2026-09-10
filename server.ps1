$port = 8080
$folder = "C:\Users\maddi\.gemini\antigravity-ide\scratch\white-volunteers-foundation"

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "Server running at http://localhost:$port/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response

    $urlPath = $request.Url.LocalPath.TrimStart('/')
    if ([string]::IsNullOrEmpty($urlPath) -or $urlPath -eq "") {
        $urlPath = "index.html"
    }

    $filePath = Join-Path $folder $urlPath

    if (Test-Path $filePath -PathType Container) {
        $filePath = Join-Path $filePath "index.html"
    }

    if (Test-Path $filePath -PathType Leaf) {
        $bytes = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        
        switch ($ext) {
            ".html" { $response.ContentType = "text/html; charset=utf-8" }
            ".css"  { $response.ContentType = "text/css; charset=utf-8" }
            ".js"   { $response.ContentType = "application/javascript; charset=utf-8" }
            ".json" { $response.ContentType = "application/json" }
            ".png"  { $response.ContentType = "image/png" }
            ".jpg"  { $response.ContentType = "image/jpeg" }
            ".jpeg" { $response.ContentType = "image/jpeg" }
            ".webp" { $response.ContentType = "image/webp" }
            ".ico"  { $response.ContentType = "image/x-icon" }
            ".svg"  { $response.ContentType = "image/svg+xml" }
            ".woff2"{ $response.ContentType = "font/woff2" }
            ".woff" { $response.ContentType = "font/woff" }
            ".ttf"  { $response.ContentType = "font/ttf" }
            ".pdf"  { $response.ContentType = "application/pdf" }
            default { $response.ContentType = "application/octet-stream" }
        }

        $response.ContentLength64 = $bytes.Length
        try {
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } catch {}
    } else {
        $response.StatusCode = 404
        $msg = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found")
        $response.ContentLength64 = $msg.Length
        try {
            $response.OutputStream.Write($msg, 0, $msg.Length)
        } catch {}
    }

    try {
        $response.Close()
    } catch {}
}
