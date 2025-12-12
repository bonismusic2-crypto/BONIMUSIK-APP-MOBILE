Add-Type -AssemblyName System.Drawing
$source = "C:\Users\User\.gemini\antigravity\brain\c72ebdc5-d59c-4835-9c61-33a5dadfd22b\listener_app_icon_1765464192633.png"
$dest = "C:\Users\User\.gemini\antigravity\brain\c72ebdc5-d59c-4835-9c61-33a5dadfd22b\fixed_icon.png"

try {
    $img = [System.Drawing.Image]::FromFile($source)
    $img.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $img.Dispose()
    Write-Host "Success: Converted to $dest"
} catch {
    Write-Error "Failed to convert: $_"
    exit 1
}
