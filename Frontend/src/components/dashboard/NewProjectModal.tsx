
import { useState } from "react";
import { PlusCircle, BookOpen, Image, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface NewProjectModalProps {
  onProjectCreated?: (project: { title: string; description: string; type: string }) => void;
}

export default function NewProjectModal({ onProjectCreated }: NewProjectModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("story");
  const [open, setOpen] = useState(false);

  const handleCreateProject = () => {
    if (!title.trim()) {
      toast.error("Please enter a project title");
      return;
    }
    
    const newProject = {
      title,
      description,
      type: projectType
    };
    
    if (onProjectCreated) {
      onProjectCreated(newProject);
    }
    
    toast.success("New project created successfully!");
    setTitle("");
    setDescription("");
    setProjectType("story");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-[220px] w-full flex flex-col items-center justify-center gap-4 border-2 border-dashed">
          <PlusCircle size={40} className="text-muted-foreground" />
          <div className="text-lg font-medium">Create New Project</div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Add the details for your new creative project.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Project Title</Label>
            <Input
              id="title"
              placeholder="Enter a title for your project"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what your project is about"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label>Project Type</Label>
            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant={projectType === "story" ? "default" : "outline"}
                className="flex gap-2"
                onClick={() => setProjectType("story")}
              >
                <BookOpen size={16} />
                <span>Story</span>
              </Button>
              <Button
                type="button"
                variant={projectType === "image-collection" ? "default" : "outline"}
                className="flex gap-2"
                onClick={() => setProjectType("image-collection")}
              >
                <Image size={16} />
                <span>Image Collection</span>
              </Button>
              <Button
                type="button"
                variant={projectType === "summary" ? "default" : "outline"}
                className="flex gap-2"
                onClick={() => setProjectType("summary")}
              >
                <FileText size={16} />
                <span>Summary</span>
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateProject}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
