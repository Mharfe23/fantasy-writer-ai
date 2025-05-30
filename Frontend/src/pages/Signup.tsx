import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Facebook, Github, Mail } from "lucide-react";
import { authService } from "@/services/auth.service";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.register(username, email, password);
      toast({
        title: "Account created",
        description: "Welcome to Fantasy Writer AI! Please log in to continue.",
      });
      navigate("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.response?.data || "There was a problem creating your account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSignup = (provider: string) => {
    setIsLoading(true);
    
    // Simulate OAuth signup
    console.log(`Signing up with ${provider}`);
    
    toast({
      title: "Redirecting to provider",
      description: `Connecting to ${provider}...`,
    });
    
    // In a real app, this would redirect to the OAuth provider
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background flex flex-col">
        <div className="relative flex-1 flex flex-col items-center justify-center px-4">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[center_top_1rem] dark:block hidden" />
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-md"
          >
            <div className="bg-card rounded-lg border border-border p-8 shadow-xl">
              <div className="text-center mb-8">
                <Link to="/" className="inline-block">
                  <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-400">
                    Fantasy Writer AI
                  </h1>
                </Link>
                <h2 className="text-xl font-semibold mt-6 mb-2">Create an account</h2>
                <p className="text-muted-foreground">Join Fantasy Writer AI to unleash your creativity</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleOAuthSignup("Google")}
                  disabled={isLoading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Sign up with Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleOAuthSignup("Facebook")}
                  disabled={isLoading}
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Sign up with Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleOAuthSignup("GitHub")}
                  disabled={isLoading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Sign up with GitHub
                </Button>
              </div>
              
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleEmailSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Choose a username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="Create a strong password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 8 characters and include a number and a symbol
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" required />
                  <Label htmlFor="terms" className="text-sm font-normal">
                    I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  );
}
