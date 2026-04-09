"use client";

import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Mail, Instagram, Twitter, Youtube, Heart } from "lucide-react";
import { tournamentInfo } from "@/lib/cricket-data";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-8">
      <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <h3 className="text-lg font-bold text-cricket-gradient mb-2">{tournamentInfo.shortName}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{tournamentInfo.tagline}</p>
            <div className="flex items-center gap-2 mt-3">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{tournamentInfo.venue}, {tournamentInfo.city}</span>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
            <div className="space-y-2">
              {["Teams", "Fixtures", "Points Table", "Players", "Gallery"].map((link) => (
                <p key={link} className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">{link}</p>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Contact</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Phone className="w-3.5 h-3.5" /><span>+91 98765 43210</span></div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="w-3.5 h-3.5" /><span>gcpl@mumbaicricket.com</span></div>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Twitter, label: "Twitter" },
                { icon: Youtube, label: "YouTube" },
              ].map((social) => (
                <div key={social.label}
                  className="w-9 h-9 rounded-lg inner-card flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  role="button" aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">{tournamentInfo.organizer}</p>
          </div>
        </div>
        <Separator className="mb-4 bg-border/30" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© 2025 {tournamentInfo.shortName}. All rights reserved.</p>
          <p className="flex items-center gap-1">Made with <Heart className="w-3 h-3 text-red-500" /> for Gully Cricket</p>
        </div>
      </div>
    </footer>
  );
}
