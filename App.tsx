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
    ageRange: '',
    occupation: '',
    location: '',
    incomeLevel: '',
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
      let personaText;
      try {
        personaText = await generatePersonaText(formData);
      } catch (err: any) {
        console.error("Text Generation Error:", err);
        throw new Error(`Text Gen Failed: ${err.message}`);
      }
      
      // Step 2: Generate Image based on visual description
      let imageUrl;
      try {
        imageUrl = await generatePersonaImage(personaText.visualDescription);
      } catch (err: any) {
        console.error("Image Generation Error:", err);
        // Don't fail the whole persona if only image fails
        imageUrl = "https://picsum.photos/400/400";
      }

      // Combine results
      setGeneratedPersona({
        ...personaText,
        imageUrl,
      });
    } catch (err: any) {
      console.error(err);
      const errorMessage = err.message || '';
      if (errorMessage.includes('PERMISSION_DENIED') || errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('GEMINI_API_KEY is not defined')) {
        setError(`API Error: ${errorMessage}. Please check your Gemini API key in Settings > Secrets.`);
      } else if (errorMessage.includes('RESOURCE_EXHAUSTED')) {
        setError("Quota Exceeded: You've reached your API limit. Please wait a moment or check your billing status.");
      } else {
        setError(`Failed to generate persona: ${errorMessage}`);
      }
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
        <div className="w-full max-w-2xl bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 shadow-2xl">
          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
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
              </div>

              <div className="space-y-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Persona Details (Optional)</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="ageRange"
                    name="ageRange"
                    label="Age Range"
                    placeholder="e.g. 25-35"
                    value={formData.ageRange}
                    onChange={handleInputChange}
                  />
                  <Input
                    id="occupation"
                    name="occupation"
                    label="Occupation"
                    placeholder="e.g. Designer"
                    value={formData.occupation}
                    onChange={handleInputChange}
                  />
                </div>

                <Input
                  id="location"
                  name="location"
                  label="Location"
                  placeholder="e.g. New York, USA"
                  value={formData.location}
                  onChange={handleInputChange}
                />

                <Input
                  id="incomeLevel"
                  name="incomeLevel"
                  label="Income Level"
                  placeholder="e.g. $60k - $80k"
                  value={formData.incomeLevel}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <Button type="submit" isLoading={isLoading}>
              Generate Detailed Persona
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
          <div className="w-full animate-fade-in-up overflow-x-auto pb-8">
             <div className="min-w-[1000px] lg:min-w-0">
               <PersonaCard data={generatedPersona} />
             </div>
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