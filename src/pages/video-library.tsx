import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Play, Clock, Eye, Calendar, Users } from "lucide-react";
import { useLocation } from "wouter";
import VideoPlayer from "@/components/VideoPlayer";
import { useState } from "react";
import tariAvatarImage from "@/assets/tari-avatar.webp";
import kamsiAvatarImage from "@/assets/kamsi-avatar.webp";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  views: number;
  uploadDate: string;
  category: string;
  videoUrl: string;
  featured?: boolean;
}

const videoCategories = [
  "All Videos",
  "Civic Education", 
  "Leadership Training",
  "Tari & Kamsi Guides",
  "Community Updates",
  "Success Stories"
];

// Sample videos for demonstration
const sampleVideos: Video[] = [
  {
    id: "tari-kamsi-intro",
    title: "Meet Tari & Kamsi - Your Civic Guides",
    description: "Get introduced to your AI-powered civic engagement guides who will help you navigate Nigeria's democratic transformation.",
    thumbnail: tariAvatarImage,
    duration: "2:15",
    views: 12500,
    uploadDate: "2024-12-01",
    category: "Tari & Kamsi Guides",
    videoUrl: "/public-objects/tari-kamsi-introduction.mp4",
    featured: true
  },
  {
    id: "how-it-works",
    title: "How Step Up Naija Works",
    description: "Learn the simple steps to transform Nigeria together through civic engagement and community participation.",
    thumbnail: tariAvatarImage,
    duration: "3:45",
    views: 8200,
    uploadDate: "2024-11-28",
    category: "Civic Education",
    videoUrl: "/api/videos/how-it-works.mp4"
  },
  {
    id: "13k-challenge",
    title: "#13K Credible Challenge Overview",
    description: "Discover Nigeria's flagship leadership initiative to identify and train 13,000 credible leaders across all 774 LGAs.",
    thumbnail: kamsiAvatarImage,
    duration: "4:20",
    views: 15600,
    uploadDate: "2024-11-25",
    category: "Leadership Training",
    videoUrl: "/api/videos/13k-challenge-overview.mp4",
    featured: true
  },
  {
    id: "civic-participation",
    title: "Why Your Voice Matters in Nigerian Democracy",
    description: "Understanding the importance of civic participation and how every Nigerian can contribute to positive change.",
    thumbnail: tariAvatarImage,
    duration: "5:12",
    views: 9800,
    uploadDate: "2024-11-20",
    category: "Civic Education",
    videoUrl: "/api/videos/civic-participation.mp4"
  },
  {
    id: "community-impact",
    title: "Real Stories of Community Impact",
    description: "See how Step Up Naija participants are making real differences in their communities across Nigeria.",
    thumbnail: kamsiAvatarImage,
    duration: "6:30",
    views: 11200,
    uploadDate: "2024-11-15",
    category: "Success Stories",
    videoUrl: "/api/videos/community-impact.mp4"
  }
];

export default function VideoLibraryPage() {
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All Videos");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filteredVideos = selectedCategory === "All Videos" 
    ? sampleVideos 
    : sampleVideos.filter(video => video.category === selectedCategory);

  const featuredVideos = sampleVideos.filter(video => video.featured);

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (selectedVideo) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedVideo(null)}
            className="mb-6"
            data-testid="button-back-to-library"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Video Library
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <VideoPlayer
                src={selectedVideo.videoUrl}
                poster={selectedVideo.thumbnail}
                title={selectedVideo.title}
                className="aspect-video mb-6"
              />
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="secondary">{selectedVideo.category}</Badge>
                  <div className="flex items-center text-sm text-gray-600">
                    <Eye className="w-4 h-4 mr-1" />
                    {formatViews(selectedVideo.views)} views
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(selectedVideo.uploadDate)}
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedVideo.title}
                </h1>
                
                <p className="text-gray-700 leading-relaxed">
                  {selectedVideo.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">More Videos</h3>
                <div className="space-y-4">
                  {sampleVideos.filter(v => v.id !== selectedVideo.id).slice(0, 4).map((video) => (
                    <div 
                      key={video.id}
                      className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      onClick={() => setSelectedVideo(video)}
                    >
                      <div className="w-24 h-16 bg-gray-200 rounded flex-shrink-0 overflow-hidden">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {video.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-600 gap-2">
                          <span>{formatViews(video.views)} views</span>
                          <span>•</span>
                          <span>{video.duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/")}
            className="mb-6"
            data-testid="button-back-to-home"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Video Library
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our collection of educational videos, guides, and community updates to enhance your civic engagement journey.
            </p>
          </div>
        </div>

        {/* Featured Videos */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredVideos.map((video) => (
              <Card 
                key={video.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative">
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-green-600 bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{video.category}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                  <div className="flex items-center text-sm text-gray-500 gap-4">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-1" />
                      {formatViews(video.views)} views
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(video.uploadDate)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Videos</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {videoCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <Card 
              key={video.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative">
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-green-600 bg-opacity-90 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs">{video.category}</Badge>
                </div>
                <h3 className="font-medium text-sm mb-2 line-clamp-2">{video.title}</h3>
                <div className="flex items-center text-xs text-gray-500 gap-3">
                  <div className="flex items-center">
                    <Eye className="w-3 h-3 mr-1" />
                    {formatViews(video.views)}
                  </div>
                  <span>•</span>
                  <span>{formatDate(video.uploadDate)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">
              No videos available for the selected category. Try choosing a different category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}