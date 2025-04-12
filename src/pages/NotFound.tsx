
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
        <div className="w-full h-1 meme-gradient rounded-full mb-6"></div>
        <p className="text-xl font-medium mb-4">Oops! Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </p>
        <Link to="/">
          <Button className="meme-button">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
