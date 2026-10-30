/**
 * EMI & Loan Calculator Engine
 * Handles Home, Car, & Personal Loan calculations, Chart.js donut chart, and Amortization schedule.
 */

document.addEventListener('DOMContentLoaded', () => {
  initEmiCalculator();
});

let emiChart = null;

function initEmiCalculator() {
  const amountSlider = document.getElementById('emi-amount-slider');
  const amountInput = document.getElementById('emi-amount-input');
  const rateSlider = document.getElementById('emi-rate-slider');
  const rateInput = document.getElementById('emi-rate-input');
  const tenureSlider = document.getElementById('emi-tenure-slider');
  const tenureInput = document.getElementById('emi-tenure-input');
  const tenureUnitBtns = document.querySelectorAll('.tenure-unit-btn');
  const loanPresetBtns = document.querySelectorAll('.loan-preset-btn');
  const toggleAmortizationBtn = document.getElementById('toggle-amortization-btn');
  const amortizationWrap = document.getElementById('amortization-wrap');

  let tenureUnit = 'years'; // 'years' or 'months'

  // Presets configuration
  const presets = {
    home: { amount: 3000000, rate: 8.5, tenure: 20, unit: 'years' },
    car: { amount: 800000, rate: 9.0, tenure: 5, unit: 'years' },
    personal: { amount: 300000, rate: 12.5, tenure: 3, unit: 'years' }
  };

  // Sync Slider <-> Input
  function syncInputs(slider, input, callback) {
    slider.addEventListener('input', () => {
      input.value = slider.value;
      callback();
    });
    input.addEventListener('input', () => {
      slider.value = input.value;
      callback();
    });
  }

  syncInputs(amountSlider, amountInput, calculateEMI);
  syncInputs(rateSlider, rateInput, calculateEMI);
  syncInputs(tenureSlider, tenureInput, calculateEMI);

  // Tenure Unit Toggle
  tenureUnitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tenureUnitBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tenureUnit = btn.dataset.unit;
      
      if (tenureUnit === 'years') {
        tenureSlider.max = 30;
        tenureSlider.min = 1;
        tenureSlider.value = Math.min(30, Math.max(1, Math.round(tenureInput.value / 12) || 1));
        tenureInput.value = tenureSlider.value;
        document.getElementById('tenure-label-unit').textContent = 'Years';
      } else {
        tenureSlider.max = 360;
        tenureSlider.min = 6;
        tenureSlider.value = Math.max(6, Math.round(tenureInput.value * 12) || 12);
        tenureInput.value = tenureSlider.value;
        document.getElementById('tenure-label-unit').textContent = 'Months';
      }
      calculateEMI();
    });
  });

  // Preset Buttons
  loanPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      loanPresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.dataset.preset;
      const data = presets[presetKey];
      if (data) {
        amountSlider.value = data.amount;
        amountInput.value = data.amount;
        rateSlider.value = data.rate;
        rateInput.value = data.rate;
        
        // Match tenure unit
        tenureUnitBtns.forEach(b => {
          if (b.dataset.unit === data.unit) b.click();
        });
        tenureSlider.value = data.tenure;
        tenureInput.value = data.tenure;
        calculateEMI();
      }
    });
  });

  // Toggle Amortization table
  if (toggleAmortizationBtn && amortizationWrap) {
    toggleAmortizationBtn.addEventListener('click', () => {
      const isHidden = amortizationWrap.style.display === 'none' || !amortizationWrap.style.display;
      amortizationWrap.style.display = isHidden ? 'block' : 'none';
      toggleAmortizationBtn.innerHTML = isHidden 
        ? '<span>📊</span> Hide Repayment Schedule' 
        : '<span>📊</span> View Yearly Amortization Schedule';
    });
  }

  // Initial Calculation
  calculateEMI();
}

function calculateEMI() {
  const principal = parseFloat(document.getElementById('emi-amount-input').value) || 0;
  const annualRate = parseFloat(document.getElementById('emi-rate-input').value) || 0;
  const tenureVal = parseFloat(document.getElementById('emi-tenure-input').value) || 0;
  const activeUnitBtn = document.querySelector('.tenure-unit-btn.active');
  const isMonths = activeUnitBtn && activeUnitBtn.dataset.unit === 'months';
  
  const totalMonths = isMonths ? tenureVal : (tenureVal * 12);

  if (principal <= 0 || annualRate <= 0 || totalMonths <= 0) {
    return;
  }

  const monthlyRate = (annualRate / 12) / 100;
  
  // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - principal;

  // Format currency
  const formatINR = (val) => '₹' + Math.round(val).toLocaleString('en-IN');

  document.getElementById('res-monthly-emi').textContent = formatINR(emi);
  document.getElementById('res-principal-amt').textContent = formatINR(principal);
  document.getElementById('res-total-interest').textContent = formatINR(totalInterest);
  document.getElementById('res-total-payment').textContent = formatINR(totalPayment);

  // Update Doughnut Chart
  updateEmiChart(principal, totalInterest);

  // Build Yearly Amortization Schedule
  renderAmortizationSchedule(principal, monthlyRate, emi, totalMonths);
}

function updateEmiChart(principal, interest) {
  const ctx = document.getElementById('emiDonutChart');
  if (!ctx) return;

  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  const textColor = isDark ? '#f9fafb' : '#0f172a';

  const chartData = {
    labels: ['Principal Amount', 'Total Interest'],
    datasets: [{
      data: [Math.round(principal), Math.round(interest)],
      backgroundColor: ['#6366f1', '#f59e0b'],
      borderWidth: 0,
      hoverOffset: 6
    }]
  };

  if (emiChart) {
    emiChart.data = chartData;
    emiChart.options.plugins.legend.labels.color = textColor;
    emiChart.update();
  } else {
    emiChart = new Chart(ctx, {
      type: 'doughnut',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: { family: 'Inter', size: 12 },
              padding: 16
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const val = '₹' + Math.round(context.raw).toLocaleString('en-IN');
                const total = principal + interest;
                const pct = ((context.raw / total) * 100).toFixed(1) + '%';
                return ` ${label}: ${val} (${pct})`;
              }
            }
          }
        },
        cutout: '72%'
      }
    });
  }
}

function renderAmortizationSchedule(principal, monthlyRate, emi, totalMonths) {
  const tbody = document.getElementById('amortization-tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  let balance = principal;
  let yearNumber = 1;
  let yearlyPrincipal = 0;
  let yearlyInterest = 0;

  for (let m = 1; m <= totalMonths; m++) {
    const interestForMonth = balance * monthlyRate;
    const principalForMonth = emi - interestForMonth;
    balance -= principalForMonth;
    if (balance < 0) balance = 0;

    yearlyPrincipal += principalForMonth;
    yearlyInterest += interestForMonth;

    if (m % 12 === 0 || m === totalMonths) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>Year ${yearNumber}</strong></td>
        <td>₹${Math.round(yearlyPrincipal).toLocaleString('en-IN')}</td>
        <td>₹${Math.round(yearlyInterest).toLocaleString('en-IN')}</td>
        <td>₹${Math.round(yearlyPrincipal + yearlyInterest).toLocaleString('en-IN')}</td>
        <td>₹${Math.round(balance).toLocaleString('en-IN')}</td>
      `;
      tbody.appendChild(tr);

      yearNumber++;
      yearlyPrincipal = 0;
      yearlyInterest = 0;
    }
  }
}
