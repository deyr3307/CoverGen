const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  'const [scale, setScale] = useState(1);',
  'const [scale, setScale] = useState(1);\n  const [zoomMode, setZoomMode] = useState<\'fit\' | \'manual\'>(\'fit\');\n  const [manualZoom, setManualZoom] = useState<number>(1);'
);

fs.writeFileSync('src/App.tsx', content);
