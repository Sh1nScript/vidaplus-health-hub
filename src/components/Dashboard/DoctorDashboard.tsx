import { Calendar, Users, Clock, FileText, Stethoscope, Activity, PlusCircle, CheckCircle2, Undo2, UserPlus, Pill, X, Video, XCircle, RotateCcw, Hourglass } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export const DoctorDashboard = () => {
  const { toast } = useToast();

  type Appointment = { id: number; patient: string; time: string; type: string; status: 'confirmado' | 'pendente' | 'cancelado' };
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      patient: "Maria Santos",
      time: "09:00",
      type: "Consulta de Rotina",
      status: "confirmado"
    },
    {
      id: 2,
      patient: "João Silva",
      time: "10:30",
      type: "Telemedicina",
      status: "pendente"
    },
    {
      id: 3,
      patient: "Ana Costa",
      time: "14:00",
      type: "Retorno",
      status: "confirmado"
    }
  ]);

  const initialTasks = [
    { id: 1, task: "Revisar exame de Maria Santos", priority: "alta", due: "Hoje", completed: false },
    { id: 2, task: "Prescrição digital para João Silva", priority: "média", due: "Amanhã", completed: false },
    { id: 3, task: "Relatório médico - Ana Costa", priority: "baixa", due: "Esta semana", completed: false }
  ];

  const [tasks, setTasks] = useState(initialTasks);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientAge, setNewPatientAge] = useState("");
  const [newPatientReason, setNewPatientReason] = useState("");
  const [patientSubmitting, setPatientSubmitting] = useState(false);
  const [newTaskPriority, setNewTaskPriority] = useState("média");
  const [newTaskDue, setNewTaskDue] = useState("Hoje");
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [showPrescriptionBox, setShowPrescriptionBox] = useState(false);
  const [manualMed, setManualMed] = useState("");
  const [manualDose, setManualDose] = useState("");
  const [manualFreq, setManualFreq] = useState("");
  const [manualDur, setManualDur] = useState("");
  const [prescribing, setPrescribing] = useState(false);
  const [patients, setPatients] = useState<string[]>(["Maria Santos", "João Silva", "Ana Costa"]);
  const [selectedPrescriptionPatient, setSelectedPrescriptionPatient] = useState("");
  // Telemedicina
  const [telePatients, setTelePatients] = useState(
    [
      { id: 101, patient: "Maria Santos", time: "10:30", status: "agendado" as const },
      { id: 102, patient: "João Silva", time: "11:15", status: "agendado" as const },
      { id: 103, patient: "Ana Costa", time: "15:00", status: "agendado" as const }
    ]
  );
  const [showTeleDialog, setShowTeleDialog] = useState(false);
  const [teleSelectedPatient, setTeleSelectedPatient] = useState("");
  const [teleSymptoms, setTeleSymptoms] = useState("");
  const [teleDate, setTeleDate] = useState<string>("");
  const [telePrescription, setTelePrescription] = useState("");
  const [teleSubmitting, setTeleSubmitting] = useState(false);
  const [newTelePatientExisting, setNewTelePatientExisting] = useState("");
  const [newTelePatientName, setNewTelePatientName] = useState("");
  const [newTelePatientTime, setNewTelePatientTime] = useState("");
  const formRef = useRef<HTMLDivElement | null>(null);

  // Scroll suave quando abrir o formulário
  useEffect(() => {
    if (showNewPatientForm && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showNewPatientForm]);

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const toggleTask = (id: number) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;
    setPatientSubmitting(true);
    await new Promise(r => setTimeout(r, 600)); // simula processamento
    const id = Date.now();
    // adiciona tarefa relacionada ao novo paciente
    setTasks(prev => [
      { id, task: `Avaliação inicial do paciente ${newPatientName}`, priority: newTaskPriority, due: newTaskDue, completed: false },
      ...prev
    ]);
    toast({
      title: "Paciente adicionado",
      description: `${newPatientName} criado e tarefa associada adicionada.`,
    });
    setNewPatientName("");
    setNewPatientAge("");
    setNewPatientReason("");
    setNewTaskPriority("média");
    setNewTaskDue("Hoje");
    setPatientSubmitting(false);
    setShowNewPatientForm(false);
  // adiciona paciente na lista de seleção se ainda não existir
  setPatients(prev => prev.includes(newPatientName) ? prev : [...prev, newPatientName]);
  };

  const predefinedPrescriptions = [
    { id: 'rx1', drug: 'Amoxicilina 500mg', dosage: '1 cáps 8/8h', duration: '7 dias', notes: 'Ingerir após alimento' },
    { id: 'rx2', drug: 'Dipirona 1g', dosage: '1 cp se dor ou febre', duration: 'Máx 4x/dia', notes: 'Suspender se alergia' },
    { id: 'rx3', drug: 'Losartana 50mg', dosage: '1 cp manhã', duration: 'Uso contínuo', notes: 'Monitorar PA semanal' },
  ];

  const prescribePredefined = (p: typeof predefinedPrescriptions[number]) => {
    if (!selectedPrescriptionPatient) {
      toast({
        title: 'Selecione um paciente',
        variant: 'destructive',
        description: 'Escolha o paciente antes de prescrever.'
      });
      return;
    }
    toast({
      title: 'Prescrição emitida',
      description: `${p.drug} - ${p.dosage} para ${selectedPrescriptionPatient}`
    });
  };

  const concludeTelePatient = (id: number) => {
    const found = telePatients.find(p => p.id === id);
    setTelePatients(prev => prev.filter(p => p.id !== id));
    if (found) {
      toast({ title: "Consulta concluída", description: `Teleconsulta com ${found.patient} finalizada.` });
    }
  };

  const cancelTelePatient = (id: number) => {
    const found = telePatients.find(p => p.id === id);
    setTelePatients(prev => prev.filter(p => p.id !== id));
    if (found) {
      toast({ title: "Consulta desagendada", variant: 'destructive', description: `${found.patient} removido da telemedicina de hoje.` });
    }
  };

  const submitTeleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teleSelectedPatient) {
      toast({ title: 'Selecione um paciente', variant: 'destructive', description: 'Escolha o paciente para registrar a consulta.' });
      return;
    }
    setTeleSubmitting(true);
    await new Promise(r => setTimeout(r, 700));
    toast({
      title: 'Registro salvo',
      description: `Teleconsulta de ${teleSelectedPatient} registrada.`
    });
    // Remover paciente da lista de telemedicina após concluir
    setTelePatients(prev => prev.filter(p => p.patient !== teleSelectedPatient));
    // limpar campos
    setTeleSelectedPatient("");
    setTeleSymptoms("");
    setTeleDate("");
    setTelePrescription("");
    setTeleSubmitting(false);
    setShowTeleDialog(false);
  };

  const cancelAppointment = (id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelado' } : a));
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      toast({ title: 'Consulta cancelada', variant: 'destructive', description: `${appt.patient} às ${appt.time}` });
    }
  };

  const reactivateAppointment = (id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmado' } : a));
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      toast({ title: 'Consulta reativada', description: `${appt.patient} às ${appt.time} foi reativada.` });
    }
  };

  const setPendingAppointment = (id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'pendente' } : a));
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      toast({ title: 'Marcada como pendente', description: `${appt.patient} às ${appt.time}` });
    }
  };

  const confirmAppointment = (id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'confirmado' } : a));
    const appt = appointments.find(a => a.id === id);
    if (appt) {
      toast({ title: 'Consulta confirmada', description: `${appt.patient} às ${appt.time}` });
    }
  };

  const prescribeManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualMed.trim()) return;
    setPrescribing(true);
    await new Promise(r => setTimeout(r, 500));
    if (!selectedPrescriptionPatient) {
      toast({
        title: 'Selecione um paciente',
        variant: 'destructive',
        description: 'Obrigatório escolher paciente.'
      });
      setPrescribing(false);
      return;
    }
    toast({
      title: 'Prescrição manual criada',
      description: `${manualMed} (${manualDose || 'dosagem'}) para ${selectedPrescriptionPatient}`,
    });
    // opcional: gerar tarefa de acompanhamento
    const id = Date.now();
    setTasks(prev => [
      { id, task: `Acompanhar resposta a ${manualMed}`, priority: 'média', due: 'Esta semana', completed: false },
      ...prev
    ]);
    setManualMed('');
    setManualDose('');
    setManualFreq('');
    setManualDur('');
    setPrescribing(false);
    setShowPrescriptionBox(false);
  };

  const stats = [
    { label: "Consultas Hoje", value: "12", icon: Calendar },
    { label: "Pacientes Ativos", value: "89", icon: Users },
    { label: "Exames Pendentes", value: "5", icon: FileText },
    { label: "Taxa de Satisfação", value: "98%", icon: Activity }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Painel Médico</h2>
        <p className="text-muted-foreground">Gerencie seus pacientes e consultas</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <Icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {showNewPatientForm && (
          <Card className="lg:col-span-1" ref={formRef} id="novo-paciente-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Novo Paciente
              </CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewPatientForm(false)}>Fechar</Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={addPatient} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Nome</Label>
                  <Input id="patientName" value={newPatientName} onChange={e => setNewPatientName(e.target.value)} placeholder="Ex: Carla Lima" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientAge">Idade</Label>
                    <Input id="patientAge" value={newPatientAge} onChange={e => setNewPatientAge(e.target.value)} placeholder="Ex: 45" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="patientReason">Motivo</Label>
                    <Input id="patientReason" value={newPatientReason} onChange={e => setNewPatientReason(e.target.value)} placeholder="Check-up" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Prioridade</Label>
                    <Select value={newTaskPriority} onValueChange={setNewTaskPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="média">Média</SelectItem>
                        <SelectItem value="baixa">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Prazo</Label>
                    <Select value={newTaskDue} onValueChange={setNewTaskDue}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hoje">Hoje</SelectItem>
                        <SelectItem value="Amanhã">Amanhã</SelectItem>
                        <SelectItem value="Esta semana">Esta semana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={patientSubmitting}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {patientSubmitting ? "Adicionando..." : "Adicionar Paciente"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {showPrescriptionBox && (
          <Card className="lg:col-span-1" id="prescricao-digital-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-primary" />
                Prescrição Digital
              </CardTitle>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPrescriptionBox(false)}><X className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs">Paciente</Label>
                <Select value={selectedPrescriptionPatient} onValueChange={setSelectedPrescriptionPatient}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Modelos Frequentes</h4>
                <div className="space-y-3">
                  {predefinedPrescriptions.map(p => (
                    <div key={p.id} className="p-3 border rounded-lg flex flex-col gap-1">
                      <div className="font-medium text-sm">{p.drug}</div>
                      <div className="text-xs text-muted-foreground">{p.dosage} • {p.duration}</div>
                      <div className="text-xs text-muted-foreground">{p.notes}</div>
                      <div className="pt-1"><Button size="sm" variant="outline" onClick={() => prescribePredefined(p)} disabled={!selectedPrescriptionPatient}>Prescrever</Button></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold">Prescrição Manual</h4>
                <form onSubmit={prescribeManual} className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Paciente</Label>
                    <Select value={selectedPrescriptionPatient} onValueChange={setSelectedPrescriptionPatient}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {patients.map(p => (
                          <SelectItem key={p} value={p}>{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Medicamento</Label>
                    <Input value={manualMed} onChange={e => setManualMed(e.target.value)} placeholder="Nome do medicamento" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Dosagem</Label>
                      <Input value={manualDose} onChange={e => setManualDose(e.target.value)} placeholder="500mg" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Frequência</Label>
                      <Input value={manualFreq} onChange={e => setManualFreq(e.target.value)} placeholder="8/8h" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Duração</Label>
                    <Input value={manualDur} onChange={e => setManualDur(e.target.value)} placeholder="7 dias" />
                  </div>
                  <Button type="submit" className="w-full" disabled={prescribing}>
                    {prescribing ? 'Prescrevendo...' : 'Gerar Prescrição'}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        )}

        <div className={`${showNewPatientForm && showPrescriptionBox ? 'lg:col-span-1' : (showNewPatientForm || showPrescriptionBox) ? 'lg:col-span-2' : 'lg:col-span-3'} grid grid-cols-1 lg:grid-cols-2 gap-6`}>
        {/* Agenda do Dia */}
        <Card className="order-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Agenda de Hoje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground mb-2">Cancelar uma consulta a marcará em vermelho na lista abaixo.</p>
            {appointments.map((appointment) => (
              <Dialog key={appointment.id}>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{appointment.patient}</p>
                    <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge variant={
                      appointment.status === 'cancelado' ? 'destructive' :
                      appointment.status === 'confirmado' ? 'secondary' : 'outline'
                    }>
                      {appointment.status === 'cancelado' ? 'Cancelado' : appointment.status === 'confirmado' ? 'Confirmado' : 'Pendente'}
                    </Badge>
                    {appointment.status === 'cancelado' ? (
                      <div className="flex flex-col sm:flex-row gap-2 w-full">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-dashed hover:border-primary gap-1 w-full sm:w-auto justify-center"
                          onClick={() => reactivateAppointment(appointment.id)}
                        >
                          <RotateCcw className="h-4 w-4" /> <span className="hidden xs:inline sm:inline">Reativar</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row flex-wrap gap-2 w-full">
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1 w-full sm:w-auto justify-center"
                          >
                            <FileText className="h-4 w-4" /> <span className="hidden xs:inline sm:inline">Prontuário</span>
                          </Button>
                        </DialogTrigger>
                        {appointment.status === 'confirmado' && (
                          <Button
                            size="sm"
                            variant="secondary"
                            className="gap-1 bg-warning/20 text-warning-foreground hover:bg-warning/30 border border-warning/40 w-full sm:w-auto justify-center"
                            onClick={() => setPendingAppointment(appointment.id)}
                          >
                            <Hourglass className="h-4 w-4" /> <span className="hidden xs:inline sm:inline">Pendente</span>
                          </Button>
                        )}
                        {appointment.status === 'pendente' && (
                          <Button
                            size="sm"
                            className="gap-1 bg-secondary text-secondary-foreground hover:brightness-110 w-full sm:w-auto justify-center"
                            onClick={() => confirmAppointment(appointment.id)}
                          >
                            <CheckCircle2 className="h-4 w-4" /> <span className="hidden xs:inline sm:inline">Confirmar</span>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          className="gap-1 bg-destructive text-destructive-foreground hover:bg-destructive/90 w-full sm:w-auto justify-center"
                          onClick={() => cancelAppointment(appointment.id)}
                        >
                          <XCircle className="h-4 w-4" /> <span className="hidden xs:inline sm:inline">Cancelar</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Prontuário - {appointment.patient}</DialogTitle>
                    <DialogDescription>Informações fictícias para demonstração</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 text-sm max-h-[60vh] overflow-auto pr-2">
                    <section className="space-y-1">
                      <h4 className="font-semibold">Dados Gerais</h4>
                      <p><span className="font-medium">Idade:</span> 42 anos</p>
                      <p><span className="font-medium">Sexo:</span> F</p>
                      <p><span className="font-medium">Alergias:</span> Nenhuma registrada</p>
                      <p><span className="font-medium">Tipo Sanguíneo:</span> O+</p>
                    </section>
                    <section className="space-y-1">
                      <h4 className="font-semibold">Queixa Principal</h4>
                      <p>Dor de cabeça recorrente há 3 dias, intensidade moderada, melhora com analgésico.</p>
                    </section>
                    <section className="space-y-1">
                      <h4 className="font-semibold">Histórico Médico</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Hipertensão controlada (Losartana 50mg)</li>
                        <li>Check-up anual sem alterações significativas</li>
                        <li>Cirurgia de apendicite (2016)</li>
                      </ul>
                    </section>
                    <section className="space-y-1">
                      <h4 className="font-semibold">Exames Recentes</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Hemograma (Normal) - 10/08/2025</li>
                        <li>Perfil Lipídico (LDL 98 mg/dL) - 10/08/2025</li>
                        <li>Glicemia Jejum (92 mg/dL) - 10/08/2025</li>
                      </ul>
                    </section>
                    <section className="space-y-1">
                      <h4 className="font-semibold">Sinais Vitais</h4>
                      <p>PA: 122/78 mmHg • FC: 74 bpm • Temp: 36.7ºC • SatO2: 98%</p>
                    </section>
                    <section className="space-y-1">
                      <h4 className="font-semibold">Prescrições Ativas</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Losartana 50mg 1cp manhã</li>
                        <li>Dipirona 1g se dor (máx 4x/dia)</li>
                      </ul>
                    </section>
                    <section className="space-y-1">
                      <h4 className="font-semibold">Plano</h4>
                      <p>Orientado hidratação adequada, manter medicação habitual e retorno se piora dos sintomas. Solicitar exame de imagem se dor persistir por &gt; 7 dias.</p>
                    </section>
                    <section className="space-y-1">
                      <h4 className="font-semibold">Anotações</h4>
                      <p className="italic text-muted-foreground">Registro gerado automaticamente para fins de demonstração.</p>
                    </section>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Agenda Completa
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Agenda Completa</DialogTitle>
                  <DialogDescription>
                    Não há mais pacientes agendados para hoje.
                  </DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">Retorne amanhã ou adicione novos pacientes pelo formulário de "Novo Paciente".</p>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Tarefas */}
        <Card className="order-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Tarefas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Pendentes */}
            {pendingTasks.length > 0 ? (
              pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">{task.task}</p>
                    <p className="text-sm text-muted-foreground">Prazo: {task.due}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        task.priority === 'alta' ? 'destructive' : 
                        task.priority === 'média' ? 'default' : 'secondary'
                      }
                    >
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                    <Button size="sm" variant="outline" onClick={() => toggleTask(task.id)}>
                      <CheckCircle2 className="h-4 w-4 mr-1" /> Concluir
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Sem tarefas pendentes.</p>
            )}

            {/* Concluídas */}
            {completedTasks.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground">Concluídas</h4>
                {completedTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
                    <div className="line-through text-muted-foreground text-sm">{task.task}</div>
                    <Button size="sm" variant="ghost" onClick={() => toggleTask(task.id)}>
                      <Undo2 className="h-4 w-4 mr-1" /> Desmarcar
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </div>

      {/* Quick Actions */}
  <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <Button className="h-20 flex flex-col gap-2" onClick={() => { setShowNewPatientForm(s => !s); if (showPrescriptionBox) setShowPrescriptionBox(false); }}>
              <Users className="h-6 w-6" />
              <span>Novo Paciente</span>
            </Button>
      <Button variant="secondary" className="h-20 flex flex-col gap-2" onClick={() => { setShowPrescriptionBox(s => !s); if (showNewPatientForm) setShowNewPatientForm(false); }}>
              <FileText className="h-6 w-6" />
              <span>Prescrição Digital</span>
            </Button>
            <Dialog open={showTeleDialog} onOpenChange={setShowTeleDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => { setShowTeleDialog(true); }}>
                  <Video className="h-6 w-6" />
                  <span>Telemedicina</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl">
                <DialogHeader>
                  <DialogTitle>Telemedicina - Chamada Fake</DialogTitle>
                  <DialogDescription>Simulação de sala de vídeo + registro clínico</DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg bg-black flex items-center justify-center text-white text-sm">
                      <div className="text-center">
                        <Video className="h-10 w-10 mx-auto mb-2" />
                        <p>Transmissão de Vídeo (Fake)</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-2 border rounded-md text-center">
                        <p className="text-muted-foreground">Conexão</p>
                        <p className="font-medium text-green-500">Boa</p>
                      </div>
                      <div className="p-2 border rounded-md text-center">
                        <p className="text-muted-foreground">Duração</p>
                        <p className="font-medium">00:12:34</p>
                      </div>
                      <div className="p-2 border rounded-md text-center">
                        <p className="text-muted-foreground">Áudio</p>
                        <p className="font-medium">Ativo</p>
                      </div>
                      <div className="p-2 border rounded-md text-center">
                        <p className="text-muted-foreground">Vídeo</p>
                        <p className="font-medium">Ativo</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={submitTeleForm} className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-xs">Paciente</Label>
                      <Select value={teleSelectedPatient} onValueChange={setTeleSelectedPatient}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {telePatients.map(p => (
                            <SelectItem key={p.id} value={p.patient}>{p.patient}</SelectItem>
                          ))}
                          {patients.filter(p => !telePatients.find(tp => tp.patient === p)).map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Data da Consulta</Label>
                      <Input type="date" value={teleDate} onChange={e => setTeleDate(e.target.value)} required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Sintomas</Label>
                      <Textarea rows={3} value={teleSymptoms} onChange={e => setTeleSymptoms(e.target.value)} placeholder="Descreva sintomas apresentados" required />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Prescrição / Conduta</Label>
                      <Textarea rows={4} value={telePrescription} onChange={e => setTelePrescription(e.target.value)} placeholder="Ex: Amoxicilina 500mg 8/8h por 7 dias" required />
                    </div>
                    <Button type="submit" className="w-full" disabled={teleSubmitting}>
                      {teleSubmitting ? 'Salvando...' : 'Concluir Consulta'}
                    </Button>
                  </form>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="h-20 flex flex-col gap-2">
                  <Activity className="h-6 w-6" />
                  <span>Relatórios</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Relatório Diário (Fake)</DialogTitle>
                  <DialogDescription>Resumo operacional simplificado para demonstração</DialogDescription>
                </DialogHeader>
                <div className="grid md:grid-cols-4 gap-4 text-sm mb-6">
                  <div className="p-3 border rounded-md">
                    <p className="text-muted-foreground">Consultas</p>
                    <p className="text-xl font-semibold">12</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-muted-foreground">Novos Pacientes</p>
                    <p className="text-xl font-semibold">3</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-muted-foreground">Prescrições</p>
                    <p className="text-xl font-semibold">9</p>
                  </div>
                  <div className="p-3 border rounded-md">
                    <p className="text-muted-foreground">Exames Pendentes</p>
                    <p className="text-xl font-semibold">5</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Detalhes de Prescrições</h4>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Amoxicilina 500mg – 4 prescrições</li>
                    <li>Dipirona 1g – 2 prescrições</li>
                    <li>Losartana 50mg – 3 renovações</li>
                  </ul>
                </div>
                <div className="space-y-3 mt-4">
                  <h4 className="font-semibold">Alertas / Observações</h4>
                  <p className="text-sm text-muted-foreground">Nenhum evento crítico registrado. Fluxo assistencial dentro do esperado.</p>
                </div>
                <div className="mt-6 text-xs text-muted-foreground">* Dados fictícios gerados apenas para exibição.</div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
      {/* Telemedicina Hoje */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-primary" />
            Telemedicina Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 border rounded-lg space-y-3 bg-muted/40">
            <h4 className="text-sm font-semibold">Novo Agendamento</h4>
            <form className="grid gap-3 md:grid-cols-5" onSubmit={(e) => {
              e.preventDefault();
              const patient = newTelePatientName.trim() || newTelePatientExisting;
              if (!patient) {
                toast({ title: 'Informe o paciente', variant: 'destructive', description: 'Escolha ou digite o nome.' });
                return;
              }
              if (!newTelePatientTime) {
                toast({ title: 'Informe o horário', variant: 'destructive' });
                return;
              }
              const id = Date.now();
              setTelePatients(prev => [...prev, { id, patient, time: newTelePatientTime, status: 'agendado' }]);
              // adiciona ao conjunto de pacientes gerais se novo
              setPatients(prev => prev.includes(patient) ? prev : [...prev, patient]);
              toast({ title: 'Teleconsulta agendada', description: `${patient} às ${newTelePatientTime}` });
              setNewTelePatientExisting("");
              setNewTelePatientName("");
              setNewTelePatientTime("");
            }}>
              <div className="md:col-span-2 space-y-1">
                <Label className="text-xs">Paciente (existente)</Label>
                <Select value={newTelePatientExisting} onValueChange={setNewTelePatientExisting}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map(p => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 space-y-1">
                <Label className="text-xs">Ou Novo Paciente</Label>
                <Input value={newTelePatientName} onChange={e => { setNewTelePatientName(e.target.value); if (newTelePatientExisting) setNewTelePatientExisting(""); }} placeholder="Nome completo" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Horário</Label>
                <Input type="time" value={newTelePatientTime} onChange={e => setNewTelePatientTime(e.target.value)} required />
              </div>
              <div className="md:col-span-5 flex justify-end">
                <Button type="submit" size="sm" className="mt-1">Agendar</Button>
              </div>
            </form>
          </div>
          {telePatients.length === 0 && (
            <p className="text-sm text-muted-foreground">Sem pacientes em telemedicina no momento.</p>
          )}
          {telePatients.map(tp => (
            <div key={tp.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border rounded-lg">
              <div>
                <p className="font-medium">{tp.patient}</p>
                <p className="text-xs text-muted-foreground">Horário: {tp.time}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => cancelTelePatient(tp.id)}>Desagendar</Button>
                <Button size="sm" onClick={() => concludeTelePatient(tp.id)}>Concluir</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};