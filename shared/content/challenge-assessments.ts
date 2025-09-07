// #13kCredibleChallenge Assessment Materials
// Comprehensive evaluation tools for identifying credible leaders

export interface ChallengeAssessment {
  id: string;
  title: string;
  description: string;
  category: 'integrity' | 'competence' | 'commitment' | 'comprehensive';
  timeLimit: number; // minutes
  totalPoints: number;
  passingScore: number;
  sections: AssessmentSection[];
}

export interface AssessmentSection {
  id: string;
  title: string;
  description: string;
  timeLimit?: number;
  questions: AssessmentQuestion[];
}

export interface AssessmentQuestion {
  id: string;
  type: 'multiple_choice' | 'scenario' | 'essay' | 'ranking' | 'self_reflection';
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  evaluationCriteria?: string[];
  timeLimit?: number;
}

export const challengeAssessments: ChallengeAssessment[] = [
  // INTEGRITY ASSESSMENT
  {
    id: 'integrity_assessment',
    title: 'Integrity and Ethical Leadership Assessment',
    description: 'Evaluate ethical decision-making, honesty, and moral character essential for credible leadership.',
    category: 'integrity',
    timeLimit: 45,
    totalPoints: 100,
    passingScore: 80,
    sections: [
      {
        id: 'ethical_scenarios',
        title: 'Ethical Decision-Making Scenarios',
        description: 'Real-world scenarios testing ethical judgment and integrity',
        timeLimit: 25,
        questions: [
          {
            id: 'int_scenario_01',
            type: 'scenario',
            question: 'You are a community leader organizing a development project. A contractor offers you a personal gift worth ₦500,000 to award them the contract, even though they are qualified. What do you do?',
            options: [
              'Accept the gift since the contractor is qualified anyway',
              'Reject the gift and evaluate all contractors fairly through transparent process',
              'Accept the gift but still evaluate other contractors',
              'Report the contractor to authorities for attempted bribery'
            ],
            correctAnswer: 'Reject the gift and evaluate all contractors fairly through transparent process',
            points: 15,
            evaluationCriteria: [
              'Demonstrates understanding of conflict of interest',
              'Shows commitment to fair and transparent processes',
              'Recognizes ethical implications of accepting gifts',
              'Prioritizes community interest over personal benefit'
            ]
          },
          {
            id: 'int_scenario_02',
            type: 'scenario',
            question: 'You discover that your close friend, who works in the local government, has been inflating contract amounts and pocketing the difference. They ask you to stay quiet, promising to share some money with you. How do you respond?',
            options: [
              'Stay quiet to protect the friendship',
              'Accept the money but encourage them to stop',
              'Report the corruption through appropriate channels',
              'Confront them privately and threaten to expose them'
            ],
            correctAnswer: 'Report the corruption through appropriate channels',
            points: 20,
            evaluationCriteria: [
              'Prioritizes public interest over personal relationships',
              'Demonstrates courage to do the right thing',
              'Understands proper reporting mechanisms',
              'Shows commitment to fighting corruption'
            ]
          },
          {
            id: 'int_scenario_03',
            type: 'scenario',
            question: 'During a community meeting, you realize you made an error in the budget presentation that makes a project look more affordable than it actually is. The community is excited about the project. What do you do?',
            options: [
              'Proceed with the meeting and correct it later privately',
              'Immediately acknowledge the error and provide correct information',
              'Finish the meeting and send corrections via text message',
              'Ask someone else to make the correction'
            ],
            correctAnswer: 'Immediately acknowledge the error and provide correct information',
            points: 15,
            evaluationCriteria: [
              'Demonstrates honesty and transparency',
              'Shows accountability for mistakes',
              'Prioritizes accurate information over convenience',
              'Respects community\'s right to correct information'
            ]
          }
        ]
      },
      {
        id: 'integrity_principles',
        title: 'Integrity Principles and Values',
        description: 'Understanding of core integrity principles',
        timeLimit: 20,
        questions: [
          {
            id: 'int_principle_01',
            type: 'multiple_choice',
            question: 'What is the most important characteristic of a leader with integrity?',
            options: [
              'Never making mistakes',
              'Always being popular with everyone',
              'Consistency between words and actions',
              'Having perfect knowledge of all issues'
            ],
            correctAnswer: 'Consistency between words and actions',
            points: 10,
            evaluationCriteria: [
              'Understands integrity as behavioral consistency',
              'Recognizes that integrity is about authenticity, not perfection'
            ]
          },
          {
            id: 'int_principle_02',
            type: 'multiple_choice',
            question: 'When facing pressure to compromise your values, what should guide your decision?',
            options: [
              'What will make the most people happy',
              'What will benefit you personally',
              'What aligns with your core principles and the greater good',
              'What will avoid immediate conflict'
            ],
            correctAnswer: 'What aligns with your core principles and the greater good',
            points: 10,
            evaluationCriteria: [
              'Demonstrates principled decision-making',
              'Shows understanding of long-term vs. short-term thinking'
            ]
          },
          {
            id: 'int_reflection_01',
            type: 'self_reflection',
            question: 'Describe a time when you had to choose between personal benefit and doing what was right for your community. What did you choose and why? What did you learn from this experience?',
            points: 20,
            timeLimit: 10,
            evaluationCriteria: [
              'Provides specific, concrete example',
              'Demonstrates self-awareness and reflection',
              'Shows learning and growth from experience',
              'Indicates principled decision-making process'
            ]
          }
        ]
      }
    ]
  },

  // COMPETENCE ASSESSMENT
  {
    id: 'competence_assessment',
    title: 'Leadership Competence and Skills Assessment',
    description: 'Evaluate practical leadership skills, problem-solving abilities, and technical competencies for effective governance.',
    category: 'competence',
    timeLimit: 60,
    totalPoints: 100,
    passingScore: 75,
    sections: [
      {
        id: 'problem_solving',
        title: 'Problem-Solving and Critical Thinking',
        description: 'Complex scenarios requiring analytical thinking and solution development',
        timeLimit: 30,
        questions: [
          {
            id: 'comp_problem_01',
            type: 'scenario',
            question: 'Your community has been experiencing frequent conflicts between farmers and herders, leading to loss of life and property. Traditional mediation efforts have failed, and tension is escalating. As a community leader, develop a comprehensive strategy to address this crisis.',
            points: 25,
            timeLimit: 15,
            evaluationCriteria: [
              'Demonstrates understanding of root causes (land use, climate change, economic pressures)',
              'Proposes multi-stakeholder engagement strategy',
              'Includes both short-term conflict resolution and long-term prevention',
              'Shows cultural sensitivity and inclusive approach',
              'Addresses economic and security dimensions',
              'Includes monitoring and evaluation mechanisms'
            ]
          },
          {
            id: 'comp_problem_02',
            type: 'scenario',
            question: 'Your LGA has received ₦50 million for infrastructure development, but different communities are demanding different projects (roads, schools, healthcare centers, water boreholes). How would you ensure fair and effective utilization of these funds?',
            points: 20,
            timeLimit: 10,
            evaluationCriteria: [
              'Proposes transparent needs assessment process',
              'Demonstrates understanding of participatory budgeting',
              'Includes criteria for prioritizing projects',
              'Shows consideration for equity across communities',
              'Addresses project sustainability and maintenance',
              'Includes accountability and monitoring mechanisms'
            ]
          }
        ]
      },
      {
        id: 'governance_knowledge',
        title: 'Governance and Administrative Knowledge',
        description: 'Understanding of governance structures, processes, and best practices',
        timeLimit: 30,
        questions: [
          {
            id: 'comp_gov_01',
            type: 'multiple_choice',
            question: 'What is the most effective way to ensure transparency in local government budget processes?',
            options: [
              'Publishing budgets in newspapers only',
              'Public budget hearings with citizen participation and feedback mechanisms',
              'Sharing budgets with traditional rulers only',
              'Posting budgets on government website without public input'
            ],
            correctAnswer: 'Public budget hearings with citizen participation and feedback mechanisms',
            points: 10,
            evaluationCriteria: [
              'Understands importance of citizen participation',
              'Recognizes value of feedback mechanisms'
            ]
          },
          {
            id: 'comp_gov_02',
            type: 'multiple_choice',
            question: 'Which approach is most effective for sustainable community development?',
            options: [
              'Top-down projects designed by external experts',
              'Community-driven development with local ownership',
              'Government-only initiatives without community input',
              'Donor-funded projects with foreign management'
            ],
            correctAnswer: 'Community-driven development with local ownership',
            points: 10,
            evaluationCriteria: [
              'Understands principles of community ownership',
              'Recognizes sustainability factors in development'
            ]
          },
          {
            id: 'comp_planning_01',
            type: 'essay',
            question: 'Design a 3-year strategic plan for improving education outcomes in a rural LGA with limited resources. Include specific strategies, implementation timeline, resource mobilization, and success indicators.',
            points: 25,
            timeLimit: 15,
            evaluationCriteria: [
              'Demonstrates strategic thinking and planning skills',
              'Shows understanding of education challenges and solutions',
              'Includes realistic resource mobilization strategies',
              'Proposes measurable outcomes and indicators',
              'Considers stakeholder engagement and partnerships',
              'Addresses sustainability and scalability'
            ]
          }
        ]
      }
    ]
  },

  // COMMITMENT ASSESSMENT
  {
    id: 'commitment_assessment',
    title: 'Leadership Commitment and Service Assessment',
    description: 'Evaluate dedication to public service, community development, and long-term leadership commitment.',
    category: 'commitment',
    timeLimit: 40,
    totalPoints: 100,
    passingScore: 75,
    sections: [
      {
        id: 'service_orientation',
        title: 'Service Orientation and Community Dedication',
        description: 'Assess commitment to serving community interests above personal gain',
        timeLimit: 25,
        questions: [
          {
            id: 'comm_service_01',
            type: 'self_reflection',
            question: 'Describe three specific examples of how you have voluntarily contributed to your community\'s development in the past two years. What motivated you to take these actions, and what impact did they have?',
            points: 25,
            timeLimit: 12,
            evaluationCriteria: [
              'Provides specific, verifiable examples of community service',
              'Demonstrates intrinsic motivation for service',
              'Shows measurable impact and outcomes',
              'Indicates sustained commitment over time',
              'Reflects understanding of community needs',
              'Shows collaboration and teamwork skills'
            ]
          },
          {
            id: 'comm_service_02',
            type: 'scenario',
            question: 'You are elected to a leadership position that requires you to spend significant unpaid time on community issues. Your family is struggling financially, and a private company offers you a well-paying job that would require you to step down from your leadership role. How do you balance these competing priorities?',
            points: 20,
            timeLimit: 8,
            evaluationCriteria: [
              'Acknowledges legitimate personal/family needs',
              'Considers community impact of decisions',
              'Explores creative solutions (part-time arrangements, delegation)',
              'Demonstrates ethical decision-making process',
              'Shows commitment to transparency with community',
              'Indicates long-term thinking about leadership succession'
            ]
          }
        ]
      },
      {
        id: 'vision_sustainability',
        title: 'Vision and Long-term Commitment',
        description: 'Evaluate long-term vision and commitment to sustainable change',
        timeLimit: 15,
        questions: [
          {
            id: 'comm_vision_01',
            type: 'essay',
            question: 'Describe your vision for your community 10 years from now. What specific changes do you want to see, and what role do you envision playing in achieving this vision? How would you ensure continuity of progress beyond your own involvement?',
            points: 30,
            timeLimit: 15,
            evaluationCriteria: [
              'Articulates clear, inspiring vision for community future',
              'Demonstrates understanding of systemic change requirements',
              'Shows realistic timeline and implementation thinking',
              'Indicates commitment to building lasting institutions',
              'Addresses leadership development and succession planning',
              'Reflects understanding of collaborative approach to change'
            ]
          },
          {
            id: 'comm_persistence_01',
            type: 'multiple_choice',
            question: 'When facing setbacks in a long-term community project, what is the most effective leadership response?',
            options: [
              'Abandon the project to avoid further failure',
              'Blame others for the setbacks and distance yourself',
              'Analyze what went wrong, adapt strategy, and re-engage stakeholders',
              'Wait for external help to solve the problems'
            ],
            correctAnswer: 'Analyze what went wrong, adapt strategy, and re-engage stakeholders',
            points: 15,
            evaluationCriteria: [
              'Demonstrates resilience and persistence',
              'Shows learning orientation and adaptability',
              'Indicates commitment to stakeholder engagement'
            ]
          }
        ]
      }
    ]
  },

  // COMPREHENSIVE FINAL ASSESSMENT
  {
    id: 'comprehensive_final',
    title: '#13kCredibleChallenge Final Assessment',
    description: 'Comprehensive evaluation covering all three pillars: Integrity, Competence, and Commitment',
    category: 'comprehensive',
    timeLimit: 90,
    totalPoints: 150,
    passingScore: 120, // 80% overall
    sections: [
      {
        id: 'integrated_scenarios',
        title: 'Integrated Leadership Scenarios',
        description: 'Complex scenarios requiring demonstration of all three leadership pillars',
        timeLimit: 45,
        questions: [
          {
            id: 'final_scenario_01',
            type: 'scenario',
            question: 'COMPREHENSIVE LEADERSHIP CHALLENGE: You have been selected to lead a ₦200 million state-funded education improvement program across 10 LGAs. The program has high political visibility, multiple stakeholders with conflicting interests, and tight deadlines. You discover that the previous program manager inflated costs and some funds are missing. Political pressures exist to ignore this and proceed quickly. How do you approach this complex leadership challenge? Address: 1) Integrity considerations, 2) Competence requirements, 3) Long-term commitment strategies.',
            points: 40,
            timeLimit: 25,
            evaluationCriteria: [
              'INTEGRITY: Addresses corruption honestly while managing political sensitivities',
              'INTEGRITY: Demonstrates commitment to transparency and accountability',
              'COMPETENCE: Shows systematic approach to complex project management',
              'COMPETENCE: Demonstrates stakeholder management and conflict resolution skills',
              'COMMITMENT: Indicates long-term thinking beyond immediate project timeline',
              'COMMITMENT: Shows dedication to educational outcomes over political convenience',
              'INTEGRATION: Balances all three pillars effectively in solution'
            ]
          },
          {
            id: 'final_scenario_02',
            type: 'scenario',
            question: 'COMMUNITY CRISIS LEADERSHIP: Your community is facing a multi-dimensional crisis: ethnic tensions, youth unemployment, environmental degradation from mining, and poor governance. As a credible leader, develop a comprehensive 5-year strategy that demonstrates your integrity, competence, and commitment to transformative change.',
            points: 35,
            timeLimit: 20,
            evaluationCriteria: [
              'INTEGRITY: Addresses ethnic tensions with fairness and inclusivity',
              'INTEGRITY: Proposes transparent governance improvements',
              'COMPETENCE: Develops integrated strategy addressing root causes',
              'COMPETENCE: Shows understanding of complex systems and interconnections',
              'COMMITMENT: Demonstrates long-term vision and sustainability planning',
              'COMMITMENT: Indicates personal dedication to seeing change through',
              'INNOVATION: Proposes creative solutions and partnerships'
            ]
          }
        ]
      },
      {
        id: 'leadership_philosophy',
        title: 'Personal Leadership Philosophy',
        description: 'Articulation of personal leadership approach and values',
        timeLimit: 30,
        questions: [
          {
            id: 'final_philosophy_01',
            type: 'essay',
            question: 'LEADERSHIP PHILOSOPHY STATEMENT: Write a comprehensive leadership philosophy statement that articulates: 1) Your core values and principles, 2) Your approach to serving diverse communities, 3) How you balance competing interests and pressures, 4) Your vision for Nigeria\'s democratic development, 5) Your personal commitment to credible leadership. This statement will be shared publicly if you are selected for the #13kCredibleChallenge.',
            points: 40,
            timeLimit: 25,
            evaluationCriteria: [
              'Articulates clear, authentic personal values and principles',
              'Demonstrates understanding of Nigeria\'s diversity and complexity',
              'Shows mature approach to conflict resolution and consensus building',
              'Expresses compelling vision for democratic development',
              'Indicates deep personal commitment to service',
              'Reflects integration of integrity, competence, and commitment',
              'Written with clarity and persuasive communication'
            ]
          }
        ]
      },
      {
        id: 'peer_assessment',
        title: 'Peer and Community Assessment',
        description: 'References and community validation component',
        timeLimit: 15,
        questions: [
          {
            id: 'final_references_01',
            type: 'self_reflection',
            question: 'Provide contact information for 5 community members (including at least one traditional leader, one youth representative, one women\'s group member, and one religious/civic organization leader) who can speak to your character, competence, and commitment to community service. Briefly explain your relationship with each reference and what they can attest to about your leadership.',
            points: 25,
            timeLimit: 10,
            evaluationCriteria: [
              'Provides diverse, credible references across different community sectors',
              'Shows evidence of broad community relationships and trust',
              'Demonstrates impact across different demographic groups',
              'References can verify specific examples of leadership and service',
              'Indicates transparency and confidence in community validation'
            ]
          }
        ]
      }
    ]
  }
];

// Assessment utilities
export const getAssessmentsByCategory = (category: 'integrity' | 'competence' | 'commitment' | 'comprehensive') => {
  return challengeAssessments.filter(assessment => assessment.category === category);
};

export const calculateAssessmentScore = (responses: Record<string, any>, assessmentId: string) => {
  const assessment = challengeAssessments.find(a => a.id === assessmentId);
  if (!assessment) return 0;
  
  let totalScore = 0;
  assessment.sections.forEach(section => {
    section.questions.forEach(question => {
      const response = responses[question.id];
      if (question.type === 'multiple_choice' && response === question.correctAnswer) {
        totalScore += question.points;
      }
      // For other question types, manual evaluation would be required
    });
  });
  
  return totalScore;
};

export const getAssessmentProgress = (completedAssessments: string[]) => {
  const required = ['integrity_assessment', 'competence_assessment', 'commitment_assessment'];
  const completed = required.filter(id => completedAssessments.includes(id));
  const canTakeFinal = completed.length === required.length;
  
  return {
    completedCount: completed.length,
    totalRequired: required.length,
    canTakeFinal,
    nextAssessment: required.find(id => !completedAssessments.includes(id))
  };
};