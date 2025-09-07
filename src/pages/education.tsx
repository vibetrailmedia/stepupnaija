import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InteractiveTrainingModule } from "@/components/InteractiveTrainingModule";
// Navigation provided by App.tsx - removed duplicate import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Award, 
  Clock, 
  Users, 
  CheckCircle,
  PlayCircle,
  Download,
  ExternalLink,
  Star,
  Trophy,
  Target,
  Flag,
  Scale,
  Building2,
  ArrowLeft
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  modules: number;
  completionRate?: number;
  isCompleted?: boolean;
  thumbnail: string;
}

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  author: string;
  publishedAt: string;
}

export default function Education() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [learningMode, setLearningMode] = useState(false);
  const [currentLearningModule, setCurrentLearningModule] = useState<any>(null);
  const [coursesData, setCoursesData] = useState<Course[]>([]);

  const { data: wallet } = useQuery({
    queryKey: ["/api/wallet"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: courses } = useQuery({
    queryKey: ["/api/education/courses"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: articles } = useQuery({
    queryKey: ["/api/education/articles"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: userProgress } = useQuery({
    queryKey: ["/api/education/progress"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <p className="text-gray-600">Loading education center...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <BookOpen className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Education Center</h1>
          <p className="text-gray-600 mb-6">
            Access comprehensive civic education materials, courses, and resources to deepen your understanding of Nigerian governance and democratic participation.
          </p>
          <Button onClick={() => window.location.href = '/auth'} className="w-full">
            Log In to Access Education
          </Button>
        </div>
      </div>
    );
  }

  // Initialize courses data
  const mockCourses: Course[] = [
    {
      id: "course-1",
      title: "Understanding Nigerian Democracy",
      description: "Learn about Nigeria's democratic system, institutions, and your role as a citizen",
      duration: "4 hours",
      level: "Beginner",
      category: "Democracy",
      modules: 8,
      completionRate: 65,
      thumbnail: "democracy"
    },
    {
      id: "course-2", 
      title: "Local Government Administration",
      description: "Explore how local government works and how you can engage at the grassroots level",
      duration: "3 hours",
      level: "Intermediate",
      category: "Governance",
      modules: 6,
      completionRate: 30,
      thumbnail: "local-gov"
    },
    {
      id: "course-3",
      title: "Constitutional Rights and Duties",
      description: "Master your constitutional rights and civic responsibilities as a Nigerian citizen",
      duration: "5 hours",
      level: "Intermediate",
      category: "Constitution",
      modules: 10,
      completionRate: 0,
      thumbnail: "constitution"
    },
    {
      id: "course-4",
      title: "Electoral Process and Voting",
      description: "Comprehensive guide to Nigeria's electoral system and effective voting practices",
      duration: "2 hours",
      level: "Beginner",
      category: "Elections",
      modules: 4,
      completionRate: 100,
      isCompleted: true,
      thumbnail: "elections"
    },
    {
      id: "course-5",
      title: "Anti-Corruption and Transparency",
      description: "Learn about corruption prevention, transparency initiatives, and citizen accountability",
      duration: "3.5 hours",
      level: "Advanced",
      category: "Transparency",
      modules: 7,
      completionRate: 15,
      thumbnail: "transparency"
    },
    {
      id: "course-6",
      title: "Community Organizing and Advocacy",
      description: "Develop skills for effective community organizing and civic advocacy campaigns",
      duration: "4.5 hours",
      level: "Advanced",
      category: "Advocacy",
      modules: 9,
      completionRate: 0,
      thumbnail: "advocacy"
    }
  ];

  // Initialize courses data on component mount
  useEffect(() => {
    if (coursesData.length === 0) {
      setCoursesData(mockCourses);
    }
  }, []);

  const mockArticles: Article[] = [
    {
      id: "article-1",
      title: "Understanding the Three Arms of Government",
      excerpt: "A comprehensive overview of Nigeria's executive, legislative, and judicial branches and how they work together",
      category: "Governance",
      readTime: "8 min read",
      author: "Dr. Amina Hassan",
      publishedAt: "2024-01-15"
    },
    {
      id: "article-2", 
      title: "Your Voting Rights: A Complete Guide",
      excerpt: "Everything you need to know about voter registration, election procedures, and your voting rights in Nigeria",
      category: "Elections",
      readTime: "12 min read",
      author: "Prof. Chidi Okafor",
      publishedAt: "2024-01-10"
    },
    {
      id: "article-3",
      title: "How to Engage with Your Local Representatives",
      excerpt: "Practical strategies for communicating with elected officials and making your voice heard in government",
      category: "Civic Engagement",
      readTime: "6 min read",
      author: "Fatima Abdul",
      publishedAt: "2024-01-05"
    },
    {
      id: "article-4",
      title: "The Role of Civil Society in Democracy",
      excerpt: "Exploring how civil society organizations strengthen democratic governance and promote citizen participation",
      category: "Democracy",
      readTime: "10 min read",
      author: "Dr. Emeka Nwankwo",
      publishedAt: "2023-12-28"
    }
  ];

  const categories = [
    { id: "all", name: "All Categories", icon: BookOpen },
    { id: "democracy", name: "Democracy", icon: Flag },
    { id: "governance", name: "Governance", icon: Building2 },
    { id: "constitution", name: "Constitution", icon: Scale },
    { id: "elections", name: "Elections", icon: Target },
    { id: "transparency", name: "Transparency", icon: Award },
    { id: "advocacy", name: "Advocacy", icon: Users }
  ];

  const filteredCourses = selectedCategory === "all" 
    ? coursesData 
    : coursesData.filter(course => course.category.toLowerCase() === selectedCategory);

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'democracy': return Flag;
      case 'governance': return Building2;
      case 'constitution': return Scale;
      case 'elections': return Target;
      case 'transparency': return Award;
      case 'advocacy': return Users;
      default: return BookOpen;
    }
  };

  const convertCourseToTrainingModule = (course: Course) => {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      duration: parseInt(course.duration.split(' ')[0]) * 60, // Convert hours to minutes
      difficulty: course.level.toLowerCase() as 'beginner' | 'intermediate' | 'advanced',
      category: course.category,
      objectives: [
        `Master the fundamental concepts of ${course.category.toLowerCase()}`,
        'Apply theoretical knowledge to real-world scenarios',
        'Develop practical skills for civic engagement',
        'Complete assessments to demonstrate understanding'
      ],
      content: {
        videos: Array.from({ length: Math.ceil(course.modules / 2) }, (_, i) => ({
          title: `${course.category} Fundamentals - Part ${i + 1}`,
          url: `#video-${i + 1}`,
          duration: 15
        })),
        readings: [
          {
            title: `Chapter 1: Introduction to ${course.category}`,
            content: `${course.category} in the Nigerian Context

This comprehensive guide explores the fundamental aspects of ${course.category.toLowerCase()} within Nigeria's democratic framework. As citizens, understanding these concepts is crucial for effective participation in our democratic processes and for holding our leaders accountable.

Nigeria's journey toward democratic governance has been marked by significant milestones and ongoing challenges. Since the return to civilian rule in 1999, the country has made substantial progress in establishing democratic institutions and processes. However, the path has not been without obstacles, including issues of electoral integrity, institutional capacity, and citizen engagement.

The concept of ${course.category.toLowerCase()} has evolved significantly in the Nigerian context, shaped by our unique cultural, political, and social dynamics. Traditional governance systems across Nigeria's diverse ethnic groups have contributed valuable insights into participatory decision-making and community accountability.

Why This Matters

Understanding ${course.category.toLowerCase()} is essential for every Nigerian citizen because it directly affects our daily lives, from the quality of public services we receive to the development of our communities. When citizens are informed and engaged, they can better hold their leaders accountable and contribute to positive change.

Your Role as a Citizen

As a Nigerian citizen, you have both rights and responsibilities in our democratic system. This course will help you understand how to exercise these rights effectively and fulfill your civic duties for the benefit of all Nigerians.`
          },
          {
            title: `Chapter 2: Constitutional Framework and Institutions`,
            content: `Constitutional Foundation

The 1999 Constitution of the Federal Republic of Nigeria provides the legal framework for ${course.category.toLowerCase()} in our country. Key provisions include separation of powers among the executive, legislative, and judicial branches, federal system of government with three tiers: federal, state, and local government, fundamental human rights and freedoms, and principles of federal character and national unity.

Democratic Institutions

Nigeria's democratic institutions play crucial roles in ensuring effective ${course.category.toLowerCase()}:

National Assembly comprises the Senate and House of Representatives, responsible for making laws and oversight functions. The Senate has 109 members representing the 36 states and the Federal Capital Territory, while the House of Representatives has 360 members representing federal constituencies.

State Houses of Assembly are legislative bodies at the state level, handling state-specific legislation and oversight. Each state has its own House of Assembly with members elected to represent state constituencies.

Local Government Councils are the closest tier of government to the people, responsible for grassroots development and service delivery. Nigeria has 774 local government areas across the 36 states.

Judiciary is an independent branch responsible for interpreting laws and ensuring justice. It includes the Supreme Court, Court of Appeal, Federal High Court, and state courts.

Electoral Bodies include INEC (Independent National Electoral Commission) and SIECs (State Independent Electoral Commissions) that conduct elections and ensure electoral integrity.

How These Institutions Serve You

These institutions exist to serve the Nigerian people. Understanding how they work helps you know where to take your concerns, how to access government services, and how to participate in decision-making processes that affect your life.`
          },
          {
            title: `Chapter 3: Challenges and Opportunities`,
            content: `Current Challenges

Low Citizen Participation remains a significant challenge as many Nigerians feel disconnected from governance processes. This disconnect often stems from lack of information, distrust in institutions, or feeling that their voices don't matter.

Corruption and Transparency Issues represent persistent challenges in ensuring transparent governance. When public resources are misused, it affects service delivery and development outcomes for all citizens.

Institutional Capacity shows the need for stronger democratic institutions that can effectively serve the Nigerian people and respond to their needs in a timely and efficient manner.

Youth Engagement reveals that despite Nigeria's large youth population, young people remain underrepresented in governance and decision-making processes.

Gender Inequality demonstrates that women's participation in politics and governance remains low, despite constituting about half of Nigeria's population.

Emerging Opportunities

Digital Democracy shows that technology is creating new avenues for citizen participation. Social media, online platforms, and digital tools are making it easier for citizens to engage with government and participate in democratic processes.

Civil Society Growth includes strong civil society organizations advocating for democratic values. These organizations play important roles in educating citizens, monitoring government performance, and advocating for policy changes.

Youth Activism demonstrates increasing political consciousness among young Nigerians who are demanding better governance and accountability from their leaders.

Media Freedom shows growing press freedom enabling better information flow between government and citizens, helping to promote transparency and accountability.

International Support provides global partnerships supporting democratic development through technical assistance, funding, and knowledge sharing.

Turning Challenges into Opportunities

Every challenge presents an opportunity for positive change. By understanding these issues, citizens can work together to address them and build a stronger democracy for all Nigerians.`
          },
          {
            title: `Chapter 4: Practical Citizen Engagement`,
            content: `How You Can Participate

As a Nigerian citizen, you have numerous opportunities to engage in ${course.category.toLowerCase()}:

Electoral Participation involves registering to vote and participate in all elections, volunteering as election observers, supporting credible candidates regardless of party affiliation, and reporting electoral malpractices to relevant authorities. Your vote is your voice in democracy.

Civic Engagement includes attending town hall meetings and public forums, joining community development associations, participating in budget consultation processes, and monitoring government projects in your community. These activities help ensure government responds to citizen needs.

Advocacy and Accountability involves using the Freedom of Information Act to request government information, engaging with elected representatives through petitions and meetings, supporting transparency initiatives and anti-corruption efforts, and using social media responsibly to promote democratic values.

Community Leadership includes volunteering for community development projects, mentoring young people in civic education, promoting peaceful conflict resolution in your community, and supporting local initiatives that strengthen democratic culture.

Building Your Civic Skills

Effective civic participation requires certain skills: critical thinking to analyze information and policies, communication skills to express your views clearly, collaboration abilities to work with others, and leadership qualities to inspire positive change in your community.

Making Your Voice Heard

There are many ways to make your voice heard in Nigerian democracy. Whether through voting, attending public meetings, contacting your representatives, or participating in peaceful advocacy, your participation matters and can contribute to positive change.`
          },
          {
            title: `Chapter 5: Success Stories and Future Vision`,
            content: `Success Stories

Several Nigerian communities and states have demonstrated excellent examples of ${course.category.toLowerCase()} in action:

Participatory Budgeting in Plateau State allows citizens to directly participate in deciding how government funds are allocated for development projects. This has led to more responsive governance and better development outcomes.

Community-Driven Development in Ekiti State enables local communities to take ownership of development projects with government support. This approach has improved project sustainability and community satisfaction.

Youth Inclusion in Kaduna State involves innovative programs that engage young people in governance and policy-making processes. These initiatives have brought fresh perspectives and energy to government.

Lessons Learned

These success stories highlight important principles: transparency builds trust between government and citizens, inclusive participation leads to more sustainable development, strong institutions are essential for democratic governance, and education and awareness are key to effective citizen participation.

Building a Stronger Democracy

Every Nigerian has a role to play in strengthening our democracy by staying informed about government policies and programs, participating actively in community affairs, respecting the rights and opinions of others, promoting peaceful dialogue and conflict resolution, and supporting the rule of law and constitutional governance.

Your Future in Nigerian Democracy

The future of Nigerian democracy depends on continuous civic education and awareness, strengthening of democratic institutions, promotion of transparency and accountability, inclusive participation of all citizens, and commitment to peaceful and credible elections.

Understanding and practicing ${course.category.toLowerCase()} is not just an academic exercise but a practical necessity for every Nigerian citizen who wants to contribute to national development and democratic consolidation. By actively participating in democratic processes, staying informed, and holding our leaders accountable, we can build the Nigeria of our dreams.

Remember that democracy is not a spectator sport. It requires active, informed, and committed citizens who are willing to work together for the common good. As you continue your civic education journey, commit to being part of the solution and helping to build a stronger, more inclusive Nigerian democracy.`
          }
        ],
        activities: [
          {
            title: 'Reflection Exercise',
            description: `Reflect on how ${course.category.toLowerCase()} impacts your daily life as a Nigerian citizen`,
            type: 'reflection'
          },
          {
            title: 'Case Study Analysis',
            description: `Analyze a real-world case study related to ${course.category.toLowerCase()} in Nigeria`,
            type: 'analysis'
          }
        ]
      },
      quiz: [
        {
          id: `q1-${course.id}`,
          type: 'multiple_choice' as const,
          question: `What is the primary purpose of ${course.category.toLowerCase()} in a democratic society?`,
          options: [
            'To maintain government control',
            'To ensure citizen participation and accountability',
            'To limit public involvement',
            'To reduce government transparency'
          ],
          correctAnswer: 'To ensure citizen participation and accountability',
          explanation: `${course.category} serves to enhance democratic participation and ensure government accountability to citizens.`,
          points: 8
        },
        {
          id: `q2-${course.id}`,
          type: 'true_false' as const,
          question: `Citizens have a responsibility to stay informed about ${course.category.toLowerCase()} matters.`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Active civic participation requires citizens to stay informed about relevant issues and processes.',
          points: 6
        },
        {
          id: `q3-${course.id}`,
          type: 'multiple_choice' as const,
          question: `Which of the following best describes effective civic engagement in ${course.category.toLowerCase()}?`,
          options: [
            'Passive observation only',
            'Active participation and informed involvement',
            'Avoiding all political activities',
            'Following instructions without question'
          ],
          correctAnswer: 'Active participation and informed involvement',
          explanation: 'Effective civic engagement requires active participation backed by knowledge and understanding.',
          points: 8
        },
        {
          id: `q4-${course.id}`,
          type: 'multiple_choice' as const,
          question: `According to the 1999 Nigerian Constitution, which principle ensures fair representation across the country?`,
          options: [
            'Separation of powers',
            'Federal character principle',
            'Rule of law',
            'Judicial independence'
          ],
          correctAnswer: 'Federal character principle',
          explanation: 'The federal character principle ensures equitable representation and participation of all ethnic and geographical groups in government.',
          points: 8
        },
        {
          id: `q5-${course.id}`,
          type: 'multiple_choice' as const,
          question: `What does INEC stand for in the Nigerian electoral system?`,
          options: [
            'Internal National Electoral Commission',
            'Independent National Electoral Committee',
            'Independent National Electoral Commission',
            'International Nigerian Electoral Council'
          ],
          correctAnswer: 'Independent National Electoral Commission',
          explanation: 'INEC is the Independent National Electoral Commission responsible for conducting elections in Nigeria.',
          points: 6
        },
        {
          id: `q6-${course.id}`,
          type: 'true_false' as const,
          question: `Nigeria returned to civilian democratic rule in 1999 after years of military government.`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Nigeria transitioned from military rule to civilian democratic government in May 1999 under President Olusegun Obasanjo.',
          points: 6
        },
        {
          id: `q7-${course.id}`,
          type: 'multiple_choice' as const,
          question: `Which tier of government is closest to the people in Nigeria's federal system?`,
          options: [
            'Federal government',
            'State government',
            'Local government',
            'Traditional authorities'
          ],
          correctAnswer: 'Local government',
          explanation: 'Local government councils are the closest tier of government to the people, responsible for grassroots development.',
          points: 8
        },
        {
          id: `q8-${course.id}`,
          type: 'multiple_choice' as const,
          question: `What is the main purpose of the Freedom of Information Act in Nigeria?`,
          options: [
            'To restrict media freedom',
            'To protect government secrets',
            'To enable citizens access to government information',
            'To control social media usage'
          ],
          correctAnswer: 'To enable citizens access to government information',
          explanation: 'The Freedom of Information Act allows citizens to request and access government information for transparency and accountability.',
          points: 8
        },
        {
          id: `q9-${course.id}`,
          type: 'true_false' as const,
          question: `Participatory budgeting allows citizens to directly influence how government funds are allocated.`,
          options: ['True', 'False'],
          correctAnswer: 'True',
          explanation: 'Participatory budgeting is a democratic process where citizens participate in deciding how public funds should be spent.',
          points: 6
        },
        {
          id: `q10-${course.id}`,
          type: 'multiple_choice' as const,
          question: `Which of these is NOT a key challenge facing Nigerian democracy today?`,
          options: [
            'Low citizen participation',
            'Corruption and transparency issues',
            'Excessive citizen engagement',
            'Youth underrepresentation'
          ],
          correctAnswer: 'Excessive citizen engagement',
          explanation: 'Low citizen participation, not excessive engagement, is actually one of the major challenges facing Nigerian democracy.',
          points: 8
        },
        {
          id: `q11-${course.id}`,
          type: 'multiple_choice' as const,
          question: `What role do civil society organizations play in Nigerian democracy?`,
          options: [
            'They replace government functions',
            'They advocate for democratic values and citizens rights',
            'They control election outcomes',
            'They limit citizen participation'
          ],
          correctAnswer: 'They advocate for democratic values and citizens rights',
          explanation: 'Civil society organizations advocate for democratic values, human rights, and serve as watchdogs for government accountability.',
          points: 8
        },
        {
          id: `q12-${course.id}`,
          type: 'true_false' as const,
          question: `Traditional governance systems in Nigeria have no relevance to modern democratic practices.`,
          options: ['True', 'False'],
          correctAnswer: 'False',
          explanation: 'Traditional governance systems across Nigeria have contributed valuable insights into participatory decision-making and community accountability.',
          points: 6
        }
      ],
      passingScore: 70,
      certificateEligible: true
    };
  };

  const startLearning = (course: Course) => {
    const trainingModule = convertCourseToTrainingModule(course);
    setCurrentLearningModule(trainingModule);
    setLearningMode(true);
    setSelectedCourse(null);
  };

  const handleProgressUpdate = (progress: any) => {
    // In a real app, this would save to the backend
  };

  const handleLearningComplete = (finalScore: number) => {
    
    // Mark course as completed if passing score is achieved
    if (currentLearningModule && finalScore >= currentLearningModule.passingScore) {
      // Update the course completion status
      const courseId = currentLearningModule.id.replace('training-', 'course-');
      
      // Find and update the course in coursesData
      const courseIndex = coursesData.findIndex(c => c.id === courseId);
      if (courseIndex !== -1) {
        const updatedCourses = [...coursesData];
        updatedCourses[courseIndex].isCompleted = true;
        updatedCourses[courseIndex].completionRate = 100;
        setCoursesData(updatedCourses);
      }
      
    }
    
    setLearningMode(false);
    setCurrentLearningModule(null);
  };

  // Show learning interface when in learning mode
  if (learningMode && currentLearningModule) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => setLearningMode(false)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Education Center
            </Button>
          </div>
          <InteractiveTrainingModule
            module={currentLearningModule}
            onProgressUpdate={handleProgressUpdate}
            onComplete={handleLearningComplete}
          />
        </main>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation provided by App.tsx - removed duplicate Navigation component */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Education Center</h1>
              <p className="text-gray-600">Master Nigerian civic engagement and democratic participation</p>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Courses Completed</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="stat-courses-completed">
                      {coursesData.filter(c => c.isCompleted).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Learning Hours</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="stat-learning-hours">
                      {(userProgress as any)?.totalHours || 12}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Star className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Skill Level</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="stat-skill-level">
                      {(userProgress as any)?.skillLevel || 'Intermediate'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Award className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Certificates</p>
                    <p className="text-2xl font-bold text-gray-900" data-testid="stat-certificates">
                      {(userProgress as any)?.certificates || 1}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="courses" data-testid="tab-courses">Courses</TabsTrigger>
            <TabsTrigger value="articles" data-testid="tab-articles">Articles</TabsTrigger>
            <TabsTrigger value="resources" data-testid="tab-resources">Resources</TabsTrigger>
          </TabsList>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-3 mb-6">
              {categories.map((category) => {
                const IconComponent = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center space-x-2"
                    data-testid={`filter-${category.id}`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{category.name}</span>
                  </Button>
                );
              })}
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const CategoryIcon = getCategoryIcon(course.category);
                return (
                  <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                      <CategoryIcon className="w-16 h-16 text-white" />
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                        {course.isCompleted && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{course.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.duration}
                        </span>
                        <span>{course.modules} modules</span>
                      </div>

                      {course.completionRate !== undefined && course.completionRate > 0 && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.completionRate}%</span>
                          </div>
                          <Progress value={course.completionRate} className="h-2" />
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1" 
                          variant="outline"
                          data-testid={`button-course-details-${course.id}`}
                          onClick={() => setSelectedCourse(course)}
                        >
                          View Details
                        </Button>
                        <Button 
                          className="flex-1" 
                          variant={course.isCompleted ? "outline" : "default"}
                          data-testid={`button-course-${course.id}`}
                          onClick={() => startLearning(course)}
                        >
                          <PlayCircle className="w-4 h-4 mr-2" />
                          {course.isCompleted ? 'Review' : course.completionRate && course.completionRate > 0 ? 'Continue' : 'Start'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Articles Tab */}
          <TabsContent value="articles" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockArticles.map((article) => {
                const CategoryIcon = getCategoryIcon(article.category);
                return (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CategoryIcon className="w-6 h-6 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline">{article.category}</Badge>
                            <span className="text-sm text-gray-500">{article.readTime}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">{article.title}</h3>
                          <p className="text-sm text-gray-600 mb-3">{article.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-500">
                              By {article.author} • {new Date(article.publishedAt).toLocaleDateString()}
                            </div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              data-testid={`button-article-${article.id}`}
                              onClick={() => setSelectedArticle(article)}
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Read
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-white border border-green-200 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Essential Civic Documents</h3>
              <p className="text-sm text-green-700 mb-3">
                Download these fundamental documents to understand your rights and responsibilities as a Nigerian citizen.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="https://x.com/Step_up_naija" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  Follow us on Twitter for updates
                </a>
                <a href="https://www.youtube.com/@Step_Up_Naija/shorts" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Watch on YouTube
                </a>
                <a href="https://www.instagram.com/step_up_naija/" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800 text-sm font-medium">
                  Instagram Updates
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-green-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-green-600" />
                    <span>Constitution of Nigeria</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete 1999 Constitution of the Federal Republic of Nigeria with amendments. Essential reading for every citizen.
                  </p>
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700 text-white" 
                    data-testid="button-constitution"
                    onClick={() => {
                      window.open('/api/resources/constitution', '_blank');
                      toast({
                        title: "Constitution Opened",
                        description: "Nigerian Constitution document is now available for viewing and download."
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    View & Download
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scale className="w-5 h-5 text-blue-600" />
                    <span>Your Rights Guide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Comprehensive guide to your constitutional rights as a Nigerian citizen, with practical examples and legal remedies.
                  </p>
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                    data-testid="button-rights-guide"
                    onClick={() => {
                      window.open('/api/resources/rights-guide', '_blank');
                      toast({
                        title: "Rights Guide Opened",
                        description: "Citizens' rights guide is now available for viewing and download."
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    View & Download
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-orange-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Flag className="w-5 h-5 text-orange-600" />
                    <span>Civic Duties Guide</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Your responsibilities as a Nigerian citizen - from voting and tax payment to community service and national unity.
                  </p>
                  <Button 
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white" 
                    data-testid="button-civic-duties"
                    onClick={() => {
                      window.open('/api/resources/civic-duties', '_blank');
                      toast({
                        title: "Civic Duties Guide Opened",
                        description: "Civic duties guide is now available for viewing and download."
                      });
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    View & Download
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-red-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Video className="w-5 h-5 text-red-600" />
                    <span>Step Up Naija Videos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Watch our educational video series on Nigerian democracy, governance, and civic engagement on our official YouTube channel.
                  </p>
                  <Button 
                    className="w-full bg-red-600 hover:bg-red-700 text-white" 
                    data-testid="button-videos"
                    onClick={() => {
                      window.open('https://www.youtube.com/@Step_Up_Naija/shorts', '_blank');
                      toast({
                        title: "Opening YouTube Channel",
                        description: "Step Up Naija videos are loading on our official YouTube channel."
                      });
                    }}
                  >
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Watch on YouTube
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-purple-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    <span>Government Directory</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Contact information for federal, state, and local government officials and agencies across Nigeria's 774 LGAs.
                  </p>
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                    data-testid="button-directory"
                    onClick={() => {
                      setLocation('/geography');
                      toast({
                        title: "Navigating to Directory",
                        description: "Opening comprehensive government directory."
                      });
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Browse Directory
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-teal-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-teal-600" />
                    <span>Social Media</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Follow Step Up Naija on all social platforms for daily civic education, updates, and the #13kCredibleChallenge.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={() => window.open('https://x.com/Step_up_naija', '_blank')}
                    >
                      Twitter
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-blue-600 border-blue-600 hover:bg-blue-50"
                      onClick={() => window.open('https://www.facebook.com/profile.php?id=61572251606931', '_blank')}
                    >
                      Facebook
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-pink-600 border-pink-600 hover:bg-pink-50"
                      onClick={() => window.open('https://www.instagram.com/step_up_naija/', '_blank')}
                    >
                      Instagram
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="text-black border-black hover:bg-gray-50"
                      onClick={() => window.open('https://www.tiktok.com/@step_up_naija', '_blank')}
                    >
                      TikTok
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Scale className="w-5 h-5" />
                    <span>Legal Resources</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Professional legal resources, court procedures, and legal aid information for citizens.
                  </p>
                  <div className="space-y-2">
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                      data-testid="button-legal-aid"
                      onClick={() => {
                        window.open('/api/resources/legal-aid', '_blank');
                        toast({
                          title: "Legal Aid Guide Opened",
                          description: "Comprehensive guide to accessing free legal services in Nigeria."
                        });
                      }}
                    >
                      <Scale className="w-4 h-4 mr-2" />
                      Legal Aid Guide
                    </Button>
                    <Button 
                      className="w-full bg-green-600 hover:bg-green-700 text-white" 
                      data-testid="button-court-procedures"
                      onClick={() => {
                        window.open('/api/resources/court-procedures', '_blank');
                        toast({
                          title: "Court Procedures Guide Opened",
                          description: "Step-by-step guide to Nigerian court system and procedures."
                        });
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Court Procedures
                    </Button>
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white" 
                      data-testid="button-legal-forms"
                      onClick={() => {
                        window.open('/api/resources/legal-forms', '_blank');
                        toast({
                          title: "Legal Forms & Templates Opened",
                          description: "Ready-to-use legal forms and templates for common procedures."
                        });
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Legal Forms & Templates
                    </Button>
                    <Button 
                      className="w-full bg-red-600 hover:bg-red-700 text-white" 
                      data-testid="button-emergency-legal"
                      onClick={() => {
                        toast({
                          title: "Emergency Legal Contacts",
                          description: "Human Rights Commission: 09-4619500 | Legal Aid: 08033142863 | Police: 199 | Emergency: 911",
                          duration: 6000
                        });
                      }}
                    >
                      <Scale className="w-4 h-4 mr-2" />
                      Emergency Contacts
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Civic Organizations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Directory of civil society organizations and NGOs working on governance and democracy.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    data-testid="button-organizations"
                    onClick={() => {
                      setLocation('/network');
                      toast({
                        title: "Opening Network",
                        description: "Find and connect with civic organizations."
                      });
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Find Organizations
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="w-5 h-5" />
                    <span>Certification Programs</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Earn certificates in civic education and democratic participation skills.
                  </p>
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    data-testid="button-certification"
                    onClick={() => {
                      setLocation('/training');
                      toast({
                        title: "Opening Training",
                        description: "Access certification and training programs."
                      });
                    }}
                  >
                    <Trophy className="w-4 h-4 mr-2" />
                    View Programs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Course Details Modal */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              {selectedCourse && (
                <>
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    {(() => {
                      const CategoryIcon = getCategoryIcon(selectedCourse.category);
                      return <CategoryIcon className="w-5 h-5 text-primary-600" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedCourse.title}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className={getLevelColor(selectedCourse.level)}>
                        {selectedCourse.level}
                      </Badge>
                      <span className="text-sm text-gray-500">{selectedCourse.duration}</span>
                    </div>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedCourse && (
            <div className="space-y-6">
              <p className="text-gray-600">{selectedCourse.description}</p>
              
              {selectedCourse.completionRate !== undefined && selectedCourse.completionRate > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Your Progress</span>
                    <span>{selectedCourse.completionRate}%</span>
                  </div>
                  <Progress value={selectedCourse.completionRate} className="h-3" />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Course Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Modules</span>
                      <span className="font-medium">{selectedCourse.modules}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Duration</span>
                      <span className="font-medium">{selectedCourse.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Level</span>
                      <Badge className={getLevelColor(selectedCourse.level)} variant="outline">
                        {selectedCourse.level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category</span>
                      <span className="font-medium">{selectedCourse.category}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">What You'll Learn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Fundamental concepts and principles</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Real-world applications and examples</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Best practices and expert insights</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Practical skills and actionable knowledge</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Course Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Array.from({ length: selectedCourse.modules }, (_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-primary-600">{i + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium">Module {i + 1}</h4>
                            <p className="text-sm text-gray-600">
                              {selectedCourse.category === 'Democracy' && i === 0 && 'Introduction to Democratic Principles'}
                              {selectedCourse.category === 'Democracy' && i === 1 && 'Nigerian Political System'}
                              {selectedCourse.category === 'Governance' && i === 0 && 'Understanding Local Government'}
                              {selectedCourse.category === 'Constitution' && i === 0 && 'Constitutional Framework'}
                              {selectedCourse.category === 'Elections' && i === 0 && 'Electoral System Overview'}
                              {!['Democracy', 'Governance', 'Constitution', 'Elections'].includes(selectedCourse.category) && `Core concepts and practical applications`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">30 min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                  Close
                </Button>
                <Button onClick={() => startLearning(selectedCourse)}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  {selectedCourse.isCompleted ? 'Review Course' : selectedCourse.completionRate && selectedCourse.completionRate > 0 ? 'Continue Learning' : 'Start Learning'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Article Details Modal */}
      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-3">
              {selectedArticle && (
                <>
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    {(() => {
                      const CategoryIcon = getCategoryIcon(selectedArticle.category);
                      return <CategoryIcon className="w-5 h-5 text-primary-600" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedArticle.title}</h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{selectedArticle.category}</Badge>
                      <span className="text-sm text-gray-500">{selectedArticle.readTime}</span>
                    </div>
                  </div>
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {selectedArticle && (
            <div className="space-y-6">
              <div className="text-sm text-gray-600">
                By {selectedArticle.author} • Published {new Date(selectedArticle.publishedAt).toLocaleDateString()}
              </div>
              
              <p className="text-lg text-gray-800 leading-relaxed">{selectedArticle.excerpt}</p>
              
              <div className="prose prose-gray max-w-none">
                <p>
                  This comprehensive article explores the fundamental aspects of {selectedArticle.category.toLowerCase()} 
                  in the Nigerian context. Through detailed analysis and practical examples, readers will gain valuable 
                  insights into how these concepts apply to everyday civic engagement.
                </p>
                
                <h3>Key Highlights</h3>
                <ul>
                  <li>In-depth analysis of current systems and processes</li>
                  <li>Practical guidance for active participation</li>
                  <li>Real-world examples from Nigerian communities</li>
                  <li>Expert insights and best practices</li>
                </ul>
                
                <h3>Understanding the Context</h3>
                <p>
                  Nigeria's democratic journey has been marked by significant milestones and ongoing challenges. 
                  This article provides readers with the knowledge needed to understand and effectively participate 
                  in the democratic process, whether at the local, state, or federal level.
                </p>
                
                <h3>Take Action</h3>
                <p>
                  Knowledge without action remains incomplete. The article concludes with practical steps that 
                  readers can take to apply what they've learned and make a meaningful contribution to their 
                  communities and the broader democratic process.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedArticle(null)}>
                  Close
                </Button>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Save Article
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      
    </div>
  );
}