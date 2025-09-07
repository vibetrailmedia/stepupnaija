// Translation files for Step Up Naija multilingual support

import { Language } from '../lib/i18n';

// Translation interface defining all translatable strings
export interface Translations {
  // Navigation
  nav: {
    dashboard: string;
    wallet: string;
    engage: string;
    projects: string;
    transparency: string;
    profile: string;
    training: string;
    logout: string;
    language: string;
    leaders: string;
    challenge: string;
    about: string;
    help: string;
  };
  
  // Landing page
  landing: {
    title: string;
    subtitle: string;
    heroText: string;
    heroDescription: string;
    loginButton: string;
    learnMore: string;
    heroCallToAction: string;
    features: {
      civic: string;
      rewards: string;
      transparency: string;
    };
    tari: {
      badge: string;
      title: string;
      subtitle: string;
      videoTitle: string;
      videoDescription: string;
      profileTitle: string;
      profileDescription: string;
      welcome: string;
      description: string;
    };
    kamsi: {
      profileTitle: string;
      profileDescription: string;
      welcome: string;
      description: string;
    };
    challenge: {
      flagshipBadge: string;
      title: string;
      subtitle: string;
      mainDescription: string;
      heroCallToAction: string;
      features: {
        free: string;
        earnTokens: string;
        winPrizes: string;
      };
    };
  };
  
  // Dashboard
  dashboard: {
    welcome: string;
    totalTokens: string;
    citizenNumber: string;
    weeklyDraw: string;
    enterDraw: string;
    completeTasks: string;
    viewProjects: string;
  };
  
  // Wallet
  wallet: {
    balance: string;
    transactions: string;
    buyTokens: string;
    cashOut: string;
    noTransactions: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    close: string;
    save: string;
    cancel: string;
    continue: string;
    back: string;
    next: string;
    submit: string;
    complete: string;
  };
  
  // Challenge specific
  challenge: {
    title: string;
    description: string;
    eligibility: string;
    benefits: string;
  };
}

// English translations (base language)
export const en: Translations = {
  nav: {
    dashboard: 'Dashboard',
    wallet: 'Wallet',
    engage: 'Engage',
    projects: 'Projects',
    transparency: 'Transparency',
    profile: 'Profile',
    training: 'Training',
    logout: 'Logout',
    language: 'Language',
    leaders: 'Leaders',
    challenge: '#13K Challenge',
    about: 'About',
    help: 'Help'
  },
  landing: {
    title: 'Step Up Naija',
    subtitle: 'Empowering Citizens • Building Leaders',
    heroText: '🚀 Nigeria\'s largest leadership movement is here! Join 13,000 verified leaders transforming our nation through proven civic action across all 774 Local Government Areas.',
    heroDescription: 'Transform your community • Build lasting change • Shape Nigeria\'s future',
    loginButton: 'Get Started',
    learnMore: 'Nominate a Leader',
    heroCallToAction: 'Ready to join Nigeria\'s civic transformation? Your leadership journey starts here.',
    features: {
      civic: 'Participate in civic activities and earn rewards for your contributions to community development.',
      rewards: 'Earn SUP tokens through engagement and participate in weekly prize draws with real cash rewards.',
      transparency: 'Track all platform activities with full transparency and accountability in governance.'
    },
    tari: {
      badge: '🎬 CIVIC AUTHORITY GUIDE',
      title: 'Meet TARI',
      subtitle: 'AI-powered civic authority guides designed for effective messaging and communication on the platform',
      videoTitle: 'Meet Tari - Your Civic Authority Guide',
      videoDescription: 'Welcome! I\'m Tari, your AI-powered civic authority guide. I\'ll help you understand Nigeria\'s civic systems and navigate your leadership journey with clear, structured guidance.',
      profileTitle: 'AI Avatar • Authority Guide',
      profileDescription: 'As your AI-generated civic authority guide, I\'m designed to provide clear, effective messaging about the #13K Challenge across all 774 LGAs. I\'ll help you navigate this structured civic framework with consistent, accessible communication.',
      welcome: 'Welcome to Nigeria\'s leadership transformation.',
      description: 'The #13K Challenge represents our most systematic approach to building credible leadership across all 774 LGAs.'
    },
    kamsi: {
      profileTitle: 'AI Avatar • Community Guide',
      profileDescription: 'As your AI-generated community guide, I\'m designed to provide warm, supportive communication throughout your civic journey. I\'ll help you connect with fellow Nigerians and make this transformation meaningful and achievable!',
      welcome: 'Hello and welcome, future leader!',
      description: 'You\'re about to join an incredible community of Nigerians creating real change.'
    },
    challenge: {
      flagshipBadge: '🔥 FLAGSHIP INITIATIVE',
      title: '#13K CREDIBLE CHALLENGE',
      subtitle: 'Identify • Train • Organize',
      mainDescription: '13,000 credible Nigerian leaders across all 774 Local Government Areas',
      heroCallToAction: 'Ready to join Nigeria\'s civic transformation? Your leadership journey starts here.',
      features: {
        free: 'FREE to Join',
        earnTokens: 'Earn SUP Tokens',
        winPrizes: 'Win Real Prizes'
      }
    }
  },
  dashboard: {
    welcome: 'Welcome back',
    totalTokens: 'Total SUP Tokens',
    citizenNumber: 'Citizen Number',
    weeklyDraw: 'Weekly Prize Draw',
    enterDraw: 'Enter Draw',
    completeTasks: 'Complete Tasks',
    viewProjects: 'View Projects'
  },
  wallet: {
    balance: 'Token Balance',
    transactions: 'Recent Transactions',
    buyTokens: 'Buy Tokens',
    cashOut: 'Cash Out',
    noTransactions: 'No transactions yet'
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    close: 'Close',
    save: 'Save',
    cancel: 'Cancel',
    continue: 'Continue',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    complete: 'Complete'
  },
  challenge: {
    title: '13k Credible Challenge',
    description: 'Identifying, training and organizing 13,000 credible Nigerian leaders across all 774 Local Government Areas',
    eligibility: 'Open to all Nigerian citizens committed to positive change',
    benefits: 'Leadership training, networking opportunities, and community impact'
  }
};

// Hausa translations
export const ha: Translations = {
  nav: {
    dashboard: 'Dashboard',
    wallet: 'Walat',
    engage: 'Shiga',
    projects: 'Ayyuka',
    transparency: 'Gaskiya',
    profile: 'Bayani',
    training: 'Horo',
    logout: 'Fita',
    language: 'Harshe',
    leaders: 'Jagororin',
    challenge: '#13K Challenge',
    about: 'Game da Mu',
    help: 'Taimako'
  },
  landing: {
    title: 'Step Up Naija',
    subtitle: 'Ƙarfafa \'Yan ƙasa • Gina Jagororin Gaba',
    heroText: '🚀 Babban yunkurin jagoranci na Najeriya ya zo! Kasance tare da jagorannin 13,000 da aka tabbatar wajen canza ƙasarmu ta hanyar tabbatattu ayyukan jama\'a a duk gundumomin ƙananan hukumomi 774.',
    heroDescription: 'Canza al\'ummar ka • Gina canji mai dawwama • Tsara makomar Najeriya',
    loginButton: 'Fara',
    learnMore: 'Nada Jagora',
    heroCallToAction: 'A shirye kuke ku shiga canjin jagoranci na Najeriya? Tafiyar jagoranci ta ya fara nan.',
    features: {
      civic: 'Shiga cikin ayyukan jama\'a kuma ka sami lada saboda gudummawar ka ga ci gaban al\'umma.',
      rewards: 'Sami SUP tokens ta hanyar shiga kuma ka shiga cikin babban caca na mako-mako tare da kuɗin gaske.',
      transparency: 'Bi duk ayyukan dandamali tare da cikakken gaskiya da lissafi a mulki.'
    },
    tari: {
      badge: '🎬 JAGORAN HUKUMA',
      title: 'Haɗu da TARI',
      subtitle: 'Jagororin hukuma masu ƙarfi da AI waɗanda aka ƙera don sadarwar da saƙo mai tasiri a cikin dandamali',
      videoTitle: 'Gabatarwa zuwa #13K Credible Challenge',
      videoDescription: 'Gano tsarin Najeriya na gina jagoranci mai aminci a duk LGAs 774',
      profileTitle: 'AI Avatar • Jagoran Hukuma',
      profileDescription: 'A matsayin jagoran hukuma mai haihuwa ta AI, an ƙera ni don samar da saƙon da ke fayyace, mai tasiri game da #13K Challenge a duk LGAs 774. Zan taimaka muku da bin wannan tsarin jama\'a da daidaito, sadarwar da za a iya isa.',
      welcome: 'Maraba zuwa canjin jagorancin Najeriya.',
      description: '#13K Challenge yana wakiltar mafi kyawun hanyarmu ta gina jagoranci mai aminci a duk LGAs 774.'
    },
    kamsi: {
      profileTitle: 'AI Avatar • Jagoran Al\'umma',
      profileDescription: 'A matsayin jagoran al\'umma mai haihuwa ta AI, an ƙera ni don samar da sadarwar da ke da dumi, taimako a cikin tafiyar ku na jama\'a. Zan taimaka muku da haɗa kai da \'yan Najeriya kuma in yi wannan canjin mai ma\'ana da yuwuwa!',
      welcome: 'Sannu da zuwa, shugaban nan gaba!',
      description: 'Kuna shirin shiga al\'ummar Najeriyawa mai ban sha\'awa da ke haifar da canji na gaske.'
    },
    challenge: {
      flagshipBadge: '🔥 BABBAN AIKI',
      title: '#13K CREDIBLE CHALLENGE',
      subtitle: 'Gano • Horar • Shirya',
      mainDescription: 'Jagorannin Najeriya 13,000 masu amana a duk gundumomin ƙananan hukumomi 774',
      heroCallToAction: 'A shirye kuke ku shiga canjin jagoranci na Najeriya? Tafiyar jagoranci ta ya fara nan.',
      features: {
        free: 'KYAUTA don Shiga',
        earnTokens: 'Sami SUP Tokens',
        winPrizes: 'Cin Lambobin Gaske'
      }
    }
  },
  dashboard: {
    welcome: 'Maraba da zuwa',
    totalTokens: 'Jimlar SUP Tokens',
    citizenNumber: 'Lambar ɗan ƙasa',
    weeklyDraw: 'Babban Caca na Mako',
    enterDraw: 'Shiga Caca',
    completeTasks: 'Kammala Ayyuka',
    viewProjects: 'Duba Ayyuka'
  },
  wallet: {
    balance: 'Ma\'aunin Token',
    transactions: 'Mu\'amaloli na Kwanan nan',
    buyTokens: 'Sayi Tokens',
    cashOut: 'Fitar da Kuɗi',
    noTransactions: 'Babu mu\'amala har yanzu'
  },
  common: {
    loading: 'Ana lodi...',
    error: 'Kuskure',
    success: 'Nasara',
    close: 'Rufe',
    save: 'Ajiye',
    cancel: 'Soke',
    continue: 'Ci gaba',
    back: 'Koma baya',
    next: 'Na gaba',
    submit: 'Mika',
    complete: 'Kammala'
  },
  challenge: {
    title: '13k Credible Challenge',
    description: 'Gano, horar da shirya jagorannin Najeriya 13,000 masu amana a duk gundumomin ƙananan hukumomi 774',
    eligibility: 'Buɗe ga duk \'yan ƙasar Najeriya masu niyyar sauyi mai kyau',
    benefits: 'Horon jagoranci, damar sadarwa, da tasirin al\'umma'
  }
};

// Yoruba translations
export const yo: Translations = {
  nav: {
    dashboard: 'Dashboard',
    wallet: 'Àpamọ́wọ́',
    engage: 'Kópa',
    projects: 'Àwọn Iṣẹ́',
    transparency: 'Ìfọnayà',
    profile: 'Àkọsílẹ̀',
    training: 'Ìkẹ́kọ̀ọ́',
    logout: 'Jáde',
    language: 'Èdè',
    leaders: 'Àwọn Olórí',
    challenge: '#13K Challenge',
    about: 'Nípa Wa',
    help: 'Ìrànlọ́wọ́'
  },
  landing: {
    title: 'Step Up Naija',
    subtitle: 'Ìfúnni Àgbára Ọmọ Ìlú • Kíkọ́ Àwọn Olórí',
    heroText: '🚀 Ẹgbẹ́ ìdarí tó tóbi jù lọ ní Nàìjíríà ti dé! Darapọ̀ mọ́ àwọn olórí 13,000 tí a ti fọwọ́sí láti yí orílẹ̀-èdè wa padà nípa àwọn iṣẹ́ ìlókóko tó dájú ní gbogbo agbègbè ìjọba ìbílẹ̀ 774.',
    heroDescription: 'Yí àgbègbè rẹ padà • Kọ́ àyípadà tó lágbára • Ṣe àpẹrẹ ọjọ́ iwájú Nàìjíríà',
    loginButton: 'Bẹ̀rẹ̀',
    learnMore: 'Yan Olórí Kan',
    heroCallToAction: 'Ṣe tí o ti ṣetán láti dara pọ̀ mọ́ àyípadà ìlú Nàìjíríà? Ìrìnàjò ìdarí rẹ bẹ̀rẹ̀ níbí.',
    features: {
      civic: 'Kópa nínú àwọn iṣẹ́ ìlókóko kí o sì gba àwọn ẹ̀bùn fún àwọn ìlọ́wọ́si rẹ sí ìdàgbàsókè àgbègbè.',
      rewards: 'Gba SUP tokens nípasẹ̀ ìkópa kí o sì kópa nínú àwọn ìyọ ẹ̀bùn òṣùùṣù pẹ̀lú àwọn ẹ̀bùn owó gidi.',
      transparency: 'Tọpa gbogbo àwọn iṣẹ́ pẹpẹ pẹ̀lú ìfọnayà kíkún àti àìṣègbè nínú ìjọba.'
    },
    tari: {
      badge: '🎬 AMỌ̀NÀ ÀṢẸ ÌLÚ',
      title: 'Pàdé TARI',
      subtitle: 'Àwọn amọ̀nà àṣẹ ìlú tí AI ṣe àgbékalẹ̀ fún ìránṣẹ́ tó múnadóko àti ìbánisọ̀rọ̀ lórí pẹpẹ náà',
      videoTitle: 'Ìfihàn sí #13K Credible Challenge',
      videoDescription: 'Ṣàwárí ìlànà Nàìjíríà láti kọ́ ìdarí tó ṣe é gbẹ́kẹ̀lé ní gbogbo LGAs 774',
      profileTitle: 'AI Avatar • Amọ̀nà Àṣẹ',
      profileDescription: 'Gẹ́gẹ́ bí amọ̀nà àṣẹ ìlú tí AI dá, a ti ṣe mí láti pèsè ìránṣẹ́ tó kedere, tó múnadóko nípa #13K Challenge ní gbogbo LGAs 774. Màá ṣe àmọ̀nà rẹ nípa ètò ìlú yìí pẹ̀lú ìbánisọ̀rọ̀ tó péye, tí o sì ṣe é rí.',
      welcome: 'Kábọ̀ọ́ sí ìyípadà ìdarí Nàìjíríà.',
      description: '#13K Challenge jẹ́ ìlànà wa tó dára jùlọ láti kọ́ ìdarí tó ṣe é gbẹ́kẹ̀lé ní gbogbo LGAs 774.'
    },
    kamsi: {
      profileTitle: 'AI Avatar • Amọ̀nà Àgbègbè',
      profileDescription: 'Gẹ́gẹ́ bí amọ̀nà àgbègbè tí AI dá, a ti ṣe mí láti pèsè ìbánisọ̀rọ̀ tí ó lọ́wọ̀rọ̀, tó sì ń ṣe àtìlẹ́yìn ní gbogbo ìrìnàjò rẹ ní ti ìlú. Màá ṣe ìrànlọ́wọ́ láti so mọ́ àwọn ọmọ Nàìjíríà mìíràn kí a sì jẹ́ kí ìyípadà yìí níye lórí, tó sì ṣe é ṣe!',
      welcome: 'Kábọ̀ọ́ àti kábọ̀ọ́, olórí ọjọ́ iwájú!',
      description: 'O fẹ́ darapọ̀ mọ́ àgbègbè àwọn ọmọ Nàìjíríà tó ní ìfẹ́kúfẹ̀ẹ́ tí ń dá àyípadà gidi sílẹ̀.'
    },
    challenge: {
      flagshipBadge: '🔥 IṢẸ́ ÀKỌKỌ́',
      title: '#13K CREDIBLE CHALLENGE',
      subtitle: 'Dá mọ̀ • Kọ́ • Ṣe Ìlànà',
      mainDescription: 'Àwọn olórí Nàìjíríà 13,000 tó ṣe é gbẹ́kẹ̀lé ní gbogbo Àwọn Agbègbè Ìjọba Ìbílẹ̀ 774',
      heroCallToAction: 'Ṣe tí o ti ṣetán láti dara pọ̀ mọ́ àyípadà ìlú Nàìjíríà? Ìrìnàjò ìdarí rẹ bẹ̀rẹ̀ níbí.',
      features: {
        free: 'ỌFẸ́ láti Wọlé',
        earnTokens: 'Gba SUP Tokens',
        winPrizes: 'Gba Àwọn Ẹ̀bùn Gidi'
      }
    }
  },
  dashboard: {
    welcome: 'Kábọ̀ọ́ sí',
    totalTokens: 'Àpapọ̀ SUP Tokens',
    citizenNumber: 'Nọ́mbà Ọmọ Ìlú',
    weeklyDraw: 'Ìyọ Ẹ̀bùn Òṣùùṣù',
    enterDraw: 'Wọ Ìyọ',
    completeTasks: 'Parí Àwọn Iṣẹ́',
    viewProjects: 'Wo Àwọn Iṣẹ́'
  },
  wallet: {
    balance: 'Ìwọ̀ntúnwọ̀nsì Token',
    transactions: 'Àwọn Òwò Ọ̀tún',
    buyTokens: 'Ra Tokens',
    cashOut: 'Yọ Owó',
    noTransactions: 'Kò sí òwò kan síbẹ̀'
  },
  common: {
    loading: 'Ó ń gbé...',
    error: 'Àṣìṣe',
    success: 'Àṣeyọrí',
    close: 'Tì',
    save: 'Fi Pamọ́',
    cancel: 'Fagilee',
    continue: 'Tẹ̀síwájú',
    back: 'Padà sẹ́yìn',
    next: 'Tókàn',
    submit: 'Fìlélẹ̀',
    complete: 'Parí'
  },
  challenge: {
    title: '13k Credible Challenge',
    description: 'Dímọ̀, kọ́ àti ṣètò àwọn olórí Nàìjíríà 13,000 tó ṣe é gbẹ́kẹ̀lé ní gbogbo àwọn Agbègbè Ìjọba Ìbílẹ̀ 774',
    eligibility: 'Ṣíṣí sílẹ̀ fún gbogbo ọmọ ìlú Nàìjíríà tó ní ìpinnu láti ṣe àyípadà rere',
    benefits: 'Ìkẹ́kọ̀ọ́ ìdarí, àwọn àǹfààní ìbáraẹnisọ̀rọ̀, àti ipa àgbègbè'
  }
};

// Igbo translations
export const ig: Translations = {
  nav: {
    dashboard: 'Dashboard',
    wallet: 'Àkpà ego',
    engage: 'Sonye',
    projects: 'Ọrụ ndị',
    transparency: 'Nghọta',
    profile: 'Profaịlụ',
    training: 'Ọzụzụ',
    logout: 'Pụọ',
    language: 'Asụsụ',
    leaders: 'Ndị Ndu',
    challenge: '#13K Challenge',
    about: 'Banyere Anyị',
    help: 'Enyemaka'
  },
  landing: {
    title: 'Step Up Naija',
    subtitle: 'Inye Ụmụ Obodo Ike • Iwulite Ndị Ndu',
    heroText: '🚀 Nnukwu mmegharị nduzi Naịjirịa abịala! Sonye na ndị ndu 13,000 akwadoro na-agbanwe mba anyị site na ọrụ ọha na eze kwesịrị ntụkwasị obi n\'obodo 774 niile.',
    heroDescription: 'Gbanwee obodo gị • Wulite mgbanwe ga-adịgide • Kpụọ ọdịnihu Naịjirịa',
    loginButton: 'Malite',
    learnMore: 'Họpụta Onye Ndu',
    heroCallToAction: 'Ị dị njikere isonye na mgbanwe civic Naịjirịa? Njem leadership gị na-amalite ebe a.',
    features: {
      civic: 'Sonye na ọrụ ọha na eze ma nweta ụgwọ ọrụ maka ntinye aka gị na mmepe obodo.',
      rewards: 'Nweta SUP tokens site na iso ma sonye na ịsa nza kwa izu nke nwere ego n\'ezie.',
      transparency: 'Soro ọrụ niile nke ikpo okwu na nghọta zuru ezu na ịza ajụjụ na ọchịchị.'
    },
    tari: {
      badge: '🎬 ONYE NDU IKIKE OBODO',
      title: 'Zute TARI',
      subtitle: 'Ndị ndu ikike obodo AI arụpụtara maka ọrụ nkwukọrịta dị irè na nkwurịta okwu na nyiwe ahụ',
      videoTitle: 'Mmalite na #13K Credible Challenge',
      videoDescription: 'Chọpụta usoro Naịjirịa iji wuo ndu kwesịrị ntụkwasị obi n\'obodo 774 niile',
      profileTitle: 'AI Avatar • Onye Ndu Ikike',
      profileDescription: 'Dị ka onye ndu ikike obodo AI mụrụ m, e mere m ka m nye ọrụ nkwukọrịta doro anya, dị irè banyere #13K Challenge n\'obodo 774 niile. Aga m enyere gị aka iji usoro obodo a na nkwukọrịta dị mfe, enwere ike iru ya.',
      welcome: 'Nnọọ na mgbanwe ndu Naịjirịa.',
      description: '#13K Challenge bụ usoro anyị kachasị mma iji wuo ndu kwesịrị ntụkwasị obi n\'obodo 774 niile.'
    },
    kamsi: {
      profileTitle: 'AI Avatar • Onye Ndu Obodo',
      profileDescription: 'Dị ka onye ndu obodo AI mụrụ m, e mere m ka m nye nkwukọrịta na-ekpo ọkụ, na-akwado n\'ije obodo gị niile. Aga m enyere gị aka ka gị na ndị Naịjirịa ibe gị jikọọ ma mee ka mgbanwe a nwee isi ma bụrụ ihe ga-eme!',
      welcome: 'Ndewo na nnọọ, onye ndu ọdịnihu!',
      description: 'Ị na-achọ isonye na obodo ndị Naịjirịa na-atọ ụtọ na-eme mgbanwe n\'ezie.'
    },
    challenge: {
      flagshipBadge: '🔥 ỌRỤ IZIZI',
      title: '#13K CREDIBLE CHALLENGE',
      subtitle: 'Chọta • Zụọ • Hazie',
      mainDescription: 'Ndị ndu Naịjirịa 13,000 kwesịrị ntụkwasị obi n\'obodo 774 niile',
      heroCallToAction: 'Ị dị njikere isonye na mgbanwe civic Naịjirịa? Njem leadership gị na-amalite ebe a.',
      features: {
        free: 'EGOGHỊ ka ị Sonye',
        earnTokens: 'Nweta SUP Tokens',
        winPrizes: 'Merie Onyinye N\'ezie'
      }
    }
  },
  dashboard: {
    welcome: 'Nnọọ azụ',
    totalTokens: 'Ngụkọta SUP Tokens',
    citizenNumber: 'Nọmba Nwa Obodo',
    weeklyDraw: 'Ịsa Nza Kwa Izu',
    enterDraw: 'Banye Ịsa Nza',
    completeTasks: 'Mechaa Ọrụ',
    viewProjects: 'Lee Ọrụ ndị'
  },
  wallet: {
    balance: 'Nguzozi Token',
    transactions: 'Azụmahịa Ọhụrụ',
    buyTokens: 'Zụta Tokens',
    cashOut: 'Wepụta Ego',
    noTransactions: 'Ọ dịghị azụmahịa ka'
  },
  common: {
    loading: 'Na-ebu...',
    error: 'Njehie',
    success: 'Ihe ịga nke ọma',
    close: 'Mechie',
    save: 'Chekwaa',
    cancel: 'Kwụsị',
    continue: 'Gaa n\'ihu',
    back: 'Laghachi azụ',
    next: 'Osote',
    submit: 'Nyefee',
    complete: 'Mechaa'
  },
  challenge: {
    title: '13k Credible Challenge',
    description: 'Ịchọta, ịzụ na ịhazi ndị ndu Naịjirịa 13,000 kwesịrị ntụkwasị obi n\'obodo 774 niile',
    eligibility: 'Meghere maka ụmụ Naịjirịa niile kwenyere na mgbanwe ọma',
    benefits: 'Ọzụzụ nduzi, ohere mmekọrịta, na mmetụta obodo'
  }
};

// Translation collections
export const translations: Record<Language, Translations> = {
  en,
  ha,
  yo,
  ig
};

// Get translation for specific language
export function getTranslations(language: Language): Translations {
  return translations[language] || translations.en;
}