# Create Desktop Shortcut for Marketing System
# Run this once in PowerShell

$ShortcutPath = "$env:USERPROFILE\Desktop\Marketing System.lnk"
$WorkingDir = "$env:USERPROFILE\Desktop\marketing-system"

# Create shortcut that opens VS Code with this folder
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = "code"
$Shortcut.Arguments = "`"$WorkingDir`""
$Shortcut.WorkingDirectory = $WorkingDir
$Shortcut.Description = "Open Marketing System in VS Code"
$Shortcut.Save()

Write-Host "Done! Shortcut created on Desktop: 'Marketing System'" -ForegroundColor Green
