import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Send, 
  User, 
  Bot,
  Sparkles,
  Heart,
  Flag,
  Zap,
  BookOpen,
  Users,
  Shield,
  X
} from 'lucide-react';
const tariImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const kamsiImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";

interface ChatMessage {
  role: 'user' | 'tari' | 'kamsi';
  content: string;
  timestamp: string;
}

interface GuideCharacter {
  name: string;
  title: string;
  expertise: string[];
  personality: string;
  color: string;
  icon: React.ComponentType<any>;
  avatar: string;
}

const guides: Record<string, GuideCharacter> = {
  tari: {
    name: 'Tari',
    title: 'Civic Engagement Guide',
    expertise: ['Nigerian Democracy', 'Voting & Elections', 'Community Organizing', 'Civic Education'],
    personality: 'Warm, knowledgeable, and passionate about empowering Nigerian citizens',
    color: 'bg-gradient-to-br from-green-500 to-emerald-600',
    icon: Flag,
    avatar: tariImage
  },
  kamsi: {
    name: 'Kamsi',
    title: 'Digital Democracy Guide', 
    expertise: ['Platform Features', 'SUP Tokens', 'Digital Security', 'Tech Solutions'],
    personality: 'Tech-savvy, innovative, and enthusiastic about digital transformation',
    color: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    icon: Zap,
    avatar: kamsiImage
  }
};

export function CivicGuideChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGuide, setActiveGuide] = useState<string>('tari');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation when guide changes
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        role: activeGuide as 'tari' | 'kamsi',
        content: activeGuide === 'tari' 
          ? "👋 Hello! I'm Tari, your civic engagement guide. I'm here to help you understand Nigerian democracy, participate in the #13K Challenge, and become a more engaged citizen. What would you like to know about civic participation?"
          : "👋 Hi there! I'm Kamsi, your digital democracy guide. I'll help you navigate Step Up Naija's features, understand SUP tokens, and make the most of our platform. How can I assist you today?",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, activeGuide]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`/api/chat/${activeGuide}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory: conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const guideResponse: ChatMessage = {
        role: activeGuide as 'tari' | 'kamsi',
        content: data.message,
        timestamp: data.timestamp
      };

      setMessages(prev => [...prev, guideResponse]);
      
      // Update conversation history for context
      const updatedHistory = [...conversationHistory, userMessage, guideResponse].slice(-10); // Keep last 10 messages
      setConversationHistory(updatedHistory);

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Connection Error',
        description: `Failed to get response from ${guides[activeGuide].name}. Please try again.`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const switchGuide = (guide: string) => {
    if (guide === activeGuide) return;
    
    setActiveGuide(guide);
    setMessages([]);
    setConversationHistory([]);
    
    toast({
      title: `Switched to ${guides[guide].name}`,
      description: guides[guide].personality,
    });
  };

  const currentGuide = guides[activeGuide];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 z-40"
          data-testid="button-open-chat"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0 bg-white/90 backdrop-blur-md overflow-hidden">
        <div className="flex h-full overflow-hidden">
          {/* Guide Selection Sidebar */}
          <div className="w-72 min-w-[280px] border-r border-gray-200 bg-gray-50/50 hidden md:block overflow-y-auto">
            <DialogHeader className="p-4 border-b bg-white/50">
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-green-600" />
                Civic Guides
              </DialogTitle>
            </DialogHeader>
            
            <div className="p-4 space-y-4">
              {Object.entries(guides).map(([key, guide]) => (
                <Card 
                  key={key}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    activeGuide === key 
                      ? 'ring-2 ring-green-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => switchGuide(key)}
                  data-testid={`guide-${key}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={guide.avatar} alt={`${guide.name} profile`} className="object-cover" />
                        <AvatarFallback className={guide.color}>
                          {(() => {
                            const IconComponent = guide.icon;
                            return <IconComponent className="h-5 w-5 text-white" />;
                          })()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {guide.name}
                          {activeGuide === key && <Badge variant="secondary">Active</Badge>}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{guide.title}</p>
                        <p className="text-xs text-gray-500 mb-3">{guide.personality}</p>
                        <div className="flex flex-wrap gap-1">
                          {guide.expertise.slice(0, 2).map((skill, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {guide.expertise.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{guide.expertise.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <DialogHeader className="p-4 border-b bg-white/50">
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={currentGuide.avatar} alt={`${currentGuide.name} profile`} className="object-cover" />
                  <AvatarFallback className={currentGuide.color}>
                    {(() => {
                      const IconComponent = currentGuide.icon;
                      return <IconComponent className="h-5 w-5 text-white" />;
                    })()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Chat with {currentGuide.name}</div>
                  <div className="text-sm text-gray-600">{currentGuide.title}</div>
                </div>
              </DialogTitle>
              <DialogDescription className="sr-only">
                Chat interface for talking with {currentGuide.name}, your {currentGuide.title.toLowerCase()}, who specializes in {currentGuide.expertise.join(', ').toLowerCase()}.
              </DialogDescription>
            </DialogHeader>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 overflow-y-auto">
              {/* Mobile Guide Selector */}
              <div className="md:hidden mb-4">
                <div className="flex gap-2 p-2 bg-gray-100 rounded-lg">
                  {Object.entries(guides).map(([key, guide]) => (
                    <button
                      key={key}
                      onClick={() => switchGuide(key)}
                      className={`flex-1 flex items-center gap-2 p-2 rounded transition-colors ${
                        activeGuide === key 
                          ? 'bg-green-500 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-200'
                      }`}
                      data-testid={`mobile-guide-${key}`}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={guide.avatar} alt={`${guide.name} profile`} className="object-cover" />
                        <AvatarFallback>
                          {(() => {
                            const IconComponent = guide.icon;
                            return <IconComponent className="h-3 w-3" />;
                          })()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{guide.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${
                      message.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {message.role === 'user' ? (
                        <AvatarFallback className="bg-gray-100">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={guides[message.role].avatar} alt={`${guides[message.role].name} profile`} className="object-cover" />
                          <AvatarFallback className={activeGuide === 'tari' ? 'bg-green-100' : 'bg-blue-100'}>
                            {(() => {
                              const IconComponent = guides[message.role].icon;
                              return <IconComponent className="h-4 w-4" />;
                            })()}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    
                    <div className={`max-w-[80%] break-words rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-white border shadow-sm'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words overflow-wrap-anywhere">{message.content}</p>
                      <p className={`text-xs mt-1 opacity-70 ${
                        message.role === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentGuide.avatar} alt={`${currentGuide.name} profile`} className="object-cover" />
                      <AvatarFallback className={activeGuide === 'tari' ? 'bg-green-100' : 'bg-blue-100'}>
                        {(() => {
                          const IconComponent = currentGuide.icon;
                          return <IconComponent className="h-4 w-4" />;
                        })()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white border rounded-lg p-3 shadow-sm">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        {currentGuide.name} is thinking...
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 border-t bg-white/50 flex-shrink-0">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask ${currentGuide.name} about ${activeGuide === 'tari' ? 'civic engagement' : 'platform features'}...`}
                  disabled={isLoading}
                  className="flex-1 min-w-0"
                  data-testid="input-chat-message"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-4"
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>Powered by AI • Stay engaged, Nigeria! 🇳🇬</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
