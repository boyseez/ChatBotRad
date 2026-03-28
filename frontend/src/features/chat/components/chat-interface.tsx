import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import type { RootState } from "@/store";
import { addMessage } from "@/store/slices/chatSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { LottieLoader } from "@/components/ui/lottie-loader";
import { Send, Bot, User as UserIcon, Paperclip, Mic, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  type?: "text" | "video" | "reference";
  references?: string[];
  videoUrl?: string;
}

function VideoPreview({ url }: { url: string }) {
  const videoId = "aqz-KE-bpKQ"; 
  const embedUrl = `https://www.youtube.com/embed/${videoId}?start=38`;

  return (
    <div className="mt-3 overflow-hidden rounded-lg border bg-black shadow-sm aspect-video w-full max-w-md">
      <iframe
        width="100%"
        height="100%"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
}

export function ChatInterface() {
  const { t } = useTranslation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { activeChatId, messages, loading } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(userMessage));
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      let botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: t("chat.analysis_complete"),
        timestamp: new Date().toISOString(),
        type: "text"
      };

      const lowerText = text.toLowerCase();

      if (lowerText.includes("video")) {
        botMessage.content = t("chat.video_title");
        botMessage.type = "video";
        botMessage.videoUrl = "https://www.youtube.com/watch?v=aqz-KE-bpKQ";
      } else if (lowerText.includes("riferimenti")) {
        botMessage.content = t("chat.reference_title");
        botMessage.type = "reference";
        botMessage.references = ["Manuale_Tecnico.pdf", "Guida.pdf"];
      } else {
        botMessage.content = `${t("chat.analysis_complete")} (${text})`;
      }

      dispatch(addMessage(botMessage));
      setIsTyping(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <LottieLoader message={t("chat.typing") + "..."} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto bg-background border rounded-2xl shadow-xl overflow-hidden min-h-0 relative">
      
      <div className="px-6 py-4 border-b bg-muted/5 flex items-center justify-between shrink-0 h-16">
        <div className="flex items-center gap-3">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          <h3 className="text-sm font-bold tracking-tight uppercase">
            {activeChatId ? `${t("layout.new_conversation")} #${activeChatId}` : t("layout.new_conversation")}
          </h3>
        </div>
      </div>

      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full w-full" ref={scrollRef}>
          <div className="flex flex-col gap-8 p-6 pb-20">
            {messages.length === 0 && !isTyping && (
              <div className="flex flex-col items-center justify-center h-full mt-20 opacity-20 space-y-4 text-center px-10">
                <Bot className="h-16 w-16" />
                <p className="text-lg font-medium italic">{t("chat.new_chat_desc")}</p>
              </div>
            )}
            
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <Avatar className={cn("mt-1 border shrink-0 h-9 w-9 shadow-sm", 
                  msg.role === "assistant" ? "bg-primary/10 text-primary border-primary/20" : "bg-muted")}>
                  <AvatarFallback className="text-[10px]">
                    {msg.role === "assistant" ? <Bot className="h-5 w-5" /> : <UserIcon className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={cn("flex flex-col gap-1.5", msg.role === "user" ? "items-end" : "items-start", "max-w-[85%]")}>
                  <div className={cn(
                    "rounded-2xl px-5 py-3 text-sm shadow-sm border",
                    msg.role === "user" 
                      ? "bg-primary text-primary-foreground border-primary rounded-tr-none" 
                      : "bg-background text-foreground border-border rounded-tl-none"
                  )}>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    
                    {msg.type === "video" && msg.videoUrl && <VideoPreview url={msg.videoUrl} />}

                    {msg.type === "reference" && msg.references && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {msg.references.map((ref, i) => (
                          <Badge key={i} variant="secondary" className="gap-1.5 py-1.5 px-3 hover:bg-secondary/80 cursor-pointer border-none shadow-sm">
                            <FileText className="h-3.5 w-3.5 text-primary" />
                            {ref}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] px-2 opacity-40 font-medium italic">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex items-start gap-4 animate-in fade-in duration-300">
                <Avatar className="mt-1 border shrink-0 h-9 w-9 bg-primary/10 text-primary border-primary/20">
                  <AvatarFallback><Bot className="h-5 w-5" /></AvatarFallback>
                </Avatar>
                <div className="bg-muted/30 rounded-2xl rounded-tl-none px-5 py-4 flex gap-1.5 items-center border border-border/50">
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="shrink-0 p-6 border-t bg-background shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center gap-3 bg-muted/40 border border-border/60 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0 rounded-xl hover:bg-background">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            placeholder={t("chat.placeholder")}
            className="border-none shadow-none focus-visible:ring-0 bg-transparent flex-1 text-sm h-10"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" className="h-10 w-10 rounded-xl shrink-0 shadow-lg" disabled={!input.trim() || isTyping} onClick={handleSend}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
