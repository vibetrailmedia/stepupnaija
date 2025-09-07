export interface Translation {
  // Navigation
  dashboard: string;
  projects: string;
  leaders: string;
  engage: string;
  civicTools: string;
  programs: string;
  more: string;
  
  // Common actions
  login: string;
  logout: string;
  register: string;
  save: string;
  cancel: string;
  submit: string;
  continue: string;
  back: string;
  next: string;
  loading: string;
  error: string;
  success: string;
  
  // Civic engagement
  vote: string;
  voteNow: string;
  participate: string;
  community: string;
  governance: string;
  transparency: string;
  accountability: string;
  
  // SUP Token system
  supTokens: string;
  earnTokens: string;
  yourBalance: string;
  tokenReward: string;
  
  // Projects
  fundProject: string;
  supportProject: string;
  projectFunding: string;
  communityProjects: string;
  
  // Profile & KYC
  profile: string;
  verifyIdentity: string;
  kycVerification: string;
  credibleNigerian: string;
  
  // Offline & connectivity
  offline: string;
  online: string;
  syncing: string;
  syncComplete: string;
  connectionLost: string;
  connectionRestored: string;
}

export const translations: Record<string, Translation> = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    projects: "Projects", 
    leaders: "Leaders",
    engage: "Engage",
    civicTools: "Civic Tools",
    programs: "Programs",
    more: "More",
    
    // Common actions
    login: "Login",
    logout: "Logout", 
    register: "Register",
    save: "Save",
    cancel: "Cancel",
    submit: "Submit",
    continue: "Continue",
    back: "Back", 
    next: "Next",
    loading: "Loading...",
    error: "Error",
    success: "Success",
    
    // Civic engagement
    vote: "Vote",
    voteNow: "Vote Now",
    participate: "Participate",
    community: "Community",
    governance: "Governance",
    transparency: "Transparency",
    accountability: "Accountability",
    
    // SUP Token system
    supTokens: "SUP Tokens",
    earnTokens: "Earn Tokens",
    yourBalance: "Your Balance",
    tokenReward: "Token Reward",
    
    // Projects
    fundProject: "Fund Project",
    supportProject: "Support Project", 
    projectFunding: "Project Funding",
    communityProjects: "Community Projects",
    
    // Profile & KYC
    profile: "Profile",
    verifyIdentity: "Verify Identity",
    kycVerification: "KYC Verification", 
    credibleNigerian: "Credible Nigerian",
    
    // Offline & connectivity
    offline: "Offline",
    online: "Online", 
    syncing: "Syncing...",
    syncComplete: "Sync Complete",
    connectionLost: "Connection Lost",
    connectionRestored: "Connection Restored",
  },

  ha: { // Hausa
    // Navigation
    dashboard: "Allon Baiyanin",
    projects: "Ayyukan", 
    leaders: "Jagororin",
    engage: "Shiga",
    civicTools: "Kayan Aikin Jama'a",
    programs: "Shirye-shiryen",
    more: "Kara",
    
    // Common actions
    login: "Shiga",
    logout: "Fita", 
    register: "Yi Rijista",
    save: "Ajiye",
    cancel: "Soke",
    submit: "Mika",
    continue: "Ci gaba",
    back: "Koma baya", 
    next: "Na gaba",
    loading: "Ana lodawa...",
    error: "Kuskure",
    success: "Nasara",
    
    // Civic engagement
    vote: "Kada Kuri'a",
    voteNow: "Kada Kuri'a Yanzu",
    participate: "Shiga",
    community: "Al'umma",
    governance: "Shugabanci",
    transparency: "Bayyana gaskiya",
    accountability: "Daukar alhakin",
    
    // SUP Token system
    supTokens: "SUP Tokens",
    earnTokens: "Samu Tokens",
    yourBalance: "Ma'auni naka",
    tokenReward: "Ladan Token",
    
    // Projects
    fundProject: "Ba da Kudaden Aikin",
    supportProject: "Goyon bayan Aikin", 
    projectFunding: "Samar da Kudaden Aiki",
    communityProjects: "Ayyukan Al'umma",
    
    // Profile & KYC
    profile: "Bayanin Mai amfani",
    verifyIdentity: "Tabbatar da Asali",
    kycVerification: "Tabbatar da KYC", 
    credibleNigerian: "Mutumen Amana na Najeriya",
    
    // Offline & connectivity
    offline: "Ba a kan layi",
    online: "A kan layi", 
    syncing: "Ana daidaitawa...",
    syncComplete: "Daidaitawa ya kammala",
    connectionLost: "An rasa haɗin yanar gizo",
    connectionRestored: "An maido da haɗin yanar gizo",
  },

  ig: { // Igbo
    // Navigation
    dashboard: "Bọọdụ Ozi",
    projects: "Ọrụ", 
    leaders: "Ndị ndu",
    engage: "Tinye aka",
    civicTools: "Ngwá Ọrụ Obodo",
    programs: "Mmemme",
    more: "Ndị ọzọ",
    
    // Common actions
    login: "Banye",
    logout: "Pụọ", 
    register: "Debanye aha",
    save: "Chekwaa",
    cancel: "Kagbuo",
    submit: "Nyefee",
    continue: "Gaa n'ihu",
    back: "Laghachi azụ", 
    next: "Ọsọsọ",
    loading: "Na-ebu...",
    error: "Njehie",
    success: "Ihe ịga nke ọma",
    
    // Civic engagement
    vote: "Tunyere vootu",
    voteNow: "Tunyere Vootu Ugbu a",
    participate: "Sonye",
    community: "Obodo",
    governance: "Ọchịchị",
    transparency: "Ime ihe n'anya",
    accountability: "Ịza ajụjụ",
    
    // SUP Token system
    supTokens: "SUP Tokens",
    earnTokens: "Nweta Tokens",
    yourBalance: "Ego gị",
    tokenReward: "Ụgwọ Token",
    
    // Projects
    fundProject: "Kwado Ọrụ",
    supportProject: "Kwado Ọrụ", 
    projectFunding: "Ego Ọrụ",
    communityProjects: "Ọrụ Obodo",
    
    // Profile & KYC
    profile: "Profaịlụ",
    verifyIdentity: "Gosipụta onwe gị",
    kycVerification: "Nyocha KYC", 
    credibleNigerian: "Onye Naịjirịa kwesịrị ntụkwasị obi",
    
    // Offline & connectivity
    offline: "Apụghị ịntanetị",
    online: "Na ịntanetị", 
    syncing: "Na-emekọrịta...",
    syncComplete: "Emekọrịta agwụla",
    connectionLost: "Njikọ ịntanetị efunahụla",
    connectionRestored: "Eweghachila njikọ ịntanetị",
  },

  yo: { // Yoruba
    // Navigation  
    dashboard: "Pẹpẹ Alaye",
    projects: "Iṣẹ akanṣe", 
    leaders: "Awọn adarí",
    engage: "Kopa ninu",
    civicTools: "Ohun elo Awọn ara ilu",
    programs: "Awọn eto",
    more: "Diẹ sii",
    
    // Common actions
    login: "Wọle",
    logout: "Jade", 
    register: "Forukọsilẹ",
    save: "Toju",
    cancel: "Fagilee",
    submit: "Fi silẹ",
    continue: "Tẹsiwaju",
    back: "Pada sẹhin", 
    next: "Atẹle",
    loading: "N gbe...",
    error: "Asise",
    success: "Aṣeyọri",
    
    // Civic engagement
    vote: "Dibo",
    voteNow: "Dibo Bayi",
    participate: "Kopa",
    community: "Agbegbe",
    governance: "Iṣakoso",
    transparency: "Ifihan gbangba",
    accountability: "Ibeere iṣiro",
    
    // SUP Token system
    supTokens: "SUP Tokens",
    earnTokens: "Gba Tokens",
    yourBalance: "Iye owo rẹ",
    tokenReward: "Ere Token",
    
    // Projects
    fundProject: "Fun Iṣẹ akanṣe ni owo",
    supportProject: "Ṣe atilẹyin fun Iṣẹ akanṣe", 
    projectFunding: "Ifunni Iṣẹ akanṣe",
    communityProjects: "Iṣẹ akanṣe Agbegbe",
    
    // Profile & KYC
    profile: "Profaili",
    verifyIdentity: "Jẹrisi idanimọ",
    kycVerification: "Ijẹrisi KYC", 
    credibleNigerian: "Omo Naijiria to gbẹkẹle",
    
    // Offline & connectivity
    offline: "Ni ita ọna",
    online: "Lori ila", 
    syncing: "N ṣepọ...",
    syncComplete: "Isepọ ti pari",
    connectionLost: "Isomọ ti sọnu",
    connectionRestored: "Ti mu isomọ pada",
  }
};

export type Language = keyof typeof translations;

export const supportedLanguages: Array<{ code: Language; name: string; nativeName: string }> = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ha', name: 'Hausa', nativeName: 'Hausa' },
  { code: 'ig', name: 'Igbo', nativeName: 'Igbo' },
  { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá' }
];