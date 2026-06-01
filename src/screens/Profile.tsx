import React from 'react';
import Layout from '../components/Layout';
import {
  Edit2, Ruler, Weight, Cake, AlertTriangle, Activity, Pill, Droplets,
  Calendar, ChevronRight, UserPlus, Users, BarChart3, Shield, Bell,
  CreditCard, LogOut, CheckCircle2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useMedications } from '../context/MedicationContext';
import { generateCombinedPDF } from '../utils/generatePDF';

export default function Profile() {
  const navigate = useNavigate();
  const { userRole, activeDependent, unpairDevice, medications, dependents, inventory } = useMedications();

  const today = new Date();
  const month = today.toLocaleDateString('pt-BR', { month: 'long' });
  const monthYearLabel = month.charAt(0).toUpperCase() + month.slice(1) + '/' + today.getFullYear();

  const dependentsStats = dependents.map(dep => {
    const meds = medications.filter(m => m.dependentId === dep.id);
    const taken = meds.filter(m => m.status === 'Tomada').length;
    const late = meds.filter(m => m.status === 'Atrasada').length;
    const skipped = meds.filter(m => m.status === 'Pulada').length;
    const pending = meds.filter(m => m.status === 'Pendente').length;
    const actionable = taken + late + skipped;
    const pct = actionable > 0 ? Math.round((taken / actionable) * 100) : (pending === 0 ? 100 : 0);
    return { ...dep, meds, taken, late, skipped, pending, pct };
  });

  const overallPct = dependentsStats.length > 0
    ? Math.round(dependentsStats.reduce((s, d) => s + d.pct, 0) / dependentsStats.length)
    : 0;
  const goalMet = overallPct >= 80;
  const [selectedPerson, setSelectedPerson] = React.useState<any>(null);

  const handleLogout = () => {
    if (userRole === 'emparelhado') {
      unpairDevice();
    }
    navigate('/login');
  };
  const [alertSettings, setAlertSettings] = React.useState({
    medications: true,
    hydration: false,
    appointments: true
  });

  const toggleSetting = (key: keyof typeof alertSettings) => {
    setAlertSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const mockDependentData = activeDependent?.id === '1' ? {
    name: 'Teresinha Andrade',
    img: '/img/foto_teresinha.png',
    blood: 'O+',
    height: '1.62 m',
    weight: '65 kg',
    age: '74 anos',
    cpf: '987.654.321-00',
    email: 'teresinha@email.com',
    phone: '(11) 98765-1122',
  } : {
    name: 'Antônio Andrade',
    img: activeDependent?.img || '/img/foto_antonio.png',
    blood: 'AB+',
    height: '1.70 m',
    weight: '77 kg',
    age: '70 anos',
    cpf: '123.456.789-00',
    email: 'antonioandrade@email.com',
    phone: '(11) 98765-4321',
  };

  if (userRole === 'responsavel') {
    return (
      <Layout>
        <main className="max-w-md mx-auto space-y-8 pb-10">
          {/* Header Profile */}
          <section className="flex flex-col items-center pt-6 text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src="/img/foto_reinaldo.png" 
                  alt="Reinaldo Joaquim" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-1 right-1 bg-emerald-600 p-1.5 rounded-full border-2 border-white shadow-md">
                <Shield className="w-4 h-4 text-white" fill="currentColor" />
              </div>
            </div>
            
            <span className="text-emerald-700 font-extrabold uppercase text-[10px] tracking-widest mb-1">Perfil Administrativo</span>
            <h2 className="text-3xl font-extrabold text-slate-900 leading-tight">Reinaldo Joaquim</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Gestor de Cuidado • CRM-SP Ativo</p>
            
            <div className="flex gap-2 mt-4">
              <span className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-[11px] font-bold">3 Dependentes Ativos</span>
              <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full text-[11px] font-bold">Plano Premium</span>
            </div>
          </section>

          {/* Gerenciar Dependentes */}
          <section className="bg-slate-50 rounded-[2.5rem] p-6 space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Gerenciar Dependentes</h3>
                <p className="text-sm text-slate-500 font-medium mt-0.5">Acompanhamento em tempo real de pacientes vinculados.</p>
              </div>
              <button 
                onClick={() => navigate('/add-dependent')}
                className="bg-emerald-800 text-white p-2.5 rounded-xl shadow-lg shadow-emerald-900/10 active:scale-95 transition-all"
              >
                <UserPlus size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <DependentItem 
                img="/img/foto_teresinha.png"
                name="Teresinha Andrade"
                status="ESTÁVEL"
                desc="Próxima dose: 14:00 (Losartana)"
                statusColor="text-emerald-500"
                onClick={() => setSelectedPerson({
                  name: 'Teresinha Andrade',
                  role: 'Dependente',
                  img: '/img/foto_teresinha.png',
                  details: 'Hipertensão Arterial, Diabetes Tipo 2',
                  contact: '(11) 98765-4321',
                  location: 'São Paulo, SP'
                })}
              />
              <DependentItem 
                img="/img/foto_antonio.png"
                name="Antônio Andrade"
                status="HISTÓRICO"
                desc="Antibiótico finalizado há 2 dias"
                statusColor="text-slate-400"
                onClick={() => setSelectedPerson({
                  name: 'Antônio Andrade',
                  role: 'Dependente',
                  img: '/img/foto_antonio.png',
                  details: 'Tratamento de pneumonia concluído há 48h.',
                  contact: '(11) 97765-1122',
                  location: 'São Paulo, SP'
                })}
              />
            </div>
          </section>

          {/* Relatórios */}
          <section className="bg-slate-50 rounded-[2.5rem] p-6 space-y-5">
            <div className="flex justify-between items-start">
              <div className="max-w-[180px]">
                <h3 className="text-xl font-extrabold text-slate-900 leading-tight">Relatórios de Adesão</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Insights mensais sobre o tratamento.</p>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-800 shadow-sm">
                <BarChart3 size={20} />
              </div>
            </div>

            <div className="space-y-4">
              {dependentsStats.map(dep => {
                const barColor = dep.pct >= 80 ? 'bg-emerald-500' : dep.pct >= 60 ? 'bg-amber-400' : 'bg-red-400';
                const pctColor = dep.pct >= 80 ? 'text-emerald-600' : dep.pct >= 60 ? 'text-amber-500' : 'text-red-500';
                return (
                  <div key={dep.id} className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">{dep.name.split(' ')[0]} {dep.name.split(' ')[1]}</span>
                      <span className={`text-xs font-extrabold ${pctColor}`}>{dep.pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${dep.pct}%` }}
                        transition={{ duration: 0.9, ease: 'easeOut' }}
                        className={`h-full rounded-full ${barColor}`}
                      />
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {dep.taken} tomada(s) · {dep.late} atrasada(s) · {dep.pending} pendente(s)
                    </p>
                  </div>
                );
              })}
            </div>

            <div className={`p-4 rounded-2xl flex items-center justify-between ${goalMet ? 'bg-emerald-50' : 'bg-amber-50'}`}>
              <div className="flex items-center gap-2">
                {goalMet
                  ? <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
                  : <AlertTriangle className="text-amber-500 shrink-0" size={18} />
                }
                <span className={`text-xs font-bold ${goalMet ? 'text-emerald-700' : 'text-amber-700'}`}>
                  {goalMet ? `Meta Mensal Atingida (${overallPct}%)` : `Atenção: Meta em Risco (${overallPct}%)`}
                </span>
              </div>
              <button
                onClick={() => generateCombinedPDF(
                  monthYearLabel,
                  dependentsStats.map(d => ({ name: d.name, medications: d.meds })),
                  inventory
                )}
                className="text-slate-500 text-[11px] font-extrabold underline decoration-slate-300 active:opacity-60 transition-opacity shrink-0 ml-2"
              >
                Exportar PDF
              </button>
            </div>
          </section>

          {/* Configurações */}
          <section className="bg-slate-100 rounded-[2.5rem] p-6 space-y-6">
            <h3 className="text-xl font-extrabold text-slate-900">Configurações da Conta</h3>
            <div className="space-y-3">
              <ProfileLink 
                icon={<Shield size={20} />} 
                label="Segurança e Privacidade" 
                onClick={() => navigate('/security')}
              />
              <ProfileLink 
                icon={<Bell size={20} />} 
                label="Preferências de Notificação" 
                onClick={() => navigate('/notification-preferences')}
              />
              <ProfileLink 
                icon={<CreditCard size={20} />} 
                label="Assinatura e Pagamento" 
                onClick={() => navigate('/subscription')}
              />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-5 text-red-700 bg-transparent hover:bg-white rounded-2xl transition-all group"
              >
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-extrabold text-sm">Sair da Conta</span>
              </button>
            </div>
          </section>
        </main>
        
        <PersonModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="max-w-4xl mx-auto space-y-10 pb-10">
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-4">
          <div className="md:col-span-4 relative group">
            <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
              <img 
                src={mockDependentData.img} 
                alt={mockDependentData.name} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-emerald-500 text-white p-4 rounded-2xl shadow-lg border-2 border-white">
              <p className="font-extrabold text-xl leading-none">{mockDependentData.blood}</p>
              <p className="text-[10px] uppercase tracking-widest font-extrabold opacity-80 pt-1">Tipo Sanguíneo</p>
            </div>
          </div>

          <div className="md:col-span-8 pt-4">
            <div className="flex flex-col gap-2">
              <span className="text-emerald-600 font-extrabold uppercase tracking-widest text-[10px]">
                {userRole === 'emparelhado' ? 'Dispositivo Emparelhado' : 'Perfil Dependente'}
              </span>
              <h2 className="text-4xl font-extrabold tracking-tighter text-slate-900">{mockDependentData.name}</h2>
              <p className="text-slate-500 text-lg max-w-md font-medium leading-tight">Paciente regular. Plano de saúde ativo e histórico atualizado.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group active:scale-95">
                <Ruler className="text-emerald-500 mb-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Altura</p>
                <p className="text-xl font-extrabold text-slate-800">{mockDependentData.height}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group active:scale-95">
                <Weight className="text-emerald-500 mb-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Peso</p>
                <p className="text-xl font-extrabold text-slate-800">{mockDependentData.weight}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer group active:scale-95 col-span-2 sm:col-span-1">
                <Cake className="text-emerald-500 mb-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest">Idade</p>
                <p className="text-xl font-extrabold text-slate-800">{mockDependentData.age}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Meus Dados</h3>
            {userRole !== 'emparelhado' && (
              <button className="text-emerald-600 font-extrabold text-xs uppercase tracking-widest flex items-center gap-1 hover:underline active:scale-95 transition-all">
                <Edit2 size={12} /> Editar
              </button>
            )}
          </div>
          <div className="bg-slate-100/50 rounded-[2rem] p-8 grid grid-cols-1 md:grid-cols-2 gap-8 border border-slate-200/50">
            {[
              { label: 'Nome Completo', value: mockDependentData.name },
              { label: 'CPF', value: mockDependentData.cpf },
              { label: 'E-mail', value: mockDependentData.email },
              { label: 'Telefone', value: mockDependentData.phone },
            ].map((field, i) => (
              <div key={i} className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">{field.label}</label>
                <p className="text-lg font-bold text-slate-800">{field.value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Meu Histórico Médico</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-red-50 p-2.5 rounded-xl text-red-500">
                  <AlertTriangle size={24} />
                </div>
                <h4 className="font-extrabold text-lg text-slate-800">Alergias</h4>
              </div>
              <div className="flex flex-wrap gap-2">
                {['Penicilina', 'Lactose', 'Aspirina'].map(tag => (
                  <span key={tag} className="bg-slate-50 px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 border border-slate-100">{tag}</span>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                Última atualização em {new Date().toLocaleDateString('pt-BR')}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
                  <Activity size={24} />
                </div>
                <h4 className="font-extrabold text-lg text-slate-800">Condições Crônicas</h4>
              </div>
              <ul className="space-y-3">
                {['Hipertensão Arterial', 'Asma Leve'].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Configurações de Alerta</h3>
          <div className="bg-slate-100 rounded-3xl overflow-hidden border border-slate-200/50">
            <div className="divide-y divide-slate-200/50">
              <AlertToggle 
                icon={<Pill />} 
                title="Lembrete de Medicamentos" 
                desc="Notificações push 15 min antes da dose" 
                active={alertSettings.medications} 
                onClick={() => toggleSetting('medications')}
              />
              <AlertToggle 
                icon={<Droplets />} 
                title="Hidratação" 
                desc="Lembrete a cada 2 horas" 
                active={alertSettings.hydration} 
                onClick={() => toggleSetting('hydration')}
              />
              <AlertToggle 
                icon={<Calendar />} 
                title="Consultas Agendadas" 
                desc="Aviso 24h e 1h antes do horário" 
                active={alertSettings.appointments} 
                onClick={() => toggleSetting('appointments')}
              />
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Cuidadores Associados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CaregiverCard 
                img="/img/foto_medica.png" 
                name="Dra. Joana Mello" 
                role="Médica Responsável" 
                onClick={() => setSelectedPerson({
                  name: 'Dra. Joana Mello',
                  role: 'Médica Responsável',
                  img: '/img/foto_medica.png',
                  details: 'CRM-SP 123456 • Especialista em Geriatria',
                  contact: '(11) 99988-7766',
                  location: 'Clínica ReMed - Unidade Paulista'
                })}
              />
              <CaregiverCard 
                img="/img/foto_reinaldo.png" 
                name="Reinaldo Joaquim" 
                role="Cuidador Principal" 
                onClick={() => setSelectedPerson({
                  name: 'Reinaldo Joaquim',
                  role: 'Cuidador Principal',
                  img: '/img/foto_reinaldo.png',
                  details: 'Familiar Responsável • Treinamento em Primeiros Socorros',
                  contact: '(11) 96655-4433',
                  location: 'Residência'
                })}
              />
          </div>
        </section>

        <section className="pt-4">
          <button 
            onClick={handleLogout}
            className={`w-full flex items-center justify-center gap-4 p-5 rounded-[2rem] transition-all group shadow-sm border ${
              userRole === 'emparelhado' 
                ? 'text-amber-800 bg-amber-50 border-amber-100 hover:bg-amber-100' 
                : 'text-red-700 bg-red-50 hover:bg-red-100 border-red-100'
            }`}
          >
            <LogOut size={22} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-extrabold text-lg">
              {userRole === 'emparelhado' ? 'Desconectar Celular Emparelhado' : 'Sair da Conta'}
            </span>
          </button>
        </section>
      </main>

      <PersonModal person={selectedPerson} onClose={() => setSelectedPerson(null)} />
    </Layout>
  );
}

function PersonModal({ person, onClose }: { person: any, onClose: () => void }) {
  return (
    <AnimatePresence>
      {person && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60]"
          />
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-white rounded-[2.5rem] shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-8 pb-10">
              <div className="flex justify-end mb-2">
                <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-emerald-50 shadow-md">
                  <img src={person.img} alt={person.name} className="w-full h-full object-cover" />
                </div>
                
                <span className="text-emerald-600 font-extrabold uppercase text-[9px] tracking-widest mb-1">{person.role}</span>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-6">{person.name}</h3>

                <div className="w-full space-y-4 text-left">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600 shrink-0">
                      <Activity size={18} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">Informações</span>
                      <p className="text-sm font-bold text-slate-700 leading-tight">{person.details}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600 shrink-0">
                      <Activity size={18} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">Contato</span>
                      <p className="text-sm font-bold text-slate-700">{person.contact}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-orange-600 shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-tight">Localização</span>
                      <p className="text-sm font-bold text-slate-700">{person.location}</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-extrabold text-sm shadow-lg shadow-slate-200 active:scale-95 transition-all"
                >
                  Fechar Perfil
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function DependentItem({ img, name, status, desc, statusColor, onClick }: { img: string, name: string, status: string, desc: string, statusColor: string, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-5 rounded-3xl shadow-sm flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group border border-slate-100"
    >
      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-slate-50 shrink-0">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-start">
          <h4 className="font-extrabold text-slate-800 leading-snug">{name}</h4>
          <span className={`text-[9px] font-extrabold tracking-widest flex items-center gap-1 ${statusColor}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${statusColor.replace('text', 'bg')}`} />
            {status}
          </span>
        </div>
        <p className="text-[11px] text-slate-400 font-medium leading-tight mt-1">{desc}</p>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
    </div>
  );
}

function ProfileLink({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md active:scale-[0.99] transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className="text-slate-700 bg-slate-50 p-2 rounded-xl group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
          {icon}
        </div>
        <span className="font-extrabold text-sm text-slate-800">{label}</span>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
    </button>
  );
}

function AlertToggle({ icon, title, desc, active, onClick }: { icon: React.ReactNode, title: string, desc: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="p-6 flex items-center justify-between bg-white/40 hover:bg-white/60 transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        <div className="text-emerald-600 group-hover:scale-110 transition-transform">{icon}</div>
        <div>
          <p className="font-extrabold text-slate-800 leading-tight">{title}</p>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{desc}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-emerald-500 shadow-inner' : 'bg-slate-200'}`}>
        <motion.div 
          animate={{ x: active ? 24 : 4 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </div>
    </div>
  );
}

function CaregiverCard({ img, name, role, onClick }: { img: string, name: string, role: string, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98] cursor-pointer group"
    >
      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-50 flex-shrink-0 group-hover:scale-105 transition-transform">
        <img src={img} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow">
        <p className="font-extrabold text-slate-800 leading-tight underline decoration-emerald-200">{name}</p>
        <p className="text-[9px] text-emerald-600 font-extrabold uppercase tracking-widest mt-1">{role}</p>
      </div>
      <ChevronRight size={20} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
    </div>
  );
}
