/**
 * Employment Timeline & Milestone Calculation Utility
 *
 * Rules:
 * 1. Company Joining Date: Day 1 (Initial / Internship Phase for 3 months)
 * 2. After 3 months: Probation starts (Probation Phase for 3 months)
 * 3. After 3 months of probation (Total 6 months from joining): Permanent Job Conversion
 *    -> Automatic confirmation and full equal leave entitlement unlocked (20/10/8/3).
 */

export function parseDateToYMD(dateInput) {
  if (!dateInput) {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }
  if (dateInput instanceof Date && !isNaN(dateInput)) {
    return dateInput.toISOString().split('T')[0];
  }

  const str = String(dateInput).trim();
  // Check if already YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    return str;
  }

  const parsed = new Date(str);
  if (!isNaN(parsed.getTime())) {
    const year = parsed.getFullYear();
    const month = String(parsed.getMonth() + 1).padStart(2, '0');
    const day = String(parsed.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function formatDateDisplay(dateInput) {
  const ymd = parseDateToYMD(dateInput);
  const [y, m, d] = ymd.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

export function addMonthsToYMD(ymdStr, monthsToAdd) {
  const [y, m, d] = ymdStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setMonth(date.getMonth() + monthsToAdd);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateEmploymentMilestones(joiningDateInput, referenceDate = new Date()) {
  const joinedYMD = parseDateToYMD(joiningDateInput);
  const probationStartYMD = addMonthsToYMD(joinedYMD, 3);
  const permanentYMD = addMonthsToYMD(joinedYMD, 6);

  const [jy, jm, jd] = joinedYMD.split('-').map(Number);
  const joinedDateObj = new Date(jy, jm - 1, jd);

  const [py, pm, pd] = probationStartYMD.split('-').map(Number);
  const probationDateObj = new Date(py, pm - 1, pd);

  const [cy, cm, cd] = permanentYMD.split('-').map(Number);
  const permanentDateObj = new Date(cy, cm - 1, cd);

  const refDateObj = new Date(referenceDate);
  refDateObj.setHours(0, 0, 0, 0);

  const msPerDay = 1000 * 60 * 60 * 24;

  const daysSinceJoining = Math.floor((refDateObj - joinedDateObj) / msPerDay);
  const daysToProbation = Math.ceil((probationDateObj - refDateObj) / msPerDay);
  const daysToPermanent = Math.ceil((permanentDateObj - refDateObj) / msPerDay);

  let currentStageKey = 'initial';
  let currentStageLabel = 'Initial / Internship Phase';
  let stageDescription = 'Month 1-3 from joining. Zero leave allocation.';
  let statusBadge = 'Initial / Trainee';
  let badgeColor = '#d97706';
  let badgeBg = '#fef3c7';
  let leavesEntitled = false;
  let suggestedType = 'Internship';
  let nextMilestoneText = '';
  let progressPercent = 0;

  if (refDateObj < probationDateObj) {
    currentStageKey = 'initial';
    currentStageLabel = 'Initial / Internship Phase (Month 1-3)';
    stageDescription = 'Initial orientation and training period. Probation starts after 3 months.';
    statusBadge = 'Intern / Trainee';
    badgeColor = '#b45309';
    badgeBg = '#fef3c7';
    leavesEntitled = false;
    suggestedType = 'Internship';
    const remaining = Math.max(1, daysToProbation);
    nextMilestoneText = `Probation starts in ${remaining} day${remaining === 1 ? '' : 's'} (${formatDateDisplay(probationStartYMD)})`;
    const totalFirstPhaseDays = Math.max(1, Math.floor((probationDateObj - joinedDateObj) / msPerDay));
    const elapsed = Math.max(0, daysSinceJoining);
    progressPercent = Math.min(33, Math.round((elapsed / totalFirstPhaseDays) * 33));
  } else if (refDateObj < permanentDateObj) {
    currentStageKey = 'probation';
    currentStageLabel = 'Active Probation Phase (Month 4-6)';
    stageDescription = '3-month performance evaluation period. Job converts to Permanent at 6 months.';
    statusBadge = 'On Probation';
    badgeColor = '#4338ca';
    badgeBg = '#e0e7ff';
    leavesEntitled = false;
    suggestedType = 'Probation';
    const remaining = Math.max(1, daysToPermanent);
    nextMilestoneText = `Permanent job conversion in ${remaining} day${remaining === 1 ? '' : 's'} (${formatDateDisplay(permanentYMD)})`;
    const totalProbDays = Math.max(1, Math.floor((permanentDateObj - probationDateObj) / msPerDay));
    const elapsed = Math.max(0, Math.floor((refDateObj - probationDateObj) / msPerDay));
    progressPercent = 33 + Math.min(66, Math.round((elapsed / totalProbDays) * 66));
  } else {
    currentStageKey = 'permanent';
    currentStageLabel = 'Permanent Confirmed Employee';
    stageDescription = 'Completed initial and probation milestones (6+ months). Standard leave entitlement active.';
    statusBadge = 'Permanent';
    badgeColor = '#15803d';
    badgeBg = '#dcfce7';
    leavesEntitled = true;
    suggestedType = 'Permanent';
    nextMilestoneText = `Converted to Permanent on ${formatDateDisplay(permanentYMD)}`;
    progressPercent = 100;
  }

  return {
    joinedDateStr: formatDateDisplay(joinedYMD),
    joinedDateYMD: joinedYMD,
    probationStartDateStr: formatDateDisplay(probationStartYMD),
    probationStartDateYMD: probationStartYMD,
    permanentDateStr: formatDateDisplay(permanentYMD),
    permanentDateYMD: permanentYMD,
    daysSinceJoining,
    daysToProbation,
    daysToPermanent,
    currentStageKey,
    currentStageLabel,
    stageDescription,
    statusBadge,
    badgeColor,
    badgeBg,
    leavesEntitled,
    suggestedType,
    nextMilestoneText,
    progressPercent
  };
}
