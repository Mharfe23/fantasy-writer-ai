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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.login(username, password);
        toast({
          title: "Login successful",
          description: "Welcome back to Fantasy Writer AI!",
        });
      navigate("/dashboard");
    } catch (error: any) {
      e.preventDefault(); // Prevent form submission
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.error || "Please check your credentials and try again.",
      });
      // Clear password field on error
      setPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate OAuth login
    console.log(`Logging in with ${provider}`);
    
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
                <h2 className="text-xl font-semibold mt-6 mb-2">Welcome back</h2>
                <p className="text-muted-foreground">Log in to your account to continue</p>
              </div>
              
              <div className="space-y-4 mb-6">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleOAuthLogin("Google")}
                  disabled={isLoading}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleOAuthLogin("Facebook")}
                  disabled={isLoading}
                >
                  <Facebook className="mr-2 h-4 w-4" />
                  Continue with Facebook
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => handleOAuthLogin("GitHub")}
                  disabled={isLoading}
                >
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
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
              
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    type="text" 
                    placeholder="Enter your username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input 
                    id="password" 
                    type="password"
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal">
                    Remember me for 30 days
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Sign in"}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
          
          <p className="text-center text-sm text-muted-foreground mt-8 relative z-10">
            By continuing, you agree to our{" "}
            <Link to="/terms" className="hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}
