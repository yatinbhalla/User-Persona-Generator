export interface PersonaData {
  name: string;
  bio: string;
  visualDescription: string;
}

export interface GeneratedPersona extends PersonaData {
  imageUrl: string;
}

export interface PersonaInput {
  targetMarket: string;
  mainGoal: string;
  biggestFrustration: string;
}