export interface WordListItem {
  word: string;
  category: 'movie' | 'actor' | 'actress' | 'director' | 'song';
  hint?: string;
}

export const bollywoodWords: WordListItem[] = [
  // Popular Movies
  { word: 'SHOLAY', category: 'movie', hint: 'Classic 1975 action film' },
  { word: 'DANGAL', category: 'movie', hint: 'Wrestling biographical drama' },
  { word: 'LAGAAN', category: 'movie', hint: 'Cricket in colonial India' },
  { word: 'QUEEN', category: 'movie', hint: 'Solo honeymoon adventure' },
  { word: 'PINK', category: 'movie', hint: 'Social thriller with Big B' },
  { word: 'SULTAN', category: 'movie', hint: 'Salman Khan wrestling drama' },
  { word: 'ANAND', category: 'movie', hint: 'Rajesh Khanna classic' },
  { word: 'MASAAN', category: 'movie', hint: 'Independent cinema gem' },
  { word: 'TUMHARI', category: 'movie', hint: 'Your beloved' },
  { word: 'JHANKAAR', category: 'movie', hint: 'Musical resonance' },
  
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
  
  // Legendary Actresses
  { word: 'DEEPIKAPADUKONE', category: 'actress', hint: 'Padmaavat queen' },
  { word: 'PRIYANKACHOPRA', category: 'actress', hint: 'Global icon' },
  { word: 'KAREENAKAPOOR', category: 'actress', hint: 'Bebo of Bollywood' },
  { word: 'KATRINAKAIF', category: 'actress', hint: 'British beauty' },
  { word: 'ALIABHATT', category: 'actress', hint: 'Young powerhouse' },
  { word: 'MADHURIDIXIR', category: 'actress', hint: 'Dancing queen' },
  { word: 'SRIDEVI', category: 'actress', hint: 'First female superstar' },
  { word: 'KAJOL', category: 'actress', hint: 'DDLJ heroine' },
  { word: 'AISHWARYARAI', category: 'actress', hint: 'Former Miss World' },
  { word: 'REKHA', category: 'actress', hint: 'Eternal beauty' },
  
  // Famous Directors
  { word: 'YASHCHOPRA', category: 'director', hint: 'Chopra patriarch' },
  { word: 'KARANJOHAR', category: 'director', hint: 'Dharma Productions head' },
  { word: 'SANJAYBHANSALI', category: 'director', hint: 'Visionary filmmaker' },
  { word: 'RAJKUMARHIRANI', category: 'director', hint: 'Comedy master' },
  { word: 'ZOYAAKHTAR', category: 'director', hint: 'Modern storyteller' },
  { word: 'ROHITSHETTY', category: 'director', hint: 'Action king' },
  { word: 'IMTIAZALI', category: 'director', hint: 'Romance master' },
  { word: 'ANURAGKASHYAP', category: 'director', hint: 'Indie filmmaker' },
  
  // Popular Songs/Terms
  { word: 'TAAL', category: 'song', hint: 'Rhythm and beat' },
  { word: 'ISHQ', category: 'song', hint: 'Love in Urdu' },
  { word: 'PYAAR', category: 'song', hint: 'Love in Hindi' },
  { word: 'DOST', category: 'song', hint: 'Friend' },
  { word: 'SAPNA', category: 'song', hint: 'Dream' },
  { word: 'KHUSHI', category: 'song', hint: 'Happiness' },
  { word: 'GHAM', category: 'song', hint: 'Sorrow' },
  { word: 'MOHABBAT', category: 'song', hint: 'Deep love' }
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
