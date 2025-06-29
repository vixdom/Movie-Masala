export interface ThemedWordItem {
  word: string;
  category: string;
  theme: string;
  hint?: string;
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  categories: string[];
}

export const themes: Theme[] = [
  {
    id: 'golden-era',
    name: 'Golden Era Legends',
    description: '50s-70s Cinema Icons',
    categories: ['actors', 'actresses']
  },
  {
    id: '80s-90s',
    name: '80s-90s Superstars',
    description: 'The Blockbuster Era',
    categories: ['actors', 'actresses']
  },
  {
    id: 'khans-modern',
    name: 'Blockbuster Khans & Co.',
    description: '2000s to Present',
    categories: ['actors', 'actresses']
  },
  {
    id: 'leading-ladies',
    name: 'Leading Ladies of Today',
    description: 'Contemporary Female Stars',
    categories: ['actresses']
  },
  {
    id: 'fresh-faces',
    name: 'Fresh Faces & Rising Stars',
    description: 'New Generation Talent',
    categories: ['actors', 'actresses']
  },
  {
    id: 'comedy',
    name: 'Comedy Kings & Queens',
    description: 'Masters of Laughter',
    categories: ['actors', 'actresses']
  },
  {
    id: 'action-thriller',
    name: 'Action & Thriller Specialists',
    description: 'High-Octane Performers',
    categories: ['actors', 'actresses']
  },
  {
    id: 'method-masters',
    name: 'Character & Method Masters',
    description: 'Versatile Performers',
    categories: ['actors', 'actresses']
  },
  {
    id: 'dance-dynamos',
    name: 'Dance Dynamos',
    description: 'Movement & Rhythm Stars',
    categories: ['actors', 'actresses']
  },
  {
    id: 'award-winners',
    name: 'National Award Winners',
    description: 'Critically Acclaimed Stars',
    categories: ['actors', 'actresses']
  },
  {
    id: 'directors',
    name: 'Master Directors',
    description: 'Visionary Filmmakers',
    categories: ['directors']
  },
  {
    id: 'male-singers',
    name: 'Playback Singing Legends',
    description: 'Male Vocal Artists',
    categories: ['singers']
  },
  {
    id: 'female-singers',
    name: 'Playback Singing Queens',
    description: 'Female Vocal Artists',
    categories: ['singers']
  },
  {
    id: 'composers',
    name: 'Music Maestros',
    description: 'Legendary Composers',
    categories: ['composers']
  },
  {
    id: 'character-artists',
    name: 'Character Artists',
    description: 'Scene Stealers & Support',
    categories: ['actors', 'actresses']
  }
];

export const themedWords: ThemedWordItem[] = [
  // GOLDEN ERA LEGENDS (50s-70s)
  { word: 'DILIPKUMAR', category: 'actors', theme: 'golden-era' },
  { word: 'RAJKAPOOR', category: 'actors', theme: 'golden-era' },
  { word: 'DEVANAND', category: 'actors', theme: 'golden-era' },
  { word: 'GURUDUTT', category: 'actors', theme: 'golden-era' },
  { word: 'SHAMMIKAPOOR', category: 'actors', theme: 'golden-era' },
  { word: 'SHASHIKAPOOR', category: 'actors', theme: 'golden-era' },
  { word: 'RAJESHKHANNA', category: 'actors', theme: 'golden-era' },
  { word: 'DHARMENDRA', category: 'actors', theme: 'golden-era' },
  { word: 'AMITABHBACHCHAN', category: 'actors', theme: 'golden-era' },
  { word: 'NARGIS', category: 'actresses', theme: 'golden-era' },
  { word: 'MADHUBALA', category: 'actresses', theme: 'golden-era' },
  { word: 'MEENAKUMARI', category: 'actresses', theme: 'golden-era' },
  { word: 'WAHEEDAREHMAN', category: 'actresses', theme: 'golden-era' },
  { word: 'NUTAN', category: 'actresses', theme: 'golden-era' },
  { word: 'HEMAMALINI', category: 'actresses', theme: 'golden-era' },
  { word: 'JAYABHADURI', category: 'actresses', theme: 'golden-era' },
  { word: 'ASHAPAREKH', category: 'actresses', theme: 'golden-era' },
  { word: 'HELEN', category: 'actresses', theme: 'golden-era' },

  // 80s-90s SUPERSTARS
  { word: 'ANILKAPOOR', category: 'actors', theme: '80s-90s' },
  { word: 'SUNNYDEOL', category: 'actors', theme: '80s-90s' },
  { word: 'JACKIESHROFF', category: 'actors', theme: '80s-90s' },
  { word: 'GOVINDA', category: 'actors', theme: '80s-90s' },
  { word: 'SANJAYDUTT', category: 'actors', theme: '80s-90s' },
  { word: 'AJAYDEVGN', category: 'actors', theme: '80s-90s' },
  { word: 'AKSHAYKUMAR', category: 'actors', theme: '80s-90s' },
  { word: 'SHAHRUKHKHAN', category: 'actors', theme: '80s-90s' },
  { word: 'SALMANKHAN', category: 'actors', theme: '80s-90s' },
  { word: 'AAMIRKHAN', category: 'actors', theme: '80s-90s' },
  { word: 'SAIFALI', category: 'actors', theme: '80s-90s' },
  { word: 'SRIDEVI', category: 'actresses', theme: '80s-90s' },
  { word: 'MADHURIDIXFIT', category: 'actresses', theme: '80s-90s' },
  { word: 'JUHICHAWLA', category: 'actresses', theme: '80s-90s' },
  { word: 'KAJOL', category: 'actresses', theme: '80s-90s' },
  { word: 'KARISMAKAPOOR', category: 'actresses', theme: '80s-90s' },
  { word: 'RAVELNATANDON', category: 'actresses', theme: '80s-90s' },
  { word: 'MANISHAKOIRALA', category: 'actresses', theme: '80s-90s' },
  { word: 'TABU', category: 'actresses', theme: '80s-90s' },

  // BLOCKBUSTER KHANS & CO. (2000s-Now)
  { word: 'SHAHRUKHKHAN', category: 'actors', theme: 'khans-modern' },
  { word: 'SALMANKHAN', category: 'actors', theme: 'khans-modern' },
  { word: 'AAMIRKHAN', category: 'actors', theme: 'khans-modern' },
  { word: 'SAIFALI', category: 'actors', theme: 'khans-modern' },
  { word: 'KATRINAKAIF', category: 'actresses', theme: 'khans-modern' },
  { word: 'DEEPIKAPADUKONE', category: 'actresses', theme: 'khans-modern' },
  { word: 'PRIYANKACLIOPRA', category: 'actresses', theme: 'khans-modern' },
  { word: 'KAREENAKAPOOR', category: 'actresses', theme: 'khans-modern' },
  { word: 'RANBIRKAPOOR', category: 'actors', theme: 'khans-modern' },
  { word: 'RANVEERSINGH', category: 'actors', theme: 'khans-modern' },
  { word: 'HRITHIKROSHAN', category: 'actors', theme: 'khans-modern' },
  { word: 'AKSHAYKUMAR', category: 'actors', theme: 'khans-modern' },
  { word: 'AJAYDEVGN', category: 'actors', theme: 'khans-modern' },
  { word: 'SHAHIDKAPOOR', category: 'actors', theme: 'khans-modern' },
  { word: 'TIGERSHROFF', category: 'actors', theme: 'khans-modern' },
  { word: 'ANUSHKASHARMA', category: 'actresses', theme: 'khans-modern' },
  { word: 'SONAMKAPOOR', category: 'actresses', theme: 'khans-modern' },
  { word: 'VIDYABALAN', category: 'actresses', theme: 'khans-modern' },

  // LEADING LADIES OF TODAY
  { word: 'DEEPIKAPADUKONE', category: 'actresses', theme: 'leading-ladies' },
  { word: 'ALIABHATT', category: 'actresses', theme: 'leading-ladies' },
  { word: 'KATRINAKAIF', category: 'actresses', theme: 'leading-ladies' },
  { word: 'ANUSHKASHARMA', category: 'actresses', theme: 'leading-ladies' },
  { word: 'KIARAADVANI', category: 'actresses', theme: 'leading-ladies' },
  { word: 'KRITISANON', category: 'actresses', theme: 'leading-ladies' },
  { word: 'SHRADDHAKAPOOR', category: 'actresses', theme: 'leading-ladies' },
  { word: 'TAAPSEEPANNU', category: 'actresses', theme: 'leading-ladies' },
  { word: 'BHUMIPEDNEKAR', category: 'actresses', theme: 'leading-ladies' },
  { word: 'SARAALIKHAN', category: 'actresses', theme: 'leading-ladies' },
  { word: 'JANHVIKAPOOR', category: 'actresses', theme: 'leading-ladies' },
  { word: 'DISHAPATANI', category: 'actresses', theme: 'leading-ladies' },
  { word: 'POOJAHEGDE', category: 'actresses', theme: 'leading-ladies' },
  { word: 'SANYAMALHOTRA', category: 'actresses', theme: 'leading-ladies' },
  { word: 'MRUNALTHAKUR', category: 'actresses', theme: 'leading-ladies' },
  { word: 'TRIPTIIDIMRI', category: 'actresses', theme: 'leading-ladies' },
  { word: 'RASHMIKAMANDANNA', category: 'actresses', theme: 'leading-ladies' },
  { word: 'NORAFATEHI', category: 'actresses', theme: 'leading-ladies' },
  { word: 'RADHIKAMADAN', category: 'actresses', theme: 'leading-ladies' },

  // FRESH FACES & RISING STARS
  { word: 'SIDDHANTCHATURVEDI', category: 'actors', theme: 'fresh-faces' },
  { word: 'VIJAYVARMA', category: 'actors', theme: 'fresh-faces' },
  { word: 'ISHAANKHATTER', category: 'actors', theme: 'fresh-faces' },
  { word: 'ROHITSARAF', category: 'actors', theme: 'fresh-faces' },
  { word: 'LAKSHYA', category: 'actors', theme: 'fresh-faces' },
  { word: 'BABILKHAN', category: 'actors', theme: 'fresh-faces' },
  { word: 'ADARSHGOURAV', category: 'actors', theme: 'fresh-faces' },
  { word: 'MEEZAANJAFRI', category: 'actors', theme: 'fresh-faces' },
  { word: 'ALAYAF', category: 'actresses', theme: 'fresh-faces' },
  { word: 'SHARVARIWAGH', category: 'actresses', theme: 'fresh-faces' },
  { word: 'KHUSHIKAPOOR', category: 'actresses', theme: 'fresh-faces' },
  { word: 'SANJANASANGHI', category: 'actresses', theme: 'fresh-faces' },
  { word: 'WAMIQAGABBI', category: 'actresses', theme: 'fresh-faces' },
  { word: 'PRANUTANBAHL', category: 'actresses', theme: 'fresh-faces' },
  { word: 'SHALINIPANDEY', category: 'actresses', theme: 'fresh-faces' },
  { word: 'ABHIMANYUDASSANI', category: 'actors', theme: 'fresh-faces' },
  { word: 'TRIPTIIDIMRI', category: 'actresses', theme: 'fresh-faces' },
  { word: 'VEDANGRAINA', category: 'actors', theme: 'fresh-faces' },
  { word: 'SOBHITADHULIPALA', category: 'actresses', theme: 'fresh-faces' },

  // COMEDY KINGS & QUEENS
  { word: 'GOVINDA', category: 'actors', theme: 'comedy' },
  { word: 'JOHNNYLEVER', category: 'actors', theme: 'comedy' },
  { word: 'PARESHRAWAL', category: 'actors', theme: 'comedy' },
  { word: 'RAJPALYADAV', category: 'actors', theme: 'comedy' },
  { word: 'BOMANIRANI', category: 'actors', theme: 'comedy' },
  { word: 'SANJAYMISHRA', category: 'actors', theme: 'comedy' },
  { word: 'VARUNDHAWAN', category: 'actors', theme: 'comedy' },
  { word: 'KARTIKAARYAN', category: 'actors', theme: 'comedy' },
  { word: 'AYUSHMANNKHURRANA', category: 'actors', theme: 'comedy' },
  { word: 'ABHISHEKBACHCHAN', category: 'actors', theme: 'comedy' },
  { word: 'SEEMAPAHWA', category: 'actresses', theme: 'comedy' },
  { word: 'BHARTISINGH', category: 'actresses', theme: 'comedy' },
  { word: 'ARCHANAPURANSINGH', category: 'actresses', theme: 'comedy' },
  { word: 'JUHICHAWLA', category: 'actresses', theme: 'comedy' },
  { word: 'KRITISANON', category: 'actresses', theme: 'comedy' },
  { word: 'JACQUELINEFERNANDEZ', category: 'actresses', theme: 'comedy' },
  { word: 'RICHACHADHA', category: 'actresses', theme: 'comedy' },
  { word: 'SUNILGROVER', category: 'actors', theme: 'comedy' },
  { word: 'KAPILSHARMA', category: 'actors', theme: 'comedy' },

  // ACTION & THRILLER SPECIALISTS
  { word: 'SUNNYDEOL', category: 'actors', theme: 'action-thriller' },
  { word: 'AJAYDEVGN', category: 'actors', theme: 'action-thriller' },
  { word: 'AKSHAYKUMAR', category: 'actors', theme: 'action-thriller' },
  { word: 'HRITHIKROSHAN', category: 'actors', theme: 'action-thriller' },
  { word: 'JOHNABRAHAM', category: 'actors', theme: 'action-thriller' },
  { word: 'VIDYUTJAMMWAL', category: 'actors', theme: 'action-thriller' },
  { word: 'TIGERSHROFF', category: 'actors', theme: 'action-thriller' },
  { word: 'VARUNDHAWAN', category: 'actors', theme: 'action-thriller' },
  { word: 'SIDHARTHMALHOTRA', category: 'actors', theme: 'action-thriller' },
  { word: 'EMRAANHASHMI', category: 'actors', theme: 'action-thriller' },
  { word: 'KATRINAKAIF', category: 'actresses', theme: 'action-thriller' },
  { word: 'DEEPIKAPADUKONE', category: 'actresses', theme: 'action-thriller' },
  { word: 'YAMIGAUTAM', category: 'actresses', theme: 'action-thriller' },
  { word: 'TAAPSEEPANNU', category: 'actresses', theme: 'action-thriller' },
  { word: 'SHRADDHAKAPOOR', category: 'actresses', theme: 'action-thriller' },
  { word: 'RANIMUKURJI', category: 'actresses', theme: 'action-thriller' },
  { word: 'KANGANARANAUT', category: 'actresses', theme: 'action-thriller' },
  { word: 'VICKYKAUSHAL', category: 'actors', theme: 'action-thriller' },
  { word: 'ADITYAROYKAPUR', category: 'actors', theme: 'action-thriller' },
  { word: 'ARJUNRAMPAL', category: 'actors', theme: 'action-thriller' },

  // CHARACTER & METHOD MASTERS
  { word: 'NAWAZUDDINSIDDIQUI', category: 'actors', theme: 'method-masters' },
  { word: 'MANOJBAJPAYEE', category: 'actors', theme: 'method-masters' },
  { word: 'PANKAJTRIPATHI', category: 'actors', theme: 'method-masters' },
  { word: 'RAJKUMMARRAO', category: 'actors', theme: 'method-masters' },
  { word: 'IRRFANKHAN', category: 'actors', theme: 'method-masters' },
  { word: 'KAYKAYMENON', category: 'actors', theme: 'method-masters' },
  { word: 'KUMUDMISHRA', category: 'actors', theme: 'method-masters' },
  { word: 'AYUSHMANNKHURRANA', category: 'actors', theme: 'method-masters' },
  { word: 'VICKYKAUSHAL', category: 'actors', theme: 'method-masters' },
  { word: 'JAIDEEPAHWAT', category: 'actors', theme: 'method-masters' },
  { word: 'TABU', category: 'actresses', theme: 'method-masters' },
  { word: 'VIDYABALAN', category: 'actresses', theme: 'method-masters' },
  { word: 'KONKONASENSHARMA', category: 'actresses', theme: 'method-masters' },
  { word: 'SHEFALISHAH', category: 'actresses', theme: 'method-masters' },
  { word: 'NEENAGUPTA', category: 'actresses', theme: 'method-masters' },
  { word: 'RADHIKAAPTE', category: 'actresses', theme: 'method-masters' },
  { word: 'RASIKADUGAL', category: 'actresses', theme: 'method-masters' },
  { word: 'DIVYADUTTA', category: 'actresses', theme: 'method-masters' },
  { word: 'SHABANAAZMI', category: 'actresses', theme: 'method-masters' },
  { word: 'SMITAPATIL', category: 'actresses', theme: 'method-masters' },

  // DANCE DYNAMOS
  { word: 'HRITHIKROSHAN', category: 'actors', theme: 'dance-dynamos' },
  { word: 'SHAHIDKAPOOR', category: 'actors', theme: 'dance-dynamos' },
  { word: 'TIGERSHROFF', category: 'actors', theme: 'dance-dynamos' },
  { word: 'VARUNDHAWAN', category: 'actors', theme: 'dance-dynamos' },
  { word: 'RANVEERSINGH', category: 'actors', theme: 'dance-dynamos' },
  { word: 'GOVINDA', category: 'actors', theme: 'dance-dynamos' },
  { word: 'PRABHUDEVA', category: 'actors', theme: 'dance-dynamos' },
  { word: 'NORAFATEHI', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'MADHURIDIXXIT', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'KATRINAKAIF', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'JACQUELINEFERNANDEZ', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'SHRADDHAKAPOOR', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'KIARAADVANI', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'KRITISANON', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'ALIABHATT', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'JANHVIKAPOOR', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'ANANYAPANDAY', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'MALAIKAARORA', category: 'actresses', theme: 'dance-dynamos' },
  { word: 'SUNNYLEONE', category: 'actresses', theme: 'dance-dynamos' },

  // NATIONAL AWARD WINNERS
  { word: 'AMITABHBACHCHAN', category: 'actors', theme: 'award-winners' },
  { word: 'NASEERUDDINSHAH', category: 'actors', theme: 'award-winners' },
  { word: 'OMPURI', category: 'actors', theme: 'award-winners' },
  { word: 'MITHUNCHAKRABORTY', category: 'actors', theme: 'award-winners' },
  { word: 'AJAYDEVGN', category: 'actors', theme: 'award-winners' },
  { word: 'AKSHAYKUMAR', category: 'actors', theme: 'award-winners' },
  { word: 'AYUSHMANNKHURRANA', category: 'actors', theme: 'award-winners' },
  { word: 'RAJKUMMARRAO', category: 'actors', theme: 'award-winners' },
  { word: 'VICKYKAUSHAL', category: 'actors', theme: 'award-winners' },
  { word: 'PANKAJTRIPATHI', category: 'actors', theme: 'award-winners' },
  { word: 'SHABANAAZMI', category: 'actresses', theme: 'award-winners' },
  { word: 'KANGANARANAUT', category: 'actresses', theme: 'award-winners' },
  { word: 'VIDYABALAN', category: 'actresses', theme: 'award-winners' },
  { word: 'TABU', category: 'actresses', theme: 'award-winners' },
  { word: 'ALIABHATT', category: 'actresses', theme: 'award-winners' },
  { word: 'KONKONASENSHARMA', category: 'actresses', theme: 'award-winners' },
  { word: 'KRITISANON', category: 'actresses', theme: 'award-winners' },
  { word: 'SRIDEVI', category: 'actresses', theme: 'award-winners' },
  { word: 'ARJUNRAMPAL', category: 'actors', theme: 'award-winners' },

  // MASTER DIRECTORS
  { word: 'YASHCHOPRA', category: 'directors', theme: 'directors' },
  { word: 'KARANJOHAR', category: 'directors', theme: 'directors' },
  { word: 'SANJAYLEELAB HANSALI', category: 'directors', theme: 'directors' },
  { word: 'RAJKUMARHIRANI', category: 'directors', theme: 'directors' },
  { word: 'ZOYAAKHTAR', category: 'directors', theme: 'directors' },
  { word: 'ANURAGKASHYAP', category: 'directors', theme: 'directors' },
  { word: 'ROHITSHETTY', category: 'directors', theme: 'directors' },
  { word: 'FARAHKHAN', category: 'directors', theme: 'directors' },
  { word: 'IMTIAZALI', category: 'directors', theme: 'directors' },
  { word: 'VISHALBHARDWAJ', category: 'directors', theme: 'directors' },
  { word: 'KABIRKHAN', category: 'directors', theme: 'directors' },
  { word: 'NITESHTIWARI', category: 'directors', theme: 'directors' },
  { word: 'AYANMUKERJI', category: 'directors', theme: 'directors' },
  { word: 'MEGHNAGULZAR', category: 'directors', theme: 'directors' },
  { word: 'NANDITADAS', category: 'directors', theme: 'directors' },
  { word: 'SHOOJITSIRCAR', category: 'directors', theme: 'directors' },
  { word: 'RAKEYSHOMPRAKASHMEHRA', category: 'directors', theme: 'directors' },
  { word: 'SUBHASHGHAI', category: 'directors', theme: 'directors' },
  { word: 'MAHESHBHATT', category: 'directors', theme: 'directors' },
  { word: 'ASHUTOSHGOWARIKER', category: 'directors', theme: 'directors' },

  // PLAYBACK SINGING LEGENDS (MALE)
  { word: 'KISHOREKUMAR', category: 'singers', theme: 'male-singers' },
  { word: 'MOHAMMEDRAFI', category: 'singers', theme: 'male-singers' },
  { word: 'MUKESH', category: 'singers', theme: 'male-singers' },
  { word: 'MANNADEY', category: 'singers', theme: 'male-singers' },
  { word: 'KJYESUDAS', category: 'singers', theme: 'male-singers' },
  { word: 'UDITNARAYAN', category: 'singers', theme: 'male-singers' },
  { word: 'KUMARSANU', category: 'singers', theme: 'male-singers' },
  { word: 'SONUNIGAM', category: 'singers', theme: 'male-singers' },
  { word: 'SHAAN', category: 'singers', theme: 'male-singers' },
  { word: 'ARIJITSINGH', category: 'singers', theme: 'male-singers' },
  { word: 'SPBALASUBRAHMANYAM', category: 'singers', theme: 'male-singers' },
  { word: 'ABHIJEET', category: 'singers', theme: 'male-singers' },
  { word: 'MOHITCHAUHAN', category: 'singers', theme: 'male-singers' },
  { word: 'JAVEDALI', category: 'singers', theme: 'male-singers' },
  { word: 'KK', category: 'singers', theme: 'male-singers' },
  { word: 'RAHATFATEHALIKHAN', category: 'singers', theme: 'male-singers' },
  { word: 'JUBINNAUTIYAL', category: 'singers', theme: 'male-singers' },
  { word: 'BADSHAH', category: 'singers', theme: 'male-singers' },
  { word: 'ARMAANMALIK', category: 'singers', theme: 'male-singers' },
  { word: 'DARSHANRAVAL', category: 'singers', theme: 'male-singers' },

  // PLAYBACK SINGING QUEENS (FEMALE)
  { word: 'LATAMANGESHKAR', category: 'singers', theme: 'female-singers' },
  { word: 'ASHABHOSLE', category: 'singers', theme: 'female-singers' },
  { word: 'ALKAYAGNIK', category: 'singers', theme: 'female-singers' },
  { word: 'KAVITAKRISHNAMURTHY', category: 'singers', theme: 'female-singers' },
  { word: 'ANURADRAPAUDWAL', category: 'singers', theme: 'female-singers' },
  { word: 'SADHANASARGAM', category: 'singers', theme: 'female-singers' },
  { word: 'SHREYAGHOSHAL', category: 'singers', theme: 'female-singers' },
  { word: 'SUNIDHICHAUHAN', category: 'singers', theme: 'female-singers' },
  { word: 'NEHAKAKKAR', category: 'singers', theme: 'female-singers' },
  { word: 'PALAKMUCHHAL', category: 'singers', theme: 'female-singers' },
  { word: 'KANIKAKAPOOR', category: 'singers', theme: 'female-singers' },
  { word: 'MONALITHAKUR', category: 'singers', theme: 'female-singers' },
  { word: 'JONITAGANDHI', category: 'singers', theme: 'female-singers' },
  { word: 'TULSIKUMAR', category: 'singers', theme: 'female-singers' },
  { word: 'SHILPARAO', category: 'singers', theme: 'female-singers' },
  { word: 'ILARUN', category: 'singers', theme: 'female-singers' },
  { word: 'REKHABHARDWAJ', category: 'singers', theme: 'female-singers' },
  { word: 'NIKHITAGANDHI', category: 'singers', theme: 'female-singers' },
  { word: 'ASEESKAUR', category: 'singers', theme: 'female-singers' },
  { word: 'PRIYASARAIYA', category: 'singers', theme: 'female-singers' },

  // MUSIC MAESTROS (COMPOSERS)
  { word: 'SDBURMAN', category: 'composers', theme: 'composers' },
  { word: 'RDBURMAN', category: 'composers', theme: 'composers' },
  { word: 'NAUSHAD', category: 'composers', theme: 'composers' },
  { word: 'LAXMIKANTPYARELAL', category: 'composers', theme: 'composers' },
  { word: 'KALYANJIANANDJI', category: 'composers', theme: 'composers' },
  { word: 'JATINLALIT', category: 'composers', theme: 'composers' },
  { word: 'ANUMALIK', category: 'composers', theme: 'composers' },
  { word: 'ARRAHMAN', category: 'composers', theme: 'composers' },
  { word: 'SHANKAREHSAANLOY', category: 'composers', theme: 'composers' },
  { word: 'PRITAM', category: 'composers', theme: 'composers' },
  { word: 'VISHALSHEKHAR', category: 'composers', theme: 'composers' },
  { word: 'AMITTRIVEDI', category: 'composers', theme: 'composers' },
  { word: 'AJAYATUL', category: 'composers', theme: 'composers' },
  { word: 'HIMESHRESHAMMIYA', category: 'composers', theme: 'composers' },
  { word: 'BAPPILAHIRI', category: 'composers', theme: 'composers' },
  { word: 'SALIMSULAIMAN', category: 'composers', theme: 'composers' },
  { word: 'SACHINJIGAR', category: 'composers', theme: 'composers' },
  { word: 'DEVISRIPRASAD', category: 'composers', theme: 'composers' },
  { word: 'MITHOON', category: 'composers', theme: 'composers' },
  { word: 'SNEHAKHANWALKAR', category: 'composers', theme: 'composers' },

  // CHARACTER ARTISTES & SCENE STEALERS
  { word: 'AMRISHPURI', category: 'actors', theme: 'character-artists' },
  { word: 'KADERKHAN', category: 'actors', theme: 'character-artists' },
  { word: 'OMPURI', category: 'actors', theme: 'character-artists' },
  { word: 'PRAN', category: 'actors', theme: 'character-artists' },
  { word: 'DANNYDENZONGPA', category: 'actors', theme: 'character-artists' },
  { word: 'ANUPAMKHER', category: 'actors', theme: 'character-artists' },
  { word: 'NASEERUDDINSHAH', category: 'actors', theme: 'character-artists' },
  { word: 'ASHOKSARAF', category: 'actors', theme: 'character-artists' },
  { word: 'SATISHKAUSHIK', category: 'actors', theme: 'character-artists' },
  { word: 'PARESHRAWAL', category: 'actors', theme: 'character-artists' },
  { word: 'RAJPALYADAV', category: 'actors', theme: 'character-artists' },
  { word: 'PANKAJTRIPATHI', category: 'actors', theme: 'character-artists' },
  { word: 'SEEMAPAHWA', category: 'actresses', theme: 'character-artists' },
  { word: 'SUPRIYAPATHAK', category: 'actresses', theme: 'character-artists' },
  { word: 'NEENAGUPTA', category: 'actresses', theme: 'character-artists' },
  { word: 'KUMUDMISHRA', category: 'actors', theme: 'character-artists' },
  { word: 'VIJAYRAAZ', category: 'actors', theme: 'character-artists' },
  { word: 'BRIJENDRRAKALA', category: 'actors', theme: 'character-artists' },
  { word: 'SAURABHSHUKLA', category: 'actors', theme: 'character-artists' },
  { word: 'NAWAZUDDINSIDDIQUI', category: 'actors', theme: 'character-artists' }
];

export function getWordsByTheme(themeId: string, count: number = 10): ThemedWordItem[] {
  const themeWords = themedWords.filter(word => word.theme === themeId);
  const shuffled = themeWords.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getAllThemes(): Theme[] {
  return themes;
}

export function getThemeById(themeId: string): Theme | undefined {
  return themes.find(theme => theme.id === themeId);
}

export function getRandomTheme(): Theme {
  return themes[Math.floor(Math.random() * themes.length)];
}