// apply-bodyshape-fixes.js
// Run from the project root (same folder as package.json):
//   node apply-bodyshape-fixes.js
// This script fixes invalid self-closing <a> tags and stray "/slug" after href={href("...")}

const fs = require('fs');
const path = require('path');

const targetRoot = path.join(__dirname, 'src');
const targets = ['layouts', 'components', 'pages'];

// Recursively walk a directory
function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/(jsx?|tsx?)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

function fixFile(file) {
  let before = fs.readFileSync(file, 'utf8');
  let c = before;

  // 1) <a ...> <img .../> </a>  ->  <a ...><img .../></a>
  c = c.replace(/<a\s+([^>]*href=\{href\([^)]*\)\}[^>]*)\/>\s*(<img[\s\S]*?\/>)\s*<\/a>/g, '<a $1>$2</a>');

  // 2) stray "/slug" immediately after href attribute
  c = c.replace(/href=\{href\((["'][^"']+["'])\)\}\s*\/\s*[A-Za-z0-9\-_]+/g, 'href={href($1)}');

  // 3) convert self-closing anchor to normal opening tag
  c = c.replace(/<a(\s+[^>]*?)\/>/g, '<a$1>');

  if (c !== before) {
    fs.writeFileSync(file, c);
    console.log('patched', path.relative(process.cwd(), file));
    return true;
  } else {
    return false;
  }
}

let total = 0;
for (const dir of targets) {
  const full = path.join(targetRoot, dir);
  for (const f of walk(full)) {
    if (/Footer|Header|footer|header/.test(path.basename(f)) || /layouts/.test(f)) {
      if (fixFile(f)) total++;
    } else {
      if (fixFile(f)) total++;
    }
  }
}

console.log(`✅ Finished. Files modified: ${total}`);
if (total === 0) {
  console.log('No matching issues were found. If errors persist, please share the exact error and line number.');
}


