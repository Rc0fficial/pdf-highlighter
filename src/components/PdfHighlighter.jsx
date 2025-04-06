import { useState, useRef } from 'react';
import { PlusCircle, Trash2, Copy, Download, Sun, Moon, ChevronRight } from 'lucide-react';

export function PdfHighlighter() {
  const [highlights, setHighlights] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('Uncategorized');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pdfContainerRef = useRef(null);

  // Sample PDF text (replace with actual PDF rendering later)
  const sampleText = `three funds: one fund that is actively investing...`;

  // Define colors with actual CSS values instead of Tailwind classes
  const categories = [
    { 
      name: 'Uncategorized', 
      lightColor: 'rgba(254, 240, 138, 0.6)', 
      darkColor: 'rgba(253, 224, 71, 0.4)',
      buttonColor: 'rgba(254, 240, 138, 0.9)',
      darkButtonColor: 'rgba(253, 224, 71, 0.7)'
    },
    { 
      name: 'Important', 
      lightColor: 'rgba(254, 202, 202, 0.6)', 
      darkColor: 'rgba(252, 165, 165, 0.4)',
      buttonColor: 'rgba(254, 202, 202, 0.9)',
      darkButtonColor: 'rgba(252, 165, 165, 0.7)'
    },
    { 
      name: 'Review', 
      lightColor: 'rgba(191, 219, 254, 0.6)', 
      darkColor: 'rgba(147, 197, 253, 0.4)',
      buttonColor: 'rgba(191, 219, 254, 0.9)',
      darkButtonColor: 'rgba(147, 197, 253, 0.7)'
    },
    { 
      name: 'Question', 
      lightColor: 'rgba(187, 247, 208, 0.6)', 
      darkColor: 'rgba(134, 239, 172, 0.4)',
      buttonColor: 'rgba(187, 247, 208, 0.9)',
      darkButtonColor: 'rgba(134, 239, 172, 0.7)'
    },
    { 
      name: 'Note', 
      lightColor: 'rgba(233, 213, 255, 0.6)', 
      darkColor: 'rgba(216, 180, 254, 0.4)',
      buttonColor: 'rgba(233, 213, 255, 0.9)',
      darkButtonColor: 'rgba(216, 180, 254, 0.7)'
    }
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
      lightColor: category.lightColor,
      darkColor: category.darkColor
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

  const deleteHighlight = (id) => {
    setHighlights(highlights.filter(highlight => highlight.id !== id));
  };

  // Get button style based on category
  const getCategoryButtonStyle = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    const isSelected = currentCategory === categoryName;
    
    return {
      backgroundColor: isDarkMode ? category.darkButtonColor : category.buttonColor,
      border: isSelected ? '2px solid #3b82f6' : '1px solid #e5e7eb',
      color: isDarkMode ? '#1f2937' : '#1f2937',
      fontWeight: isSelected ? '600' : '500'
    };
  };

  // Get badge style in sidebar
  const getCategoryBadgeStyle = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return {
      backgroundColor: isDarkMode ? category.darkButtonColor : category.buttonColor,
      color: '#1f2937'
    };
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r overflow-hidden flex flex-col`}>
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h2 className="text-lg font-semibold">Highlighted Text</h2>
        </div>
        
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Highlight category</p>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setCurrentCategory(category.name)}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={getCategoryButtonStyle(category.name)}
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
                  className={`p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm group hover:shadow-md transition-shadow`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={getCategoryBadgeStyle(highlight.category)}
                    >
                      {highlight.category}
                    </span>
                    <button 
                      onClick={() => deleteHighlight(highlight.id)}
                      className={`${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-500'}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>"{highlight.text}"</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-sm italic`}>No highlights yet</p>
            </div>
          )}
        </div>
        
        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex gap-2">
            <button 
              onClick={clearHighlights}
              disabled={highlights.length === 0}
              className={`flex-1 px-4 py-2 text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              } border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              <Trash2 size={16} /> Clear All
            </button>
            <button 
              onClick={copyHighlightsToClipboard}
              disabled={highlights.length === 0}
              className={`flex-1 px-4 py-2 text-sm ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              } border rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              <Copy size={16} /> Copy
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b shadow-sm z-10`}>
          <div className="flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <ChevronRight size={20} className={`transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} />
              </button>
              <h1 className="text-xl font-bold">PDF Text Highlighter</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-full ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400' 
                    : 'hover:bg-gray-100 text-gray-500'
                }`}
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
                className={`px-4 py-2 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600' 
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                } border rounded-lg shadow-sm transition-colors flex items-center gap-2 text-sm font-medium`}
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
              className={`relative p-8 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700 text-gray-200' 
                  : 'bg-white border-gray-200 text-gray-800'
              } border rounded-lg shadow-sm min-h-[700px] whitespace-pre-wrap`}
            >
              {sampleText}
              
              {/* Rendering highlights with z-index below text */}
              {highlights.map(highlight => (
                <div 
                  key={highlight.id}
                  className="absolute pointer-events-none"
                  style={{
                    top: `${highlight.position.top}px`,
                    left: `${highlight.position.left}px`,
                    width: `${highlight.position.width}px`,
                    height: `${highlight.position.height}px`,
                    zIndex: 1,
                    backgroundColor: isDarkMode ? highlight.darkColor : highlight.lightColor,
                    mixBlendMode: isDarkMode ? 'screen' : 'multiply'
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