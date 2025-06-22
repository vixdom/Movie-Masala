export interface WordListItem {
  word: string;
  category: 'movie' | 'actor' | 'actress' | 'director' | 'song';
  hint?: string;
}

export const bollywoodWords: WordListItem[] = [
  // Legendary Actors (longer names)
  { word: 'AMITABH', category: 'actor', hint: 'Big B of Bollywood' },
  { word: 'SHAHRUKH', category: 'actor', hint: 'King Khan' },
  { word: 'SALMAN', category: 'actor', hint: 'Bhai of Bollywood' },
  { word: 'AAMIR', category: 'actor', hint: 'Mr. Perfectionist' },
  { word: 'AKSHAY', category: 'actor', hint: 'Khiladi Kumar' },
  { word: 'HRITHIK', category: 'actor', hint: 'Greek God of Bollywood' },
  { word: 'RANBIR', category: 'actor', hint: 'Kapoor family heir' },
  { word: 'RANVEER', category: 'actor', hint: 'Energy powerhouse' },
  { word: 'RAJESH', category: 'actor', hint: 'First superstar' },
  { word: 'DILIP', category: 'actor', hint: 'Tragedy King' },
  { word: 'AYUSHMANN', category: 'actor', hint: 'Versatile performer' },
  { word: 'IRRFAN', category: 'actor', hint: 'Method actor' },
  { word: 'NAWAZ', category: 'actor', hint: 'Character actor' },
  { word: 'ARJUN', category: 'actor', hint: 'Second generation' },
  { word: 'VARUN', category: 'actor', hint: 'Comedy specialist' },
  { word: 'SIDDHARTH', category: 'actor', hint: 'Student of the year' },
  { word: 'RAJKUMMAR', category: 'actor', hint: 'Character specialist' },
  { word: 'TIGER', category: 'actor', hint: 'Action star' },
  { word: 'VICKY', category: 'actor', hint: 'Uri actor' },
  { word: 'KARTIK', category: 'actor', hint: 'Comedy king' }
];

// Function to get a random subset of words for the game
export function getGameWords(count: number = 15): WordListItem[] {
  // Filter words that can fit in a 10x10 grid (max 10 characters)
  const fittableWords = bollywoodWords.filter(word => word.word.length <= 10);
  const shuffled = [...fittableWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Function to get words by category
export function getWordsByCategory(category: WordListItem['category']): WordListItem[] {
  return bollywoodWords.filter(item => item.category === category);
}
