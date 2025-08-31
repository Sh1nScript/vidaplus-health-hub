import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, User, Lock, Mail, Phone, UserPlus, Eye, EyeOff, Shield, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

// Tela de cadastro fake (não persiste dados reais)
const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState<'patient' | 'doctor'>('patient');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !email.trim() || !username.trim()) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não conferem');
      return;
    }
    if (password.length < 6) {
      setError('Senha deve ter ao menos 6 caracteres');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    // Simula criação de usuário e login automático
    localStorage.setItem('vidaplus_user', JSON.stringify({
      username,
      role,
      name: name || (role === 'doctor' ? 'Novo Médico' : 'Novo Paciente')
    }));
    toast({ title: 'Cadastro concluído!', description: 'Bem-vindo(a) ao VidaPlus (fake).' });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-soft to-secondary-soft flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="h-16 w-16 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl font-bold text-primary">VidaPlus</h1>
          <p className="text-muted-foreground mt-2">Cadastro de Acesso</p>
        </div>
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center flex items-center gap-2 justify-center"><UserPlus className="h-5 w-5" /> Criar Conta</CardTitle>
            <p className="text-sm text-muted-foreground text-center">Preencha os dados para criar sua conta (simulação)</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>
              )}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="role">Tipo de Conta</Label>
                  <div className="flex gap-2">
                    <Button type="button" variant={role==='patient' ? 'secondary' : 'outline'} className="flex-1" onClick={()=>setRole('patient')}>Paciente</Button>
                    <Button type="button" variant={role==='doctor' ? 'secondary' : 'outline'} className="flex-1" onClick={()=>setRole('doctor')}>Médico</Button>
                  </div>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Ex: Maria Souza" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="voce@exemplo.com" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="phone" value={phone} onChange={e=>setPhone(e.target.value)} placeholder="(11) 99999-0000" className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Usuário</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="username" value={username} onChange={e=>setUsername(e.target.value)} placeholder="login" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={e=>setPassword(e.target.value)} placeholder="mínimo 6 caracteres" className="pl-10 pr-10" required />
                    <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={()=>setShowPassword(p=>!p)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} placeholder="repita a senha" className="pl-10" required />
                  </div>
                </div>
                {role==='doctor' && (
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="crm">CRM (fake)</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input id="crm" placeholder="Ex: 123456-SP" className="pl-10" />
                    </div>
                    <div className="mt-2 relative">
                      <Stethoscope className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Especialidade (Ex: Clínica Geral)" className="pl-10" />
                    </div>
                  </div>
                )}
              </div>
              <Button type="submit" disabled={loading} className="w-full">{loading ? 'Cadastrando...' : 'Cadastrar'}</Button>
              <p className="text-center text-sm text-muted-foreground">Já possui conta? <Link to="/login" className="text-primary font-medium hover:underline">Entrar</Link></p>
            </form>
          </CardContent>
        </Card>
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>VidaPlus © 2024 - Cadastro Fake</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
