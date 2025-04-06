import { useState, useRef } from 'react';

export function PdfHighlighter() {
  const [highlights, setHighlights] = useState([]);
  const pdfContainerRef = useRef(null);

  // Sample PDF text (replace with actual PDF rendering later)
  const sampleText = `three funds: one fund that is actively investing...`;

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection.toString().trim()) return;

    const range = selection.getRangeAt(0);
    const containerRect = pdfContainerRef.current.getBoundingClientRect();
    const rangeRect = range.getBoundingClientRect();

    setHighlights([...highlights, {
      id: Date.now(),
      text: selection.toString(),
      position: {
        top: rangeRect.top - containerRect.top,
        left: rangeRect.left - containerRect.left,
        width: rangeRect.width,
        height: rangeRect.height
      }
    }]);

    selection.removeAllRanges();
  };

  const clearHighlights = () => setHighlights([]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">PDF Text Highlighter</h1>
        <div className="flex gap-2">
          <button 
            onClick={handleHighlight}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Highlight Selection
          </button>
          <button 
            onClick={clearHighlights}
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Clear Highlights
          </button>
        </div>
      </div>

      <div 
        ref={pdfContainerRef}
        className="relative p-6 bg-white border border-gray-200 rounded-lg shadow-sm min-h-[500px] whitespace-pre-wrap"
      >
        {sampleText}
        {highlights.map(highlight => (
          <div 
            key={highlight.id}
            className="absolute bg-yellow-200 opacity-70 pointer-events-none"
            style={{
              top: `${highlight.position.top}px`,
              left: `${highlight.position.left}px`,
              width: `${highlight.position.width}px`,
              height: `${highlight.position.height}px`
            }}
          />
        ))}
      </div>

      {highlights.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Highlighted Text</h2>
          <ul className="list-disc pl-5 space-y-1">
            {highlights.map(highlight => (
              <li key={highlight.id}>{highlight.text}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}