
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <nav className="w-full bg-white shadow-sm py-4 dark:bg-card">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-2xl text-transparent bg-clip-text meme-gradient">MemeAI</span>
        </Link>
        
        <div className="flex gap-4 items-center">
          {isLoggedIn ? (
            <>
              <Link to="/">
                <Button variant="ghost">Generate</Button>
              </Link>
              <Link to="/gallery">
                <Button variant="ghost">My Memes</Button>
              </Link>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="default" className="bg-meme-primary hover:bg-meme-primary/90">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
