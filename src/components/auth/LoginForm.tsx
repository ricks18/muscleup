import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/lib/auth";
import { Dumbbell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        await signUp(email, password);
        toast({
          title: "Verifique seu email",
          description:
            "Um link de confirmação foi enviado para seu email. Por favor, verifique sua caixa de entrada e spam.",
          duration: 10000,
        });
      } else {
        await signIn(email, password);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao autenticar");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary rounded-full p-4">
              <Dumbbell className="w-12 h-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">MuscleUP</h1>
          <p className="mt-2 text-muted-foreground">
            {isSignUp ? "Crie sua conta para começar" : "Entre para continuar"}
          </p>
        </div>

        <Card className="bg-background">
          <CardHeader>
            <CardTitle>{isSignUp ? "Criar Conta" : "Entrar"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full">
                {isSignUp ? "Criar Conta" : "Entrar"}
              </Button>
              <Button
                type="button"
                variant="link"
                className="w-full"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp
                  ? "Já tem uma conta? Entre"
                  : "Não tem uma conta? Crie uma"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
