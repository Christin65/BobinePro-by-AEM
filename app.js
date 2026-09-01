/**
 * BobinagePro - Moteur Principal d'Atelier Électromécanique
 * Édition Madagascar (Devis en Ariary & Identité d'Atelier)
 * Auteur : Antigravity (Google DeepMind) pour Artisans Bobiniers
 */

// =============================================================================
// 1. BASE DE DONNÉES DES FILS DE CUIVRE ÉMAILLÉS STANDARDS (CEI 60317)
// =============================================================================
const ENAMELED_WIRES_DB = [
  { diam: 0.10, awg: 38, section: 0.00785, res: 2.19, weight: 0.070 },
  { diam: 0.12, awg: 36, section: 0.01131, res: 1.52, weight: 0.101 },
  { diam: 0.15, awg: 34, section: 0.01767, res: 0.975, weight: 0.158 },
  { diam: 0.18, awg: 33, section: 0.02545, res: 0.677, weight: 0.227 },
  { diam: 0.20, awg: 32, section: 0.03142, res: 0.548, weight: 0.280 },
  { diam: 0.22, awg: 31, section: 0.03801, res: 0.453, weight: 0.339 },
  { diam: 0.25, awg: 30, section: 0.04909, res: 0.351, weight: 0.438 },
  { diam: 0.28, awg: 29, section: 0.06158, res: 0.280, weight: 0.549 },
  { diam: 0.30, awg: 28, section: 0.07069, res: 0.244, weight: 0.631 },
  { diam: 0.35, awg: 27, section: 0.09621, res: 0.179, weight: 0.858 },
  { diam: 0.40, awg: 26, section: 0.12566, res: 0.137, weight: 1.121 },
  { diam: 0.45, awg: 25, section: 0.15904, res: 0.108, weight: 1.419 },
  { diam: 0.50, awg: 24, section: 0.19635, res: 0.0878, weight: 1.751 },
  { diam: 0.55, awg: 23, section: 0.23758, res: 0.0725, weight: 2.119 },
  { diam: 0.60, awg: 22, section: 0.28274, res: 0.0609, weight: 2.522 },
  { diam: 0.63, awg: 22, section: 0.31172, res: 0.0553, weight: 2.781 },
  { diam: 0.67, awg: 21, section: 0.35257, res: 0.0489, weight: 3.145 },
  { diam: 0.71, awg: 21, section: 0.39592, res: 0.0435, weight: 3.532 },
  { diam: 0.75, awg: 20, section: 0.44179, res: 0.0390, weight: 3.941 },
  { diam: 0.80, awg: 20, section: 0.50265, res: 0.0343, weight: 4.484 },
  { diam: 0.85, awg: 19, section: 0.56745, res: 0.0304, weight: 5.062 },
  { diam: 0.90, awg: 19, section: 0.63617, res: 0.0271, weight: 5.675 },
  { diam: 0.95, awg: 18, section: 0.70882, res: 0.0243, weight: 6.323 },
  { diam: 1.00, awg: 18, section: 0.78540, res: 0.0219, weight: 7.006 },
  { diam: 1.06, awg: 17, section: 0.88247, res: 0.0195, weight: 7.872 },
  { diam: 1.12, awg: 17, section: 0.98520, res: 0.0175, weight: 8.788 },
  { diam: 1.18, awg: 16, section: 1.09359, res: 0.0158, weight: 9.755 },
  { diam: 1.25, awg: 16, section: 1.22718, res: 0.0140, weight: 10.947 },
  { diam: 1.32, awg: 15, section: 1.36848, res: 0.0126, weight: 12.207 },
  { diam: 1.40, awg: 15, section: 1.53938, res: 0.0112, weight: 13.731 },
  { diam: 1.50, awg: 14, section: 1.76715, res: 0.00975, weight: 15.763 },
  { diam: 1.60, awg: 14, section: 2.01062, res: 0.00857, weight: 17.935 },
  { diam: 1.70, awg: 13, section: 2.26980, res: 0.00759, weight: 20.247 },
  { diam: 1.80, awg: 13, section: 2.54469, res: 0.00677, weight: 22.699 },
  { diam: 1.90, awg: 12, section: 2.83529, res: 0.00608, weight: 25.291 },
  { diam: 2.00, awg: 12, section: 3.14159, res: 0.00548, weight: 28.023 },
  { diam: 2.24, awg: 11, section: 3.94081, res: 0.00437, weight: 35.152 },
  { diam: 2.50, awg: 10, section: 4.90874, res: 0.00351, weight: 43.786 },
  { diam: 2.80, awg: 9,  section: 6.15752, res: 0.00280, weight: 54.925 },
  { diam: 3.00, awg: 8,  section: 7.06858, res: 0.00244, weight: 63.052 }
];

// =============================================================================
// 2. ÉTAT GLOBAL DE L'APPLICATION
// =============================================================================
const AppState = {
  activeTab: 'tab-schema',
  selectedPhase: 'all', // 'all', 'U', 'V', 'W'
  viewMode: 'linear', // 'linear' ou 'circular'
  zoomLevel: 1.0,
  
  // Profil de l'Atelier (Madagascar)
  workshop: {
    name: 'Atelier Électromécanique Moderne (AEM)',
    manager: 'Papi Aymie',
    phone: '+261 34 00 000 00',
    city: 'Antananarivo, Madagascar',
    nif: 'Réf: ATELIER-BOB-01'
  },

  // Fiche Moteur en cours
  currentJob: {
    id: 'JOB-2026-0816-01',
    client: 'Société Industrielle d\'Antananarivo',
    brand: 'Leroy-Somer',
    model: 'FLS 132 M',
    serial: 'LS-789456-2024',
    power: 5.5, // kW
    voltage: '230/400',
    current: '19.2/11.1',
    speed: 1450,
    frequency: 50,
    cosphi: 0.84,
    statorD: 130, // mm
    statorL: 140, // mm
    slotsZ: 36,
    slotH: 22, // mm
    slotW: 8.5, // mm
    poles2p: 4,
    turnsPerSlot: 32,
    wireDiam: 1.00,
    parallelWires: 1,
    extractedWeight: 4.8,
    pitch: '1-8',
    coupling: 'triangle-etoile',
    chignonLen: 45,
    observations: 'Rebobinage complet après échauffement. Remplacement des roulements et imprégnation vernis Classe H.',
    
    // Frais & Devis en Ariary (MGA)
    costCopperPerKg: 95000, // Ar / kg
    costConsumables: 45000, // Ar
    costBearings: 60000, // Ar
    costLabor: 250000, // Ar
    costAdvance: 150000 // Ar
  }
};

// =============================================================================
// 3. INITIALISATION AU CHARGEMENT DU DOM
// =============================================================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTabs();
  initWorkshopProfile();
  initSchemaControls();
  initJobSheet();
  initMaterialsCalculator();
  initWireTableAndSubstitution();
  initAdaptationAndTransformer();
  initPrintAndExport();
  loadSavedJobs();

  // Premier rendu
  renderWindingSchema();
  updateAllCalculations();
});

// Formatage monétaire dynamique
function formatAriary(amount) {
  const rounded = Math.round(amount);
  const currency = document.getElementById('ws-currency') ? document.getElementById('ws-currency').value : 'Ar';
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ' + currency;
}

// =============================================================================
// 4. IDENTITÉ ATELIER (PROFIL MADAGASCAR)
// =============================================================================
function initWorkshopProfile() {
  const savedProfile = localStorage.getItem('bobinage_workshop_profile');
  if (savedProfile) {
    try {
      AppState.workshop = JSON.parse(savedProfile);
    } catch(e) {}
  }
  updateWorkshopDisplay();

  const modal = document.getElementById('modal-workshop');
  const btnOpen = document.getElementById('btn-open-workshop-modal');
  const btnClose = document.getElementById('btn-close-workshop-modal');
  const btnCancel = document.getElementById('btn-cancel-workshop');
  const form = document.getElementById('form-workshop-profile');

  btnOpen.addEventListener('click', () => {
    document.getElementById('ws-name').value = AppState.workshop.name;
    document.getElementById('ws-manager').value = AppState.workshop.manager;
    document.getElementById('ws-phone').value = AppState.workshop.phone;
    document.getElementById('ws-city').value = AppState.workshop.city;
    document.getElementById('ws-nif').value = AppState.workshop.nif;
    modal.showModal();
  });

  const closeModal = () => modal.close();
  btnClose.addEventListener('click', closeModal);
  btnCancel.addEventListener('click', closeModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    AppState.workshop.name = document.getElementById('ws-name').value || 'Mon Atelier';
    AppState.workshop.manager = document.getElementById('ws-manager').value;
    AppState.workshop.phone = document.getElementById('ws-phone').value;
    AppState.workshop.city = document.getElementById('ws-city').value;
    AppState.workshop.nif = document.getElementById('ws-nif').value;

    localStorage.setItem('bobinage_workshop_profile', JSON.stringify(AppState.workshop));
    updateWorkshopDisplay();
    closeModal();
  });
}

function updateWorkshopDisplay() {
  const ws = AppState.workshop;
  const nameEl = document.getElementById('header-workshop-name');
  const contactEl = document.getElementById('header-workshop-contact');
  const footerEl = document.getElementById('footer-workshop-name');

  if (nameEl) nameEl.textContent = ws.name;
  if (contactEl) contactEl.textContent = `${ws.city} • Tél: ${ws.phone} • Resp: ${ws.manager}`;
  if (footerEl) footerEl.textContent = ws.name;
}

// =============================================================================
// 5. GESTION DES THÈMES & ONGLETS
// =============================================================================
function initTheme() {
  const btnToggleTheme = document.getElementById('btn-toggle-theme');
  const savedTheme = localStorage.getItem('bobinage_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  btnToggleTheme.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('bobinage_theme', next);
    renderWindingSchema();
  });
}

function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetId = btn.getAttribute('data-tab');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
      AppState.activeTab = targetId;

      if (targetId === 'tab-schema') {
        renderWindingSchema();
      }
    });
  });
}

// =============================================================================
// 6. MOTEUR DE SCHÉMA DE BOBINAGE (SVG VECTORIEL INTERACTIF)
// =============================================================================
function initSchemaControls() {
  const slotsInput = document.getElementById('cfg-slots');
  const slotsPreset = document.getElementById('cfg-slots-preset');
  const polesSelect = document.getElementById('cfg-poles');
  const phasesSelect = document.getElementById('cfg-phases');
  const windingTypeSelect = document.getElementById('cfg-winding-type');
  const pitchInput = document.getElementById('cfg-pitch');
  const btnRecalc = document.getElementById('btn-recalculate-schema');
  const phasePills = document.querySelectorAll('.phase-pill');

  slotsPreset.addEventListener('change', (e) => {
    if (e.target.value) {
      slotsInput.value = e.target.value;
      updatePitchDefault();
      renderWindingSchema();
    }
  });

  slotsInput.addEventListener('input', () => {
    updatePitchDefault();
    renderWindingSchema();
  });

  polesSelect.addEventListener('change', () => {
    updatePitchDefault();
    renderWindingSchema();
  });

  phasesSelect.addEventListener('change', renderWindingSchema);
  windingTypeSelect.addEventListener('change', renderWindingSchema);
  pitchInput.addEventListener('input', renderWindingSchema);
  btnRecalc.addEventListener('click', renderWindingSchema);

  phasePills.forEach(pill => {
    pill.addEventListener('click', () => {
      phasePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      AppState.selectedPhase = pill.getAttribute('data-phase');
      renderWindingSchema();
    });
  });

  // Radio view mode
  document.querySelectorAll('input[name="view-mode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      AppState.viewMode = e.target.value;
      renderWindingSchema();
    });
  });

  // Zoom controls
  document.getElementById('btn-zoom-in').addEventListener('click', () => {
    AppState.zoomLevel = Math.min(AppState.zoomLevel + 0.2, 2.5);
    applyZoom();
  });
  document.getElementById('btn-zoom-out').addEventListener('click', () => {
    AppState.zoomLevel = Math.max(AppState.zoomLevel - 0.2, 0.6);
    applyZoom();
  });
  document.getElementById('btn-zoom-reset').addEventListener('click', () => {
    AppState.zoomLevel = 1.0;
    applyZoom();
  });
}

function applyZoom() {
  const svg = document.getElementById('winding-svg');
  if (svg) {
    svg.style.transform = `scale(${AppState.zoomLevel})`;
    svg.style.transformOrigin = 'center top';
  }
}

function updatePitchDefault() {
  const Z = parseInt(document.getElementById('cfg-slots').value) || 36;
  const p2 = parseInt(document.getElementById('cfg-poles').value) || 4;
  const tau_p = Z / p2;
  const pitchShortened = Math.max(1, Math.round(tau_p * 0.85));
  document.getElementById('badge-pas-theorique').textContent = `Pas polaire = ${tau_p} encoches`;
  document.getElementById('cfg-pitch').value = `1-${1 + pitchShortened}`;
}

/**
 * Calcul et dessin du schéma vectoriel de bobinage
 */
function renderWindingSchema() {
  const svg = document.getElementById('winding-svg');
  if (!svg) return;

  const Z = parseInt(document.getElementById('cfg-slots').value) || 36;
  const p2 = parseInt(document.getElementById('cfg-poles').value) || 4;
  const phases = parseInt(document.getElementById('cfg-phases').value) || 3;
  const windingType = document.getElementById('cfg-winding-type').value;
  const pitchStr = document.getElementById('cfg-pitch').value || '1-8';

  let pitchSpan = 7;
  if (pitchStr.includes('-')) {
    const parts = pitchStr.split('-');
    pitchSpan = Math.abs(parseInt(parts[1]) - parseInt(parts[0])) || 7;
  }

  const q = Z / (p2 * phases);
  const tau_p = Z / p2;
  const alpha_e = (p2 / 2) * (360 / Z);
  const phaseShiftSlots = Math.round((120 / alpha_e)) || Math.round(2 * q);

  document.getElementById('stat-q').textContent = Number.isInteger(q) ? q : q.toFixed(2);
  document.getElementById('stat-tau-p').textContent = `${tau_p.toFixed(1)} encoches`;
  document.getElementById('stat-alpha').textContent = `${alpha_e.toFixed(1)}°`;
  document.getElementById('stat-phase-shift').textContent = `${phaseShiftSlots} encoches (120°)`;
  document.getElementById('stat-groups').textContent = `${p2 * phases} groupes`;

  svg.innerHTML = '';

  if (AppState.viewMode === 'circular') {
    renderCircularSchema(svg, Z, p2, phases, q);
  } else {
    renderLinearSchema(svg, Z, p2, phases, q, pitchSpan, windingType);
  }

  generateStepGuide(Z, p2, phases, q, pitchSpan, windingType);
}

/**
 * Dessin Vue Développée Étalée
 */
function renderLinearSchema(svg, Z, p2, phases, q, pitchSpan, windingType) {
  const marginX = 80;
  const slotSpacing = Math.max(26, Math.min(45, (1400 - marginX * 2) / (Z + 1)));
  const totalWidth = marginX * 2 + (Z + 1) * slotSpacing;
  const totalHeight = 580;
  
  svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
  
  const slotTopY = 170;
  const slotBottomY = 410;
  const chignonTopPeakY = 60;
  const chignonBottomPeakY = 520;

  const gMain = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gMain.setAttribute('id', 'winding-main-group');

  for (let i = 1; i <= Z; i++) {
    const x = marginX + i * slotSpacing;

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x);
    line.setAttribute('y1', slotTopY);
    line.setAttribute('x2', x);
    line.setAttribute('y2', slotBottomY);
    line.setAttribute('class', 'slot-line');
    gMain.appendChild(line);

    const textTop = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textTop.setAttribute('x', x);
    textTop.setAttribute('y', slotTopY - 12);
    textTop.setAttribute('class', 'slot-marker');
    textTop.textContent = i;
    gMain.appendChild(textTop);

    const textBottom = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textBottom.setAttribute('x', x);
    textBottom.setAttribute('y', slotBottomY + 22);
    textBottom.setAttribute('class', 'slot-marker');
    textBottom.textContent = i;
    gMain.appendChild(textBottom);
  }

  const phaseConfigs = [
    { name: 'U', color: '#EF4444', cssClass: 'coil-u', startSlot: 1, inLabel: 'U1', outLabel: 'U2' },
    { name: 'V', color: '#10B981', cssClass: 'coil-v', startSlot: 1 + Math.round(Z / 3), inLabel: 'V1', outLabel: 'V2' },
    { name: 'W', color: '#3B82F6', cssClass: 'coil-w', startSlot: 1 + Math.round((2 * Z) / 3), inLabel: 'W1', outLabel: 'W2' }
  ];

  if (phases === 1) {
    phaseConfigs.splice(2, 1);
    phaseConfigs[1].name = 'Aux';
    phaseConfigs[1].inLabel = 'Z1';
    phaseConfigs[1].outLabel = 'Z2';
  }

  phaseConfigs.forEach((ph, phIdx) => {
    const isSelected = AppState.selectedPhase === 'all' || AppState.selectedPhase === ph.name;
    const opacity = isSelected ? '1' : '0.12';

    const gPhase = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    gPhase.setAttribute('class', `phase-group phase-${ph.name.toLowerCase()}`);
    gPhase.setAttribute('opacity', opacity);

    for (let pole = 0; pole < p2; pole++) {
      const poleDirection = pole % 2 === 0 ? 1 : -1;
      const poleSlotOffset = pole * (Z / p2);
      const coilsInGroup = Math.max(1, Math.round(q));

      for (let c = 0; c < coilsInGroup; c++) {
        let slotIn, slotOut;

        if (windingType === 'concentrique') {
          const span = pitchSpan + (coilsInGroup - 1 - c) * 2;
          slotIn = Math.round(ph.startSlot + poleSlotOffset + c);
          slotOut = slotIn + span;
        } else {
          slotIn = Math.round(ph.startSlot + poleSlotOffset + c);
          slotOut = slotIn + pitchSpan;
        }

        let sInMod = ((slotIn - 1) % Z) + 1;
        let sOutMod = ((slotOut - 1) % Z) + 1;

        const xIn = marginX + sInMod * slotSpacing;
        const xOut = marginX + sOutMod * slotSpacing;
        const layerOffsetY = phIdx * 12 + c * 8;

        const coilPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        let pathD = '';
        if (xIn < xOut) {
          const cpTopY = chignonTopPeakY + layerOffsetY;
          const cpBottomY = chignonBottomPeakY - layerOffsetY;
          
          pathD = `
            M ${xIn} ${slotBottomY}
            L ${xIn} ${slotTopY}
            C ${xIn} ${cpTopY}, ${xOut} ${cpTopY}, ${xOut} ${slotTopY}
            L ${xOut} ${slotBottomY}
            C ${xOut} ${cpBottomY}, ${xIn} ${cpBottomY}, ${xIn} ${slotBottomY}
          `;
        } else {
          const cpTopY = chignonTopPeakY + layerOffsetY;
          pathD = `
            M ${xIn} ${slotBottomY}
            L ${xIn} ${slotTopY}
            Q ${xIn} ${cpTopY}, ${xIn + slotSpacing} ${cpTopY}
            M ${xOut} ${slotTopY}
            L ${xOut} ${slotBottomY}
          `;
        }

        coilPath.setAttribute('d', pathD);
        coilPath.setAttribute('class', `coil-path ${ph.cssClass}`);
        coilPath.setAttribute('stroke', ph.color);
        
        const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleEl.textContent = `Phase ${ph.name} - Pôle ${pole + 1} : Encoches ${sInMod} ➔ ${sOutMod} (Pas ${Math.abs(slotOut - slotIn)})`;
        coilPath.appendChild(titleEl);

        gPhase.appendChild(coilPath);

        const arrowY = slotTopY + (slotBottomY - slotTopY) / 2;
        const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        arrow.setAttribute('x', xIn);
        arrow.setAttribute('y', arrowY);
        arrow.setAttribute('fill', ph.color);
        arrow.setAttribute('font-size', '14');
        arrow.setAttribute('font-weight', 'bold');
        arrow.setAttribute('text-anchor', 'middle');
        arrow.textContent = poleDirection === 1 ? '▲' : '▼';
        gPhase.appendChild(arrow);
      }
    }

    const terminalX_In = marginX + (((ph.startSlot - 1) % Z) + 1) * slotSpacing;
    const terminalX_Out = marginX + (((ph.startSlot + pitchSpan - 1) % Z) + 1) * slotSpacing;

    const tIn = createTerminalNode(terminalX_In, chignonBottomPeakY + 35, ph.inLabel, ph.color);
    const tOut = createTerminalNode(terminalX_Out, chignonBottomPeakY + 35, ph.outLabel, ph.color);
    
    gPhase.appendChild(tIn);
    gPhase.appendChild(tOut);
    gMain.appendChild(gPhase);
  });

  svg.appendChild(gMain);
}

/**
 * Dessin Vue Circulaire Frontale
 */
function renderCircularSchema(svg, Z, p2, phases, q) {
  const cx = 800;
  const cy = 350;
  const rOuter = 260;
  const rInner = 180;

  svg.setAttribute('viewBox', '0 0 1600 700');

  const gMain = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  const outerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  outerCircle.setAttribute('cx', cx);
  outerCircle.setAttribute('cy', cy);
  outerCircle.setAttribute('r', rOuter);
  outerCircle.setAttribute('fill', 'none');
  outerCircle.setAttribute('stroke', '#334155');
  outerCircle.setAttribute('stroke-width', '4');
  gMain.appendChild(outerCircle);

  const innerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  innerCircle.setAttribute('cx', cx);
  innerCircle.setAttribute('cy', cy);
  innerCircle.setAttribute('r', rInner);
  innerCircle.setAttribute('fill', '#0B0F19');
  innerCircle.setAttribute('stroke', '#475569');
  innerCircle.setAttribute('stroke-width', '2');
  gMain.appendChild(innerCircle);

  for (let i = 1; i <= Z; i++) {
    const angle = ((i - 1) / Z) * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + rInner * Math.cos(angle);
    const y1 = cy + rInner * Math.sin(angle);
    const x2 = cx + (rOuter - 15) * Math.cos(angle);
    const y2 = cy + (rOuter - 15) * Math.sin(angle);

    const slotLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    slotLine.setAttribute('x1', x1);
    slotLine.setAttribute('y1', y1);
    slotLine.setAttribute('x2', x2);
    slotLine.setAttribute('y2', y2);
    slotLine.setAttribute('stroke', '#64748B');
    slotLine.setAttribute('stroke-width', '2');
    gMain.appendChild(slotLine);

    const xt = cx + (rOuter + 18) * Math.cos(angle);
    const yt = cy + (rOuter + 18) * Math.sin(angle) + 4;
    const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    txt.setAttribute('x', xt);
    txt.setAttribute('y', yt);
    txt.setAttribute('class', 'slot-marker');
    txt.setAttribute('font-size', '11');
    txt.textContent = i;
    gMain.appendChild(txt);
  }

  const rotorCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  rotorCircle.setAttribute('cx', cx);
  rotorCircle.setAttribute('cy', cy);
  rotorCircle.setAttribute('r', rInner - 25);
  rotorCircle.setAttribute('fill', 'rgba(56, 189, 248, 0.05)');
  rotorCircle.setAttribute('stroke', '#38BDF8');
  rotorCircle.setAttribute('stroke-dasharray', '5 5');
  gMain.appendChild(rotorCircle);

  const centerText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  centerText.setAttribute('x', cx);
  centerText.setAttribute('y', cy + 5);
  centerText.setAttribute('fill', '#94A3B8');
  centerText.setAttribute('font-family', 'JetBrains Mono');
  centerText.setAttribute('font-weight', 'bold');
  centerText.setAttribute('text-anchor', 'middle');
  centerText.textContent = `${Z} ENCOCHES • ${p2} PÔLES`;
  gMain.appendChild(centerText);

  svg.appendChild(gMain);
}

function createTerminalNode(x, y, label, color) {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.setAttribute('class', 'terminal-node');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', x);
  circle.setAttribute('cy', y);
  circle.setAttribute('r', 12);
  circle.setAttribute('fill', color);
  circle.setAttribute('stroke', '#0B0F19');
  circle.setAttribute('stroke-width', '2');

  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  text.setAttribute('x', x);
  text.setAttribute('y', y + 4);
  text.setAttribute('fill', '#FFFFFF');
  text.setAttribute('text-anchor', 'middle');
  text.textContent = label;

  g.appendChild(circle);
  g.appendChild(text);
  return g;
}

function generateStepGuide(Z, p2, phases, q, pitchSpan, windingType) {
  const container = document.getElementById('guide-steps-container');
  if (!container) return;

  container.innerHTML = '';

  const phaseNames = ['U (Rouge)', 'V (Vert)', 'W (Bleu)'];
  const phaseClasses = ['step-u', 'step-v', 'step-w'];
  const startOffsets = [1, 1 + Math.round(Z / 3), 1 + Math.round((2 * Z) / 3)];

  for (let p = 0; p < Math.min(phases, 3); p++) {
    const card = document.createElement('div');
    card.className = `step-card ${phaseClasses[p]}`;

    let details = '';
    const startS = startOffsets[p];
    for (let pole = 0; pole < p2; pole++) {
      const sIn = ((startS + pole * (Z / p2) - 1) % Z) + 1;
      const sOut = ((sIn + pitchSpan - 1) % Z) + 1;
      details += `• Pôle ${pole + 1} : Entrée encoche <strong>${sIn}</strong> ➔ Sortie encoche <strong>${sOut}</strong><br>`;
    }

    card.innerHTML = `
      <div class="step-card-header">
        <span>Phase ${phaseNames[p]}</span>
        <span>${p2} groupes</span>
      </div>
      <div class="step-card-body">
        ${details}
        <small style="color:var(--text-dim); display:block; margin-top:4px;">Sens pôle à pôle : Inverser entrée/sortie pour pôles alternés.</small>
      </div>
    `;
    container.appendChild(card);
  }
}

// =============================================================================
// 7. FICHE DE RELEVÉ & DEVIS EN ARIARY (JOB SHEET & BILLING)
// =============================================================================
function initJobSheet() {
  const btnSave = document.getElementById('btn-save-job');
  const btnNew = document.getElementById('btn-new-job');
  const btnExample = document.getElementById('btn-example-load');

  const inputsToWatch = [
    'job-client', 'job-brand', 'job-model', 'job-serial',
    'job-power', 'job-voltage', 'job-current', 'job-speed', 'job-stator-d', 
    'job-stator-l', 'job-stator-z', 'job-slot-h', 'job-slot-w', 'job-turns-slot', 
    'job-wire-diam', 'job-parallel-wires', 'job-chignon-len', 'job-observations',
    'cost-copper-per-kg', 'cost-consumables', 'cost-bearings', 'cost-labor', 'cost-advance'
  ];

  inputsToWatch.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        syncJobSheetToState();
        updateAllCalculations();
      });
    }
  });

  btnSave.addEventListener('click', (e) => {
    e.preventDefault();
    saveCurrentJob();
  });

  btnNew.addEventListener('click', (e) => {
    e.preventDefault();
    createNewJob();
  });

  btnExample.addEventListener('click', () => {
    loadExampleJob();
  });
}

function syncJobSheetToState() {
  AppState.currentJob.client = document.getElementById('job-client').value;
  AppState.currentJob.brand = document.getElementById('job-brand').value;
  AppState.currentJob.model = document.getElementById('job-model').value;
  AppState.currentJob.serial = document.getElementById('job-serial').value;
  AppState.currentJob.power = parseFloat(document.getElementById('job-power').value) || 5.5;
  AppState.currentJob.voltage = document.getElementById('job-voltage').value;
  AppState.currentJob.current = document.getElementById('job-current').value;
  AppState.currentJob.speed = parseInt(document.getElementById('job-speed').value) || 1450;
  AppState.currentJob.statorD = parseFloat(document.getElementById('job-stator-d').value) || 130;
  AppState.currentJob.statorL = parseFloat(document.getElementById('job-stator-l').value) || 140;
  AppState.currentJob.slotsZ = parseInt(document.getElementById('job-stator-z').value) || 36;
  AppState.currentJob.slotH = parseFloat(document.getElementById('job-slot-h').value) || 22;
  AppState.currentJob.slotW = parseFloat(document.getElementById('job-slot-w').value) || 8.5;
  AppState.currentJob.turnsPerSlot = parseInt(document.getElementById('job-turns-slot').value) || 32;
  AppState.currentJob.wireDiam = parseFloat(document.getElementById('job-wire-diam').value) || 1.00;
  AppState.currentJob.parallelWires = parseInt(document.getElementById('job-parallel-wires').value) || 1;
  AppState.currentJob.chignonLen = parseFloat(document.getElementById('job-chignon-len').value) || 45;
  AppState.currentJob.observations = document.getElementById('job-observations').value;

  // Tarifs en Ariary
  AppState.currentJob.costCopperPerKg = parseFloat(document.getElementById('cost-copper-per-kg').value) || 95000;
  AppState.currentJob.costConsumables = parseFloat(document.getElementById('cost-consumables').value) || 45000;
  AppState.currentJob.costBearings = parseFloat(document.getElementById('cost-bearings').value) || 0;
  AppState.currentJob.costLabor = parseFloat(document.getElementById('cost-labor').value) || 250000;
  AppState.currentJob.costAdvance = parseFloat(document.getElementById('cost-advance').value) || 0;
}

function saveCurrentJob() {
  syncJobSheetToState();
  const jobs = JSON.parse(localStorage.getItem('bobinage_saved_jobs') || '[]');
  
  const existingIdx = jobs.findIndex(j => j.id === AppState.currentJob.id);
  if (existingIdx >= 0) {
    jobs[existingIdx] = AppState.currentJob;
  } else {
    jobs.unshift(AppState.currentJob);
  }

  localStorage.setItem('bobinage_saved_jobs', JSON.stringify(jobs));
  loadSavedJobs();
  alert(`Fiche ${AppState.currentJob.id} (${AppState.currentJob.brand} ${AppState.currentJob.power}kW) enregistrée avec succès !`);
}

function createNewJob() {
  const newId = `JOB-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10 + Math.random() * 90)}`;
  AppState.currentJob = {
    id: newId,
    client: 'Nouveau Client',
    brand: '',
    model: '',
    serial: '',
    power: 3.0,
    voltage: '230/400',
    current: '6.5',
    speed: 1450,
    frequency: 50,
    cosphi: 0.82,
    statorD: 110,
    statorL: 120,
    slotsZ: 36,
    slotH: 18,
    slotW: 7.0,
    poles2p: 4,
    turnsPerSlot: 40,
    wireDiam: 0.85,
    parallelWires: 1,
    extractedWeight: 3.2,
    pitch: '1-8',
    coupling: 'triangle-etoile',
    chignonLen: 35,
    observations: '',
    costCopperPerKg: 95000,
    costConsumables: 35000,
    costBearings: 0,
    costLabor: 180000,
    costAdvance: 0
  };

  fillJobFormFromState();
  updateAllCalculations();
}

function loadExampleJob() {
  AppState.currentJob = {
    id: 'JOB-EXEMPLE-5.5KW',
    client: 'Société Industrielle d\'Antananarivo',
    brand: 'Leroy-Somer',
    model: 'FLS 132 M 4P',
    serial: 'LS-998822',
    power: 5.5,
    voltage: '230/400',
    current: '19.2/11.1',
    speed: 1450,
    frequency: 50,
    cosphi: 0.84,
    statorD: 130,
    statorL: 140,
    slotsZ: 36,
    slotH: 22,
    slotW: 8.5,
    poles2p: 4,
    turnsPerSlot: 32,
    wireDiam: 1.00,
    parallelWires: 1,
    extractedWeight: 4.8,
    pitch: '1-8',
    coupling: 'triangle-etoile',
    chignonLen: 45,
    observations: 'Rebobinage complet après échauffement. Remplacement des 2 roulements 6308 2RS et vernis Classe H.',
    costCopperPerKg: 95000,
    costConsumables: 45000,
    costBearings: 60000,
    costLabor: 250000,
    costAdvance: 150000
  };

  fillJobFormFromState();
  updateAllCalculations();
  renderWindingSchema();
}

function fillJobFormFromState() {
  document.getElementById('display-job-id').textContent = AppState.currentJob.id;
  document.getElementById('job-client').value = AppState.currentJob.client;
  document.getElementById('job-brand').value = AppState.currentJob.brand;
  document.getElementById('job-model').value = AppState.currentJob.model;
  document.getElementById('job-serial').value = AppState.currentJob.serial;
  document.getElementById('job-power').value = AppState.currentJob.power;
  document.getElementById('job-voltage').value = AppState.currentJob.voltage;
  document.getElementById('job-current').value = AppState.currentJob.current;
  document.getElementById('job-speed').value = AppState.currentJob.speed;
  document.getElementById('job-stator-d').value = AppState.currentJob.statorD;
  document.getElementById('job-stator-l').value = AppState.currentJob.statorL;
  document.getElementById('job-stator-z').value = AppState.currentJob.slotsZ;
  document.getElementById('job-slot-h').value = AppState.currentJob.slotH;
  document.getElementById('job-slot-w').value = AppState.currentJob.slotW;
  document.getElementById('job-turns-slot').value = AppState.currentJob.turnsPerSlot;
  document.getElementById('job-wire-diam').value = AppState.currentJob.wireDiam;
  document.getElementById('job-parallel-wires').value = AppState.currentJob.parallelWires;
  document.getElementById('job-chignon-len').value = AppState.currentJob.chignonLen;
  document.getElementById('job-observations').value = AppState.currentJob.observations;

  document.getElementById('cost-copper-per-kg').value = AppState.currentJob.costCopperPerKg;
  document.getElementById('cost-consumables').value = AppState.currentJob.costConsumables;
  document.getElementById('cost-bearings').value = AppState.currentJob.costBearings;
  document.getElementById('cost-labor').value = AppState.currentJob.costLabor;
  document.getElementById('cost-advance').value = AppState.currentJob.costAdvance;
}

function loadSavedJobs() {
  const container = document.getElementById('saved-jobs-list');
  if (!container) return;

  const jobs = JSON.parse(localStorage.getItem('bobinage_saved_jobs') || '[]');
  container.innerHTML = '';

  if (jobs.length === 0) {
    container.innerHTML = '<p style="color:var(--text-dim); font-size:0.8rem;">Aucune fiche enregistrée. Cliquez sur "Enregistrer la Fiche" pour archiver vos travaux.</p>';
    return;
  }

  jobs.forEach(job => {
    const pill = document.createElement('div');
    pill.className = 'saved-job-pill';
    pill.innerHTML = `
      <div>
        <strong style="display:block; font-size:0.85rem;">${job.brand || 'Moteur'} ${job.power}kW (${job.slotsZ} enc.)</strong>
        <span style="font-size:0.75rem; color:var(--text-dim);">${job.client} • ${job.id}</span>
      </div>
      <button class="btn btn-secondary btn-sm" style="padding:0.25rem 0.5rem;">Ouvrir</button>
    `;
    pill.addEventListener('click', () => {
      AppState.currentJob = job;
      fillJobFormFromState();
      updateAllCalculations();
      renderWindingSchema();
    });
    container.appendChild(pill);
  });
}

// =============================================================================
// 8. CALCULATEUR DE MATIÈRES & FACTURATION ARIARY
// =============================================================================
function initMaterialsCalculator() {}

function updateAllCalculations() {
  // Sécurité BobinagePro — vérifier la licence avant chaque calcul
  if (typeof BobinageSecurity !== 'undefined') {
    if (BobinageSecurity.isTrialExpired()) return;
    BobinageSecurity.incrementCalculs();
    BobinageSecurity.updateBanner();
  }

  const job = AppState.currentJob;

  // 1. Calcul de la géométrie de spire
  const D = job.statorD;
  const L = job.statorL;
  const Z = job.slotsZ;
  const p2 = job.poles2p;
  const tau_p = (Math.PI * D) / p2;
  
  const meanTurnLenMm = 2 * L + 2.3 * tau_p + 2 * job.chignonLen;
  const meanTurnLenM = meanTurnLenMm / 1000;

  const totalTurnsMotor = (Z * job.turnsPerSlot) / 2;
  const totalWireMeters = totalTurnsMotor * meanTurnLenM * job.parallelWires * 1.06;
  const wireSectionMm2 = (Math.PI * Math.pow(job.wireDiam, 2)) / 4;
  const copperMassKg = totalWireMeters * wireSectionMm2 * 0.00896;

  document.getElementById('mat-copper-weight').textContent = `${copperMassKg.toFixed(2)} kg`;
  document.getElementById('mat-copper-detail').textContent = `Ø ${job.wireDiam.toFixed(2)} mm • Longueur totale estimée : ~${Math.round(totalWireMeters)} m (avec 6% marge de frettage)`;

  // 2. Découpe des isolants DMD / Nomex
  const cutLength = Math.round(L + 20);
  const cutWidth = Math.round(2 * job.slotH + job.slotW + 6);

  document.getElementById('mat-insulation-count').textContent = `${Z} pièces`;
  document.getElementById('mat-insulation-size').innerHTML = `Dimensions de découpe : <strong>${cutLength} mm × ${cutWidth} mm</strong> (avec rabats 3mm)`;
  
  const svgCutL = document.getElementById('svg-cut-length');
  const svgCutW = document.getElementById('svg-cut-width');
  if (svgCutL) svgCutL.textContent = `${cutLength} mm`;
  if (svgCutW) svgCutW.textContent = `${cutWidth} mm`;

  // 3. Cales et accessoires
  document.getElementById('mat-wedges-count').textContent = `${Z} cales`;
  document.getElementById('mat-wedges-size').innerHTML = `Longueur unitaire : <strong>${L + 10} mm</strong> • Profil trapézoïdal`;
  document.getElementById('mat-phase-separators').textContent = `${p2 * 3} séparateurs`;
  
  const sleevingMeters = (6 * 0.35 + p2 * 0.15).toFixed(1);
  document.getElementById('mat-sleeving-len').textContent = `${sleevingMeters} mètres`;

  const twineMeters = Math.round(2 * Math.PI * (D + 40) * 0.001 * 8);
  const varnishLiters = (copperMassKg * 0.12).toFixed(1);
  document.getElementById('mat-twine-varnish').textContent = `${twineMeters} m ficelle • ${Math.max(0.5, varnishLiters)} L vernis`;

  // 4. Foisonnement et densité
  const slotAreaUseful = job.slotH * job.slotW * 0.85;
  const copperAreaInSlot = job.turnsPerSlot * wireSectionMm2 * job.parallelWires;
  const fillingRate = Math.min(95, Math.round((copperAreaInSlot / slotAreaUseful) * 100));

  const fillingEl = document.getElementById('verif-filling-rate');
  const fillingProgress = document.getElementById('progress-filling');
  if (fillingEl && fillingProgress) {
    fillingProgress.style.width = `${fillingRate}%`;
    if (fillingRate <= 75) {
      fillingEl.textContent = `${fillingRate} % (Optimal)`;
      fillingEl.style.color = '#10B981';
      fillingProgress.className = 'progress-bar-fill fill-good';
    } else if (fillingRate <= 82) {
      fillingEl.textContent = `${fillingRate} % (Serré mais faisable)`;
      fillingEl.style.color = '#F59E0B';
      fillingProgress.className = 'progress-bar-fill fill-warning';
    } else {
      fillingEl.textContent = `${fillingRate} % (Trop plein - Risque)`;
      fillingEl.style.color = '#EF4444';
      fillingProgress.className = 'progress-bar-fill fill-danger';
    }
  }

  const currentNum = parseFloat(job.current) || (job.power * 1000) / (Math.sqrt(3) * 400 * 0.84 * 0.88);
  const currentPerPhase = currentNum / Math.sqrt(3);
  const currentDensity = currentPerPhase / (wireSectionMm2 * job.parallelWires);

  const densityEl = document.getElementById('verif-current-density');
  const densityProgress = document.getElementById('progress-density');
  if (densityEl && densityProgress) {
    densityEl.textContent = `${currentDensity.toFixed(2)} A/mm²`;
    densityProgress.style.width = `${Math.min(100, (currentDensity / 7) * 100)}%`;
    if (currentDensity <= 5.5) {
      densityEl.style.color = '#10B981';
      densityProgress.className = 'progress-bar-fill fill-good';
    } else if (currentDensity <= 6.5) {
      densityEl.style.color = '#F59E0B';
      densityProgress.className = 'progress-bar-fill fill-warning';
    } else {
      densityEl.style.color = '#EF4444';
      densityProgress.className = 'progress-bar-fill fill-danger';
    }
  }

  document.getElementById('verif-copper-section').textContent = `${copperAreaInSlot.toFixed(2)} mm² / encoche`;

  // 5. CALCUL DU DEVIS EN ARIARY (MADAGASCAR)
  const copperTotalAr = copperMassKg * job.costCopperPerKg;
  const consumablesAr = job.costConsumables;
  const bearingsAr = job.costBearings;
  const laborAr = job.costLabor;
  const grandTotalAr = copperTotalAr + consumablesAr + bearingsAr + laborAr;
  const advanceAr = job.costAdvance;
  const balanceDueAr = Math.max(0, grandTotalAr - advanceAr);

  document.getElementById('inv-copper-weight').textContent = `${copperMassKg.toFixed(2)} kg`;
  document.getElementById('inv-copper-total').textContent = formatAriary(copperTotalAr);
  document.getElementById('inv-consumables-total').textContent = formatAriary(consumablesAr);
  document.getElementById('inv-bearings-total').textContent = formatAriary(bearingsAr);
  document.getElementById('inv-labor-total').textContent = formatAriary(laborAr);
  document.getElementById('inv-grand-total').textContent = formatAriary(grandTotalAr);
  document.getElementById('inv-advance-total').textContent = `- ${formatAriary(advanceAr)}`;
  document.getElementById('inv-balance-due').textContent = formatAriary(balanceDueAr);
}

// =============================================================================
// 9. TABLE DES FILS & ALGORITHME DE SUBSTITUTION
// =============================================================================
function initWireTableAndSubstitution() {
  renderWireTable(ENAMELED_WIRES_DB);

  const searchInput = document.getElementById('wire-table-search');
  searchInput.addEventListener('input', (e) => {
    const q = e.target.value.trim().toLowerCase();
    const filtered = ENAMELED_WIRES_DB.filter(w => 
      w.diam.toString().includes(q) || w.awg.toString().includes(q)
    );
    renderWireTable(filtered);
  });

  const subDiamInput = document.getElementById('sub-orig-diam');
  const subStrandsSelect = document.getElementById('sub-strands-count');

  subDiamInput.addEventListener('input', calculateWireSubstitution);
  subStrandsSelect.addEventListener('change', calculateWireSubstitution);

  calculateWireSubstitution();
}

function renderWireTable(wires) {
  const tbody = document.getElementById('table-wires-body');
  if (!tbody) return;

  tbody.innerHTML = '';
  wires.forEach(w => {
    const tr = document.createElement('tr');
    const maxAmps = (w.section * 5.0).toFixed(2);
    tr.innerHTML = `
      <td><strong>Ø ${w.diam.toFixed(2)}</strong></td>
      <td>AWG ${w.awg}</td>
      <td>${w.section.toFixed(4)}</td>
      <td>${w.res.toFixed(4)}</td>
      <td>${w.weight.toFixed(2)}</td>
      <td><span style="color:#10B981;">${maxAmps} A</span></td>
    `;
    tbody.appendChild(tr);
  });
}

function calculateWireSubstitution() {
  const origDiam = parseFloat(document.getElementById('sub-orig-diam').value) || 1.20;
  const strands = parseInt(document.getElementById('sub-strands-count').value) || 2;
  const container = document.getElementById('sub-results-container');
  if (!container) return;

  const origSection = (Math.PI * Math.pow(origDiam, 2)) / 4;
  document.getElementById('sub-orig-section').textContent = `${origSection.toFixed(3)} mm²`;

  const targetSectionPerStrand = origSection / strands;
  const idealDiamPerStrand = Math.sqrt((4 * targetSectionPerStrand) / Math.PI);

  const sortedWires = [...ENAMELED_WIRES_DB].sort((a, b) => {
    return Math.abs(a.diam - idealDiamPerStrand) - Math.abs(b.diam - idealDiamPerStrand);
  });

  container.innerHTML = '';

  for (let i = 0; i < Math.min(3, sortedWires.length); i++) {
    const candidate = sortedWires[i];
    const totalNewSection = candidate.section * strands;
    const diffPercent = ((totalNewSection - origSection) / origSection) * 100;
    const isBest = i === 0;

    const card = document.createElement('div');
    card.className = `sub-card ${isBest ? 'best-match' : ''}`;
    
    const diffSign = diffPercent >= 0 ? '+' : '';
    const diffClass = Math.abs(diffPercent) <= 3 ? 'diff-exact' : 'diff-ok';

    card.innerHTML = `
      <div class="sub-card-title">${strands} × Ø ${candidate.diam.toFixed(2)} mm</div>
      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:4px;">Section totale : ${totalNewSection.toFixed(3)} mm²</div>
      <div class="sub-card-diff ${diffClass}">Écart : ${diffSign}${diffPercent.toFixed(1)} % ${isBest ? '⭐ Idéal' : ''}</div>
    `;
    container.appendChild(card);
  }
}

// =============================================================================
// 10. ADAPTATION DE TENSION & MODULE TRANSFORMATEUR
// =============================================================================
function initAdaptationAndTransformer() {
  const vOrig = document.getElementById('adapt-v-orig');
  const vTarget = document.getElementById('adapt-v-target');
  const spiresOrig = document.getElementById('adapt-spires-orig');
  const diamOrig = document.getElementById('adapt-diam-orig');

  [vOrig, vTarget, spiresOrig, diamOrig].forEach(el => {
    el.addEventListener('input', calculateVoltageAdaptation);
  });
  calculateVoltageAdaptation();

  const trPower = document.getElementById('tr-power');
  const trFreq = document.getElementById('tr-freq');
  const trBMax = document.getElementById('tr-b-max');
  const trUPrim = document.getElementById('tr-u-prim');
  const trUSec = document.getElementById('tr-u-sec');

  [trPower, trFreq, trBMax, trUPrim, trUSec].forEach(el => {
    el.addEventListener('input', calculateTransformer);
  });
  calculateTransformer();
}

function calculateVoltageAdaptation() {
  const U1 = parseFloat(document.getElementById('adapt-v-orig').value) || 220;
  const U2 = parseFloat(document.getElementById('adapt-v-target').value) || 380;
  const N1 = parseInt(document.getElementById('adapt-spires-orig').value) || 40;
  const d1 = parseFloat(document.getElementById('adapt-diam-orig').value) || 0.95;

  const ratio = U2 / U1;
  const N2 = Math.round(N1 * ratio);
  const d2 = d1 * Math.sqrt(1 / ratio);

  document.getElementById('adapt-res-volt').textContent = `${U2} V`;
  document.getElementById('adapt-res-spires').textContent = `${N2} spires`;
  document.getElementById('adapt-res-diam').textContent = `Ø ${d2.toFixed(2)} mm`;

  const closest = ENAMELED_WIRES_DB.reduce((prev, curr) => 
    Math.abs(curr.diam - d2) < Math.abs(prev.diam - d2) ? curr : prev
  );
  document.getElementById('adapt-res-standard').textContent = `Ø ${closest.diam.toFixed(2)} mm (AWG ${closest.awg})`;
}

function calculateTransformer() {
  const S = parseFloat(document.getElementById('tr-power').value) || 500;
  const f = parseFloat(document.getElementById('tr-freq').value) || 50;
  const Bmax = parseFloat(document.getElementById('tr-b-max').value) || 1.2;
  const U1 = parseFloat(document.getElementById('tr-u-prim').value) || 230;
  const U2 = parseFloat(document.getElementById('tr-u-sec').value) || 24;

  const Sfer = 1.15 * Math.sqrt(S);
  const spiresPerVolt = 1 / (4.44 * f * Bmax * (Sfer * 0.0001));

  const N1 = Math.round(U1 * spiresPerVolt);
  const N2 = Math.round(U2 * spiresPerVolt * 1.05);

  const I1 = S / U1;
  const I2 = S / U2;
  const J = 3.0;

  const section1 = I1 / J;
  const section2 = I2 / J;
  const diam1 = Math.sqrt((4 * section1) / Math.PI);
  const diam2 = Math.sqrt((4 * section2) / Math.PI);

  document.getElementById('tr-res-sfer').textContent = `${Sfer.toFixed(1)} cm²`;
  document.getElementById('tr-res-spv').textContent = `${spiresPerVolt.toFixed(2)} spires / V`;
  document.getElementById('tr-res-prim').textContent = `${N1} spires • Ø ${diam1.toFixed(2)} mm`;
  document.getElementById('tr-res-sec').textContent = `${N2} spires • Ø ${diam2.toFixed(2)} mm`;
}

// =============================================================================
// 11. EXPORT SVG & IMPRESSION A4 DE LA FICHE D'ATELIER (AVEC DEVIS ARIARY)
// =============================================================================
function initPrintAndExport() {
  const btnPrint = document.getElementById('btn-print-fiche');
  const btnExportSvg = document.getElementById('btn-download-svg');

  btnPrint.addEventListener('click', () => {
    preparePrintLayout();
    window.print();
  });

  btnExportSvg.addEventListener('click', () => {
    const svg = document.getElementById('winding-svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Schema_Bobinage_${AppState.currentJob.slotsZ}enc_${AppState.currentJob.poles2p}poles.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

function preparePrintLayout() {
  const printWrapper = document.getElementById('print-sheet-wrapper');
  if (!printWrapper) return;

  const ws = AppState.workshop;
  const job = AppState.currentJob;
  const copper = document.getElementById('mat-copper-weight').textContent;
  const insulation = document.getElementById('mat-insulation-size').textContent;
  const filling = document.getElementById('verif-filling-rate').textContent;

  const grandTotal = document.getElementById('inv-grand-total').textContent;
  const advance = document.getElementById('inv-advance-total').textContent;
  const balanceDue = document.getElementById('inv-balance-due').textContent;

  printWrapper.innerHTML = `
    <div style="font-family: Arial, sans-serif; padding: 15px; color: #000; line-height: 1.3;">
      <!-- En-tête Atelier Madagascar -->
      <div style="display:flex; justify-content:space-between; border-bottom:2px solid #000; padding-bottom:10px; margin-bottom:12px;">
        <div>
          <h1 style="font-size:18px; margin:0; text-transform:uppercase; color:#0284c7;">${ws.name}</h1>
          <p style="font-size:11px; margin:2px 0 0 0;"><strong>${ws.city}</strong> • Tél/WhatsApp : <strong>${ws.phone}</strong></p>
          <p style="font-size:11px; margin:2px 0 0 0;">Responsable : ${ws.manager} • ${ws.nif}</p>
        </div>
        <div style="text-align:right;">
          <span style="border:1px solid #000; padding:3px 8px; font-weight:bold; font-size:12px; background:#eee;">FICHE & DEVIS D'ATELIER</span>
          <p style="font-size:11px; margin:4px 0 0 0;">N° : <strong>${job.id}</strong></p>
          <p style="font-size:11px; margin:1px 0 0 0;">Date : ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      <!-- Données Client & Machine -->
      <div style="display:flex; justify-content:space-between; margin-bottom:10px; font-size:11px; background:#f9f9f9; padding:6px 10px; border:1px solid #ddd;">
        <div>Client : <strong>${job.client}</strong></div>
        <div>Moteur : <strong>${job.brand} ${job.model}</strong> (S/N: ${job.serial})</div>
      </div>

      <table style="width:100%; border-collapse:collapse; font-size:10.5px; margin-bottom:10px;" border="1" cellpadding="4">
        <tr style="background:#f0f0f0;">
          <th colspan="4" style="text-align:left;">1. CARACTÉRISTIQUES PLAQUE & GÉOMÉTRIE STATOR</th>
        </tr>
        <tr>
          <td>Puissance : <strong>${job.power} kW</strong></td>
          <td>Tension : <strong>${job.voltage} V</strong></td>
          <td>Courant : <strong>${job.current} A</strong></td>
          <td>Vitesse : <strong>${job.speed} tr/min</strong></td>
        </tr>
        <tr>
          <td>Alésage (D) : <strong>${job.statorD} mm</strong></td>
          <td>Longueur fer (L) : <strong>${job.statorL} mm</strong></td>
          <td>Encoches (Z) : <strong>${job.slotsZ}</strong></td>
          <td>Pôles (2p) : <strong>${job.poles2p} pôles</strong></td>
        </tr>
      </table>

      <table style="width:100%; border-collapse:collapse; font-size:10.5px; margin-bottom:10px;" border="1" cellpadding="4">
        <tr style="background:#f0f0f0;">
          <th colspan="4" style="text-align:left;">2. RELEVÉ DU BOBINAGE & FOURNITURES</th>
        </tr>
        <tr>
          <td>Spires / encoche : <strong>${job.turnsPerSlot}</strong></td>
          <td>Diamètre fil : <strong>Ø ${job.wireDiam} mm</strong></td>
          <td>Brins en // : <strong>${job.parallelWires}</strong></td>
          <td>Pas relevé : <strong>${job.pitch}</strong></td>
        </tr>
        <tr>
          <td>Cuivre estimé : <strong>${copper}</strong></td>
          <td>Isolants encoches : <strong>${insulation}</strong></td>
          <td>Foisonnement : <strong>${filling}</strong></td>
          <td>Couplage : <strong>${job.coupling}</strong></td>
        </tr>
      </table>

      <!-- Devis en Ariary -->
      <table style="width:100%; border-collapse:collapse; font-size:10.5px; margin-bottom:12px;" border="1" cellpadding="4">
        <tr style="background:#f0f0f0;">
          <th colspan="2" style="text-align:left;">3. DÉCOMPTE DES FRAIS DE RÉPARATION (ARIARY - Ar)</th>
        </tr>
        <tr>
          <td style="width:65%;">Fil de cuivre émaillé (${copper}) + Isolants & Consommables + Roulements :</td>
          <td style="text-align:right;"><strong>${formatAriary((parseFloat(copper) || 5.12) * job.costCopperPerKg + job.costConsumables + job.costBearings)}</strong></td>
        </tr>
        <tr>
          <td>Main d'œuvre (Démontage, Bobinage, Frettage, Imprégnation vernis & Essais) :</td>
          <td style="text-align:right;"><strong>${formatAriary(job.costLabor)}</strong></td>
        </tr>
        <tr style="background:#e8f4fd;">
          <td><strong style="font-size:11.5px;">MONTANT TOTAL TTC DE LA RÉPARATION :</strong></td>
          <td style="text-align:right;"><strong style="font-size:12px; color:#0284c7;">${grandTotal}</strong></td>
        </tr>
        <tr>
          <td>Acompte déjà versé :</td>
          <td style="text-align:right;">${advance}</td>
        </tr>
        <tr style="background:#e6f9f0;">
          <td><strong style="font-size:11.5px; color:#10B981;">SOLDE RESTANT DÛ À LA LIVRAISON :</strong></td>
          <td style="text-align:right;"><strong style="font-size:12.5px; color:#10B981;">${balanceDue}</strong></td>
        </tr>
      </table>

      <div style="margin-top:10px;">
        <h3 style="font-size:11px; margin:0 0 4px 0;">4. SCHÉMA DÉVELOPPÉ DES ENCOCHES</h3>
        <div style="border:1px solid #ccc; padding:6px; background:#fff;">
          ${document.getElementById('winding-svg').outerHTML}
        </div>
      </div>

      <div style="margin-top:15px; border-top:1px dashed #000; padding-top:8px; display:flex; justify-content:space-between; font-size:10px;">
        <div>Visa Bobinier / Atelier : ______________________</div>
        <div>Contrôle Isolement (MΩ) : __________</div>
        <div>Signature Client (Bon pour accord) : ______________________</div>
      </div>
    </div>
  `;
}
