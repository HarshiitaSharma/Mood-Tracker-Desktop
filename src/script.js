document.addEventListener('DOMContentLoaded', () => {
  // ====== Global Variables ======
  const questions = [
    { id: 'mood', question: 'How are you feeling today?', options: ['😊 Happy','😢 Sad','😟 Anxious','😠 Angry','😌 Calm'], values: ['happy','sad','anxious','angry','calm'] },
    { id: 'sleep', question: 'How well did you sleep?', options: ['Great','Okay','Poor'], values: ['great','okay','poor'] },
    { id: 'stress', question: 'What is your stress level?', options: ['Low','Medium','High'], values: ['low','medium','high'] },
    { id: 'energy', question: 'How is your energy today?', options: ['High','Medium','Low'], values: ['high','medium','low'] },
    { id: 'focus', question: 'How focused have you been?', options: ['Very Focused','Somewhat','Distracted'], values: ['focused','somewhat','distracted'] },
    { id: 'social', question: 'Did you interact with someone today?', options: ['Yes','No'], values: ['yes','no'] },
    { id: 'appetite', question: 'How is your appetite today?', options: ['Normal','Less than usual','More than usual'], values: ['normal','less','more'] },
    { id: 'exercise', question: 'Did you exercise today?', options: ['Yes','No'], values: ['yes','no'] },
    { id: 'outdoors', question: 'Did you spend time outdoors today?', options: ['Yes','No'], values: ['yes','no'] },
    { id: 'balance', question: 'How balanced do you feel today?', options: ['Balanced','Okay','Chaotic'], values: ['balanced','okay','chaotic'] }
  ];

  let currentStep = 0;
  const responses = {};
  let totalScore = 0;

  const settings = {
    confettiColor: '#FF6F61',
    audioSrc: '',
    audioVolume: 0.5,
    audioMuted: false
  };

  const audio = document.getElementById('bg-audio');
  if (audio) audio.volume = settings.audioVolume;

  // DOM Elements
  const container = document.getElementById('question-container');
  const resultBox = document.getElementById('mood-result');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progress-bar');
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPanel = document.getElementById('settings-panel');
  const closeSettingsBtn = document.getElementById('close-settings');
  const confettiColorInput = document.getElementById('confetti-color');
  const audioSelect = document.getElementById('audio-select');
  const audioToggleBtn = document.getElementById('audio-toggle');
  const storageTypeSelect = document.getElementById('storage-type');
  const showMoodCalendarBtn = document.getElementById('show-mood-calendar');
  const moodCalendarPanel = document.getElementById('mood-calendar-panel');
  const closeCalendarBtn = document.getElementById('close-calendar');
  const calendarContainer = document.getElementById('calendar-container');
  const calendarModal = document.getElementById('calendar-modal');
  const modalCalendarContainer = document.getElementById('modal-calendar-container');
  const closeModalBtn = calendarModal ? calendarModal.querySelector('.close-btn') : null;

  // Fallback RuleML Content
  const fallbackRuleML = `<?xml version="1.0" encoding="UTF-8"?>
<RuleML xmlns="http://ruleml.org/spec">
  <Rule><if><Atom><Rel>mood</Rel><Var>happy</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Enjoy your good mood — spread positivity to others too!</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>mood</Rel><Var>sad</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Do something comforting like music, journaling, or calling a friend.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>mood</Rel><Var>anxious</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Try grounding techniques such as deep breathing or writing your worries down.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>mood</Rel><Var>angry</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Release the tension with exercise or creative outlets like drawing or music.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>mood</Rel><Var>calm</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Keep nurturing this calm state with mindfulness or light reading.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>balance</Rel><Var>balanced</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Great job staying centered — keep doing what supports your balance.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>balance</Rel><Var>okay</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Mixed days are normal. Reflect on what helped you stay steady today.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>balance</Rel><Var>chaotic</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Journaling or meditation can help organize overwhelming emotions.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>sleep</Rel><Var>great</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Awesome! Rest is a superpower — keep protecting your sleep time.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>sleep</Rel><Var>okay</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>A little more rest might give you extra focus and energy.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>sleep</Rel><Var>poor</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Try setting a consistent bedtime routine and avoid screens before sleep.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>stress</Rel><Var>low</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Nice! Keep journaling or exercising to maintain low stress.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>stress</Rel><Var>medium</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Try stretching or taking a short walk to refresh.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>stress</Rel><Var>high</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Practice breathing exercises or short meditation to calm your mind.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>social</Rel><Var>yes</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Social bonds are powerful — keep them strong!</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>social</Rel><Var>no</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Even a quick call or message can uplift your mood.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>energy</Rel><Var>high</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Channel this energy into something productive or fun!</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>energy</Rel><Var>medium</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Keep a steady pace and don’t forget short breaks.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>energy</Rel><Var>low</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Take a brisk walk or drink water — dehydration often lowers energy.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>focus</Rel><Var>focused</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Great concentration — protect it by reducing distractions.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>focus</Rel><Var>somewhat</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Break tasks into smaller steps to improve focus.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>focus</Rel><Var>distracted</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Try the Pomodoro technique: 25 mins focused work + 5 mins break.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>appetite</Rel><Var>normal</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Good! Maintain healthy, balanced meals.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>appetite</Rel><Var>less</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Eat smaller, frequent snacks rich in protein and fiber.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>appetite</Rel><Var>more</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Keep healthy snacks around to avoid overeating junk food.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>exercise</Rel><Var>yes</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Nice! Physical activity keeps mood and body strong.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>exercise</Rel><Var>no</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Even 10 minutes of stretching or walking counts as exercise.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>outdoors</Rel><Var>yes</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Fresh air and sunlight are mood boosters — great choice!</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>outdoors</Rel><Var>no</Var></Atom></if><then><Atom><Rel>tip</Rel><Ind>Step outside for even 10 minutes — sunlight boosts mood instantly.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>mood</Rel><Var>happy</Var></Atom></if><then><Atom><Rel>motivation</Rel><Ind>Keep spreading your positive energy today!</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>stress</Rel><Var>high</Var></Atom></if><then><Atom><Rel>motivation</Rel><Ind>Take a deep breath, you’ve got this!</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>mood</Rel><Var>anxious</Var></Atom></if><then><Atom><Rel>diaryPrompt</Rel><Ind>Write down what is causing your anxiety and one small step to ease it.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>mood</Rel><Var>happy</Var></Atom></if><then><Atom><Rel>diaryPrompt</Rel><Ind>Describe what made you happy today and how you can repeat it tomorrow.</Ind></Atom></then></Rule>
  <Rule><if><Atom><Rel>settings</Rel><Var>audioEnabled</Var></Atom></if><then><Atom><Rel>tipAudio</Rel><Ind>playSound</Ind></Atom></then></Rule>
</RuleML>`;

  // ====== Functions ======

  // Render question
  function renderQuestion() {
    if (!container) return;
    const q = questions[currentStep];
    container.innerHTML = `
      <p class="step-indicator">Question ${currentStep + 1} of ${questions.length}</p>
      <p><strong>${q.question}</strong></p>
      <div class="option-group" data-field="${q.id}">
        ${q.options.map((opt, i) => `<button type="button" class="${responses[q.id] === q.values[i] ? 'selected' : ''}" data-value="${q.values[i]}">${opt}</button>`).join('')}
      </div>
    `;

    prevBtn.disabled = currentStep === 0;
    nextBtn.textContent = currentStep === questions.length - 1 ? 'Submit' : 'Next';
    
    container.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.value;
        responses[q.id] = val;
        btn.closest('.option-group').querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });

    updateProgressBar();
  }

  // Update progress bar
  function updateProgressBar() {
    if (progressBar) progressBar.style.width = ((currentStep + 1) / questions.length * 100) + '%';
  }

  // RuleML loader
const fs = require('fs');
const path = require('path');

async function loadRuleML() {
  try {
    const xmlPath = path.join(__dirname, 'mood-rules.xml');

    // Read XML using Node's fs
    const text = await fs.promises.readFile(xmlPath, 'utf-8');

    // Parse as XML
    return new DOMParser().parseFromString(text, 'application/xml');

  } catch (error) {
    console.warn('Error loading RuleML, using fallback:', error);
    return new DOMParser().parseFromString(fallbackRuleML, 'application/xml');
  }
}


  function applyRuleML(rulemlDoc, responses) {
    const tips = [];
    let motivation = '';
    const diaryPrompts = [];

    const rules = rulemlDoc.getElementsByTagName('Rule');
    for (let rule of rules) {
      const ifAtom = rule.getElementsByTagName('Atom')[0];
      const thenAtom = rule.getElementsByTagName('Atom')[1];
      const rel = ifAtom.getElementsByTagName('Rel')[0].textContent;
      const varValue = ifAtom.getElementsByTagName('Var')[0].textContent;
      const thenRel = thenAtom.getElementsByTagName('Rel')[0].textContent;
      const thenInd = thenAtom.getElementsByTagName('Ind')[0].textContent;

      if (responses[rel] === varValue) {
        if (thenRel === 'tip') {
          tips.push(thenInd);
        } else if (thenRel === 'motivation') {
          motivation = thenInd;
        } else if (thenRel === 'diaryPrompt') {
          diaryPrompts.push(thenInd);
        }
      }
    }

    // Fallback motivation if none matched
    if (!motivation) {
      motivation = responses.mood === 'sad' ? 'Every day is a new opportunity to feel better.' :
                   responses.mood === 'anxious' ? 'Take one step at a time, you are stronger than you think.' :
                   responses.mood === 'angry' ? 'Channel your energy into something productive and positive.' :
                   'Remember, it\'s okay to have ups and downs.';
    }

    return { tips: tips.slice(0, 4), motivation, diaryPrompt: diaryPrompts[0] || 'Reflect on your day.' };
  }

  function launchConfetti() {
    let confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) {
      confettiContainer = document.createElement('div');
      confettiContainer.id = 'confetti';
      document.body.appendChild(confettiContainer);
    }
    const colors = [settings.confettiColor, '#FFD1C1', '#BFF5E3', '#FFBCB3', '#79FFD4'];

    for (let i = 0; i < 100; i++) {
      const c = document.createElement('div');
      c.className = 'confetti-piece';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      c.style.animationDuration = (2 + Math.random() * 3) + 's';
      c.style.opacity = Math.random();
      c.style.width = 5 + Math.random() * 10 + 'px';
      c.style.height = 5 + Math.random() * 10 + 'px';
      confettiContainer.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }
    setTimeout(() => confettiContainer.innerHTML = '', 6000);
  }

  // Show Results
  async function showResults() {
    const rulemlDoc = await loadRuleML();
    const { tips, motivation } = applyRuleML(rulemlDoc, responses);

    container.style.display = 'none';

    const positiveResponses = ['happy', 'calm', 'great', 'high', 'focused', 'yes', 'normal', 'balanced'];
    const hasPositiveResponses = Object.values(responses).some(response => positiveResponses.includes(response));

    resultBox.innerHTML = `
      <div class="results-container">
        <div class="result-header">
          <h1>🧠 Your Mood Assessment Results</h1>
        </div>
        <div class="motivation-section">
          <h3>💪 Your Motivation</h3>
          <blockquote class="motivation-quote">${motivation}</blockquote>
        </div>
        <div class="tips-section">
          <h3>💡 Helpful Tips for You</h3>
          <div class="tips-grid">
            ${tips.slice(0, 4).map(tip => `<div class="tip-card">${tip}</div>`).join('')}
          </div>
        </div>
        <div class="diary-section">
          <h3>📝 Your Diary Entry</h3>
          <textarea id="diary-text" placeholder="Write your thoughts here..." rows="4"></textarea>
        </div>
        <div class="action-buttons">
          <div class="button-group">
            <button class="submit-btn save-btn" id="save-results-btn">💾 Save Results</button>
            <button class="submit-btn home-btn" id="results-home-btn">🏠 Home</button>
          </div>
          <div class="button-group">
            <button class="submit-btn calendar-btn" id="view-calendar-btn">📅 View Calendar</button>
            <button class="submit-btn restart-btn" id="restart-btn">🔄 Restart Quiz</button>
          </div>
        </div>
      </div>
    `;

    if (hasPositiveResponses) launchConfetti();

    document.getElementById('save-results-btn').addEventListener('click', () => {
      const diaryText = document.getElementById('diary-text').value;
      const today = new Date().toISOString().split('T')[0];
      const moodData = {
        responses,
        tips: tips.slice(0, 4),
        motivation,
        diary: diaryText,
        date: today
      };
      saveMoodData(today, moodData);
      alert('Results saved successfully!');
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to restart the quiz? Your current progress will be lost.')) {
        Object.keys(responses).forEach(key => delete responses[key]);
        totalScore = 0;
        currentStep = 0;
        resultBox.innerHTML = '';
        container.style.display = 'block';
        renderQuestion();
      }
    });

    document.getElementById('results-home-btn').addEventListener('click', () => {
      Object.keys(responses).forEach(key => delete responses[key]);
      totalScore = 0;
      currentStep = 0;
      resultBox.innerHTML = '';
      container.style.display = 'block';
      renderQuestion();
    });

    document.getElementById('view-calendar-btn').addEventListener('click', () => {
      moodCalendarPanel.classList.remove('hidden');
    });

    if (!settings.audioMuted && settings.audioSrc) {
      audio.src = settings.audioSrc;
      audio.play();
    }
  }

  // ===== Event Listeners ======
  if (nextBtn) nextBtn.addEventListener('click', async () => {
    const q = questions[currentStep];
    if (!q || !responses[q.id]) { alert('Please select an option.'); return; }
    if (currentStep < questions.length - 1) { currentStep++; renderQuestion(); }
    else await showResults();
  });
  if (prevBtn) prevBtn.addEventListener('click', () => { if (currentStep > 0) { currentStep--; renderQuestion(); } });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && nextBtn) nextBtn.click(); });

  // Settings
  if (settingsBtn) settingsBtn.addEventListener('click', () => {
    const rect = settingsBtn.getBoundingClientRect();
    if (settingsPanel) {
      settingsPanel.style.top = (rect.bottom + window.scrollY + 5) + 'px';
      settingsPanel.style.left = (rect.left + window.scrollX) + 'px';
      settingsPanel.classList.toggle('hidden');
    }
  });
  if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => { if (settingsPanel) settingsPanel.classList.add('hidden'); });
  if (confettiColorInput) confettiColorInput.addEventListener('input', (e) => settings.confettiColor = e.target.value);

  if (audioSelect) audioSelect.addEventListener('change', (e) => {
    const files = { calming: 'calming-music.mp3', meditation: 'meditation.mp3', nature: 'nature-sounds.mp3' };
    settings.audioSrc = files[e.target.value] || '';
    if (settings.audioSrc && !settings.audioMuted && audio) {
      audio.src = settings.audioSrc;
      audio.play();
    }
  });
  if (audioToggleBtn) audioToggleBtn.addEventListener('click', (e) => {
    settings.audioMuted = !settings.audioMuted;
    e.target.textContent = settings.audioMuted ? '🔇 Mute' : '🔊 Play';
    if (settings.audioMuted && audio) audio.pause(); else if (settings.audioSrc && audio) audio.play();
  });

  // Home button
  const homeBtn = document.getElementById('home-btn');
  if (homeBtn) homeBtn.addEventListener('click', () => {
    Object.keys(responses).forEach(key => delete responses[key]);
    totalScore = 0;
    currentStep = 0;
    if (resultBox) resultBox.innerHTML = '';
    if (container) container.style.display = 'block';
    renderQuestion();
  });

  // Theme
  const themeToggle = document.getElementById('theme-toggle');
  if (themeToggle) themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
  if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

  // Mood Calendar
  if (showMoodCalendarBtn) showMoodCalendarBtn.addEventListener('click', () => {
    const rect = showMoodCalendarBtn.getBoundingClientRect();
    const panelWidth = 350;
    const panelHeight = 400;

    let left = rect.left + window.scrollX;
    let top = rect.bottom + window.scrollY + 5;

    if (left + panelWidth > window.innerWidth) left = window.innerWidth - panelWidth - 10;
    if (top + panelHeight > window.innerHeight + window.scrollY) top = rect.top + window.scrollY - panelHeight - 5;

    if (moodCalendarPanel) {
      moodCalendarPanel.style.top = top + 'px';
      moodCalendarPanel.style.left = left + 'px';
      moodCalendarPanel.classList.remove('hidden');
    }
  });
  if (closeCalendarBtn) closeCalendarBtn.addEventListener('click', () => { if (moodCalendarPanel) moodCalendarPanel.classList.add('hidden'); });

  // LocalStorage functions
  function saveMoodData(date, data) {
    const storage = storageTypeSelect && storageTypeSelect.value === 'session' ? sessionStorage : localStorage;
    if (storage) storage.setItem(`mood-${date}`, JSON.stringify(data));
  }

  function loadMoodData(date) {
    const storage = storageTypeSelect && storageTypeSelect.value === 'session' ? sessionStorage : localStorage;
    const data = storage ? storage.getItem(`mood-${date}`) : null;
    return data ? JSON.parse(data) : null;
  }

  function getAllMoodDates() {
    const storage = storageTypeSelect && storageTypeSelect.value === 'session' ? sessionStorage : localStorage;
    const dates = [];
    if (storage) {
      for (let i = 0; i < storage.length; i++) {
        const key = storage.key(i);
        if (key.startsWith('mood-')) dates.push(key.replace('mood-', ''));
      }
    }
    return dates;
  }

  // Calendar functions
  function renderCalendar(view = 'month', selectedYear = new Date().getFullYear()) {
    if (!calendarContainer && !modalCalendarContainer) return;
    const moodDates = getAllMoodDates();

    if (view === 'month') {
      calendarContainer.innerHTML = '';
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Reset time for accurate comparison
      const year = now.getFullYear();
      const month = now.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      let html = `
        <div class="calendar-controls">
          <label for="calendar-view">View:</label>
          <select id="calendar-view">
            <option value="month" ${view === 'month' ? 'selected' : ''}>Month</option>
            <option value="year" ${view === 'year' ? 'selected' : ''}>Year at a Glance</option>
          </select>
          <label for="calendar-year">Year:</label>
          <input type="number" id="calendar-year" value="${year}" min="2000" max="2100">
        </div>
        <h3>${now.toLocaleString('default', { month: 'long' })} ${year}</h3>
        <table class="calendar-table"><thead><tr>
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `<th>${day}</th>`).join('')}
        </tr></thead><tbody><tr>
      `;

      for (let i = 0; i < firstDay; i++) {
        html += '<td></td>';
      }

      for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const data = loadMoodData(dateStr);
        const moodClass = data && data.responses.mood ? `mood-${data.responses.mood}` : '';
        const hasMood = moodDates.includes(dateStr);
        html += `<td class="calendar-day ${hasMood ? 'has-mood' : ''} ${moodClass}" data-date="${dateStr}">${day}</td>`;
        if ((firstDay + day) % 7 === 0) html += '</tr><tr>';
      }

      html += '</tr></tbody></table>';
      calendarContainer.innerHTML = html;
    } else {
      // Yearly view in modal
      let html = `
        <div class="calendar-controls">
          <label for="calendar-view">View:</label>
          <select id="calendar-view">
            <option value="month" ${view === 'month' ? 'selected' : ''}>Month</option>
            <option value="year" ${view === 'year' ? 'selected' : ''}>Year at a Glance</option>
          </select>
          <label for="calendar-year">Year:</label>
          <input type="number" id="calendar-year" value="${selectedYear}" min="2000" max="2100">
        </div>
        <div class="yearly-calendar">
      `;

      for (let month = 0; month < 12; month++) {
        const firstDay = new Date(selectedYear, month, 1).getDay();
        const daysInMonth = new Date(selectedYear, month + 1, 0).getDate();
        html += `
          <div class="yearly-month">
            <h4>${new Date(selectedYear, month).toLocaleString('default', { month: 'long' })}</h4>
            <table class="calendar-table"><thead><tr>
              ${['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => `<th>${day}</th>`).join('')}
            </tr></thead><tbody><tr>
        `;

        for (let i = 0; i < firstDay; i++) {
          html += '<td></td>';
        }

        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `${selectedYear}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const data = loadMoodData(dateStr);
          const moodClass = data && data.responses.mood ? `mood-${data.responses.mood}` : '';
          const hasMood = moodDates.includes(dateStr);
          html += `<td class="calendar-day ${hasMood ? 'has-mood' : ''} ${moodClass}" data-date="${dateStr}">${day}</td>`;
          if ((firstDay + day) % 7 === 0) html += '</tr><tr>';
        }

        html += '</tr></tbody></table></div>';
      }

      html += '</div>';
      // Add color legend
      html += `
        <div class="color-legend">
          <h4>Mood Color Guide</h4>
          <ul>
            <li><span class="color-swatch mood-happy" style="background: #FFB6C1;"></span>Happy</li>
            <li><span class="color-swatch mood-sad" style="background: #4682B4;"></span>Sad</li>
            <li><span class="color-swatch mood-anxious" style="background: #800080;"></span>Anxious</li>
            <li><span class="color-swatch mood-angry" style="background: #FF0000;"></span>Angry</li>
            <li><span class="color-swatch mood-calm" style="background: #90EE90;"></span>Calm</li>
          </ul>
        </div>
      `;
      if (modalCalendarContainer) modalCalendarContainer.innerHTML = html;
      if (calendarModal) calendarModal.classList.add('show');
    }

    // Add event listeners for view and year changes
    const viewSelect = document.getElementById('calendar-view');
    const yearInput = document.getElementById('calendar-year');
    if (viewSelect && yearInput) {
      viewSelect.addEventListener('change', () => {
        if (viewSelect.value === 'year' && calendarModal) {
          renderCalendar(viewSelect.value, parseInt(yearInput.value) || new Date().getFullYear());
        } else {
          if (calendarModal) calendarModal.classList.remove('show');
          renderCalendar(viewSelect.value, parseInt(yearInput.value) || new Date().getFullYear());
        }
      });
      yearInput.addEventListener('change', () => {
        if (viewSelect.value === 'year' && calendarModal) {
          renderCalendar(viewSelect.value, parseInt(yearInput.value) || new Date().getFullYear());
        } else {
          renderCalendar(viewSelect.value, parseInt(yearInput.value) || new Date().getFullYear());
        }
      });
    }

    // Add click events for days
    document.querySelectorAll('.calendar-day').forEach(day => {
      day.addEventListener('click', () => showMoodPopup(day.dataset.date));
    });
  }

  function showMoodPopup(date) {
    const data = loadMoodData(date);
    if (!data || !document.body) return;

    const popup = document.createElement('div');
    popup.className = 'mood-popup';
    popup.innerHTML = `
      <div class="popup-content">
        <h3>Mood Data for ${date}</h3>
        <p><strong>Motivation:</strong> ${data.motivation}</p>
        <p><strong>Diary:</strong> ${data.diary || 'No entry'}</p>
        <h4>Tips:</h4>
        <ul>${data.tips.map(tip => `<li>${tip}</li>`).join('')}</ul>
        <button class="submit-btn" onclick="this.parentElement.parentElement.remove()">Close</button>
      </div>
    `;
    document.body.appendChild(popup);
  }

  // Add Sample Mood Data
  async function addSampleMoodData() {
    if (!storageTypeSelect) return;
    const storage = storageTypeSelect.value === 'session' ? sessionStorage : localStorage;
    if (!storage) return;

    const startDate = new Date('2025-08-25');
    const endDate = new Date('2025-09-05');
    const rulemlDoc = await loadRuleML();

    const sampleData = [
      { responses: { mood: 'happy', sleep: 'great', stress: 'low', energy: 'high', focus: 'focused', social: 'yes', appetite: 'normal', exercise: 'yes', outdoors: 'yes', balance: 'balanced' }, diary: 'What a fantastic day! Went hiking with friends and felt so alive. Everything clicked perfectly.' },
      { responses: { mood: 'sad', sleep: 'poor', stress: 'high', energy: 'low', focus: 'distracted', social: 'no', appetite: 'less', exercise: 'no', outdoors: 'no', balance: 'chaotic' }, diary: 'Tough day. Couldn’t sleep and felt overwhelmed by work. Stayed indoors, just feeling low.' },
      { responses: { mood: 'calm', sleep: 'okay', stress: 'medium', energy: 'medium', focus: 'somewhat', social: 'yes', appetite: 'more', exercise: 'yes', outdoors: 'yes', balance: 'okay' }, diary: 'Nice, relaxed day. Took a stroll in the park and enjoyed lunch with a friend. Feeling steady.' },
      { responses: { mood: 'anxious', sleep: 'poor', stress: 'high', energy: 'low', focus: 'distracted', social: 'no', appetite: 'less', exercise: 'no', outdoors: 'no', balance: 'chaotic' }, diary: 'Anxiety kept me up last night. Spent the day indoors, struggling to focus on anything.' },
      { responses: { mood: 'happy', sleep: 'great', stress: 'low', energy: 'high', focus: 'focused', social: 'yes', appetite: 'normal', exercise: 'yes', outdoors: 'yes', balance: 'balanced' }, diary: 'Loved today! Morning run was refreshing, and dinner with family was so heartwarming.' },
      { responses: { mood: 'angry', sleep: 'okay', stress: 'medium', energy: 'medium', focus: 'somewhat', social: 'yes', appetite: 'normal', exercise: 'no', outdoors: 'yes', balance: 'okay' }, diary: 'Frustrated at work, but a walk outside helped. Meeting a friend later lifted my spirits.' },
      { responses: { mood: 'calm', sleep: 'great', stress: 'low', energy: 'high', focus: 'focused', social: 'no', appetite: 'more', exercise: 'yes', outdoors: 'yes', balance: 'balanced' }, diary: 'Slept well and spent the day gardening. So calm and productive, though I ate a ton!' },
      { responses: { mood: 'sad', sleep: 'poor', stress: 'high', energy: 'low', focus: 'distracted', social: 'no', appetite: 'less', exercise: 'no', outdoors: 'no', balance: 'chaotic' }, diary: 'Really rough day. Barely slept, and everything felt heavy. Stayed in bed most of the time.' },
      { responses: { mood: 'happy', sleep: 'okay', stress: 'medium', energy: 'medium', focus: 'somewhat', social: 'yes', appetite: 'normal', exercise: 'yes', outdoors: 'yes', balance: 'okay' }, diary: 'Solid day. Hit the gym and grabbed coffee with friends. Feeling pretty good overall.' },
      { responses: { mood: 'anxious', sleep: 'poor', stress: 'high', energy: 'low', focus: 'distracted', social: 'no', appetite: 'less', exercise: 'no', outdoors: 'no', balance: 'chaotic' }, diary: 'Anxious about a deadline. Poor sleep didn’t help, and I stayed inside all day.' },
      { responses: { mood: 'calm', sleep: 'great', stress: 'low', energy: 'high', focus: 'focused', social: 'yes', appetite: 'normal', exercise: 'yes', outdoors: 'yes', balance: 'balanced' }, diary: 'Amazing day! Worked out and hung out with friends at the park. Everything feels perfect.' },
      { responses: { mood: 'happy', sleep: 'okay', stress: 'medium', energy: 'medium', focus: 'somewhat', social: 'yes', appetite: 'more', exercise: 'yes', outdoors: 'yes', balance: 'okay' }, diary: 'Fun day cycling with friends and enjoying a big lunch. A bit stressed but mostly happy.' }
    ];

    let currentDate = new Date(startDate);
    let responseIndex = 0;

    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const { responses, diary } = sampleData[responseIndex % sampleData.length];
      const { tips, motivation } = applyRuleML(rulemlDoc, responses);

      const moodData = {
        responses,
        tips: tips.slice(0, 4),
        motivation,
        diary,
        date: dateStr
      };

      storage.setItem(`mood-${dateStr}`, JSON.stringify(moodData));
      currentDate.setDate(currentDate.getDate() + 1);
      responseIndex++;
    }

    renderCalendar();
  }

  // Init
  if (container && prevBtn && nextBtn && progressBar) {
    renderQuestion();
    renderCalendar();
    addSampleMoodData().catch(err => console.error('Error adding sample data:', err));
  }

  // Modal Event Listeners
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      if (calendarModal) calendarModal.classList.remove('show');
    });
  }
  if (calendarModal) {
    calendarModal.addEventListener('click', (e) => {
      if (e.target === calendarModal) {
        calendarModal.classList.remove('show');
      }
    });
  }
});
