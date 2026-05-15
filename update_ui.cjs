const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  '<div className="hidden md:flex flex-1 bg-bg-main overflow-y-auto p-4 md:p-10 justify-center items-start custom-scrollbar relative">',
  '<div className="hidden md:flex flex-1 bg-bg-main overflow-auto p-4 md:p-10 justify-center items-start custom-scrollbar relative">'
);

content = content.replace(
  '<div className="w-full max-w-[800px] z-10 mx-auto flex flex-col items-center">',
  '<div className="w-full z-10 mx-auto flex flex-col items-center" style={{ minWidth: zoomMode === \'manual\' ? `${794 * manualZoom}px` : \'auto\' }}>'
);

content = content.replace(
  '<div className="w-full flex flex-col sm:flex-row items-center justify-between mb-5 px-4 py-3 bg-bg-button border border-border-strong rounded-2xl shadow-xl">',
  '<div className="w-full flex flex-col sm:flex-row items-center justify-between mb-5 px-4 py-3 bg-bg-button border border-border-strong rounded-2xl shadow-xl" style={{ maxWidth: \'800px\' }}>'
);

content = content.replace(
  '<div className="flex items-center text-text-primary text-sm font-medium mb-3 sm:mb-0">\n                <Eye size={16} className="mr-2 text-blue-400" /> Live Canvas View\n                <button onClick={() => setPreviewMode(true)} className="ml-4 px-2 py-1 bg-bg-button hover:bg-bg-button-hover rounded text-xs transition-colors border border-border-strong">Full Preview</button>\n              </div>',
  `<div className="flex items-center text-text-primary text-sm font-medium mb-3 sm:mb-0">
                <Eye size={16} className="mr-2 text-blue-400" /> Live Canvas View
                <button onClick={() => setPreviewMode(true)} className="ml-4 px-2 py-1 bg-bg-button hover:bg-bg-button-hover rounded text-xs transition-colors border border-border-strong">Full Preview</button>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center gap-1 bg-white dark:bg-bg-input border border-border-strong rounded-lg px-2 py-1">
                 <button onClick={() => { setZoomMode('manual'); setManualZoom(z => Math.max(0.5, z - 0.25)); }} className="px-2 py-0.5 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors">-</button>
                 <select 
                    value={zoomMode === 'fit' ? 'fit' : manualZoom} 
                    onChange={(e) => {
                       const v = e.target.value;
                       if (v === 'fit') setZoomMode('fit');
                       else { setZoomMode('manual'); setManualZoom(Number(v)); }
                    }}
                    className="bg-transparent border-none text-xs font-medium outline-none text-center cursor-pointer text-text-primary"
                 >
                    <option value="fit" className="text-black bg-white">Fit</option>
                    <option value="0.5" className="text-black bg-white">50%</option>
                    <option value="0.75" className="text-black bg-white">75%</option>
                    <option value="1" className="text-black bg-white">100%</option>
                    <option value="1.25" className="text-black bg-white">125%</option>
                    <option value="1.5" className="text-black bg-white">150%</option>
                    <option value="2" className="text-black bg-white">200%</option>
                 </select>
                 <button onClick={() => { setZoomMode('manual'); setManualZoom(z => Math.min(3, z + 0.25)); }} className="px-2 py-0.5 text-xs font-bold hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors">+</button>
              </div>`
);

content = content.replace(
  '<div ref={containerRef} className="w-full aspect-[1/1.414] relative bg-white shadow-2xl shadow-black/50 overflow-hidden rounded-sm transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">',
  '<div ref={containerRef} className={zoomMode === \'fit\' ? "w-full max-w-[800px] aspect-[1/1.414] relative bg-white shadow-2xl shadow-black/50 overflow-hidden rounded-sm transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]" : "relative bg-white shadow-2xl shadow-black/50 overflow-hidden rounded-sm transition-shadow hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"} style={zoomMode === \'manual\' ? { width: \`\${794 * manualZoom}px\`, height: \`\${1123 * manualZoom}px\` } : {}}>'
);

content = content.replace(
  `              style={{
                transform: \`scale(\${scale})\`,
                width: '794px',
                height: '1123px'
              }}`,
  `              style={{
                transform: \`scale(\${zoomMode === 'fit' ? scale : manualZoom})\`,
                width: '794px',
                height: '1123px'
              }}`
);

fs.writeFileSync('src/App.tsx', content);
