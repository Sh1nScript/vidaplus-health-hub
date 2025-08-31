import { Heart, Bell, User, LogOut, CheckCircle2, Stethoscope, Clock, Shield, Edit3, Activity, Server, AlertTriangle, Settings, BarChart3, Users as UsersIcon } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface HeaderProps {
  userRole: 'patient' | 'doctor' | 'admin';
  userName: string;
}

export const Header = ({ userRole, userName }: HeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(() => {
    if (userRole === 'admin') {
      return [
        { id: 101, title: 'Alerta UTI', desc: 'Ocupação UTI 92%', read: false },
        { id: 102, title: 'Relatório Financeiro', desc: 'Mês fechado disponível', read: false },
        { id: 103, title: 'Atualização Estoque', desc: 'Reposição de ceftriaxona concluída', read: true },
      ];
    }
    return [
      { id: 1, title: 'Exame pronto', desc: 'Resultado de hemograma disponível', read: false },
      { id: 2, title: 'Nova teleconsulta', desc: 'João Silva agendou para 11:15', read: false },
      { id: 3, title: 'Alerta estoque', desc: 'Dipirona abaixo do mínimo', read: true },
    ];
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const toggleRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  const handleLogout = () => { logout(); navigate('/login'); };
  const getRoleDisplay = (role: string) => ({ patient: 'Paciente', doctor: 'Médico(a)', admin: 'Administrador' } as Record<string,string>)[role] || role;
  const initials = userName.split(/\s+/).filter(Boolean).map((p,i,arr)=> i===0 || i===arr.length-1 ? p[0] : '').join('').toUpperCase();
  const avatarSrc = userRole === 'admin' ? '/admin-avatar.svg' : (userRole === 'patient' && userName.toLowerCase().includes('lucas')) ? '/lucas-avatar.svg' : '/doctor-avatar.svg';
  const isLucasPatient = userRole === 'patient' && userName.toLowerCase().includes('lucas');
  const isAdmin = userRole === 'admin';

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Heart className="h-8 w-8 text-primary fill-primary" />
          <div>
            <h1 className="text-2xl font-bold text-primary">VidaPlus</h1>
            <p className="text-xs text-muted-foreground">Sistema de Gestão Hospitalar</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notificações */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive">
                  {unread}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 max-h-[70vh] overflow-auto">
            <div className="px-2 py-1.5 flex items-center justify-between">
              <p className="text-sm font-semibold">Notificações</p>
              <Button size="sm" variant="outline" onClick={markAllRead} disabled={unread===0}>Marcar lidas</Button>
            </div>
            <DropdownMenuSeparator />
            {notifications.length === 0 && (
              <div className="px-3 py-6 text-center text-sm text-muted-foreground">Sem notificações</div>
            )}
            {notifications.map(n => (
              <DropdownMenuItem key={n.id} className="flex items-start gap-2 py-2 cursor-pointer group" onClick={() => toggleRead(n.id)}>
                <div className={`mt-0.5 h-2 w-2 rounded-full ${n.read ? 'bg-muted' : 'bg-primary animate-pulse'}`}></div>
                <div className="flex-1">
                  <p className={`text-xs font-medium ${n.read ? 'text-muted-foreground' : ''}`}>{n.title}</p>
                  <p className={`text-[11px] leading-tight ${n.read ? 'text-muted-foreground/70' : 'text-foreground'}`}>{n.desc}</p>
                </div>
                {n.read && <CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
              </DropdownMenuItem>
            ))}
            {unread === 0 && notifications.length > 0 && (
              <div className="px-3 py-2 text-[11px] text-center text-muted-foreground border-t">Todas as notificações lidas</div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar / Menu usuário */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 px-2">
              <Avatar className="h-9 w-9 border border-border shadow-sm">
                <AvatarImage src={avatarSrc} alt={userName} className="object-cover" />
                <AvatarFallback className="text-xs font-medium bg-gradient-to-br from-primary/20 to-primary/40 text-primary-foreground/80">{initials}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium leading-tight">{userName}</p>
                <p className="text-[10px] text-muted-foreground leading-tight">{getRoleDisplay(userRole)}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); setProfileOpen(true); }}>
              <User className="mr-2 h-4 w-4" /> Meu Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Dialog Perfil */}
      <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
        <DialogContent className="max-w-2xl">
          {isAdmin ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Server className="h-5 w-5 text-primary" /> Perfil Administrador</DialogTitle>
                <DialogDescription>Visão administrativa e configurações de alto nível.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-56">
                  <Avatar className="h-24 w-24 border border-border shadow-md">
                    <AvatarImage src={avatarSrc} alt={userName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left space-y-1">
                    <p className="text-sm font-semibold">{userName}</p>
                    <p className="text-xs text-muted-foreground">ID: ADM-001</p>
                    <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">Ativo</span>
                      <span className="px-2 py-0.5 rounded-full bg-destructive/10 text-destructive text-[10px]">Root</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <Tabs defaultValue="info">
                    <TabsList className="mb-4 flex-wrap h-auto">
                      <TabsTrigger value="info">Info</TabsTrigger>
                      <TabsTrigger value="operacao">Operação</TabsTrigger>
                      <TabsTrigger value="seguranca">Segurança</TabsTrigger>
                      <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
                      <TabsTrigger value="config">Config</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="space-y-3 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Email</p><p>admin@vidaplus.com</p></div>
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Último Acesso</p><p>Hoje 08:02</p></div>
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Ambiente</p><p>Produção (fake)</p></div>
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Registros</p><p>Logs 24h: 12.450</p></div>
                      </div>
                      <div className="p-3 rounded-md border"><p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Resumo</p><p>Administrador responsável por governança de dados, compliance e supervisão operacional do ambiente hospitalar VidaPlus.</p></div>
                    </TabsContent>
                    <TabsContent value="operacao" className="space-y-3 text-xs">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Ocupação atual geral: 81% (UTI 92%)</li>
                        <li>Internações ativas: 205</li>
                        <li>Consultas hoje: 89 / Capacidade 120</li>
                        <li>Tempo médio de atendimento: 18min</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="seguranca" className="space-y-3 text-xs">
                      <ul className="list-disc list-inside space-y-1">
                        <li>2 tentativas de login falho (últimas 24h)</li>
                        <li>Criptografia de dados: Ativa</li>
                        <li>Backups: Último às 03:00</li>
                        <li>Integridade de logs: OK</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="relatorios" className="space-y-3 text-xs">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Financeiro: Prev receita R$ 2,5M (+15%)</li>
                        <li>Produtividade médica: 890 consultas mês</li>
                        <li>Reinternações 30d: 6%</li>
                        <li>Taxa de ocupação média: 82%</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="config" className="space-y-4 text-sm">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Settings className="h-3.5 w-3.5" /> Preferências (fakes)</div>
                      <form className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-xs" htmlFor="pref-audit">Auditoria detalhada</label>
                          <input id="pref-audit" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-xs" htmlFor="pref-alert">Alertas críticos em tempo real</label>
                          <input id="pref-alert" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-xs" htmlFor="pref-anon">Anonimizar dados exportados</label>
                          <input id="pref-anon" type="checkbox" className="h-4 w-4 accent-primary" />
                        </div>
                        <Button size="sm" type="button" className="mt-2">Salvar (Fake)</Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          ) : isLucasPatient ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-primary" /> Perfil do Paciente</DialogTitle>
                <DialogDescription>Dados simulados do paciente para visualização.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-56">
                  <Avatar className="h-24 w-24 border border-border shadow-md">
                    <AvatarImage src={avatarSrc} alt={userName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left space-y-1">
                    <p className="text-sm font-semibold">{userName}</p>
                    <p className="text-xs text-muted-foreground">ID Paciente: P-40932</p>
                    <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">Ativo</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground text-[10px]">Plano Ouro</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <Tabs defaultValue="info">
                    <TabsList className="mb-4 flex-wrap h-auto">
                      <TabsTrigger value="info">Info</TabsTrigger>
                      <TabsTrigger value="consultas">Consultas</TabsTrigger>
                      <TabsTrigger value="exames">Exames</TabsTrigger>
                      <TabsTrigger value="tele">Tele</TabsTrigger>
                      <TabsTrigger value="preferencias">Prefs</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="space-y-3 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Email</p><p>lucas.paciente@exemplo.com</p></div>
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Telefone</p><p>(11) 98888-1122</p></div>
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Nascimento</p><p>15/05/1994</p></div>
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Último Acesso</p><p>Hoje 09:05</p></div>
                      </div>
                      <div className="p-3 rounded-md border"><p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Notas Rápidas</p><p>Paciente relata melhora em quadro de cefaleia após ajuste de hidratação.</p></div>
                    </TabsContent>
                    <TabsContent value="consultas" className="space-y-2 text-xs">
                      <ul className="list-disc list-inside space-y-1">
                        <li>31/08 09:30 Tele – Dr. André (Concluída)</li>
                        <li>02/09 14:00 Tele – Dra. Ana (Agendada)</li>
                        <li>05/09 10:00 Presencial – Dr. Carlos (Agendada)</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="exames" className="space-y-2 text-xs">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Hemograma – Disponível 28/08</li>
                        <li>Vitamina D – Aguardando</li>
                        <li>Eletrocardiograma – Disponível 15/08</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="tele" className="space-y-2 text-xs">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Concluiu 3 teleconsultas este mês</li>
                        <li>Próxima em 02/09 14:00</li>
                        <li>Envio de sintomas registrado às 08:55 hoje</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="preferencias" className="space-y-4 text-sm">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Edit3 className="h-3.5 w-3.5" /> Preferências (fakes)</div>
                      <form className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-xs" htmlFor="pref-email-exame">Avisar por email exames prontos</label>
                          <input id="pref-email-exame" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-xs" htmlFor="pref-sms-consulta">Lembrar consultas por SMS</label>
                          <input id="pref-sms-consulta" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-xs" htmlFor="pref-dark-pt">Tema escuro</label>
                          <input id="pref-dark-pt" type="checkbox" className="h-4 w-4 accent-primary" />
                        </div>
                        <Button size="sm" type="button" className="mt-2">Salvar (Fake)</Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Stethoscope className="h-5 w-5 text-primary" /> Perfil Profissional</DialogTitle>
                <DialogDescription>Informações simuladas do médico para demonstração.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start gap-3 w-full md:w-56">
                  <Avatar className="h-24 w-24 border border-border shadow-md">
                    <AvatarImage src={avatarSrc} alt={userName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-center md:text-left space-y-1">
                    <p className="text-sm font-semibold">{userName}</p>
                    <p className="text-xs text-muted-foreground">CRM: 123456-SP</p>
                    <p className="text-xs text-muted-foreground">Especialidade: Clínica Geral</p>
                    <div className="flex flex-wrap gap-1 justify-center md:justify-start">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px]">Ativo</span>
                      <span className="px-2 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground text-[10px]">Plantão</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <Tabs defaultValue="info">
                    <TabsList className="mb-4 flex-wrap h-auto">
                      <TabsTrigger value="info">Info</TabsTrigger>
                      <TabsTrigger value="agenda">Agenda</TabsTrigger>
                      <TabsTrigger value="cert">Certificações</TabsTrigger>
                      <TabsTrigger value="atividade">Atividade</TabsTrigger>
                      <TabsTrigger value="config">Config</TabsTrigger>
                    </TabsList>
                    <TabsContent value="info" className="space-y-3 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Email</p><p>andre.silva@hospital.com</p></div>
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Telefone</p><p>(11) 99999-0000</p></div>
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Entrada</p><p>02/2021</p></div>
                        <div className="p-3 rounded-md border bg-muted/40"><p className="text-[11px] uppercase tracking-wide text-muted-foreground">Último Acesso</p><p>Hoje 08:12</p></div>
                      </div>
                      <div className="p-3 rounded-md border"><p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Bio</p><p>Médico clínico geral com foco em atenção primária, apaixonado por tecnologia na saúde e melhoria de processos assistenciais.</p></div>
                    </TabsContent>
                    <TabsContent value="agenda" className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" /> Próximos plantões</div>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>01/09 - 08h às 14h - Unidade Centro</li>
                        <li>03/09 - 14h às 20h - Unidade Zona Sul</li>
                        <li>05/09 - 08h às 20h - Plantão Extra</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="cert" className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Shield className="h-3.5 w-3.5" /> Certificações</div>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>ACLS - Atualizado 2025</li>
                        <li>BLS - Atualizado 2025</li>
                        <li>Atualização em Telemedicina - 2024</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="atividade" className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Activity className="h-3.5 w-3.5" /> Atividade Recente</div>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        <li>08:05 - Atualizou prontuário de Maria Souza</li>
                        <li>08:17 - Prescreveu exame de TSH para João</li>
                        <li>08:30 - Concluiu teleconsulta com Carlos</li>
                      </ul>
                    </TabsContent>
                    <TabsContent value="config" className="space-y-4 text-sm">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Edit3 className="h-3.5 w-3.5" /> Preferências (fakes)</div>
                      <form className="space-y-3">
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-xs" htmlFor="pref-estoque">Receber notificações de estoque</label>
                          <input id="pref-estoque" aria-label="Receber notificações de estoque" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-xs" htmlFor="pref-resumo">Resumo diário por email</label>
                          <input id="pref-resumo" aria-label="Resumo diário por email" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <label className="text-xs" htmlFor="pref-dark">Tema escuro automático</label>
                          <input id="pref-dark" aria-label="Tema escuro automático" type="checkbox" className="h-4 w-4 accent-primary" />
                        </div>
                        <Button size="sm" type="button" className="mt-2">Salvar (Fake)</Button>
                      </form>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </header>
  );
};