import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Share2, ExternalLink, Loader2, CheckCircle, Copy, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";

interface SocialShareTaskCardProps {
  task: any;
  onComplete: (task: any, shareData: any) => void;
  isCompleting: boolean;
  colors: any;
}

export function SocialShareTaskCard({ task, onComplete, isCompleting, colors }: SocialShareTaskCardProps) {
  const { toast } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<string>("");
  const [customMessage, setCustomMessage] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [hasShared, setHasShared] = useState(false);

  const platforms = [
    { 
      value: 'twitter', 
      label: 'Twitter/X', 
      icon: Twitter,
      color: 'text-blue-500',
      baseUrl: 'https://twitter.com/intent/tweet?text='
    },
    { 
      value: 'facebook', 
      label: 'Facebook', 
      icon: Facebook,
      color: 'text-blue-600',
      baseUrl: 'https://www.facebook.com/sharer/sharer.php?u='
    },
    { 
      value: 'linkedin', 
      label: 'LinkedIn', 
      icon: Linkedin,
      color: 'text-blue-700',
      baseUrl: 'https://www.linkedin.com/sharing/share-offsite/?url='
    },
    { 
      value: 'instagram', 
      label: 'Instagram', 
      icon: Instagram,
      color: 'text-pink-600',
      baseUrl: 'https://www.instagram.com/' // Story sharing would need different approach
    }
  ];

  // Pre-written civic awareness messages
  const civicMessages = {
    'voter-education': {
      title: 'Voter Education Campaign',
      message: `🗳️ Your vote is your voice! Learn about the candidates and issues in your constituency. Every eligible Nigerian should participate in our democracy. #StepUpNaija #VoteNigeria #Democracy #CivicEngagement`,
      hashtags: ['#StepUpNaija', '#VoteNigeria', '#Democracy', '#CivicEngagement']
    },
    'civic-participation': {
      title: 'Civic Participation Drive',
      message: `🇳🇬 Building a better Nigeria starts with YOU! Participate in town halls, community meetings, and local governance. Your voice matters! #StepUpNaija #CivicParticipation #CommunityDevelopment`,
      hashtags: ['#StepUpNaija', '#CivicParticipation', '#CommunityDevelopment', '#Nigeria']
    },
    'transparency-accountability': {
      title: 'Transparency & Accountability',
      message: `📊 Transparency in governance is everyone's right! Follow public projects, track budgets, and hold leaders accountable. Join the movement for open government. #StepUpNaija #Transparency #Accountability #OpenGov`,
      hashtags: ['#StepUpNaija', '#Transparency', '#Accountability', '#OpenGov']
    },
    'youth-engagement': {
      title: 'Youth in Governance',
      message: `🌟 Young Nigerians, the future is in our hands! Get involved in politics, run for office, and be the change you want to see. #NotTooYoungToRun #StepUpNaija #YouthInPolitics`,
      hashtags: ['#NotTooYoungToRun', '#StepUpNaija', '#YouthInPolitics', '#FutureLeaders']
    }
  };

  const getTaskMessage = () => {
    const taskType = task.shareType || 'civic-participation';
    return civicMessages[taskType as keyof typeof civicMessages] || civicMessages['civic-participation'];
  };

  const handlePlatformSelect = (platform: string) => {
    setSelectedPlatform(platform);
    const selectedPlatformData = platforms.find(p => p.value === platform);
    const message = getTaskMessage();
    
    if (selectedPlatformData) {
      let shareText = encodeURIComponent(message.message);
      let url = '';
      
      switch (platform) {
        case 'twitter':
          url = `${selectedPlatformData.baseUrl}${shareText}&url=${encodeURIComponent('https://stepupnaija.com')}`;
          break;
        case 'facebook':
          url = `${selectedPlatformData.baseUrl}${encodeURIComponent('https://stepupnaija.com')}&quote=${shareText}`;
          break;
        case 'linkedin':
          url = `${selectedPlatformData.baseUrl}${encodeURIComponent('https://stepupnaija.com')}&title=${encodeURIComponent(message.title)}&summary=${shareText}`;
          break;
        case 'instagram':
          // For Instagram, we'll provide the message to copy since direct sharing isn't available
          url = '#copy-message';
          break;
      }
      
      setShareUrl(url);
    }
  };

  const handleShare = () => {
    if (!selectedPlatform) {
      toast({
        title: "Platform Required",
        description: "Please select a social media platform to share on.",
        variant: "destructive",
      });
      return;
    }

    if (selectedPlatform === 'instagram') {
      // Copy message to clipboard for Instagram
      const message = getTaskMessage();
      navigator.clipboard.writeText(message.message).then(() => {
        toast({
          title: "Message Copied!",
          description: "The message has been copied to your clipboard. Now share it on Instagram.",
        });
        setHasShared(true);
      });
    } else if (shareUrl) {
      // Open share URL in new window
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setHasShared(true);
      toast({
        title: "Share Window Opened",
        description: "Please complete the sharing process in the new window, then come back to complete the task.",
      });
    }
  };

  const handleCompleteTask = () => {
    if (!hasShared) {
      toast({
        title: "Share Required",
        description: "Please share the message on social media first.",
        variant: "destructive",
      });
      return;
    }

    const shareData = {
      platform: selectedPlatform,
      message: getTaskMessage().message,
      shareUrl: shareUrl !== '#copy-message' ? shareUrl : '',
      customMessage,
      sharedAt: new Date().toISOString(),
      taskType: 'social_share',
    };

    onComplete(task, shareData);
  };

  const copyMessage = () => {
    const message = getTaskMessage().message;
    navigator.clipboard.writeText(message).then(() => {
      toast({
        title: "Message Copied!",
        description: "The civic awareness message has been copied to your clipboard.",
      });
    });
  };

  const selectedPlatformData = platforms.find(p => p.value === selectedPlatform);
  const message = getTaskMessage();

  return (
    <Card className={`border-2 ${colors.border} transition-all duration-200 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
            <Share2 className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              +{parseFloat(task.rewardSUP).toLocaleString()} SUP
            </div>
            <div className="text-sm text-gray-500">Reward</div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {task.title}
          </h3>
          <p className="text-gray-600 mb-4">
            {task.description}
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 Campaign: {message.title}</h4>
            <p className="text-blue-800 text-sm">
              Help spread civic awareness by sharing our carefully crafted messages that promote democratic participation and civic engagement across Nigeria.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Social Media Platform
            </label>
            <Select value={selectedPlatform} onValueChange={handlePlatformSelect}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a platform to share on..." />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <SelectItem key={platform.value} value={platform.value}>
                      <div className="flex items-center space-x-2">
                        <IconComponent className={`w-4 h-4 ${platform.color}`} />
                        <span>{platform.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Message Preview */}
          {selectedPlatform && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">Message to Share</h4>
                <Button
                  onClick={copyMessage}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <p className="text-sm text-gray-700 bg-white p-3 rounded border">
                {message.message}
              </p>
              <div className="mt-2 text-xs text-gray-500">
                Platform: {selectedPlatformData?.label}
              </div>
            </div>
          )}

          {/* Custom Message Option */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Personal Note (Optional)
            </label>
            <Textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add your personal thoughts about civic engagement..."
              className="resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {selectedPlatform && !hasShared && (
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1"
                data-testid="button-share-message"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Share on {selectedPlatformData?.label}
              </Button>
            )}
            
            <Button
              onClick={handleCompleteTask}
              disabled={isCompleting || !hasShared}
              className={`flex-1 ${colors.button} text-white font-medium transition-colors`}
              data-testid="button-complete-share-task"
            >
              {isCompleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Completing...
                </>
              ) : hasShared ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Task (+{task.rewardSUP} SUP)
                </>
              ) : (
                <>
                  Share First to Complete
                </>
              )}
            </Button>
          </div>

          {hasShared && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center text-green-800">
                <CheckCircle className="w-4 h-4 mr-2" />
                <span className="text-sm font-medium">
                  Great! You've shared the message. Now complete the task to earn your SUP tokens.
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By sharing civic awareness content, you're helping build a more engaged Nigeria! 🇳🇬
          </p>
        </div>
      </CardContent>
    </Card>
  );
}