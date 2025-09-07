// Comprehensive Nigerian Civic Knowledge Quiz Bank
// Real questions for Step Up Naija platform

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  points: number;
  source?: string;
}

export const nigerianCivicQuizBank: QuizQuestion[] = [
  // CONSTITUTIONAL KNOWLEDGE - Beginner Level
  {
    id: 'const_001',
    question: 'What year was Nigeria\'s current constitution adopted?',
    options: ['1960', '1979', '1989', '1999'],
    correctAnswer: '1999',
    explanation: 'The 1999 Constitution of the Federal Republic of Nigeria came into effect on May 29, 1999, and remains the supreme law of Nigeria.',
    difficulty: 'beginner',
    category: 'Constitutional Knowledge',
    points: 10,
    source: '1999 Constitution of Nigeria'
  },
  {
    id: 'const_002',
    question: 'How many states are there in Nigeria?',
    options: ['35', '36', '37', '38'],
    correctAnswer: '36',
    explanation: 'Nigeria has 36 states plus the Federal Capital Territory (FCT), Abuja, making 37 federating units in total.',
    difficulty: 'beginner',
    category: 'Constitutional Knowledge',
    points: 10
  },
  {
    id: 'const_003',
    question: 'What is the motto of Nigeria?',
    options: ['Unity and Faith', 'Peace and Progress', 'Unity, Work, Progress', 'Faith, Unity, Progress'],
    correctAnswer: 'Unity, Work, Progress',
    explanation: 'Nigeria\'s national motto is "Unity, Work, Progress" which reflects the country\'s aspirations for unity among its diverse peoples, industriousness, and continuous development.',
    difficulty: 'beginner',
    category: 'Constitutional Knowledge',
    points: 10
  },
  {
    id: 'const_004',
    question: 'Which chapter of the Nigerian Constitution contains the Fundamental Human Rights?',
    options: ['Chapter II', 'Chapter III', 'Chapter IV', 'Chapter V'],
    correctAnswer: 'Chapter IV',
    explanation: 'Chapter IV of the 1999 Constitution contains the Fundamental Rights of Nigerian citizens, including rights to life, dignity, personal liberty, fair hearing, and freedom of expression.',
    difficulty: 'intermediate',
    category: 'Constitutional Knowledge',
    points: 15
  },
  {
    id: 'const_005',
    question: 'The Nigerian Constitution provides for how many levels of government?',
    options: ['Two', 'Three', 'Four', 'Five'],
    correctAnswer: 'Three',
    explanation: 'Nigeria operates a three-tier federal system: Federal Government, State Government, and Local Government. Each level has specific responsibilities and powers.',
    difficulty: 'beginner',
    category: 'Constitutional Knowledge',
    points: 10
  },

  // FEDERAL SYSTEM & GOVERNANCE - Intermediate Level
  {
    id: 'fed_001',
    question: 'How many Local Government Areas (LGAs) are there in Nigeria?',
    options: ['724', '744', '764', '774'],
    correctAnswer: '774',
    explanation: 'Nigeria has 774 Local Government Areas across the 36 states and FCT. This number was established in the 1999 Constitution.',
    difficulty: 'intermediate',
    category: 'Federal System',
    points: 15
  },
  {
    id: 'fed_002',
    question: 'Which level of government is responsible for primary education in Nigeria?',
    options: ['Federal Government', 'State Government', 'Local Government', 'All levels jointly'],
    correctAnswer: 'All levels jointly',
    explanation: 'Education is on the concurrent legislative list, meaning Federal, State, and Local governments all have roles. Primary education is mainly managed by states and local governments.',
    difficulty: 'intermediate',
    category: 'Federal System',
    points: 15
  },
  {
    id: 'fed_003',
    question: 'What is the tenure of office for a Nigerian President?',
    options: ['3 years', '4 years', '5 years', '6 years'],
    correctAnswer: '4 years',
    explanation: 'The President of Nigeria serves a term of 4 years and can be re-elected for only one additional term, making 8 years the maximum tenure.',
    difficulty: 'beginner',
    category: 'Federal System',
    points: 10
  },

  // CITIZENS' RIGHTS & RESPONSIBILITIES - All Levels
  {
    id: 'rights_001',
    question: 'Which of these is NOT a fundamental right guaranteed by the Nigerian Constitution?',
    options: ['Right to life', 'Right to education', 'Right to privacy', 'Right to dignity'],
    correctAnswer: 'Right to education',
    explanation: 'While education is mentioned in the Constitution, it is in Chapter II (Fundamental Objectives) as a directive principle, not in Chapter IV as a fundamental right.',
    difficulty: 'advanced',
    category: 'Citizens Rights',
    points: 20
  },
  {
    id: 'rights_002',
    question: 'At what age can a Nigerian citizen vote in elections?',
    options: ['16 years', '17 years', '18 years', '21 years'],
    correctAnswer: '18 years',
    explanation: 'Nigerian citizens who are 18 years and above have the right to vote, provided they register with INEC and obtain their Permanent Voter\'s Card (PVC).',
    difficulty: 'beginner',
    category: 'Citizens Rights',
    points: 10
  },
  {
    id: 'rights_003',
    question: 'Which body is responsible for conducting federal elections in Nigeria?',
    options: ['INEC', 'ICPC', 'EFCC', 'NPC'],
    correctAnswer: 'INEC',
    explanation: 'The Independent National Electoral Commission (INEC) is constitutionally empowered to conduct federal elections and referendums in Nigeria.',
    difficulty: 'beginner',
    category: 'Citizens Rights',
    points: 10
  },

  // LOCAL GOVERNMENT & COMMUNITY DEVELOPMENT
  {
    id: 'local_001',
    question: 'What is the minimum population required for the creation of a new Local Government Area?',
    options: ['50,000', '100,000', '150,000', 'No specific minimum'],
    correctAnswer: '150,000',
    explanation: 'According to the Constitution, a new LGA requires a minimum population of 150,000 and must be viable financially and administratively.',
    difficulty: 'advanced',
    category: 'Local Government',
    points: 20
  },
  {
    id: 'local_002',
    question: 'Which of these is a primary function of Local Government in Nigeria?',
    options: ['Foreign affairs', 'Defense', 'Market development', 'Monetary policy'],
    correctAnswer: 'Market development',
    explanation: 'Local governments are responsible for markets, motor parks, local road maintenance, primary healthcare, and basic education in their jurisdiction.',
    difficulty: 'intermediate',
    category: 'Local Government',
    points: 15
  },
  {
    id: 'local_003',
    question: 'How often are Local Government elections supposed to be held in Nigeria?',
    options: ['Every 2 years', 'Every 3 years', 'Every 4 years', 'Every 5 years'],
    correctAnswer: 'Every 3 years',
    explanation: 'Local Government elections are constitutionally required to be held every three years, though this is often not followed in practice.',
    difficulty: 'intermediate',
    category: 'Local Government',
    points: 15
  },

  // ETHICS & ANTI-CORRUPTION
  {
    id: 'ethics_001',
    question: 'Which agency is primarily responsible for investigating corruption cases in Nigeria?',
    options: ['EFCC', 'ICPC', 'CCT', 'All of the above'],
    correctAnswer: 'All of the above',
    explanation: 'The EFCC handles economic and financial crimes, ICPC focuses on corruption in public service, and CCT tries public officers for breach of code of conduct.',
    difficulty: 'intermediate',
    category: 'Ethics & Anti-Corruption',
    points: 15
  },
  {
    id: 'ethics_002',
    question: 'What is the maximum amount a public officer can receive as a gift according to Nigerian law?',
    options: ['₦10,000', '₦50,000', '₦0 (No gifts allowed)', '₦100,000'],
    correctAnswer: '₦0 (No gifts allowed)',
    explanation: 'The Code of Conduct for Public Officers prohibits the receipt of gifts or benefits in kind from anyone while in office, with very limited exceptions.',
    difficulty: 'advanced',
    category: 'Ethics & Anti-Corruption',
    points: 20
  },

  // LEADERSHIP & PUBLIC SERVICE
  {
    id: 'leadership_001',
    question: 'What does "Ubuntu" philosophy, relevant to African leadership, emphasize?',
    options: ['Individual success', 'Community interconnectedness', 'Material wealth', 'Political power'],
    correctAnswer: 'Community interconnectedness',
    explanation: 'Ubuntu philosophy emphasizes "I am because we are" - the interconnectedness of humanity and collective responsibility for community welfare.',
    difficulty: 'intermediate',
    category: 'Leadership Philosophy',
    points: 15
  },
  {
    id: 'leadership_002',
    question: 'Which leadership quality is most essential for building trust in Nigerian communities?',
    options: ['Charisma', 'Integrity', 'Wealth', 'Educational qualification'],
    correctAnswer: 'Integrity',
    explanation: 'Integrity - consistency between words and actions, honesty, and moral uprightness - is fundamental to building and maintaining trust in leadership.',
    difficulty: 'beginner',
    category: 'Leadership Philosophy',
    points: 10
  },

  // COMMUNITY ORGANIZING & CIVIC ENGAGEMENT
  {
    id: 'community_001',
    question: 'What is the first step in organizing a community development project?',
    options: ['Fundraising', 'Needs assessment', 'Media publicity', 'Government approval'],
    correctAnswer: 'Needs assessment',
    explanation: 'Effective community development starts with understanding the real needs and priorities of the community through proper assessment and consultation.',
    difficulty: 'intermediate',
    category: 'Community Organizing',
    points: 15
  },
  {
    id: 'community_002',
    question: 'Which approach is most effective for sustainable community change?',
    options: ['Top-down directives', 'External expert solutions', 'Community-led initiatives', 'Government programs only'],
    correctAnswer: 'Community-led initiatives',
    explanation: 'Community-led initiatives have higher success rates because they are owned by the people, address real needs, and build local capacity.',
    difficulty: 'intermediate',
    category: 'Community Organizing',
    points: 15
  },

  // CONFLICT RESOLUTION & DIALOGUE
  {
    id: 'conflict_001',
    question: 'In traditional Nigerian conflict resolution, what role do elders typically play?',
    options: ['Judges who impose decisions', 'Mediators who facilitate dialogue', 'Enforcers of punishment', 'Witnesses only'],
    correctAnswer: 'Mediators who facilitate dialogue',
    explanation: 'Traditional Nigerian conflict resolution emphasizes elders as respected mediators who help parties find mutually acceptable solutions rather than impose judgments.',
    difficulty: 'intermediate',
    category: 'Conflict Resolution',
    points: 15
  },
  {
    id: 'conflict_002',
    question: 'What is the principle of "Win-Win" in conflict resolution?',
    options: ['One party wins everything', 'Both parties compromise equally', 'Solutions benefit all parties', 'Avoiding the conflict entirely'],
    correctAnswer: 'Solutions benefit all parties',
    explanation: 'Win-win solutions seek to address the core interests of all parties involved, creating outcomes where everyone gains something meaningful.',
    difficulty: 'intermediate',
    category: 'Conflict Resolution',
    points: 15
  }
];

// Quiz categories for easy filtering
export const quizCategories = [
  'Constitutional Knowledge',
  'Federal System',
  'Citizens Rights',
  'Local Government',
  'Ethics & Anti-Corruption',
  'Leadership Philosophy',
  'Community Organizing',
  'Conflict Resolution'
];

// Difficulty-based quiz sets
export const getQuizByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
  return nigerianCivicQuizBank.filter(q => q.difficulty === difficulty);
};

// Category-based quiz sets
export const getQuizByCategory = (category: string) => {
  return nigerianCivicQuizBank.filter(q => q.category === category);
};

// Random quiz generator
export const generateRandomQuiz = (count: number = 10, difficulty?: string, category?: string) => {
  let filteredQuestions = nigerianCivicQuizBank;
  
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  if (category) {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  // Shuffle and take requested count
  const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};