export interface WordListItem {
  word: string;
  category: 'movie' | 'actor' | 'actress' | 'director' | 'song';
  hint?: string;
}

export const bollywoodWords: WordListItem[] = [
  // Popular Movies
  { word: 'SHOLAY', category: 'movie', hint: 'Classic 1975 action film' },
  { word: 'DILWALE', category: 'movie', hint: 'SRK and Kajol romance' },
  { word: 'DANGAL', category: 'movie', hint: 'Wrestling biographical drama' },
  { word: 'ZINDAGI', category: 'movie', hint: 'Life themed films' },
  { word: 'BAAHUBALI', category: 'movie', hint: 'Epic historical fiction' },
  { word: 'LAGAAN', category: 'movie', hint: 'Cricket in colonial India' },
  { word: 'MUGHAL', category: 'movie', hint: 'Historical dynasty films' },
  { word: 'QUEEN', category: 'movie', hint: 'Solo honeymoon adventure' },
  { word: 'PINK', category: 'movie', hint: 'Social thriller with Big B' },
  { word: 'SULTAN', category: 'movie', hint: 'Salman Khan wrestling drama' },
  
  // Legendary Actors
  { word: 'AMITABH', category: 'actor', hint: 'Big B of Bollywood' },
  { word: 'SHAHRUKH', category: 'actor', hint: 'King Khan' },
  { word: 'SALMAN', category: 'actor', hint: 'Bhai of Bollywood' },
  { word: 'AAMIR', category: 'actor', hint: 'Mr. Perfectionist' },
  { word: 'AKSHAY', category: 'actor', hint: 'Khiladi Kumar' },
  { word: 'HRITHIK', category: 'actor', hint: 'Greek God of Bollywood' },
  { word: 'RANBIR', category: 'actor', hint: 'Kapoor family heir' },
  { word: 'RANVEER', category: 'actor', hint: 'Energy powerhouse' },
  { word: 'RAJESH', category: 'actor', hint: 'First superstar Khanna' },
  { word: 'DILIP', category: 'actor', hint: 'Tragedy King Kumar' },
  
  // Legendary Actresses
  { word: 'DEEPIKA', category: 'actress', hint: 'Padmaavat queen' },
  { word: 'PRIYANKA', category: 'actress', hint: 'Global icon Chopra' },
  { word: 'KAREENA', category: 'actress', hint: 'Bebo of Bollywood' },
  { word: 'KATRINA', category: 'actress', hint: 'British beauty Kaif' },
  { word: 'ALIA', category: 'actress', hint: 'Young powerhouse Bhatt' },
  { word: 'MADHURI', category: 'actress', hint: 'Dancing queen Dixit' },
  { word: 'SRIDEVI', category: 'actress', hint: 'First female superstar' },
  { word: 'KAJOL', category: 'actress', hint: 'DDLJ heroine' },
  { word: 'AISHWARYA', category: 'actress', hint: 'Former Miss World Rai' },
  { word: 'REKHA', category: 'actress', hint: 'Eternal beauty' },
  
  // Famous Directors
  { word: 'YASH', category: 'director', hint: 'Chopra patriarch' },
  { word: 'KARAN', category: 'director', hint: 'Johar of Dharma' },
  { word: 'SANJAY', category: 'director', hint: 'Bhansali visionary' },
  { word: 'RAJKUMAR', category: 'director', hint: 'Hirani of comedy' },
  { word: 'ZOYA', category: 'director', hint: 'Akhtar storyteller' },
  { word: 'ROHIT', category: 'director', hint: 'Shetty action king' },
  { word: 'IMTIAZ', category: 'director', hint: 'Ali romance master' },
  { word: 'ANURAG', category: 'director', hint: 'Kashyap indie filmmaker' },
  
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
