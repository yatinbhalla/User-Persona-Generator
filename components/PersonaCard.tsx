import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { GeneratedPersona } from '../types';

interface PersonaCardProps {
  data: GeneratedPersona;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ data }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `persona-${data.name.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExportImage = async () => {
    if (!cardRef.current) return;
    
    setIsExporting(true);
    try {
      // Small delay to ensure any rendering is complete
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(cardRef.current, {
        useCORS: true,
        backgroundColor: '#1e293b', // Match bg-slate-800 for cleaner edges
        scale: 2, // Higher resolution
        logging: false,
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `persona-${data.name.replace(/\s+/g, '-').toLowerCase()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting image:', error);
      alert('Failed to export image.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 animate-fade-in">
      {/* Capture Target */}
      <div 
        ref={cardRef} 
        className="bg-slate-800 rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700 flex flex-col md:flex-row gap-8 items-center md:items-start"
      >
        <div className="flex-shrink-0 w-48 h-48 md:w-64 md:h-64 relative">
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 rounded-full"></div>
          <img
            src={data.imageUrl}
            alt={data.name}
            crossOrigin="anonymous" 
            className="relative w-full h-full object-cover rounded-xl shadow-2xl border-2 border-slate-600/50"
          />
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-1">{data.name}</h2>
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Target Persona
            </div>
          </div>
          
          <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide">Bio</h3>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
              {data.bio}
              </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row justify-end gap-3">
        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-lg transition-colors shadow-sm"
          title="Export as JSON"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M10 13l-2 2 2 2"/><path d="M14 17l2-2-2-2"/></svg>
          Export JSON
        </button>

        <button
          onClick={handleExportImage}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title="Download Card Image"
        >
           {isExporting ? (
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          )}
          Download Image
        </button>
      </div>
    </div>
  );
};

export default PersonaCard;