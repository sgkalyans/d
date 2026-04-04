// Game engine
(function () {
  const GAME_DURATION  = 60;  // seconds
  const ROPE_MAX_PX    = 180; // max track shift each direction (px)
  const ROPE_PER_POINT = 30;  // px shift per score-point difference

  // Load state
  const team1 = TOW.load('team1', 'குழு 1');
  const team2 = TOW.load('team2', 'குழு 2');
  const diff   = TOW.load('difficulty', 'easy');

  let score1 = 0, score2 = 0;
  let timeLeft = GAME_DURATION;
  let timerInterval = null;
  let gameOver = false;

  // Question queues — independent shuffled copies per team
  let q1Pool = getShuffledQuestions(diff);
  let q2Pool = getShuffledQuestions(diff);
  let q1Idx  = 0;
  let q2Idx  = 0;

  // DOM refs
  const t1Label  = document.getElementById('t1Label');
  const t2Label  = document.getElementById('t2Label');
  const t1Score  = document.getElementById('t1Score');
  const t2Score  = document.getElementById('t2Score');
  const p1Name   = document.getElementById('p1Name');
  const p2Name   = document.getElementById('p2Name');
  const p1Score  = document.getElementById('p1Score');
  const p2Score  = document.getElementById('p2Score');
  const timerDisplay = document.getElementById('timerDisplay');
  const timerBlock   = document.getElementById('timerBlock');
  const tugTrack     = document.getElementById('tugTrack');

  // ── Init ──
  function init() {
    t1Label.textContent = team1;
    t2Label.textContent = team2;
    p1Name.textContent  = team1;
    p2Name.textContent  = team2;
    loadQuestion(1);
    loadQuestion(2);
    startTimer();
  }

  // ── Timer ──
  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeLeft--;
      updateTimerDisplay();
      if (timeLeft <= 10) timerBlock.classList.add('urgent');
      if (timeLeft <= 0)  endGame();
    }, 1000);
  }

  function updateTimerDisplay() {
    const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const s = String(timeLeft % 60).padStart(2, '0');
    timerDisplay.textContent = m + ':' + s;
  }

  // ── Load a question into a panel ──
  function loadQuestion(team) {
    const pool  = team === 1 ? q1Pool : q2Pool;
    const idx   = team === 1 ? q1Idx  : q2Idx;
    const qText = document.getElementById('q' + team + 'Text');
    const opts  = document.getElementById('opts' + team);

    // Cycle through pool — reshuffle when exhausted
    let qIdx = idx % pool.length;
    const q = pool[qIdx];

    qText.textContent = q.q;
    opts.innerHTML = '';

    const labels = ['A', 'B', 'C', 'D'];
    q.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span class="opt-label">${labels[i]}</span> ${escapeHtml(opt)}`;
      btn.addEventListener('click', () => handleAnswer(team, i, q.ans, btn, opts));
      opts.appendChild(btn);
    });
  }

  // ── Answer handler ──
  function handleAnswer(team, chosen, correct, clickedBtn, optsEl) {
    if (gameOver) return;

    // Disable all buttons in this panel
    optsEl.querySelectorAll('.option-btn').forEach(b => b.classList.add('disabled'));

    if (chosen === correct) {
      clickedBtn.classList.add('correct');
      if (team === 1) { score1++; updateScores(); }
      else            { score2++; updateScores(); }
    } else {
      clickedBtn.classList.add('wrong');
      // Opponent benefits
      if (team === 1) { score2++; updateScores(); }
      else            { score1++; updateScores(); }
    }

    // Next question after brief flash
    setTimeout(() => {
      if (gameOver) return;
      if (team === 1) q1Idx++;
      else            q2Idx++;
      loadQuestion(team);
    }, 700);
  }

  // ── Update scores and rope ──
  function updateScores() {
    t1Score.textContent = score1;
    t2Score.textContent = score2;
    p1Score.textContent = score1;
    p2Score.textContent = score2;
    updateRope();
  }

  function updateRope() {
    // Team1 winning (score1 > score2): track moves LEFT → Team2 dragged toward Team1's side
    // Team2 winning (score2 > score1): track moves RIGHT → Team1 dragged toward Team2's side
    const delta = score2 - score1; // negated so direction is correct
    const shift = Math.max(-ROPE_MAX_PX, Math.min(ROPE_MAX_PX, delta * ROPE_PER_POINT));
    tugTrack.style.transform = `translateX(${shift}px)`;
  }

  // ── End game ──
  function endGame() {
    if (gameOver) return;
    gameOver = true;
    clearInterval(timerInterval);
    // Disable all buttons
    document.querySelectorAll('.option-btn').forEach(b => b.classList.add('disabled'));
    TOW.save('score1', score1);
    TOW.save('score2', score2);
    setTimeout(() => { window.location.href = 'results.html'; }, 800);
  }

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  init();
})();
