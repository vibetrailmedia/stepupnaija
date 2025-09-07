import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Heart, 
  Users, 
  MapPin,
  Award,
  Calendar,
  DollarSign
} from "lucide-react";
import type { Project } from "@shared/schema";

interface FundingProgressProps {
  project?: Project;
  showAllProjects?: boolean;
  className?: string;
}

export function FundingProgress({ project, showAllProjects = false, className = "" }: FundingProgressProps) {
  // Fetch projects if showing all projects
  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
    enabled: showAllProjects,
  });

  // Fetch donation analytics
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/donations"],
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatShortAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(1)}K`;
    }
    return formatAmount(amount);
  };

  if (showAllProjects) {
    const topProjects = projects?.slice(0, 5) || [];
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={className}
      >
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              Platform Funding Overview
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Overall Stats */}
            {analytics && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-white rounded-lg border border-blue-200"
                >
                  <div className="text-2xl font-bold text-blue-600">
                    {formatShortAmount(parseFloat(analytics.totalRaised || '0'))}
                  </div>
                  <div className="text-sm text-gray-600">Total Raised</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-white rounded-lg border border-green-200"
                >
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.projectsFunded}
                  </div>
                  <div className="text-sm text-gray-600">Projects Funded</div>
                </motion.div>
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-4 bg-white rounded-lg border border-purple-200 sm:col-span-1 col-span-2"
                >
                  <div className="text-2xl font-bold text-purple-600">
                    {formatShortAmount(parseFloat(analytics.averageDonation || '0'))}
                  </div>
                  <div className="text-sm text-gray-600">Avg. Donation</div>
                </motion.div>
              </div>
            )}

            {/* Top Funded Projects */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-600" />
                Top Funded Projects
              </h4>
              
              <div className="space-y-3">
                {topProjects.map((proj: Project, index: number) => {
                  const raised = parseFloat(proj.raisedNGN || '0');
                  const target = parseFloat(proj.targetNGN?.toString() || '0');
                  const progress = target > 0 ? (raised / target) * 100 : 0;
                  
                  return (
                    <motion.div
                      key={proj.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 pr-3">
                          <h5 className="font-semibold text-gray-900 truncate">{proj.title}</h5>
                          <div className="flex flex-col gap-1 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{proj.lga}</span>
                            </div>
                            <Badge variant="secondary" className="w-fit text-xs">{proj.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 min-w-0">
                          <div className="font-bold text-green-600 text-sm">
                            {progress.toFixed(1)}%
                          </div>
                          <div className="text-xs text-gray-600 whitespace-nowrap">
                            {formatShortAmount(raised)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(progress, 100)}%` }}
                          transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Single project progress view
  if (!project) return null;

  const raisedAmount = parseFloat(project.raisedNGN || '0');
  const targetAmount = parseFloat(project.targetNGN?.toString() || '0');
  const progressPercentage = targetAmount > 0 ? (raisedAmount / targetAmount) * 100 : 0;
  const donorCount = project.donorCount || 0;
  const remainingAmount = Math.max(0, targetAmount - raisedAmount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="h-6 w-6 text-green-600" />
            Funding Progress
          </CardTitle>
          <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {project.lga}
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {donorCount} supporters
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(project.createdAt!).toLocaleDateString()}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Main Progress Visualization */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">
                {formatAmount(raisedAmount)} raised
              </span>
              <span className="text-lg font-bold text-green-600">
                {progressPercentage.toFixed(1)}%
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full relative overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-white opacity-30"
                    animate={{
                      x: ["0%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                      width: "30%",
                    }}
                  />
                </motion.div>
              </div>
              <div className="text-center mt-2 text-sm text-gray-600">
                Goal: {formatAmount(targetAmount)}
              </div>
            </div>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-lg border border-green-200 text-center"
            >
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-green-600">
                {formatShortAmount(raisedAmount)}
              </div>
              <div className="text-sm text-gray-600">Total Raised</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-lg border border-blue-200 text-center"
            >
              <Heart className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-blue-600">
                {donorCount}
              </div>
              <div className="text-sm text-gray-600">Supporters</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-lg border border-orange-200 text-center"
            >
              <Target className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-orange-600">
                {formatShortAmount(remainingAmount)}
              </div>
              <div className="text-sm text-gray-600">Still Needed</div>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-lg border border-purple-200 text-center"
            >
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-lg font-bold text-purple-600">
                {donorCount > 0 ? formatShortAmount(raisedAmount / donorCount) : '₦0'}
              </div>
              <div className="text-sm text-gray-600">Avg. Donation</div>
            </motion.div>
          </div>

          {/* Progress Milestones */}
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Funding Milestones</h4>
            <div className="space-y-2">
              {[25, 50, 75, 100].map((milestone) => {
                const reached = progressPercentage >= milestone;
                const milestoneAmount = (targetAmount * milestone) / 100;
                
                return (
                  <motion.div
                    key={milestone}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: milestone * 0.02 }}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      reached 
                        ? 'bg-green-100 border border-green-300' 
                        : 'bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        reached ? 'bg-green-500' : 'bg-gray-300'
                      }`} />
                      <span className={`text-sm font-medium ${
                        reached ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        {milestone}% Goal
                      </span>
                    </div>
                    <span className={`text-sm font-semibold ${
                      reached ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {formatShortAmount(milestoneAmount)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}