import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Bot, User, Leaf, Info, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const suggestedQuestions = [
  "Which crop is good for loamy soil?",
  "How to reduce water usage in farming?",
  "What are common pest risks for tomatoes?",
  "Best practices for crop rotation?",
  "How to improve soil fertility naturally?",
];

// Simple rule-based responses for demo (will be replaced with AI)
function getSimpleResponse(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes("loamy") && q.includes("soil")) {
    return "Loamy soil is excellent for many crops! It has a balanced mix of sand, silt, and clay, providing good drainage while retaining nutrients. Great options include:\n\n• **Wheat** - thrives in well-drained loamy soil\n• **Maize (Corn)** - performs excellently\n• **Tomatoes** - prefer sandy loam\n• **Soybeans** - ideal for loamy conditions\n\nLoamy soil is considered the best all-purpose soil for farming due to its balanced properties.";
  }
  
  if (q.includes("water") && (q.includes("reduce") || q.includes("save") || q.includes("usage"))) {
    return "Here are effective ways to reduce water usage in farming:\n\n• **Drip Irrigation** - Delivers water directly to roots, saving 30-50% water\n• **Mulching** - Covers soil to reduce evaporation\n• **Rainwater Harvesting** - Collect and store rainwater\n• **Drought-resistant Crops** - Consider soybeans or sorghum\n• **Alternate Wetting & Drying** - For rice, this can save up to 30% water\n• **Soil Moisture Sensors** - Water only when needed\n\nThese practices not only save water but also reduce costs and support sustainable farming.";
  }
  
  if (q.includes("pest") && q.includes("tomato")) {
    return "Common pest risks for tomatoes include:\n\n• **Aphids** - Small insects that suck plant sap. Use neem oil or introduce ladybugs.\n• **Whiteflies** - Found under leaves. Yellow sticky traps help.\n• **Hornworms** - Large green caterpillars. Hand-pick or use Bacillus thuringiensis.\n• **Spider Mites** - Cause yellow spotting. Increase humidity and use insecticidal soap.\n• **Fruit Worms** - Bore into fruits. Crop rotation and removing affected fruits help.\n\n**Prevention Tips:**\n- Rotate crops annually\n- Use companion planting (basil repels pests)\n- Keep plants well-spaced for air circulation";
  }
  
  if (q.includes("crop rotation") || q.includes("rotation")) {
    return "Crop rotation is a sustainable farming practice with many benefits:\n\n**Why Rotate Crops:**\n• Breaks pest and disease cycles\n• Improves soil fertility\n• Reduces need for chemical inputs\n• Better nutrient management\n\n**Simple Rotation Plan:**\n1. **Year 1:** Legumes (soybeans, peas) - fix nitrogen\n2. **Year 2:** Leafy vegetables - use the nitrogen\n3. **Year 3:** Root vegetables - different nutrient needs\n4. **Year 4:** Grains (wheat, maize) - heavy feeders\n\nAlways follow heavy feeders with nitrogen-fixing crops!";
  }
  
  if (q.includes("soil") && q.includes("fertility") || q.includes("improve soil")) {
    return "Natural ways to improve soil fertility:\n\n• **Composting** - Add organic matter from kitchen/farm waste\n• **Green Manure** - Grow and plow under cover crops\n• **Vermicomposting** - Use earthworms to create rich compost\n• **Mulching** - Organic mulch decomposes and enriches soil\n• **Crop Rotation** - Especially with legumes that fix nitrogen\n• **Avoid Over-tilling** - Protects soil structure and organisms\n\n**Quick Boost:** Plant legumes like soybeans or clover, then incorporate them into the soil before they flower. This adds nitrogen naturally!";
  }
  
  // Default response
  return "That's a great question about agriculture! While I'm currently running in demo mode, here's some general advice:\n\n• Consider your local climate and soil conditions\n• Practice sustainable farming methods\n• Rotate crops to maintain soil health\n• Use water efficiently through drip irrigation\n• Monitor crops regularly for pests and diseases\n\n**Tip:** Check out our Crop Explorer to learn about specific crops, or use the Simulator to see how crops might perform in different conditions.\n\n*For more specific guidance, please try asking about soil types, water management, pest control, or specific crops!*";
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI thinking
    setTimeout(() => {
      const response = getSimpleResponse(messageText);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-earth py-8 lg:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-water-light text-water px-4 py-2 rounded-full mb-4">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">AI Agriculture Assistant</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4">
            Ask the AI
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get instant answers to your farming questions. Our AI assistant is here to help 
            with crop selection, pest management, sustainable practices, and more.
          </p>
        </div>

        {/* Chat Container */}
        <Card variant="simulation" className="min-h-[500px] flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-lg">AgriWise Assistant</CardTitle>
                <CardDescription>Ask anything about farming</CardDescription>
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center gap-1 text-xs bg-leaf-light text-leaf px-2 py-1 rounded-full">
                  <span className="w-2 h-2 bg-leaf rounded-full animate-pulse" />
                  Online
                </span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-hero flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg mb-2">Welcome! How can I help you today?</h3>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    I can answer questions about crops, soil, water management, pests, 
                    and sustainable farming practices.
                  </p>
                </div>

                {/* Suggested Questions */}
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Try asking:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedQuestions.map((q, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleSend(q)}
                      >
                        {q}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  <div 
                    className="text-sm whitespace-pre-wrap prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: message.content
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        .replace(/\n/g, '<br/>') 
                    }}
                  />
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-secondary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                className="min-h-[50px] max-h-[120px] resize-none"
                rows={1}
              />
              <Button
                variant="hero"
                size="icon"
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="flex-shrink-0 h-[50px] w-[50px]"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Info Card */}
        <Card variant="flat" className="mt-6 bg-accent/10 border-accent/30">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <strong className="text-foreground">Note:</strong> This AI assistant provides general 
                agricultural guidance. For specific local conditions or serious crop issues, please 
                consult with local agricultural extension services or agronomists. No personal data is collected.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
