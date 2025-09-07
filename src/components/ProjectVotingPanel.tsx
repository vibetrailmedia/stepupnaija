import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Users, 
  Target, 
  Clock,
  Heart,
  Trophy,
  Coins,
  Activity,
  BarChart3,
  UserCheck,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ProjectVotingPanelProps {
  projectId: string;
  projectTitle: string;
}

export default function ProjectVotingPanel({ projectId, projectTitle }: ProjectVotingPanelProps) {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch project voting analytics
  const { data: analytics } = useQuery({
    queryKey: [`/api/projects/${projectId}/analytics`],
    retry: false,
  });

  // Fetch recent votes
  const { data: votes } = useQuery({
    queryKey: [`/api/projects/${projectId}/votes`],
    retry: false,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', `/api/projects/${projectId}/vote`, { amount: selectedAmount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/analytics`] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/votes`] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      
      toast({
        title: 'Vote Successful! 🎉',
        description: `You voted ${selectedAmount} SUP tokens for ${projectTitle}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Vote Failed',
        description: error.message || 'Failed to vote on project',
        variant: 'destructive',
      });
    },
  });

  const voteAmountOptions = [25, 50, 100, 200];

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            Project Voting Hub
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            {analytics?.uniqueVoters || 0} Supporters
          </Badge>
        </div>
        <CardDescription>
          Make your voice heard and drive community impact
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="vote" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vote">Cast Vote</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="voters">Recent Voters</TabsTrigger>
          </TabsList>

          {/* Voting Tab */}
          <TabsContent value="vote" className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <span className="font-semibold text-blue-800">Choose Your Vote Amount</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mb-4">
                {voteAmountOptions.map((amount) => (
                  <Button
                    key={amount}
                    variant={selectedAmount === amount ? 'default' : 'outline'}
                    className={`h-16 ${
                      selectedAmount === amount 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'hover:bg-blue-50'
                    }`}
                    onClick={() => setSelectedAmount(amount)}
                    data-testid={`button-select-amount-${amount}`}
                  >
                    <div className="text-center">
                      <div className="text-lg font-bold">{amount}</div>
                      <div className="text-xs opacity-75">SUP Tokens</div>
                    </div>
                  </Button>
                ))}
              </div>

              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg transform hover:scale-105 transition-all"
                onClick={() => voteMutation.mutate()}
                disabled={voteMutation.isPending}
                data-testid={`button-cast-vote-${projectId}`}
              >
                {voteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Casting Vote...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Vote {selectedAmount} SUP
                  </>
                )}
              </Button>

              <div className="flex justify-between text-xs mt-3 text-blue-600">
                <span className="flex items-center">
                  <Trophy className="w-3 h-3 mr-1" />
                  Earn rewards
                </span>
                <span className="flex items-center">
                  <Coins className="w-3 h-3 mr-1" />
                  Build communities
                </span>
                <span className="flex items-center">
                  <UserCheck className="w-3 h-3 mr-1" />
                  Verified impact
                </span>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <Badge variant="secondary" className="bg-green-100 text-green-700">Total</Badge>
                </div>
                <div className="text-2xl font-bold text-green-800">
                  {analytics?.totalSupAmount || 0}
                </div>
                <div className="text-sm text-green-600">SUP Tokens Voted</div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">Active</Badge>
                </div>
                <div className="text-2xl font-bold text-blue-800">
                  {analytics?.totalVotes || 0}
                </div>
                <div className="text-sm text-blue-600">Total Votes Cast</div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <Badge variant="secondary" className="bg-purple-100 text-purple-700">Avg</Badge>
                </div>
                <div className="text-2xl font-bold text-purple-800">
                  {Math.round(analytics?.avgVoteAmount || 0)}
                </div>
                <div className="text-sm text-purple-600">Average Vote</div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <div className="flex items-center justify-between mb-2">
                  <Heart className="w-5 h-5 text-orange-600" />
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700">Unique</Badge>
                </div>
                <div className="text-2xl font-bold text-orange-800">
                  {analytics?.uniqueVoters || 0}
                </div>
                <div className="text-sm text-orange-600">Supporters</div>
              </Card>
            </div>

            {/* Engagement Progress */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-semibold">Community Engagement</span>
                <Badge variant="outline">{Math.min(100, ((analytics?.uniqueVoters || 0) / 50) * 100).toFixed(0)}%</Badge>
              </div>
              <Progress 
                value={Math.min(100, ((analytics?.uniqueVoters || 0) / 50) * 100)} 
                className="h-3 mb-2"
              />
              <div className="text-sm text-gray-600">
                {Math.max(0, 50 - (analytics?.uniqueVoters || 0))} more supporters needed for maximum impact
              </div>
            </Card>
          </TabsContent>

          {/* Recent Voters Tab */}
          <TabsContent value="voters" className="space-y-4">
            <div className="space-y-3">
              {analytics?.recentVotes?.length > 0 ? (
                analytics.recentVotes.map((vote: any) => (
                  <Card key={vote.id} className="p-3 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={vote.userProfileImageUrl} />
                          <AvatarFallback>{vote.userFirstName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {vote.userFirstName} {vote.userLastName?.[0]}.
                          </div>
                          <div className="text-xs text-gray-500 flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(vote.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {vote.amountSUP} SUP
                      </Badge>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Be the first to vote on this project!</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}