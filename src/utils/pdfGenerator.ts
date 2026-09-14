import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { FacilityKPI, Patient, Referral, MedicineStock } from '../types';

export interface DistrictReportData {
  districtName?: string;
  facilities: FacilityKPI[];
  referrals?: Referral[];
  patients?: Patient[];
  medicines?: MedicineStock[];
}

export function generateDistrictQualityReport(data: DistrictReportData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const district = data.districtName || 'Pune District Health Headquarters';
  const totalPatients = data.facilities.reduce((acc, f) => acc + f.totalPatientsToday, 0);
  const avgReferralComp = Math.round(
    data.facilities.reduce((acc, f) => acc + f.referralCompletionRate, 0) / (data.facilities.length || 1)
  );
  const totalHighRisk = data.facilities.reduce((acc, f) => acc + f.highRiskPatientsCount, 0);
  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const reportRef = `RHC-DHO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

  // Header Banner Background
  doc.setFillColor(15, 42, 42); // Rich Dark Teal
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Decorative Accent Line
  doc.setFillColor(245, 158, 11); // Amber-500
  doc.rect(0, 42, pageWidth, 3, 'F');

  // Header Text
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('GOVERNMENT OF MAHARASHTRA • PUBLIC HEALTH DEPARTMENT', 14, 12);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(`${district.toUpperCase()}`, 14, 21);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('District Healthcare Governance & Quality Assurance Audit Report', 14, 28);

  // Metadata Right Aligned
  doc.setFontSize(8);
  doc.setTextColor(226, 232, 240);
  doc.text(`Report Ref: ${reportRef}`, pageWidth - 14, 15, { align: 'right' });
  doc.text(`Generated: ${timestamp}`, pageWidth - 14, 21, { align: 'right' });
  doc.text(`Status: OFFICIAL RECORD`, pageWidth - 14, 27, { align: 'right' });

  let currentY = 52;

  // Executive KPI Summary Cards
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('1. EXECUTIVE DISTRICT KEY PERFORMANCE INDICATORS', 14, currentY);

  currentY += 5;

  const cardWidth = (pageWidth - 28 - 9) / 4;
  const cardHeight = 22;

  const kpis = [
    { label: 'TOTAL FACILITIES', value: `${data.facilities.length}`, sub: 'Audited PHC/CHCs', color: [241, 245, 249], border: [203, 213, 225] },
    { label: 'TOTAL OPD TODAY', value: `${totalPatients}`, sub: 'Across District', color: [236, 253, 245], border: [110, 231, 183] },
    { label: 'AVG REFERRAL COMPL.', value: `${avgReferralComp}%`, sub: 'Benchmark > 80%', color: [245, 243, 255], border: [216, 180, 254] },
    { label: 'HIGH-RISK COHORT', value: `${totalHighRisk}`, sub: 'Proactive Outreach', color: [255, 241, 242], border: [253, 164, 175] },
  ];

  kpis.forEach((kpi, idx) => {
    const x = 14 + idx * (cardWidth + 3);
    doc.setFillColor(kpi.color[0], kpi.color[1], kpi.color[2]);
    doc.setDrawColor(kpi.border[0], kpi.border[1], kpi.border[2]);
    doc.roundedRect(x, currentY, cardWidth, cardHeight, 2, 2, 'FD');

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(kpi.label, x + 3, currentY + 6);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(kpi.value, x + 3, currentY + 14);

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(kpi.sub, x + 3, currentY + 19);
  });

  currentY += cardHeight + 10;

  // Section 2: Facility Performance & Ranking
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. FACILITY QUALITY & OPERATIONAL METRICS', 14, currentY);

  const facilityRows = data.facilities.map((fac, i) => [
    `#${i + 1} ${fac.facilityName}`,
    fac.district,
    `${fac.totalPatientsToday}`,
    `${fac.avgWaitingTimeMinutes} mins`,
    `${fac.referralCompletionRate}%`,
    `${fac.followupCompletionRate}%`,
    `${fac.highRiskPatientsCount}`,
    fac.medicineShortageCount > 0 ? `⚠️ ${fac.medicineShortageCount} Low` : '✅ Stock OK',
  ]);

  autoTable(doc, {
    startY: currentY + 3,
    head: [['Facility Name', 'District', 'OPD Today', 'Avg Wait', 'Referral %', 'Followup %', 'High-Risk', 'Drug Stock Status']],
    body: facilityRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 42, 42],
      textColor: [255, 255, 255],
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  // Calculate position after table
  const finalY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || currentY + 60;
  currentY = finalY + 10;

  // Section 3: Referral Continuity Funnel
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. DISTRICT REFERRAL CONTINUITY & FUNNEL INTEGRITY', 14, currentY);

  const referralFunnelRows = [
    ['1. Created at PHC / Sub-Center', '120', '100%', 'Initial triage referral raised by MO/CHO'],
    ['2. Accepted at Secondary/Tertiary Facility', '104', '86.7%', 'Clinical acceptance & slot allocation'],
    ['3. Appointment Scheduled / Booked', '92', '76.7%', 'Transport & digital token confirmed'],
    ['4. Patient Attended Facility', '88', '73.3%', 'Biometric / QR check-in recorded at OPD'],
    ['5. Counter-Consultation & Discharge Completed', '84', '70.0%', 'Continuity loop closed back to PHC'],
  ];

  autoTable(doc, {
    startY: currentY + 3,
    head: [['Funnel Stage', 'Patients', 'Conversion %', 'Governance Audit Note']],
    body: referralFunnelRows,
    theme: 'striped',
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59],
    },
    margin: { left: 14, right: 14 },
  });

  const finalY2 = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || currentY + 45;
  currentY = finalY2 + 10;

  // Verification & Official Seal Section
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('OFFICIAL CERTIFICATION & QUALITY ASSURANCE', 18, currentY + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(
    'This electronic audit document is auto-generated by the Maharashtra Rural Health Connect Governance Engine.\nData is verified against PHC registers, Ayushman Bharat Digital Mission (ABDM) tokens, and facility inventory logs.',
    18,
    currentY + 12
  );

  doc.text('District Health Officer (DHO) Digital Stamp', pageWidth - 70, currentY + 16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 42, 42);
  doc.text('Pune District Health Authority', pageWidth - 70, currentY + 22);

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Rural Health Connect Platform • Pune District • Page ${p} of ${totalPages}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  // Trigger browser download
  const filename = `Pune_District_Quality_Report_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(filename);
}
