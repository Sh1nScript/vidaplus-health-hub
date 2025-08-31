import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Heart, User, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

// Simulação de usuários para demo
const demoUsers = {
  "medicoandre": {
    password: "andre3412",
    role: "doctor" as const,
    name: "Dr. André Silva"
  },
  "pacientelucas": {
    password: "lucas3412", 
    role: "patient" as const,
    name: "Lucas Santos"
  },
  "admin": {
    password: "admin3412",
    role: "admin" as const,
    name: "Administrador"
  }
};

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simular delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = demoUsers[username as keyof typeof demoUsers];
    
    if (user && user.password === password) {
      // Salvar usuário no localStorage (em produção seria JWT/session)
      localStorage.setItem("vidaplus_user", JSON.stringify({
        username,
        role: user.role,
        name: user.name
      }));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo(a), ${user.name}`,
      });
      
      navigate("/");
    } else {
      setError("Usuário ou senha incorretos");
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: "Verifique suas credenciais e tente novamente.",
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft to-secondary-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="h-16 w-16 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary">VidaPlus</h1>
          <p className="text-muted-foreground mt-2">Sistema de Gestão Hospitalar</p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">Fazer Login</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Entre com suas credenciais para acessar o sistema
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Usuário</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Digite seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
              <div className="flex justify-between items-center text-sm">
                <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                  Esqueceu sua senha?
                </Link>
                <Link to="/register" className="text-primary hover:underline font-medium">
                  Cadastrar
                </Link>
              </div>
            </form>

            {/* Credenciais Demo */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
                Credenciais de Demonstração:
              </p>
              <div className="space-y-2 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium text-secondary">👨‍⚕️ Médico:</p>
                  <p className="text-muted-foreground">usuário: <span className="font-mono">medicoandre</span></p>
                  <p className="text-muted-foreground">senha: <span className="font-mono">andre3412</span></p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium text-primary">👤 Paciente:</p>
                  <p className="text-muted-foreground">usuário: <span className="font-mono">pacientelucas</span></p>
                  <p className="text-muted-foreground">senha: <span className="font-mono">lucas3412</span></p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="font-medium text-foreground">🛠️ Admin:</p>
                  <p className="text-muted-foreground">usuário: <span className="font-mono">admin</span></p>
                  <p className="text-muted-foreground">senha: <span className="font-mono">admin3412</span></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>VidaPlus © 2024 - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default Login;