"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, User, Eye, ClipboardList, Heart, Check } from "lucide-react";
import { tournamentRoles } from "@/lib/cricket-data";

const iconMap: Record<string, React.ReactNode> = {
  crown: <Crown className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
  user: <User className="w-6 h-6" />,
  eye: <Eye className="w-6 h-6" />,
  clipboard: <ClipboardList className="w-6 h-6" />,
  heart: <Heart className="w-6 h-6" />,
};

export function RolesSection() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Tournament Roles</h2>
        <p className="text-muted-foreground text-sm">Everyone plays a part in making gully cricket special</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {tournamentRoles.map((role, index) => (
          <motion.div key={role.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }}
            className="glass rounded-2xl p-5 sm:p-6 hover:bg-card/80 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${role.color}15`, color: role.color }}
              >
                {iconMap[role.icon]}
              </div>
              <div>
                <h3 className="text-base font-bold">{role.name}</h3>
                <Badge className="text-xs mt-0.5" style={{ backgroundColor: `${role.color}15`, color: role.color, borderColor: `${role.color}30` }}>
                  {role.responsibilities.length} duties
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{role.description}</p>

            <div className="space-y-2">
              {role.responsibilities.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: `${role.color}20` }}>
                    <Check className="w-2.5 h-2.5" style={{ color: role.color }} />
                  </div>
                  <p className="text-sm text-muted-foreground">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Join CTA */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-8 glass rounded-2xl p-6 sm:p-8 text-center border border-primary/15"
      >
        <h3 className="text-xl font-bold mb-2 text-cricket-gradient">Ready to Join the Action?</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Whether you want to play, umpire, or just cheer from the sidelines — there&apos;s a place for everyone in GCPL!
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1.5"><Crown className="w-3 h-3 mr-1" />Register Your Team</Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1.5"><User className="w-3 h-3 mr-1" />Join as Player</Badge>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs px-3 py-1.5"><Heart className="w-3 h-3 mr-1" />Become a Fan</Badge>
        </div>
      </motion.div>
    </div>
  );
}
