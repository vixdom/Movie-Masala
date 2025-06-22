export interface WordListItem {
  word: string;
  category: 'movie' | 'actor' | 'actress' | 'director' | 'song';
  hint?: string;
}

export const bollywoodWords: WordListItem[] = [
  // Bollywood Actors - Authentic Full Names (correctly spelled)
  { word: 'SHAHRUKHKHAN', category: 'actor', hint: 'King Khan' },
  { word: 'SALMANKHAN', category: 'actor', hint: 'Bhai of Bollywood' },
  { word: 'AAMIRKHAN', category: 'actor', hint: 'Mr. Perfectionist' },
  { word: 'AMITABHBACH', category: 'actor', hint: 'Big B of Bollywood' },
  { word: 'AKSHAYKUMAR', category: 'actor', hint: 'Khiladi Kumar' },
  { word: 'RANBIRKAPOOR', category: 'actor', hint: 'Kapoor family heir' },
  { word: 'RANVEERSINGH', category: 'actor', hint: 'Energy powerhouse' },
  { word: 'RAJESHKHANNA', category: 'actor', hint: 'First superstar' },
  { word: 'DILIPKUMAR', category: 'actor', hint: 'Tragedy King' },
  { word: 'IRRFANKHAN', category: 'actor', hint: 'Method actor' },
  { word: 'ARJUNKAPOOR', category: 'actor', hint: 'Second generation' },
  { word: 'VARUNDHAWAN', category: 'actor', hint: 'Comedy specialist' },
  { word: 'TIGERSHROFF', category: 'actor', hint: 'Action star' },
  { word: 'VICKYKAUSHAL', category: 'actor', hint: 'Uri actor' },
  { word: 'KARTIKAARYAN', category: 'actor', hint: 'Comedy king' },
  { word: 'RAJKUMMARRAO', category: 'actor', hint: 'Character specialist' },
  { word: 'SHAHIDKAPOOR', category: 'actor', hint: 'Chocolate boy' },
  { word: 'RISHIKAPOOR', category: 'actor', hint: 'Veteran actor' },
  { word: 'SUNILSHETTY', category: 'actor', hint: 'Action hero' },
  { word: 'HRITHIKROSH', category: 'actor', hint: 'Greek God of Bollywood' }
];

// Function to get a random subset of words for the game
export function getGameWords(count: number = 15): WordListItem[] {
  // For 10x10 grid, we can accommodate words up to 10 characters in straight lines
  // and up to √(10²+10²) ≈ 14 characters diagonally, but keep it simple at 12 for reliability
  const fittableWords = bollywoodWords.filter(word => word.word.length <= 12);
  const shuffled = [...fittableWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Function to get words by category
export function getWordsByCategory(category: WordListItem['category']): WordListItem[] {
  return bollywoodWords.filter(item => item.category === category);
}
