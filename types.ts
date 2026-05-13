export interface PersonaData {
  name: string;
  age: number;
  occupation: string;
  location: string;
  education: string;
  monthlyIncome: string;
  family: string;
  tagline: string;
  quote: string;
  about: string;
  behaviorAndMindset: string[];
  goalsAndAspirations: string[];
  painPoints: string[];
  digitalUsage: { label: string; percentage: number; color: string }[];
  financialBehavior: string[];
  incomeAndExpense: { 
    totalIncome: string; 
    totalExpenses: string;
    details: string;
  };
  preferredSupport: string[];
  howHelp: string[];
  marketSize: string;
  visualDescription: string;
}

export interface GeneratedPersona extends PersonaData {
  imageUrl: string;
}

export interface PersonaInput {
  targetMarket: string;
  mainGoal: string;
  biggestFrustration: string;
  ageRange?: string;
  occupation?: string;
  location?: string;
  incomeLevel?: string;
}