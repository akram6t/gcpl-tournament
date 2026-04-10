"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Eye, EyeOff, Loader2, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup } = useAuthStore();

  const [loginEmail, setLoginEmail] = useState("admin@gcpl.com");
  const [loginPassword, setLoginPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupRole, setSignupRole] = useState("SPECTATOR");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await login(loginEmail, loginPassword);
    if (result.success) {
      router.push("/admin");
    } else {
      setError(result.error || "Login failed");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError("");
    const result = await signup(signupName, signupEmail, signupPassword, signupRole);
    if (result.success) {
      router.push("/");
    } else {
      setSignupError(result.error || "Signup failed");
    }
    setSignupLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <Card className="border-border/50 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-lime-500 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-green-500/25 mb-3">
              G
            </div>
            <CardTitle className="text-xl">GCPL Admin Portal</CardTitle>
            <CardDescription className="text-sm">Gully Cricket Premier League - Season 4</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              {/* Login Tab */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                      {error}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="admin@gcpl.com"
                      className="h-10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-xs font-medium">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••"
                        className="h-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full h-10" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Sign In
                      </>
                    )}
                  </Button>
                </form>

                <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Demo Credentials</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { role: "Admin", email: "admin@gcpl.com", pass: "admin123", color: "bg-green-100 dark:bg-green-500/15 text-green-700 dark:text-green-400" },
                      { role: "Organizer", email: "organizer@gcpl.com", pass: "org123", color: "bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400" },
                      { role: "Player", email: "rahul@gcpl.com", pass: "user123", color: "bg-orange-100 dark:bg-orange-500/15 text-orange-700 dark:text-orange-400" },
                      { role: "Fan", email: "fan@gcpl.com", pass: "user123", color: "bg-purple-100 dark:bg-purple-500/15 text-purple-700 dark:text-purple-400" },
                    ].map((cred) => (
                      <button
                        key={cred.role}
                        type="button"
                        onClick={() => { setLoginEmail(cred.email); setLoginPassword(cred.pass); }}
                        className="text-left p-2 rounded-lg border border-border/50 hover:bg-background cursor-pointer transition-colors"
                      >
                        <Badge variant="secondary" className={`text-[10px] mb-1 ${cred.color} border-0`}>{cred.role}</Badge>
                        <p className="text-[10px] text-muted-foreground font-mono">{cred.email}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Signup Tab */}
              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  {signupError && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs">
                      {signupError}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-medium">Full Name</Label>
                    <Input
                      id="name"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="Your name"
                      className="h-10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-xs font-medium">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-10"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-xs font-medium">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="h-10"
                      required
                      minLength={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Register As</Label>
                    <Select value={signupRole} onValueChange={setSignupRole}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SPECTATOR">Spectator / Fan</SelectItem>
                        <SelectItem value="PLAYER">Player</SelectItem>
                        <SelectItem value="ORGANIZER">Organizer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full h-10" disabled={signupLoading}>
                    {signupLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Create Account
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
