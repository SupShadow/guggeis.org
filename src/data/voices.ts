export type Voice = {
  quote: string;
  name: string;
  role?: string;
};

// Add real quotes here before enabling public display.
export const voices: Voice[] = [];

// Optional: set a real number once verified.
export const supporterCount: number | null = null;
