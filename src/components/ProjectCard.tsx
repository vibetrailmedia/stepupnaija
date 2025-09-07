import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, MapPin, Users, TrendingUp, Heart, Target, ZoomIn } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

// Import generated project images
const ogunFarmImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const riversYouthImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const lagosWaterImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const abujaSchoolImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const crossRiverRoadsImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
const kanoClinicImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==";
interface ProjectCardProps {
  project: any;
  showVoteButton?: boolean;
}

// Map database image URLs to actual imported images
const imageMap: Record<string, string> = {
  '@assets/generated_images/Ogun_farmers_cooperative_facility_c3448180.png': ogunFarmImage,
  '@assets/generated_images/Rivers_youth_skill_training_center_5a73d8af.png': riversYouthImage,
  '@assets/generated_images/Lagos_clean_water_project_impact_a203262d.png': lagosWaterImage,
  '@assets/generated_images/Abuja_school_technology_lab_students_47624343.png': abujaSchoolImage,
  '@assets/generated_images/Cross_River_road_construction_project_969e2349.png': crossRiverRoadsImage,
  '@assets/generated_images/Kano_solar_health_clinic_installation_aa20defb.png': kanoClinicImage,
};

export function ProjectCard({ project, showVoteButton = true }: ProjectCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const fundMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', `/api/projects/${project.id}/vote`, { amount: 100 });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project Funded!",
        description: "You've contributed 100 SUP tokens to help fund this community initiative. Each SUP token helps bring this project closer to completion.",
      });
    },
    onError: (error) => {
      toast({
        title: "Funding Failed",
        description: error.message || "Unable to fund project. Please check your SUP token balance.",
        variant: "destructive",
      });
    },
  });

  const targetAmount = parseFloat(project.targetNGN || '1000000');
  const raisedAmount = parseFloat(project.raisedNGN || '0');
  const progressPercentage = Math.min((raisedAmount / targetAmount) * 100, 100);

  // Resolve image URL using mapping or fallback to direct URL
  const getImageUrl = (imageUrl: string) => {
    return imageMap[imageUrl] || imageUrl;
  };

  // Use actual project data only - no fallback mock amounts
  const displayProject = project;

  const displayTargetAmount = parseFloat(displayProject.targetNGN || '0');
  const displayRaisedAmount = parseFloat(displayProject.raisedNGN || '0');
  const displayProgressPercentage = displayTargetAmount > 0 ? Math.min((displayRaisedAmount / displayTargetAmount) * 100, 100) : 0;

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-[1.02] mobile-card">
      {/* Project Image with Status Badge */}
      <div className="relative">
        <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
          <DialogTrigger asChild>
            <div className="relative cursor-pointer group touch-target">
              <img 
                src={getImageUrl(displayProject.imageUrl)} 
                alt={displayProject.title}
                className="w-full h-48 sm:h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                data-testid={`img-project-${project.id}`}
              />
              {/* Mobile-friendly zoom indicator */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-3">
                  <ZoomIn className="w-6 h-6 text-gray-700" />
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
            <VisuallyHidden>
              <DialogTitle>{displayProject.title}</DialogTitle>
              <DialogDescription>{displayProject.description}</DialogDescription>
            </VisuallyHidden>
            <div className="relative">
              <img 
                src={getImageUrl(displayProject.imageUrl)} 
                alt={displayProject.title}
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-xl font-bold mb-2">{displayProject.title}</h3>
                <p className="text-white/90 text-sm">{displayProject.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center text-white/90 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {displayProject.lga}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <div className="absolute top-3 right-3">
          <Badge className={`border-0 font-bold ${
            displayProgressPercentage >= 75 ? 'bg-green-500 text-white animate-pulse' :
            displayProgressPercentage >= 50 ? 'bg-yellow-500 text-black' :
            'bg-red-500 text-white'
          }`}>
            {Math.round(displayProgressPercentage)}% funded
          </Badge>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-5">
        {/* Title and Location */}
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-2" data-testid={`text-project-title-${project.id}`}>
            {displayProject.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-4 h-4 mr-1" />
            {displayProject.lga || 'Lagos'}, Nigeria
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2" data-testid={`text-project-description-${project.id}`}>
          {displayProject.description}
        </p>

        {/* Enhanced Funding Progress */}
        <div className="mb-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-800 flex items-center">
              <Target className="w-4 h-4 mr-1 text-green-600" />
              Funding Progress
            </span>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">
                ₦{Math.round(displayRaisedAmount / 1000)}K / ₦{Math.round(displayTargetAmount / 1000)}K
              </div>
              <div className="text-xs text-gray-500">
                {Math.round(displayProgressPercentage)}% funded
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="relative mb-3">
            <Progress 
              value={displayProgressPercentage} 
              className="h-4 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-500 [&>div]:shadow-md" 
            />
            {displayProgressPercentage > 15 && (
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                {Math.round(displayProgressPercentage)}%
              </div>
            )}
          </div>
          
          {/* Funding Stats Row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-white rounded p-2 border border-gray-100">
              <div className="text-xs text-green-600 font-bold">{Math.floor(displayRaisedAmount / 1000)}</div>
              <div className="text-xs text-gray-500">Supporters</div>
            </div>
            <div className="bg-white rounded p-2 border border-gray-100">
              <div className="text-xs text-blue-600 font-bold">₦{Math.round((displayTargetAmount - displayRaisedAmount) / 1000)}K</div>
              <div className="text-xs text-gray-500">To Go</div>
            </div>
            <div className="bg-white rounded p-2 border border-gray-100">
              <div className="text-xs text-purple-600 font-bold">{Math.max(1, Math.ceil((displayTargetAmount - displayRaisedAmount) / 1000))} days</div>
              <div className="text-xs text-gray-500">Left</div>
            </div>
          </div>
        </div>

        {/* Mobile-Optimized Action Buttons */}
        <div className="space-y-3">
          <Link href={`/projects/${project.id}`}>
            <Button 
              variant="outline"
              className="w-full border-gray-300 hover:bg-gray-50 min-h-[48px] touch-target text-base font-medium"
              data-testid={`button-view-project-${project.id}`}
            >
              <Eye className="w-5 h-5 mr-2" />
              View Full Details
            </Button>
          </Link>
          
          {showVoteButton && (
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 text-white shadow-lg">
              {/* Urgency Banner */}
              <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold text-center mb-3 animate-pulse">
                ⚡ URGENT: Help reach {Math.round(displayProgressPercentage + 10)}% funding!
              </div>
              
              <div className="text-center mb-4">
                <div className="text-lg font-bold mb-1">🚀 Fund This Project</div>
                <div className="text-sm opacity-90">Your SUP tokens drive real change in Nigerian communities</div>
              </div>
              
              {/* Multiple Funding Options */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                  <div className="font-bold text-lg">50</div>
                  <div className="text-xs">SUP Tokens</div>
                  <div className="text-xs opacity-75">₦500</div>
                </div>
                <div className="bg-yellow-400 text-black rounded-lg p-3 text-center border-2 border-yellow-300">
                  <div className="font-bold text-lg">100</div>
                  <div className="text-xs font-bold">SUP Tokens</div>
                  <div className="text-xs">₦1,000 ⭐</div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-lg shadow-xl transform hover:scale-105 transition-all border-2 border-yellow-400 min-h-[56px] touch-target text-base"
                onClick={() => fundMutation.mutate()}
                disabled={fundMutation.isPending}
                data-testid={`button-fund-project-${project.id}`}
              >
                {fundMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Contributing...
                  </>
                ) : (
                  <>
                    <Heart className="w-5 h-5 mr-2" />
                    🎯 Fund Now - 100 SUP
                  </>
                )}
              </Button>
              
              <div className="flex justify-between text-xs mt-3 opacity-90">
                <span>💡 Instant impact</span>
                <span>🏆 Earn rewards</span>
                <span>🇳🇬 Build Nigeria</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
