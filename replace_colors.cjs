const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const replacements = [
  {from: /bg-\[#060B14\]/g, to: 'bg-bg-main'},
  {from: /bg-\[#02050A\]/g, to: 'bg-bg-main'},
  {from: /text-white\/90/g, to: 'text-text-primary'},
  {from: /text-white\/70/g, to: 'text-text-secondary'},
  {from: /text-white\/50/g, to: 'text-text-secondary'},
  {from: /text-white\/40/g, to: 'text-text-muted'},
  {from: /text-white\/30/g, to: 'text-text-muted'},
  {from: /text-white/g, to: 'text-text-primary'},
  {from: /border-white\/5/g, to: 'border-border-subtle'},
  {from: /border-white\/10/g, to: 'border-border-strong'},
  {from: /bg-\[#1E293B\]/g, to: 'bg-bg-button'},
  {from: /hover:bg-\[#1a2333\]/g, to: 'hover:bg-bg-button-hover'},
  {from: /hover:bg-\[#2a3850\]/g, to: 'hover:bg-bg-button-hover'},
  {from: /bg-\[#0A0F1C\]/g, to: 'bg-bg-panel'},
  {from: /hover:bg-\[#0D1425\]/g, to: 'hover:bg-bg-hover'},
  {from: /bg-\[#121826\]/g, to: 'bg-bg-input'},
  {from: /bg-\[#1e293b\]/g, to: 'bg-bg-button'},
  {from: /border-\[#334155\]/g, to: 'border-border-strong'},
  {from: /bg-white\/5/g, to: 'bg-bg-hover'},
  {from: /hover:bg-white\/5/g, to: 'hover:bg-bg-hover'},
  {from: /bg-white\/10/g, to: 'bg-bg-button'},
  {from: /hover:bg-white\/10/g, to: 'hover:bg-bg-button-hover'},
  {from: /hover:bg-white\/20/g, to: 'hover:bg-bg-button-hover'},
];

replacements.forEach(({from, to}) => {
  content = content.replace(from, to);
});

// Since we replaced text-white indiscriminately, let's make sure it didn't mess up logo color overrides if any.
// 'bg-gradient-to-tr from-orange-400 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg' doesn't use text-white in bg

fs.writeFileSync('src/App.tsx', content);
console.log('Done replacing colors.');
