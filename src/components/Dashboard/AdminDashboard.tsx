import {
  Users,
  Bed,
  DollarSign,
  TrendingUp,
  UserCheck,
  Calendar,
  FileBarChart,
  Settings,
  AlertCircle,
  Building2,
  Plus,
  Search,
  Filter,
  Stethoscope,
  Activity,
  Download,
  BarChart3,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

export const AdminDashboard = () => {
  const { toast } = useToast();
  const [bedsOpen, setBedsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [registrationsOpen, setRegistrationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [patients, setPatients] = useState([
    { id: 1, name: 'Maria Souza', age: 35, status: 'Internada', bed: '3A-12' },
    { id: 2, name: 'João Pereira', age: 62, status: 'Alta Hoje', bed: '2B-07' },
    { id: 3, name: 'Ana Lima', age: 28, status: 'Em Observação', bed: '1C-04' },
  ]);
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. André Silva', specialty: 'Clínico Geral' },
    { id: 2, name: 'Dra. Ana Souza', specialty: 'Cardiologia' },
    { id: 3, name: 'Dr. Carlos Santos', specialty: 'Ortopedia' },
  ]);
  const [newPatientName, setNewPatientName] = useState("");
  const [newDoctorName, setNewDoctorName] = useState("");
  const [editingPatientId, setEditingPatientId] = useState<number | null>(null);
  const [editingPatientName, setEditingPatientName] = useState("");
  const [editingDoctorId, setEditingDoctorId] = useState<number | null>(null);
  const [editingDoctorName, setEditingDoctorName] = useState("");
  const [addPatientOpen, setAddPatientOpen] = useState(false);
  const [addDoctorOpen, setAddDoctorOpen] = useState(false);
  const [deletionTarget, setDeletionTarget] = useState<null | { type: 'patient' | 'doctor'; id: number; name: string }>(null);
  const nextIdRef = useRef<number>(4); // inicia após os ids existentes
  const genId = () => nextIdRef.current++;

  const addPatient = () => {
    const name = newPatientName.trim();
    if(!name) return;
    setPatients(prev => [...prev, { id: genId(), name, age: 0, status: 'Novo', bed: '-' }]);
    setNewPatientName('');
  toast({ title: 'Paciente adicionado (fake)' });
  setAddPatientOpen(false);
  };

  const addDoctor = () => {
    const name = newDoctorName.trim();
    if(!name) return;
    setDoctors(prev => [...prev, { id: genId(), name, specialty: 'Geral' }]);
    setNewDoctorName('');
    toast({ title: 'Profissional adicionado (fake)' });
    setAddDoctorOpen(false);
  };
  const confirmDelete = () => {
    if(!deletionTarget) return;
    if(deletionTarget.type === 'patient') {
      setPatients(prev => prev.filter(p => p.id !== deletionTarget.id));
    } else {
      setDoctors(prev => prev.filter(d => d.id !== deletionTarget.id));
    }
    toast({ title: `${deletionTarget.type === 'patient' ? 'Paciente' : 'Profissional'} excluído (fake)` });
    setDeletionTarget(null);
  };
  const [admissions, setAdmissions] = useState([
    { id: 101, patient: 'Maria Souza', reason: 'Pneumonia', ward: 'A', bed: '12', since: '2025-08-28', status: 'Ativa' },
    { id: 102, patient: 'João Pereira', reason: 'AVC Isquêmico', ward: 'B', bed: '07', since: '2025-08-20', status: 'Alta Programada' },
    { id: 103, patient: 'Ana Lima', reason: 'Observação Pós-Operatório', ward: 'C', bed: '04', since: '2025-08-30', status: 'Ativa' },
  ]);
  const [reportType, setReportType] = useState('ocupacao');
  const [customNotes, setCustomNotes] = useState('');
  const hospitalStats = [
    { label: "Total de Leitos", value: "250", available: "45", icon: Bed },
    { label: "Pacientes Internados", value: "205", change: "+12", icon: Users },
    { label: "Consultas Hoje", value: "89", change: "+5", icon: Calendar },
    { label: "Receita Mensal", value: "R$ 2.5M", change: "+15%", icon: DollarSign }
  ];

  const departments = [
    { name: "UTI", beds: 20, occupied: 18, status: "critical" },
    { name: "Cardiologia", beds: 30, occupied: 25, status: "high" },
    { name: "Pediatria", beds: 25, occupied: 15, status: "normal" },
    { name: "Ortopedia", beds: 20, occupied: 12, status: "normal" }
  ];

  const alerts = [
    { id: 1, message: "Estoque baixo de medicamentos na UTI", priority: "high", time: "10 min atrás" },
    { id: 2, message: "Manutenção preventiva equipamento Raio-X", priority: "medium", time: "1h atrás" },
    { id: 3, message: "Novo protocolo de segurança aprovado", priority: "low", time: "2h atrás" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Painel Administrativo</h2>
        <p className="text-muted-foreground">Visão geral das operações hospitalares VidaPlus</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {hospitalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    {stat.available && (
                      <p className="text-sm text-secondary">
                        {stat.available} disponíveis
                      </p>
                    )}
                    {stat.change && (
                      <p className="text-sm text-secondary flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {stat.change}
                      </p>
                    )}
                  </div>
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ocupação por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Ocupação por Departamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {departments.map((dept, index) => {
              const occupancyRate = (dept.occupied / dept.beds) * 100;
              const widthBucket = Math.min(100, Math.max(0, Math.round(occupancyRate / 5) * 5));
              return (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{dept.name}</span>
                    <Badge 
                      variant={
                        dept.status === 'critical' ? 'destructive' :
                        dept.status === 'high' ? 'default' : 'secondary'
                      }
                    >
                      {dept.occupied}/{dept.beds} leitos
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full ${occupancyRate > 90 ? 'bg-destructive' : occupancyRate > 75 ? 'bg-warning' : 'bg-secondary'} w-[${widthBucket}%]`}
                      aria-label={`Ocupação ${occupancyRate.toFixed(0)}%`}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {occupancyRate.toFixed(0)}% de ocupação
                  </p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Alertas do Sistema */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" />
              Alertas do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-4 border border-border rounded-lg">
                <AlertCircle 
                  className={`h-5 w-5 mt-0.5 ${
                    alert.priority === 'high' ? 'text-destructive' :
                    alert.priority === 'medium' ? 'text-warning' : 'text-muted-foreground'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
                <Badge 
                  variant={
                    alert.priority === 'high' ? 'destructive' :
                    alert.priority === 'medium' ? 'default' : 'secondary'
                  }
                >
                  {alert.priority === 'high' ? 'Alta' : 
                   alert.priority === 'medium' ? 'Média' : 'Baixa'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Management Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Gestão Hospitalar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 relative flex flex-col items-center justify-center gap-1 group overflow-hidden" onClick={() => setRegistrationsOpen(true)}>
              <UserCheck className="h-6 w-6 transition-transform group-hover:scale-110" />
              <span className="font-medium">Cadastros</span>
              <span className="text-[10px] text-muted-foreground">Pac {patients.length} • Prof {doctors.length}</span>
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-primary/0 group-hover:ring-primary/40 transition" />
            </Button>
            <Button variant="secondary" className="h-20 flex flex-col gap-2" onClick={() => setBedsOpen(true)}>
              <Bed className="h-6 w-6" />
              <span>Internações</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setReportsOpen(true)}>
              <FileBarChart className="h-6 w-6" />
              <span>Relatórios</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => setSettingsOpen(true)}>
              <Settings className="h-6 w-6" />
              <span>Configurações</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Dialog Cadastros (com edição inline aprimorada) */}
      <Dialog open={registrationsOpen} onOpenChange={setRegistrationsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5 text-primary" /> Gerenciar Cadastros</DialogTitle>
            <DialogDescription>Pacientes e profissionais - dados simulados.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pacientes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-1"><Users className="h-4 w-4 text-primary" /> Pacientes</h4>
                <Button size="sm" variant="outline" onClick={()=>{ setNewPatientName(''); setAddPatientOpen(true); }} className="gap-1"><Plus className="h-3 w-3" /> Novo</Button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {patients.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic">Nenhum paciente cadastrado.</p>
                )}
                {patients.map(p => (
                  <div key={p.id} className="p-3 border rounded-md text-xs flex justify-between items-start gap-3 bg-background/60">
                    <div className="flex-1">
                      {editingPatientId === p.id ? (
                        <div className="space-y-1">
                          <Input value={editingPatientName} onChange={e=>setEditingPatientName(e.target.value)} className="h-7 text-xs" autoFocus />
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" className="h-7 px-2 text-[11px]" onClick={()=>{
                              if(!editingPatientName.trim()) { toast({ title: 'Nome inválido' }); return; }
                              setPatients(prev=> prev.map(x=> x.id===p.id ? { ...x, name: editingPatientName.trim() } : x));
                              setEditingPatientId(null); setEditingPatientName('');
                              toast({ title: 'Paciente atualizado (fake)' });
                            }}>Salvar</Button>
                            <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={()=>{ setEditingPatientId(null); setEditingPatientName(''); }}>Cancelar</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-sm leading-tight">{p.name}</p>
                          <p className="text-muted-foreground">{p.status}</p>
                        </>
                      )}
                    </div>
                    {editingPatientId !== p.id && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={()=>{ setEditingPatientId(p.id); setEditingPatientName(p.name); }}>Editar</Button>
                        <Button size="sm" variant="destructive" className="h-7 px-2 text-[11px]" title="Excluir paciente" onClick={()=> setDeletionTarget({ type: 'patient', id: p.id, name: p.name })}>
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Médicos */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-sm flex items-center gap-1"><Stethoscope className="h-4 w-4 text-primary" /> Profissionais</h4>
                <Button size="sm" variant="outline" onClick={()=>{ setNewDoctorName(''); setAddDoctorOpen(true); }} className="gap-1"><Plus className="h-3 w-3" /> Novo</Button>
              </div>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {doctors.length === 0 && (
                  <p className="text-[11px] text-muted-foreground italic">Nenhum profissional cadastrado.</p>
                )}
                {doctors.map(d => (
                  <div key={d.id} className="p-3 border rounded-md text-xs flex justify-between items-start gap-3 bg-background/60">
                    <div className="flex-1">
                      {editingDoctorId === d.id ? (
                        <div className="space-y-1">
                          <Input value={editingDoctorName} onChange={e=>setEditingDoctorName(e.target.value)} className="h-7 text-xs" autoFocus />
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" className="h-7 px-2 text-[11px]" onClick={()=>{
                              if(!editingDoctorName.trim()) { toast({ title: 'Nome inválido' }); return; }
                              setDoctors(prev=> prev.map(x=> x.id===d.id ? { ...x, name: editingDoctorName.trim() } : x));
                              setEditingDoctorId(null); setEditingDoctorName('');
                              toast({ title: 'Profissional atualizado (fake)' });
                            }}>Salvar</Button>
                            <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={()=>{ setEditingDoctorId(null); setEditingDoctorName(''); }}>Cancelar</Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-sm leading-tight">{d.name}</p>
                          <p className="text-muted-foreground">{d.specialty}</p>
                        </>
                      )}
                    </div>
                    {editingDoctorId !== d.id && (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 px-2 text-[11px]" onClick={()=>{ setEditingDoctorId(d.id); setEditingDoctorName(d.name); }}>Editar</Button>
                        <Button size="sm" variant="destructive" className="h-7 px-2 text-[11px]" title="Excluir profissional" onClick={()=> setDeletionTarget({ type: 'doctor', id: d.id, name: d.name })}>
                          <Trash2 className="h-3 w-3" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog Adicionar Paciente */}
      <Dialog open={addPatientOpen} onOpenChange={setAddPatientOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Novo Paciente</DialogTitle>
            <DialogDescription>Cadastro rápido (simulado).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <Input placeholder="Nome completo" value={newPatientName} onChange={e=>setNewPatientName(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); addPatient(); } }} />
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={()=> setAddPatientOpen(false)}>Cancelar</Button>
              <Button size="sm" disabled={!newPatientName.trim()} onClick={addPatient}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* Dialog Adicionar Profissional */}
      <Dialog open={addDoctorOpen} onOpenChange={setAddDoctorOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Novo Profissional</DialogTitle>
            <DialogDescription>Cadastro rápido (simulado).</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <Input placeholder="Nome completo" value={newDoctorName} onChange={e=>setNewDoctorName(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); addDoctor(); } }} />
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={()=> setAddDoctorOpen(false)}>Cancelar</Button>
              <Button size="sm" disabled={!newDoctorName.trim()} onClick={addDoctor}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* AlertDialog confirmação exclusão */}
      <AlertDialog open={!!deletionTarget} onOpenChange={(open)=>{ if(!open) setDeletionTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {deletionTarget?.type === 'patient' ? 'o paciente' : 'o profissional'} <span className="font-medium">{deletionTarget?.name}</span>? A ação é apenas simulada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog Internações */}
      <Dialog open={bedsOpen} onOpenChange={setBedsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Bed className="h-5 w-5 text-primary" /> Fluxo de Internações</DialogTitle>
            <DialogDescription>Controle de internações ativas e programadas.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar paciente" className="h-8 w-48" />
              <Filter className="h-4 w-4 text-muted-foreground ml-2" />
              <select aria-label="Filtrar status internação" className="text-xs h-8 border rounded-md px-2 bg-background">
                <option>Todos</option>
                <option>Ativa</option>
                <option>Alta Programada</option>
              </select>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {admissions.map(a => (
                <div key={a.id} className="p-3 border rounded-md bg-background/60 text-xs space-y-1">
                  <div className="flex justify-between items-start gap-3">
                    <div>
                      <p className="font-medium text-sm leading-tight">{a.patient}</p>
                      <p className="text-muted-foreground">{a.reason}</p>
                    </div>
                    <Badge variant={a.status === 'Ativa' ? 'default' : 'secondary'}>{a.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span>Ala {a.ward}</span>
                    <span>Leito {a.bed}</span>
                    <span>Desde {a.since}</span>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={()=>toast({ title: 'Atualizar (fake)' })}>Atualizar</Button>
                    <Button size="sm" variant="secondary" onClick={()=>toast({ title: 'Liberar leito (fake)' })}>Alta</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Relatórios */}
      <Dialog open={reportsOpen} onOpenChange={setReportsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileBarChart className="h-5 w-5 text-primary" /> Relatórios Gerenciais</DialogTitle>
            <DialogDescription>Gerar relatórios simulados de operação.</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-3 text-xs">
              <div className="space-y-1 sm:col-span-1">
                <label className="text-[11px] font-medium">Tipo</label>
                <select aria-label="Tipo de relatório" value={reportType} onChange={e=>setReportType(e.target.value)} className="w-full border rounded-md h-9 bg-background px-2">
                  <option value="ocupacao">Ocupação de Leitos</option>
                  <option value="internacoes">Internações</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="produtividade">Produtividade Médica</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium">Data Inicial</label>
                <Input type="date" className="h-9" />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium">Data Final</label>
                <Input type="date" className="h-9" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium">Notas / Observações</label>
              <Textarea value={customNotes} onChange={e=>setCustomNotes(e.target.value)} placeholder="Observações adicionais..." className="min-h-[80px]" />
            </div>
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="outline" onClick={()=>toast({ title: 'Gerar (fake)', description: 'Simulando relatório...' })} className="gap-1"><BarChart3 className="h-4 w-4" /> Gerar</Button>
              <Button size="sm" onClick={()=>toast({ title: 'Download (fake)' })} className="gap-1"><Download className="h-4 w-4" /> Exportar PDF</Button>
            </div>
            <div className="border rounded-md p-4 bg-muted/40 text-xs space-y-2">
              <p className="font-medium flex items-center gap-2 text-sm"><Activity className="h-4 w-4 text-primary" /> Pré-visualização</p>
              {reportType === 'ocupacao' && <p>Taxa média de ocupação no período: 82% (pico 93%).</p>}
              {reportType === 'internacoes' && <p>Total de internações: 134. Média de permanência: 4,2 dias.</p>}
              {reportType === 'financeiro' && <p>Receita estimada: R$ 2,5M. Crescimento de 11% vs período anterior.</p>}
              {reportType === 'produtividade' && <p>Consultas médicas realizadas: 890. Média por médico: 52 no período.</p>}
              {customNotes && <p className="italic text-muted-foreground">Notas: {customNotes}</p>}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Configurações */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Settings className="h-5 w-5 text-primary" /> Configurações do Sistema</DialogTitle>
            <DialogDescription>Preferências gerais e parâmetros simulados da plataforma.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-8 text-sm">
            <div className="space-y-5">
              <div>
                <h5 className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted-foreground">Geral</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cfg-dark" className="text-xs">Tema escuro automático</label>
                    <input id="cfg-dark" type="checkbox" className="h-4 w-4 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cfg-metrics" className="text-xs">Coletar métricas anônimas</label>
                    <input id="cfg-metrics" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cfg-labs" className="text-xs">Recursos experimentais</label>
                    <input id="cfg-labs" type="checkbox" className="h-4 w-4 accent-primary" />
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted-foreground">Alertas</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cfg-critical" className="text-xs">Alertas críticos em tempo real</label>
                    <input id="cfg-critical" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cfg-email-digest" className="text-xs">Resumo diário por email</label>
                    <input id="cfg-email-digest" type="checkbox" className="h-4 w-4 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cfg-sms" className="text-xs">SMS em falhas críticas</label>
                    <input id="cfg-sms" type="checkbox" className="h-4 w-4 accent-primary" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-5">
              <div>
                <h5 className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted-foreground">Segurança</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cfg-2fa" className="text-xs">Exigir 2FA administradores</label>
                    <input id="cfg-2fa" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cfg-audit" className="text-xs">Auditoria detalhada</label>
                    <input id="cfg-audit" type="checkbox" defaultChecked className="h-4 w-4 accent-primary" />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <label htmlFor="cfg-anon" className="text-xs">Anonimizar exportações</label>
                    <input id="cfg-anon" type="checkbox" className="h-4 w-4 accent-primary" />
                  </div>
                </div>
              </div>
              <div>
                <h5 className="font-semibold mb-2 text-xs uppercase tracking-wide text-muted-foreground">Sistema</h5>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs">Versão</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-muted">1.0.0 (fake)</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs">Status backups</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-green-500/10 text-green-600">OK</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs">Uso de recursos</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-600">Moderado</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button size="sm" variant="outline" onClick={()=> setSettingsOpen(false)}>Fechar</Button>
            <Button size="sm" onClick={()=>{ toast({ title: 'Configurações salvas (fake)' }); setSettingsOpen(false); }}>Salvar (Fake)</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};