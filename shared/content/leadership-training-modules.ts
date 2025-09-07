// Comprehensive Leadership Training Modules for Step Up Naija
// Real educational content for Nigerian civic leaders

export interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  objectives: string[];
  prerequisites?: string[];
  certificateEligible: boolean;
  passingScore: number;
  content: {
    introduction: string;
    sections: TrainingSection[];
    practicalExercises: PracticalExercise[];
    caseStudies: CaseStudy[];
    resources: Resource[];
  };
  quiz: QuizQuestion[];
}

export interface TrainingSection {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  examples?: string[];
}

export interface PracticalExercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  expectedOutcome: string;
  timeRequired: number; // minutes
}

export interface CaseStudy {
  id: string;
  title: string;
  background: string;
  challenge: string;
  questions: string[];
  learningPoints: string[];
}

export interface Resource {
  title: string;
  type: 'article' | 'video' | 'document' | 'website';
  url?: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export const leadershipTrainingModules: TrainingModule[] = [
  // BEGINNER LEVEL - FOUNDATION MODULES
  {
    id: 'leadership_foundations',
    title: 'Leadership Foundations for Nigerian Communities',
    description: 'Essential principles of leadership in the Nigerian context, covering traditional and modern leadership approaches.',
    duration: 45,
    difficulty: 'beginner',
    category: 'Leadership Fundamentals',
    objectives: [
      'Understand different leadership styles relevant to Nigerian communities',
      'Identify personal leadership strengths and development areas',
      'Learn the characteristics of effective community leaders',
      'Apply basic leadership principles in daily interactions'
    ],
    certificateEligible: true,
    passingScore: 70,
    content: {
      introduction: 'Leadership in Nigeria requires understanding both traditional wisdom and modern approaches. This module explores what makes an effective leader in diverse Nigerian communities.',
      sections: [
        {
          id: 'what_is_leadership',
          title: 'What is Leadership?',
          content: 'Leadership is the ability to influence, inspire, and guide others toward achieving common goals. In Nigerian communities, leadership often combines traditional values of service with modern organizational skills.',
          keyPoints: [
            'Leadership is about service, not self-benefit',
            'Effective leaders listen more than they speak',
            'Community trust is earned through consistent actions',
            'Leaders must understand local context and culture'
          ],
          examples: [
            'Chief Obafemi Awolowo\'s focus on education and community development',
            'Traditional chiefs who mediate conflicts and preserve cultural values',
            'Modern community leaders organizing neighborhood improvement projects'
          ]
        },
        {
          id: 'leadership_styles',
          title: 'Leadership Styles in Nigerian Context',
          content: 'Different situations require different leadership approaches. Understanding various styles helps leaders adapt to community needs.',
          keyPoints: [
            'Democratic leadership: Building consensus through consultation',
            'Servant leadership: Putting community needs first',
            'Transformational leadership: Inspiring positive change',
            'Situational leadership: Adapting style to circumstances'
          ],
          examples: [
            'Town hall meetings for democratic decision-making',
            'Leaders who personally contribute to community projects',
            'Mobilizing youth for environmental clean-up campaigns'
          ]
        },
        {
          id: 'building_trust',
          title: 'Building Trust and Credibility',
          content: 'Trust is the foundation of effective leadership. In Nigerian communities, trust is built through integrity, consistency, and genuine care for people\'s welfare.',
          keyPoints: [
            'Keep promises and commitments',
            'Be transparent in decision-making',
            'Admit mistakes and learn from them',
            'Show respect for all community members'
          ]
        }
      ],
      practicalExercises: [
        {
          id: 'personal_leadership_assessment',
          title: 'Personal Leadership Assessment',
          description: 'Evaluate your current leadership strengths and areas for growth',
          instructions: [
            'List 5 situations where you have influenced others positively',
            'Identify which leadership style you naturally use',
            'Ask 3 people to describe your leadership qualities',
            'Create a development plan for one area of improvement'
          ],
          expectedOutcome: 'Clear understanding of personal leadership profile and development priorities',
          timeRequired: 30
        }
      ],
      caseStudies: [
        {
          id: 'community_water_project',
          title: 'Leading a Community Water Project',
          background: 'A rural community in Kaduna State lacks access to clean water. Several attempts to address this have failed due to poor leadership and community conflicts.',
          challenge: 'How would you organize the community to successfully implement a water project?',
          questions: [
            'What leadership style would be most effective in this situation?',
            'How would you build consensus among different community factions?',
            'What steps would you take to ensure project sustainability?'
          ],
          learningPoints: [
            'Inclusive consultation builds stronger buy-in',
            'Addressing underlying conflicts is essential for success',
            'Local ownership ensures project sustainability'
          ]
        }
      ],
      resources: [
        {
          title: 'Traditional Leadership in Nigeria',
          type: 'article',
          description: 'Understanding the role of traditional institutions in modern governance'
        },
        {
          title: 'Servant Leadership Principles',
          type: 'document',
          description: 'Key principles of leadership as service to community'
        }
      ]
    },
    quiz: [
      {
        id: 'lf_q1',
        question: 'What is the most important foundation of leadership in Nigerian communities?',
        options: ['Educational qualification', 'Financial resources', 'Trust and integrity', 'Government connections'],
        correctAnswer: 'Trust and integrity',
        explanation: 'Trust and integrity form the foundation of effective leadership because they enable leaders to influence and mobilize communities for positive change.',
        points: 10
      },
      {
        id: 'lf_q2',
        question: 'Which leadership style emphasizes building consensus through consultation?',
        options: ['Autocratic', 'Democratic', 'Laissez-faire', 'Transformational'],
        correctAnswer: 'Democratic',
        explanation: 'Democratic leadership involves community members in decision-making through consultation and consensus-building.',
        points: 10
      },
      {
        id: 'lf_q3',
        question: 'What should a leader do when they make a mistake?',
        options: ['Hide it to protect reputation', 'Blame others', 'Admit it and learn from it', 'Ignore it and move on'],
        correctAnswer: 'Admit it and learn from it',
        explanation: 'Admitting mistakes and learning from them builds trust and shows humility, which are important leadership qualities.',
        points: 10
      }
    ]
  },

  // INTERMEDIATE LEVEL - COMMUNITY ORGANIZING
  {
    id: 'community_organizing',
    title: 'Community Organizing and Mobilization',
    description: 'Learn practical skills for organizing communities, building coalitions, and mobilizing people for positive change.',
    duration: 60,
    difficulty: 'intermediate',
    category: 'Community Development',
    prerequisites: ['leadership_foundations'],
    objectives: [
      'Master the fundamentals of community organizing',
      'Develop skills in stakeholder mapping and coalition building',
      'Learn effective communication and mobilization strategies',
      'Apply organizing principles to real community challenges'
    ],
    certificateEligible: true,
    passingScore: 75,
    content: {
      introduction: 'Community organizing is the process of building power through the collective action of people around shared concerns. This module teaches proven strategies for mobilizing Nigerian communities.',
      sections: [
        {
          id: 'organizing_fundamentals',
          title: 'Fundamentals of Community Organizing',
          content: 'Community organizing involves bringing people together around shared issues to create positive change. It requires understanding community dynamics, building relationships, and developing collective action strategies.',
          keyPoints: [
            'Start with listening to understand community concerns',
            'Build relationships before building programs',
            'Identify and develop local leadership',
            'Focus on winnable issues that build confidence'
          ]
        },
        {
          id: 'stakeholder_mapping',
          title: 'Stakeholder Mapping and Coalition Building',
          content: 'Effective organizing requires understanding who has influence, resources, and interest in community issues. Stakeholder mapping helps identify potential allies and opposition.',
          keyPoints: [
            'Map formal and informal power structures',
            'Identify champions, opponents, and neutrals',
            'Build diverse coalitions for broader impact',
            'Develop strategies for different stakeholder groups'
          ]
        },
        {
          id: 'mobilization_strategies',
          title: 'Communication and Mobilization Strategies',
          content: 'Getting people involved requires clear communication, compelling messaging, and accessible participation opportunities.',
          keyPoints: [
            'Use multiple communication channels (face-to-face, radio, social media)',
            'Frame issues in terms of shared values and interests',
            'Create low-risk entry points for participation',
            'Celebrate small wins to maintain momentum'
          ]
        }
      ],
      practicalExercises: [
        {
          id: 'community_issue_analysis',
          title: 'Community Issue Analysis',
          description: 'Analyze a real community issue using organizing principles',
          instructions: [
            'Choose a specific community issue you care about',
            'Conduct 5 one-on-one conversations with community members',
            'Create a stakeholder map for this issue',
            'Develop a strategy for organizing around this issue'
          ],
          expectedOutcome: 'Comprehensive analysis and action plan for a community issue',
          timeRequired: 60
        }
      ],
      caseStudies: [
        {
          id: 'market_rehabilitation',
          title: 'Organizing for Market Rehabilitation',
          background: 'Traders in Aba Main Market are facing deteriorating infrastructure, poor sanitation, and security challenges. Previous efforts to get government attention have failed.',
          challenge: 'How would you organize the traders and community to address these challenges?',
          questions: [
            'How would you identify and engage key stakeholders?',
            'What coalition-building strategy would you use?',
            'How would you frame the issue to generate broader support?'
          ],
          learningPoints: [
            'Economic arguments often resonate with government officials',
            'Including multiple stakeholder groups strengthens advocacy',
            'Media coverage can amplify community voices'
          ]
        }
      ],
      resources: [
        {
          title: 'Community Organizing Handbook',
          type: 'document',
          description: 'Practical guide to organizing communities for change'
        },
        {
          title: 'Stakeholder Analysis Tools',
          type: 'document',
          description: 'Templates and tools for mapping community stakeholders'
        }
      ]
    },
    quiz: [
      {
        id: 'co_q1',
        question: 'What is the first step in effective community organizing?',
        options: ['Fundraising', 'Media campaigns', 'Listening to community concerns', 'Government meetings'],
        correctAnswer: 'Listening to community concerns',
        explanation: 'Effective organizing starts with listening to understand what people really care about and are willing to act on.',
        points: 15
      },
      {
        id: 'co_q2',
        question: 'What makes a coalition stronger?',
        options: ['Having the same type of organizations', 'Including diverse stakeholder groups', 'Focusing on single issues only', 'Excluding opposition voices'],
        correctAnswer: 'Including diverse stakeholder groups',
        explanation: 'Diverse coalitions bring different resources, perspectives, and constituencies, making them more powerful and credible.',
        points: 15
      },
      {
        id: 'co_q3',
        question: 'Why is it important to start with "winnable" issues?',
        options: ['They require less effort', 'They build confidence and momentum', 'They avoid controversy', 'They cost less money'],
        correctAnswer: 'They build confidence and momentum',
        explanation: 'Early wins build people\'s confidence in collective action and create momentum for tackling bigger challenges.',
        points: 15
      }
    ]
  },

  // ADVANCED LEVEL - GOVERNANCE & ACCOUNTABILITY
  {
    id: 'governance_accountability',
    title: 'Governance and Accountability in Public Service',
    description: 'Advanced training on governance principles, accountability mechanisms, and transparency in public service.',
    duration: 75,
    difficulty: 'advanced',
    category: 'Governance',
    prerequisites: ['leadership_foundations', 'community_organizing'],
    objectives: [
      'Understand principles of good governance and accountability',
      'Learn tools for promoting transparency in public institutions',
      'Develop skills in policy analysis and advocacy',
      'Apply accountability mechanisms to real governance challenges'
    ],
    certificateEligible: true,
    passingScore: 80,
    content: {
      introduction: 'Good governance requires transparency, accountability, participation, and responsiveness. This module equips leaders with tools to promote accountability and improve governance at all levels.',
      sections: [
        {
          id: 'governance_principles',
          title: 'Principles of Good Governance',
          content: 'Good governance is characterized by participation, transparency, accountability, effectiveness, equity, and rule of law. Understanding these principles helps leaders promote better governance.',
          keyPoints: [
            'Participation: Meaningful involvement of citizens in decision-making',
            'Transparency: Open access to information and decision-making processes',
            'Accountability: Responsibility for decisions and actions',
            'Effectiveness: Achieving intended outcomes efficiently',
            'Equity: Fair treatment and inclusive policies',
            'Rule of law: Consistent application of laws and regulations'
          ]
        },
        {
          id: 'accountability_mechanisms',
          title: 'Accountability Mechanisms and Tools',
          content: 'Various tools exist to hold public officials accountable, from formal oversight to citizen monitoring and advocacy.',
          keyPoints: [
            'Legislative oversight and budget monitoring',
            'Judicial review and anti-corruption agencies',
            'Citizen report cards and community scorecards',
            'Freedom of Information Act requests',
            'Public hearings and town halls',
            'Media investigations and advocacy campaigns'
          ]
        },
        {
          id: 'policy_advocacy',
          title: 'Policy Analysis and Advocacy',
          content: 'Effective advocacy requires understanding policy processes, analyzing proposals, and developing evidence-based arguments for change.',
          keyPoints: [
            'Understanding policy-making processes',
            'Analyzing policy impacts on different groups',
            'Developing evidence-based advocacy strategies',
            'Building coalitions for policy change',
            'Using research and data effectively'
          ]
        }
      ],
      practicalExercises: [
        {
          id: 'accountability_project',
          title: 'Design an Accountability Project',
          description: 'Create a project to promote accountability in your local government',
          instructions: [
            'Identify a specific governance issue in your area',
            'Research the relevant laws, policies, and institutions',
            'Design an accountability intervention (e.g., budget tracking, service monitoring)',
            'Develop an implementation plan with timelines and resources',
            'Create monitoring and evaluation indicators'
          ],
          expectedOutcome: 'Complete project proposal for promoting governance accountability',
          timeRequired: 90
        }
      ],
      caseStudies: [
        {
          id: 'budget_transparency',
          title: 'Promoting Budget Transparency in Rivers State',
          background: 'Civil society organizations in Rivers State want to improve transparency in state budget processes to ensure better allocation of resources for public services.',
          challenge: 'Design a comprehensive strategy to promote budget transparency and citizen participation in budget processes.',
          questions: [
            'What accountability mechanisms would be most effective?',
            'How would you build capacity for citizen budget monitoring?',
            'What partnerships would strengthen this initiative?'
          ],
          learningPoints: [
            'Multiple accountability tools working together are more effective',
            'Citizen capacity building is essential for sustainable monitoring',
            'Government partnerships can improve access to information'
          ]
        }
      ],
      resources: [
        {
          title: 'Nigeria\'s Freedom of Information Act',
          type: 'document',
          description: 'Legal framework for accessing government information'
        },
        {
          title: 'Budget Monitoring Tools',
          type: 'document',
          description: 'Practical tools for tracking government budgets and expenditures'
        },
        {
          title: 'Public Participation in Governance',
          type: 'article',
          description: 'Strategies for meaningful citizen engagement in governance'
        }
      ]
    },
    quiz: [
      {
        id: 'ga_q1',
        question: 'Which of these is NOT a principle of good governance?',
        options: ['Transparency', 'Accountability', 'Exclusivity', 'Participation'],
        correctAnswer: 'Exclusivity',
        explanation: 'Good governance emphasizes inclusion and participation, not exclusivity. All principles of good governance promote openness and citizen involvement.',
        points: 20
      },
      {
        id: 'ga_q2',
        question: 'What is the primary purpose of Freedom of Information laws?',
        options: ['Protect government secrets', 'Promote transparency', 'Reduce corruption', 'Increase efficiency'],
        correctAnswer: 'Promote transparency',
        explanation: 'Freedom of Information laws primarily aim to promote transparency by giving citizens the right to access government information.',
        points: 20
      },
      {
        id: 'ga_q3',
        question: 'Which accountability mechanism involves citizens directly monitoring government services?',
        options: ['Legislative oversight', 'Judicial review', 'Community scorecards', 'Media investigations'],
        correctAnswer: 'Community scorecards',
        explanation: 'Community scorecards are tools that enable citizens to directly assess and rate the quality of government services they receive.',
        points: 20
      }
    ]
  }
];

// Training module utilities
export const getModulesByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
  return leadershipTrainingModules.filter(module => module.difficulty === difficulty);
};

export const getModulesByCategory = (category: string) => {
  return leadershipTrainingModules.filter(module => module.category === category);
};

export const getPrerequisites = (moduleId: string) => {
  const module = leadershipTrainingModules.find(m => m.id === moduleId);
  return module?.prerequisites || [];
};

export const calculateTotalTrainingTime = (moduleIds: string[]) => {
  return moduleIds.reduce((total, id) => {
    const module = leadershipTrainingModules.find(m => m.id === id);
    return total + (module?.duration || 0);
  }, 0);
};