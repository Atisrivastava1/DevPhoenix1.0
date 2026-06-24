const parser = require('@babel/parser');
const fs = require('fs');

const code = fs.readFileSync('src/app/page.tsx', 'utf-8');
try {
  parser.parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript']
  });
  console.log("Parsed successfully by Babel!");
} catch (e) {
  console.error("Babel error:", e.message);
  console.error("Line:", e.loc.line, "Col:", e.loc.column);
}
