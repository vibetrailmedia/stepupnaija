import { RealtimeChat } from '@/components/RealtimeChat';
import { RealtimeNotifications } from '@/components/RealtimeNotifications';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Users, Globe, Shield } from 'lucide-react';

export default function CommunityChat() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="page-title">
            Community Chat
          </h1>
          <p className="text-muted-foreground">
            Connect with fellow citizens in real-time and stay updated on civic activities
          </p>
        </div>
        <RealtimeNotifications />
      </div>

      {/* Chat Guidelines */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            Community Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-2">
              <MessageCircle className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium">Respectful Communication</p>
                <p className="text-muted-foreground">Keep discussions civil and constructive</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium">Civic Focus</p>
                <p className="text-muted-foreground">Discuss Nigerian civic and community issues</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Build Nigeria Together</p>
                <p className="text-muted-foreground">Share ideas for positive change</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Interface */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Chat Section */}
        <div className="lg:col-span-2">
          <RealtimeChat />
        </div>

        {/* Sidebar with Quick Actions */}
        <div className="space-y-4">
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Citizens</span>
                <Badge variant="secondary" data-testid="active-citizens-count">Live</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Today's Tasks</span>
                <Badge variant="outline">Available</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current Round</span>
                <Badge variant="default">Active</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <a 
                href="/engage" 
                className="block w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                data-testid="link-engage"
              >
                <div className="font-medium text-sm">Complete Tasks</div>
                <div className="text-xs text-muted-foreground">Earn SUP tokens</div>
              </a>
              <a 
                href="/projects" 
                className="block w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                data-testid="link-projects"
              >
                <div className="font-medium text-sm">View Projects</div>
                <div className="text-xs text-muted-foreground">Vote and fund initiatives</div>
              </a>
              <a 
                href="/verification" 
                className="block w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                data-testid="link-verification"
              >
                <div className="font-medium text-sm">Credible Badge</div>
                <div className="text-xs text-muted-foreground">Verify your identity</div>
              </a>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Community Highlights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-2 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <p className="font-medium text-green-700 dark:text-green-300">🏆 New Milestone</p>
                <p className="text-green-600 dark:text-green-400">10,000+ registered citizens!</p>
              </div>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <p className="font-medium text-blue-700 dark:text-blue-300">🎯 Weekly Goal</p>
                <p className="text-blue-600 dark:text-blue-400">1,500 tasks completed this week</p>
              </div>
              <div className="p-2 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <p className="font-medium text-purple-700 dark:text-purple-300">🗳️ Active Voting</p>
                <p className="text-purple-600 dark:text-purple-400">12 projects seeking votes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>
          🇳🇬 Building Nigeria together through civic engagement and community collaboration
        </p>
      </div>
    </div>
  );
}