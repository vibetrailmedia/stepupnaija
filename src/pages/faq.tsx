import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, HelpCircle, Users, Coins, Shield, Award, 
  Building, Globe, CheckCircle, ArrowRight, ArrowLeft
} from "lucide-react";

const FAQ_CATEGORIES = {
  general: {
    title: "General Information",
    icon: HelpCircle,
    color: "bg-blue-100 text-blue-800"
  },
  challenge: {
    title: "#13kCredibleChallenge",
    icon: Award,
    color: "bg-yellow-100 text-yellow-800"
  },
  tokens: {
    title: "SUP Tokens & Economics",
    icon: Coins,
    color: "bg-green-100 text-green-800"
  },
  verification: {
    title: "Verification & KYC",
    icon: Shield,
    color: "bg-purple-100 text-purple-800"
  },
  organization: {
    title: "CIRAD Foundation",
    icon: Building,
    color: "bg-orange-100 text-orange-800"
  },
  technical: {
    title: "Platform & Technical",
    icon: Globe,
    color: "bg-indigo-100 text-indigo-800"
  }
};

const FAQ_DATA = {
  general: [
    {
      id: "what-is-sun",
      question: "What is Step Up Naija (SUN)?",
      answer: "Step Up Naija (SUN) is the public-facing initiative of CIRAD Good Governance Advocacy Foundation, a registered Nigerian NGO. We're building a digital platform for civic engagement that connects credible leaders across Nigeria's 774 Local Government Areas through the #13kCredibleChallenge."
    },
    {
      id: "how-to-participate",
      question: "How can I participate in Step Up Naija?",
      answer: "You can participate by: 1) Creating an account and completing tasks to earn SUP tokens, 2) Nominating credible candidates in your LGA, 3) Participating in community discussions and forums, 4) Voting on community projects, 5) Completing verification to increase your platform privileges."
    },
    {
      id: "who-can-join",
      question: "Who can join Step Up Naija?",
      answer: "Any Nigerian citizen (18+) whether residing in Nigeria or in the diaspora can join. We welcome people from all backgrounds who are committed to good governance and civic engagement."
    },
    {
      id: "is-it-free",
      question: "Is Step Up Naija free to use?",
      answer: "Yes! Creating an account and participating in civic activities is completely free. You can earn SUP tokens through engagement, and only pay if you choose to purchase additional SUP tokens for increased participation in prize draws."
    }
  ],
  challenge: [
    {
      id: "what-is-13k-challenge",
      question: "What is the #13kCredibleChallenge?",
      answer: "The #13kCredibleChallenge is our flagship initiative to identify, verify, and train 13,000 credible leaders across all 774 Local Government Areas in Nigeria. This represents approximately 17 verified leaders per LGA, creating a comprehensive network of accountable governance advocates."
    },
    {
      id: "how-candidates-selected",
      question: "How are credible candidates selected?",
      answer: "Candidates go through a 4-phase process: 1) Community nomination by verified users, 2) Peer verification and endorsements, 3) Background checks and community validation, 4) Training and capacity building. Each candidate must demonstrate integrity, competence, and community impact."
    },
    {
      id: "candidate-criteria",
      question: "What are the criteria for credible candidates?",
      answer: "Candidates must demonstrate: integrity and ethical conduct, professional competence in their field, community service record, leadership experience, transparency and accountability, and commitment to democratic values. They must also pass community verification and background checks."
    },
    {
      id: "challenge-timeline",
      question: "What's the timeline for the #13kCredibleChallenge?",
      answer: "The challenge is an ongoing initiative with quarterly milestones. We aim to identify 1,000 candidates by Q2 2025, 5,000 by Q4 2025, and reach our 13,000 target by 2027. Progress is tracked in real-time on our progress dashboard."
    }
  ],
  tokens: [
    {
      id: "what-is-sup",
      question: "What is SUP token and how does it work?",
      answer: "SUP is our civic engagement token with a fixed peg of 1 SUP = ₦10. You earn SUP by completing civic tasks (5-25 SUP daily), participating in discussions, and contributing to the platform. SUP can be used for prize draws, project voting, and can be cashed out to your bank account."
    },
    {
      id: "how-earn-sup",
      question: "How can I earn SUP tokens?",
      answer: "You can earn SUP through: completing civic education quizzes (5 SUP), nominating credible candidates (10 SUP), participating in volunteer events (20 SUP), forum contributions, and achieving verification milestones. Daily limit is 25 SUP, monthly limit is 500 SUP."
    },
    {
      id: "sup-cashout",
      question: "How do I cash out SUP tokens?",
      answer: "Minimum cashout is 10 SUP (₦100). KYC-1 users can withdraw up to 2,000 SUP (₦20,000) per week, KYC-2 users up to 20,000 SUP (₦200,000) per week. Withdrawals are processed via Paystack/Flutterwave to your linked bank account within 24-48 hours."
    },
    {
      id: "prize-system",
      question: "How does the prize system work?",
      answer: "Weekly prize pools are distributed as: 70% to prizes (grand, mid-tier, and micro prizes), 20% to community projects, 10% to platform operations. Everyone with earned SUP is automatically entered. Larger prizes require KYC verification and have a 24-hour cooling-off period."
    },
    {
      id: "sup-economics",
      question: "Is SUP token sustainable and secure?",
      answer: "Yes! SUP follows strict economic principles: fixed 1 SUP = ₦10 peg, minting only when purchased or allocated for rewards, burning used tokens, and maintaining 3x average weekly cashouts in NGN reserves. All transactions are publicly auditable for transparency."
    }
  ],
  verification: [
    {
      id: "kyc-levels",
      question: "What are the KYC verification levels?",
      answer: "KYC-1 (₦20,000/week limit): Requires phone number and email verification. KYC-2 (₦200,000/week limit): Requires NIN verification and bank account linking. Higher KYC levels unlock greater platform privileges and withdrawal limits."
    },
    {
      id: "verification-process",
      question: "How does the verification process work?",
      answer: "Start with email and phone verification for KYC-1. For KYC-2, provide your NIN and bank account details. All information is encrypted and stored securely. Verification typically takes 24-48 hours and unlocks higher withdrawal limits and platform features."
    },
    {
      id: "achievement-badges",
      question: "What are achievement badges?",
      answer: "Achievement badges recognize your contributions across 6 categories: Civic Engagement, Leadership, Integrity, Community Impact, Verification, and Special Achievements. Badges have different rarity levels (Common, Rare, Epic, Legendary) and some award SUP tokens when earned."
    },
    {
      id: "endorsement-system",
      question: "How does the candidate endorsement system work?",
      answer: "Verified users can endorse candidates in 6 categories: Integrity & Ethics, Professional Competence, Community Service, Leadership Experience, Transparency & Accountability, and Innovation & Problem-Solving. Endorsements include credibility ratings (1-10) and supporting evidence."
    }
  ],
  organization: [
    {
      id: "what-is-cirad",
      question: "What is CIRAD Good Governance Advocacy Foundation?",
      answer: "CIRAD is a registered Nigerian NGO that provides the legal and institutional foundation for Step Up Naija. It handles compliance, fiduciary oversight, and formal partnerships while SUN operates as the dynamic, youth-facing civic movement."
    },
    {
      id: "governance-structure",
      question: "How is the organization governed?",
      answer: "CIRAD Board of Trustees provides legal and fiduciary oversight. SUN Executive Team handles daily operations. An Advisory Council of civic leaders, academics, and youth representatives provides guidance and ensures democratic accountability."
    },
    {
      id: "funding-model",
      question: "How is Step Up Naija funded?",
      answer: "We're funded through: 10% of weekly prize pools for operations, SUP token purchases by users, grants and donations to CIRAD Foundation, and partnerships with civic organizations. All financial flows are transparent and publicly auditable."
    },
    {
      id: "legal-status",
      question: "What is Step Up Naija's legal status?",
      answer: "Step Up Naija operates under CIRAD Good Governance Advocacy Foundation, a registered Nigerian NGO with full legal compliance. This structure provides regulatory legitimacy while allowing operational flexibility for our digital civic engagement platform."
    }
  ],
  technical: [
    {
      id: "platform-security",
      question: "How secure is the Step Up Naija platform?",
      answer: "We use industry-standard security measures: encrypted data storage, secure authentication, regular security audits, and compliance with data protection regulations. Your personal information and financial data are protected with bank-level security."
    },
    {
      id: "mobile-access",
      question: "Can I use Step Up Naija on my mobile phone?",
      answer: "Yes! Our platform is mobile-responsive and works seamlessly on smartphones and tablets. We're also developing a dedicated mobile app for enhanced user experience and offline capabilities."
    },
    {
      id: "data-privacy",
      question: "How is my personal data protected?",
      answer: "We follow strict data privacy principles: minimal data collection, encrypted storage, no data selling to third parties, user control over personal information, and compliance with Nigerian data protection laws. You can request data deletion at any time."
    },
    {
      id: "technical-support",
      question: "What if I encounter technical issues?",
      answer: "Contact our support team through the platform's help section, email, or community forums. Most common issues are addressed in our help documentation. For verification or financial issues, we provide priority support within 24 hours."
    }
  ]
};

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("general");

  // Filter FAQs based on search term
  const filterFAQs = (faqs: any[]) => {
    if (!searchTerm) return faqs;
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get all FAQs for search
  const allFAQs = Object.entries(FAQ_DATA).flatMap(([category, faqs]) => 
    faqs.map(faq => ({ ...faq, category }))
  );

  const searchResults = searchTerm 
    ? allFAQs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={() => window.history.back()}
          className="flex items-center text-muted-foreground hover:text-foreground"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="faq-title">
          Frequently Asked Questions
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about Step Up Naija, the #13kCredibleChallenge, 
          SUP tokens, and CIRAD Foundation.
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search frequently asked questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-faq-search"
            />
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchTerm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              Search Results ({searchResults.length} found)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchResults.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No results found for "{searchTerm}". Try different keywords or browse categories below.
                </p>
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-2">
                {searchResults.map((faq) => {
                  const category = FAQ_CATEGORIES[faq.category as keyof typeof FAQ_CATEGORIES];
                  return (
                    <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-2">
                          <Badge className={category.color}>
                            {category.title}
                          </Badge>
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </CardContent>
        </Card>
      )}

      {/* Category Tabs */}
      {!searchTerm && (
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
            {Object.entries(FAQ_CATEGORIES).map(([key, category]) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger 
                  key={key} 
                  value={key} 
                  className="flex flex-col items-center space-y-1 p-3"
                  data-testid={`tab-${key}`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-xs text-center">{category.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(FAQ_DATA).map(([categoryKey, faqs]) => (
            <TabsContent key={categoryKey} value={categoryKey}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {FAQ_CATEGORIES[categoryKey as keyof typeof FAQ_CATEGORIES] && (() => {
                      const category = FAQ_CATEGORIES[categoryKey as keyof typeof FAQ_CATEGORIES];
                      const IconComponent = category.icon;
                      return (
                        <>
                          <IconComponent className="w-5 h-5" />
                          <span>{category.title}</span>
                          <Badge className={category.color}>
                            {faqs.length} questions
                          </Badge>
                        </>
                      );
                    })()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {filterFAQs(faqs).map((faq) => (
                      <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                        <AccordionTrigger 
                          className="text-left font-medium"
                          data-testid={`faq-question-${faq.id}`}
                        >
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent 
                          className="text-muted-foreground leading-relaxed"
                          data-testid={`faq-answer-${faq.id}`}
                        >
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Contact Support */}
      <Card className="mt-8">
        <CardContent className="p-6 text-center">
          <HelpCircle className="w-12 h-12 mx-auto text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button data-testid="button-contact-support">
              Contact Support
            </Button>
            <Button variant="outline" data-testid="button-community-forum">
              <Users className="w-4 h-4 mr-2" />
              Ask in Community Forum
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <Card className="text-center">
          <CardContent className="p-4">
            <Award className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
            <h4 className="font-semibold mb-1">Join the Challenge</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Start your journey in the #13kCredibleChallenge
            </p>
            <Button size="sm" variant="outline" data-testid="button-join-challenge">
              Get Started
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <Coins className="w-8 h-8 mx-auto text-green-500 mb-2" />
            <h4 className="font-semibold mb-1">Earn SUP Tokens</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Complete tasks and participate in civic activities
            </p>
            <Button size="sm" variant="outline" data-testid="button-earn-sup">
              Start Earning
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <CheckCircle className="w-8 h-8 mx-auto text-blue-500 mb-2" />
            <h4 className="font-semibold mb-1">Get Verified</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Complete KYC verification for higher limits
            </p>
            <Button size="sm" variant="outline" data-testid="button-get-verified">
              Verify Now
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}