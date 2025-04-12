
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface MemeItem {
  id: number;
  imageUrl: string;
  prompt: string;
  createdAt: string;
}

const Gallery = () => {
  const navigate = useNavigate();
  const [memes, setMemes] = useState<MemeItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
      return;
    }

    // Get saved memes from localStorage
    const savedMemes = JSON.parse(localStorage.getItem("savedMemes") || "[]");
    setMemes(savedMemes);
    setIsLoading(false);
  }, [navigate]);

  const handleDelete = (id: number) => {
    const updatedMemes = memes.filter(meme => meme.id !== id);
    setMemes(updatedMemes);
    localStorage.setItem("savedMemes", JSON.stringify(updatedMemes));
    
    toast({
      title: "Meme deleted",
      description: "The meme has been removed from your gallery",
    });
  };

  const handleDownload = (meme: MemeItem) => {
    const a = document.createElement("a");
    a.href = meme.imageUrl;
    a.download = `meme-${meme.id}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Downloaded!",
      description: "Your meme has been saved to your device",
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-72 bg-muted rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-card rounded-lg shadow-md h-64 w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">My Meme Gallery</h1>
      
      {memes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">No memes yet</h3>
          <p className="text-muted-foreground mb-6">
            You haven't saved any memes to your gallery
          </p>
          <Button onClick={() => navigate("/")} className="meme-button">
            Create Your First Meme
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memes.map((meme) => (
            <Card key={meme.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={meme.imageUrl}
                  alt={`Meme ${meme.id}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <p className="text-sm line-clamp-2 mb-3">{meme.prompt}</p>
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(meme)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(meme.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
