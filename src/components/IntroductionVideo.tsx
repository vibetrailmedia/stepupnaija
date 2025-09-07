import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Upload, ExternalLink } from "lucide-react";
import VideoPlayer from "@/components/VideoPlayer";
import tariAvatarImage from "@/assets/tari-avatar.webp";
import kamsiAvatarImage from "@/assets/kamsi-avatar.webp";

interface IntroductionVideoProps {
  showUploadOption?: boolean;
  className?: string;
}

export default function IntroductionVideo({ showUploadOption = false, className = "" }: IntroductionVideoProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Check if video is available from multiple sources
  const checkForVideo = async () => {
    const videoPaths = [
      '/public-objects/tari-kamsi-introduction.mp4',
      '/public-objects/tari-kamsi-introduction.mp4',
      '/videos/tari-kamsi-introduction.mp4',
      '/assets/videos/tari-kamsi-introduction.mp4'
    ];
    
    for (const path of videoPaths) {
      try {
        const response = await fetch(path, { method: 'HEAD' });
        if (response.ok) {
          setVideoUrl(path);
          setShowVideo(true);
          return;
        }
      } catch (error) {
        console.log(`Video not available at ${path}:`, error);
      }
    }
    
    // No video found, show placeholder
    setShowVideo(false);
  };

  const handlePlayClick = () => {
    if (videoUrl) {
      setShowVideo(true);
    } else {
      checkForVideo();
    }
  };

  if (showVideo && videoUrl) {
    return (
      <div className={`max-w-4xl mx-auto ${className}`}>
        <VideoPlayer
          src={videoUrl}
          poster={tariAvatarImage}
          title="Meet Tari & Kamsi - Your Civic Guides"
          className="aspect-video"
        />
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => setShowVideo(false)}
            className="text-sm"
          >
            Close Video
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-dashed border-green-200">
        <CardContent className="p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-200 shadow-lg mr-4">
              <img 
                src={tariAvatarImage}
                alt="Tari - Civic Authority Guide"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-green-200 shadow-lg mr-6">
              <img 
                src={kamsiAvatarImage}
                alt="Kamsi - Community Connection Guide"
                className="w-full h-full object-cover"
              />
            </div>
            <Play className="w-12 h-12 text-green-600" />
          </div>
          
          <div className="text-center">
            <Button 
              onClick={videoUrl ? handlePlayClick : () => window.location.href = '/video-library'}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Play className="w-4 h-4 mr-2" />
              {videoUrl ? 'Watch Introduction' : 'Browse Video Library'}
            </Button>
          </div>
          
          {!videoUrl && (
            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                📹 Introduction video coming soon
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}