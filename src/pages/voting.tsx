import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Vote, 
  Coins, 
  Users, 
  MapPin, 
  Award, 
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Wallet,
  Trophy
} from "lucide-react";
import { useLocation } from "wouter";

const nigerianStates = [
  "All States", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
  "Yobe", "Zamfara"
];

interface VotingCandidate {
  id: string;
  name: string;
  state: string;
  lga: string;
  targetRole: string;
  overallScore: number;
  integrityScore: number;
  competenceScore: number;
  commitmentScore: number;
  endorsements: number;
  currentVotes: number;
  profileImageUrl?: string;
  applicationStatement?: string;
  visionForLGA?: string;
  hasUserVoted: boolean;
  userVoteAmount?: number;
  voteDeadline: string;
}

interface VotingRound {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "ENDED" | "UPCOMING";
  tokenCost: number;
  maxVotesPerUser: number;
  totalParticipants: number;
  totalVotesCast: number;
}

export default function Voting() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Filters
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedTab, setSelectedTab] = useState("candidates");
  const [voteAmount, setVoteAmount] = useState<{ [key: string]: number }>({});

  // Fetch voting rounds
  const { data: currentRound } = useQuery<VotingRound>({
    queryKey: ["/api/challenge/voting/current-round"],
    retry: false,
  });

  // Fetch qualified candidates for voting
  const { data: candidates = [], isLoading } = useQuery<VotingCandidate[]>({
    queryKey: ["/api/challenge/voting/candidates", selectedState],
    retry: false,
  });

  // Fetch user's wallet
  const { data: wallet } = useQuery<{ supTokens: number; ngnBalance: number }>({
    queryKey: ["/api/wallet"],
    retry: false,
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ candidateId, amount }: { candidateId: string; amount: number }) => {
      return await apiRequest("POST", "/api/challenge/voting/vote", {
        candidateId,
        amount,
      });
    },
    onSuccess: () => {
      toast({
        title: "Vote Cast Successfully",
        description: "Your vote has been recorded. Thank you for participating!",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/challenge/voting/candidates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/wallet"] });
    },
    onError: (error: any) => {
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to cast vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter candidates
  const filteredCandidates = candidates.filter((candidate: VotingCandidate) => {
    return selectedState === "All States" || candidate.state === selectedState;
  });

  const handleVote = (candidateId: string) => {
    const amount = voteAmount[candidateId] || 1;
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to vote.",
        variant: "destructive",
      });
      return;
    }

    if (!wallet || wallet.supTokens < amount) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough SUP tokens to vote.",
        variant: "destructive",
      });
      return;
    }

    if (amount < 1 || amount > 10) {
      toast({
        title: "Invalid Vote Amount",
        description: "Vote amount must be between 1 and 10 SUP tokens.",
        variant: "destructive",
      });
      return;
    }

    voteMutation.mutate({ candidateId, amount });
  };

  const getTimeRemaining = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Voting ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    return `${hours}h remaining`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading voting candidates...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 py-8 page-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Hero Style */}
        <div className="text-center space-y-6 py-8 lg:py-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            🗳️ Vote for Nigeria's <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Credible Leaders</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
            Join millions of Nigerians voting to select 13,000 credible leaders using your SUP tokens. Shape Nigeria's democratic future across all 774 LGAs.
          </p>
        </div>

        {/* Current Round Info */}
        {currentRound && (
          <Card className="mb-8 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <Trophy className="w-5 h-5" />
                {currentRound.title}
              </CardTitle>
              <p className="text-yellow-700">{currentRound.description}</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-800">{currentRound.tokenCost}</div>
                  <div className="text-sm text-yellow-600">SUP per vote</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-800">{currentRound.maxVotesPerUser}</div>
                  <div className="text-sm text-yellow-600">Max votes per user</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-800">{currentRound.totalParticipants}</div>
                  <div className="text-sm text-yellow-600">Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-800">
                    {getTimeRemaining(currentRound.endDate)}
                  </div>
                  <div className="text-sm text-yellow-600">Time remaining</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Wallet Balance */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-green-600" />
                <span className="font-medium">Your SUP Balance:</span>
                <span className="text-2xl font-bold text-green-600">{wallet?.supTokens || 0}</span>
              </div>
              <Button
                variant="outline"
                onClick={() => setLocation("/wallet")}
                data-testid="button-add-funds"
              >
                Add Funds
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full mb-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="candidates">Voting Candidates</TabsTrigger>
            <TabsTrigger value="results">Live Results</TabsTrigger>
          </TabsList>

          <TabsContent value="candidates">
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Filter by State</label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger data-testid="select-state-filter">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {nigerianStates.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <div className="text-sm text-gray-600">
                      Showing {filteredCandidates.length} qualified candidates
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Candidates Grid */}
            {filteredCandidates.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No qualified candidates</h3>
                  <p className="text-gray-600">
                    No candidates are currently qualified for voting in the selected state.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCandidates.map((candidate: VotingCandidate) => (
                  <Card key={candidate.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={candidate.profileImageUrl} />
                            <AvatarFallback className="bg-green-100 text-green-700">
                              {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{candidate.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <MapPin className="w-3 h-3" />
                              {candidate.lga}, {candidate.state}
                            </div>
                            <div className="text-sm text-gray-600">{candidate.targetRole}</div>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Qualified
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                      {/* Current Votes */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-blue-800">Current Votes</span>
                          <span className="text-2xl font-bold text-blue-800">{candidate.currentVotes}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-blue-600">
                          <Users className="w-3 h-3" />
                          <span>{candidate.endorsements} community endorsements</span>
                        </div>
                      </div>

                      {/* Credibility Score */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">Overall Credibility</span>
                          <span className="font-bold text-green-600">{candidate.overallScore}/100</span>
                        </div>
                        <Progress value={candidate.overallScore} className="h-3" />
                        <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                          <div className="text-center">
                            <div className="font-medium">Integrity</div>
                            <div className="text-gray-600">{candidate.integrityScore}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">Competence</div>
                            <div className="text-gray-600">{candidate.competenceScore}</div>
                          </div>
                          <div className="text-center">
                            <div className="font-medium">Commitment</div>
                            <div className="text-gray-600">{candidate.commitmentScore}</div>
                          </div>
                        </div>
                      </div>

                      {/* Vision Statement */}
                      {candidate.visionForLGA && (
                        <div>
                          <div className="text-sm font-medium text-gray-700 mb-1">Vision for LGA</div>
                          <p className="text-sm text-gray-600 line-clamp-3">{candidate.visionForLGA}</p>
                        </div>
                      )}

                      {/* Voting Section */}
                      <div className="pt-4 border-t">
                        {candidate.hasUserVoted ? (
                          <div className="bg-green-50 rounded-lg p-3 text-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
                            <div className="text-sm font-medium text-green-800">
                              You voted {candidate.userVoteAmount} SUP tokens
                            </div>
                            <div className="text-xs text-green-600">Thank you for participating!</div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                min="1"
                                max="10"
                                placeholder="1-10"
                                value={voteAmount[candidate.id] || ''}
                                onChange={(e) => setVoteAmount(prev => ({
                                  ...prev,
                                  [candidate.id]: parseInt(e.target.value) || 0
                                }))}
                                className="w-20"
                                data-testid={`input-vote-amount-${candidate.id}`}
                              />
                              <span className="text-sm text-gray-600">SUP tokens</span>
                            </div>
                            <Button
                              onClick={() => handleVote(candidate.id)}
                              disabled={voteMutation.isPending || !wallet || wallet.supTokens < (voteAmount[candidate.id] || 1)}
                              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                              data-testid={`button-vote-${candidate.id}`}
                            >
                              <Vote className="w-4 h-4 mr-2" />
                              {voteMutation.isPending ? "Voting..." : "Cast Vote"}
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Time Remaining */}
                      <div className="text-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {getTimeRemaining(candidate.voteDeadline)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Live Voting Results
                </CardTitle>
                <p className="text-gray-600">
                  Real-time voting results sorted by total votes received.
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredCandidates
                    .sort((a, b) => b.currentVotes - a.currentVotes)
                    .map((candidate, index) => (
                      <div key={candidate.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
                          {index + 1}
                        </div>
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={candidate.profileImageUrl} />
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-semibold">{candidate.name}</div>
                          <div className="text-sm text-gray-600">{candidate.lga}, {candidate.state}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{candidate.currentVotes}</div>
                          <div className="text-sm text-gray-600">votes</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}