import { useState } from "react";
import { Link, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { 
  ArrowLeft, MessageCircle, ThumbsUp, ThumbsDown, Eye, Clock, 
  Pin, Lock, Reply, User, Send
} from "lucide-react";
import { ForumThread, ForumReply } from "@shared/schema";

function ReplyForm({ threadId, parentReplyId, onCancel }: { 
  threadId: string; 
  parentReplyId?: string; 
  onCancel?: () => void; 
}) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");

  const createReplyMutation = useMutation({
    mutationFn: async (data: { content: string; parentReplyId?: string }) => {
      const response = await fetch(`/api/forum/threads/${threadId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to post reply');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/forum/threads', threadId, 'replies'] });
      queryClient.invalidateQueries({ queryKey: ['/api/forum/threads', threadId] });
      toast({
        title: "Success",
        description: "Reply posted successfully"
      });
      setContent("");
      if (onCancel) onCancel();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post reply",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Reply content is required",
        variant: "destructive"
      });
      return;
    }
    createReplyMutation.mutate({ content: content.trim(), parentReplyId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentReplyId ? "Write your reply..." : "Share your thoughts on this discussion..."}
        rows={4}
        data-testid="input-reply-content"
        required
      />
      <div className="flex justify-end space-x-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          data-testid="button-submit-reply"
          disabled={createReplyMutation.isPending || !content.trim()}
        >
          <Send className="w-4 h-4 mr-2" />
          {createReplyMutation.isPending ? "Posting..." : "Post Reply"}
        </Button>
      </div>
    </form>
  );
}

function ReplyItem({ reply, threadId, depth = 0 }: { 
  reply: ForumReply; 
  threadId: string; 
  depth?: number; 
}) {
  const { isAuthenticated } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const { data: childReplies = [] } = useQuery<ForumReply[]>({
    queryKey: ['/api/forum/replies', reply.id, 'children'],
    queryFn: async () => {
      // For now, we'll filter client-side. In a real app, you'd have a separate endpoint
      const response = await fetch(`/api/forum/threads/${threadId}/replies`);
      const allReplies = await response.json();
      return allReplies.filter((r: ForumReply) => r.parentReplyId === reply.id);
    },
    enabled: !!reply.id
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (userId: string) => {
    return userId.slice(-2).toUpperCase();
  };

  const maxDepth = 3; // Maximum nesting level
  const shouldNest = depth < maxDepth;

  return (
    <div className={`${shouldNest ? `ml-${Math.min(depth * 6, 12)}` : ''}`}>
      <div className="border rounded-lg p-4 bg-card">
        {/* Reply Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {getInitials(reply.authorUserId)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">User {getInitials(reply.authorUserId)}</span>
                {reply.isVerified && (
                  <Badge variant="secondary" className="text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center text-xs text-muted-foreground space-x-1">
                <Clock className="w-3 h-3" />
                <span>{formatDate(typeof reply.createdAt === 'string' ? reply.createdAt : reply.createdAt?.toISOString() || null)}</span>
                {reply.updatedAt && reply.updatedAt !== reply.createdAt && (
                  <span>(edited)</span>
                )}
              </div>
            </div>
          </div>

          {/* Reply Actions */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1"
              data-testid={`reply-upvote-${reply.id}`}
            >
              <ThumbsUp className="w-3 h-3 mr-1" />
              {reply.upvotes || 0}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1"
              data-testid={`reply-downvote-${reply.id}`}
            >
              <ThumbsDown className="w-3 h-3 mr-1" />
              {reply.downvotes || 0}
            </Button>
          </div>
        </div>

        {/* Reply Content */}
        <div className="prose prose-sm max-w-none mb-3">
          <p className="whitespace-pre-wrap">{reply.content}</p>
        </div>

        {/* Reply Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {isAuthenticated && shouldNest && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReplyForm(!showReplyForm)}
                data-testid={`button-reply-to-${reply.id}`}
              >
                <Reply className="w-3 h-3 mr-1" />
                Reply
              </Button>
            )}
            
            {childReplies.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                data-testid={`button-toggle-replies-${reply.id}`}
              >
                <MessageCircle className="w-3 h-3 mr-1" />
                {isExpanded ? 'Hide' : 'Show'} {childReplies.length} 
                {childReplies.length === 1 ? ' reply' : ' replies'}
              </Button>
            )}
          </div>
        </div>

        {/* Reply Form */}
        {showReplyForm && isAuthenticated && (
          <div className="mt-4 pt-4 border-t">
            <ReplyForm
              threadId={threadId}
              parentReplyId={reply.id}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>

      {/* Child Replies */}
      {isExpanded && childReplies.length > 0 && (
        <div className={`mt-3 space-y-3 ${shouldNest ? 'border-l-2 border-muted pl-4' : ''}`}>
          {childReplies.map((childReply) => (
            <ReplyItem
              key={childReply.id}
              reply={childReply}
              threadId={threadId}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ForumThreadPage() {
  const { threadId } = useParams();
  const { isAuthenticated } = useAuth();

  const { data: thread, isLoading: threadLoading } = useQuery<ForumThread>({
    queryKey: ['/api/forum/threads', threadId],
    enabled: !!threadId
  });

  const { data: replies = [], isLoading: repliesLoading } = useQuery<ForumReply[]>({
    queryKey: ['/api/forum/threads', threadId, 'replies'],
    enabled: !!threadId
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (userId: string) => {
    return userId.slice(-2).toUpperCase();
  };

  // Filter top-level replies (no parent)
  const topLevelReplies = replies.filter(reply => !reply.parentReplyId);

  if (threadLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-32 bg-muted rounded animate-pulse" />
          <div className="h-20 bg-muted rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="p-12 text-center">
            <h2 className="text-xl font-semibold mb-2">Thread Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The discussion thread you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/forum">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forum
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 mb-6 text-sm text-muted-foreground">
        <Link href="/forum" className="hover:text-foreground">
          Forum
        </Link>
        <span>/</span>
        <span className="text-foreground">Discussion Thread</span>
      </div>

      {/* Back Button */}
      <Button variant="outline" asChild className="mb-6">
        <Link href="/forum">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Forum
        </Link>
      </Button>

      {/* Thread */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {thread.isPinned && (
                  <Pin className="w-5 h-5 text-orange-500" />
                )}
                {thread.isLocked && (
                  <Lock className="w-5 h-5 text-red-500" />
                )}
                <CardTitle className="text-2xl" data-testid="thread-title">
                  {thread.title}
                </CardTitle>
              </div>
              
              {thread.tags && thread.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {thread.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {getInitials(thread.authorUserId)}
                    </AvatarFallback>
                  </Avatar>
                  <span>User {getInitials(thread.authorUserId)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(typeof thread.createdAt === 'string' ? thread.createdAt : thread.createdAt?.toISOString() || null)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{thread.viewCount || 0} views</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageCircle className="w-4 h-4" />
                  <span>{thread.replyCount || 0} replies</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none mb-4">
            <p className="whitespace-pre-wrap" data-testid="thread-content">
              {thread.content}
            </p>
          </div>

          {thread.isLocked && (
            <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-amber-800 dark:text-amber-200">
                <Lock className="w-4 h-4" />
                <span className="font-medium">This thread is locked</span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                No new replies can be added to this discussion.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Reply Form */}
      {isAuthenticated && !thread.isLocked && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Post a Reply
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ReplyForm threadId={thread.id} />
          </CardContent>
        </Card>
      )}

      {/* Replies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Replies ({topLevelReplies.length})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {repliesLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded animate-pulse" />
              ))}
            </div>
          ) : topLevelReplies.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No replies yet</h3>
              <p className="text-muted-foreground mb-4">
                Be the first to share your thoughts on this discussion
              </p>
              {isAuthenticated && !thread.isLocked && (
                <p className="text-sm text-muted-foreground">
                  Use the reply form above to get the conversation started
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {topLevelReplies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  threadId={thread.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {!isAuthenticated && (
        <Card className="mt-6">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Join the Discussion</h3>
            <p className="text-muted-foreground mb-4">
              Log in to reply to this thread and engage with the community
            </p>
            <Button asChild>
              <Link href="/api/login">Log In to Reply</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}