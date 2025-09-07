import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  MapPin, 
  Users, 
  Target, 
  TrendingUp, 
  Search,
  Filter,
  Award,
  CheckCircle,
  Clock,
  Star
} from "lucide-react";

interface LGAData {
  id: string;
  name: string;
  state: string;
  zone: string;
  candidates: number;
  deployed: number;
  population: number;
  coverage: number;
  status: 'COMPLETE' | 'ACTIVE' | 'PENDING' | 'NO_COVERAGE';
  keyMetrics: {
    integrity: number;
    competence: number;
    commitment: number;
  };
}

const nigerianStates = [
  "All States", "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", 
  "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", 
  "Yobe", "Zamfara"
];

const geopoliticalZones = [
  "All Zones", "North Central", "North East", "North West", "South East", "South South", "South West"
];

export default function Geography() {
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedZone, setSelectedZone] = useState("All Zones");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Fetch LGA data
  const { data: lgaData = [], isLoading } = useQuery<LGAData[]>({
    queryKey: ["/api/geography/lgas", selectedState, selectedZone, selectedStatus],
    retry: false,
  });

  // Fetch overall statistics
  const { data: stats = {} } = useQuery({
    queryKey: ["/api/geography/stats"],
    retry: false,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETE": return "bg-green-100 text-green-800";
      case "ACTIVE": return "bg-blue-100 text-blue-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "NO_COVERAGE": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "COMPLETE": return <CheckCircle className="w-3 h-3" />;
      case "ACTIVE": return <TrendingUp className="w-3 h-3" />;
      case "PENDING": return <Clock className="w-3 h-3" />;
      case "NO_COVERAGE": return <Target className="w-3 h-3" />;
      default: return <MapPin className="w-3 h-3" />;
    }
  };

  // Filter LGAs
  const filteredLGAs = lgaData.filter((lga: LGAData) => {
    const matchesSearch = lga.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lga.state.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = selectedState === "All States" || lga.state === selectedState;
    const matchesZone = selectedZone === "All Zones" || lga.zone === selectedZone;
    const matchesStatus = selectedStatus === "All Status" || lga.status === selectedStatus;
    
    return matchesSearch && matchesState && matchesZone && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nigeria Coverage Map
          </h1>
          <p className="text-lg text-gray-600">
            Track #13kCredibleChallenge progress across all 774 Local Government Areas
          </p>
        </div>

        {/* Overall Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="w-8 h-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalLGAs || 774}
                  </div>
                  <div className="text-sm text-gray-600">Total LGAs</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.lgasWithCandidates || 0}
                  </div>
                  <div className="text-sm text-gray-600">LGAs with Candidates</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.lgasWithDeployedLeaders || 0}
                  </div>
                  <div className="text-sm text-gray-600">LGAs with Deployed Leaders</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.overallCoverage || 0}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Coverage</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coverage Progress Bar */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-green-600" />
              Progress to 13,000 Leaders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-medium">
                <span>Current Progress</span>
                <span>{stats.deployedLeaders || 0} / 13,000 Leaders</span>
              </div>
              <Progress 
                value={((stats.deployedLeaders || 0) / 13000) * 100} 
                className="h-3" 
              />
              <div className="flex justify-between text-xs text-gray-600">
                <span>Target: ~17 leaders per LGA</span>
                <span>{((stats.deployedLeaders || 0) / 13000 * 100).toFixed(1)}% Complete</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search LGAs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-lgas"
                />
              </div>
              
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger data-testid="select-state-filter">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {nigerianStates.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedZone} onValueChange={setSelectedZone}>
                <SelectTrigger data-testid="select-zone-filter">
                  <SelectValue placeholder="Select zone" />
                </SelectTrigger>
                <SelectContent>
                  {geopoliticalZones.map((zone) => (
                    <SelectItem key={zone} value={zone}>{zone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="COMPLETE">Complete</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="NO_COVERAGE">No Coverage</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                  className="flex-1"
                  data-testid="button-grid-view"
                >
                  Grid View
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'default' : 'outline'}
                  onClick={() => setViewMode('map')}
                  className="flex-1"
                  data-testid="button-map-view"
                >
                  Map View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredLGAs.length} of {lgaData.length} Local Government Areas
          </p>
        </div>

        {/* LGA Grid/Map View */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLGAs.map((lga: LGAData) => (
              <Card key={lga.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{lga.name}</CardTitle>
                      <p className="text-sm text-gray-600">{lga.state}, {lga.zone}</p>
                    </div>
                    <Badge className={getStatusColor(lga.status)}>
                      {getStatusIcon(lga.status)}
                      <span className="ml-1 text-xs">{lga.status.replace('_', ' ')}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Coverage Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Leader Coverage</span>
                        <span>{lga.coverage}%</span>
                      </div>
                      <Progress value={lga.coverage} className="h-2" />
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{lga.candidates} candidates</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span>{lga.deployed} deployed</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{(lga.population / 1000).toFixed(0)}k pop.</span>
                      </div>
                    </div>

                    {/* Quality Metrics */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-700">Quality Metrics</h4>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="text-center">
                          <div className="font-medium">{lga.keyMetrics.integrity}%</div>
                          <div className="text-gray-500">Integrity</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{lga.keyMetrics.competence}%</div>
                          <div className="text-gray-500">Competence</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{lga.keyMetrics.commitment}%</div>
                          <div className="text-gray-500">Commitment</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Map View Placeholder */
          <Card className="h-96">
            <CardContent className="p-8 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nigeria Coverage Map
                </h3>
                <p className="text-gray-600 mb-4">
                  Geographic visualization of Nigeria's 774 LGAs with real-time coverage data
                </p>
                <Button onClick={() => setViewMode('grid')} data-testid="button-switch-to-grid">
                  View as Grid
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {filteredLGAs.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No LGAs Found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button 
                onClick={() => {
                  setSelectedState("All States");
                  setSelectedZone("All Zones");
                  setSelectedStatus("All Status");
                  setSearchTerm("");
                }}
                data-testid="button-clear-filters"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
    </div>
  );
}