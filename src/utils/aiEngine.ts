import type { Patient, Vitals, FollowupRiskOutput, InterventionPriorityOutput } from '../types';

export function predictFollowupRisk(patient: Partial<Patient>): FollowupRiskOutput {
  let score = 20;
  const explanations: string[] = [];
  const recommendedActions: string[] = [];

  const missed = patient.missedAppointments || 0;
  const distance = patient.distanceKm || 5;
  const age = patient.age || 35;
  const chronicCount = patient.chronicConditions?.length || 0;

  if (missed >= 3) {
    score += 40;
    explanations.push(`High missed appointment history (${missed} previous missed visits)`);
    recommendedActions.push('Assign ASHA worker for home visit & direct reminder');
  } else if (missed > 0) {
    score += 20 * missed;
    explanations.push(`${missed} past missed appointment(s)`);
    recommendedActions.push('Send automated SMS & voice call reminder in local language');
  }

  if (distance > 25) {
    score += 25;
    explanations.push(`Significant distance from facility (${distance} km)`);
    recommendedActions.push('Offer mobile health clinic routing or travel support allowance');
  } else if (distance > 10) {
    score += 15;
    explanations.push(`Moderate travel distance to hospital (${distance} km)`);
  }

  if (age > 65) {
    score += 10;
    explanations.push('Elderly patient (Age 65+) requiring mobility support');
  } else if (age < 5) {
    score += 10;
    explanations.push('Pediatric follow-up sensitivity');
  }

  if (chronicCount >= 2) {
    score += 15;
    explanations.push(`Multiple chronic conditions (${patient.chronicConditions?.join(', ')})`);
    recommendedActions.push('Coordinate multi-specialty consolidated appointment date');
  }

  if (patient.isPregnant) {
    score += 10;
    explanations.push('Antenatal care continuity tracking');
    recommendedActions.push('Verify ANM micro-plan scheduling');
  }

  const finalScore = Math.min(Math.max(score, 5), 98);

  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (finalScore >= 70) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 40) {
    riskLevel = 'MEDIUM';
  }

  if (recommendedActions.length === 0) {
    recommendedActions.push('Routine SMS reminder prior to appointment date');
  }

  return {
    riskScore: finalScore,
    riskLevel,
    explanations,
    recommendedActions,
  };
}

export function evaluateClinicalPriority(input: {
  symptoms: string[];
  vitals?: Vitals;
  isPregnant?: boolean;
  chronicConditions?: string[];
  diseasePriority?: string;
}): 'ROUTINE' | 'MODERATE' | 'HIGH' | 'URGENT' {
  const { symptoms = [], vitals, isPregnant, chronicConditions = [] } = input;

  let urgentFlags = 0;
  let highFlags = 0;
  let moderateFlags = 0;

  if (vitals) {
    if (vitals.oxygenSatPercent && vitals.oxygenSatPercent < 90) urgentFlags++;
    if (vitals.bpSystolic && vitals.bpSystolic >= 180) urgentFlags++;
    if (vitals.bpSystolic && vitals.bpSystolic >= 150) highFlags++;
    if (vitals.temperatureCelsius && vitals.temperatureCelsius > 39.5) urgentFlags++;
    if (vitals.temperatureCelsius && vitals.temperatureCelsius > 38.5) highFlags++;
    if (vitals.hemoglobinGdl && vitals.hemoglobinGdl < 7) highFlags++;
  }

  const symptomsText = symptoms.join(' ').toLowerCase();
  if (
    symptomsText.includes('chest pain') ||
    symptomsText.includes('severe shortness of breath') ||
    symptomsText.includes('unconscious') ||
    symptomsText.includes('heavy bleeding') ||
    symptomsText.includes('convulsions')
  ) {
    urgentFlags += 2;
  }

  if (
    symptomsText.includes('high fever') ||
    symptomsText.includes('persistent vomiting') ||
    symptomsText.includes('severe headache') ||
    symptomsText.includes('abdominal pain')
  ) {
    highFlags++;
  }

  if (symptomsText.includes('cough') || symptomsText.includes('mild fever') || symptomsText.includes('fatigue')) {
    moderateFlags++;
  }

  if (isPregnant && highFlags > 0) {
    urgentFlags++;
  } else if (isPregnant) {
    moderateFlags++;
  }

  if (chronicConditions.length > 0) {
    moderateFlags++;
  }

  if (urgentFlags > 0) return 'URGENT';
  if (highFlags > 0) return 'HIGH';
  if (moderateFlags > 0) return 'MODERATE';
  return 'ROUTINE';
}

export function calculateInterventionPriority(patient: Patient): InterventionPriorityOutput {
  const risk = predictFollowupRisk(patient);
  const clinical = patient.clinicalPriority || 'ROUTINE';

  let intervention: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  const recommendedInterventions: string[] = [...risk.recommendedActions];

  if (clinical === 'URGENT' || (risk.riskLevel === 'HIGH' && clinical === 'HIGH')) {
    intervention = 'CRITICAL';
    recommendedInterventions.unshift('Immediate health worker home intervention & urgent doctor escalation');
  } else if (clinical === 'HIGH' || risk.riskLevel === 'HIGH') {
    intervention = 'HIGH';
    recommendedInterventions.unshift('ASHA worker phone contact within 24 hours & transport assistance check');
  } else if (clinical === 'MODERATE' || risk.riskLevel === 'MEDIUM') {
    intervention = 'MEDIUM';
    recommendedInterventions.unshift('Send localized voice reminder & verify medicine availability at local PHC');
  } else {
    intervention = 'LOW';
    recommendedInterventions.unshift('Standard automated reminder SMS');
  }

  return {
    followupRiskScore: risk.riskScore,
    clinicalPriority: clinical,
    interventionPriority: intervention,
    recommendedInterventions,
  };
}
