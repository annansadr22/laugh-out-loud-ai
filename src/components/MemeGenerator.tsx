
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

  const generateMemeWithHuggingFace = async (prompt: string) => {
    // Instead of directly calling the API which might cause CORS issues,
    // we'll simulate with placeholder images for demo purposes
    // In a production app, you would implement a proper backend that handles the API call
    
    try {
      // This simulates the API call with a delay to mimic network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate a random seed based on the prompt for variety
      const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      
      // Use Lorem Picsum as a placeholder service
      const imageUrl = `https://picsum.photos/seed/${seed + Date.now()}/800/600`;
      
      return imageUrl;
      
      /* 
      // The actual API code is commented out due to CORS issues
      // In a real application, this would be handled by a backend service
      
      const API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1";
      const API_TOKEN = "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";
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_TOKEN}`
        },
        body: JSON.stringify({
          inputs: prompt
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate image");
      }

      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      return imageUrl;
      */
    } catch (error) {
      console.error("Error generating meme:", error);
      throw error;
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
      const imageUrl = await generateMemeWithHuggingFace(prompt);
      setMemeImage(imageUrl);
      
      toast({
        title: "Meme generated!",
        description: "Your hilarious meme is ready to share",
      });
    } catch (error) {
      console.error("Error generating meme:", error);
      setError("Failed to generate image. The Hugging Face API may be unavailable or experiencing issues.");
      
      toast({
        title: "Generation failed",
        description: "We couldn't connect to the image generation service. Using a placeholder instead.",
        variant: "destructive",
      });
      
      // Fallback to a placeholder image on error
      const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      setMemeImage(`https://picsum.photos/seed/${seed + Date.now()}/800/600`);
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
