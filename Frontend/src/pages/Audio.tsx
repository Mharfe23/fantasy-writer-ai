import { useState } from "react";
import { motion } from "framer-motion";
import { 
  CirclePlay, 
  Mic, 
  Upload, 
  Download, 
  Settings, 
  Clock,
  FileAudio,
  Volume2,
  Trash2,
  Share2,
  Plus,
  Play,
  Pause,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import DashboardLayout from "@/components/DashboardLayout";
import NewAudioForm from "@/components/audio/NewAudioForm";
import { useAuth } from "@/hooks/useAuth";

// Dummy data for demonstration
const audioFiles = [
  { id: 1, title: "Chapter 1 - The Beginning", project: "The Crystal Kingdom", duration: "12:45", date: "2 days ago", voice: "af_heart" },
  { id: 2, title: "Chapter 2 - The Journey", project: "The Crystal Kingdom", duration: "15:30", date: "2 days ago", voice: "af_sarah" },
  { id: 3, title: "Introduction", project: "Dragons of the North", duration: "5:20", date: "1 week ago", voice: "am_adam" },
];

interface GeneratedAudio {
  prompt: string;
  voice: string;
  speed: number;
  audioUrl: string;
  audioData: string;
  timestamp: string;
}

export default function Audio() {
  const [showGeneratedAudio, setShowGeneratedAudio] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<GeneratedAudio | null>(null);
  const { user } = useAuth();
  
  const handleAudioGenerated = () => {
    setShowGeneratedAudio(true);
    // Get the latest generated audio from the global state
    const lastAudio = (window as any).lastGeneratedAudio;
    if (lastAudio) {
      setGeneratedAudio(lastAudio);
    }
  };
  
  const handleSaveAudio = () => {
    toast.success("Audio saved to your library");
  };
  
  const handleDownloadAudio = () => {
    if (generatedAudio?.audioUrl) {
      const link = document.createElement('a');
      link.href = generatedAudio.audioUrl;
      link.download = `audio-${Date.now()}.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Audio download started");
    } else {
      toast.error("No audio available for download");
    }
  };

  const getVoiceLabel = (voiceValue: string) => {
    return voiceValue;
  };
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Audio generation controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="bg-card rounded-lg border border-border p-6">
            <NewAudioForm 
              onAudioGenerated={handleAudioGenerated} 
              userId={user?.id || 'anonymous'}
            />
            
            {/* Generated audio preview */}
            {showGeneratedAudio && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 border-t border-border pt-6"
              >
                <h3 className="text-lg font-semibold mb-4">Generated Audio</h3>
                
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <CirclePlay size={24} className="text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Generated Audio</p>
                      <p className="text-sm text-muted-foreground">
                        Voice: {(() => {
                          const generatedAudio = (window as any).lastGeneratedAudio;
                          return generatedAudio ? getVoiceLabel(generatedAudio.voice) : "Unknown";
                        })()} • Speed: {(() => {
                          const generatedAudio = (window as any).lastGeneratedAudio;
                          return generatedAudio ? `${generatedAudio.speed}x` : "1x";
                        })()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-background border border-border rounded-md p-3 mb-4">
                    {generatedAudio && (generatedAudio.audioData || generatedAudio.audioUrl) ? (
                      <audio 
                        key={generatedAudio.timestamp}
                        controls 
                        className="w-full"
                        src={generatedAudio.audioData || generatedAudio.audioUrl}
                      >
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <div className="flex items-center gap-3">
                        <Button size="icon" variant="outline" className="h-8 w-8">
                          <Play size={16} />
                        </Button>
                        
                        <div className="w-full">
                          <Slider defaultValue={[0]} max={100} step={1} className="my-1" />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>0:00</span>
                            <span>--:--</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Volume2 size={16} className="text-muted-foreground" />
                          <Slider defaultValue={[80]} max={100} step={1} className="w-20" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 p-4 rounded-md bg-muted">
                    <p className="text-sm font-medium mb-1">Text:</p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {generatedAudio?.prompt || "No text available"}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 justify-end">
                  <Button variant="outline">
                    <Share2 size={16} className="mr-2" /> Share
                  </Button>
                  <Button variant="outline" onClick={handleDownloadAudio}>
                    <Download size={16} className="mr-2" /> Download
                  </Button>
                  <Button onClick={handleSaveAudio}>
                    <FileAudio size={16} className="mr-2" /> Save to Library
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Right side - Audio gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Your Audio Library</h3>
            
            <div className="space-y-4">
              {audioFiles.map((audio) => (
                <Collapsible key={audio.id} className="border border-border rounded-md overflow-hidden">
                  <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <FileAudio size={16} className="text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium line-clamp-1">{audio.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {audio.project} • {audio.duration} • {getVoiceLabel(audio.voice)}
                        </p>
                      </div>
                    </div>
                    <ChevronDown size={16} className="text-muted-foreground" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t border-border p-3 bg-muted/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Button size="icon" variant="outline" className="h-7 w-7">
                          <Play size={14} />
                        </Button>
                        <Slider defaultValue={[0]} max={100} step={1} className="w-full" />
                      </div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        <Button size="sm" variant="outline">
                          <Download size={14} className="mr-1" /> Download
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 size={14} className="mr-1" /> Share
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 size={14} className="mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowGeneratedAudio(false)}
              >
                <Plus size={16} className="mr-1" /> Create New Audio
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
