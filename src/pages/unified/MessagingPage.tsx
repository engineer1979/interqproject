import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/SimpleAuthContext";
import { Send, Search, MessageSquare } from "lucide-react";

const DEMO_CONVERSATIONS = [
  {
    id: "1", name: "Alex Thompson", role: "Candidate", avatar: "AT", online: true,
    lastMsg: "Thank you for the interview opportunity!", time: "2m ago", unread: 2,
    messages: [
      { id: "1", from: "them", text: "Hi, I wanted to follow up on my application for Senior Engineer.", time: "10:00 AM" },
      { id: "2", from: "me", text: "Hi Alex! Yes, we reviewed your profile and are impressed with your background.", time: "10:05 AM" },
      { id: "3", from: "them", text: "That's great to hear! When can I expect next steps?", time: "10:07 AM" },
      { id: "4", from: "me", text: "We'd like to schedule a technical interview next week. Are you available?", time: "10:10 AM" },
      { id: "5", from: "them", text: "Thank you for the interview opportunity!", time: "10:12 AM" },
    ]
  },
  {
    id: "2", name: "Emily Davis", role: "Recruiter", avatar: "ED", online: true,
    lastMsg: "The candidate cleared the first round.", time: "1h ago", unread: 0,
    messages: [
      { id: "1", from: "them", text: "Quick update on the DevOps Engineer search.", time: "9:00 AM" },
      { id: "2", from: "me", text: "Go ahead, what's the status?", time: "9:02 AM" },
      { id: "3", from: "them", text: "The candidate cleared the first round.", time: "9:05 AM" },
    ]
  },
  {
    id: "3", name: "Sophie Chen", role: "Candidate", avatar: "SC", online: false,
    lastMsg: "I've accepted the offer!", time: "3h ago", unread: 1,
    messages: [
      { id: "1", from: "them", text: "I received the offer letter. It looks great!", time: "Yesterday" },
      { id: "2", from: "me", text: "Wonderful! Please review the terms and let us know.", time: "Yesterday" },
      { id: "3", from: "them", text: "I've accepted the offer!", time: "Yesterday" },
    ]
  },
  {
    id: "4", name: "TechCorp Solutions", role: "Company", avatar: "TC", online: true,
    lastMsg: "We need 3 more engineers by Q2.", time: "1d ago", unread: 0,
    messages: [
      { id: "1", from: "them", text: "We need to scale our engineering team.", time: "Monday" },
      { id: "2", from: "me", text: "Understood. How many positions are you looking to fill?", time: "Monday" },
      { id: "3", from: "them", text: "We need 3 more engineers by Q2.", time: "Monday" },
    ]
  },
];

export default function MessagingPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState(DEMO_CONVERSATIONS);
  const [activeConv, setActiveConv] = useState<any>(DEMO_CONVERSATIONS[0]);
  const [messageText, setMessageText] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages]);

  const sendMessage = () => {
    if (!messageText.trim() || !activeConv) return;
    const newMsg = { id: Date.now().toString(), from: "me", text: messageText.trim(), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    const updated = conversations.map(c =>
      c.id === activeConv.id
        ? { ...c, messages: [...c.messages, newMsg], lastMsg: newMsg.text, time: "Just now" }
        : c
    );
    setConversations(updated);
    setActiveConv(updated.find(c => c.id === activeConv.id));
    setMessageText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const filteredConvs = conversations.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const markRead = (conv: any) => {
    const updated = conversations.map(c => c.id === conv.id ? { ...c, unread: 0 } : c);
    setConversations(updated);
    setActiveConv(updated.find(c => c.id === conv.id));
  };

  return (
    <div className="p-6 h-[calc(100vh-5rem)]">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">Communicate with candidates, recruiters, and companies</p>
      </div>
      <div className="flex gap-4 h-[calc(100%-5rem)] border rounded-xl overflow-hidden bg-background">
        {/* Sidebar */}
        <div className="w-72 border-r flex flex-col">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-9 h-8 text-sm" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredConvs.map(conv => (
              <button
                key={conv.id}
                onClick={() => { setActiveConv(conv); markRead(conv); }}
                className={`w-full text-left p-3 flex items-start gap-3 hover:bg-muted transition-colors border-b border-border/50 ${activeConv?.id === conv.id ? "bg-muted" : ""}`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                    {conv.avatar}
                  </div>
                  {conv.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-medium text-sm truncate">{conv.name}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0 ml-1">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground truncate">{conv.lastMsg}</span>
                    {conv.unread > 0 && (
                      <Badge className="h-4 w-4 rounded-full p-0 text-xs bg-blue-600 text-white flex items-center justify-center flex-shrink-0 ml-1">{conv.unread}</Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs mt-1">{conv.role}</Badge>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {activeConv ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {activeConv.avatar}
                </div>
                {activeConv.online && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-background" />}
              </div>
              <div>
                <div className="font-semibold text-sm">{activeConv.name}</div>
                <div className="text-xs text-muted-foreground">{activeConv.online ? "Online" : "Offline"} · {activeConv.role}</div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {activeConv.messages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.from === "me" ? "bg-blue-600 text-white rounded-br-sm" : "bg-muted rounded-bl-sm"}`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-0.5 ${msg.from === "me" ? "text-blue-200" : "text-muted-foreground"}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={e => setMessageText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button size="sm" onClick={sendMessage} disabled={!messageText.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>Select a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
