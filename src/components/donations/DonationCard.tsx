import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Heart, 
  Target, 
  TrendingUp, 
  Users, 
  MapPin, 
  Clock,
  Gift,
  Lock
} from "lucide-react";
import type { Project } from "@shared/schema";

interface DonationCardProps {
  project: Project;
  className?: string;
  compact?: boolean;
}

export function DonationCard({ project, className = "", compact = false }: DonationCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [donationAmount, setDonationAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Calculate funding progress
  const raisedAmount = parseFloat(project.raisedNGN || '0');
  const targetAmount = parseFloat(project.targetNGN?.toString() || '0');
  const fundingGoal = parseFloat(project.fundingGoalNgn || project.targetNGN?.toString() || '0');
  const progressPercentage = targetAmount > 0 ? Math.min((raisedAmount / targetAmount) * 100, 100) : 0;
  const donorCount = project.donorCount || 0;

  // Fetch recent donations for social proof
  const { data: recentDonations } = useQuery({
    queryKey: ["/api/projects", project.id, "donations"],
    enabled: !compact,
  });

  // Donation mutation
  const donationMutation = useMutation({
    mutationFn: async (donationData: any) => {
      const res = await apiRequest("POST", `/api/projects/${project.id}/donate`, donationData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Donation Initiated! 🎉",
        description: "Please complete the payment to support this project.",
      });
      setShowDonationForm(false);
      setDonationAmount("");
      setMessage("");
      setDonorName("");
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
    },
    onError: (error) => {
      toast({
        title: "Donation Failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDonate = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    donationMutation.mutate({
      amountNGN: parseFloat(donationAmount),
      isAnonymous,
      donorName: isAnonymous ? null : donorName,
      message: message.trim() || null,
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (compact) {
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        className={`bg-white rounded-lg border-2 border-green-200 p-4 ${className}`}
      >
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900 truncate">{project.title}</h4>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {project.category}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {project.lga}
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {formatAmount(raisedAmount)} raised
            </span>
            <span className="font-semibold text-green-600">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
        </div>

        <Button
          onClick={() => setShowDonationForm(true)}
          className="w-full bg-green-600 hover:bg-green-700"
          size="sm"
        >
          <Heart className="h-4 w-4 mr-2" />
          Donate Now
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Target className="h-6 w-6 text-green-600" />
              {project.title}
            </CardTitle>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              {project.category}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {project.lga}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {donorCount} donors
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {new Date(project.createdAt!).toLocaleDateString()}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">{project.description}</p>

          {/* Funding Progress */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Funding Progress</span>
              <span className="text-sm font-bold text-green-600">
                {progressPercentage.toFixed(1)}% of goal
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg border border-green-200">
                <div className="text-lg font-bold text-green-600">
                  {formatAmount(raisedAmount)}
                </div>
                <div className="text-xs text-gray-600">Raised</div>
              </div>
              <div className="bg-white p-3 rounded-lg border border-green-200">
                <div className="text-lg font-bold text-gray-700">
                  {formatAmount(targetAmount)}
                </div>
                <div className="text-xs text-gray-600">Goal</div>
              </div>
            </div>
          </div>

          {/* Recent Donors */}
          {recentDonations && recentDonations.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-gray-700">Recent Support</h4>
              <div className="space-y-2 max-h-24 overflow-y-auto">
                {recentDonations.slice(0, 3).map((donation: any) => (
                  <div key={donation.id} className="flex items-center justify-between bg-white p-2 rounded border border-green-100">
                    <span className="text-sm font-medium">
                      {donation.donorName || 'Anonymous'}
                    </span>
                    <span className="text-sm text-green-600 font-bold">
                      {formatAmount(parseFloat(donation.amountNGN))}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Donation Action */}
          {!showDonationForm ? (
            <Button
              onClick={() => setShowDonationForm(true)}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <Heart className="h-5 w-5 mr-2" />
              Support This Project
            </Button>
          ) : (
            <div className="space-y-4 bg-white p-4 rounded-lg border-2 border-green-200">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Gift className="h-5 w-5 text-green-600" />
                Make a Donation
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Amount (NGN)
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="border-green-300 focus:border-green-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Donate Anonymously
                  </label>
                  <Switch
                    checked={isAnonymous}
                    onCheckedChange={setIsAnonymous}
                  />
                </div>

                {!isAnonymous && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name (optional)
                    </label>
                    <Input
                      placeholder="Enter your name"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="border-green-300 focus:border-green-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message of Support (optional)
                  </label>
                  <Textarea
                    placeholder="Leave a message of encouragement..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="border-green-300 focus:border-green-500"
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleDonate}
                    disabled={donationMutation.isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {donationMutation.isPending ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart className="h-4 w-4 mr-2" />
                        Donate Now
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={() => setShowDonationForm(false)}
                    variant="outline"
                    className="px-6"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}