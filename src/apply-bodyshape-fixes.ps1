# apply-bodyshape-fixes.ps1
# Usage (from project root):  powershell -ExecutionPolicy Bypass -File .\apply-bodyshape-fixes.ps1

$ErrorActionPreference = 'Stop'

function Fix-File($Path) {
  $c = Get-Content $Path -Raw

  # 1) <a .../> <img .../> </a> -> <a ...><img .../></a>
  $c = $c -replace '<a\s+([^>]*href=\{href\([^)]*\)\}[^>]*)/>\s*(<img[\s\S]*?/>)\s*</a>', '<a $1>$2</a>'

  # 2) remove stray "/slug" right after href={href("...")}
  $c = $c -replace 'href=\{href\((["''][^"''"]+["''])\)\}\s*/\s*[A-Za-z0-9\-_]+', 'href={href($1)}'

  # 3) self-closing anchor -> normal opening
  $c = $c -replace '<a(\s+[^>]*?)\/>', '<a$1>'

  Set-Content -Path $Path -Value $c -NoNewline
  Write-Host "Patched $Path"
}

$targets = @(
  Join-Path -Path (Join-Path -Path $PSScriptRoot -ChildPath 'src') -ChildPath 'layouts'),
  Join-Path -Path (Join-Path -Path $PSScriptRoot -ChildPath 'src') -ChildPath 'components'),
  Join-Path -Path (Join-Path -Path $PSScriptRoot -ChildPath 'src') -ChildPath 'pages')
)

foreach ($dir in $targets) {
  if (Test-Path $dir) {
    $files = Get-ChildItem -Path $dir -Recurse -Include *.js,*.jsx,*.ts,*.tsx
    foreach ($f in $files) { Fix-File $f.FullName }
  }
}

Write-Host "✅ Finished applying anchor/href fixes."
