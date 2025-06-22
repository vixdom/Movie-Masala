export interface WordListItem {
  word: string;
  category: 'movie' | 'actor' | 'actress' | 'director' | 'song';
  hint?: string;
}

// Selected 10 Bollywood Actor Names with authentic spellings
const selectedActors: WordListItem[] = [
  { word: 'SHAHRUKHKHAN', category: 'actor', hint: 'King Khan' },           // 12 chars
  { word: 'AMITABHBACHCHAN', category: 'actor', hint: 'Big B' },            // 15 chars
  { word: 'SALMANKHAN', category: 'actor', hint: 'Bhai of Bollywood' },     // 10 chars
  { word: 'AAMIRKHAN', category: 'actor', hint: 'Mr. Perfectionist' },      // 9 chars
  { word: 'AKSHAYKUMAR', category: 'actor', hint: 'Khiladi Kumar' },        // 11 chars
  { word: 'RANBIRKAPOOR', category: 'actor', hint: 'Kapoor heir' },         // 12 chars
  { word: 'HRITHIKROSHAN', category: 'actor', hint: 'Greek God' },          // 13 chars
  { word: 'RANVEERSINGH', category: 'actor', hint: 'Energy powerhouse' },   // 12 chars
  { word: 'RAJESHKHANNA', category: 'actor', hint: 'First superstar' },     // 12 chars
  { word: 'DILIPKUMAR', category: 'actor', hint: 'Tragedy King' }           // 10 chars
];

export const bollywoodWords: WordListItem[] = selectedActors;

// Function to get all selected actors for the game
export function getGameWords(count: number = 10): WordListItem[] {
  // Return all 10 selected actors - no randomization needed
  return selectedActors.slice(0, count);
}

// Function to get words by category
export function getWordsByCategory(category: WordListItem['category']): WordListItem[] {
  return bollywoodWords.filter(item => item.category === category);
}
