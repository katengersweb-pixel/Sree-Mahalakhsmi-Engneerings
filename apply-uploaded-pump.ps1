Add-Type -AssemblyName System.Drawing

$srcFile = "C:\Users\maddi\.gemini\antigravity-ide\brain\559120cc-8d9a-4c3d-81ff-8035f5fc722b\.user_uploaded\media_1788930716711.png"
$outFile = "c:\Users\maddi\.gemini\antigravity-ide\scratch\white-volunteers-foundation\assets\images\product-borewell-submersible-pump.png"

$src = [System.Drawing.Bitmap]::FromFile($srcFile)
Write-Host "Uploaded pump image size: $($src.Width) x $($src.Height)"

# Find tight bounding box of pump object (ignoring pure white borders)
$minX = $src.Width
$maxX = 0
$minY = $src.Height
$maxY = 0

for ($y = 0; $y -lt $src.Height; $y++) {
    for ($x = 0; $x -lt $src.Width; $x++) {
        $c = $src.GetPixel($x, $y)
        # Check non-white pixels (R,G,B not all > 250)
        if ($c.A -gt 10 -and ($c.R -lt 250 -or $c.G -lt 250 -or $c.B -lt 250)) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

Write-Host "Bounding box: minX=$minX, maxX=$maxX, minY=$minY, maxY=$maxY"

$cropW = ($maxX - $minX) + 1
$cropH = ($maxY - $minY) + 1

$crop = New-Object System.Drawing.Bitmap($cropW, $cropH)
$gCrop = [System.Drawing.Graphics]::FromImage($crop)
$gCrop.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gCrop.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$gCrop.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$gCrop.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)), (New-Object System.Drawing.Rectangle($minX, $minY, $cropW, $cropH)), [System.Drawing.GraphicsUnit]::Pixel)
$gCrop.Dispose()
$src.Dispose()

# Create 800x800 square canvas
$canvas = New-Object System.Drawing.Bitmap(800, 800)
$g = [System.Drawing.Graphics]::FromImage($canvas)
$g.Clear([System.Drawing.Color]::White)
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

# Scale pump vertically to fit ~720px height inside 800px canvas
$scale = 720.0 / $cropH
$drawW = [int]($cropW * $scale)
$drawH = 720
$drawX = [int]((800 - $drawW) / 2)
$drawY = [int]((800 - $drawH) / 2)

$g.DrawImage($crop, (New-Object System.Drawing.Rectangle($drawX, $drawY, $drawW, $drawH)), (New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)), [System.Drawing.GraphicsUnit]::Pixel)

$g.Dispose()
$crop.Dispose()

$canvas.Save($outFile, [System.Drawing.Imaging.ImageFormat]::Png)
$canvas.Dispose()

Write-Host "SUCCESS: Processed and saved exact user-provided C.R.I. Borewell Submersible Pump image to $outFile"
