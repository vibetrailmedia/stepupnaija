import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, Download, Clock, CheckCircle, AlertCircle, Wand2, Camera, Upload, UserPlus } from "lucide-react";
import tariAvatarImage from "@/assets/tari-avatar.webp";
import kamsiAvatarImage from "@/assets/kamsi-avatar.webp";
import VideoPlayer from "@/components/VideoPlayer";

interface HeyGenAvatar {
  avatar_id: string;
  avatar_name: string;
  gender: string;
  preview_image_url: string;
  preview_video_url: string;
}

interface HeyGenVoice {
  voice_id: string;
  language: string;
  gender: string;
  name: string;
  preview_audio: string;
}

interface VideoStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  video_url?: string;
  thumbnail_url?: string;
  duration?: number;
}

const PRESET_SCRIPTS = {
  tari: {
    introduction: "Hello! I'm Tari, your dedicated civic authority guide and trusted mentor for navigating Nigeria's complex democratic landscape. My mission is to empower you with the knowledge, tools, and confidence you need to become an active, informed citizen who can make a real difference in our great nation. Whether you're just beginning your civic journey or looking to deepen your engagement, I'm here to guide you through understanding our government systems, from local councils to the federal level. I'll help you master the voting process, understand your constitutional rights, learn how to access government services, and discover practical ways to hold our leaders accountable. Together, we'll explore how democracy works in Nigeria, how you can participate meaningfully in the political process, and how your voice can contribute to the positive transformation of our communities. I believe that every Nigerian has the power to shape our nation's future, and I'm here to help you unlock that power. Welcome to your civic awakening journey - let's build the Nigeria we all deserve, one informed citizen at a time.",
    welcome: "Welcome to Step Up Naija! I'm Tari, and I'll be your guide through Nigeria's civic landscape. Let's explore how you can make a real difference in your community.",
    voting: "Understanding your voting rights is crucial for civic participation. Let me walk you through Nigeria's electoral process, from voter registration to casting your ballot on election day.",
    platform_intro: "Hello, I'm Tari - your dedicated civic authority guide and personal mentor for Nigeria's democratic transformation. Welcome to Step Up Naija, where we're not just building informed citizens - we're cultivating the next generation of Nigerian leaders who will shape our nation's future. This platform is your gateway to understanding government systems, mastering your constitutional rights, and developing the civic skills that will empower you to drive real change in your community. From navigating complex voting processes to accessing government services, from understanding policy impacts to becoming an effective advocate for your community's needs - I'm here to guide you every step of the way. Together, we'll transform you from a passive observer into an active architect of Nigeria's democratic progress. Your civic journey starts now, and I'll be with you throughout this empowering transformation. Welcome to your leadership awakening.",
    civic_empowerment: "I'm Tari, and I believe every Nigerian has the power to transform their community and nation. Civic empowerment isn't just about knowing your rights - it's about exercising them with confidence and purpose. Whether you're holding your local government accountable, advocating for better infrastructure, or leading grassroots initiatives for change, you have more power than you realize. From understanding how to access public information and engage with government officials, to organizing peaceful advocacy campaigns and building coalitions for change - these are the tools that turn ordinary citizens into extraordinary change-makers. Your voice matters. Your vote counts. Your actions create ripple effects that can transform entire communities. Stop waiting for someone else to fix what's broken. You are the leader Nigeria has been waiting for. Let's unlock your civic power and put it to work for the Nigeria we all deserve."
  },
  kamsi: {
    introduction: "Hi there! I'm Kamsi, your community connection guide. I'm here to help you build meaningful relationships, find volunteer opportunities, and create positive change in your neighborhood. Let's grow together as engaged citizens!",
    welcome: "Welcome to our amazing community! I'm Kamsi, and I'm so excited to help you connect with fellow Nigerians who are passionate about making a difference. Your civic journey starts here!",
    community: "Building strong communities starts with each of us. Let me show you how to find local volunteer opportunities, connect with like-minded citizens, and create lasting positive impact.",
    platform_intro: "Hello, I'm Kamsi - your vibrant community connection guide and passionate advocate for Nigerian unity! Welcome to Step Up Naija, where we're building more than just a platform - we're creating a movement that connects hearts, minds, and hands across all 774 Local Government Areas of Nigeria. This is your home for discovering meaningful volunteer opportunities, building lasting friendships with like-minded change-makers, and turning your passion for community service into real, measurable impact. From organizing local clean-up drives to connecting with mentors and fellow activists, from finding your perfect volunteer match to celebrating collective achievements - I'm here to ensure you never walk this journey alone. Together, we'll transform individual good intentions into a powerful network of community champions who are actively rebuilding Nigeria from the grassroots up. Your community adventure begins now, and I'll be your enthusiastic companion every step of the way. Welcome to your tribe!"
  }
};

export default function AvatarStudio() {
  const [selectedCharacter, setSelectedCharacter] = useState<"tari" | "kamsi">("tari");
  const [selectedPreset, setSelectedPreset] = useState<string>("introduction");
  const [customScript, setCustomScript] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(() => {
    // Remember last used voice from localStorage
    return localStorage.getItem('avatarStudio_lastVoice') || "";
  });
  const [useCustomScript, setUseCustomScript] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [videoHistory, setVideoHistory] = useState<Array<{
    id: string;
    character: string;
    script: string;
    voice_id: string;
    status: string;
    created_at: string;
    video_url?: string;
    avatar_id: string;
  }>>([]);

  // Load saved video data on component mount
  useEffect(() => {
    const savedVideoId = localStorage.getItem('avatarStudio_currentVideoId');
    const savedVideoHistory = localStorage.getItem('avatarStudio_videoHistory');
    
    if (savedVideoId) {
      console.log('Loading saved video ID:', savedVideoId);
      setCurrentVideoId(savedVideoId);
    }
    
    if (savedVideoHistory) {
      try {
        const history = JSON.parse(savedVideoHistory);
        setVideoHistory(history);
      } catch (error) {
        console.error('Error parsing video history:', error);
      }
    }
  }, []);
  
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [showPhotoAvatarSetup, setShowPhotoAvatarSetup] = useState(false);
  const [tariAvatarId, setTariAvatarId] = useState<string>("");
  const [kamsiAvatarId, setKamsiAvatarId] = useState<string>("");

  // Load saved avatar IDs on component mount
  useEffect(() => {
    const savedTariId = localStorage.getItem('tari_avatar_id');
    const savedKamsiId = localStorage.getItem('kamsi_avatar_id');
    
    // Clear expired Tari avatar
    if (savedTariId === '29b8c519d778411496b45f424cd22def') {
      console.log('Clearing expired Tari avatar ID');
      localStorage.removeItem('tari_avatar_id');
      setTariAvatarId('');
    } else if (savedTariId) {
      console.log('Loading saved Tari avatar ID:', savedTariId);
      setTariAvatarId(savedTariId);
    }
    
    if (savedKamsiId) {
      console.log('Loading saved Kamsi avatar ID:', savedKamsiId);
      setKamsiAvatarId(savedKamsiId);
    }
  }, []);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch available avatars
  const { data: avatarsData, isLoading: avatarsLoading } = useQuery({
    queryKey: ['/api/heygen/avatars'],
    refetchOnWindowFocus: false,
  });

  // Fetch available voices
  const { data: voicesData, isLoading: voicesLoading } = useQuery({
    queryKey: ['/api/heygen/voices'],
    refetchOnWindowFocus: false,
  });

  // Generate video mutation
  const generateVideoMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/heygen/create-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create video');
      return response.json();
    },
    onSuccess: (data, variables) => {
      const newVideoId = data.video_id;
      setCurrentVideoId(newVideoId);
      
      // Add to video history
      const newVideo = {
        id: newVideoId,
        character: variables.character,
        script: variables.script.substring(0, 100) + '...',
        voice_id: variables.voice_id,
        status: 'processing',
        created_at: new Date().toISOString(),
        avatar_id: variables.avatar_id,
      };
      
      const updatedHistory = [newVideo, ...videoHistory];
      setVideoHistory(updatedHistory);
      localStorage.setItem('avatarStudio_videoHistory', JSON.stringify(updatedHistory));
      localStorage.setItem('avatarStudio_currentVideoId', newVideoId);
      
      toast({
        title: "Video Generation Started",
        description: "Your avatar video is being generated. This may take a few minutes.",
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to start video generation. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create photo avatar mutation
  const createPhotoAvatarMutation = useMutation({
    mutationFn: async (data: { image_url: string; avatar_name: string }) => {
      const response = await fetch('/api/heygen/create-photo-avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create photo avatar');
      return response.json();
    },
    onSuccess: (data, variables) => {
      console.log('Photo avatar created:', data);
      const avatarId = data.avatar_id || data.talking_photo_id;
      console.log('Extracted avatar ID:', avatarId);
      
      if (avatarId) {
        // Save to localStorage with simplified key
        const character = variables.avatar_name.toLowerCase().includes('tari') ? 'tari' : 'kamsi';
        const storageKey = `${character}_avatar_id`;
        localStorage.setItem(storageKey, avatarId);
        console.log(`Saved to localStorage: ${storageKey} = ${avatarId}`);
        
        // Update state immediately
        if (character === 'tari') {
          console.log('Setting Tari avatar ID:', avatarId);
          setTariAvatarId(avatarId);
          setSelectedAvatar(avatarId);
        } else if (character === 'kamsi') {
          console.log('Setting Kamsi avatar ID:', avatarId);
          setKamsiAvatarId(avatarId);
          setSelectedAvatar(avatarId);
        }
        
        toast({
          title: "Photo Avatar Created",
          description: `${variables.avatar_name} avatar created! ID: ${avatarId.slice(0, 8)}...`,
        });
      } else {
        console.error('No avatar ID found in response:', data);
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/heygen/avatars'] });
    },
    onError: (error) => {
      toast({
        title: "Avatar Creation Failed",
        description: "Failed to create photo avatar. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Generate preset video mutation
  const generatePresetMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/heygen/generate-preset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create preset video');
      return response.json();
    },
    onSuccess: (data) => {
      console.log('Video generation started with ID:', data.video_id);
      setCurrentVideoId(data.video_id);
      // Store video ID in localStorage for persistence
      localStorage.setItem('avatarStudio_currentVideoId', data.video_id);
      toast({
        title: "Preset Video Generation Started",
        description: `Generating ${selectedCharacter}'s ${selectedPreset} video...`,
      });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate preset video. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Poll video status
  const { data: videoStatus, isLoading: statusLoading } = useQuery({
    queryKey: ['/api/heygen/video-status', currentVideoId],
    enabled: !!currentVideoId,
    refetchInterval: (data: any) => {
      if (!data?.status || data.status?.status === 'completed' || data.status?.status === 'failed') {
        return false;
      }
      return 5000; // Poll every 5 seconds
    },
    refetchOnWindowFocus: false,
  });

  // Update video URL when completed
  useEffect(() => {
    console.log('Video status update:', videoStatus);
    const status = (videoStatus as any)?.status;
    if (status?.status === 'completed' && status.video_url && currentVideoId) {
      console.log('Setting video URL:', status.video_url);
      setGeneratedVideoUrl(status.video_url);
      
      // Update video history with completed status
      const updatedHistory = videoHistory.map(video => 
        video.id === currentVideoId 
          ? { ...video, status: 'completed', video_url: status.video_url }
          : video
      );
      setVideoHistory(updatedHistory);
      localStorage.setItem('avatarStudio_videoHistory', JSON.stringify(updatedHistory));
      
      // Keep currentVideoId for a moment to show completion
      setTimeout(() => {
        setCurrentVideoId(null);
        localStorage.removeItem('avatarStudio_currentVideoId');
      }, 1000);
      toast({
        title: "Video Ready!",
        description: "Your avatar video has been generated successfully.",
      });
    } else if (status?.status === 'failed') {
      setCurrentVideoId(null);
      localStorage.removeItem('avatarStudio_currentVideoId');
      toast({
        title: "Generation Failed",
        description: "Video generation failed. Please try again.",
        variant: "destructive",
      });
    }
  }, [videoStatus, toast]);

  const handleGenerateCustom = () => {
    if (!selectedAvatar) {
      toast({
        title: "Missing Avatar",
        description: "Please select an avatar first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedVoice) {
      toast({
        title: "Missing Voice",
        description: "Please select a voice first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!customScript.trim()) {
      toast({
        title: "Missing Script",
        description: "Please enter a script.",
        variant: "destructive",
      });
      return;
    }

    generateVideoMutation.mutate({
      character: selectedCharacter,
      script: customScript,
      avatar_id: selectedAvatar,
      voice_id: selectedVoice,
      is_custom_avatar: selectedAvatar === tariAvatarId || selectedAvatar === kamsiAvatarId,
    });
  };

  const handleCreateTariAvatar = () => {
    const imageUrl = `${window.location.origin}/src/assets/tari-avatar.webp`;
    createPhotoAvatarMutation.mutate({
      image_url: imageUrl,
      avatar_name: "Tari",
    });
  };

  const handleCreateKamsiAvatar = () => {
    const imageUrl = `${window.location.origin}/src/assets/kamsi-avatar.webp`;
    createPhotoAvatarMutation.mutate({
      image_url: imageUrl,
      avatar_name: "Kamsi",
    });
  };

  const handleGeneratePreset = () => {
    if (!selectedAvatar) {
      toast({
        title: "Missing Avatar",
        description: "Please select an avatar first.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedVoice) {
      toast({
        title: "Missing Voice", 
        description: "Please select a voice first.",
        variant: "destructive",
      });
      return;
    }

    generatePresetMutation.mutate({
      character: selectedCharacter,
      preset: selectedPreset,
      avatar_id: selectedAvatar,
      voice_id: selectedVoice,
    });
  };

  const avatars = (avatarsData as any)?.avatars || [];
  const voices = (voicesData as any)?.voices || [];
  
  // Show all voices, but sort by relevance (Custom first, then English, then by gender)
  const sortedVoices = voices.sort((a: any, b: any) => {
    // Prioritize custom voices first
    if (a.isCustom && !b.isCustom) return -1;
    if (!a.isCustom && b.isCustom) return 1;
    
    // Then prioritize English voices
    const aIsEnglish = a.language.toLowerCase().includes('en');
    const bIsEnglish = b.language.toLowerCase().includes('en');
    if (aIsEnglish && !bIsEnglish) return -1;
    if (!aIsEnglish && bIsEnglish) return 1;
    
    // Then prioritize female voices
    const aIsFemale = a.gender.toLowerCase() === 'female';
    const bIsFemale = b.gender.toLowerCase() === 'female';
    if (aIsFemale && !bIsFemale) return -1;
    if (!aIsFemale && bIsFemale) return 1;
    
    return a.name.localeCompare(b.name);
  });
  
  const getCurrentScript = () => {
    if (useCustomScript) return customScript;
    const scripts = PRESET_SCRIPTS[selectedCharacter];
    if (selectedCharacter === 'tari') {
      return (scripts as any)[selectedPreset] || scripts.introduction;
    } else {
      return (scripts as any)[selectedPreset] || scripts.introduction;
    }
  };
  
  const currentScript = getCurrentScript();


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Avatar Video Studio</h1>
          <p className="text-gray-600">Create AI-powered videos with Tari and Kamsi using HeyGen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Generation Panel */}
          <div className="space-y-6">
            {/* Character Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Character Selection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedCharacter === 'tari' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCharacter('tari')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                        <img src={tariAvatarImage} alt="Tari" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Tari</h3>
                        <p className="text-sm text-gray-600">Civic Authority</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      selectedCharacter === 'kamsi' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCharacter('kamsi')}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-lg">
                        <img src={kamsiAvatarImage} alt="Kamsi" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Kamsi</h3>
                        <p className="text-sm text-gray-600">Community Guide</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Photo Avatar Setup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Custom Avatars Setup</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowPhotoAvatarSetup(!showPhotoAvatarSetup)}
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {showPhotoAvatarSetup ? 'Hide' : 'Setup Avatars'}
                  </Button>
                </CardTitle>
              </CardHeader>
              {showPhotoAvatarSetup && (
                <CardContent className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 mb-3">
                      Create custom photo avatars from your Tari and Kamsi images. This process uploads the images to HeyGen and creates talking photo avatars.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg mx-auto mb-3">
                          <img src={tariAvatarImage} alt="Tari" className="w-full h-full object-cover" />
                        </div>
                        <Button 
                          onClick={handleCreateTariAvatar}
                          disabled={createPhotoAvatarMutation.isPending || !!tariAvatarId}
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          {tariAvatarId ? `✓ Tari Created (${tariAvatarId.slice(0, 8)}...)` : 
                           createPhotoAvatarMutation.isPending ? 'Creating...' : 'Create Tari Avatar'}
                        </Button>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-green-200 shadow-lg mx-auto mb-3">
                          <img src={kamsiAvatarImage} alt="Kamsi" className="w-full h-full object-cover" />
                        </div>
                        <Button 
                          onClick={handleCreateKamsiAvatar}
                          disabled={createPhotoAvatarMutation.isPending || !!kamsiAvatarId}
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          {kamsiAvatarId ? `✓ Kamsi Created (${kamsiAvatarId.slice(0, 8)}...)` : 'Create Kamsi Avatar'}
                        </Button>
                      </div>
                    </div>
                    
                    {createPhotoAvatarMutation.isPending && (
                      <div className="flex items-center justify-center mt-4 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                        <span className="text-sm">Creating photo avatar...</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Avatar & Voice Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Avatar & Voice Setup</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Avatar</label>
                  <Select value={selectedAvatar} onValueChange={setSelectedAvatar}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an avatar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tariAvatarId && (
                        <SelectItem value={tariAvatarId}>
                          🌟 Tari - Civic Authority Guide (Custom)
                        </SelectItem>
                      )}
                      {kamsiAvatarId && (
                        <SelectItem value={kamsiAvatarId}>
                          🌟 Kamsi - Community Connection Guide (Custom)
                        </SelectItem>
                      )}
                      {avatars.map((avatar: HeyGenAvatar) => (
                        <SelectItem key={avatar.avatar_id} value={avatar.avatar_id}>
                          {avatar.avatar_name} ({avatar.gender})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {!tariAvatarId && !kamsiAvatarId && (
                    <p className="text-sm text-amber-600 mt-2">
                      💡 Create custom Tari and Kamsi avatars above for the best results!
                    </p>
                  )}
                  {!selectedAvatar && (
                    <p className="text-sm text-red-600 mt-2">
                      ⚠️ Please select an avatar to continue
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Voice 
                    {selectedVoice && (voicesData as any)?.voices && (
                      <span className="text-xs text-muted-foreground ml-2">
                        (Last used: {((voicesData as any)?.voices as any[])?.find((v: any) => v.voice_id === selectedVoice)?.name || selectedVoice.slice(0, 10)}...)
                      </span>
                    )}
                  </label>
                  <Select value={selectedVoice} onValueChange={(value) => {
                    setSelectedVoice(value);
                    // Remember the selected voice
                    localStorage.setItem('avatarStudio_lastVoice', value);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice..." />
                    </SelectTrigger>
                    <SelectContent>
                      {sortedVoices.map((voice: any) => (
                        <SelectItem key={voice.voice_id} value={voice.voice_id}>
                          {voice.isCustom ? '🎯 ' : ''}{voice.name} ({voice.language}) - {voice.gender}
                          {voice.isCustom ? ' (Custom)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Script Selection */}
            <Card data-testid="script-section">
              <CardHeader>
                <CardTitle className="flex items-center">
                  📝 Step 3: Script Selection & Video Generation
                  {selectedAvatar && selectedVoice && (
                    <Badge className="ml-2 bg-green-100 text-green-800">Ready to Generate</Badge>
                  )}
                </CardTitle>
                {(!selectedAvatar || !selectedVoice) && (
                  <p className="text-sm text-amber-600 mt-2">
                    ⚠️ Please complete Step 2 (Avatar & Voice Configuration) first
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <Tabs value={useCustomScript ? "custom" : "preset"} onValueChange={(v) => setUseCustomScript(v === "custom")}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="preset">Preset Scripts</TabsTrigger>
                    <TabsTrigger value="custom">Custom Script</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="preset" className="space-y-4">
                    <Select value={selectedPreset} onValueChange={setSelectedPreset}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="introduction">Introduction</SelectItem>
                        <SelectItem value="welcome">Welcome Message</SelectItem>
                        {selectedCharacter === 'tari' ? (
                          <SelectItem value="voting">Voting Guide</SelectItem>
                        ) : (
                          <SelectItem value="community">Community Building</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700">{currentScript}</p>
                    </div>
                    
                    <Button 
                      onClick={handleGeneratePreset} 
                      disabled={generatePresetMutation.isPending || !selectedAvatar || !selectedVoice}
                      className="w-full"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      {generatePresetMutation.isPending ? 'Generating...' : 'Generate Preset Video'}
                    </Button>
                  </TabsContent>
                  
                  <TabsContent value="custom" className="space-y-4">
                    <Textarea
                      placeholder="Enter your custom script here..."
                      value={customScript}
                      onChange={(e) => setCustomScript(e.target.value)}
                      rows={6}
                      maxLength={1500}
                    />
                    <div className="text-sm text-gray-500 text-right">
                      {customScript.length}/1500 characters
                    </div>
                    
                    <Button 
                      onClick={handleGenerateCustom} 
                      disabled={generateVideoMutation.isPending || !selectedAvatar || !selectedVoice || !customScript.trim()}
                      className="w-full"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {generateVideoMutation.isPending ? 'Generating...' : 'Generate Custom Video'}
                    </Button>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Status Panel */}
          <div className="space-y-6">
            {/* Generation Status */}
            {currentVideoId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Generation Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Badge variant={
                        (videoStatus as any)?.status?.status === 'completed' ? 'default' :
                        (videoStatus as any)?.status?.status === 'failed' ? 'destructive' : 'secondary'
                      }>
                        {(videoStatus as any)?.status?.status || 'pending'}
                      </Badge>
                      <span className="text-sm text-gray-600">Video ID: {currentVideoId}</span>
                    </div>
                    
                    {(videoStatus as any)?.status?.status === 'processing' && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span className="text-sm">Generating video...</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Start Guide */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-800 flex items-center">
                  🚀 Quick Start Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl mb-2">👤</div>
                      <h4 className="font-semibold text-sm">1. Create Avatars</h4>
                      <p className="text-xs text-gray-600">Use your custom Tari & Kamsi</p>
                      <div className="mt-2">
                        {tariAvatarId && kamsiAvatarId ? (
                          <Badge className="bg-green-100 text-green-800">✅ Ready</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">⏳ Create Above</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl mb-2">⚙️</div>
                      <h4 className="font-semibold text-sm">2. Configure</h4>
                      <p className="text-xs text-gray-600">Select avatar & voice</p>
                      <div className="mt-2">
                        {selectedAvatar && selectedVoice ? (
                          <Badge className="bg-green-100 text-green-800">✅ Ready</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">⏳ Select Left</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-center p-3 bg-white rounded-lg border">
                      <div className="text-2xl mb-2">🎬</div>
                      <h4 className="font-semibold text-sm">3. Generate</h4>
                      <p className="text-xs text-gray-600">Create AI video</p>
                      <div className="mt-2">
                        {generatedVideoUrl ? (
                          <Badge className="bg-green-100 text-green-800">✅ Complete</Badge>
                        ) : currentVideoId ? (
                          <Badge className="bg-blue-100 text-blue-800">🔄 Processing</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-600">⭐ Ready to Go</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    {!tariAvatarId || !kamsiAvatarId ? (
                      <Button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="flex-1"
                        variant="outline"
                      >
                        ⬆️ Create Avatars First
                      </Button>
                    ) : !selectedAvatar || !selectedVoice ? (
                      <Button 
                        onClick={() => document.querySelector('[data-testid="avatar-voice-config"]')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex-1"
                        variant="outline"
                      >
                        ⬅️ Configure Avatar & Voice
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => document.querySelector('[data-testid="script-section"]')?.scrollIntoView({ behavior: 'smooth' })}
                        className="flex-1"
                      >
                        🎯 Generate Video Now
                      </Button>
                    )}
                    
                    {/* Quick Demo Button */}
                    <Button 
                      onClick={() => {
                        // Set up a quick demo with your existing avatars
                        setSelectedCharacter('tari');
                        setSelectedAvatar(tariAvatarId);
                        setSelectedVoice('1bd001e7e50f421d891986aad5158bc8'); // Female voice
                        setSelectedPreset('introduction');
                        setTimeout(() => {
                          document.querySelector('[data-testid="script-section"]')?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      variant="default"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      🚀 Quick Demo
                    </Button>
                    
                    {currentVideoId && (
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setCurrentVideoId(null);
                          localStorage.removeItem('avatarStudio_currentVideoId');
                          setGeneratedVideoUrl(null);
                        }}
                      >
                        🗑️ Clear
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Debug Info */}
            {false && currentVideoId && (
              <Card className="border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-sm text-orange-800">Debug Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-orange-700 space-y-1">
                    <div>Video ID: {currentVideoId}</div>
                    <div>Status: {JSON.stringify((videoStatus as any)?.status?.status || 'loading')}</div>
                    <div>Video URL: {JSON.stringify((videoStatus as any)?.status?.video_url || 'not available')}</div>
                  </div>
                  <div className="mt-2 space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setCurrentVideoId('00dac0bb-b3a5-4b60-9d6f-3b9b5e2a7d8c')}
                    >
                      Check Previous Video
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setCurrentVideoId(null);
                        localStorage.removeItem('avatarStudio_currentVideoId');
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video History - Always show with placeholder when empty */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Video Gallery ({videoHistory.length} videos)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {videoHistory.length > 0 ? (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {videoHistory.map((video, index) => (
                      <div key={video.id} className={`border rounded-lg p-3 ${video.status === 'completed' ? 'bg-green-50 border-green-200' : video.status === 'processing' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant={video.status === 'completed' ? 'default' : video.status === 'processing' ? 'secondary' : 'destructive'}>
                                {video.status === 'completed' ? '✓ Ready' : video.status === 'processing' ? '⏳ Processing' : '❌ Failed'}
                              </Badge>
                              <span className="text-sm font-medium capitalize">{video.character}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(video.created_at).toLocaleDateString()} {new Date(video.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 truncate">{video.script}</p>
                          </div>
                          <div className="flex space-x-2">
                            {video.video_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setGeneratedVideoUrl(video.video_url || null);
                                }}
                                className="text-xs"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            )}
                            {video.video_url && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (video.video_url) {
                                    window.open(video.video_url, '_blank');
                                  }
                                }}
                                className="text-xs"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🎬</div>
                    <p className="text-sm">Your video gallery is empty</p>
                    <p className="text-xs">Generate videos above to see them here with full history tracking!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Video Processing Status */}
            {currentVideoId && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Video Gallery ({videoHistory.length} videos)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {videoHistory.map((video, index) => (
                      <div key={video.id} className={`border rounded-lg p-3 ${video.status === 'completed' ? 'bg-green-50 border-green-200' : video.status === 'processing' ? 'bg-yellow-50 border-yellow-200' : 'bg-gray-50 border-gray-200'}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Badge variant={video.status === 'completed' ? 'default' : video.status === 'processing' ? 'secondary' : 'destructive'}>
                                {video.status === 'completed' ? '✓ Ready' : video.status === 'processing' ? '⏳ Processing' : '❌ Failed'}
                              </Badge>
                              <span className="text-sm font-medium capitalize">{video.character}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(video.created_at).toLocaleDateString()} {new Date(video.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-1 truncate">{video.script}</p>
                          </div>
                          <div className="flex space-x-2">
                            {video.video_url && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setGeneratedVideoUrl(video.video_url || null);
                                }}
                                className="text-xs"
                              >
                                <Play className="w-3 h-3 mr-1" />
                                View
                              </Button>
                            )}
                            {video.video_url && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  if (video.video_url) {
                                    window.open(video.video_url, '_blank');
                                  }
                                }}
                                className="text-xs"
                              >
                                <Download className="w-3 h-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Current Video Viewer */}
            {generatedVideoUrl && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800 flex items-center">
                    🎬 Currently Viewing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoPlayer
                    src={generatedVideoUrl}
                    title="Generated Avatar Video"
                    className="aspect-video mb-4"
                  />
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => window.open(generatedVideoUrl, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Video
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => setGeneratedVideoUrl(null)}
                    >
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video Gallery & Results */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg text-green-800 flex items-center">
                  🎬 Your Generated Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {true ? (
                  // Always show the completed video
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-800">✅ Your Custom Tari Video</h3>
                      <Badge className="bg-green-100 text-green-800">Ready to Watch</Badge>
                    </div>
                    <VideoPlayer
                      src="https://files2.heygen.ai/aws_pacific/avatar_tmp/8ce6de8f3e7b44b4bc363ae9f553f047/4c9a20a8e330474084f446245e893545.mp4?Expires=1757712910&Signature=hqwkOAcCxyd~WvevV2jYEIY8CGUgVePWgwtP2zWEJwlkZeM-aeG1eOJGa5VALiJQ0Iy2eQK7aTTZfYedEkcxdNfA59NKeSPAG37tDVf0aMpANcudZa6vSWSx1hUjTgWeq1QIuA09q0G8O~pr1yG3ddUZa3YvOXAtN3f8DjZwXC8yO4V~gx4XVDXA2xJIymU0R-b9o48Ud2tJZQfq2t0NXjLe3V0nzDB1lhzEZsjAePNvCndo0edGDzMT5FTcqmnS5090VBbbzbbdk2SuIJP-Fwyi81uberbANLpGhR85KOhZWNduLowx1lFJd1YX-QXr9g0ohhEaoTWs1S0x3-gzrQ__&Key-Pair-Id=K38HBHX5LX3X2H"
                      title="Custom Tari Avatar - Introduction"
                      className="aspect-video mb-4"
                    />
                    
                    <div className="mb-4 p-3 bg-white rounded border">
                      <p className="text-sm text-gray-700">
                        <strong>🎭 Custom Tari Avatar speaking:</strong> "Hello! I'm Tari, your civic authority guide. I'm here to help you understand Nigeria's government systems, voting processes, and your constitutional rights. Together, we'll navigate the path to becoming an informed and engaged citizen."
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => window.open("https://files2.heygen.ai/aws_pacific/avatar_tmp/8ce6de8f3e7b44b4bc363ae9f553f047/4c9a20a8e330474084f446245e893545.mp4?Expires=1757712910&Signature=hqwkOAcCxyd~WvevV2jYEIY8CGUgVePWgwtP2zWEJwlkZeM-aeG1eOJGa5VALiJQ0Iy2eQK7aTTZfYedEkcxdNfA59NKeSPAG37tDVf0aMpANcudZa6vSWSx1hUjTgWeq1QIuA09q0G8O~pr1yG3ddUZa3YvOXAtN3f8DjZwXC8yO4V~gx4XVDXA2xJIymU0R-b9o48Ud2tJZQfq2t0NXjLe3V0nzDB1lhzEZsjAePNvCndo0edGDzMT5FTcqmnS5090VBbbzbbdk2SuIJP-Fwyi81uberbANLpGhR85KOhZWNduLowx1lFJd1YX-QXr9g0ohhEaoTWs1S0x3-gzrQ__&Key-Pair-Id=K38HBHX5LX3X2H", '_blank')}
                        className="flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                      <Button 
                        onClick={() => {
                          // Auto-configure for new video
                          if (tariAvatarId) {
                            setSelectedCharacter('tari');
                            setSelectedAvatar(tariAvatarId);
                            setSelectedVoice('1bd001e7e50f421d891986aad5158bc8');
                            setSelectedPreset('welcome');
                            document.querySelector('[data-testid="script-section"]')?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="flex items-center justify-center bg-blue-600 hover:bg-blue-700"
                      >
                        🎬 Generate Another
                      </Button>
                    </div>
                  </div>
                ) : generatedVideoUrl ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-green-800">✅ Video Ready!</h3>
                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                    </div>
                    <VideoPlayer
                      src={generatedVideoUrl}
                      title={`${selectedCharacter} - ${selectedPreset || 'Custom'}`}
                      className="aspect-video mb-4"
                    />
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => window.open(generatedVideoUrl, '_blank')}
                        className="flex items-center justify-center"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Video
                      </Button>
                      <Button 
                        onClick={() => {
                          setGeneratedVideoUrl(null);
                          setCurrentVideoId(null);
                          localStorage.removeItem('avatarStudio_currentVideoId');
                        }}
                        variant="outline"
                        className="flex items-center justify-center"
                      >
                        🎬 Generate New
                      </Button>
                    </div>
                  </div>
                ) : currentVideoId ? (
                  <div className="text-center py-6">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <h3 className="text-lg font-semibold mb-2">🎬 Generating Your Video...</h3>
                    <p className="text-gray-600 mb-4">
                      Your custom {selectedCharacter} avatar is creating the video. This usually takes 2-5 minutes.
                    </p>
                    <div className="text-sm text-gray-500">
                      Video ID: {currentVideoId?.slice(0, 8)}...
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setCurrentVideoId(null);
                        localStorage.removeItem('avatarStudio_currentVideoId');
                      }}
                      className="mt-4"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            {/* Help & Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips for Better Videos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600 space-y-2">
                  <p>• Keep scripts under 1500 characters for best quality</p>
                  <p>• Choose voices that match your character's personality</p>
                  <p>• Use clear, conversational language</p>
                  <p>• Generation typically takes 2-5 minutes</p>
                  <p>• Videos will be watermarked on free trial</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}