import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
// Navigation provided by App.tsx - removed duplicate import
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Users, 
  Clock, 
  Plus, 
  Video,
  Award,
  Star,
  MessageSquare,
  Filter,
  Search,
  Eye,
  UserCheck
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface NetworkingEvent {
  id: string;
  organizerUserId: string;
  title: string;
  description: string;
  eventType: 'NETWORKING' | 'TRAINING' | 'TOWNHALL' | 'WORKSHOP' | 'CLEANUP';
  venue?: string;
  state: string;
  lga?: string;
  isVirtual: boolean;
  virtualLink?: string;
  startTime: string;
  endTime: string;
  maxAttendees?: number;
  attendeeCount: number;
  registrationDeadline?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  tags: string[];
  supReward: string;
  createdAt: string;
  organizer?: {
    firstName: string;
    lastName: string;
  };
  userRegistration?: {
    status: 'REGISTERED' | 'ATTENDED' | 'NO_SHOW';
    rating?: number;
  };
}

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", 
  "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
];

const EVENT_TYPES = [
  { value: "TOWNHALL", label: "Town Hall", color: "bg-primary-100 text-primary-800" },
  { value: "WORKSHOP", label: "Workshop", color: "bg-green-100 text-green-800" },
  { value: "TRAINING", label: "Training", color: "bg-purple-100 text-purple-800" },
  { value: "NETWORKING", label: "Networking", color: "bg-orange-100 text-orange-800" },
  { value: "CLEANUP", label: "Community Cleanup", color: "bg-teal-100 text-teal-800" }
];

function CreateEventDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    eventType: "TOWNHALL",
    venue: "",
    state: "",
    lga: "",
    isVirtual: false,
    virtualLink: "",
    startTime: "",
    endTime: "",
    maxAttendees: "",
    registrationDeadline: "",
    tags: "",
    supReward: "5"
  });

  const createEventMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/events", {
        ...data,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : null,
        supReward: parseFloat(data.supReward),
        tags: data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
        startTime: new Date(data.startTime).toISOString(),
        endTime: new Date(data.endTime).toISOString(),
        registrationDeadline: data.registrationDeadline ? new Date(data.registrationDeadline).toISOString() : null
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "Success",
        description: "Event created successfully"
      });
      setOpen(false);
      setFormData({
        title: "", description: "", eventType: "TOWNHALL", venue: "", state: "", lga: "",
        isVirtual: false, virtualLink: "", startTime: "", endTime: "", maxAttendees: "",
        registrationDeadline: "", tags: "", supReward: "5"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create event",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.state || !formData.startTime || !formData.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    createEventMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="create-event-button">
          <Plus className="w-4 h-4 mr-2" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Event Title *</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Lagos State Town Hall on Healthcare"
                required
                data-testid="input-event-title"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Description *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the event purpose and agenda..."
                rows={3}
                required
                data-testid="input-event-description"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Event Type *</label>
              <Select value={formData.eventType} onValueChange={(value) => setFormData({ ...formData, eventType: value })}>
                <SelectTrigger data-testid="select-event-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">State *</label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger data-testid="select-event-state">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">LGA (Optional)</label>
              <Input
                value={formData.lga}
                onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                placeholder="Local Government Area"
                data-testid="input-event-lga"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Max Attendees</label>
              <Input
                type="number"
                value={formData.maxAttendees}
                onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                placeholder="e.g., 100"
                data-testid="input-max-attendees"
              />
            </div>

            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="checkbox"
                  id="isVirtual"
                  checked={formData.isVirtual}
                  onChange={(e) => setFormData({ ...formData, isVirtual: e.target.checked })}
                  data-testid="checkbox-is-virtual"
                />
                <label htmlFor="isVirtual" className="text-sm font-medium">Virtual Event</label>
              </div>
              {formData.isVirtual ? (
                <Input
                  value={formData.virtualLink}
                  onChange={(e) => setFormData({ ...formData, virtualLink: e.target.value })}
                  placeholder="Meeting link (Zoom, Teams, etc.)"
                  data-testid="input-virtual-link"
                />
              ) : (
                <Input
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  placeholder="Event venue address"
                  data-testid="input-venue"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Start Time *</label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
                data-testid="input-start-time"
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Time *</label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
                data-testid="input-end-time"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Registration Deadline</label>
              <Input
                type="datetime-local"
                value={formData.registrationDeadline}
                onChange={(e) => setFormData({ ...formData, registrationDeadline: e.target.value })}
                data-testid="input-registration-deadline"
              />
            </div>

            <div>
              <label className="text-sm font-medium">SUP Reward</label>
              <Input
                type="number"
                step="0.1"
                value={formData.supReward}
                onChange={(e) => setFormData({ ...formData, supReward: e.target.value })}
                placeholder="5"
                data-testid="input-sup-reward"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="e.g., healthcare, policy, community"
                data-testid="input-event-tags"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createEventMutation.isPending} data-testid="button-submit-event">
              {createEventMutation.isPending ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function Events() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedState, setSelectedState] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("UPCOMING");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wallet } = useQuery({
    queryKey: ["/api/wallet"],
    enabled: isAuthenticated,
    retry: false,
  });

  const { data: events = [], isLoading: eventsLoading } = useQuery<NetworkingEvent[]>({
    queryKey: ["/api/events", selectedType, selectedState, selectedStatus],
    enabled: isAuthenticated,
    retry: false,
  });

  const registerForEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      return await apiRequest("POST", `/api/events/${eventId}/register`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: "Success",
        description: "Successfully registered for event"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to register for event",
        variant: "destructive"
      });
    }
  });

  const getEventTypeInfo = (type: string) => {
    const typeInfo = EVENT_TYPES.find(t => t.value === type);
    return typeInfo || { label: type, color: "bg-gray-100 text-gray-800" };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING": return "bg-primary-100 text-primary-800";
      case "ONGOING": return "bg-green-100 text-green-800";
      case "COMPLETED": return "bg-gray-100 text-gray-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredEvents = events.filter((event: NetworkingEvent) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "ALL" || event.eventType === selectedType;
    const matchesState = selectedState === "ALL" || event.state === selectedState;
    const matchesStatus = selectedStatus === "ALL" || event.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesState && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="w-8 h-8 text-primary-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <CalendarIcon className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Events & Meetings</h1>
          <p className="text-gray-600 mb-6">
            Join town halls, workshops, and networking events in your community.
          </p>
          <Button onClick={() => window.location.href = '/api/login'} className="w-full">
            Log In to View Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-blue-50/30 page-transition">
      {/* Navigation provided by App.tsx - removed duplicate Navigation component */}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Hero Style */}
        <div className="text-center space-y-6 py-8 lg:py-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            📅 Community <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Events</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-8">
            Join town halls, workshops, and networking events that strengthen Nigerian communities across all 774 LGAs
          </p>
          <div className="flex justify-center">
            <CreateEventDialog />
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-events"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger data-testid="select-event-type-filter">
                  <SelectValue placeholder="Event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Types</SelectItem>
                  {EVENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger data-testid="select-state-filter">
                  <SelectValue placeholder="State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All States</SelectItem>
                  {NIGERIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UPCOMING">Upcoming</SelectItem>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="ALL">All Status</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  className="flex-1"
                  data-testid="button-list-view"
                >
                  List
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'outline'}
                  onClick={() => setViewMode('calendar')}
                  className="flex-1"
                  data-testid="button-calendar-view"
                >
                  Calendar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {viewMode === 'calendar' ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Event Calendar
              </h3>
              <p className="text-gray-600 mb-4">
                Interactive calendar with event scheduling and reminders
              </p>
              <Button onClick={() => setViewMode('list')} data-testid="button-switch-to-list">
                View as List
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.map((event: NetworkingEvent) => {
              const typeInfo = getEventTypeInfo(event.eventType);
              const isRegistered = event.userRegistration?.status === 'REGISTERED';
              const hasAttended = event.userRegistration?.status === 'ATTENDED';
              
              return (
                <Card key={event.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={typeInfo.color}>
                            {typeInfo.label}
                          </Badge>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status}
                          </Badge>
                          {event.isVirtual && (
                            <Badge variant="outline">
                              <Video className="w-3 h-3 mr-1" />
                              Virtual
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg">{event.title}</CardTitle>
                      </div>
                      {event.supReward && (
                        <div className="text-right">
                          <div className="flex items-center text-green-600 font-semibold">
                            <Award className="w-4 h-4 mr-1" />
                            {event.supReward} SUP
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {format(new Date(event.startTime), "MMM d, yyyy 'at' h:mm a")}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        {event.isVirtual ? "Virtual Event" : event.venue || `${event.state}${event.lga ? `, ${event.lga}` : ""}`}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendeeCount}{event.maxAttendees ? `/${event.maxAttendees}` : ""} attendees
                      </div>
                      {event.organizer && (
                        <div className="flex items-center text-sm text-gray-500">
                          <UserCheck className="w-4 h-4 mr-2" />
                          {event.organizer.firstName} {event.organizer.lastName}
                        </div>
                      )}
                    </div>

                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {event.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      {event.status === 'UPCOMING' && !isRegistered && !hasAttended && (
                        <Button
                          onClick={() => registerForEventMutation.mutate(event.id)}
                          disabled={registerForEventMutation.isPending}
                          className="flex-1"
                          data-testid={`button-register-${event.id}`}
                        >
                          {registerForEventMutation.isPending ? "Registering..." : "Register"}
                        </Button>
                      )}
                      
                      {isRegistered && (
                        <Button variant="outline" className="flex-1" disabled>
                          <UserCheck className="w-4 h-4 mr-2" />
                          Registered
                        </Button>
                      )}
                      
                      {hasAttended && (
                        <Button variant="outline" className="flex-1" disabled>
                          <Star className="w-4 h-4 mr-2" />
                          Attended
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm" data-testid={`button-view-${event.id}`}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredEvents.length === 0 && !eventsLoading && (
          <Card>
            <CardContent className="p-12 text-center">
              <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Events Found
              </h3>
              <p className="text-gray-600 mb-4">
                No events match your current filters. Try adjusting your search criteria.
              </p>
              <Button 
                onClick={() => {
                  setSelectedType("ALL");
                  setSelectedState("ALL");
                  setSelectedStatus("UPCOMING");
                  setSearchTerm("");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}