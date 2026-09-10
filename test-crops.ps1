Add-Type -AssemblyName System.Drawing

$img4 = [System.Drawing.Bitmap]::FromFile("assets\images\test_4.jpg")
Write-Host "test_4: $($img4.Width) x $($img4.Height)"
# Toilet is on right side
$rect4 = New-Object System.Drawing.Rectangle(630, 440, 160, 200)
$crop4 = New-Object System.Drawing.Bitmap($rect4.Width, $rect4.Height)
$g4 = [System.Drawing.Graphics]::FromImage($crop4)
$g4.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g4.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g4.DrawImage($img4, (New-Object System.Drawing.Rectangle(0, 0, $rect4.Width, $rect4.Height)), $rect4, [System.Drawing.GraphicsUnit]::Pixel)
$g4.Dispose()
$img4.Dispose()
$crop4.Save("assets\images\crop_floor_test4.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop4.Dispose()

$img5 = [System.Drawing.Bitmap]::FromFile("assets\images\test_5.jpg")
Write-Host "test_5: $($img5.Width) x $($img5.Height)"
# Toilet is in bottom center around y=950-1300, x=380-640
$rect5 = New-Object System.Drawing.Rectangle(380, 950, 260, 300)
$crop5 = New-Object System.Drawing.Bitmap($rect5.Width, $rect5.Height)
$g5 = [System.Drawing.Graphics]::FromImage($crop5)
$g5.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g5.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g5.DrawImage($img5, (New-Object System.Drawing.Rectangle(0, 0, $rect5.Width, $rect5.Height)), $rect5, [System.Drawing.GraphicsUnit]::Pixel)
$g5.Dispose()
$img5.Dispose()
$crop5.Save("assets\images\crop_wall_test5_correct.jpg", [System.Drawing.Imaging.ImageFormat]::Jpeg)
$crop5.Dispose()
