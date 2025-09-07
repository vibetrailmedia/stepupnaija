import { useState, useRef } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
}

export default function VideoPlayer({ src, poster, title, className = "" }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePlay = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
        } else {
          await videoRef.current.play();
        }
      } catch (error) {
        console.error('Video play error:', error);
        // Don't change playing state on error
        return;
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setHasError(false);
      setErrorMessage("");
      console.log('✅ Video metadata loaded successfully:', {
        duration: videoRef.current.duration,
        src: src,
        readyState: videoRef.current.readyState
      });
    }
  };

  const handleError = (e: any) => {
    console.error('Video failed to load from:', src, 'Error details:', e);
    
    // Don't show error immediately - try to reload first
    setTimeout(() => {
      if (videoRef.current && videoRef.current.error) {
        setHasError(true);
        setErrorMessage("Video temporarily unavailable. Please try refreshing the page.");
      }
    }, 1000);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden shadow-xl ${className}`}>
      <video
        ref={videoRef}
        className="w-full h-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onPlay={() => {
          console.log('▶️ Video started playing');
          setIsPlaying(true);
        }}
        onPause={() => {
          console.log('⏸️ Video paused');
          setIsPlaying(false);
        }}
        onClick={togglePlay}
        onError={handleError}
        onLoadStart={() => console.log('🔄 Video load started:', src)}
        onCanPlay={() => console.log('✅ Video can play:', src)}
        preload="auto"
        playsInline
        controls={false}
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        <p>Your browser does not support the video tag. Please update your browser or try a different one.</p>
      </video>
      
      {/* Error Message Overlay */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center p-6 bg-gray-900 rounded-lg max-w-sm mx-4">
            <div className="text-red-400 mb-2">
              <Play className="w-12 h-12 mx-auto opacity-50" />
            </div>
            <h3 className="text-white font-semibold mb-2">Video Unavailable</h3>
            <p className="text-gray-300 text-sm mb-4">
              {errorMessage}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="text-white border-gray-600 hover:bg-gray-800"
            >
              Try Again
            </Button>
          </div>
        </div>
      )}
      
      {/* Video Controls Overlay - Hidden during playback for clean viewing */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
        {/* Progress Bar - Minimal style */}
        <div className="mb-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-0.5 bg-gray-400/30 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #10b981 0%, #10b981 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
            }}
          />
        </div>
        
        {/* Control Buttons - Minimal style */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="text-white hover:bg-white/20 p-1.5 opacity-80 hover:opacity-100"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="text-white hover:bg-white/20 p-1.5 opacity-80 hover:opacity-100"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
            
            <span className="text-white text-xs opacity-70 ml-2">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/20 p-1.5 opacity-80 hover:opacity-100"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Play Button Overlay (when paused) */}
      {!isPlaying && !hasError && (
        <div 
          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-all"
          onClick={togglePlay}
        >
          <div className="w-20 h-20 bg-green-600 bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 shadow-lg">
            <Play className="w-8 h-8 text-white ml-1" />
          </div>
          <div className="absolute bottom-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-md">
            Click to play
          </div>
        </div>
      )}
    </div>
  );
}