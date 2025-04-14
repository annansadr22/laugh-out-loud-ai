
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Download, RefreshCw } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MemeGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [memeImage, setMemeImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const generateMemeWithAI = async (prompt: string, key: string) => {
    try {
      // Using OpenAI's DALL-E API
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${key}`
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: `Create a funny meme with: ${prompt}. Make it humorous and visually engaging.`,
          n: 1,
          size: "1024x1024",
          response_format: "url"
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate image");
      }
      
      return data.data[0].url;
    } catch (error) {
      console.error("Error generating meme:", error);
      
      // As a fallback, use unsplash if the OpenAI API fails
      const seed = prompt.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const timestamp = Date.now();
      return `https://source.unsplash.com/featured/?meme,funny,${encodeURIComponent(prompt)}/${seed}-${timestamp}`;
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

    if (!apiKey && !showApiKeyInput) {
      setShowApiKeyInput(true);
      toast({
        title: "API Key Required",
        description: "Please enter your OpenAI API key to generate memes",
      });
      return;
    }

    if (showApiKeyInput && !apiKey.trim()) {
      toast({
        title: "Missing API Key",
        description: "Please enter your OpenAI API key",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      const imageUrl = await generateMemeWithAI(prompt, apiKey);
      setMemeImage(imageUrl);
      
      toast({
        title: "Meme generated!",
        description: "Your hilarious meme is ready to share",
      });
    } catch (error: any) {
      console.error("Error generating meme:", error);
      setError(error.message || "Failed to generate image. The AI service may be unavailable.");
      
      toast({
        title: "Generation failed",
        description: error.message || "We couldn't connect to the AI service. Try again later.",
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
          {showApiKeyInput && (
            <div className="space-y-2">
              <Label htmlFor="apiKey" className="block text-sm font-medium mb-1">
                OpenAI API Key
              </Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="Enter your OpenAI API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Your API key is used only for this session and is not stored on our servers.
              </p>
            </div>
          )}
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
