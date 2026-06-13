import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import {
  Pill, AlertTriangle, CheckCircle2, XCircle, Clock,
  ShoppingCart, Bell, Package
} from 'lucide-react';
import { motion } from 'motion/react';
import { useMedications } from '../context/MedicationContext';

// ── Types ──────────────────────────────────────────────────────────────────

type NotifKind = 'pending' | 'late' | 'taken' | 'skipped' | 'critical' | 'alert';

interface NotifItem {
  id: string;
  kind: NotifKind;
  title: string;
  description: string;
  time: string;
  medId?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function kindMeta(kind: NotifKind) {
  switch (kind) {
    case 'pending':
      return {
        bg: 'bg-emerald-50',
        iconBg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        Icon: Clock,
        dot: 'bg-emerald-500',
        actionable: true,
      };
    case 'late':
      return {
        bg: 'bg-red-50/60',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-500',
        Icon: AlertTriangle,
        dot: 'bg-red-500',
        actionable: true,
      };
    case 'taken':
      return {
        bg: 'bg-white opacity-60',
        iconBg: 'bg-emerald-50',
        iconColor: 'text-emerald-400',
        Icon: CheckCircle2,
        dot: 'bg-emerald-300',
        actionable: false,
      };
    case 'skipped':
      return {
        bg: 'bg-white opacity-50',
        iconBg: 'bg-slate-100',
        iconColor: 'text-slate-400',
        Icon: XCircle,
        dot: 'bg-slate-300',
        actionable: false,
      };
    case 'critical':
      return {
        bg: 'bg-white',
        iconBg: 'bg-red-50',
        iconColor: 'text-red-500',
        Icon: AlertTriangle,
        dot: 'bg-red-500',
        actionable: true,
      };
    case 'alert':
      return {
        bg: 'bg-white',
        iconBg: 'bg-amber-50',
        iconColor: 'text-amber-500',
        Icon: Package,
        dot: 'bg-amber-400',
        actionable: true,
      };
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function Notifications() {
  const navigate = useNavigate();
  const { medications, inventory, updateStatus, activeDependent, userRole } = useMedications();
  const readOnly = userRole === 'emparelhado';

  // Filter medications for the current context
  const relevantMeds = medications.filter(m => m.dependentId === activeDependent?.id);

  // Build notification list from real data
  const notifications: NotifItem[] = [];

  // Medication notifications — actionable first (pending, late), then historical
  const order: NotifItem['kind'][] = ['late', 'pending', 'taken', 'skipped'];
  for (const status of order) {
    relevantMeds
      .filter(m =>
        status === 'late' ? m.status === 'Atrasada' :
        status === 'pending' ? m.status === 'Pendente' :
        status === 'taken' ? m.status === 'Tomada' :
        m.status === 'Pulada'
      )
      .forEach(m => {
        const kind = status as NotifItem['kind'];
        notifications.push({
          id: `med-${m.id}`,
          kind,
          title:
            kind === 'pending' ? `Dose pendente: ${m.name}` :
            kind === 'late'    ? `Dose atrasada: ${m.name}` :
            kind === 'taken'   ? `Dose confirmada: ${m.name}` :
                                 `Dose pulada: ${m.name}`,
          description:
            kind === 'taken'
              ? `Tomada às ${m.confirmTime ?? m.time} · ${m.dosage}`
              : kind === 'skipped'
              ? `Pulada às ${m.confirmTime ?? m.time} · ${m.dosage}`
              : `${m.dosage} · ${m.instructions} · Horário: ${m.time}`,
          time:
            kind === 'taken' || kind === 'skipped' ? m.confirmTime ?? m.time : m.time,
          medId: m.id,
        });
      });
  }

  // Stock notifications
  inventory
    .filter(item => item.status !== null)
    .forEach(item => {
      notifications.push({
        id: `stock-${item.id}`,
        kind: item.status === 'Crítico' ? 'critical' : 'alert',
        title: `Estoque ${item.status}: ${item.name}`,
        description: `${item.count} unidade(s) restante(s) · estimativa de ${item.daysLeft} dia(s).`,
        time: 'Hoje',
      });
    });

  const actionableCount = notifications.filter(n =>
    n.kind === 'pending' || n.kind === 'late' || n.kind === 'critical' || n.kind === 'alert'
  ).length;

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-slate-900 font-extrabold text-3xl tracking-tight mb-2">Notificações</h2>
        <p className="text-slate-500 font-medium text-sm">
          {activeDependent
            ? `Acompanhando: ${activeDependent.name}`
            : 'Acompanhe alertas e lembretes de medicamentos.'}
        </p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState hasMeds={relevantMeds.length > 0} />
      ) : (
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-slate-900 font-extrabold text-lg">Hoje</h3>
              {actionableCount > 0 && (
                <span className="text-emerald-600 font-extrabold text-[10px] tracking-widest uppercase">
                  {actionableCount} {actionableCount === 1 ? 'pendente' : 'pendentes'}
                </span>
              )}
            </div>

            <div className="space-y-3">
              {notifications.map((notif, i) => (
                <NotifCard
                  key={notif.id}
                  notif={notif}
                  index={i}
                  readOnly={readOnly}
                  onTake={() => notif.medId && updateStatus(notif.medId, 'Tomada')}
                  onSkip={() => notif.medId && updateStatus(notif.medId, 'Pulada')}
                  onStockClick={() => navigate('/stock')}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </Layout>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function NotifCard({
  notif, index, readOnly, onTake, onSkip, onStockClick,
}: {
  notif: NotifItem;
  index: number;
  readOnly: boolean;
  onTake: () => void;
  onSkip: () => void;
  onStockClick: () => void;
}) {
  const meta = kindMeta(notif.kind);
  const isStock = notif.kind === 'critical' || notif.kind === 'alert';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      onClick={isStock ? onStockClick : undefined}
      className={`${meta.bg} rounded-2xl p-4 flex gap-4 shadow-sm border border-slate-100 transition-all active:scale-[0.98] ${isStock ? 'cursor-pointer hover:bg-red-50/40' : ''}`}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl ${meta.iconBg} flex items-center justify-center flex-shrink-0 ${meta.iconColor}`}>
        <meta.Icon size={22} />
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <p className="text-slate-900 font-extrabold text-sm leading-tight">{notif.title}</p>
          <span className="text-slate-400 font-bold text-[11px] whitespace-nowrap shrink-0">{notif.time}</span>
        </div>
        <p className="text-slate-500 font-medium text-xs leading-snug">{notif.description}</p>

        {/* Actions for pending */}
        {notif.kind === 'pending' && (
          readOnly ? (
            <ReadOnlyNotice />
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                onClick={e => { e.stopPropagation(); onTake(); }}
                className="bg-emerald-600 text-white font-extrabold text-[11px] px-4 py-2 rounded-xl active:scale-95 transition-all shadow-sm"
              >
                Tomar Dose
              </button>
              <button
                onClick={e => { e.stopPropagation(); onSkip(); }}
                className="bg-slate-100 text-slate-600 font-extrabold text-[11px] px-4 py-2 rounded-xl active:scale-95 transition-all border border-slate-200"
              >
                Pular
              </button>
            </div>
          )
        )}

        {/* Actions for late */}
        {notif.kind === 'late' && (
          readOnly ? (
            <ReadOnlyNotice />
          ) : (
            <div className="mt-3 flex gap-2">
              <button
                onClick={e => { e.stopPropagation(); onTake(); }}
                className="bg-red-500 text-white font-extrabold text-[11px] px-4 py-2 rounded-xl active:scale-95 transition-all shadow-sm"
              >
                Tomar Agora
              </button>
              <button
                onClick={e => { e.stopPropagation(); onSkip(); }}
                className="bg-slate-100 text-slate-600 font-extrabold text-[11px] px-4 py-2 rounded-xl active:scale-95 transition-all border border-slate-200"
              >
                Pular
              </button>
            </div>
          )
        )}

        {/* Stock action */}
        {isStock && (
          <div className="mt-2 flex items-center text-emerald-700 font-extrabold text-[11px] gap-1.5 uppercase tracking-widest">
            <ShoppingCart size={13} />
            <span>Ver estoque</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function ReadOnlyNotice() {
  return (
    <div className="mt-3 bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center gap-2 text-slate-500 text-xs font-semibold leading-tight">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 shrink-0"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      <span>Somente leitura — peça ao responsável para confirmar.</span>
    </div>
  );
}

function EmptyState({ hasMeds }: { hasMeds: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center gap-4"
    >
      <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
        <Bell className="w-9 h-9 text-emerald-300" />
      </div>
      <div>
        <p className="text-slate-700 font-extrabold text-lg">
          {hasMeds ? 'Tudo em dia!' : 'Nenhum medicamento cadastrado'}
        </p>
        <p className="text-slate-400 font-medium text-sm mt-1 max-w-[240px] mx-auto leading-relaxed">
          {hasMeds
            ? 'Todas as doses foram registradas. Nenhuma notificação pendente.'
            : 'Adicione medicamentos na tela de Estoque para receber lembretes aqui.'}
        </p>
      </div>
    </motion.div>
  );
}
