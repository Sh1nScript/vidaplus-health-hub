import { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, Loader2, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState(""); // email ou usuário
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simula chamada ao backend
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    toast({
      title: "Instruções enviadas",
      description: "Se o identificador existir, um e-mail foi enviado.",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft to-secondary-soft flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="h-14 w-14 text-primary fill-primary" />
          </div>
          <h1 className="text-3xl font-bold text-primary">Recuperar Acesso</h1>
          <p className="text-muted-foreground mt-2">Redefina sua senha do sistema VidaPlus</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-xl text-center">Esqueceu sua senha</CardTitle>
            <p className="text-sm text-muted-foreground text-center">
              Informe seu e-mail ou nome de usuário para receber instruções
            </p>
          </CardHeader>
          <CardContent>
            {sent ? (
              <div className="space-y-6">
                <Alert>
                  <AlertDescription>
                    Se existir uma conta para <span className="font-medium">{identifier}</span>,
                    você receberá um e-mail com instruções para redefinir a senha.
                  </AlertDescription>
                </Alert>
                <Button asChild className="w-full">
                  <Link to="/login">Voltar ao Login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="identifier">E-mail ou Usuário</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="identifier"
                      placeholder="ex: maria@hospital.com ou usuario"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Enviar instruções
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/login" className="flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Voltar</Link>
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>VidaPlus © 2024</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
