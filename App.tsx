import React, { useState } from 'react';
import Input from './components/Input';
import Button from './components/Button';
import PersonaCard from './components/PersonaCard';
import { generatePersonaText, generatePersonaImage } from './services/gemini';
import { GeneratedPersona, PersonaInput } from './types';

const App: React.FC = () => {
  const [formData, setFormData] = useState<PersonaInput>({
    targetMarket: '',
    mainGoal: '',
    biggestFrustration: '',
  });
  
  const [generatedPersona, setGeneratedPersona] = useState<GeneratedPersona | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setGeneratedPersona(null);

    try {
      // Step 1: Generate Text (Name & Bio)
      const personaText = await generatePersonaText(formData);
      
      // Step 2: Generate Image based on visual description
      const imageUrl = await generatePersonaImage(personaText.visualDescription);

      // Combine results
      setGeneratedPersona({
        ...personaText,
        imageUrl,
      });
    } catch (err: any) {
      console.error(err);
      setError("Failed to generate persona. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30">
      
      {/* Header Background Effect */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-900/20 to-transparent -z-10 pointer-events-none" />

      <main className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center gap-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            PersonaGen AI
          </h1>
          <p className="text-lg text-slate-400">
            Instantly create detailed user personas with unique AI-generated avatars.
            Refine your marketing strategy in seconds.
          </p>
        </div>

        {/* Form */}
        <div className="w-full max-w-md bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleGenerate} className="space-y-6">
            <Input
              id="targetMarket"
              name="targetMarket"
              label="Target Market"
              placeholder="e.g. Freelance Graphic Designers"
              value={formData.targetMarket}
              onChange={handleInputChange}
              required
            />
            
            <Input
              id="mainGoal"
              name="mainGoal"
              label="Main Goal"
              placeholder="e.g. Increase recurring monthly revenue"
              value={formData.mainGoal}
              onChange={handleInputChange}
              required
            />
            
            <Input
              id="biggestFrustration"
              name="biggestFrustration"
              label="Biggest Frustration"
              placeholder="e.g. Inconsistent client acquisition"
              value={formData.biggestFrustration}
              onChange={handleInputChange}
              required
            />

            <Button type="submit" isLoading={isLoading}>
              Generate Persona
            </Button>
          </form>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {generatedPersona && (
          <div className="w-full animate-fade-in-up">
             <PersonaCard data={generatedPersona} />
          </div>
        )}

      </main>
      
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;