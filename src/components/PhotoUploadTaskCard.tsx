import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { Camera, Clock, Loader2, CheckCircle } from "lucide-react";

interface PhotoUploadTaskCardProps {
  task: any;
  onComplete: (task: any, uploadData: any) => void;
  isCompleting: boolean;
  colors: any;
}

export function PhotoUploadTaskCard({ task, onComplete, isCompleting, colors }: PhotoUploadTaskCardProps) {
  const { toast } = useToast();
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePhotoUpload = (uploadUrl: string) => {
    setUploadedPhotoUrl(uploadUrl);
    toast({
      title: "Photo uploaded successfully",
      description: "Now submit your task to earn SUP tokens",
    });
  };

  const handleSubmitTask = () => {
    if (!uploadedPhotoUrl) {
      toast({
        title: "No photo uploaded",
        description: "Please upload a photo before submitting the task",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    const uploadData = {
      photoUrl: uploadedPhotoUrl,
      taskType: 'photo_verification',
      timestamp: new Date().toISOString(),
      description: `Photo evidence for task: ${task.title}`,
    };

    onComplete(task, uploadData);
  };

  return (
    <Card key={task.id} className={`border-2 ${colors.border} transition-all duration-200 hover:shadow-lg`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}>
            <Camera className={`w-6 h-6 ${colors.text}`} />
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
          
          <div className="flex items-center space-x-2 mb-3">
            <Badge variant="outline" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {task.estimate || '10 min'}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Camera className="w-3 h-3 mr-1" />
              Photo Required
            </Badge>
            {task.difficulty && (
              <Badge className={`text-xs ${getDifficultyColor(task.difficulty)}`}>
                {task.difficulty}
              </Badge>
            )}
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <h4 className="font-medium text-gray-900 mb-2">Upload Photo Evidence</h4>
            <p className="text-sm text-gray-600 mb-3">
              Take a photo showing your participation in this civic activity
            </p>
            
            {uploadedPhotoUrl ? (
              <div className="mb-3">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-green-600 font-medium">Photo uploaded successfully!</p>
              </div>
            ) : (
              <div className="mb-3">
                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No photo uploaded yet</p>
              </div>
            )}

            <ObjectUploader
              onComplete={handlePhotoUpload}
              maxFileSize={5242880} // 5MB
              accept="image/*"
              description="Upload photo evidence (max 5MB)"
              buttonClassName="w-full"
            >
              <div className="flex items-center justify-center">
                <Camera className="w-4 h-4 mr-2" />
                {uploadedPhotoUrl ? 'Change Photo' : 'Upload Photo'}
              </div>
            </ObjectUploader>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          onClick={handleSubmitTask}
          disabled={!uploadedPhotoUrl || isCompleting || submitting}
          className={`w-full ${colors.button} text-white font-medium`}
          data-testid={`button-complete-${task.id}`}
        >
          {isCompleting || submitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Submitting...
            </>
          ) : (
            `Submit & Earn ${parseFloat(task.rewardSUP).toLocaleString()} SUP`
          )}
        </Button>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h5 className="font-medium text-blue-900 mb-1">Photo Guidelines:</h5>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Take a clear photo showing your participation</li>
            <li>• Include identifiable landmarks or people (with permission)</li>
            <li>• Ensure the image is well-lit and in focus</li>
            <li>• Photos will be reviewed for authenticity</li>
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