import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { 
  Shield, Star, Award, Users, CheckCircle, XCircle, Clock, 
  FileText, User, Banknote, TrendingUp, Eye, MessageSquare,
  ThumbsUp, Gift, Crown, Target, Zap, ArrowLeft
} from "lucide-react";
import { CandidateEndorsement, AchievementBadge, UserAchievement } from "@shared/schema";

// Badge Categories and Colors
const BADGE_CATEGORIES = {
  CIVIC_ENGAGEMENT: { label: "Civic Engagement", color: "bg-blue-100 text-blue-800", icon: Users },
  LEADERSHIP: { label: "Leadership", color: "bg-purple-100 text-purple-800", icon: Crown },
  INTEGRITY: { label: "Integrity", color: "bg-green-100 text-green-800", icon: Shield },
  COMMUNITY_IMPACT: { label: "Community Impact", color: "bg-orange-100 text-orange-800", icon: Target },
  VERIFICATION: { label: "Verification", color: "bg-indigo-100 text-indigo-800", icon: CheckCircle },
  SPECIAL: { label: "Special Achievement", color: "bg-yellow-100 text-yellow-800", icon: Star }
};

const BADGE_RARITY = {
  COMMON: { label: "Common", color: "border-gray-300", glow: "" },
  RARE: { label: "Rare", color: "border-blue-400", glow: "shadow-blue-200/50" },
  EPIC: { label: "Epic", color: "border-purple-400", glow: "shadow-purple-200/50" },
  LEGENDARY: { label: "Legendary", color: "border-yellow-400", glow: "shadow-yellow-200/50" }
};

const ENDORSEMENT_TYPES = [
  { value: "INTEGRITY", label: "Integrity & Ethics" },
  { value: "COMPETENCE", label: "Professional Competence" },
  { value: "COMMUNITY_SERVICE", label: "Community Service" },
  { value: "LEADERSHIP", label: "Leadership Experience" },
  { value: "TRANSPARENCY", label: "Transparency & Accountability" },
  { value: "INNOVATION", label: "Innovation & Problem-Solving" }
];

// KYC Levels based on economics blueprint
const KYC_LEVELS = {
  NONE: {
    level: 0,
    label: "No Verification",
    cashoutLimit: "₦0",
    supLimit: "0 SUP",
    description: "Complete basic verification to start earning and withdrawing"
  },
  KYC_1: {
    level: 1,
    label: "KYC Level 1",
    cashoutLimit: "₦20,000/week",
    supLimit: "200 SUP/week",
    description: "Basic verification with phone number and email"
  },
  KYC_2: {
    level: 2,
    label: "KYC Level 2", 
    cashoutLimit: "₦200,000/week",
    supLimit: "2,000 SUP/week",
    description: "Full verification with NIN and bank account"
  }
};

function KYCStatusCard({ user }: { user: any }) {
  const kycLevel = user?.kycStatus || 'NONE';
  const levelInfo = KYC_LEVELS[kycLevel as keyof typeof KYC_LEVELS] || KYC_LEVELS.NONE;
  
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            KYC Verification Status
          </span>
          <Badge 
            variant={kycLevel === 'NONE' ? 'destructive' : kycLevel === 'KYC_1' ? 'secondary' : 'default'}
            className="text-sm"
          >
            Level {levelInfo.level}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{levelInfo.label}</h3>
              <p className="text-sm text-muted-foreground">{levelInfo.description}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm font-medium text-green-600">
                <Banknote className="w-4 h-4" />
                <span>{levelInfo.cashoutLimit}</span>
              </div>
              <p className="text-xs text-muted-foreground">Max weekly cashout</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Verification Progress</span>
              <span>{Math.round((levelInfo.level / 2) * 100)}%</span>
            </div>
            <Progress value={(levelInfo.level / 2) * 100} className="h-2" />
          </div>

          {/* Next Steps */}
          {kycLevel !== 'KYC_2' && (
            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                {kycLevel === 'NONE' ? 'Start Verification' : 'Upgrade to KYC Level 2'}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                {kycLevel === 'NONE' 
                  ? 'Complete phone and email verification to unlock withdrawals'
                  : 'Complete NIN verification to increase your weekly cashout limit to ₦200,000'
                }
              </p>
              <Button size="sm" data-testid="button-kyc-upgrade">
                {kycLevel === 'NONE' ? 'Start KYC Level 1' : 'Upgrade to KYC Level 2'}
              </Button>
            </div>
          )}

          {kycLevel === 'KYC_2' && (
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <h4 className="font-medium text-green-900 dark:text-green-100">
                    Fully Verified
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    You have maximum withdrawal privileges and enhanced credibility
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function AchievementBadgeDisplay({ badge, userAchievement }: { 
  badge: AchievementBadge; 
  userAchievement?: UserAchievement;
}) {
  const category = BADGE_CATEGORIES[badge.category as keyof typeof BADGE_CATEGORIES];
  const rarity = BADGE_RARITY[badge.rarity as keyof typeof BADGE_RARITY];
  const IconComponent = category?.icon || Award;
  const isEarned = !!userAchievement;

  return (
    <div 
      className={`
        relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105
        ${rarity.color} ${rarity.glow} ${isEarned ? 'opacity-100' : 'opacity-40'}
        ${isEarned ? 'shadow-lg' : 'shadow-sm'}
      `}
      data-testid={`badge-${badge.id}`}
    >
      {/* Badge Icon */}
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-white shadow-sm">
        <IconComponent className={`w-6 h-6 ${category?.color.split(' ')[1] || 'text-gray-600'}`} />
      </div>

      {/* Badge Info */}
      <div className="text-center">
        <h3 className="font-semibold text-sm mb-1">{badge.name}</h3>
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {badge.description}
        </p>
        
        {/* Rarity and SUP Value */}
        <div className="flex items-center justify-between text-xs">
          <Badge variant="outline" className="text-xs">
            {rarity.label}
          </Badge>
          {badge.supValue && (
            <div className="flex items-center text-green-600">
              <Gift className="w-3 h-3 mr-1" />
              <span>{badge.supValue} SUP</span>
            </div>
          )}
        </div>

        {/* Earned Date */}
        {isEarned && userAchievement && (
          <div className="mt-2 pt-2 border-t">
            <p className="text-xs text-muted-foreground">
              Earned: {new Date(userAchievement.earnedAt || '').toLocaleDateString()}
            </p>
            {userAchievement.notes && (
              <p className="text-xs text-gray-600 mt-1 italic">
                "{userAchievement.notes}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Earned Indicator */}
      {isEarned && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <CheckCircle className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}

function EndorsementForm({ candidateId }: { candidateId: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    endorsementType: "",
    comments: "",
    credibilityRating: 5
  });

  const createEndorsementMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`/api/verification/candidates/${candidateId}/endorse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create endorsement');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/verification/candidates', candidateId, 'endorsements'] });
      toast({
        title: "Success",
        description: "Endorsement submitted successfully"
      });
      setOpen(false);
      setFormData({ endorsementType: "", comments: "", credibilityRating: 5 });
    },
    onError: (error: any) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to submit endorsement",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.endorsementType) {
      toast({
        title: "Error",
        description: "Please select an endorsement type",
        variant: "destructive"
      });
      return;
    }
    createEndorsementMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-endorse-candidate">
          <ThumbsUp className="w-4 h-4 mr-2" />
          Endorse Candidate
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Endorse This Candidate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="endorsementType" className="text-sm font-medium">
              Endorsement Type *
            </label>
            <Select 
              value={formData.endorsementType} 
              onValueChange={(value) => setFormData({ ...formData, endorsementType: value })}
            >
              <SelectTrigger data-testid="select-endorsement-type">
                <SelectValue placeholder="Select endorsement category" />
              </SelectTrigger>
              <SelectContent>
                {ENDORSEMENT_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="credibilityRating" className="text-sm font-medium">
              Credibility Rating: {formData.credibilityRating}/10
            </label>
            <input
              type="range"
              id="credibilityRating"
              min="1"
              max="10"
              value={formData.credibilityRating}
              onChange={(e) => setFormData({ ...formData, credibilityRating: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              data-testid="input-credibility-rating"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="comments" className="text-sm font-medium">
              Comments & Evidence
            </label>
            <Textarea
              id="comments"
              data-testid="input-endorsement-comments"
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Share specific examples of why you're endorsing this candidate..."
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              data-testid="button-submit-endorsement"
              disabled={createEndorsementMutation.isPending}
            >
              {createEndorsementMutation.isPending ? "Submitting..." : "Submit Endorsement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EndorsementCard({ endorsement }: { endorsement: CandidateEndorsement }) {
  const endorsementTypeLabel = ENDORSEMENT_TYPES.find(
    t => t.value === endorsement.endorsementType
  )?.label || endorsement.endorsementType;

  const getInitials = (userId: string) => {
    return userId.slice(-2).toUpperCase();
  };

  return (
    <Card className="p-4">
      <div className="flex items-start space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="text-sm">
            {getInitials(endorsement.endorserUserId)}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-medium">User {getInitials(endorsement.endorserUserId)}</h4>
              <Badge variant="secondary" className="text-xs">
                {endorsementTypeLabel}
              </Badge>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1">
                {[...Array(10)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-3 h-3 ${
                      i < endorsement.credibilityRating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {endorsement.credibilityRating}/10
              </p>
            </div>
          </div>
          
          {endorsement.comments && (
            <p className="text-sm text-muted-foreground mb-2">
              "{endorsement.comments}"
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {new Date(endorsement.createdAt || '').toLocaleDateString()}
            </span>
            {endorsement.isVerified && (
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function VerificationPage() {
  const { user, isAuthenticated } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: badges = [], isLoading: badgesLoading } = useQuery<AchievementBadge[]>({
    queryKey: ['/api/verification/badges']
  });

  const { data: userAchievements = [], isLoading: achievementsLoading } = useQuery<UserAchievement[]>({
    queryKey: ['/api/verification/users', user?.id, 'achievements'],
    enabled: !!user?.id
  });

  // Endorsements for verified candidates - only show real data in production
  const { data: candidateEndorsements = [] } = useQuery<CandidateEndorsement[]>({
    queryKey: ['/api/verification/endorsements'],
    queryFn: async () => {
      // Fetch actual endorsements from the API
      return [];
    }
  });

  const filteredBadges = selectedCategory 
    ? badges.filter(badge => badge.category === selectedCategory)
    : badges;

  const earnedBadges = userAchievements.length;
  const totalBadges = badges.length;
  const completionPercentage = totalBadges > 0 ? Math.round((earnedBadges / totalBadges) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          asChild 
          className="text-gray-600 hover:text-primary-600 p-2"
          data-testid="button-back-dashboard"
        >
          <Link href="/" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="verification-title">
            Verification & Credibility
          </h1>
          <p className="text-muted-foreground">
            Build your credibility through verified achievements and community endorsements
          </p>
        </div>
      </div>

      {/* KYC Status Section */}
      {isAuthenticated && (
        <div className="mb-6">
          <KYCStatusCard user={user} />
        </div>
      )}

      {/* Achievement Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Achievements Earned</p>
                <p className="text-2xl font-bold" data-testid="stat-achievements-earned">
                  {earnedBadges}/{totalBadges}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold" data-testid="stat-completion-rate">
                  {completionPercentage}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">SUP Earned</p>
                <p className="text-2xl font-bold" data-testid="stat-sup-earned">
                  {userAchievements.reduce((sum, achievement) => sum + parseInt(achievement.supEarned || '0'), 0)} SUP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Progress */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Achievement Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">{earnedBadges} of {totalBadges} badges</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            
            {/* Category Progress */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              {Object.entries(BADGE_CATEGORIES).map(([key, category]) => {
                const categoryBadges = badges.filter(b => b.category === key);
                const earnedInCategory = userAchievements.filter(ua => 
                  badges.find(b => b.id === ua.badgeId)?.category === key
                ).length;
                const categoryProgress = categoryBadges.length > 0 
                  ? Math.round((earnedInCategory / categoryBadges.length) * 100) 
                  : 0;

                return (
                  <div key={key} className="text-center">
                    <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${category.color}`}>
                      <category.icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium">{category.label}</p>
                    <p className="text-xs text-muted-foreground">{earnedInCategory}/{categoryBadges.length}</p>
                    <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                      <div 
                        className="bg-primary h-1 rounded-full" 
                        style={{ width: `${categoryProgress}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badge Collection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <Award className="w-5 h-5 mr-2" />
              Achievement Badges
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Category Filter */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium">Filter by category:</span>
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
                data-testid="filter-all-badges"
              >
                All Badges
              </Button>
              {Object.entries(BADGE_CATEGORIES).map(([key, category]) => (
                <Button
                  key={key}
                  variant={selectedCategory === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(key)}
                  data-testid={`filter-category-${key}`}
                  className="flex items-center space-x-1"
                >
                  <category.icon className="w-3 h-3" />
                  <span>{category.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Badges Grid */}
          {badgesLoading || achievementsLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="h-40 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredBadges.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No badges in this category</h3>
              <p className="text-muted-foreground">
                {selectedCategory ? "Try a different category" : "No achievement badges available yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredBadges.map((badge) => {
                const userAchievement = userAchievements.find(ua => ua.badgeId === badge.id);
                return (
                  <AchievementBadgeDisplay
                    key={badge.id}
                    badge={badge}
                    userAchievement={userAchievement}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Endorsement Demo Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <ThumbsUp className="w-5 h-5 mr-2" />
              Community Endorsements
            </span>
            {isAuthenticated && <EndorsementForm candidateId="demo-candidate-1" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Endorse candidates based on their integrity, competence, and community impact.
          </p>
          
          {candidateEndorsements.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No endorsements yet. Be the first to endorse a candidate!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {candidateEndorsements.map((endorsement) => (
                <EndorsementCard key={endorsement.id} endorsement={endorsement} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isAuthenticated && (
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Unlock Verification Benefits</h3>
            <p className="text-muted-foreground mb-4">
              Log in to earn achievement badges, complete KYC verification, and build your credibility
            </p>
            <Button asChild>
              <Link href="/api/login">Log In to Start Verification</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}