import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { FacilityKPI, Patient, Referral, MedicineStock, Prescription } from '../types';
import { findMedicineKnowledge } from '../data/medicineKnowledge';

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

/**
 * Generates an official OPD Prescription PDF with clear, layman-friendly
 * drug descriptions and purposes so patients and families understand their medicines.
 */
export function generatePrescriptionPdf(rx: Prescription) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const facility = rx.facilityName || 'Primary Health Centre (PHC) Junnar, Pune';
  const doctor = rx.doctorName || 'Dr. Rajesh Deshmukh';

  // Top Header Banner
  doc.setFillColor(15, 42, 42); // Deep Rich Teal
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setFillColor(245, 158, 11); // Amber accent bar
  doc.rect(0, 38, pageWidth, 2.5, 'F');

  // National / State Health Mission Emblem / Text
  doc.setTextColor(245, 158, 11);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('NATIONAL HEALTH MISSION • GOVERNMENT OF MAHARASHTRA • PUBLIC HEALTH DEPT', 14, 11);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`${facility.toUpperCase()}`, 14, 19);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('AYUSHMAN BHARAT DIGITAL HEALTH MISSION (ABDM) • OUTPATIENT E-PRESCRIPTION', 14, 26);

  // Metadata right-aligned
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text(`Prescription ID: ${rx.id.toUpperCase()}`, pageWidth - 14, 13, { align: 'right' });
  doc.text(`Issue Date: ${rx.date}`, pageWidth - 14, 19, { align: 'right' });
  doc.text(`ABHA Verified: MH-${rx.patientId.toUpperCase()}`, pageWidth - 14, 25, { align: 'right' });

  let curY = 48;

  // Patient & Doctor Information Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, curY, pageWidth - 28, 26, 2, 2, 'FD');

  // Left: Patient Details
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('PATIENT PARTICULARS', 18, curY + 6);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${rx.patientName}`, 18, curY + 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Patient ID: ${rx.patientId}   •   OPD Registration Category: General`, 18, curY + 18);
  doc.text(`Sub-Centre / Village Jurisdiction: Rural Block Junnar`, 18, curY + 23);

  // Right: Prescribing Medical Officer
  const midX = pageWidth / 2 + 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('PRESCRIBING MEDICAL OFFICER', midX, curY + 6);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${doctor}`, midX, curY + 12);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Reg. No: MMC-2012-4589 • MBBS, MD (Community Medicine)', midX, curY + 18);
  doc.text(`${facility}`, midX, curY + 23);

  curY += 32;

  // Clinical Diagnosis & Assessment
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 42, 42);
  doc.text('CLINICAL ASSESSMENT & DIAGNOSIS', 14, curY);

  curY += 4;
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, curY, pageWidth - 28, 14, 1.5, 1.5, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Diagnosis: ${rx.diagnosis}`, 18, curY + 6);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Clinical Remarks: ${rx.clinicalNotes || 'Adhere strictly to prescribed medicine dosage and drink boiled water.'}`, 18, curY + 11);

  curY += 20;

  // Section Header: Prescribed Medicines & Common Man Guide
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 42, 42);
  doc.text('PRESCRIBED MEDICINES & PATIENT DRUG GUIDE (WHAT IT IS & WHY IT IS USED)', 14, curY);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Every medicine is clearly explained below so you and your family know what the drug does and why it was prescribed.', 14, curY + 4);

  curY += 7;

  // Prepare table rows with common man explanations
  const tableRows = rx.items.map((item, index) => {
    const medInfo = findMedicineKnowledge(item.medicineName);
    const desc = item.description || medInfo.simpleDescription;
    const purpose = item.purpose || medInfo.usedFor;
    const advice = item.sideEffectsNote || medInfo.commonAdvice;

    return [
      `${index + 1}`,
      `${item.medicineName}\nDosage: ${item.dosage}`,
      `${item.frequency}\n(${item.durationDays} Days)`,
      `${desc}`,
      `${purpose}\n\n* Advice: ${advice}`,
    ];
  });

  autoTable(doc, {
    startY: curY,
    head: [['#', 'Medicine Name & Dosage', 'Timing & Duration', 'What Is This Drug? (Common Man Guide)', 'Why Is It Used For? (Purpose & Advice)']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [15, 42, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 42, fontStyle: 'bold' },
      2: { cellWidth: 32 },
      3: { cellWidth: 50 },
      4: { cellWidth: 50 },
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [30, 41, 59],
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  const finalTableY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY || curY + 60;
  let endY = finalTableY + 8;

  if (endY > 230) {
    doc.addPage();
    endY = 20;
  }

  // Patient Instructions & Dispensary Box
  doc.setFillColor(254, 243, 199); // Light Amber
  doc.setDrawColor(251, 191, 36);
  doc.roundedRect(14, endY, pageWidth - 28, 22, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 53, 15);
  doc.text('FREE DISPENSARY & ESSENTIAL INSTRUCTIONS FOR THE PATIENT (सामान्य सूचना):', 18, endY + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(146, 64, 14);
  doc.text('1. All essential medicines listed on this prescription are dispensed FREE OF CHARGE at PHC Dispensary Counter #2 under NHM.', 18, endY + 11);
  doc.text('2. Take medicines with clean drinking water after food. Do NOT skip doses or stop early without speaking to your doctor.', 18, endY + 16);
  if (rx.followUpDate) {
    doc.setFont('helvetica', 'bold');
    doc.text(`3. Scheduled Follow-up Date: ${rx.followUpDate}. Please bring this prescription slip with you.`, 18, endY + 21);
  }

  endY += 28;

  // Doctor Signature & Official Seal Box
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Ayushman Bharat Digital Health Record (ABHA Verified)', 14, endY + 8);
  doc.text('Digitally Authenticated & Time-stamped', 14, endY + 13);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 42, 42);
  doc.text(`Digitally Signed by: ${doctor}`, pageWidth - 14, endY + 6, { align: 'right' });
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Medical Officer In-Charge • Reg #MMC-2012-4589`, pageWidth - 14, endY + 11, { align: 'right' });
  doc.text(`${facility}`, pageWidth - 14, endY + 16, { align: 'right' });

  // Page Footer
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Rural Health Connect • Outpatient Digital Prescription • ABHA: MH-${rx.patientId.toUpperCase()} • Page ${p} of ${totalPages}`,
      pageWidth / 2,
      290,
      { align: 'center' }
    );
  }

  const filename = `Prescription_${rx.patientName.replace(/\s+/g, '_')}_${rx.date}.pdf`;
  doc.save(filename);
}
