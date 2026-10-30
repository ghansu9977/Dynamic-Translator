/**
 * Exact Age & Date Difference Calculator Logic
 * High-precision calendar math for Govt Exam Eligibility and Cut-off Dates.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAgeCalculator();
});

function initAgeCalculator() {
  const dobInput = document.getElementById('dob-input');
  const targetDateInput = document.getElementById('target-date-input');
  const calcBtn = document.getElementById('calc-age-btn');
  const resetBtn = document.getElementById('reset-age-btn');

  const resultContainer = document.getElementById('age-results-container');
  const yearsVal = document.getElementById('age-years-val');
  const monthsVal = document.getElementById('age-months-val');
  const daysVal = document.getElementById('age-days-val');

  const nextBdayDays = document.getElementById('next-bday-days');
  const nextBdayMonths = document.getElementById('next-bday-months');
  const bornDayOfWeek = document.getElementById('born-day-name');
  const zodiacSign = document.getElementById('zodiac-sign-val');

  const totalDaysVal = document.getElementById('stat-total-days');
  const totalWeeksVal = document.getElementById('stat-total-weeks');
  const totalHoursVal = document.getElementById('stat-total-hours');
  const totalMinutesVal = document.getElementById('stat-total-minutes');

  // Set default target date to Today
  const today = new Date();
  const todayFormatted = today.toISOString().split('T')[0];
  if (targetDateInput) {
    targetDateInput.value = todayFormatted;
    targetDateInput.max = '2099-12-31';
  }

  // Set default sample DOB (e.g. 2000-01-01) for instant preview
  if (dobInput) {
    dobInput.value = '2000-01-01';
    dobInput.max = todayFormatted;
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', calculateExactAge);
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      dobInput.value = '2000-01-01';
      targetDateInput.value = todayFormatted;
      calculateExactAge();
    });
  }

  // Quick Cut-off Presets for Govt Exams (SSC 1st Aug, UPSC 1st Aug, etc.)
  const cutoffPills = document.querySelectorAll('.cutoff-preset-btn');
  cutoffPills.forEach(pill => {
    pill.addEventListener('click', () => {
      cutoffPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cutoffVal = pill.getAttribute('data-date');
      if (targetDateInput) {
        targetDateInput.value = cutoffVal;
        calculateExactAge();
      }
    });
  });

  function calculateExactAge() {
    if (!dobInput.value || !targetDateInput.value) {
      alert('Please select both dates (Date of Birth and Target Date).');
      return;
    }

    const birthDate = new Date(dobInput.value + 'T00:00:00');
    const targetDate = new Date(targetDateInput.value + 'T00:00:00');

    if (birthDate > targetDate) {
      alert('Date of birth must be earlier than the target / cut-off date!');
      return;
    }

    let years = targetDate.getFullYear() - birthDate.getFullYear();
    let months = targetDate.getMonth() - birthDate.getMonth();
    let days = targetDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // Get days in the previous month of targetDate
      const prevMonthLastDay = new Date(targetDate.getFullYear(), targetDate.getMonth(), 0).getDate();
      days += prevMonthLastDay;
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Update Primary Result Cards
    if (yearsVal) yearsVal.textContent = years;
    if (monthsVal) monthsVal.textContent = months;
    if (daysVal) daysVal.textContent = days;

    // Total Milestones
    const diffTime = Math.abs(targetDate - birthDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffHours = diffDays * 24;
    const diffMinutes = diffHours * 60;

    if (totalDaysVal) totalDaysVal.textContent = diffDays.toLocaleString('en-IN');
    if (totalWeeksVal) totalWeeksVal.textContent = diffWeeks.toLocaleString('en-IN');
    if (totalHoursVal) totalHoursVal.textContent = diffHours.toLocaleString('en-IN');
    if (totalMinutesVal) totalMinutesVal.textContent = diffMinutes.toLocaleString('en-IN');

    // Next Birthday Calculation
    let nextBday = new Date(targetDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    if (nextBday < targetDate) {
      nextBday.setFullYear(targetDate.getFullYear() + 1);
    }

    let bdayMonths = nextBday.getMonth() - targetDate.getMonth();
    let bdayDays = nextBday.getDate() - targetDate.getDate();

    if (bdayDays < 0) {
      bdayMonths--;
      const prevMonthLastDay = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0).getDate();
      bdayDays += prevMonthLastDay;
    }
    if (bdayMonths < 0) {
      bdayMonths += 12;
    }

    if (nextBdayMonths) nextBdayMonths.textContent = bdayMonths;
    if (nextBdayDays) nextBdayDays.textContent = bdayDays;

    // Day of the week born
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (bornDayOfWeek) {
      bornDayOfWeek.textContent = daysOfWeek[birthDate.getDay()];
    }

    // Zodiac Sign
    if (zodiacSign) {
      zodiacSign.textContent = getZodiacSign(birthDate.getMonth() + 1, birthDate.getDate());
    }

    if (resultContainer) resultContainer.style.display = 'block';
  }

  function getZodiacSign(month, day) {
    if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) return 'Aquarius ♒';
    if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) return 'Pisces ♓';
    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) return 'Aries ♈';
    if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) return 'Taurus ♉';
    if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) return 'Gemini ♊';
    if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) return 'Cancer ♋';
    if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) return 'Leo ♌';
    if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) return 'Virgo ♍';
    if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) return 'Libra ♎';
    if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) return 'Scorpio ♏';
    if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) return 'Sagittarius ♐';
    return 'Capricorn ♑';
  }

  // Trigger initial calculation
  calculateExactAge();
}
