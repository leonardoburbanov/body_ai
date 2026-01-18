"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

/**
 * Chat page component
 * Provides an AI chatbot interface for fitness and nutrition assistance
 */
export default function ChatPage() {
  const [userId, setUserId] = React.useState<string | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Mark component as mounted to prevent hydration issues
    setMounted(true);
    // Get userId from localStorage
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const [input, setInput] = React.useState("");
  
  // Create transport with body as Resolvable function
  // This ensures userId is resolved dynamically on each request
  // Only create transport after component is mounted to avoid hydration issues
  const transport = React.useMemo(() => {
    if (!mounted) {
      // Return a placeholder transport that won't be used until mounted
      return new DefaultChatTransport({
        api: "/api/chat",
        body: {},
      });
    }
    return new DefaultChatTransport({
      api: "/api/chat",
      // Use body as a function that resolves dynamically
      // This ensures userId is always current when the request is made
      body: () => {
        const currentUserId = userId || (typeof window !== "undefined" ? localStorage.getItem("userId") : null);
        console.log("Transport body - userId:", currentUserId);
        return currentUserId ? { userId: currentUserId } : {};
      },
    });
  }, [userId, mounted]);
  
  // Initialize useChat with the transport
  const { messages, sendMessage, status } = useChat({
    transport,
    // Add id to force re-initialization when userId changes
    id: userId ? `chat-${userId}` : undefined,
  });

  const isLoading = status !== "ready";

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto w-full">
      <Card className="flex flex-col h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-1 overflow-hidden p-0">
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">
                  Welcome to your AI Fitness Assistant!
                </p>
                <p className="text-sm">
                  Ask me about your workout routines, meal plans, nutrition, or
                  any fitness-related questions.
                </p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-lg px-4 py-2 max-w-[80%]",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="flex items-start gap-2">
                    {message.role === "user" && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      {message.role === "assistant" ? (
                        <div className="text-sm markdown-content">
                          <ReactMarkdown
                            components={{
                              // Customize heading styles
                              h1: ({ node, ...props }) => (
                                <h1 className="text-lg font-bold mt-4 mb-2 first:mt-0" {...props} />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2 className="text-base font-bold mt-3 mb-2 first:mt-0" {...props} />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3 className="text-sm font-semibold mt-2 mb-1 first:mt-0" {...props} />
                              ),
                              // Customize list styles
                              ul: ({ node, ...props }) => (
                                <ul className="list-disc list-inside my-2 space-y-1" {...props} />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol className="list-decimal list-inside my-2 space-y-1" {...props} />
                              ),
                              li: ({ node, ...props }) => (
                                <li className="ml-2" {...props} />
                              ),
                              // Customize paragraph
                              p: ({ node, ...props }) => (
                                <p className="my-2 first:mt-0 last:mb-0" {...props} />
                              ),
                              // Customize bold and italic
                              strong: ({ node, ...props }) => (
                                <strong className="font-semibold" {...props} />
                              ),
                              em: ({ node, ...props }) => (
                                <em className="italic" {...props} />
                              ),
                              // Customize code blocks
                              code: ({ node, inline, ...props }: any) =>
                                inline ? (
                                  <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono" {...props} />
                                ) : (
                                  <code className="block bg-muted p-2 rounded text-xs font-mono overflow-x-auto" {...props} />
                                ),
                              pre: ({ node, ...props }) => (
                                <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto my-2" {...props} />
                              ),
                            }}
                          >
                            {message.parts
                              ?.filter((part: any) => part.type === "text")
                              .map((part: any) => part.text)
                              .join("") || message.content || ""}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <div className="text-sm whitespace-pre-wrap">
                          {message.parts
                            ?.filter((part: any) => part.type === "text")
                            .map((part: any, idx: number) => (
                              <span key={idx}>{part.text}</span>
                            )) || message.content || ""}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim() && !isLoading && userId) {
                sendMessage({ text: input });
                setInput("");
              }
            }}
            className="border-t p-4 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your routines, recipes, or nutrition..."
              disabled={isLoading || !mounted || !userId}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !mounted || !userId}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
