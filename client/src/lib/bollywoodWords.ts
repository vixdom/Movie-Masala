export interface WordListItem {
  word: string;
  category: 'movie' | 'actor' | 'actress' | 'director' | 'song';
  hint?: string;
}

export const bollywoodWords: WordListItem[] = [
  // Legendary Actors
  { word: 'AMITABHBACHCHAN', category: 'actor', hint: 'Big B of Bollywood' },
  { word: 'SHAHRUKHKHAN', category: 'actor', hint: 'King Khan' },
  { word: 'SALMANKHAN', category: 'actor', hint: 'Bhai of Bollywood' },
  { word: 'AAMIRKHAN', category: 'actor', hint: 'Mr. Perfectionist' },
  { word: 'AKSHAYKUMAR', category: 'actor', hint: 'Khiladi Kumar' },
  { word: 'HRITHIKROSHAN', category: 'actor', hint: 'Greek God of Bollywood' },
  { word: 'RANBIRKAPOOR', category: 'actor', hint: 'Kapoor family heir' },
  { word: 'RANVEERSINGH', category: 'actor', hint: 'Energy powerhouse' },
  { word: 'RAJESHKHANNA', category: 'actor', hint: 'First superstar' },
  { word: 'DILIPKUMAR', category: 'actor', hint: 'Tragedy King' },
  { word: 'RANBIRKAPPOR', category: 'actor', hint: 'Young talent' },
  { word: 'AYUSHMANNKHURRANA', category: 'actor', hint: 'Versatile performer' },
  { word: 'IRRFANKHAN', category: 'actor', hint: 'Method actor' },
  { word: 'NAWAZUDDINSIDDIQUI', category: 'actor', hint: 'Character actor' },
  { word: 'MANOTEJSINGH', category: 'actor', hint: 'Punjabi star' },
  { word: 'VIKRMASHER', category: 'actor', hint: 'Action hero' },
  { word: 'ARJUNKAPOOR', category: 'actor', hint: 'Second generation' },
  { word: 'VARUNDHAWAN', category: 'actor', hint: 'Comedy specialist' },
  { word: 'SIDDHARTHMALHOTRA', category: 'actor', hint: 'Student of the year' },
  { word: 'RAJKUMMARRAO', category: 'actor', hint: 'Character specialist' }
];

// Function to get a random subset of words for the game
export function getGameWords(count: number = 15): WordListItem[] {
  const shuffled = [...bollywoodWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// Function to get words by category
export function getWordsByCategory(category: WordListItem['category']): WordListItem[] {
  return bollywoodWords.filter(item => item.category === category);
}
