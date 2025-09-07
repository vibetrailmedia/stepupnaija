import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { MessageSquare, Users, Clock, Plus, Eye, MessageCircle, Pin, ArrowLeft } from "lucide-react";
import { ForumCategory, ForumThread } from "@shared/schema";

// Nigerian states for category creation
const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", 
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", 
  "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", 
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", 
  "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"
];

function CreateCategoryDialog() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    state: "",
    lga: ""
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/forum/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/categories'] });
      toast({
        title: "Success",
        description: "Forum category created successfully"
      });
      setOpen(false);
      setFormData({ name: "", description: "", state: "", lga: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create category",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive"
      });
      return;
    }
    createCategoryMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="create-category-button">
          <Plus className="w-4 h-4 mr-2" />
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Forum Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="text-sm font-medium">
              Category Name *
            </label>
            <Input
              id="name"
              data-testid="input-category-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Lagos State Discussions"
              required
            />
          </div>
          
          <div>
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              data-testid="input-category-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what this category is for..."
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="state" className="text-sm font-medium">
              State (Optional)
            </label>
            <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
              <SelectTrigger data-testid="select-category-state">
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {NIGERIAN_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="lga" className="text-sm font-medium">
              LGA (Optional)
            </label>
            <Input
              id="lga"
              data-testid="input-category-lga"
              value={formData.lga}
              onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
              placeholder="Local Government Area"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              data-testid="button-submit-category"
              disabled={createCategoryMutation.isPending}
            >
              {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CreateThreadDialog({ categories }: { categories: ForumCategory[] }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    categoryId: "",
    tags: ""
  });

  const createThreadMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/forum/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          tags: data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean)
        })
      });
      if (!response.ok) throw new Error('Failed to create thread');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/threads'] });
      toast({
        title: "Success",
        description: "Discussion thread created successfully"
      });
      setOpen(false);
      setFormData({ title: "", content: "", categoryId: "", tags: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create thread",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || !formData.categoryId) {
      toast({
        title: "Error",
        description: "Title, content, and category are required",
        variant: "destructive"
      });
      return;
    }
    createThreadMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="create-thread-button">
          <MessageSquare className="w-4 h-4 mr-2" />
          Start Discussion
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Start New Discussion Thread</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryId" className="text-sm font-medium">
              Category *
            </label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
              <SelectTrigger data-testid="select-thread-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                    {category.state && ` (${category.state})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Thread Title *
            </label>
            <Input
              id="title"
              data-testid="input-thread-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What would you like to discuss?"
              required
            />
          </div>
          
          <div>
            <label htmlFor="content" className="text-sm font-medium">
              Content *
            </label>
            <Textarea
              id="content"
              data-testid="input-thread-content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your thoughts, ask questions, or start a meaningful discussion..."
              rows={6}
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="text-sm font-medium">
              Tags (Optional)
            </label>
            <Input
              id="tags"
              data-testid="input-thread-tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., governance, youth, development (comma-separated)"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              data-testid="button-submit-thread"
              disabled={createThreadMutation.isPending}
            >
              {createThreadMutation.isPending ? "Creating..." : "Create Thread"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ForumStats() {
  const { data: categories = [] } = useQuery<ForumCategory[]>({
    queryKey: ['/api/forum/categories'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: threads = [] } = useQuery<ForumThread[]>({
    queryKey: ['/api/forum/threads'],
    queryFn: async () => {
      const response = await fetch('/api/forum/threads?limit=100');
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Ensure we always have arrays
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeThreads = Array.isArray(threads) ? threads : [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-primary-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Categories</p>
              <p className="text-2xl font-bold" data-testid="stat-categories">{safeCategories.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Discussion Threads</p>
              <p className="text-2xl font-bold" data-testid="stat-threads">{safeThreads.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Replies</p>
              <p className="text-2xl font-bold" data-testid="stat-replies">
                {safeThreads.reduce((sum, thread) => sum + (thread?.replyCount || 0), 0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ForumPage() {
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery<ForumCategory[]>({
    queryKey: ['/api/forum/categories'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: threads = [], isLoading: threadsLoading, error: threadsError } = useQuery<ForumThread[]>({
    queryKey: ['/api/forum/threads', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/forum/threads?categoryId=${selectedCategory}&limit=50`
        : '/api/forum/threads?limit=50';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch threads');
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Ensure we always have arrays
  const safeThreads = Array.isArray(threads) ? threads : [];
  const safeCategories = Array.isArray(categories) ? categories : [];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeAgo = (dateString: string | null) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Navigation */}
      <div className="mb-6">
        <Button 
          variant="ghost" 
          asChild 
          className="text-gray-600 hover:text-primary-600 p-2"
          data-testid="button-back-dashboard"
        >
          <Link href="/" className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2" data-testid="forum-title">
            Community Forum
          </h1>
          <p className="text-muted-foreground">
            Connect, discuss, and engage with fellow Step Up Naija participants across all states
          </p>
        </div>
        
        {isAuthenticated && (
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <CreateCategoryDialog />
            {categories.length > 0 && <CreateThreadDialog categories={categories} />}
          </div>
        )}
      </div>

      <ForumStats />

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium">Filter by category:</span>
          <Button
            variant={selectedCategory === "" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("")}
            data-testid="filter-all-categories"
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              data-testid={`filter-category-${category.id}`}
            >
              {category.name}
              {category.state && ` (${category.state})`}
            </Button>
          ))}
        </div>
      </div>

      {/* Categories and Threads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No categories yet</p>
                  {isAuthenticated && <CreateCategoryDialog />}
                </div>
              ) : (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      data-testid={`category-${category.id}`}
                      className={`w-full text-left p-3 rounded border transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="font-medium">{category.name}</div>
                      {category.state && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {category.state}
                        </Badge>
                      )}
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Threads */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Discussion Threads
                </span>
                {selectedCategory && (
                  <Badge variant="outline">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {threadsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-muted rounded animate-pulse" />
                  ))}
                </div>
              ) : threadsError ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto text-red-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Unable to load discussions</h3>
                  <p className="text-muted-foreground mb-4">
                    Forum database not set up yet. Please check back later.
                  </p>
                </div>
              ) : safeThreads.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No discussions yet</h3>
                  <p className="text-muted-foreground mb-4">
                    {selectedCategory 
                      ? "No threads in this category yet"
                      : "Be the first to start a meaningful discussion"
                    }
                  </p>
                  {isAuthenticated && safeCategories.length > 0 && (
                    <CreateThreadDialog categories={safeCategories} />
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {safeThreads.map((thread) => (
                    <Link
                      key={thread.id}
                      href={`/forum/thread/${thread.id}`}
                      data-testid={`thread-${thread.id}`}
                    >
                      <div className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              {thread.isPinned && (
                                <Pin className="w-4 h-4 text-orange-500" />
                              )}
                              <h3 className="font-semibold hover:text-primary transition-colors">
                                {thread.title}
                              </h3>
                            </div>
                            
                            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
                              {thread.content}
                            </p>
                            
                            {thread.tags && thread.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {thread.tags.slice(0, 3).map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                                {thread.tags.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{thread.tags.length - 3} more
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            <div className="flex items-center text-xs text-muted-foreground space-x-4">
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{thread.viewCount || 0} views</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <MessageCircle className="w-3 h-3" />
                                <span>{thread.replyCount || 0} replies</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>
                                  {thread.lastReplyAt 
                                    ? `Last reply ${getTimeAgo(typeof thread.lastReplyAt === 'string' ? thread.lastReplyAt : thread.lastReplyAt.toISOString())}`
                                    : `Created ${getTimeAgo(typeof thread.createdAt === 'string' ? thread.createdAt : thread.createdAt?.toISOString() || '')}`
                                  }
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {!isAuthenticated && (
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Join the Discussion</h3>
            <p className="text-muted-foreground mb-4">
              Log in to create threads, reply to discussions, and connect with other community members
            </p>
            <Button asChild>
              <Link href="/api/login">Log In to Participate</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}