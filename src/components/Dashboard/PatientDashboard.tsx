import { Calendar, Clock, FileText, Video, Activity, Heart, PhoneOff, PhoneCall, Stethoscope, MapPin, Search, Filter, Pill, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const PatientDashboard = () => {
  const { toast } = useToast();
  const [teleOpen, setTeleOpen] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [teleAppointments, setTeleAppointments] = useState([
    { id: 201, doctor: "Dr. André Silva", specialty: "Clínico Geral", time: "09:30", date: "2025-08-31", status: "agendado" as const },
    { id: 202, doctor: "Dr. Ana Silva", specialty: "Cardiologia", time: "14:00", date: "2025-09-02", status: "agendado" as const }
  ]);
  // Estado para próximas consultas gerais (presencial ou tele) exibidas no dashboard principal
  type Appointment = {
    id: number;
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    type: 'presencial' | 'telemedicina';
    location: string;
    status: 'agendado' | 'cancelado';
  };
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 1,
      doctor: "Dr. Ana Silva",
      specialty: "Cardiologia",
      date: "2024-01-15",
      time: "14:30",
      type: "presencial" as const,
      location: 'Unidade Centro',
      status: 'agendado'
    },
    {
      id: 2,
      doctor: "Dr. Carlos Santos",
      specialty: "Ortopedia",
      date: "2024-01-20",
      time: "10:00",
      type: "telemedicina" as const,
      location: 'Online',
      status: 'agendado'
    }
  ]);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [schedDoctor, setSchedDoctor] = useState("");
  const [schedSpecialty, setSchedSpecialty] = useState("");
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [schedType, setSchedType] = useState<'presencial' | 'telemedicina'>('presencial');
  const [schedLocation, setSchedLocation] = useState("");
  const [activeTeleId, setActiveTeleId] = useState<number | null>(null);
  const [newTeleReason, setNewTeleReason] = useState("");
  const [newTeleDoctor, setNewTeleDoctor] = useState("");
  const [newTeleDate, setNewTeleDate] = useState("");
  const [newTeleTime, setNewTeleTime] = useState("");
  const resetScheduleForm = () => {
    setSchedDoctor("");
    setSchedSpecialty("");
    setSchedDate("");
    setSchedTime("");
    setSchedType('presencial');
    setSchedLocation("");
  };

  const handleScheduleAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedDoctor.trim() || !schedSpecialty.trim() || !schedDate || !schedTime) {
      toast({ title: 'Preencha todos os campos', variant: 'destructive' });
      return;
    }
    const id = Date.now();
  setAppointments(prev => [
      ...prev,
      {
        id,
        doctor: schedDoctor,
        specialty: schedSpecialty,
        date: schedDate,
        time: schedTime,
        type: schedType,
    location: schedType === 'telemedicina' ? 'Online' : (schedLocation || 'A definir'),
    status: 'agendado'
      }
    ]);
    toast({ title: 'Consulta agendada', description: `${schedDoctor} em ${schedDate} às ${schedTime}` });
    resetScheduleForm();
    setScheduleOpen(false);
  };

  const handleCancelAppointment = (id: number) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelado' } : a));
    toast({ title: 'Consulta marcada como cancelada', variant: 'destructive' });
  };

  const recentExams = [
    { id: 1, name: "Hemograma Completo", date: "2024-01-10", status: "disponivel" },
    { id: 2, name: "Radiografia Tórax", date: "2024-01-08", status: "disponivel" },
    { id: 3, name: "Ressonância Magnética", date: "2024-01-12", status: "aguardando" }
  ];
  const [examOpen, setExamOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<typeof recentExams[number] | null>(null);
  const openExam = (exam: typeof recentExams[number]) => { setSelectedExam(exam); setExamOpen(true); };
  // Dialogs extras
  const [allExamsOpen, setAllExamsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [examQuery, setExamQuery] = useState("");
  const [examStatusFilter, setExamStatusFilter] = useState<'todos' | 'disponivel' | 'aguardando'>('todos');
  const allExams = [
    ...recentExams,
    { id: 4, name: 'Vitamina D', date: '2024-01-05', status: 'disponivel' },
    { id: 5, name: 'Colesterol Total', date: '2023-12-28', status: 'disponivel' },
    { id: 6, name: 'Glicemia Jejum', date: '2023-12-20', status: 'disponivel' },
    { id: 7, name: 'TSH', date: '2023-11-11', status: 'disponivel' },
    { id: 8, name: 'Ecocardiograma', date: '2023-10-02', status: 'aguardando' },
  ];
  const filteredExams = allExams.filter(e => {
    const matchQuery = examQuery.trim() === '' || e.name.toLowerCase().includes(examQuery.toLowerCase());
    const matchStatus = examStatusFilter === 'todos' || e.status === examStatusFilter;
    return matchQuery && matchStatus;
  });

  type HistoryEvent = {
    id: number;
    date: string; // ISO
    type: 'consulta' | 'exame' | 'prescricao' | 'anotacao';
    title: string;
    detail: string;
    doctor?: string;
  };
  const historyEvents: HistoryEvent[] = [
    { id: 901, date: '2025-08-31T09:30:00', type: 'consulta', title: 'Teleconsulta com Dr. André', detail: 'Queixa de cefaleia tensional, orientado hidratação e pausas.', doctor: 'Dr. André Silva' },
    { id: 902, date: '2025-08-28T07:42:00', type: 'exame', title: 'Hemograma Completo', detail: 'Resultado dentro da normalidade.' },
    { id: 903, date: '2025-08-20T14:10:00', type: 'prescricao', title: 'Prescrição de Analgésico', detail: 'Dipirona 500mg se dor (máx 4x/dia).', doctor: 'Dr. Ana Silva' },
    { id: 904, date: '2025-08-15T10:05:00', type: 'consulta', title: 'Consulta Presencial Ortopedia', detail: 'Dor leve em joelho, recomendados exercícios de fortalecimento.', doctor: 'Dr. Carlos Santos' },
    { id: 905, date: '2025-08-15T10:15:00', type: 'anotacao', title: 'Anotação Paciente', detail: 'Paciente relatou aderência parcial aos alongamentos.' },
    { id: 906, date: '2025-07-30T09:00:00', type: 'exame', title: 'Radiografia Tórax', detail: 'Sem alterações agudas.' },
  ];
  const [historyTypeFilter, setHistoryTypeFilter] = useState<'todos' | HistoryEvent['type']>('todos');
  const historyFiltered = historyEvents
    .filter(ev => historyTypeFilter === 'todos' || ev.type === historyTypeFilter)
    .sort((a,b) => b.date.localeCompare(a.date));
  const fakeExamDetails = (examName: string) => {
    switch (examName) {
      case 'Hemograma Completo':
        return {
          coleta: '2024-01-10 07:42',
          liberacao: '2024-01-10 11:15',
          resultados: [
            { label: 'Hemácias', valor: '4,90 M/µL', ref: '4,5 - 5,9' },
            { label: 'Hemoglobina', valor: '14,2 g/dL', ref: '13,5 - 17,5' },
            { label: 'Hematócrito', valor: '43 %', ref: '41 - 53' },
            { label: 'Leucócitos', valor: '6.100 /µL', ref: '4.000 - 10.000' },
            { label: 'Plaquetas', valor: '240.000 /µL', ref: '150.000 - 400.000' }
          ],
          interpretacao: 'Parâmetros dentro da normalidade. Sem indícios hematológicos de processo infeccioso ou anêmico.'
        };
      case 'Radiografia Tórax':
        return {
          coleta: '2024-01-08 09:05',
          liberacao: '2024-01-08 13:40',
          resultados: [
            { label: 'Campos pulmonares', valor: 'Sem infiltrações', ref: '—' },
            { label: 'Silhueta cardíaca', valor: 'Normal', ref: '—' },
            { label: 'Mediastino', valor: 'Dentro do padrão', ref: '—' }
          ],
          interpretacao: 'Radiografia sem alterações agudas aparentes.'
        };
      case 'Ressonância Magnética':
        return {
          coleta: '2024-01-12 15:20',
          liberacao: '—',
          resultados: [
            { label: 'Status de processamento', valor: 'Em análise', ref: '—' }
          ],
          interpretacao: 'Resultado ainda não liberado.'
        };
      default:
        return { coleta: '-', liberacao: '-', resultados: [], interpretacao: 'Sem dados.' };
    }
  };

  const healthMetrics = [
    { label: "Pressão Arterial", value: "120/80 mmHg", status: "normal" },
    { label: "Frequência Cardíaca", value: "72 bpm", status: "normal" },
    { label: "Peso", value: "70 kg", status: "normal" },
    { label: "Glicemia", value: "95 mg/dL", status: "normal" }
  ];

  const activeTele = teleAppointments.find(t => t.id === activeTeleId);

  const handleSendSymptoms = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    toast({ title: "Sintomas enviados", description: "O médico receberá suas informações." });
    setSubmitting(false);
    setSymptoms("");
  };

  const handleStartTele = (id: number) => {
    setActiveTeleId(id);
    toast({ title: "Conectando...", description: "Iniciando sala de teleconsulta." });
  };

  const handleEndTele = () => {
    setActiveTeleId(null);
    toast({ title: "Consulta encerrada", description: "Teleconsulta finalizada." });
  };

  const handleScheduleTele = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeleDoctor.trim() || !newTeleDate || !newTeleTime) {
      toast({ title: 'Preencha os campos', variant: 'destructive' });
      return;
    }
    const id = Date.now();
    setTeleAppointments(prev => [...prev, { id, doctor: newTeleDoctor, specialty: newTeleReason || 'Geral', time: newTeleTime, date: newTeleDate, status: 'agendado' }]);
    toast({ title: 'Teleconsulta agendada', description: `${newTeleDoctor} em ${newTeleDate} às ${newTeleTime}` });
    setNewTeleDoctor("");
    setNewTeleReason("");
    setNewTeleDate("");
    setNewTeleTime("");
  };

  const handleCancelTele = (id: number) => {
    setTeleAppointments(prev => prev.filter(t => t.id !== id));
    if (activeTeleId === id) setActiveTeleId(null);
    toast({ title: 'Teleconsulta cancelada', variant: 'destructive' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Meu Painel</h2>
        <p className="text-muted-foreground">Acompanhe sua saúde e consultas</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
  <Button onClick={() => setScheduleOpen(true)} className="h-24 flex flex-col gap-2 bg-primary hover:bg-primary-hover">
          <Calendar className="h-6 w-6" />
          <span>Agendar Consulta</span>
        </Button>
        <Button variant="secondary" className="h-24 flex flex-col gap-2" onClick={() => setTeleOpen(true)}>
          <Video className="h-6 w-6" />
          <span>Telemedicina</span>
        </Button>
  <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setAllExamsOpen(true)}>
          <FileText className="h-6 w-6" />
          <span>Meus Exames</span>
        </Button>
  <Button variant="outline" className="h-24 flex flex-col gap-2" onClick={() => setHistoryOpen(true)}>
          <Activity className="h-6 w-6" />
          <span>Histórico Médico</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximas Consultas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Próximas Consultas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {appointments.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma consulta futura.</p>}
            {appointments.map((appointment) => (
              <div key={appointment.id} className={`p-4 border rounded-lg space-y-2 ${appointment.status==='cancelado' ? 'bg-destructive/5 border-destructive/40' : 'border-border'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{appointment.doctor}</p>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {appointment.date} às {appointment.time}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {appointment.type === 'telemedicina' ? 'Online' : appointment.location}</p>
                  </div>
                  <div className="flex flex-col gap-1 items-end">
                    <Badge variant={appointment.type === 'telemedicina' ? 'secondary' : 'default'} className="shrink-0">
                      {appointment.type === 'telemedicina' ? <Video className="h-3 w-3 mr-1" /> : <Heart className="h-3 w-3 mr-1" />}
                      {appointment.type === 'telemedicina' ? 'Online' : 'Presencial'}
                    </Badge>
                    {appointment.status === 'cancelado' && (
                      <Badge variant="destructive" className="shrink-0">Cancelada</Badge>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {appointment.status === 'agendado' && (
                    <Button size="sm" variant="outline" onClick={() => handleCancelAppointment(appointment.id)}>Cancelar</Button>
                  )}
                  {appointment.status === 'cancelado' && (
                    <Button size="sm" variant="secondary" onClick={() => setAppointments(prev => prev.map(a => a.id===appointment.id ? { ...a, status: 'agendado' } : a))}>Reativar</Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Exames Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Exames Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentExams.map((exam) => (
              <div key={exam.id} className="p-4 border border-border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{exam.name}</p>
                    <p className="text-sm text-muted-foreground">{exam.date}</p>
                  </div>
                  <Badge variant={exam.status === 'disponivel' ? 'secondary' : 'outline'}>
                    {exam.status === 'disponivel' ? 'Disponível' : 'Aguardando'}
                  </Badge>
                </div>
                <div className="flex justify-end">
                  <Button size="sm" variant="outline" onClick={() => openExam(exam)}>Visualizar</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Indicadores de Saúde */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Indicadores de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="p-4 border border-border rounded-lg text-center">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                <Badge variant="secondary" className="mt-2">Normal</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {/* Dialog Agendar Consulta */}
      <Dialog open={scheduleOpen} onOpenChange={setScheduleOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Calendar className="h-5 w-5 text-primary" /> Agendar Consulta</DialogTitle>
            <DialogDescription>Preencha os dados para agendar uma nova consulta.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleAppointment} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <Input placeholder="Profissional (ex: Dr. João)" value={schedDoctor} onChange={e => setSchedDoctor(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Input placeholder="Especialidade" value={schedSpecialty} onChange={e => setSchedSpecialty(e.target.value)} />
              </div>
              <div className="space-y-1">
                <label className="sr-only" htmlFor="tipo-consulta">Tipo</label>
                <select id="tipo-consulta" aria-label="Tipo de consulta" className="w-full text-sm border rounded-md h-10 bg-background px-3" value={schedType} onChange={e => setSchedType(e.target.value === 'presencial' ? 'presencial' : 'telemedicina')}>
                  <option value="presencial">Presencial</option>
                  <option value="telemedicina">Telemedicina</option>
                </select>
              </div>
              <div className="space-y-1">
                <Input type="date" value={schedDate} onChange={e => setSchedDate(e.target.value)} />
              </div>
              <div className="space-y-1">
                <Input type="time" value={schedTime} onChange={e => setSchedTime(e.target.value)} />
              </div>
              {schedType === 'presencial' && (
                <div className="space-y-1 sm:col-span-2">
                  <Input placeholder="Local / Unidade" value={schedLocation} onChange={e => setSchedLocation(e.target.value)} />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => { resetScheduleForm(); setScheduleOpen(false); }}>Fechar</Button>
              <Button type="submit">Agendar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog Detalhes Exame */}
      <Dialog open={examOpen} onOpenChange={o => { setExamOpen(o); if(!o) setSelectedExam(null); }}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> {selectedExam?.name || 'Exame'}</DialogTitle>
            <DialogDescription>Informações simuladas do resultado.</DialogDescription>
          </DialogHeader>
          {selectedExam && (() => { const d = fakeExamDetails(selectedExam.name); return (
            <div className="space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 border rounded-md bg-muted/40">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Data Coleta</p>
                  <p>{d.coleta}</p>
                </div>
                <div className="p-3 border rounded-md bg-muted/40">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Liberação</p>
                  <p>{d.liberacao}</p>
                </div>
                <div className="p-3 border rounded-md bg-muted/40">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Status</p>
                  <p>{selectedExam.status === 'disponivel' ? 'Disponível' : 'Em processamento'}</p>
                </div>
                <div className="p-3 border rounded-md bg-muted/40">
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Código</p>
                  <p>EX-{selectedExam.id.toString().padStart(5,'0')}</p>
                </div>
              </div>
              {d.resultados.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold">Resultados</p>
                  <div className="border rounded-md divide-y">
                    {d.resultados.map((r,i)=>(
                      <div key={i} className="flex items-center justify-between px-3 py-2 text-xs">
                        <span className="font-medium">{r.label}</span>
                        <span>{r.valor}</span>
                        <span className="text-muted-foreground">{r.ref}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="p-3 border rounded-md bg-muted/30">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-1">Interpretação</p>
                <p className="text-xs leading-relaxed">{d.interpretacao}</p>
              </div>
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" type="button" onClick={() => toast({ title: 'Download (fake)' })}>Baixar PDF</Button>
                <Button size="sm" type="button" onClick={() => { setExamOpen(false); setSelectedExam(null); }}>Fechar</Button>
              </div>
            </div>
          ); })()}
        </DialogContent>
      </Dialog>

      {/* Dialog Meus Exames */}
      <Dialog open={allExamsOpen} onOpenChange={setAllExamsOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Meus Exames</DialogTitle>
            <DialogDescription>Lista completa de exames (fake) com busca e filtro.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar por nome" value={examQuery} onChange={e => setExamQuery(e.target.value)} className="flex-1" />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select aria-label="Filtrar status" value={examStatusFilter} onChange={e => setExamStatusFilter(e.target.value as 'todos' | 'disponivel' | 'aguardando')} className="text-sm border rounded-md h-10 bg-background px-3">
                  <option value="todos">Todos</option>
                  <option value="disponivel">Disponíveis</option>
                  <option value="aguardando">Aguardando</option>
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {filteredExams.length === 0 && <p className="text-sm text-muted-foreground col-span-full">Nenhum exame encontrado.</p>}
              {filteredExams.map(exam => (
                <div key={exam.id} className="p-4 border rounded-lg space-y-3 bg-background/60 transition shadow-sm border-border">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium leading-tight">{exam.name}</p>
                      <p className="text-xs text-muted-foreground">{exam.date}</p>
                    </div>
                    <Badge variant={exam.status === 'disponivel' ? 'secondary' : 'outline'} className="shrink-0">{exam.status === 'disponivel' ? 'Disponível' : 'Aguardando'}</Badge>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline" onClick={() => openExam(exam)}>Ver</Button>
                    {exam.status === 'disponivel' && <Button size="sm" variant="secondary" onClick={() => toast({ title: 'Download (fake)' })}>PDF</Button>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Histórico Médico */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><History className="h-5 w-5 text-primary" /> Histórico Médico</DialogTitle>
            <DialogDescription>Linha do tempo de eventos clínicos (fake).</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs font-medium">Filtrar:</span>
              {(['todos','consulta','exame','prescricao','anotacao'] as const).map(t => (
                <Button key={t} size="sm" variant={historyTypeFilter===t ? 'secondary' : 'outline'} onClick={() => setHistoryTypeFilter(t)} className="text-[11px]">{t.charAt(0).toUpperCase()+t.slice(1)}</Button>
              ))}
            </div>
            <div className="space-y-4 relative">
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />
              {historyFiltered.map(ev => (
                <div key={ev.id} className="relative pl-10">
                  <div className="absolute left-0 mt-1 h-6 w-6 rounded-full flex items-center justify-center bg-primary text-primary-foreground text-[10px] font-bold">
                    {ev.type === 'consulta' && 'C'}
                    {ev.type === 'exame' && 'E'}
                    {ev.type === 'prescricao' && 'P'}
                    {ev.type === 'anotacao' && 'A'}
                  </div>
                  <div className="p-4 border rounded-md bg-background/60 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-sm leading-tight">{ev.title}</p>
                      <Badge variant={ev.type==='exame' ? 'secondary' : ev.type==='prescricao' ? 'outline' : 'default'} className="text-[10px]">{ev.type}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{new Date(ev.date).toLocaleString()}</p>
                    <p className="text-xs leading-relaxed">{ev.detail}</p>
                    {ev.doctor && <p className="text-[11px] text-muted-foreground flex items-center gap-1"><Stethoscope className="h-3 w-3" /> {ev.doctor}</p>}
                  </div>
                </div>
              ))}
              {historyFiltered.length === 0 && <p className="text-sm text-muted-foreground">Nenhum evento.</p>}
            </div>
            <div className="flex justify-end">
              <Button size="sm" variant="outline" onClick={() => toast({ title: 'Exportar (fake)' })}>Exportar PDF</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Telemedicina Paciente */}
      <Dialog open={teleOpen} onOpenChange={setTeleOpen}>
        <DialogContent className="max-w-4xl sm:max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Video className="h-5 w-5 text-primary" /> Telemedicina</DialogTitle>
            <DialogDescription>Acompanhe e participe das suas teleconsultas.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 space-y-4">
              {activeTele ? (
                <div className="space-y-3">
                  <div className="relative w-full rounded-lg border bg-black aspect-video flex items-center justify-center text-muted-foreground">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5" />
                    <p className="relative z-10 text-xs">Streaming simulado - {activeTele.doctor}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" onClick={handleEndTele} className="gap-1"><PhoneOff className="h-4 w-4" /> Encerrar</Button>
                    <Button size="sm" variant="outline" onClick={() => toast({ title: 'Captura de tela (fake)' })}>Snapshot</Button>
                  </div>
                  <form onSubmit={handleSendSymptoms} className="space-y-2">
                    <label className="text-xs font-medium">Sintomas / Anotações</label>
                    <Textarea value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Descreva sintomas, duração, medicamentos em uso..." className="min-h-[90px]" />
                    <div className="flex justify-end">
                      <Button size="sm" type="submit" disabled={submitting}>{submitting ? 'Enviando...' : 'Enviar'}</Button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 border rounded-lg bg-muted/40">
                  <Video className="h-10 w-10 text-primary mb-2" />
                  <p className="text-sm text-muted-foreground">Selecione uma teleconsulta em "Agendadas" para entrar quando estiver próximo do horário.</p>
                </div>
              )}
            </div>
            <div className="md:col-span-2 space-y-5">
              <div>
                <h4 className="font-semibold text-sm mb-2">Agendadas</h4>
                <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
                  {teleAppointments.length === 0 && <p className="text-xs text-muted-foreground">Nenhuma teleconsulta.</p>}
                  {teleAppointments.map(t => (
                    <div key={t.id} className={`p-3 border rounded-md bg-background/60 space-y-1 ${t.id===activeTeleId ? 'ring-2 ring-primary' : ''}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{t.doctor}</p>
                        <Badge variant="secondary">{t.time}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{t.specialty} • {t.date}</p>
                      <div className="flex gap-2 mt-1">
                        <Button size="sm" variant="outline" onClick={() => handleStartTele(t.id)} disabled={!!activeTeleId && activeTeleId!==t.id} className="gap-1"><PhoneCall className="h-3 w-3" /> Entrar</Button>
                        <Button size="sm" variant="destructive" onClick={() => handleCancelTele(t.id)}>Cancelar</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2"><Stethoscope className="h-4 w-4 text-primary" /> Agendar Nova</h4>
                <form onSubmit={handleScheduleTele} className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1 sm:col-span-2">
                    <Input placeholder="Médico / Especialista" value={newTeleDoctor} onChange={e => setNewTeleDoctor(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Input type="date" value={newTeleDate} onChange={e => setNewTeleDate(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Input type="time" value={newTeleTime} onChange={e => setNewTeleTime(e.target.value)} />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <Input placeholder="Motivo (ex: dor de cabeça)" value={newTeleReason} onChange={e => setNewTeleReason(e.target.value)} />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <Button size="sm" type="submit">Agendar</Button>
                  </div>
                </form>
              </div>
              <div className="border rounded-md p-3 text-xs text-muted-foreground">
                <p>As teleconsultas ficam disponíveis para entrada 5 minutos antes do horário agendado.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};