import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Heart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <Heart className="h-16 w-16 text-primary fill-primary" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-foreground mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-4">Página não encontrada</h2>
          <p className="text-muted-foreground mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        <Button asChild className="gap-2">
          <a href="/">
            <Home className="h-4 w-4" />
            Voltar ao VidaPlus
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
