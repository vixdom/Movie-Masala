export interface WordListItem {
  word: string;
  category: 'movie' | 'actor' | 'actress' | 'director' | 'song';
  hint?: string;
}

// Complete pool of Bollywood Actor Names (optimized for 12x12 grid)
const allActors: WordListItem[] = [
  { word: 'SHAHRUKHKHAN', category: 'actor', hint: 'King Khan' },
  { word: 'SALMANKHAN', category: 'actor', hint: 'Bhai of Bollywood' },
  { word: 'AAMIRKHAN', category: 'actor', hint: 'Mr. Perfectionist' },
  { word: 'AKSHAYKUMAR', category: 'actor', hint: 'Khiladi Kumar' },
  { word: 'RANBIRKAPOOR', category: 'actor', hint: 'Kapoor heir' },
  { word: 'RANVEERSINGH', category: 'actor', hint: 'Energy powerhouse' },
  { word: 'RAJESHKHANNA', category: 'actor', hint: 'First superstar' },
  { word: 'DILIPKUMAR', category: 'actor', hint: 'Tragedy King' },
  { word: 'IRRFANKHAN', category: 'actor', hint: 'Method actor' },
  { word: 'ARJUNKAPOOR', category: 'actor', hint: 'Second generation' },
  { word: 'VARUNDHAWAN', category: 'actor', hint: 'Comedy specialist' },
  { word: 'TIGERSHROFF', category: 'actor', hint: 'Action star' },
  { word: 'VICKYKAUSHAL', category: 'actor', hint: 'Uri actor' },
  { word: 'SHAHIDKAPOOR', category: 'actor', hint: 'Chocolate boy' },
  { word: 'RISHIKAPOOR', category: 'actor', hint: 'Veteran actor' },
  { word: 'SUNILSHETTY', category: 'actor', hint: 'Action hero' },
  { word: 'AYUSHMANN', category: 'actor', hint: 'Versatile performer' },
  { word: 'NAWAZUDDIN', category: 'actor', hint: 'Character actor' },
  { word: 'ABHISHEK', category: 'actor', hint: 'Junior Bachchan' },
  { word: 'GOVINDA', category: 'actor', hint: 'Comedy legend' }
];

export const bollywoodWords: WordListItem[] = allActors;

// Function to get randomized selection of actors for the game
export function getGameWords(count: number = 10): WordListItem[] {
  // Create a shuffled copy and select the first 'count' items
  const shuffled = [...allActors].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Function to get words by category
export function getWordsByCategory(category: WordListItem['category']): WordListItem[] {
  return bollywoodWords.filter(item => item.category === category);
}
