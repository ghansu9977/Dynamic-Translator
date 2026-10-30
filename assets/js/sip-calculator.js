/**
 * SIP & Lumpsum Calculator Logic
 * Mathematical engine for compound mutual fund calculations with dynamic Chart.js visualization.
 */

document.addEventListener('DOMContentLoaded', () => {
  initSipCalculator();
});

function initSipCalculator() {
  const typeBtns = document.querySelectorAll('.calc-type-btn');
  const amountInput = document.getElementById('calc-amount-input');
  const amountSlider = document.getElementById('calc-amount-slider');
  const rateInput = document.getElementById('calc-rate-input');
  const rateSlider = document.getElementById('calc-rate-slider');
  const yearsInput = document.getElementById('calc-years-input');
  const yearsSlider = document.getElementById('calc-years-slider');

  const amountLabel = document.getElementById('amount-field-label');
  const totalInvestedDisplay = document.getElementById('total-invested-display');
  const estReturnsDisplay = document.getElementById('est-returns-display');
  const futureValueDisplay = document.getElementById('future-value-display');
  const breakdownTbody = document.getElementById('growth-breakdown-tbody');

  let calcType = 'sip'; // 'sip' or 'lumpsum'
  let sipChart = null;

  // Sync Input and Slider Helpers
  function bindInputSlider(input, slider, callback) {
    if (!input || !slider) return;
    input.addEventListener('input', () => {
      slider.value = input.value;
      callback();
    });
    slider.addEventListener('input', () => {
      input.value = slider.value;
      callback();
    });
  }

  bindInputSlider(amountInput, amountSlider, calculateReturns);
  bindInputSlider(rateInput, rateSlider, calculateReturns);
  bindInputSlider(yearsInput, yearsSlider, calculateReturns);

  // Switch between SIP & Lumpsum
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      typeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      calcType = btn.getAttribute('data-type');

      if (amountLabel) {
        amountLabel.textContent = calcType === 'sip' ? 'Monthly Investment:' : 'Total Lumpsum Investment:';
      }

      if (calcType === 'lumpsum') {
        if (parseInt(amountInput.value, 10) < 25000) {
          amountInput.value = 50000;
          amountSlider.value = 50000;
        }
        amountSlider.max = 1000000;
        amountSlider.step = 5000;
      } else {
        amountSlider.max = 100000;
        amountSlider.step = 500;
      }

      calculateReturns();
    });
  });

  // Currency formatter for Indian Rupee
  function formatINR(number) {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(number);
  }

  // Core Calculation Formula
  function calculateReturns() {
    const P = parseFloat(amountInput.value) || 0;
    const rAnnual = parseFloat(rateInput.value) || 0;
    const tYears = parseInt(yearsInput.value, 10) || 0;

    let totalInvested = 0;
    let futureValue = 0;
    let estimatedReturns = 0;
    const yearlyData = [];

    if (calcType === 'sip') {
      // Monthly compounding SIP formula:
      // M = P * [ (1 + i)^n - 1 ] * (1 + i) / i
      const iMonthly = (rAnnual / 100) / 12;
      const totalMonths = tYears * 12;

      totalInvested = P * totalMonths;

      if (iMonthly > 0) {
        futureValue = P * ((Math.pow(1 + iMonthly, totalMonths) - 1) / iMonthly) * (1 + iMonthly);
      } else {
        futureValue = totalInvested;
      }

      // Year-by-year milestone data
      for (let y = 1; y <= tYears; y++) {
        const m = y * 12;
        const inv = P * m;
        const fv = iMonthly > 0 ? P * ((Math.pow(1 + iMonthly, m) - 1) / iMonthly) * (1 + iMonthly) : inv;
        yearlyData.push({
          year: y,
          invested: inv,
          returns: fv - inv,
          total: fv
        });
      }
    } else {
      // Lumpsum Compound Interest Formula:
      // A = P * (1 + r/100)^t
      totalInvested = P;
      futureValue = P * Math.pow(1 + (rAnnual / 100), tYears);

      for (let y = 1; y <= tYears; y++) {
        const fv = P * Math.pow(1 + (rAnnual / 100), y);
        yearlyData.push({
          year: y,
          invested: P,
          returns: fv - P,
          total: fv
        });
      }
    }

    estimatedReturns = futureValue - totalInvested;

    // Update DOM
    if (totalInvestedDisplay) totalInvestedDisplay.textContent = formatINR(Math.round(totalInvested));
    if (estReturnsDisplay) estReturnsDisplay.textContent = formatINR(Math.round(estimatedReturns));
    if (futureValueDisplay) futureValueDisplay.textContent = formatINR(Math.round(futureValue));

    // Render / Update Chart.js Doughnut
    updateChart(totalInvested, estimatedReturns);

    // Update Yearly Breakdown Table
    renderBreakdown(yearlyData);
  }

  function updateChart(invested, returns) {
    const ctx = document.getElementById('sip-doughnut-chart');
    if (!ctx) return;

    const data = {
      labels: ['Total Invested', 'Estimated Returns'],
      datasets: [{
        data: [Math.round(invested), Math.round(returns)],
        backgroundColor: [
          '#6366f1', // Indigo for invested
          '#10b981'  // Emerald for profit
        ],
        borderColor: ['rgba(99, 102, 241, 0.2)', 'rgba(16, 185, 129, 0.2)'],
        borderWidth: 2,
        hoverOffset: 6
      }]
    };

    if (sipChart) {
      sipChart.data = data;
      sipChart.update();
    } else if (typeof Chart !== 'undefined') {
      sipChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: document.documentElement.getAttribute('data-theme') === 'light' ? '#334155' : '#e2e8f0',
                font: {
                  family: "'Outfit', sans-serif",
                  size: 13,
                  weight: '600'
                },
                padding: 16
              }
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return ` ${context.label}: ${formatINR(context.raw)}`;
                }
              }
            }
          },
          cutout: '70%'
        }
      });
    }
  }

  function renderBreakdown(data) {
    if (!breakdownTbody) return;
    breakdownTbody.innerHTML = '';

    // Show up to 10 rows or spaced intervals if > 10
    const step = data.length > 15 ? Math.ceil(data.length / 10) : 1;

    data.forEach((row, idx) => {
      if ((idx + 1) % step === 0 || idx === data.length - 1) {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border);">Year ${row.year}</td>
          <td style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border);">${formatINR(Math.round(row.invested))}</td>
          <td style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); color: var(--accent-emerald); font-weight: 600;">+${formatINR(Math.round(row.returns))}</td>
          <td style="padding: 0.75rem 1rem; border-bottom: 1px solid var(--border); font-weight: 700;">${formatINR(Math.round(row.total))}</td>
        `;
        breakdownTbody.appendChild(tr);
      }
    });
  }

  // Initial calculation on load
  calculateReturns();
}
