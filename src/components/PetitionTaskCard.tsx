import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { PenTool, Clock, Loader2, Users, ExternalLink } from "lucide-react";

interface PetitionTaskCardProps {
  task: any;
  onComplete: (task: any, petitionData: any) => void;
  isCompleting: boolean;
  colors: any;
}

export function PetitionTaskCard({ task, onComplete, isCompleting, colors }: PetitionTaskCardProps) {
  const { toast } = useToast();
  const [signerName, setSignerName] = useState("");
  const [signerEmail, setSignerEmail] = useState("");
  const [signerLocation, setSignerLocation] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sample petition data based on task type
  const getPetitionInfo = (taskId: string) => {
    switch (taskId) {
      case 'education-funding-petition':
        return {
          title: 'Increase Education Funding in Nigerian Schools',
          target: 'Ministry of Education',
          description: 'We call on the Federal Ministry of Education to increase funding for public schools across Nigeria to ensure quality education for all children.',
          currentSignatures: 1247,
          goal: 5000,
          category: 'Education'
        };
      case 'infrastructure-petition':
        return {
          title: 'Improve Rural Road Infrastructure',
          target: 'Federal Ministry of Works',
          description: 'Petition for the construction and maintenance of rural roads to improve connectivity and economic opportunities in rural communities.',
          currentSignatures: 892,
          goal: 2000,
          category: 'Infrastructure'
        };
      case 'healthcare-petition':
        return {
          title: 'Strengthen Primary Healthcare Centers',
          target: 'Federal Ministry of Health',
          description: 'Demand for better equipment, staffing, and resources for primary healthcare centers in underserved communities.',
          currentSignatures: 1567,
          goal: 3000,
          category: 'Healthcare'
        };
      default:
        return {
          title: 'Community Improvement Initiative',
          target: 'Local Government',
          description: 'Support local community improvement efforts.',
          currentSignatures: 234,
          goal: 1000,
          category: 'Community'
        };
    }
  };

  const petitionInfo = getPetitionInfo(task.id);
  const progressPercentage = Math.min((petitionInfo.currentSignatures / petitionInfo.goal) * 100, 100);

  const handleSubmitPetition = () => {
    // Validate required fields
    if (!signerName.trim() || !signerEmail.trim() || !signerLocation.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in your name, email, and location",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms agreement required",
        description: "Please agree to the terms before signing the petition",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signerEmail)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const petitionData = {
      signerName,
      signerEmail,
      signerLocation,
      personalMessage,
      petitionId: task.id,
      petitionTitle: petitionInfo.title,
      signedAt: new Date().toISOString(),
      taskType: 'petition',
    };

    onComplete(task, petitionData);
  };

  return (
    <Card key={task.id} className={`border-2 ${colors.border} transition-all duration-200 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
            <PenTool className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">
              +{parseFloat(task.rewardSUP).toLocaleString()} SUP
            </div>
            <div className="text-sm text-gray-500">Reward</div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-2" data-testid={`text-task-title-${task.id}`}>
            {task.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3" data-testid={`text-task-description-${task.id}`}>
            {task.description}
          </p>
          
          <div className="flex items-center space-x-2 mb-4">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {task.estimate || '3 min'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <PenTool className="w-3 h-3 mr-1" />
              Petition
            </Badge>
            <Badge className="text-xs bg-purple-100 text-purple-700">
              {petitionInfo.category}
            </Badge>
            {task.difficulty && (
              <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                {task.difficulty}
              </Badge>
            )}
          </div>
        </div>

        {/* Petition Details */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1" data-testid="text-petition-title">
                {petitionInfo.title}
              </h4>
              <p className="text-sm text-gray-600">To: {petitionInfo.target}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </div>
          
          <p className="text-sm text-gray-700 mb-4" data-testid="text-petition-description">
            {petitionInfo.description}
          </p>
          
          {/* Petition Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center text-gray-600">
                <Users className="w-4 h-4 mr-1" />
                Signatures
              </span>
              <span className="font-medium" data-testid="text-signature-count">
                {petitionInfo.currentSignatures.toLocaleString()} of {petitionInfo.goal.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
                data-testid="progress-petition-signatures"
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              {progressPercentage.toFixed(1)}% of goal reached
            </p>
          </div>
        </div>

        {/* Signature Form */}
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="signer-name" className="text-sm font-medium">
              Full Name *
            </Label>
            <Input
              id="signer-name"
              value={signerName}
              onChange={(e) => setSignerName(e.target.value)}
              placeholder="Enter your full name"
              data-testid="input-signer-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signer-email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="signer-email"
              type="email"
              value={signerEmail}
              onChange={(e) => setSignerEmail(e.target.value)}
              placeholder="Enter your email address"
              data-testid="input-signer-email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="signer-location" className="text-sm font-medium">
              Location (State, Nigeria) *
            </Label>
            <Input
              id="signer-location"
              value={signerLocation}
              onChange={(e) => setSignerLocation(e.target.value)}
              placeholder="e.g., Lagos, Nigeria"
              data-testid="input-signer-location"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personal-message" className="text-sm font-medium">
              Personal Message (Optional)
            </Label>
            <Textarea
              id="personal-message"
              value={personalMessage}
              onChange={(e) => setPersonalMessage(e.target.value)}
              placeholder="Add a personal message to strengthen your signature..."
              rows={3}
              data-testid="textarea-personal-message"
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="agree-terms"
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              data-testid="checkbox-agree-terms"
            />
            <Label htmlFor="agree-terms" className="text-xs text-gray-600 leading-relaxed">
              I agree to have my signature and information used for this petition and confirm that I am a Nigerian citizen or resident.
            </Label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitPetition}
          disabled={isCompleting || submitting}
          className={`w-full ${colors.button} text-white font-medium`}
          data-testid={`button-complete-${task.id}`}
        >
          {isCompleting || submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Signing...
            </>
          ) : (
            `Sign Petition & Earn ${parseFloat(task.rewardSUP).toLocaleString()} SUP`
          )}
        </Button>

        {/* Petition Info */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-1">Petition Guidelines:</h5>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Your signature supports democratic participation</li>
            <li>• All information is kept confidential and secure</li>
            <li>• Only one signature per person per petition</li>
            <li>• Valid signatures contribute to policy advocacy</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'Easy':
      return 'bg-green-100 text-green-700';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-700';
    case 'Hard':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}