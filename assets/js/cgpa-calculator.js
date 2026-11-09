/**
 * CGPA to Percentage & Marks Calculator Engine
 * Handles CBSE (x 9.5), AICTE / College scale, Marks Percentage, and Multi-semester SGPA.
 */

document.addEventListener('DOMContentLoaded', () => {
  initCgpaCalculator();
});

function initCgpaCalculator() {
  const tabs = document.querySelectorAll('.cgpa-tab-btn');
  const sections = document.querySelectorAll('.cgpa-calc-sec');
  const resultCards = document.querySelectorAll('.cgpa-res-card');

  // Mode switching
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      sections.forEach(s => s.style.display = 'none');
      resultCards.forEach(rc => rc.style.display = 'none');

      tab.classList.add('active');
      const targetId = tab.dataset.target;
      const targetSec = document.getElementById(targetId);
      if (targetSec) targetSec.style.display = 'block';

      const targetResCard = document.getElementById('card-' + targetId);
      if (targetResCard) {
        targetResCard.style.display = 'block';
      }
    });
  });

  // Mode 1: CBSE CGPA
  const cbseInput = document.getElementById('cbse-cgpa-input');
  const cbseSlider = document.getElementById('cbse-cgpa-slider');
  if (cbseInput && cbseSlider) {
    function calcCbse() {
      const cgpa = parseFloat(cbseInput.value) || 0;
      const pct = (cgpa * 9.5).toFixed(2);
      const pctEl = document.getElementById('res-cbse-pct');
      const gradeEl = document.getElementById('res-cbse-grade');
      if (pctEl) pctEl.textContent = pct + '%';
      if (gradeEl) gradeEl.textContent = getGrade(parseFloat(pct));
    }
    cbseSlider.addEventListener('input', () => { cbseInput.value = cbseSlider.value; calcCbse(); });
    cbseInput.addEventListener('input', () => { cbseSlider.value = cbseSlider.value; calcCbse(); });
    calcCbse();
  }

  // Mode 2: College / AICTE Scale
  const colCgpaInput = document.getElementById('col-cgpa-input');
  const colScaleFormula = document.getElementById('col-scale-formula');
  if (colCgpaInput && colScaleFormula) {
    function calcCollege() {
      const cgpa = parseFloat(colCgpaInput.value) || 0;
      const formula = colScaleFormula.value;
      let pct = 0;

      if (formula === 'aicte') {
        // (CGPA - 0.75) * 10
        pct = Math.max(0, (cgpa - 0.75) * 10);
      } else if (formula === 'mul10') {
        // CGPA * 10
        pct = cgpa * 10;
      } else if (formula === 'mul9.5') {
        // CGPA * 9.5
        pct = cgpa * 9.5;
      } else if (formula === 'mumbai') {
        // (CGPA * 7.1) + 11
        pct = (cgpa * 7.1) + 11;
      }

      const colPctEl = document.getElementById('res-col-pct');
      const colGradeEl = document.getElementById('res-col-grade');
      if (colPctEl) colPctEl.textContent = pct.toFixed(2) + '%';
      if (colGradeEl) colGradeEl.textContent = getGrade(pct);
    }
    colCgpaInput.addEventListener('input', calcCollege);
    colScaleFormula.addEventListener('change', calcCollege);
    calcCollege();
  }

  // Mode 3: Marks to Percentage
  const marksObtained = document.getElementById('marks-obtained');
  const marksTotal = document.getElementById('marks-total');
  if (marksObtained && marksTotal) {
    function calcMarks() {
      const obt = parseFloat(marksObtained.value) || 0;
      const tot = parseFloat(marksTotal.value) || 1;
      if (tot > 0) {
        const pct = (obt / tot) * 100;
        const marksPctEl = document.getElementById('res-marks-pct');
        const divEl = document.getElementById('res-marks-div');
        if (marksPctEl) marksPctEl.textContent = pct.toFixed(2) + '%';

        if (divEl) {
          if (pct >= 75) {
            divEl.textContent = '🌟 First Division with Distinction';
            divEl.style.color = 'var(--accent-emerald)';
          } else if (pct >= 60) {
            divEl.textContent = '🥇 First Division';
            divEl.style.color = 'var(--primary)';
          } else if (pct >= 45) {
            divEl.textContent = '🥈 Second Division';
            divEl.style.color = 'var(--accent-amber)';
          } else if (pct >= 33) {
            divEl.textContent = '🥉 Third Division';
            divEl.style.color = 'var(--text-muted)';
          } else {
            divEl.textContent = '❌ Failed';
            divEl.style.color = 'var(--accent-rose)';
          }
        }
      }
    }
    marksObtained.addEventListener('input', calcMarks);
    marksTotal.addEventListener('input', calcMarks);
    calcMarks();
  }

  // Mode 4: Semester SGPA to CGPA
  const semInputs = document.querySelectorAll('.sem-sgpa-input');
  if (semInputs.length > 0) {
    function calcSgpa() {
      let sum = 0;
      let count = 0;
      semInputs.forEach(input => {
        const val = parseFloat(input.value);
        if (!isNaN(val) && val > 0) {
          sum += val;
          count++;
        }
      });

      const avgCgpa = count > 0 ? (sum / count) : 0;
      const eqPct = (avgCgpa * 9.5);
      const semCgpaEl = document.getElementById('res-sem-cgpa');
      const semPctEl = document.getElementById('res-sem-pct');
      const semCountEl = document.getElementById('res-sem-count');
      if (semCgpaEl) semCgpaEl.textContent = avgCgpa.toFixed(2);
      if (semPctEl) semPctEl.textContent = eqPct.toFixed(2) + '%';
      if (semCountEl) semCountEl.textContent = `${count} Semesters Included`;
    }
    semInputs.forEach(input => input.addEventListener('input', calcSgpa));
    calcSgpa();
  }
}

function getGrade(pct) {
  if (pct >= 90) return 'A+ Grade (Outstanding)';
  if (pct >= 80) return 'A Grade (Excellent)';
  if (pct >= 70) return 'B+ Grade (Very Good)';
  if (pct >= 60) return 'B Grade (Good / First Div)';
  if (pct >= 50) return 'C Grade (Average / Second Div)';
  if (pct >= 33) return 'D Grade (Pass)';
  return 'F Grade (Fail)';
}
