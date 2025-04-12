
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const MemeGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [memeImage, setMemeImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

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
    try {
      // This is a placeholder for your API integration
      // Replace with your actual API endpoint
      const response = await simulateApiCall(prompt);
      setMemeImage(response.imageUrl);
      
      toast({
        title: "Meme generated!",
        description: "Your hilarious meme is ready to share",
      });
    } catch (error) {
      console.error("Error generating meme:", error);
      toast({
        title: "Generation failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // This is a placeholder function - replace with actual API call
  const simulateApiCall = (text: string) => {
    // This simulates an API response for demo purposes
    // Replace with your actual API integration
    return new Promise<{ imageUrl: string }>((resolve) => {
      setTimeout(() => {
        resolve({
          // Using a placeholder image for now
          imageUrl: `https://picsum.photos/seed/${Date.now()}/600/400`,
        });
      }, 1500);
    });
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
              <img 
                src={memeImage} 
                alt="Generated meme" 
                className="w-full h-auto object-contain"
              />
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
