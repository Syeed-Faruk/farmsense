import { Leaf, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Leaf className="w-5 h-5" />
              </div>
              <span className="font-serif font-bold text-xl">AgriWise</span>
            </div>
            <p className="text-primary-foreground/80 text-sm max-w-xs">
              AI-powered agricultural support for sustainable farming decisions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link to="/crops" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Explore Crops
              </Link>
              <Link to="/chatbot" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                AI Chatbot
              </Link>
              <Link to="/simulate" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors text-sm">
                Crop Simulation
              </Link>
            </nav>
          </div>

          {/* SDG Info */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-lg">Our Mission</h4>
            <p className="text-primary-foreground/80 text-sm">
              Supporting <strong>SDG 2 – Zero Hunger</strong> by empowering farmers with AI-driven insights for sustainable agriculture.
            </p>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2026 AgriWise. For educational and advisory purposes only.
            </p>
            <p className="text-sm text-primary-foreground/60 flex items-center gap-1">
              Made with <Heart className="w-4 h-4 text-destructive fill-destructive" /> for sustainable farming
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
