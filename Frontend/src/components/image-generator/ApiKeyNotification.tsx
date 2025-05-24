import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function ApiKeyNotification() {
  const handleViewEnvFile = () => {
    // In a real app, we would navigate to settings
    // For this demo, just show an alert with instructions
    alert(`To fix this error:
1. Create a .env file in the project root
2. Add your Together AI key: VITE_TOGETHER_API_KEY=your_key_here
3. Restart the application`);
  };
  
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Together AI Key Missing</AlertTitle>
      <AlertDescription className="flex flex-col gap-2">
        <p>
          The Together AI API key is not found. This key is required for image generation
          and text analysis functionality.
        </p>
        <div>
          <Button variant="outline" size="sm" onClick={handleViewEnvFile}>
            View Instructions
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
} 