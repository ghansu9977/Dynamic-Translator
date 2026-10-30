/**
 * Typing Speed Test Engine
 * Real-time WPM, Accuracy %, Word highlight, and Result card.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypingTest();
});

const PASSAGES = {
  general: [
    "The rapid growth of digital technology has transformed examinations and administrative services. Aspirants preparing for competitive examinations need consistent practice, high discipline, and accurate typing skills to qualify for clerical and ministerial posts. Typing proficiency is not just about moving fingers rapidly; it demands continuous focus, mental synchronization, and precise keyboard coordination. Maintaining high accuracy while ensuring adequate speed separates successful candidates from the rest.",
    "Time management is the single most critical asset in modern professional life. Whether one is preparing for competitive civil service examinations, handling corporate data operations, or drafting legal documents in district courts, speed combined with flawless precision always yields superior results. Daily practice of fifteen to thirty minutes on structured typing software improves muscle memory, minimizes backspace dependency, and establishes immense confidence during the actual examination hall evaluation.",
    "Education and technology have combined together to create boundless opportunities for students and professionals worldwide. Online learning portals and client-side utilities empower learners to prepare effectively without paying hefty fees. Developing typing proficiency of thirty-five words per minute with ninety-five percent accuracy opens lucrative pathways for data entry operators, court typists, and junior secretariat assistants."
  ],
  court: [
    "In the matter of judicial administration, accurate transcription of evidence, affidavits, and court orders remains paramount to the fair delivery of justice. Stenographers and court clerks are entrusted with the duty of recording proceedings with absolute precision. Any discrepancy or typographical oversight can alter legal interpretation and cause procedural delays. Therefore, examination boards test both typing speed and linguistic accuracy under stringent time constraints.",
    "The legal framework requires thorough verification of public records, contractual clauses, and constitutional petitions. Candidates appearing for clerkship and typographical evaluations must cultivate the habit of continuous touch typing without looking down at the keyboard layout. Maintaining steady breathing, upright posture, and rhythmic finger keystrokes helps achieve sustained speeds exceeding forty words per minute."
  ]
};

function initTypingTest() {
  const passageBox = document.getElementById('typing-passage-box');
  const inputArea = document.getElementById('typing-input-area');
  const timerDisplay = document.getElementById('typing-timer');
  const wpmDisplay = document.getElementById('metric-wpm');
  const accDisplay = document.getElementById('metric-accuracy');
  const errDisplay = document.getElementById('metric-errors');
  const charsDisplay = document.getElementById('metric-chars');
  const categorySelect = document.getElementById('typing-lang');
  const durationBtns = document.querySelectorAll('.typing-duration-btn');
  const restartBtn = document.getElementById('restart-typing-btn');
  const resultCard = document.getElementById('result-card');
  const retestBtn = document.getElementById('retest-btn');

  let currentCategory = 'general';
  let totalTime = 60; // seconds
  let timeLeft = totalTime;
  let timerInterval = null;
  let isRunning = false;
  let wordsList = [];
  let currentWordIndex = 0;
  let correctWordsCount = 0;
  let incorrectWordsCount = 0;
  let totalCharsTyped = 0;
  let correctCharsTyped = 0;

  function loadPassage() {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = totalTime;
    currentWordIndex = 0;
    correctWordsCount = 0;
    incorrectWordsCount = 0;
    totalCharsTyped = 0;
    correctCharsTyped = 0;

    timerDisplay.textContent = formatTime(timeLeft);
    wpmDisplay.textContent = '0';
    accDisplay.textContent = '100%';
    errDisplay.textContent = '0';
    charsDisplay.textContent = '0';
    inputArea.value = '';
    inputArea.disabled = false;
    if (resultCard) resultCard.style.display = 'none';

    // Pick random passage
    const pool = PASSAGES[currentCategory] || PASSAGES.general;
    const text = pool[Math.floor(Math.random() * pool.length)];
    wordsList = text.trim().split(/\s+/);

    passageBox.innerHTML = '';
    wordsList.forEach((w, idx) => {
      const span = document.createElement('span');
      span.className = 'typing-word' + (idx === 0 ? ' current' : '');
      span.textContent = w;
      passageBox.appendChild(span);
    });
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    timerInterval = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = formatTime(timeLeft);
      updateLiveMetrics();

      if (timeLeft <= 0) {
        endTest();
      }
    }, 1000);
  }

  function updateLiveMetrics() {
    const elapsedMinutes = (totalTime - timeLeft) / 60;
    if (elapsedMinutes > 0) {
      const wpm = Math.round((correctCharsTyped / 5) / elapsedMinutes) || 0;
      wpmDisplay.textContent = wpm;

      const accuracy = totalCharsTyped > 0 
        ? Math.round((correctCharsTyped / totalCharsTyped) * 100) 
        : 100;
      accDisplay.textContent = accuracy + '%';
      errDisplay.textContent = incorrectWordsCount;
      charsDisplay.textContent = totalCharsTyped;
    }
  }

  function endTest() {
    clearInterval(timerInterval);
    isRunning = false;
    inputArea.disabled = true;

    const totalMinutes = totalTime / 60;
    const finalWpm = Math.round((correctCharsTyped / 5) / totalMinutes) || 0;
    const finalAcc = totalCharsTyped > 0 
      ? Math.round((correctCharsTyped / totalCharsTyped) * 100) 
      : 0;

    // Show Result Card
    if (resultCard) {
      resultCard.style.display = 'block';
      document.getElementById('res-final-wpm').textContent = finalWpm;
      document.getElementById('res-final-acc').textContent = finalAcc + '%';
      document.getElementById('res-final-err').textContent = incorrectWordsCount;
      document.getElementById('res-final-net').textContent = Math.max(0, finalWpm - incorrectWordsCount);

      // Determine Grade
      const badge = document.getElementById('res-grade-badge');
      if (finalWpm >= 35 && finalAcc >= 92) {
        badge.textContent = '🏆 Examination Qualified (35+ WPM)';
        badge.style.background = 'var(--accent-emerald)';
      } else if (finalWpm >= 30 && finalAcc >= 85) {
        badge.textContent = '🎯 Exam Ready (Near Target)';
        badge.style.background = 'var(--accent-cyan)';
      } else if (finalWpm >= 20) {
        badge.textContent = '⚡ Intermediate Typist';
        badge.style.background = 'var(--accent-amber)';
      } else {
        badge.textContent = '🚀 Beginner (Keep Practicing!)';
        badge.style.background = 'var(--accent-rose)';
      }

      resultCard.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // Handle Input Typing
  inputArea.addEventListener('input', (e) => {
    if (!isRunning && inputArea.value.length > 0) {
      startTimer();
    }

    const currentWordSpan = passageBox.querySelectorAll('.typing-word')[currentWordIndex];
    if (!currentWordSpan) return;

    const typedValue = inputArea.value;
    const targetWord = wordsList[currentWordIndex];

    // Check if space was typed (word complete)
    if (typedValue.endsWith(' ') || typedValue.endsWith('\n')) {
      const cleanTyped = typedValue.trim();
      totalCharsTyped += (cleanTyped.length + 1);

      if (cleanTyped === targetWord) {
        currentWordSpan.className = 'typing-word correct';
        correctWordsCount++;
        correctCharsTyped += (targetWord.length + 1);
      } else {
        currentWordSpan.className = 'typing-word incorrect';
        incorrectWordsCount++;
      }

      currentWordIndex++;
      inputArea.value = '';

      // Highlight next word
      const nextWordSpan = passageBox.querySelectorAll('.typing-word')[currentWordIndex];
      if (nextWordSpan) {
        nextWordSpan.classList.add('current');
        nextWordSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        endTest();
      }

      updateLiveMetrics();
    } else {
      if (targetWord.startsWith(typedValue)) {
        currentWordSpan.className = 'typing-word current';
      } else {
        currentWordSpan.className = 'typing-word current incorrect';
      }
    }
  });

  // Category Change
  if (categorySelect) {
    categorySelect.addEventListener('change', () => {
      currentCategory = categorySelect.value;
      loadPassage();
    });
  }

  // Duration Buttons
  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      totalTime = parseInt(btn.dataset.time, 10);
      loadPassage();
    });
  });

  // Restart Buttons
  if (restartBtn) restartBtn.addEventListener('click', loadPassage);
  if (retestBtn) retestBtn.addEventListener('click', loadPassage);

  // Initial setup
  loadPassage();
}
