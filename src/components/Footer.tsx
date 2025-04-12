
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full py-6 bg-muted mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} MemeAI Generator. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
