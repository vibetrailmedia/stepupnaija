import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Star, Loader2, CheckCircle } from "lucide-react";

interface NominationTaskCardProps {
  task: any;
  onComplete: (task: any, nominationData: any) => void;
  isCompleting: boolean;
  colors: any;
}

export function NominationTaskCard({ task, onComplete, isCompleting, colors }: NominationTaskCardProps) {
  const { toast } = useToast();
  const [nomineeData, setNomineeData] = useState({
    name: "",
    location: "",
    category: "",
    description: "",
    impact: "",
    contact: ""
  });

  const categories = [
    "Education Advocate",
    "Healthcare Hero",
    "Environmental Champion", 
    "Youth Leader",
    "Community Organizer",
    "Anti-Corruption Fighter",
    "Infrastructure Advocate",
    "Women's Rights Activist",
    "Disability Rights Champion",
    "Poverty Alleviation Hero"
  ];

  const handleInputChange = (field: string, value: string) => {
    setNomineeData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!nomineeData.name || !nomineeData.category || !nomineeData.description) {
      toast({
        title: "Incomplete Form",
        description: "Please fill in the nominee's name, category, and description.",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      taskType: 'nomination',
      nominee: nomineeData,
      completedAt: new Date().toISOString(),
    };

    onComplete(task, submissionData);
  };

  return (
    <Card className={`border-2 ${colors.border} transition-all duration-200 hover:shadow-lg`}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center`}>
            <Star className={`w-6 h-6 ${colors.text}`} />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-gray-900">
              {task.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {task.description}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-blue-800">Recognition Guidelines</span>
          </div>
          <p className="text-sm text-blue-700">
            Nominate someone making a positive impact in your community. This could be a teacher, 
            healthcare worker, activist, or any individual whose work deserves recognition.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nominee-name" className="text-sm font-medium text-gray-700">
              Full Name of Nominee *
            </Label>
            <Input
              id="nominee-name"
              value={nomineeData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter the nominee's full name"
              className="mt-1"
              data-testid="input-nominee-name"
            />
          </div>

          <div>
            <Label htmlFor="nominee-location" className="text-sm font-medium text-gray-700">
              Location (State/LGA)
            </Label>
            <Input
              id="nominee-location"
              value={nomineeData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="e.g., Lagos State, Ikeja LGA"
              className="mt-1"
              data-testid="input-nominee-location"
            />
          </div>

          <div>
            <Label htmlFor="nominee-category" className="text-sm font-medium text-gray-700">
              Impact Category *
            </Label>
            <select
              id="nominee-category"
              value={nomineeData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              data-testid="select-nominee-category"
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="nominee-description" className="text-sm font-medium text-gray-700">
              Why are you nominating this person? *
            </Label>
            <Textarea
              id="nominee-description"
              value={nomineeData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what makes this person special and worthy of recognition..."
              className="mt-1 min-h-[100px]"
              data-testid="textarea-nominee-description"
            />
          </div>

          <div>
            <Label htmlFor="nominee-impact" className="text-sm font-medium text-gray-700">
              Specific Impact or Achievement
            </Label>
            <Textarea
              id="nominee-impact"
              value={nomineeData.impact}
              onChange={(e) => handleInputChange('impact', e.target.value)}
              placeholder="What specific positive changes have they made in the community?"
              className="mt-1 min-h-[80px]"
              data-testid="textarea-nominee-impact"
            />
          </div>

          <div>
            <Label htmlFor="nominee-contact" className="text-sm font-medium text-gray-700">
              Contact Information (Optional)
            </Label>
            <Input
              id="nominee-contact"
              value={nomineeData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              placeholder="Phone number or email (if known)"
              className="mt-1"
              data-testid="input-nominee-contact"
            />
          </div>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isCompleting}
            className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 rounded-lg transition-colors"
            data-testid="button-submit-nomination"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Star className="w-4 h-4 mr-2" />
                Submit Nomination (+{task.rewardSUP} SUP)
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}