import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Users,
  MessageCircle,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Network as NetworkIcon,
  Plus,
  Send,
  ArrowLeft,
  Heart
} from "lucide-react";

const nigerianStates = [
  "All States", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
  "Yobe", "Zamfara"
];

interface ConnectionRequest {
  id: string;
  requesterUserId: string;
  recipientUserId: string;
  status: string;
  connectionType: string;
  message: string;
  createdAt: string;
}

interface RegionalGroup {
  id: string;
  name: string;
  description: string;
  state: string;
  lga: string;
  type: string;
  memberCount: number;
  leaderUserId: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  state?: string;
  lga?: string;
  kycStatus?: string;
  profileBio?: string;
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
  userType?: string;
  volunteerStatus?: string;
}

export default function Network() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedState, setSelectedState] = useState("All States");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
    state: "",
    lga: "",
    type: "STATE_CHAPTER"
  });

  // Fetch connection requests
  const { data: connectionRequests = [] } = useQuery<ConnectionRequest[]>({
    queryKey: ['/api/connections/requests'],
    retry: false,
  });

  // Fetch connections
  const { data: connections = [] } = useQuery<ConnectionRequest[]>({
    queryKey: ['/api/connections'],
    retry: false,
  });

  // Fetch regional groups
  const { data: regionalGroups = [] } = useQuery<RegionalGroup[]>({
    queryKey: ['/api/regional-groups', selectedState === "All States" ? "" : selectedState],
    retry: false,
  });

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch discoverable users with debounced search
  const { data: discoverableUsers = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users/discover', debouncedSearch, selectedState === "All States" ? "" : selectedState],
    retry: false,
  });

  // Fetch recommended users (people you may know)
  const { data: recommendedUsers = [] } = useQuery<User[]>({
    queryKey: ['/api/users/recommendations'],
    retry: false,
  });

  // Fetch activity feed
  const { data: activities = [] } = useQuery<any[]>({
    queryKey: ['/api/users/activity-feed'],
    retry: false,
  });

  // Respond to connection request mutation
  const respondMutation = useMutation({
    mutationFn: async ({ connectionId, status }: { connectionId: string; status: string }) => {
      return await apiRequest("PUT", `/api/connections/${connectionId}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Response Sent",
        description: "Connection request updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/connections/requests'] });
      queryClient.invalidateQueries({ queryKey: ['/api/connections'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to respond to connection request.",
        variant: "destructive",
      });
    },
  });

  // Create regional group mutation
  const createGroupMutation = useMutation({
    mutationFn: async (group: typeof newGroup) => {
      return await apiRequest("POST", '/api/regional-groups', group);
    },
    onSuccess: () => {
      toast({
        title: "Group Created",
        description: "Regional group created successfully.",
      });
      setShowCreateGroup(false);
      setNewGroup({ name: "", description: "", state: "", lga: "", type: "STATE_CHAPTER" });
      queryClient.invalidateQueries({ queryKey: ['/api/regional-groups'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create regional group.",
        variant: "destructive",
      });
    },
  });

  // Join group mutation
  const joinGroupMutation = useMutation({
    mutationFn: async (groupId: string) => {
      return await apiRequest(`/api/regional-groups/${groupId}/join`, "POST");
    },
    onSuccess: () => {
      toast({
        title: "Joined Group",
        description: "Successfully joined regional group.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/regional-groups'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join regional group.",
        variant: "destructive",
      });
    },
  });

  // Follow/Unfollow user mutation with optimistic updates
  const followMutation = useMutation({
    mutationFn: async ({ userId, action }: { userId: string; action: 'follow' | 'unfollow' }) => {
      // Rate limiting check (max 20 follows per hour)
      const followsInLastHour = localStorage.getItem('follows_last_hour');
      const now = Date.now();
      const oneHour = 60 * 60 * 1000;
      
      if (followsInLastHour) {
        const follows = JSON.parse(followsInLastHour).filter((time: number) => now - time < oneHour);
        if (follows.length >= 20 && action === 'follow') {
          throw new Error('Rate limit exceeded. Please wait before following more users.');
        }
      }
      
      if (action === 'follow') {
        return await apiRequest("POST", `/api/users/${userId}/follow`, {});
      } else {
        return await apiRequest("DELETE", `/api/users/${userId}/follow`, {});
      }
    },
    onMutate: async ({ userId, action }) => {
      // Optimistic update - immediately show the change
      if (action === 'follow') {
        setFollowingUsers(prev => new Set([...prev, userId]));
        
        // Track follow for rate limiting
        const followsInLastHour = localStorage.getItem('follows_last_hour');
        const follows = followsInLastHour ? JSON.parse(followsInLastHour) : [];
        follows.push(Date.now());
        localStorage.setItem('follows_last_hour', JSON.stringify(follows));
      } else {
        setFollowingUsers(prev => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      }
      
      return { userId, action };
    },
    onSuccess: (_, variables) => {
      toast({
        title: variables.action === 'follow' ? "Following!" : "Unfollowed",
        description: variables.action === 'follow' ? "You are now following this user." : "You unfollowed this user.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users/discover'] });
      queryClient.invalidateQueries({ queryKey: ['/api/users/recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['/api/connections'] });
    },
    onError: (error: any, variables, context) => {
      // Revert optimistic update on error
      if (context) {
        if (context.action === 'follow') {
          setFollowingUsers(prev => {
            const newSet = new Set(prev);
            newSet.delete(context.userId);
            return newSet;
          });
        } else {
          setFollowingUsers(prev => new Set([...prev, context.userId]));
        }
      }
      
      toast({
        title: "Error",
        description: error.message || "Failed to update follow status.",
        variant: "destructive",
      });
    },
  });

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.state) {
      toast({
        title: "Validation Error",
        description: "Please fill in required fields.",
        variant: "destructive",
      });
      return;
    }
    createGroupMutation.mutate(newGroup);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation provided by App.tsx - removed duplicate header */}

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <NetworkIcon className="w-8 h-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-900">Leader Network</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with credible Nigerian leaders, join regional groups, and build the movement for good governance.
          </p>
        </div>

        <Tabs defaultValue="discover" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="discover">
              Discover
            </TabsTrigger>
            <TabsTrigger value="activity">
              Activity
            </TabsTrigger>
            <TabsTrigger value="following">Following ({connections.length})</TabsTrigger>
            <TabsTrigger value="requests">
              Requests
              {connectionRequests.length > 0 && (
                <Badge className="ml-2 bg-red-500">{connectionRequests.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
          </TabsList>

          {/* Discover Users Tab */}
          <TabsContent value="discover">
            <div className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Discover Nigerian Leaders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <Input
                        placeholder="Search by name, location, or interests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                        data-testid="input-user-search"
                      />
                    </div>
                    <div className="w-full sm:w-48">
                      <Select value={selectedState} onValueChange={setSelectedState}>
                        <SelectTrigger data-testid="select-discover-state">
                          <SelectValue placeholder="Filter by state" />
                        </SelectTrigger>
                        <SelectContent>
                          {nigerianStates.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Users Section */}
              {recommendedUsers.length > 0 && !debouncedSearch && (
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      People You May Know
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4 overflow-x-auto pb-4">
                      {recommendedUsers.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex-shrink-0 w-64 border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="bg-green-100 text-green-700">
                                {(user.firstName?.charAt(0) || '') + (user.lastName?.charAt(0) || '')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {user.firstName} {user.lastName}
                              </h4>
                              <p className="text-xs text-gray-500 truncate">
                                {user.state}
                              </p>
                              {/* Volunteer Badge */}
                              {(user.userType === 'VOLUNTEER' || user.volunteerStatus === 'ACTIVE') && (
                                <Badge className="bg-green-100 text-green-700 text-xs flex items-center mt-1">
                                  <Heart className="w-3 h-3 mr-1" />
                                  Volunteer
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => followMutation.mutate({ userId: user.id, action: 'follow' })}
                            disabled={followMutation.isPending}
                            data-testid={`button-follow-${user.id}`}
                          >
                            Follow
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* User Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Loading Skeletons */}
                {isLoadingUsers && (
                  <>
                    {[...Array(6)].map((_, i) => (
                      <Card key={`skeleton-${i}`} className="border animate-pulse">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                              <div>
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-16"></div>
                              </div>
                            </div>
                            <div className="h-5 bg-gray-200 rounded w-12"></div>
                          </div>
                          <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                          <div className="flex justify-between mb-4">
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                            <div className="h-3 bg-gray-200 rounded w-16"></div>
                          </div>
                          <div className="h-9 bg-gray-200 rounded w-full"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                )}
                
                {/* Actual Users */}
                {!isLoadingUsers && discoverableUsers.map((discoveredUser) => (
                  <Card key={discoveredUser.id} className="border hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-semibold">
                              {(discoveredUser.firstName?.charAt(0) || '') + (discoveredUser.lastName?.charAt(0) || '')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-lg">
                              {discoveredUser.firstName} {discoveredUser.lastName}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {discoveredUser.state}{discoveredUser.lga && `, ${discoveredUser.lga}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {discoveredUser.kycStatus === 'APPROVED' && (
                            <Badge className="bg-green-100 text-green-700">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {/* Volunteer Badge */}
                          {(discoveredUser.userType === 'VOLUNTEER' || discoveredUser.volunteerStatus === 'ACTIVE') && (
                            <Badge className="bg-blue-100 text-blue-700">
                              <Heart className="w-3 h-3 mr-1" />
                              Active Volunteer
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {discoveredUser.profileBio && (
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {discoveredUser.profileBio}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{discoveredUser.followersCount || 0} followers</span>
                        <span>{discoveredUser.followingCount || 0} following</span>
                      </div>
                      
                      <Button
                        className={`w-full ${
                          (discoveredUser.isFollowing || followingUsers.has(discoveredUser.id))
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        onClick={() => followMutation.mutate({ 
                          userId: discoveredUser.id, 
                          action: (discoveredUser.isFollowing || followingUsers.has(discoveredUser.id)) ? 'unfollow' : 'follow' 
                        })}
                        disabled={followMutation.isPending}
                        data-testid={`button-${(discoveredUser.isFollowing || followingUsers.has(discoveredUser.id)) ? 'unfollow' : 'follow'}-${discoveredUser.id}`}
                      >
                        {followMutation.isPending && followMutation.variables?.userId === discoveredUser.id 
                          ? '...' 
                          : (discoveredUser.isFollowing || followingUsers.has(discoveredUser.id)) ? 'Following' : 'Follow'
                        }
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {!isLoadingUsers && discoverableUsers.length === 0 && (
                <div className="text-center py-12 col-span-full">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">Try adjusting your search or location filters.</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Activity Feed Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <NetworkIcon className="w-5 h-5" />
                  Network Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <NetworkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
                    <p className="text-gray-600">Activity from your network will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-700 text-sm">
                            {activity.follower.firstName?.charAt(0)}{activity.follower.lastName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">{activity.follower.firstName} {activity.follower.lastName}</span>
                            {' followed '}
                            <span className="font-medium">{activity.followed.firstName} {activity.followed.lastName}</span>
                            {activity.followed.state && (
                              <span className="text-gray-500"> from {activity.followed.state}</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.activityTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => followMutation.mutate({ userId: activity.followed.id, action: 'follow' })}
                          disabled={followMutation.isPending}
                          data-testid={`button-follow-${activity.followed.id}`}
                        >
                          Follow
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connection Requests Tab */}
          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Pending Connection Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {connectionRequests.length === 0 ? (
                  <div className="text-center py-8">
                    <UserPlus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
                    <p className="text-gray-600">New connection requests will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {connectionRequests.map((request) => (
                      <div key={request.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback className="bg-green-100 text-green-700">
                                {request.requesterUserId.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold">Connection Request</h4>
                              <p className="text-sm text-gray-600">
                                Type: <Badge variant="outline">{request.connectionType}</Badge>
                              </p>
                              {request.message && (
                                <p className="text-sm text-gray-700 mt-1">"{request.message}"</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => respondMutation.mutate({ connectionId: request.id, status: "ACCEPTED" })}
                              disabled={respondMutation.isPending}
                              data-testid={`button-accept-${request.id}`}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => respondMutation.mutate({ connectionId: request.id, status: "DECLINED" })}
                              disabled={respondMutation.isPending}
                              data-testid={`button-decline-${request.id}`}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  People You Follow
                </CardTitle>
              </CardHeader>
              <CardContent>
                {connections.length === 0 ? (
                  <div className="text-center py-8">
                    <NetworkIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No connections yet</h3>
                    <p className="text-gray-600">Start connecting with other credible leaders.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {connections.map((connection) => {
                      const isRequester = connection.requesterUserId === (user as any)?.id;
                      const otherUserId = isRequester ? connection.recipientUserId : connection.requesterUserId;
                      
                      return (
                        <Card key={connection.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <Avatar>
                                <AvatarFallback className="bg-blue-100 text-blue-700">
                                  {otherUserId.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">Connected Leader</h4>
                                <Badge variant="outline" className="text-xs">
                                  {connection.connectionType}
                                </Badge>
                              </div>
                            </div>
                            <Button size="sm" className="w-full" variant="outline">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              Message
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Regional Groups Tab */}
          <TabsContent value="groups">
            <div className="space-y-6">
              {/* Filter and Create */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Regional Groups
                    </span>
                    <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
                      <DialogTrigger asChild>
                        <Button data-testid="button-create-group">
                          <Plus className="w-4 h-4 mr-1" />
                          Create Group
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Regional Group</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium">Group Name</label>
                            <Input
                              value={newGroup.name}
                              onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                              placeholder="e.g., Lagos State Chapter"
                              data-testid="input-group-name"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                              value={newGroup.description}
                              onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                              placeholder="Describe the group's purpose and activities"
                              data-testid="input-group-description"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">State</label>
                            <Select value={newGroup.state} onValueChange={(value) => setNewGroup({ ...newGroup, state: value })}>
                              <SelectTrigger data-testid="select-group-state">
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {nigerianStates.filter(s => s !== "All States").map((state) => (
                                  <SelectItem key={state} value={state}>{state}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <label className="text-sm font-medium">LGA (Optional)</label>
                            <Input
                              value={newGroup.lga}
                              onChange={(e) => setNewGroup({ ...newGroup, lga: e.target.value })}
                              placeholder="Local Government Area"
                              data-testid="input-group-lga"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleCreateGroup}
                              disabled={createGroupMutation.isPending}
                              data-testid="button-submit-group"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Create Group
                            </Button>
                            <Button variant="outline" onClick={() => setShowCreateGroup(false)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="text-sm font-medium">Filter by State</label>
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
                  </div>
                </CardContent>
              </Card>

              {/* Groups List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regionalGroups.map((group) => (
                  <Card key={group.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {group.lga ? `${group.lga}, ` : ""}{group.state}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4 text-sm">
                        {group.description || "Building credible leadership in this region."}
                      </p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{group.memberCount} members</span>
                        </div>
                        <Badge variant="outline">{group.type.replace('_', ' ')}</Badge>
                      </div>
                      <Button
                        className="w-full"
                        onClick={() => joinGroupMutation.mutate(group.id)}
                        disabled={joinGroupMutation.isPending}
                        data-testid={`button-join-${group.id}`}
                      >
                        Join Group
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {regionalGroups.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No regional groups found</h3>
                    <p className="text-gray-600 mb-6">
                      {selectedState === "All States" 
                        ? "Be the first to create a regional group for credible leaders."
                        : `No groups found in ${selectedState}. Create the first one!`}
                    </p>
                    <Button onClick={() => setShowCreateGroup(true)} data-testid="button-create-first-group">
                      <Plus className="w-4 h-4 mr-1" />
                      Create First Group
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}