
import { useEffect } from "react";
import MemeGenerator from "@/components/MemeGenerator";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {isLoggedIn ? (
          <>
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold mb-3">AI Meme Generator</h1>
              <p className="text-lg text-muted-foreground">
                Turn your ideas into hilarious memes with the power of AI
              </p>
            </div>
            <MemeGenerator />
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16">
            <h1 className="text-5xl font-bold mb-4 animate-bounce-slow">AI Meme Generator</h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
              The easiest way to create hilarious, share-worthy memes using artificial intelligence.
              Login or sign up to start generating your own memes instantly!
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md">
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="w-full meme-button" size="lg">
                  Sign Up
                </Button>
              </Link>
            </div>

            <div className="mt-16 bg-card p-6 rounded-lg shadow-md border w-full max-w-2xl">
              <h2 className="text-2xl font-bold mb-3">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                    <span className="text-primary font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-medium mb-2">Enter Your Text</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Describe the meme you want to create
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                    <span className="text-secondary font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-medium mb-2">Generate</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Our AI creates a unique meme
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                    <span className="text-accent font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-medium mb-2">Share & Enjoy</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Download, save, or share your meme
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
