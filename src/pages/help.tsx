import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, Search, Book, MessageCircle, Phone, Users, Coins, Shield, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function HelpCenter() {
  const [, setLocation] = useLocation();

  const helpCategories = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "#13kCredibleChallenge",
      description: "Everything about the challenge, participation, and leader nomination",
      topics: ["How to join", "Nomination process", "Leadership criteria", "Progress tracking"]
    },
    {
      icon: <Coins className="w-8 h-8 text-yellow-600" />,
      title: "SUP Token System",
      description: "Understanding our token economy, earning, and spending",
      topics: ["How to earn SUP", "Token conversion", "Prize draws", "Wallet management"]
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Account & Security",
      description: "Managing your account, KYC verification, and staying secure",
      topics: ["Account setup", "KYC process", "Password security", "Profile updates"]
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
      title: "Community Features",
      description: "Forums, networking, and connecting with other participants",
      topics: ["Forum usage", "Network building", "Events", "Mentorship"]
    }
  ];

  const quickActions = [
    {
      icon: <Book className="w-6 h-6 text-blue-600" />,
      title: "Getting Started Guide",
      description: "New to Step Up Naija? Start here",
      action: () => setLocation("/about")
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-green-600" />,
      title: "Contact Support",
      description: "Get help from our team",
      action: () => setLocation("/contact")
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-purple-600" />,
      title: "Frequently Asked Questions",
      description: "Quick answers to common questions",
      action: () => setLocation("/faq")
    }
  ];

  const popularTopics = [
    { title: "How to join the #13kCredibleChallenge", views: "2.3k views", new: true },
    { title: "Understanding SUP token rewards", views: "1.8k views", new: false },
    { title: "KYC verification process", views: "1.5k views", new: false },
    { title: "How to nominate a credible leader", views: "1.2k views", new: true },
    { title: "Prize draw eligibility and rules", views: "956 views", new: false },
    { title: "Community forum guidelines", views: "743 views", new: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setLocation("/")}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              data-testid="button-back"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers, get support, and learn how to make the most of Step Up Naija and the #13kCredibleChallenge.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search for help articles, guides, or topics..."
              className="pl-10 py-3 text-lg"
              data-testid="input-search"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={action.action}
            >
              <CardContent className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Help Categories */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {helpCategories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center mb-2">
                      {category.icon}
                      <CardTitle className="ml-3">{category.title}</CardTitle>
                    </div>
                    <p className="text-gray-600 text-sm">{category.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.topics.map((topic, topicIndex) => (
                        <li key={topicIndex}>
                          <a 
                            href="#" 
                            className="text-green-600 hover:text-green-700 text-sm transition-colors"
                            data-testid={`link-topic-${topicIndex}`}
                          >
                            {topic}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Popular Topics Sidebar */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">Popular Topics</h3>
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {popularTopics.map((topic, index) => (
                    <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <a 
                            href="#" 
                            className="text-gray-900 hover:text-green-600 font-medium text-sm transition-colors"
                            data-testid={`link-popular-${index}`}
                          >
                            {topic.title}
                          </a>
                          <p className="text-xs text-gray-500 mt-1">{topic.views}</p>
                        </div>
                        {topic.new && (
                          <Badge variant="secondary" className="ml-2 text-xs bg-green-100 text-green-700">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Support */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-green-600" />
                  Need More Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Can't find what you're looking for? Our support team is here to help.
                </p>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full text-sm"
                    onClick={() => setLocation("/contact")}
                    data-testid="button-contact-support"
                  >
                    Contact Support
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-sm text-green-600 hover:text-green-700"
                    data-testid="button-whatsapp"
                  >
                    WhatsApp: +234 801 234 5678
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Support */}
        <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Community</h3>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            Connect with other Step Up Naija participants, share experiences, and get help from fellow community members 
            in our discussion forums.
          </p>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setLocation("/forum")}
            data-testid="button-join-forum"
          >
            Visit Community Forum
          </Button>
        </div>
      </div>

    </div>
  );
}