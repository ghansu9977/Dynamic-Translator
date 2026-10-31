/**
 * RozgarTools - Free ATS Resume Checker & Score Calculator
 * 100% Client-Side In-Browser PDF Text Extraction & ATS Algorithmic Evaluation
 */

document.addEventListener('DOMContentLoaded', () => {
  initAtsResumeChecker();
});

function initAtsResumeChecker() {
  const dropZone = document.getElementById('ats-dropzone');
  const fileInput = document.getElementById('ats-file-input');
  const browseBtn = document.getElementById('ats-browse-btn');
  const resumeTextInput = document.getElementById('ats-resume-text');
  const jobDescInput = document.getElementById('ats-job-desc');
  const analyzeBtn = document.getElementById('ats-analyze-btn');
  const sampleBtn = document.getElementById('ats-load-sample-btn');

  // Results Section
  const resultsCard = document.getElementById('ats-results-section');
  const resultsPlaceholder = document.getElementById('ats-results-placeholder');
  const scoreNumElem = document.getElementById('ats-score-num');
  const scoreGaugeVal = document.getElementById('ats-gauge-val');
  const scoreStatusPill = document.getElementById('ats-status-pill');
  const scoreSummaryText = document.getElementById('ats-score-summary');

  // Breakdown Bars
  const barContact = document.getElementById('bar-contact');
  const valContact = document.getElementById('val-contact');
  const barSections = document.getElementById('bar-sections');
  const valSections = document.getElementById('val-sections');
  const barAction = document.getElementById('bar-action');
  const valAction = document.getElementById('val-action');
  const barSkills = document.getElementById('bar-skills');
  const valSkills = document.getElementById('val-skills');
  const barFormat = document.getElementById('bar-format');
  const valFormat = document.getElementById('val-format');

  // Findings & Skills
  const findingsContainer = document.getElementById('ats-findings-container');
  const skillsCloud = document.getElementById('ats-skills-cloud');
  const jobMatchBox = document.getElementById('ats-job-match-box');
  const jobMatchPercent = document.getElementById('ats-job-match-percent');

  let currentRawText = '';
  let currentFileName = '';

  // Dictionaries
  const ACTION_VERBS = [
    'developed', 'managed', 'created', 'implemented', 'designed', 'optimized',
    'increased', 'decreased', 'reduced', 'spearheaded', 'collaborated', 'analyzed',
    'built', 'engineered', 'launched', 'delivered', 'improved', 'automated',
    'negotiated', 'trained', 'led', 'established', 'initiated', 'resolved',
    'executed', 'formulated', 'streamlined', 'generated', 'supervised', 'directed'
  ];

  const COMMON_SKILLS = [
    'python', 'javascript', 'typescript', 'react', 'node.js', 'sql', 'html', 'css',
    'git', 'github', 'docker', 'aws', 'cloud', 'mongodb', 'postgresql', 'c++', 'java',
    'c#', 'flutter', 'dart', 'rest api', 'graphql', 'machine learning', 'ai', 'data analysis',
    'excel', 'powerpoint', 'word', 'communication', 'leadership', 'teamwork', 'problem solving',
    'project management', 'agile', 'scrum', 'marketing', 'sales', 'seo', 'customer service',
    'accounting', 'financial analysis', 'public speaking', 'negotiation', 'critical thinking'
  ];

  // File Upload Handlers
  if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      fileInput.click();
    });
  }

  if (dropZone && fileInput) {
    dropZone.addEventListener('click', () => fileInput.click());

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFile(e.target.files[0]);
      }
    });
  }

  // Sample Resume Button
  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const sampleText = `Alex Sharma
Email: alex.sharma@example.com | Phone: +91 98765 43210
LinkedIn: linkedin.com/in/alex-sharma | GitHub: github.com/alex-sharma
Location: Bangalore, India

PROFESSIONAL SUMMARY
Results-driven Full Stack Software Developer with 3+ years of experience building scalable web applications. Spearheaded backend optimization reducing server response latency by 35%. Proficient in React, Node.js, Python, and AWS Cloud architecture.

WORK EXPERIENCE
Senior Frontend Developer | TechSolutions Corp (2024 - Present)
- Developed and launched 4 customer-facing web platforms utilizing React, Next.js, and TypeScript.
- Optimized core page load performance from 3.8s to 1.1s, increasing organic conversion rate by 22%.
- Collaborated with product managers and UX designers to implement accessible WCAG 2.1 compliance.
- Automated CI/CD deployment pipelines on AWS, reducing deployment cycle times by 40%.

Software Engineer | Alpha Innovations (2022 - 2024)
- Built high-throughput REST APIs in Node.js and PostgreSQL handling 2M+ monthly requests.
- Integrated payment gateways (Stripe & Razorpay) with 99.98% transaction reliability.
- Managed and mentored 3 junior developers in Clean Code and Agile Scrum methodology.

EDUCATION
Bachelor of Technology in Computer Science
XYZ Institute of Technology | CGPA: 8.8/10 (2018 - 2022)

TECHNICAL SKILLS
- Languages: JavaScript, TypeScript, Python, SQL, HTML5, CSS3
- Frameworks & Tools: React, Node.js, Express, Docker, Git, AWS, MongoDB, PostgreSQL
- Soft Skills: Leadership, Problem Solving, Cross-functional Communication, Project Management`;

      if (resumeTextInput) resumeTextInput.value = sampleText;
      currentRawText = sampleText;
      currentFileName = 'sample_software_resume.txt';
      if (dropZone) {
        dropZone.querySelector('.dropzone-title').textContent = '📄 Loaded Sample Resume (Ready to Analyze)';
      }
      runAnalysis(sampleText);
    });
  }

  async function handleFile(file) {
    currentFileName = file.name;
    const ext = file.name.split('.').pop().toLowerCase();

    if (dropZone) {
      dropZone.querySelector('.dropzone-title').textContent = `📄 Loading: ${file.name}...`;
    }

    if (ext === 'pdf') {
      try {
        currentRawText = await extractTextFromPdf(file);
        if (resumeTextInput) resumeTextInput.value = currentRawText;
        if (dropZone) dropZone.querySelector('.dropzone-title').textContent = `✅ Ready: ${file.name}`;
        runAnalysis(currentRawText);
      } catch (err) {
        console.error(err);
        alert('Could not read PDF. Please copy and paste the text manually into the box below.');
      }
    } else if (ext === 'txt') {
      const text = await file.text();
      currentRawText = text;
      if (resumeTextInput) resumeTextInput.value = text;
      if (dropZone) dropZone.querySelector('.dropzone-title').textContent = `✅ Ready: ${file.name}`;
      runAnalysis(text);
    } else {
      alert('Please upload a PDF (.pdf) or Text (.txt) file, or paste your resume text directly.');
    }
  }

  // PDF Text Extraction using pdf.js
  async function extractTextFromPdf(file) {
    if (!window.pdfjsLib) {
      await loadPdfJsLib();
    }
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n\n';
    }

    return fullText;
  }

  function loadPdfJsLib() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load PDF engine'));
      document.head.appendChild(script);
    });
  }

  // Trigger Button
  if (analyzeBtn) {
    analyzeBtn.addEventListener('click', () => {
      const text = resumeTextInput ? resumeTextInput.value.trim() : '';
      if (!text) {
        alert('Please upload your resume PDF or paste resume text to analyze.');
        return;
      }
      currentRawText = text;
      runAnalysis(text);
    });
  }

  // Comprehensive ATS Scoring Algorithm
  function runAnalysis(rawText) {
    if (!rawText || rawText.trim().length < 50) {
      alert('Resume text seems too short to analyze accurately. Please paste your complete resume.');
      return;
    }

    const textLower = rawText.toLowerCase();
    const words = rawText.match(/\b[A-Za-z0-9+#.-]+\b/g) || [];
    const wordCount = words.length;

    // 1. Contact Info & Presence (15 pts)
    let contactScore = 0;
    const findings = [];

    const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(rawText);
    const hasPhone = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,12}/.test(rawText);
    const hasLinkedIn = /linkedin\.com/i.test(rawText);
    const hasGitHubOrPort = /github\.com|portfolio|\.dev|\.io|behance|medium/i.test(rawText);

    if (hasEmail) contactScore += 5;
    if (hasPhone) contactScore += 4;
    if (hasLinkedIn) contactScore += 3;
    if (hasGitHubOrPort) contactScore += 3;

    if (hasEmail && hasPhone) {
      findings.push({ type: 'pass', text: '✅ Contact details (Email & Phone Number) are clearly formatted and easy for ATS parsers to extract.' });
    } else {
      findings.push({ type: 'fail', text: '❌ Missing clear Email address or Phone number at the top of your resume.' });
    }

    if (hasLinkedIn) {
      findings.push({ type: 'pass', text: '✅ LinkedIn profile link detected. Recruiters look for online professional verification.' });
    } else {
      findings.push({ type: 'warn', text: '⚠️ No LinkedIn profile link found. Adding your LinkedIn URL increases response rates by 40%.' });
    }

    // 2. Essential Sections (25 pts)
    let sectionsScore = 0;
    const hasExp = /experience|employment|work history|career history|internship/i.test(textLower);
    const hasEdu = /education|qualification|degree|university|bachelor|master|b\.tech|diploma/i.test(textLower);
    const hasSkills = /skills|technical skills|technologies|proficiencies|core competencies/i.test(textLower);
    const hasSummary = /summary|profile|about me|objective|professional summary/i.test(textLower);
    const hasProjects = /projects|certifications|awards|achievements|key projects/i.test(textLower);

    if (hasExp) sectionsScore += 6;
    if (hasEdu) sectionsScore += 6;
    if (hasSkills) sectionsScore += 5;
    if (hasSummary) sectionsScore += 4;
    if (hasProjects) sectionsScore += 4;

    if (hasExp && hasEdu && hasSkills) {
      findings.push({ type: 'pass', text: '✅ Standard ATS section headings detected (Experience, Education, Skills).' });
    } else {
      findings.push({ type: 'fail', text: '❌ Missing critical section headers. Ensure standard headings like "Work Experience", "Education", and "Skills" are clearly labeled.' });
    }

    if (!hasSummary) {
      findings.push({ type: 'warn', text: '⚠️ Missing Professional Summary. A 2-3 line summary at the top helps both ATS bots and recruiters grasp your core profile in 5 seconds.' });
    }

    // 3. Action Verbs & Measurable Metrics (20 pts)
    let actionScore = 0;
    const foundVerbs = [];
    ACTION_VERBS.forEach(verb => {
      if (textLower.includes(verb)) {
        foundVerbs.push(verb);
      }
    });

    const actionVerbRatio = Math.min(10, foundVerbs.length);
    actionScore += (actionVerbRatio / 10) * 10;

    // Numbers & Metrics (%, $, figures)
    const metricMatches = rawText.match(/\d+[\s]*(%|\$|k|m|million|crore|lakh|\+|x)\b|\b\d{2,}\b/gi) || [];
    const metricCount = metricMatches.length;
    const metricScore = Math.min(10, Math.round(metricCount * 1.5));
    actionScore += metricScore;

    if (foundVerbs.length >= 5) {
      findings.push({ type: 'pass', text: `✅ Strong action verbs used (${foundVerbs.slice(0, 5).join(', ')}, etc.) conveying proactivity.` });
    } else {
      findings.push({ type: 'warn', text: '⚠️ Low action verb density. Use power verbs like "Developed", "Spearheaded", "Optimized", "Engineered" rather than passive phrasing.' });
    }

    if (metricCount >= 4) {
      findings.push({ type: 'pass', text: `✅ Measurable impact & metrics found (${metricCount} quantifiable data points like %, numbers, revenue).` });
    } else {
      findings.push({ type: 'fail', text: '❌ Lacks quantifiable metrics. Add numbers (e.g. "Increased speed by 30%", "Managed team of 5", "Handled 10,000+ records") to prove results.' });
    }

    // 4. Skills & Keyword Density (20 pts)
    let skillsScore = 0;
    const detectedSkills = [];
    function escapeRegExp(str) {
      return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    COMMON_SKILLS.forEach(skill => {
      const escaped = escapeRegExp(skill);
      const reg = new RegExp('(^|[^a-zA-Z0-9+#])' + escaped + '([^a-zA-Z0-9+#]|$)', 'i');
      if (reg.test(textLower)) {
        detectedSkills.push(skill);
      }
    });

    const detectedCount = detectedSkills.length;
    skillsScore = Math.min(20, Math.round(detectedCount * 2.2));

    if (detectedCount >= 6) {
      findings.push({ type: 'pass', text: `✅ Rich industry keywords detected (${detectedCount} competencies identified).` });
    } else {
      findings.push({ type: 'warn', text: '⚠️ Limited skill keywords detected. Add both hard technical skills and soft skills in a dedicated Skills section.' });
    }

    // 5. ATS Formatting & Length (20 pts)
    let formatScore = 20;
    if (wordCount < 300) {
      formatScore -= 10;
      findings.push({ type: 'fail', text: `❌ Resume is too brief (${wordCount} words). Recommended word count for an effective 1-page ATS resume is 450–850 words.` });
    } else if (wordCount > 1200) {
      formatScore -= 6;
      findings.push({ type: 'warn', text: `⚠️ Resume is lengthy (${wordCount} words). Multi-page resumes frequently get truncated by automated parsing filters.` });
    } else {
      findings.push({ type: 'pass', text: `✅ Optimal word count (${wordCount} words) perfectly tailored for a clean 1-page ATS scan.` });
    }

    const bulletMatches = rawText.match(/•|-|\*|\d+\./g) || [];
    if (bulletMatches.length >= 6) {
      findings.push({ type: 'pass', text: '✅ Bullet point structure detected. ATS parsers read bulleted achievements far more reliably than dense paragraphs.' });
    } else {
      formatScore -= 4;
      findings.push({ type: 'warn', text: '⚠️ Few bullet points found. Break down job responsibilities into 3-4 bullet points per position.' });
    }

    formatScore = Math.max(0, formatScore);

    // Total Score Calculation (0 - 100)
    const totalScore = Math.min(100, Math.round(contactScore + sectionsScore + actionScore + skillsScore + formatScore));

    // Optional Job Description Matching
    let jobMatch = null;
    const jobDescText = jobDescInput ? jobDescInput.value.trim().toLowerCase() : '';
    if (jobDescText && jobDescText.length > 50) {
      const jobWords = jobDescText.match(/\b[A-Za-z]{3,}\b/g) || [];
      const uniqueJobKeywords = Array.from(new Set(jobWords)).filter(w => !['and', 'the', 'for', 'with', 'from', 'have', 'this', 'that', 'your', 'will'].includes(w));
      
      let matchedCount = 0;
      uniqueJobKeywords.forEach(kw => {
        if (textLower.includes(kw)) matchedCount++;
      });
      jobMatch = Math.min(100, Math.round((matchedCount / Math.max(1, uniqueJobKeywords.length)) * 100 * 1.6));
    }

    // Update UI
    displayResults({
      totalScore,
      contactScore: Math.round((contactScore / 15) * 100),
      sectionsScore: Math.round((sectionsScore / 25) * 100),
      actionScore: Math.round((actionScore / 20) * 100),
      skillsScore: Math.round((skillsScore / 20) * 100),
      formatScore: Math.round((formatScore / 20) * 100),
      findings,
      detectedSkills,
      jobMatch
    });
  }

  function displayResults(data) {
    if (resultsPlaceholder) resultsPlaceholder.style.display = 'none';
    if (resultsCard) resultsCard.style.display = 'block';

    // 1. Score Number & Gauge
    if (scoreNumElem) scoreNumElem.textContent = data.totalScore;

    const circumference = 2 * Math.PI * 45; // r=45 -> 282.74
    const offset = circumference - (data.totalScore / 100) * circumference;

    if (scoreGaugeVal) {
      scoreGaugeVal.style.strokeDasharray = `${circumference}`;
      scoreGaugeVal.style.strokeDashoffset = `${offset}`;

      if (data.totalScore >= 80) {
        scoreGaugeVal.style.stroke = '#10b981'; // Emerald
      } else if (data.totalScore >= 60) {
        scoreGaugeVal.style.stroke = '#f59e0b'; // Amber
      } else {
        scoreGaugeVal.style.stroke = '#ef4444'; // Red
      }
    }

    // Status Pill
    if (scoreStatusPill) {
      if (data.totalScore >= 85) {
        scoreStatusPill.textContent = '🌟 Excellent - Highly ATS Compatible';
        scoreStatusPill.style.background = 'rgba(16, 185, 129, 0.15)';
        scoreStatusPill.style.color = 'var(--accent-emerald)';
      } else if (data.totalScore >= 70) {
        scoreStatusPill.textContent = '👍 Good - Competitive Resume';
        scoreStatusPill.style.background = 'rgba(99, 102, 241, 0.15)';
        scoreStatusPill.style.color = 'var(--primary)';
      } else if (data.totalScore >= 50) {
        scoreStatusPill.textContent = '⚠️ Average - Needs Keyword Optimization';
        scoreStatusPill.style.background = 'rgba(245, 158, 11, 0.15)';
        scoreStatusPill.style.color = '#f59e0b';
      } else {
        scoreStatusPill.textContent = '❌ Critical - Likely Filtered by ATS';
        scoreStatusPill.style.background = 'rgba(239, 68, 68, 0.15)';
        scoreStatusPill.style.color = '#ef4444';
      }
    }

    if (scoreSummaryText) {
      scoreSummaryText.textContent = data.totalScore >= 75
        ? 'Your resume has high structural readability, essential sections, and recognizable keywords for top ATS scanners.'
        : 'Your resume is missing important metrics or keywords. Review the critical recommendations below to boost your score to 90+.';
    }

    // 2. Breakdown Bars
    setBar(barContact, valContact, data.contactScore);
    setBar(barSections, valSections, data.sectionsScore);
    setBar(barAction, valAction, data.actionScore);
    setBar(barSkills, valSkills, data.skillsScore);
    setBar(barFormat, valFormat, data.formatScore);

    // 3. Findings Checklist
    if (findingsContainer) {
      findingsContainer.innerHTML = '';
      data.findings.forEach(f => {
        const item = document.createElement('div');
        item.className = `ats-check-item ${f.type}`;
        item.textContent = f.text;
        findingsContainer.appendChild(item);
      });
    }

    // 4. Skills Cloud
    if (skillsCloud) {
      skillsCloud.innerHTML = '';
      if (data.detectedSkills.length === 0) {
        skillsCloud.innerHTML = '<span style="font-size: 0.85rem; color: var(--text-muted);">No major technical skills detected.</span>';
      } else {
        data.detectedSkills.forEach(s => {
          const tag = document.createElement('span');
          tag.className = 'ats-skill-tag';
          tag.textContent = s.toUpperCase();
          skillsCloud.appendChild(tag);
        });
      }
    }

    // 5. Job Match Box
    if (jobMatchBox) {
      if (data.jobMatch !== null) {
        jobMatchBox.style.display = 'block';
        if (jobMatchPercent) jobMatchPercent.textContent = `${data.jobMatch}%`;
      } else {
        jobMatchBox.style.display = 'none';
      }
    }

    // Only scroll vertically on small screens (mobile/tablet <= 992px) where results are stacked below.
    // On desktop (> 992px), columns are side-by-side; NEVER scroll horizontally to prevent disorienting screen shift/zoom.
    if (window.innerWidth <= 992 && resultsCard) {
      const targetTop = resultsCard.getBoundingClientRect().top + window.pageYOffset - 75;
      window.scrollTo({
        top: targetTop,
        left: 0,
        behavior: 'smooth'
      });
    }

    if (window.showToast) {
      window.showToast(`Analysis Complete: ATS Score ${data.totalScore}/100`);
    }
  }

  function setBar(barElem, valElem, percent) {
    if (barElem) {
      barElem.style.width = `${percent}%`;
      if (percent >= 75) barElem.style.background = '#10b981';
      else if (percent >= 50) barElem.style.background = '#f59e0b';
      else barElem.style.background = '#ef4444';
    }
    if (valElem) valElem.textContent = `${percent}%`;
  }
}
