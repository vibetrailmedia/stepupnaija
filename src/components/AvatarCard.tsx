import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";
import tariAvatarImage from "@/assets/tari-avatar.webp";
import kamsiAvatarImage from "@/assets/kamsi-avatar.webp";

interface AvatarCardProps {
  character: "tari" | "kamsi";
  message: string | ReactNode;
  variant?: "welcome" | "guidance" | "encouragement" | "explanation";
  action?: ReactNode;
}

export default function AvatarCard({ character, message, variant = "guidance", action }: AvatarCardProps) {
  const avatarConfig = {
    tari: {
      name: "Tari",
      description: "Civic Authority Guide",
      style: "calm and principled voice",
      gradientFrom: "from-blue-600",
      gradientTo: "to-green-600",
      textColor: "text-blue-800"
    },
    kamsi: {
      name: "Kamsi", 
      description: "Community Connection Guide",
      style: "warm and engaging voice", 
      gradientFrom: "from-green-500",
      gradientTo: "to-blue-500",
      textColor: "text-green-800"
    }
  };

  const config = avatarConfig[character];
  
  const variantStyles = {
    welcome: "border-2 border-opacity-50",
    guidance: "border border-opacity-30", 
    encouragement: "border-2 border-dashed border-opacity-40",
    explanation: "border border-opacity-20"
  };

  return (
    <Card className={`bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo} bg-opacity-10 ${variantStyles[variant]} ${config.gradientFrom.replace('from-', 'border-')} shadow-md`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          {/* Avatar Image */}
          <div className={`w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-lg ring-2 ring-opacity-50 ${config.gradientFrom.replace('from-', 'ring-')}`}>
            <img 
              src={character === 'tari' ? tariAvatarImage : kamsiAvatarImage}
              alt={`${config.name} - ${config.description}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Message Content */}
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h4 className={`font-semibold ${config.textColor}`}>
                {config.name}
              </h4>
              <span className="text-xs text-gray-600 ml-2">
                {config.description}
              </span>
            </div>
            
            <div className="text-gray-800 mb-3">
              {typeof message === 'string' ? (
                <p>{message}</p>
              ) : (
                message
              )}
            </div>
            
            {action && (
              <div className="mt-4">
                {action}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}