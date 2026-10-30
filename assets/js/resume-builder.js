/**
 * 1-Page Instant Resume & CV Builder Engine
 * Synchronizes form inputs live with the A4 resume sheet and supports 1-click PDF print.
 */

document.addEventListener('DOMContentLoaded', () => {
  initResumeBuilder();
});

function initResumeBuilder() {
  const printBtn = document.getElementById('print-resume-btn');
  const loadSampleBtn = document.getElementById('load-sample-btn');
  const clearBtn = document.getElementById('clear-resume-btn');
  const themeColorSelect = document.getElementById('resume-theme-color');

  // Input elements
  const inputs = {
    name: document.getElementById('res-input-name'),
    title: document.getElementById('res-input-title'),
    email: document.getElementById('res-input-email'),
    phone: document.getElementById('res-input-phone'),
    location: document.getElementById('res-input-location'),
    summary: document.getElementById('res-input-summary'),
    edu1Deg: document.getElementById('res-input-edu1-deg'),
    edu1Col: document.getElementById('res-input-edu1-col'),
    edu1Yr: document.getElementById('res-input-edu1-yr'),
    edu1Score: document.getElementById('res-input-edu1-score'),
    edu2Deg: document.getElementById('res-input-edu2-deg'),
    edu2Col: document.getElementById('res-input-edu2-col'),
    edu2Yr: document.getElementById('res-input-edu2-yr'),
    edu2Score: document.getElementById('res-input-edu2-score'),
    expTitle: document.getElementById('res-input-exp-title'),
    expOrg: document.getElementById('res-input-exp-org'),
    expDuration: document.getElementById('res-input-exp-duration'),
    expDesc: document.getElementById('res-input-exp-desc'),
    skills: document.getElementById('res-input-skills'),
    languages: document.getElementById('res-input-languages'),
    father: document.getElementById('res-input-father'),
    dob: document.getElementById('res-input-dob')
  };

  function updateResume() {
    document.getElementById('prev-name').textContent = inputs.name.value || 'Your Full Name';
    document.getElementById('prev-title').textContent = inputs.title.value || 'Professional Title / Target Role';

    // Contacts
    const contacts = [];
    if (inputs.phone.value) contacts.push(`📞 ${inputs.phone.value}`);
    if (inputs.email.value) contacts.push(`✉️ ${inputs.email.value}`);
    if (inputs.location.value) contacts.push(`📍 ${inputs.location.value}`);
    document.getElementById('prev-contacts').innerHTML = contacts.map(c => `<span>${c}</span>`).join(' • ');

    // Summary
    const summarySec = document.getElementById('prev-sec-summary');
    if (inputs.summary.value.trim()) {
      summarySec.style.display = 'block';
      document.getElementById('prev-summary').textContent = inputs.summary.value;
    } else {
      summarySec.style.display = 'none';
    }

    // Education 1
    document.getElementById('prev-edu1-deg').textContent = inputs.edu1Deg.value || 'Bachelor Degree';
    document.getElementById('prev-edu1-col').textContent = inputs.edu1Col.value || 'University / College Name';
    document.getElementById('prev-edu1-yr').textContent = inputs.edu1Yr.value || '2024';
    document.getElementById('prev-edu1-score').textContent = inputs.edu1Score.value ? ` | Score: ${inputs.edu1Score.value}` : '';

    // Education 2
    const edu2Item = document.getElementById('prev-edu2-item');
    if (inputs.edu2Deg.value.trim()) {
      edu2Item.style.display = 'block';
      document.getElementById('prev-edu2-deg').textContent = inputs.edu2Deg.value;
      document.getElementById('prev-edu2-col').textContent = inputs.edu2Col.value;
      document.getElementById('prev-edu2-yr').textContent = inputs.edu2Yr.value;
      document.getElementById('prev-edu2-score').textContent = inputs.edu2Score.value ? ` | Score: ${inputs.edu2Score.value}` : '';
    } else {
      edu2Item.style.display = 'none';
    }

    // Experience / Project
    const expSec = document.getElementById('prev-sec-exp');
    if (inputs.expTitle.value.trim()) {
      expSec.style.display = 'block';
      document.getElementById('prev-exp-title').textContent = inputs.expTitle.value;
      document.getElementById('prev-exp-org').textContent = inputs.expOrg.value;
      document.getElementById('prev-exp-duration').textContent = inputs.expDuration.value;
      document.getElementById('prev-exp-desc').textContent = inputs.expDesc.value;
    } else {
      expSec.style.display = 'none';
    }

    // Skills
    const skillsSec = document.getElementById('prev-sec-skills');
    const rawSkills = inputs.skills.value.trim();
    if (rawSkills) {
      skillsSec.style.display = 'block';
      const skillPills = rawSkills.split(',').map(s => s.trim()).filter(Boolean);
      document.getElementById('prev-skills').innerHTML = skillPills.map(s => `<span class="skill-tag-pill">${s}</span>`).join(' ');
    } else {
      skillsSec.style.display = 'none';
    }

    // Personal & Languages
    const personalSec = document.getElementById('prev-sec-personal');
    const details = [];
    if (inputs.languages.value.trim()) details.push(`<strong>Languages:</strong> ${inputs.languages.value}`);
    if (inputs.dob.value.trim()) details.push(`<strong>DOB:</strong> ${inputs.dob.value}`);
    if (inputs.father.value.trim()) details.push(`<strong>Guardian / Father:</strong> ${inputs.father.value}`);

    if (details.length > 0) {
      personalSec.style.display = 'block';
      document.getElementById('prev-personal').innerHTML = details.join(' &nbsp;|&nbsp; ');
    } else {
      personalSec.style.display = 'none';
    }
  }

  // Listen to all inputs
  Object.values(inputs).forEach(input => {
    if (input) input.addEventListener('input', updateResume);
  });

  // Theme Accent
  if (themeColorSelect) {
    themeColorSelect.addEventListener('change', () => {
      const color = themeColorSelect.value;
      document.querySelectorAll('.resume-sec-title').forEach(t => t.style.borderBottomColor = color);
      const sub = document.getElementById('prev-title');
      if (sub) sub.style.color = color;
    });
  }

  // Load Sample Data
  if (loadSampleBtn) {
    loadSampleBtn.addEventListener('click', () => {
      inputs.name.value = 'David R. Anderson';
      inputs.title.value = 'Operations Analyst & Data Specialist';
      inputs.email.value = 'david.anderson@email.com';
      inputs.phone.value = '+1 (555) 234-5678';
      inputs.location.value = 'New York, NY';
      inputs.summary.value = 'Proactive and detail-oriented graduate with strong skills in business operations, data analytics, and process automation. Proficient in MS Office suite, advanced Excel reporting, and touch typing. Committed to optimizing operational efficiency and delivering high quality results.';
      inputs.edu1Deg.value = 'B.S. in Information Systems & Analytics';
      inputs.edu1Col.value = 'State University of New York';
      inputs.edu1Yr.value = '2023';
      inputs.edu1Score.value = '3.8 GPA (Magna Cum Laude)';
      inputs.edu2Deg.value = 'High School Diploma (Science & Math)';
      inputs.edu2Col.value = 'Collegiate Preparatory Academy';
      inputs.edu2Yr.value = '2019';
      inputs.edu2Score.value = 'Honor Graduate';
      inputs.expTitle.value = 'Operations & Reporting Specialist Intern';
      inputs.expOrg.value = 'Apex Solutions Group';
      inputs.expDuration.value = '2023 - 2024';
      inputs.expDesc.value = 'Coordinated daily MIS reporting, automated weekly data pipelines using Excel macros, and verified document compliance across multi-disciplinary project teams.';
      inputs.skills.value = 'Advanced Excel, Data Reporting, Workflow Automation, Touch Typing (50+ WPM), SQL Fundamentals, Project Coordination';
      inputs.languages.value = 'English (Native), Spanish (Conversational)';
      inputs.father.value = 'Robert Anderson';
      inputs.dob.value = '15/08/2001';

      updateResume();
      if (window.showToast) window.showToast('✅ Sample data loaded! You can customize every section.');
    });
  }

  // Clear Resume
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all form fields?')) {
        Object.values(inputs).forEach(input => { if (input) input.value = ''; });
        updateResume();
        if (window.showToast) window.showToast('Form fields cleared.');
      }
    });
  }

  // Print / Save as PDF
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // Initial load with default sample
  if (loadSampleBtn) loadSampleBtn.click();
}
