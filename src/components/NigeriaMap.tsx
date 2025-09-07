import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Target, TrendingUp } from "lucide-react";

interface MapData {
  totalCandidates: number;
  lgasCovered: number;
  statesCovered: number;
  stateBreakdown: { [state: string]: number };
  progressToGoal: number;
}

interface NigeriaMapProps {
  className?: string;
}

export function NigeriaMap({ className = "" }: NigeriaMapProps) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const { data: mapData } = useQuery<MapData>({
    queryKey: ['/api/challenge/stats'],
    staleTime: 5 * 60 * 1000, // 5 minutes - map data changes slowly
    refetchInterval: false, // Don't auto-refresh, let staleTime handle it
  });

  // Mock Nigeria states with approximate SVG coordinates - simplified representation
  const nigerianStates = [
    { name: "Lagos", x: 60, y: 280, population: "24M", candidates: mapData?.stateBreakdown?.["Lagos"] || 0 },
    { name: "Kano", x: 190, y: 120, population: "15M", candidates: mapData?.stateBreakdown?.["Kano"] || 0 },
    { name: "Rivers", x: 110, y: 250, population: "7M", candidates: mapData?.stateBreakdown?.["Rivers"] || 0 },
    { name: "FCT", x: 150, y: 200, population: "3M", candidates: mapData?.stateBreakdown?.["FCT"] || 0 },
    { name: "Kaduna", x: 170, y: 150, population: "8M", candidates: mapData?.stateBreakdown?.["Kaduna"] || 0 },
    { name: "Oyo", x: 70, y: 240, population: "7M", candidates: mapData?.stateBreakdown?.["Oyo"] || 0 },
    { name: "Plateau", x: 180, y: 170, population: "4M", candidates: mapData?.stateBreakdown?.["Plateau"] || 0 },
    { name: "Borno", x: 250, y: 80, population: "5M", candidates: mapData?.stateBreakdown?.["Borno"] || 0 },
    { name: "Akwa Ibom", x: 130, y: 270, population: "5M", candidates: mapData?.stateBreakdown?.["Akwa Ibom"] || 0 },
    { name: "Anambra", x: 110, y: 220, population: "5M", candidates: mapData?.stateBreakdown?.["Anambra"] || 0 },
    { name: "Delta", x: 90, y: 250, population: "5M", candidates: mapData?.stateBreakdown?.["Delta"] || 0 },
    { name: "Imo", x: 110, y: 230, population: "5M", candidates: mapData?.stateBreakdown?.["Imo"] || 0 },
    { name: "Edo", x: 90, y: 230, population: "4M", candidates: mapData?.stateBreakdown?.["Edo"] || 0 },
    { name: "Enugu", x: 120, y: 210, population: "4M", candidates: mapData?.stateBreakdown?.["Enugu"] || 0 },
    { name: "Cross River", x: 140, y: 270, population: "3M", candidates: mapData?.stateBreakdown?.["Cross River"] || 0 },
    { name: "Bauchi", x: 200, y: 130, population: "6M", candidates: mapData?.stateBreakdown?.["Bauchi"] || 0 },
    { name: "Sokoto", x: 120, y: 80, population: "5M", candidates: mapData?.stateBreakdown?.["Sokoto"] || 0 },
    { name: "Adamawa", x: 230, y: 170, population: "4M", candidates: mapData?.stateBreakdown?.["Adamawa"] || 0 },
    { name: "Ogun", x: 70, y: 260, population: "5M", candidates: mapData?.stateBreakdown?.["Ogun"] || 0 },
    { name: "Ondo", x: 80, y: 250, population: "4M", candidates: mapData?.stateBreakdown?.["Ondo"] || 0 },
  ];

  const getStateColor = (candidates: number) => {
    if (candidates === 0) return "#e5e7eb"; // Gray for no candidates
    if (candidates < 5) return "#fef3c7"; // Light yellow for few candidates
    if (candidates < 15) return "#fde68a"; // Medium yellow
    if (candidates < 30) return "#f59e0b"; // Orange
    return "#059669"; // Green for many candidates
  };

  const getStateSize = (candidates: number) => {
    const baseSize = 8;
    const sizeMultiplier = Math.min(candidates * 0.5, 15);
    return baseSize + sizeMultiplier;
  };

  return (
    <div className={`${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-green-600" />
            Nigeria Challenge Coverage Map
          </CardTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {mapData?.totalCandidates || 0}
              </div>
              <div className="text-sm text-gray-600">Total Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mapData?.statesCovered || 0}/37
              </div>
              <div className="text-sm text-gray-600">States Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {mapData?.lgasCovered || 0}/774
              </div>
              <div className="text-sm text-gray-600">LGAs Covered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {mapData?.progressToGoal || 0}%
              </div>
              <div className="text-sm text-gray-600">To 13k Goal</div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="relative">
            {/* Simple Nigeria Map Representation */}
            <svg 
              viewBox="0 0 350 350" 
              className="w-full h-96 border rounded-lg bg-blue-50"
              style={{ maxHeight: '400px' }}
            >
              {/* Nigeria Outline (Simplified) */}
              <path
                d="M30 80 Q50 60 80 70 Q120 65 160 75 Q200 70 250 85 Q280 100 290 130 Q295 160 280 190 Q270 220 250 240 Q220 260 180 270 Q140 280 100 275 Q70 270 50 250 Q35 220 30 190 Q25 150 30 120 Q28 100 30 80 Z"
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                className="opacity-30"
              />

              {/* State Points */}
              {nigerianStates.map((state) => (
                <g key={state.name}>
                  <circle
                    cx={state.x}
                    cy={state.y}
                    r={getStateSize(state.candidates)}
                    fill={getStateColor(state.candidates)}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200 hover:stroke-green-600 hover:stroke-4"
                    onMouseEnter={() => setHoveredState(state.name)}
                    onMouseLeave={() => setHoveredState(null)}
                  />
                  <text
                    x={state.x}
                    y={state.y + getStateSize(state.candidates) + 12}
                    textAnchor="middle"
                    className="text-xs font-medium fill-gray-700"
                    style={{ fontSize: '10px' }}
                  >
                    {state.name}
                  </text>
                  {state.candidates > 0 && (
                    <text
                      x={state.x}
                      y={state.y + 3}
                      textAnchor="middle"
                      className="text-xs font-bold fill-white"
                      style={{ fontSize: '10px' }}
                    >
                      {state.candidates}
                    </text>
                  )}
                </g>
              ))}

              {/* Hover Tooltip */}
              {hoveredState && (
                <g>
                  <rect
                    x="10"
                    y="10"
                    width="160"
                    height="80"
                    fill="white"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                    rx="4"
                    className="drop-shadow-lg"
                  />
                  <text x="20" y="30" className="text-sm font-semibold fill-gray-900">
                    {hoveredState}
                  </text>
                  <text x="20" y="50" className="text-xs fill-gray-600">
                    Candidates: {nigerianStates.find(s => s.name === hoveredState)?.candidates || 0}
                  </text>
                  <text x="20" y="65" className="text-xs fill-gray-600">
                    Population: {nigerianStates.find(s => s.name === hoveredState)?.population || "N/A"}
                  </text>
                </g>
              )}
            </svg>

            {/* Legend */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Legend</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#e5e7eb" }}></div>
                  <span>No candidates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#fef3c7" }}></div>
                  <span>1-4 candidates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#fde68a" }}></div>
                  <span>5-14 candidates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#f59e0b" }}></div>
                  <span>15-29 candidates</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "#059669" }}></div>
                  <span>30+ candidates</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}