import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Users, Wifi, WifiOff } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ChatMessage {
  type: string;
  data: {
    content?: string;
    author?: {
      id: string;
      name: string;
    };
    channelId?: string;
  };
  timestamp: number;
  userId?: string;
  userName?: string;
}

export function RealtimeChat() {
  const { user } = useAuth();
  const { isConnected, messages, connectedUsers, sendMessage } = useWebSocket();
  const [messageInput, setMessageInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Handle typing indicators
    const typingMessages = messages.filter(m => m.type === 'typing');
    const currentlyTyping = typingMessages
      .filter(m => m.data.isTyping && m.userId !== user?.id)
      .map(m => m.userName || 'Anonymous');
    
    setTypingUsers([...new Set(currentlyTyping)]);
  }, [messages, user?.id]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !isConnected) return;

    sendMessage('message', {
      content: messageInput.trim(),
      channelId: 'general'
    });

    setMessageInput('');
    handleStopTyping();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (value: string) => {
    setMessageInput(value);
    
    if (!isTyping && value.trim()) {
      setIsTyping(true);
      sendMessage('typing', { isTyping: true, channelId: 'general' });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping();
    }, 1000);
  };

  const handleStopTyping = () => {
    if (isTyping) {
      setIsTyping(false);
      sendMessage('typing', { isTyping: false, channelId: 'general' });
    }
  };

  const formatMessageTime = (timestamp: number) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const chatMessages = messages.filter(m => m.type === 'message');

  return (
    <Card className="h-[500px] flex flex-col" data-testid="realtime-chat">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Community Chat</span>
            {isConnected ? (
              <Wifi className="h-4 w-4 text-green-500" data-testid="connection-status-connected" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" data-testid="connection-status-disconnected" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <Badge variant="secondary" data-testid="user-count">
              {connectedUsers.length} online
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-3 min-h-0">
        {/* Connected Users */}
        <div className="flex flex-wrap gap-1" data-testid="connected-users">
          {connectedUsers.slice(0, 5).map((connectedUser) => (
            <Badge key={connectedUser.userId} variant="outline" className="text-xs">
              {connectedUser.userName}
            </Badge>
          ))}
          {connectedUsers.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{connectedUsers.length - 5} more
            </Badge>
          )}
        </div>

        <Separator />

        {/* Messages */}
        <ScrollArea className="flex-1" data-testid="messages-container">
          <div className="space-y-3 pr-3">
            {chatMessages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              chatMessages.map((message, index) => (
                <div 
                  key={`${message.timestamp}-${index}`} 
                  className={`flex gap-2 ${message.userId === user?.id ? 'justify-end' : 'justify-start'}`}
                  data-testid={`message-${index}`}
                >
                  {message.userId !== user?.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(message.data.author?.name || message.userName || 'U')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-[75%] ${message.userId === user?.id ? 'order-first' : ''}`}>
                    <div className={`rounded-lg px-3 py-2 ${
                      message.userId === user?.id 
                        ? 'bg-primary text-primary-foreground ml-auto' 
                        : 'bg-muted'
                    }`}>
                      {message.userId !== user?.id && (
                        <p className="text-xs font-medium mb-1">
                          {message.data.author?.name || message.userName}
                        </p>
                      )}
                      <p className="text-sm break-words">{message.data.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {formatMessageTime(message.timestamp)}
                    </p>
                  </div>

                  {message.userId === user?.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(user?.firstName || user?.email || 'You')}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
            
            {/* Typing indicator */}
            {typingUsers.length > 0 && (
              <div className="flex gap-2 items-center text-sm text-muted-foreground" data-testid="typing-indicator">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
                <span>
                  {typingUsers.length === 1 
                    ? `${typingUsers[0]} is typing...`
                    : `${typingUsers.slice(0, -1).join(', ')} and ${typingUsers[typingUsers.length - 1]} are typing...`
                  }
                </span>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="flex gap-2" data-testid="message-input-container">
          <Input
            value={messageInput}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isConnected ? "Type a message..." : "Connecting..."}
            disabled={!isConnected}
            className="flex-1"
            data-testid="message-input"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!isConnected || !messageInput.trim()}
            size="icon"
            data-testid="send-button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {!isConnected && (
          <p className="text-sm text-muted-foreground text-center">
            Connecting to chat server...
          </p>
        )}
      </CardContent>
    </Card>
  );
}