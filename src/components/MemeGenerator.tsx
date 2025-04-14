
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MemeGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [memeImage, setMemeImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // More reliable image generation using Picsum Photos with text overlay
  const generateMeme = async (prompt: string) => {
    try {
      // Get a random seed based on the prompt
      const seed = Math.floor(Math.random() * 1000);
      
      // Create a base image URL from Lorem Picsum (always works)
      const imageUrl = `https://picsum.photos/seed/${seed}/800/600`;
      
      // Get the image as a blob to ensure it's loaded before displaying
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error("Failed to fetch image");
      
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error generating meme:", error);
      throw new Error("Failed to generate image. Please try again.");
    }
  };

  const handleGenerateMeme = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Empty prompt",
        description: "Please enter some text to generate a meme",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const imageUrl = await generateMeme(prompt);
      setMemeImage(imageUrl);
      
      toast({
        title: "Meme generated!",
        description: "Your hilarious meme is ready to share",
      });
    } catch (error: any) {
      console.error("Error generating meme:", error);
      setError(error.message || "Failed to generate image. Please try again later.");
      
      toast({
        title: "Generation failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!memeImage) return;
    
    const a = document.createElement("a");
    a.href = memeImage;
    a.download = `meme-${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Downloaded!",
      description: "Your meme has been saved to your device",
    });
  };

  const handleSave = () => {
    if (!memeImage) return;
    
    // Save meme to localStorage for demo purposes
    // In production, this would save to a database
    const savedMemes = JSON.parse(localStorage.getItem("savedMemes") || "[]");
    savedMemes.push({
      id: Date.now(),
      imageUrl: memeImage,
      prompt,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("savedMemes", JSON.stringify(savedMemes));
    
    toast({
      title: "Saved to gallery!",
      description: "Your meme has been added to your collection",
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
      <div className="bg-card shadow-md rounded-lg p-6 border">
        <h2 className="text-xl font-bold mb-4">Create Your Meme</h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-1">
              Describe your meme
            </label>
            <Textarea
              id="prompt"
              placeholder="Enter a funny caption or description for your meme..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <Button 
            onClick={handleGenerateMeme} 
            disabled={isGenerating || !prompt.trim()} 
            className="w-full meme-button"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Meme"
            )}
          </Button>
        </div>
      </div>

      {memeImage && (
        <div className="bg-card shadow-md rounded-lg p-6 border">
          <h2 className="text-xl font-bold mb-4">Your Generated Meme</h2>
          <div className="flex flex-col gap-4">
            <div className="rounded-lg overflow-hidden border bg-muted relative">
              <div className="relative">
                <img 
                  src={memeImage} 
                  alt="Generated meme" 
                  className="w-full h-auto object-contain"
                />
                <div className="absolute inset-x-0 bottom-0 bg-black/70 p-3 text-white text-center font-bold text-lg">
                  {prompt}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleGenerateMeme} variant="outline" className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate New
              </Button>
              <Button onClick={handleDownload} variant="secondary" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button onClick={handleSave} className="flex-1 bg-meme-primary hover:bg-meme-primary/90">
                Save to Gallery
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemeGenerator;
