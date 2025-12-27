// --- State ---
const state = {
  presses: 0,
  confettiHintActive: false,
  confettiHintPresses: 0,

  confettiOnlyCount: 0,
  dopamineMode: false,
  dopamineTick: 0,

  confettiEscalationSeen: false
};



// --- Elements ---
const phraseEl = document.getElementById("phrase");
const mainButton = document.getElementById("main-button");
const confettiButton = document.getElementById("confetti-button");
const subtextEl = document.getElementById("subtext");

// --- Phrase pool state ---
let unusedPhrases = [...PHRASES];

function getNextPhrase() {
  if (unusedPhrases.length === 0) {
    unusedPhrases = [...PHRASES];
  }

  const index = Math.floor(Math.random() * unusedPhrases.length);
  return unusedPhrases.splice(index, 1)[0];
}

const DOPAMINE_PHRASES = [
  "yeah",
  "okay",
  "dopamine",
  "this",
  "brrr",
  "mmhm",
  "uh-huh",
];


// --- Confetti ---
function fireConfetti() {
  const duration = 800;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}


// --- Main button handler ---
function handleMainPress() {
  state.confettiOnlyCount = 0;
  state.dopamineMode = false;
  state.dopamineTick = 0;
  state.presses += 1;

  // update phrase (placeholder for now)
  phraseEl.textContent = getNextPhrase();
  setTimeout(fireConfetti, 1500);

  // button label progression
  if (state.presses === 1) {
    mainButton.textContent = "Tap";
    subtextEl.hidden = true;
  } else if (state.presses === 2) {
    mainButton.textContent = "More";
    subtextEl.hidden = true;
  } else if (state.presses === 3) {
    mainButton.textContent = "More, please";
    subtextEl.hidden = true;
  } else if (state.presses === 4) {
    mainButton.textContent = "...again";
    subtextEl.textContent = "Tough day, huh?";
    subtextEl.hidden = false;
  } else {
    mainButton.textContent = "";
    subtextEl.textContent = "Stay as long as you need.";
    subtextEl.hidden = false;
  }

  // show confetti-only button later
  if (state.presses === 10) {
    confettiButton.hidden = false;
    state.confettiHintActive = true;
    state.confettiHintPresses = 0;
    subtextEl.textContent = "Thought you might like this if you're here for the confetti.";
    subtextEl.hidden = false;
  }

  // handle confetti hint countdown
  if (state.confettiHintActive) {
    state.confettiHintPresses += 1;

    if (state.confettiHintPresses >= 3) {
      state.confettiHintActive = false;
      subtextEl.textContent = "Stay as long as you need.";
    }
  }

  console.log("Presses:", state.presses);
}

// --- Events ---
mainButton.addEventListener("click", handleMainPress);
confettiButton.addEventListener("click", () => {
  // immediate confetti
  fireConfetti();

  // count consecutive confetti presses
  state.confettiOnlyCount += 1;

  // still in hint phase?
  if (state.confettiHintActive) {
    state.confettiHintPresses += 1;

    if (state.confettiHintPresses >= 3) {
      state.confettiHintActive = false;
      subtextEl.textContent = "Stay as long as you need.";
    }
    return;
  }

  // escalation phase
if (!state.dopamineMode) {
  if (state.confettiOnlyCount >= 6) {
    if (!state.confettiEscalationSeen) {
      subtextEl.textContent = "Yeah, no, this is definitely helping";
      state.confettiEscalationSeen = true;
    }
    state.dopamineMode = true;
    state.dopamineTick = 0;
  } else if (state.confettiOnlyCount >= 3) {
    if (!state.confettiEscalationSeen) {
      subtextEl.textContent = "Yay";
    }
  }
  return;
}


// pure dopamine abuse mode
state.dopamineTick += 1;

// remove subtext entirely if we want silence
subtextEl.hidden = true;

// only change the main phrase occasionally
if (state.dopamineTick % 5 === 0) {
  const index = Math.floor(Math.random() * DOPAMINE_PHRASES.length);
  phraseEl.textContent = DOPAMINE_PHRASES[index];
}

});


