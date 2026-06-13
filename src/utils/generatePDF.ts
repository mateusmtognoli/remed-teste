import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Medication, InventoryItem } from '../context/MedicationContext';

const EMERALD = [5, 150, 105] as [number, number, number];
const SLATE_800 = [30, 41, 59] as [number, number, number];
const SLATE_500 = [100, 116, 139] as [number, number, number];
const WHITE = [255, 255, 255] as [number, number, number];
const RED = [239, 68, 68] as [number, number, number];
const AMBER = [245, 158, 11] as [number, number, number];

function statusColor(status: string): [number, number, number] {
  if (status === 'Tomada') return EMERALD;
  if (status === 'Atrasada') return RED;
  if (status === 'Pulada') return [148, 163, 184];
  return SLATE_500;
}

export function generateMonthlyPDF(
  patientName: string,
  monthYearLabel: string,
  medications: Medication[],
  inventory: InventoryItem[]
) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('pt-BR');

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFillColor(...EMERALD);
  doc.rect(0, 0, pageW, 38, 'F');

  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ReMed', 14, 20);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório Mensal de Medicamentos', 14, 30);
  doc.text(`Gerado em ${today}`, pageW - 14, 30, { align: 'right' });

  // ── Patient info ──────────────────────────────────────────────────────────
  let y = 52;
  doc.setTextColor(...SLATE_800);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(patientName, 14, y);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...SLATE_500);
  y += 7;
  doc.text(`Período: ${monthYearLabel}`, 14, y);

  // ── Divider ───────────────────────────────────────────────────────────────
  y += 10;
  doc.setDrawColor(...EMERALD);
  doc.setLineWidth(0.4);
  doc.line(14, y, pageW - 14, y);
  y += 12;

  // ── Adherence stats ───────────────────────────────────────────────────────
  const total = medications.length;
  const taken = medications.filter(m => m.status === 'Tomada').length;
  const delayed = medications.filter(m => m.status === 'Atrasada').length;
  const skipped = medications.filter(m => m.status === 'Pulada').length;
  const pending = medications.filter(m => m.status === 'Pendente').length;
  const adherencePct = total > 0 ? Math.round((taken / total) * 100) : 0;

  doc.setTextColor(...SLATE_800);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumo de Adesão', 14, y);
  y += 8;

  const cards = [
    { label: 'Adesão Geral', value: `${adherencePct}%`, color: EMERALD },
    { label: 'Tomadas', value: String(taken), color: EMERALD },
    { label: 'Pendentes', value: String(pending), color: SLATE_500 },
    { label: 'Atrasadas', value: String(delayed), color: RED },
    { label: 'Puladas', value: String(skipped), color: [148, 163, 184] as [number, number, number] },
  ];

  const cardW = (pageW - 28 - 8) / cards.length;
  cards.forEach((card, i) => {
    const x = 14 + i * (cardW + 2);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, cardW, 20, 2, 2, 'F');
    doc.setTextColor(...card.color);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(card.value, x + cardW / 2, y + 10, { align: 'center' });
    doc.setTextColor(...SLATE_500);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text(card.label, x + cardW / 2, y + 16, { align: 'center' });
  });

  y += 28;

  // ── Medication table ───────────────────────────────────────────────────────
  doc.setTextColor(...SLATE_800);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Medicamentos do Mês', 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [['Medicamento', 'Dosagem', 'Horário', 'Instruções', 'Status']],
    body: medications.map(m => [m.name, m.dosage, m.time, m.instructions, m.status]),
    headStyles: {
      fillColor: EMERALD,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: SLATE_800 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      4: { fontStyle: 'bold' },
    },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 4) {
        const status = data.cell.raw as string;
        const [r, g, b] = statusColor(status);
        data.cell.styles.textColor = [r, g, b];
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Inventory section ─────────────────────────────────────────────────────
  const afterTable = (doc as any).lastAutoTable?.finalY ?? y + 40;
  let y2 = afterTable + 12;

  if (y2 > 260) {
    doc.addPage();
    y2 = 20;
  }

  doc.setTextColor(...SLATE_800);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Status do Estoque', 14, y2);
  y2 += 6;

  const alertItems = inventory.filter(item => item.status !== null);

  autoTable(doc, {
    startY: y2,
    head: [['Medicamento', 'Quantidade', 'Dias Restantes', 'Status']],
    body: inventory.map(item => [
      item.name,
      `${item.count} un.`,
      `${item.daysLeft} dias`,
      item.status ?? 'Normal',
    ]),
    headStyles: {
      fillColor: EMERALD,
      textColor: WHITE,
      fontStyle: 'bold',
      fontSize: 9,
    },
    bodyStyles: { fontSize: 9, textColor: SLATE_800 },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    didParseCell(data) {
      if (data.section === 'body' && data.column.index === 3) {
        const status = data.cell.raw as string;
        if (status === 'Crítico') data.cell.styles.textColor = RED;
        else if (status === 'Alerta') data.cell.styles.textColor = AMBER;
        else data.cell.styles.textColor = EMERALD;
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Footer ─────────────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...EMERALD);
  doc.rect(0, pageH - 14, pageW, 14, 'F');
  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Gerado pelo aplicativo ReMed  •  Uso clínico informativo', pageW / 2, pageH - 5, { align: 'center' });

  // ── Alert summary (only if there are alerts) ───────────────────────────────
  if (alertItems.length > 0 || delayed > 0) {
    const observacoes: string[] = [];
    if (delayed > 0) observacoes.push(`• ${delayed} medicamento(s) com dose atrasada este mês.`);
    alertItems.forEach(item => {
      observacoes.push(`• Estoque ${item.status?.toLowerCase()} de ${item.name} (${item.count} unidades restantes).`);
    });

    const observacoesY = (doc as any).lastAutoTable?.finalY ?? y2 + 40;
    let y3 = observacoesY + 12;
    if (y3 > 250) { doc.addPage(); y3 = 20; }

    doc.setTextColor(...SLATE_800);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Observações', 14, y3);
    y3 += 8;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE_500);
    observacoes.forEach(obs => {
      doc.text(obs, 14, y3);
      y3 += 6;
    });
  }

  const fileName = `ReMed_Relatorio_${monthYearLabel.replace('/', '-')}_${patientName.split(' ')[0]}.pdf`;
  doc.save(fileName);
}

export function generateCombinedPDF(
  monthYearLabel: string,
  dependentsData: Array<{ name: string; medications: Medication[] }>
) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const today = new Date().toLocaleDateString('pt-BR');

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setFillColor(...EMERALD);
  doc.rect(0, 0, pageW, 38, 'F');
  doc.setTextColor(...WHITE);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('ReMed', 14, 20);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Relatório Completo de Adesão — Todos os Pacientes', 14, 30);
  doc.text(`Gerado em ${today}`, pageW - 14, 30, { align: 'right' });

  let y = 50;
  doc.setTextColor(...SLATE_500);
  doc.setFontSize(10);
  doc.text(`Período: ${monthYearLabel}`, 14, y);
  y += 8;
  doc.setDrawColor(...EMERALD);
  doc.setLineWidth(0.4);
  doc.line(14, y, pageW - 14, y);
  y += 12;

  // ── Per-dependent sections ────────────────────────────────────────────────
  for (const dep of dependentsData) {
    if (y > 230) { doc.addPage(); y = 20; }

    const meds = dep.medications;
    const taken = meds.filter(m => m.status === 'Tomada').length;
    const late = meds.filter(m => m.status === 'Atrasada').length;
    const skipped = meds.filter(m => m.status === 'Pulada').length;
    const pending = meds.filter(m => m.status === 'Pendente').length;
    const actionable = taken + late + skipped;
    const pct = actionable > 0 ? Math.round((taken / actionable) * 100) : (pending === 0 ? 100 : 0);

    doc.setTextColor(...SLATE_800);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(dep.name, 14, y);

    const pctColor: [number, number, number] = pct >= 80 ? EMERALD : pct >= 60 ? [245, 158, 11] : RED;
    doc.setTextColor(...pctColor);
    doc.text(`${pct}% de adesão`, pageW - 14, y, { align: 'right' });
    y += 6;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...SLATE_500);
    doc.text(
      `Tomadas: ${taken}  |  Atrasadas: ${late}  |  Puladas: ${skipped}  |  Pendentes: ${pending}`,
      14, y
    );
    y += 8;

    if (meds.length > 0) {
      autoTable(doc, {
        startY: y,
        head: [['Medicamento', 'Dosagem', 'Horário', 'Instruções', 'Status']],
        body: meds.map(m => [m.name, m.dosage, m.time, m.instructions, m.status]),
        headStyles: { fillColor: EMERALD, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
        bodyStyles: { fontSize: 8, textColor: SLATE_800 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        didParseCell(data) {
          if (data.section === 'body' && data.column.index === 4) {
            const [r, g, b] = statusColor(data.cell.raw as string);
            data.cell.styles.textColor = [r, g, b];
            data.cell.styles.fontStyle = 'bold';
          }
        },
        margin: { left: 14, right: 14 },
      });
      y = ((doc as any).lastAutoTable?.finalY ?? y + 30) + 12;
    }
  }

  // ── Footer ─────────────────────────────────────────────────────────────────
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(...EMERALD);
  doc.rect(0, pageH - 14, pageW, 14, 'F');
  doc.setTextColor(...WHITE);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Gerado pelo aplicativo ReMed  •  Uso clínico informativo', pageW / 2, pageH - 5, { align: 'center' });

  doc.save(`ReMed_Relatorio_Completo_${monthYearLabel.replace('/', '-')}.pdf`);
}
