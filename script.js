const state = {
    part: 1,
    totalE: 10,
    posPct: 100, // 100% = top, 0% = bottom
    M: 1,
    G: 10,
    workDone: 0
};

let elements = {};

function initElements() {
    elements = {
        partSelector: document.getElementById('part-selector'),
        peNotes: document.getElementById('pe-notes'),
        keNotes: document.getElementById('ke-notes'),
        statPe: document.getElementById('stat-pe'),
        statKe: document.getElementById('stat-ke'),
        statTot: document.getElementById('stat-tot'),
        statH: document.getElementById('stat-h'),
        statV: document.getElementById('stat-v'),
        statPos: document.getElementById('stat-pos'),
        posSlider: document.getElementById('pos-slider'),
        
        posOut: document.getElementById('pos-out'),
        workTotalDisplay: document.getElementById('work-total-display'),
        rampCanvas: document.getElementById('ramp-canvas'),
        partTitle: document.getElementById('part-title'),
        partDesc: document.getElementById('part-desc'),
        taskList: document.getElementById('task-list'),
        annotation: document.getElementById('annotation'),
        workBadge: document.getElementById('work-badge'),
        btnReset: document.getElementById('btn-reset'),
        btnNext: document.getElementById('btn-next'),
        formulaBar: document.getElementById('formula-bar'),
        workControl: document.getElementById('work-control'),
        btnAddWork: document.getElementById('btn-add-work'),
        btnRemWork: document.getElementById('btn-rem-work')
    };
}

const parts = {
    1: {
        title: "Part 1: The Bathtub",
        desc: "Total Energy is Conserved. You can only transfer energy between PE and KE. The total stays at 10 Joules.",
        totalE: 10,
        posPct: 100,
        enableWork: false,
        showPhysics: false,
        tasks: [
            "Predict: If you move the ball halfway down, what happens to the note counts?",
            "Click: Click a Purple note to transfer energy to KE.",
            "Click: Click a Gold note to transfer energy back to PE."
        ],
        hints: {
            top: "All energy is in the PE side. The 'bathtub' is full on the left.",
            middle: "Energy is split evenly. The total is still 10.",
            bottom: "All energy transferred to KE. The total is still 10."
        }
    },
    2: {
        title: "Part 2: Real Values",
        desc: "Calculate actual height and speed. Each note = 1 Joule. Assume mass = 1kg and g = 10m/s².",
        totalE: 10,
        posPct: 100,
        enableWork: false,
        showPhysics: true,
        tasks: [
            "Observe: At the top (1.0m), PE = 10J and KE = 0J.",
            "Predict: If the ball is at 0.4m height, how many notes should be on PE?",
            "Check: Adjust the ball until height is 0.4m. Was your prediction right?"
        ],
        hints: {
            top: "h = 1.0m, v = 0.0m/s. All 10 notes are PE.",
            middle: "h = 0.5m, v = 3.2m/s. Energy is shared.",
            bottom: "h = 0.0m, v = 4.5m/s. All 10 notes are KE."
        }
    },
    3: {
        title: "Part 3: Work (The Faucet & Drain)",
        desc: "External forces can add or remove energy. Changing the total energy is called doing Work.",
        totalE: 5,
        posPct: 100,
        enableWork: true,
        showPhysics: false,
        tasks: [
            "Positive Work: Use the '+ Add' and '- Remove' buttons to perform Work (Energy In).",
            "Negative Work: Slide left to remove notes (Energy Out).",
            "Notice: Does the total energy change? This is Work in action."
        ],
        hints: {
            top: "Adding energy here increases the total capacity of the system.",
            middle: "Work changes the total J, regardless of where the ball is.",
            bottom: "Total energy changes because an outside force acted on the system."
        }
    },
    4: {
        title: "Part 4: Putting It All Together",
        desc: "A scenario with both transfer AND work. Start with 6 PE and perform both changes.",
        totalE: 6,
        posPct: 100,
        enableWork: true,
        showPhysics: true,
        tasks: [
            "Action: Move the ball to the bottom (Energy Transfer).",
            "Action: Add 5 notes using the '+ Add' button (External Work).",
            "Predict: Calculate the new velocity after both changes."
        ],
        hints: {
            top: "Initial state: 6J total.",
            middle: "You are both sliding the ball and adding/removing energy.",
            bottom: "Final state check: Total should be 11J if you added 5."
        }
    }
};

function init() {
    initElements();
    renderPart(1);
    
    elements.partSelector.addEventListener('change', (e) => renderPart(parseInt(e.target.value)));
    elements.posSlider.addEventListener('input', (e) => {
        state.posPct = parseInt(e.target.value);
        updateUI();
    });
    
    elements.btnReset.addEventListener('click', () => renderPart(state.part));
    
    elements.btnAddWork.addEventListener('click', () => {
        state.totalE = Math.min(15, state.totalE + 1);
        state.workDone++;
        updateUI();
    });
    elements.btnRemWork.addEventListener('click', () => {
        state.totalE = Math.max(1, state.totalE - 1);
        state.workDone--;
        updateUI();
    });

    elements.btnNext.addEventListener('click', () => {
        if (state.part < 4) renderPart(state.part + 1);
    });

    window.addEventListener('resize', drawRamp);
}

function renderPart(num) {
    state.part = num;
    elements.partSelector.value = num;
    const config = parts[num];
    
    state.totalE = config.totalE;
    state.posPct = config.posPct;
    state.workDone = 0;
    
    elements.partTitle.innerText = config.title;
    elements.partDesc.innerText = config.desc;
    elements.taskList.innerHTML = config.tasks.map(t => `<li>${t}</li>`).join('');
    
    // Visibility
    elements.workControl.style.opacity = config.enableWork ? '1' : '0.4';
    elements.workControl.style.pointerEvents = config.enableWork ? 'all' : 'none';
    elements.formulaBar.style.display = config.showPhysics ? 'flex' : 'none';
    
    elements.posSlider.value = state.posPct;
    

    updateUI();
}

function updateUI() {
    const pe = Math.round(state.totalE * (state.posPct / 100));
    const ke = state.totalE - pe;
    const h = (pe / (state.M * state.G)).toFixed(1);
    const v = Math.sqrt((2 * ke) / state.M).toFixed(1);
    
    // Stats
    if (elements.statPe) elements.statPe.innerText = pe + " J";
    if (elements.statKe) elements.statKe.innerText = ke + " J";
    if (elements.statTot) elements.statTot.innerText = state.totalE + " J";
    if (elements.statH) elements.statH.innerText = h + " m";
    if (elements.statV) elements.statV.innerText = v + " m/s";
    
    const posLabel = state.posPct > 80 ? 'Top' : state.posPct > 35 ? 'Middle' : 'Bottom';
    if (elements.statPos) elements.statPos.innerText = posLabel;
    if (elements.posOut) elements.posOut.innerText = posLabel;
    

    // Notes
    renderNotes(pe, ke);

    // Badge
    const config = parts[state.part];
    if (config.enableWork) {
        if (state.totalE > config.totalE) {
            elements.workBadge.className = 'work-badge pos';
            elements.workBadge.innerText = '+ Positive Work';
        } else if (state.totalE < config.totalE) {
            elements.workBadge.className = 'work-badge neg';
            elements.workBadge.innerText = '- Negative Work';
        } else {
            elements.workBadge.className = 'work-badge none';
            elements.workBadge.innerText = 'No Work';
        }
    } else {
        elements.workBadge.className = 'work-badge none';
        elements.workBadge.innerText = 'Closed System';
    }

    // Annotation
    const hints = config.hints;
    elements.annotation.innerText = state.posPct > 80 ? hints.top : state.posPct > 35 ? hints.middle : hints.bottom;

    
    if (elements.workTotalDisplay) {
        const sign = state.workDone > 0 ? '+' : '';
        elements.workTotalDisplay.innerText = sign + state.workDone + ' J Work';
        elements.workTotalDisplay.className = 'work-badge ' + (state.workDone > 0 ? 'pos' : (state.workDone < 0 ? 'neg' : 'none'));
    }

    drawRamp();
}

function renderNotes(pe, ke) {
    elements.peNotes.innerHTML = '';
    elements.keNotes.innerHTML = '';
    
    const moveStep = Math.max(1, Math.round(100 / state.totalE));

    for(let i=0; i<pe; i++) {
        const n = document.createElement('div');
        n.className = 'note pe'; n.innerText = 'J';
        n.style.cursor = 'pointer';
        n.onclick = () => {
            state.posPct = Math.max(0, state.posPct - moveStep);
            elements.posSlider.value = state.posPct;
            updateUI();
        };
        elements.peNotes.appendChild(n);
    }
    for(let i=0; i<ke; i++) {
        const n = document.createElement('div');
        n.className = 'note ke'; n.innerText = 'J';
        n.style.cursor = 'pointer';
        n.onclick = () => {
            state.posPct = Math.min(100, state.posPct + moveStep);
            elements.posSlider.value = state.posPct;
            updateUI();
        };
        elements.keNotes.appendChild(n);
    }
}

function drawRamp() {
    const canvas = elements.rampCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, w, h);

    const xTop = 60, yTop = 40;
    const xBot = w - 60, yBot = h - 40;

    // Ground
    ctx.strokeStyle = '#dee2e6'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, yBot); ctx.lineTo(w, yBot); ctx.stroke();

    // Ramp
    ctx.strokeStyle = '#adb5bd'; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(xTop, yTop);
    ctx.quadraticCurveTo(xTop, yBot, xBot, yBot);
    ctx.stroke();

    // Ball Position (t=0 is top, t=1 is bottom)
    const t = 1 - (state.posPct / 100);
    const bx = Math.pow(1-t, 2)*xTop + 2*(1-t)*t*xTop + Math.pow(t, 2)*xBot;
    const by = Math.pow(1-t, 2)*yTop + 2*(1-t)*t*yBot + Math.pow(t, 2)*yBot;
    const r = 12;

    // HUD (Part 2+)
    if (state.part >= 2 || state.part === 4) {
        const pe = Math.round(state.totalE * (state.posPct / 100));
        if (pe > 0) {
            ctx.strokeStyle = '#59118e'; ctx.setLineDash([3, 3]); ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx, yBot); ctx.stroke();
            ctx.setLineDash([]);
        }
        
        const ke = state.totalE - pe;
        if (ke > 0 && state.posPct < 98) {
            ctx.strokeStyle = '#d4a017'; ctx.lineWidth = 3;
            const angle = Math.atan2(yBot - by, xBot - bx);
            const arrowLen = Math.min(40, ke * 5);
            const ax = bx + Math.cos(angle) * (r + arrowLen);
            const ay = by + Math.sin(angle) * (r + arrowLen);
            ctx.beginPath();
            ctx.moveTo(bx + Math.cos(angle)*r, by + Math.sin(angle)*r);
            ctx.lineTo(ax, ay); ctx.stroke();
            
            ctx.fillStyle = '#d4a017';
            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(ax - Math.cos(angle-0.5)*10, ay - Math.sin(angle-0.5)*10);
            ctx.lineTo(ax - Math.cos(angle+0.5)*10, ay - Math.sin(angle+0.5)*10);
            ctx.fill();
        }
    }

    // Ball
    ctx.fillStyle = '#ffc61e';
    ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = '#854F0B'; ctx.lineWidth = 2; ctx.stroke();
}

window.onload = init;
