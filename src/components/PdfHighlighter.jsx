import { useState, useRef, useEffect } from 'react';
import { PlusCircle, Trash2, Copy, Download, Sun, Moon, ChevronRight } from 'lucide-react';

export function PdfHighlighter() {
  const [highlights, setHighlights] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('Uncategorized');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pdfContainerRef = useRef(null);

  // Sample PDF text (replace with actual PDF rendering later)
  const sampleText = `three funds: one fund that is actively investing...`;

  // Predefined categories with colors
  const categories = [
    { name: 'Uncategorized', color: 'bg-yellow-200 dark:bg-yellow-300/60' },
    { name: 'Important', color: 'bg-red-200 dark:bg-red-300/60' },
    { name: 'Review', color: 'bg-blue-200 dark:bg-blue-300/60' },
    { name: 'Question', color: 'bg-green-200 dark:bg-green-300/60' },
    { name: 'Note', color: 'bg-purple-200 dark:bg-purple-300/60' }
  ];

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection.toString().trim()) return;

    const range = selection.getRangeAt(0);
    const containerRect = pdfContainerRef.current.getBoundingClientRect();
    const rangeRect = range.getBoundingClientRect();

    const category = categories.find(c => c.name === currentCategory);

    setHighlights([...highlights, {
      id: Date.now(),
      text: selection.toString(),
      position: {
        top: rangeRect.top - containerRect.top,
        left: rangeRect.left - containerRect.left,
        width: rangeRect.width,
        height: rangeRect.height
      },
      category: currentCategory,
      color: category.color
    }]);

    selection.removeAllRanges();
  };

  const clearHighlights = () => setHighlights([]);
  
  const copyHighlightsToClipboard = () => {
    const text = highlights.map(h => `${h.category}: "${h.text}"`).join('\n\n');
    navigator.clipboard.writeText(text);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply dark mode
  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  const deleteHighlight = (id) => {
    setHighlights(highlights.filter(highlight => highlight.id !== id));
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Highlighted Text</h2>
        </div>
        
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Highlight category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setCurrentCategory(category.name)}
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  currentCategory === category.name 
                    ? 'ring-2 ring-blue-500 dark:ring-blue-400' 
                    : ''
                } ${category.color.split(' ')[0]}`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {highlights.length > 0 ? (
            <div className="space-y-4">
              {highlights.map(highlight => (
                <div 
                  key={highlight.id} 
                  className="p-3 rounded-lg bg-white dark:bg-gray-700 shadow-sm group hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${highlight.color}`}>
                      {highlight.category}
                    </span>
                    <button 
                      onClick={() => deleteHighlight(highlight.id)}
                      className="text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">"{highlight.text}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 dark:text-gray-400 text-sm italic">No highlights yet</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex gap-2">
            <button 
              onClick={clearHighlights}
              disabled={highlights.length === 0}
              className="flex-1 px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Trash2 size={16} /> Clear All
            </button>
            <button 
              onClick={copyHighlightsToClipboard}
              disabled={highlights.length === 0}
              className="flex-1 px-4 py-2 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Copy size={16} /> Copy
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm z-10">
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ChevronRight size={20} className={`transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
              </button>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">PDF Text Highlighter</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={handleHighlight}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <PlusCircle size={16} />
                Highlight Selection
              </button>
              <button 
                className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 text-sm font-medium"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <div 
              ref={pdfContainerRef}
              className="relative p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm min-h-[700px] whitespace-pre-wrap text-gray-800 dark:text-gray-200"
            >
              {sampleText}
              {highlights.map(highlight => (
                <div 
                  key={highlight.id}
                  className={`absolute pointer-events-none ${highlight.color}`}
                  style={{
                    top: `${highlight.position.top}px`,
                    left: `${highlight.position.left}px`,
                    width: `${highlight.position.width}px`,
                    height: `${highlight.position.height}px`
                  }}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PdfHighlighter;