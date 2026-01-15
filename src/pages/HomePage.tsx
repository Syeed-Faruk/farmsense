import { Link } from "react-router-dom";
import { Sprout, MessageCircle, FlaskConical, Leaf, Target, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import heroImage from "@/assets/hero-farm.jpg";

const features = [
  {
    icon: Sprout,
    title: "Explore Crops",
    description: "Learn about different crops, their soil requirements, water needs, and sustainability practices.",
    link: "/crops",
    color: "bg-leaf-light text-leaf",
  },
  {
    icon: MessageCircle,
    title: "Ask the AI",
    description: "Get instant answers to your farming questions from our AI-powered agricultural assistant.",
    link: "/chatbot",
    color: "bg-water-light text-water",
  },
  {
    icon: FlaskConical,
    title: "Simulate Outcomes",
    description: "See how crops may perform under different soil and water conditions over time.",
    link: "/simulate",
    color: "bg-wheat-light text-secondary",
  },
];

const sdgPoints = [
  {
    icon: Target,
    title: "End Hunger",
    description: "Supporting food security through informed farming decisions",
  },
  {
    icon: Leaf,
    title: "Sustainable Agriculture",
    description: "Promoting eco-friendly practices that protect our planet",
  },
  {
    icon: Users,
    title: "Empower Farmers",
    description: "Providing accessible knowledge to farming communities",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Lush green farmland" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
        </div>

        <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="max-w-3xl space-y-6 animate-fade-in-up">
            {/* SDG Badge */}
            <div className="inline-flex items-center gap-2 bg-accent/90 text-accent-foreground px-4 py-2 rounded-full shadow-soft">
              <Target className="w-4 h-4" />
              <span className="text-sm font-semibold">Supporting SDG 2 – Zero Hunger</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary-foreground leading-tight">
              Smart Farming Decisions, <br />
              <span className="text-accent">Powered by AI</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl">
              Explore crops, get AI-powered guidance, and simulate outcomes to make informed, 
              sustainable agricultural decisions. Your digital farming companion.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/crops">
                <Button variant="accent" size="lg" className="gap-2">
                  <Sprout className="w-5 h-5" />
                  Explore Crops
                </Button>
              </Link>
              <Link to="/chatbot">
                <Button variant="outline" size="lg" className="gap-2 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 hover:text-primary-foreground">
                  <MessageCircle className="w-5 h-5" />
                  Ask the AI
                </Button>
              </Link>
              <Link to="/simulate">
                <Button variant="outline" size="lg" className="gap-2 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/20 hover:text-primary-foreground">
                  <FlaskConical className="w-5 h-5" />
                  Simulate Outcome
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 50L48 45C96 40 192 30 288 35C384 40 480 60 576 65C672 70 768 60 864 50C960 40 1056 30 1152 35C1248 40 1344 60 1392 70L1440 80V100H1392C1344 100 1248 100 1152 100C1056 100 960 100 864 100C768 100 672 100 576 100C480 100 384 100 288 100C192 100 96 100 48 100H0V50Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
              How AgriWise Helps You
            </h2>
            <p className="text-muted-foreground text-lg">
              Three powerful tools to support your farming journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.title} to={feature.link}>
                  <Card 
                    variant="crop" 
                    className="h-full cursor-pointer group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader>
                      <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center gap-2 text-primary font-semibold group-hover:gap-3 transition-all">
                        Get Started <ArrowRight className="w-4 h-4" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* SDG Section */}
      <section className="py-16 lg:py-24 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full">
                <Target className="w-4 h-4" />
                <span className="text-sm font-semibold">UN Sustainable Development Goal 2</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                Contributing to Zero Hunger
              </h2>
              
              <p className="text-muted-foreground text-lg">
                SDG 2 aims to end hunger, achieve food security, improve nutrition, and promote 
                sustainable agriculture. AgriWise supports this mission by providing farmers with 
                accessible, AI-powered tools for better decision-making.
              </p>

              <div className="space-y-4">
                {sdgPoints.map((point) => {
                  const Icon = point.icon;
                  return (
                    <div key={point.title} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{point.title}</h4>
                        <p className="text-sm text-muted-foreground">{point.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative">
              <Card variant="simulation" className="p-8 bg-gradient-card">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-gradient-hero flex items-center justify-center shadow-elevated">
                    <Leaf className="w-10 h-10 text-primary-foreground animate-pulse-gentle" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-foreground">
                    Advisory, Not Compulsory
                  </h3>
                  <p className="text-muted-foreground">
                    AgriWise provides guidance and simulations to support your decisions. 
                    All results are estimates meant to inform, not dictate. The final 
                    choice always remains with you, the farmer.
                  </p>
                  <div className="pt-4">
                    <Link to="/simulate">
                      <Button variant="hero" size="lg">
                        Try the Simulator
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Ready to Make Smarter Farming Decisions?
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-8">
            Start exploring crops, ask our AI assistant, or simulate outcomes for your farm today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/crops">
              <Button variant="accent" size="lg">
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
