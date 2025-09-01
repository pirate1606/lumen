import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "@/components/lumen/Navbar";
import Footer from "@/components/lumen/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="grid place-items-center py-40">
        <div className="text-center card p-8">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-lg text-muted-foreground mb-4">Oops! Page not found</p>
          <a href="/" className="btn-cta">Return to Home</a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
