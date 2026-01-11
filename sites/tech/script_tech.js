document.addEventListener('DOMContentLoaded', async () => {
  const contentDiv = document.getElementById('content');
  if (!contentDiv) {
    console.error('[Init] #content introuvable — script_tech.js interrompu.');
    return;
  }


  if (window.lucide) {
    try { lucide.createIcons(); } catch { }
  }

  // --- UI state helpers (Zero innerHTML) ---
  function showSpinner() {
    const spinnerContainer = document.createElement('div');
    spinnerContainer.className = 'flex items-center justify-center h-64';
    const spinner = document.createElement('div');
    spinner.className = 'w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin';
    spinnerContainer.appendChild(spinner);
    contentDiv.replaceChildren(spinnerContainer);
  }

  function showSecurityError(file) {
    const container = document.createElement('div');
    container.className = 'p-8 text-rose-400 bg-rose-900/10 rounded-xl border border-rose-500/20';

    const h3 = document.createElement('h3');
    h3.className = 'font-bold mb-2';
    h3.textContent = 'Blocage sécurité';

    const p1 = document.createElement('p');
    p1.textContent = 'Chemin refusé (non conforme) : ';
    const code1 = document.createElement('code');
    code1.className = 'font-mono';
    code1.textContent = file;
    p1.appendChild(code1);

    const p2 = document.createElement('p');
    p2.className = 'text-xs mt-4 text-slate-500';
    p2.textContent = 'Le chemin doit respecter: ';
    const code2 = document.createElement('code');
    code2.textContent = String(SAFE_CHAPTER_PATH_RE);
    p2.appendChild(code2);

    container.append(h3, p1, p2);
    contentDiv.replaceChildren(container);
  }

  function showLoadError(error) {
    const container = document.createElement('div');
    container.className = 'p-8 text-rose-400 bg-rose-900/10 rounded-xl border border-rose-500/20';

    const h3 = document.createElement('h3');
    h3.className = 'font-bold mb-2';
    h3.textContent = 'Erreur de chargement';

    const p1 = document.createElement('p');
    p1.textContent = error.message;

    const p2 = document.createElement('p');
    p2.className = 'text-xs mt-4 text-slate-500';
    p2.textContent = 'Vérifiez que le fichier existe bien dans le dossier chapters/.';

    container.append(h3, p1, p2);
    contentDiv.replaceChildren(container);
  }

  function showNotFoundError(pageId, normalizedId, lang) {
    console.warn(`[Routing] Page not found: ${pageId} (normalized: ${normalizedId}) in lang: ${lang}`);

    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center min-h-[50vh] text-center p-8 animate-in fade-in zoom-in duration-300';

    const iconContainer = document.createElement('div');
    iconContainer.className = 'p-4 rounded-full bg-red-500/10 mb-6';
    const icon = document.createElement('i');
    icon.setAttribute('data-lucide', 'file-warning');
    icon.className = 'w-12 h-12 text-red-500';
    iconContainer.appendChild(icon);

    const h1 = document.createElement('h1');
    h1.className = 'text-3xl font-bold text-white mb-2';
    h1.textContent = 'Page introuvable';

    const p = document.createElement('p');
    p.className = 'text-slate-400 max-w-md mb-6';
    p.textContent = "L'identifiant ";
    const spanId = document.createElement('span');
    spanId.className = 'font-mono text-white bg-white/10 px-2 py-0.5 rounded';
    spanId.textContent = pageId;
    p.appendChild(spanId);
    p.append(` (normalisé : `);
    const codeNorm = document.createElement('code');
    codeNorm.className = 'text-yellow-400';
    codeNorm.textContent = normalizedId;
    p.appendChild(codeNorm);
    p.append(`) n'existe pas dans la langue active (`);
    const spanLang = document.createElement('span');
    spanLang.className = 'uppercase font-bold text-white';
    spanLang.textContent = lang;
    p.appendChild(spanLang);
    p.append(').');

    const suggestionsBox = document.createElement('div');
    suggestionsBox.id = 'missing-suggestions-box';
    suggestionsBox.className = 'hidden bg-slate-900/50 border border-white/10 rounded-xl p-6 max-w-lg w-full mb-6';

    const pSuggestions = document.createElement('p');
    pSuggestions.className = 'text-[10px] uppercase font-bold text-slate-500 mb-3 tracking-widest';
    pSuggestions.textContent = 'Suggestions similaires';

    const ul = document.createElement('ul');
    ul.id = 'missing-suggestions';
    ul.className = 'space-y-2 text-left';
    suggestionsBox.append(pSuggestions, ul);

    const homeButton = document.createElement('button');
    homeButton.id = 'btn-return-home';
    homeButton.className = 'mt-2 flex items-center gap-3 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-all group border border-white/10 hover:border-indigo-500/50';
    const homeIcon = document.createElement('i');
    homeIcon.setAttribute('data-lucide', 'home');
    homeIcon.className = 'w-5 h-5 text-slate-400 group-hover:text-indigo-400 transition-colors';
    homeButton.append(homeIcon, "Retour à l'accueil");

    container.append(iconContainer, h1, p, suggestionsBox, homeButton);

    contentDiv.replaceChildren(container);

    // Suggestions
    const sugKeys = Object.keys(pagesByLang[lang] || {})
      .filter(k => k.includes(normalizedId) || normalizedId.includes(k))
      .slice(0, 5);

    if (sugKeys.length) {
      suggestionsBox.classList.remove('hidden');
      for (const k of sugKeys) {
        const li = document.createElement('li');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'font-mono text-xs text-indigo-400 hover:underline bg-transparent border-0 p-0 text-left';
        btn.dataset.page = k;
        btn.textContent = k;
        li.appendChild(btn);
        ul.appendChild(li);
      }
    }

    if (window.lucide) lucide.createIcons();
  }

  function showQaError(error) {
    const container = document.createElement('div');
    container.className = 'p-8 text-rose-400 bg-rose-900/10 rounded-xl border border-rose-500/20';

    const h3 = document.createElement('h3');
    h3.className = 'font-bold mb-2';
    h3.textContent = 'QA STRICT CHECK FAILED';

    const pre = document.createElement('pre');
    pre.className = 'whitespace-pre-wrap';
    pre.textContent = error.message;

    container.append(h3, pre);
    contentDiv.replaceChildren(container);
  }

  const QA_PARAMS = new URLSearchParams(location.search);
  const QA_ENABLED = QA_PARAMS.has('qa');
  const QA_STRICT = QA_PARAMS.has('qa_strict');

  // Strict allowlist: only local chapters, normalized naming, optional _en suffix.
  const SAFE_CHAPTER_PATH_RE = /^chapters\/[a-z0-9_]+(?:_en)?\.html$/i;

  function isSafeChapterPath(p) {
    return typeof p === 'string' && SAFE_CHAPTER_PATH_RE.test(p);
  }

  // Mapping full par langue (strictement aligné sur le sidebar)
  const pagesByLang = {
    fr: {
      tech_00_home: "chapters/tech_00_home.html",
      tech_intro: "chapters/tech_00_intro.html",
      tech_methodology: "chapters/tech_01_methodology.html",
      tech_pedagogy_guide: "chapters/tech_04_pedagogy_guide.html",
      tech_soft_skills: "chapters/tech_05_soft_skills.html",
      tech_syllabus: "chapters/tech_02_syllabus.html",
      tech_stack: "chapters/tech_03_stack.html",
      tech_competencies: "chapters/tech_09_competencies.html",
      tech_solana_hub: "chapters/tech_06_solana_hub.html",
      tech_06_foundations: "chapters/tech_06_foundations.html",
      tech_06a_solana_n1: "chapters/tech_06a_solana_n1.html",
      tech_06b_solana_n2: "chapters/tech_06b_solana_n2.html",
      tech_06c_solana_n3: "chapters/tech_06c_solana_n3.html",
      tech_06g_validator_infra_overview: "chapters/tech_06g_validator_infra_overview.html",
      tech_06h_anchor_n1: "chapters/tech_06h_anchor_n1.html",
      tech_06i_anchor_n2: "chapters/tech_06i_anchor_n2.html",
      tech_06j_anchor_n3: "chapters/tech_06j_anchor_n3.html",
      tech_06d_security_labs: "chapters/tech_06d_security_labs.html",
      tech_06d1_security_labs_n1: "chapters/tech_06d1_security_labs_n1.html",
      tech_06d2_security_labs_n2: "chapters/tech_06d2_security_labs_n2.html",
      tech_06e_tokens_and_cpi: "chapters/tech_06e_tokens_and_cpi.html",
      tech_06e1_tokens_and_cpi_n1: "chapters/tech_06e1_tokens_and_cpi_n1.html",
      tech_06e2_tokens_and_cpi_n2: "chapters/tech_06e2_tokens_and_cpi_n2.html",
      tech_06f_build_an_amm: "chapters/tech_06f_build_an_amm.html",
      tech_06f1_build_an_amm_n1: "chapters/tech_06f1_build_an_amm_n1.html",
      tech_06f2_build_an_amm_n2: "chapters/tech_06f2_build_an_amm_n2.html",
      tech_evm_hub: "chapters/tech_07_evm_hub.html",
      tech_capstones: "chapters/tech_08_capstones.html",
      tech_mentor_guide: "chapters/tech_10_mentor_guide.html",
    },
    en: {
      tech_00_home: "chapters/tech_00_home_en.html",
      tech_intro: "chapters/tech_00_intro_en.html",
      tech_methodology: "chapters/tech_01_methodology_en.html",
      tech_pedagogy_guide: "chapters/tech_04_pedagogy_guide_en.html",
      tech_soft_skills: "chapters/tech_05_soft_skills_en.html",
      tech_syllabus: "chapters/tech_02_syllabus_en.html",
      tech_stack: "chapters/tech_03_stack_en.html",
      tech_competencies: "chapters/tech_09_competencies_en.html",
      tech_solana_hub: "chapters/tech_06_solana_hub_en.html",
      tech_06_foundations: "chapters/tech_06_foundations_en.html",
      tech_06a_solana_n1: "chapters/tech_06a_solana_n1_en.html",
      tech_06b_solana_n2: "chapters/tech_06b_solana_n2_en.html",
      tech_06c_solana_n3: "chapters/tech_06c_solana_n3_en.html",
      tech_06g_validator_infra_overview: "chapters/tech_06g_validator_infra_overview_en.html",
      tech_06h_anchor_n1: "chapters/tech_06h_anchor_n1_en.html",
      tech_06i_anchor_n2: "chapters/tech_06i_anchor_n2_en.html",
      tech_06j_anchor_n3: "chapters/tech_06j_anchor_n3_en.html",
      tech_06d_security_labs: "chapters/tech_06d_security_labs_en.html",
      tech_06d1_security_labs_n1: "chapters/tech_06d1_security_labs_n1_en.html",
      tech_06d2_security_labs_n2: "chapters/tech_06d2_security_labs_n2_en.html",
      tech_06e_tokens_and_cpi: "chapters/tech_06e_tokens_and_cpi_en.html",
      tech_06e1_tokens_and_cpi_n1: "chapters/tech_06e1_tokens_and_cpi_n1_en.html",
      tech_06e2_tokens_and_cpi_n2: "chapters/tech_06e2_tokens_and_cpi_n2_en.html",
      tech_06f_build_an_amm: "chapters/tech_06f_build_an_amm_en.html",
      tech_06f1_build_an_amm_n1: "chapters/tech_06f1_build_an_amm_n1_en.html",
      tech_06f2_build_an_amm_n2: "chapters/tech_06f2_build_an_amm_n2_en.html",
      tech_evm_hub: "chapters/tech_07_evm_hub_en.html",
      tech_capstones: "chapters/tech_08_capstones_en.html",
      tech_mentor_guide: "chapters/tech_10_mentor_guide_en.html",
    }
  };


  // ---------- Routing safety net (legacy IDs -> canonical IDs) ----------
  // Canonical IDs are the keys of pagesByLang.<lang>.
  // This table exists to avoid 404 when older fragments / bookmarks still point to legacy IDs.


  const LOADPAGE_ALIAS = {
    // Legacy "whitepaper" entrypoints
    '00_executive_summary': 'tech_00_home',
    '00_executive_summary_en': 'tech_00_home',

    // Solana track legacy names
    'tech_solana_n1': 'tech_06a_solana_n1',
    'tech_solana_n2': 'tech_06b_solana_n2',
    'tech_solana_n3': 'tech_06c_solana_n3',

    // Legacy chapter IDs (older fragments)
    'tech_06_solana_hub': 'tech_solana_hub',
    'tech_06d_security': 'tech_06d_security_labs',
    'tech_06e_tokens': 'tech_06e_tokens_and_cpi',
    'tech_06f_amm': 'tech_06f_build_an_amm',
    'tech_06g_validator': 'tech_06g_validator_infra_overview',

    // Short-hand aliases
    'tech_06e_tokens': 'tech_06e_tokens_and_cpi',
    'tech_06e1_tokens': 'tech_06e1_tokens_and_cpi_n1',
    'tech_06e2_tokens': 'tech_06e2_tokens_and_cpi_n2',
    'tech_06f1_amm': 'tech_06f1_build_an_amm_n1',
    'tech_06f2_amm': 'tech_06f2_build_an_amm_n2',

    // Safety-net for accidental "_en" suffixes in IDs
    'tech_intro_en': 'tech_intro',
    'tech_06_foundations_en': 'tech_06_foundations',
    'tech_06a_solana_n1_en': 'tech_06a_solana_n1',
    'tech_06b_solana_n2_en': 'tech_06b_solana_n2',
    'tech_06c_solana_n3_en': 'tech_06c_solana_n3',
    'tech_06d_security_labs_en': 'tech_06d_security_labs',
    'tech_06e_tokens_and_cpi_en': 'tech_06e_tokens_and_cpi',
    'tech_06f_build_an_amm_en': 'tech_06f_build_an_amm',
    'tech_06g_validator_infra_overview_en': 'tech_06g_validator_infra_overview',
    'tech_solana_hub_en': 'tech_solana_hub',
    'tech_evm_hub_en': 'tech_evm_hub',
    'tech_capstones_en': 'tech_capstones',
    'tech_competencies_en': 'tech_competencies',
    'tech_06e1_tokens_and_cpi_n1_en': 'tech_06e1_tokens_and_cpi_n1',
    'tech_06e2_tokens_and_cpi_n2_en': 'tech_06e2_tokens_and_cpi_n2',
    'tech_06f1_build_an_amm_n1_en': 'tech_06f1_build_an_amm_n1',
    'tech_06f2_build_an_amm_n2_en': 'tech_06f2_build_an_amm_n2',
    'tech_mentor_guide_en': 'tech_mentor_guide',
  };

  function normalizePageId(inputId) {
    let id = (inputId || '').trim();

    // If someone passes an "_en" ID (legacy), strip it first.
    if (id.endsWith('_en')) id = id.slice(0, -3);

    // Apply alias chain safely (max depth to avoid loops).
    for (let i = 0; i < 5; i++) {
      const next = LOADPAGE_ALIAS[id];
      if (!next || next === id) break;
      id = next;
    }
    return id;
  }

  // Allow pagesByLang to resolve legacy IDs (no 404 even if a fragment calls loadPage('legacy')).
  // NOTE: Logic moved to normalizePageId only. We do not pollute pagesByLang keys anymore.

  // ---------- Fragment wrapper (strict, never double-wrap exact wrapper) ----------
  const ROOT_WRAPPER_CLASS = 'space-y-14 animate-in fade-in duration-700';

  // Sanitizer (Zero InnerHTML Policy)
  function sanitizeChapterHtmlToFragment(html) {
    const doc = new DOMParser().parseFromString(String(html || ''), 'text/html');

    // Remove dangerous nodes
    doc.querySelectorAll('script, iframe, object, embed, link[rel="import"]').forEach(n => n.remove());

    // Remove dangerous attributes
    doc.querySelectorAll('*').forEach(el => {
      for (const attr of Array.from(el.attributes)) {
        const name = attr.name.toLowerCase();
        const value = String(attr.value || '');

        if (name.startsWith('on')) el.removeAttribute(attr.name);

        if (name === 'href' || name === 'src' || name === 'xlink:href' || name === 'data') {
          const v = value.trim().toLowerCase();
          if (v.startsWith('javascript:') || v.startsWith('data:') || v.startsWith('vbscript:')) {
            el.removeAttribute(attr.name);
          }
        }

        if (name === 'srcdoc') el.removeAttribute(attr.name);
      }
    });

    // Wrap root if needed (DOM-based logic)
    // We replicate ensureRootWrapperStrict logic on the DOM tree
    const frag = document.createDocumentFragment();

    // Check if already wrapped
    const firstChild = doc.body.firstElementChild;
    const hasSpaceYPrefix = firstChild
      ? Array.from(firstChild.classList || []).some(cls => cls.startsWith('space-y-'))
      : false;
    const isWrapped = firstChild &&
      firstChild === doc.body.lastElementChild &&
      hasSpaceYPrefix &&
      firstChild.classList.contains('animate-in');

    if (isWrapped) {
      while (doc.body.firstChild) frag.appendChild(doc.body.firstChild);
    } else if (firstChild && hasSpaceYPrefix) {
      // If wrapper already has a space-y-* class, keep it as-is
      while (doc.body.firstChild) frag.appendChild(doc.body.firstChild);
    } else {
      // Force wrap (or create an empty wrapper if body is empty)
      const wrapper = document.createElement('div');
      wrapper.className = ROOT_WRAPPER_CLASS;
      while (doc.body.firstChild) wrapper.appendChild(doc.body.firstChild);
      frag.appendChild(wrapper);
    }

    return frag;
  }

  const sidebarConfig = [
    {
      type: 'section',
      labelFr: 'Start Here',
      labelEn: 'Start Here',
      items: [
        { id: 'tech_00_home', icon: 'flag', labelFr: 'ACCUEIL / MANIFESTO', labelEn: 'HOME / MANIFESTO' },
        { id: 'tech_intro', icon: 'compass', labelFr: 'Vision & Objectifs', labelEn: 'Vision & Objectives' },

        { id: 'tech_methodology', labelFr: 'Méthodologie active', labelEn: 'Active methodology' },
        { id: 'tech_pedagogy_guide', labelFr: 'Guide pédagogique', labelEn: 'Pedagogy guide' },
        { id: 'tech_soft_skills', labelFr: 'Soft skills & mindset', labelEn: 'Soft skills & mindset' },
      ]
    },

    {
      type: 'section',
      labelFr: 'Program Backbone',
      labelEn: 'Program Backbone',
      items: [
        { id: 'tech_syllabus', labelFr: 'Feuille de route globale', labelEn: 'Global timeline' },
        { id: 'tech_stack', labelFr: 'Stack technique', labelEn: 'Technical stack' },
        { id: 'tech_competencies', labelFr: 'Matrice de compétences', labelEn: 'Competency matrix' },
      ]
    },

    {
      type: 'section',
      labelFr: 'Tracks',
      labelEn: 'Tracks',
      items: [
        {
          id: 'tech_solana_hub',
          labelFr: 'Track A : Solana (Rust)',
          labelEn: 'Track A: Solana (Rust)',
          children: [
            { id: 'tech_06_foundations', labelFr: '↳ Foundations — Théorie Solana', labelEn: '↳ Foundations — Solana theory' },
            { id: 'tech_06a_solana_n1', labelFr: '↳ N1 — Rust utile + outils', labelEn: '↳ N1 — Rust + tools (Solana)' },
            { id: 'tech_06b_solana_n2', labelFr: '↳ N2 — Anchor : Counter → Patterns', labelEn: '↳ N2 — Anchor: Counter → Patterns' },
            { id: 'tech_06c_solana_n3', labelFr: '↳ N3 — Capstone Anchor → Native', labelEn: '↳ N3 — Capstone Anchor → Native' },
            { id: 'tech_06g_validator_infra_overview', labelFr: '↳ Validator/Infra (ouverture)', labelEn: '↳ Validator/Infra (overview)' },
            { id: 'tech_06h_anchor_n1', labelFr: '↳ Anchor N1 — Structure de programme', labelEn: '↳ Anchor N1 — Program structure' },
            { id: 'tech_06i_anchor_n2', labelFr: '↳ Anchor N2 — IDL & clients', labelEn: '↳ Anchor N2 — IDL & clients' },
            { id: 'tech_06j_anchor_n3', labelFr: '↳ Anchor N3 — Tests TypeScript', labelEn: '↳ Anchor N3 — TypeScript tests' },
            { id: 'tech_06d_security_labs', labelFr: '↳ Security Labs (Hub)', labelEn: '↳ Security Labs (Hub)' },
            { id: 'tech_06d1_security_labs_n1', labelFr: '↳ ↳ Security Labs — N1', labelEn: '↳ ↳ Security Labs — N1' },
            { id: 'tech_06d2_security_labs_n2', labelFr: '↳ ↳ Security Labs — N2', labelEn: '↳ ↳ Security Labs — N2' },
            { id: 'tech_06e_tokens_and_cpi', labelFr: '↳ Tokens / Token-2022 / CPI (Hub)', labelEn: '↳ Tokens / Token-2022 / CPI (Hub)' },
            { id: 'tech_06e1_tokens_and_cpi_n1', labelFr: '↳↳ N1 — Token fundamentals (ATA, authorities)', labelEn: '↳↳ N1 — Token fundamentals (ATA, authorities)' },
            { id: 'tech_06e2_tokens_and_cpi_n2', labelFr: '↳↳ N2 — Token-2022 + CPI safe', labelEn: '↳↳ N2 — Token-2022 + CPI safe' },
            { id: 'tech_06f_build_an_amm', labelFr: '↳ Build an AMM (Hub)', labelEn: '↳ Build an AMM (Hub)' },
            { id: 'tech_06f1_build_an_amm_n1', labelFr: '↳↳ N1 — Pool + LP invariants', labelEn: '↳↳ N1 — Pool + LP invariants' },
            { id: 'tech_06f2_build_an_amm_n2', labelFr: '↳↳ N2 — Swaps + fees + hardening', labelEn: '↳↳ N2 — Swaps + fees + hardening' },
          ]
        },

        { id: 'tech_evm_hub', labelFr: 'Track B : EVM (Solidity)', labelEn: 'Track B: EVM (Solidity)' },
      ]
    },

    {
      type: 'section',
      labelFr: 'Capstones',
      labelEn: 'Capstones',
      items: [
        { id: 'tech_capstones', labelFr: 'Projets capstone', labelEn: 'Capstone projects' },
      ]
    },

    {
      type: 'section',
      labelFr: 'Espace Mentors',
      labelEn: 'Mentor Space',
      items: [
        { id: 'tech_mentor_guide', labelFr: 'Guide mentors', labelEn: 'Mentor guide' },
      ]
    },
  ];

  function collectSidebarIds(config) {
    const ids = [];
    const walk = (nodes) => {
      for (const n of nodes || []) {
        if (n.id) ids.push(n.id);
        if (n.items) walk(n.items);
        if (n.children) walk(n.children);
      }
    };
    walk(config);
    return Array.from(new Set(ids));
  }

  async function assertSidebarCoverage() {
    const sidebarIds = collectSidebarIds(sidebarConfig);

    // QA: s'assurer que le sidebar n'utilise pas d'alias legacy
    const nonCanonical = sidebarIds.filter(id => normalizePageId(id) !== id);
    if (nonCanonical.length) {
      const msg = `[QA] Sidebar contains non-canonical IDs (should be canonical): ${nonCanonical.join(', ')}`;
      if (QA_STRICT) throw new Error(msg);
      console.warn(msg);
    }

    for (const lang of ['fr', 'en']) {
      const map = pagesByLang[lang] || {};

      // QA: Check pagesByLang keys for non-canonical drift
      const keys = Object.keys(map);
      const badKeys = keys.filter(k => normalizePageId(k) !== k);
      if (badKeys.length) {
        const msg = `[QA] pagesByLang.${lang} contains non-canonical keys: ${badKeys.join(', ')}`;
        if (QA_STRICT) throw new Error(msg);
        console.warn(msg);
      }

      // NEW: Validate all paths in the map for safety
      for (const [id, path] of Object.entries(map)) {
        if (!isSafeChapterPath(path)) {
          const msg = `[QA] pagesByLang.${lang}['${id}'] has unsafe path: ${path}`;
          if (QA_STRICT) throw new Error(msg);
          console.warn(msg);
        }
      }

      const missing = sidebarIds.filter(id => !map[id]);
      if (missing.length) {
        const msg = `[QA] Sidebar IDs missing in pagesByLang.${lang}: ${missing.join(', ')}`;
        // En mode strict : throw. Sinon : warn.
        if (QA_STRICT) throw new Error(msg);
        console.warn(msg);
      }

      // NEW: Check for file existence in qa_strict mode
      if (QA_STRICT) {
        const pathChecks = Object.entries(map).map(([id, path]) => {
          return fetch(path, { method: 'HEAD' })
            .then(res => {
              if (!res.ok) {
                throw new Error(`[QA] File not found for pagesByLang.${lang}['${id}']: ${path} (status ${res.status})`);
              }
            });
        });
        // This will throw the first error it encounters
        await Promise.all(pathChecks);
      }
    }
  }

  let currentLang = localStorage.getItem('rbk_lang') || 'fr';

  let currentPageId = null;

  function renderSidebar() {
    const nav = document.querySelector('aside nav');
    if (!nav) return;
    nav.replaceChildren(); // Clean slate (Zero innerHTML)

    sidebarConfig.forEach(section => {
      // 1. Section Header (if type section/divider)
      if (section.labelFr) {
        const titleDiv = document.createElement('div');
        titleDiv.className = 'px-4 py-2 mt-4 text-[9px] uppercase font-bold text-indigo-400 tracking-wider border-t border-white/5 pt-4 first:mt-2 first:pt-2 first:border-0';
        titleDiv.textContent = currentLang === 'fr' ? section.labelFr : section.labelEn;
        nav.appendChild(titleDiv);
      }

      // 2. Items
      if (section.items) {
        section.items.forEach(item => {
          // Parent Item
          const a = document.createElement('a');
          a.href = '#';
          a.dataset.page = item.id;
          a.className = 'flex items-center gap-3 px-6 py-1.5 text-xs hover:text-white transition-colors group';

          // Styling specifique pour HOME/INTRO qui ont des icones et texte plus grand/gras dans le design original
          if (item.icon) {
            a.className = 'flex items-center gap-3 px-6 py-2 text-xs font-bold text-white hover:bg-white/5 hover:text-white transition-colors border-b border-white/5 mb-1';
            if (item.id === 'tech_intro') a.classList.add('text-indigo-400'); // restore original color hint
            const i = document.createElement('i');
            i.setAttribute('data-lucide', item.icon);
            i.className = 'w-4 h-4 text-slate-400 group-hover:text-white transition-colors';
            if (item.id === 'tech_intro') i.classList.add('text-indigo-400');
            a.appendChild(i);
          } else {
            a.classList.add('text-slate-400');
          }

          const span = document.createElement('span');
          span.textContent = currentLang === 'fr' ? item.labelFr : item.labelEn;
          a.appendChild(span);

          nav.appendChild(a);

          // Children (Sub-items)
          if (item.children) {
            const childContainer = document.createElement('div');
            childContainer.className = 'pl-4 space-y-0.5 mt-1 mb-2';
            item.children.forEach(child => {
              const subA = document.createElement('a');
              subA.href = '#';
              subA.dataset.page = child.id;
              subA.className = 'flex items-center gap-3 px-6 py-1 text-[10px] text-slate-500 hover:text-white transition-colors';
              subA.textContent = currentLang === 'fr' ? child.labelFr : child.labelEn;
              childContainer.appendChild(subA);
            });
            nav.appendChild(childContainer);
          }
        });
      }
    });

    // Spacer at bottom
    const spacer = document.createElement('div');
    spacer.className = 'h-12';
    nav.appendChild(spacer);

    // Re-bind clicks
    nav.querySelectorAll('a[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        loadPage(link.dataset.page);
        // Mobile close
        if (window.innerWidth < 768) {
          document.getElementById('sidebar')?.classList.add('-translate-x-full');
        }
      });
    });

    if (window.lucide) lucide.createIcons();
    if (currentPageId) setActiveLink(currentPageId);
  }

  function applyNavLanguage() {
    document.querySelectorAll('[data-lang]').forEach((el) => {
      // Toggle visibility based on current language
      el.classList.toggle('hidden', el.dataset.lang !== currentLang);
    });
    // Re-render valid sidebar for current language
    renderSidebar();
  }

  function setLanguage(lang, reload = true) {
    if (!pagesByLang[lang]) return;
    currentLang = lang;
    localStorage.setItem('rbk_lang', lang);
    try { document.documentElement.setAttribute('lang', lang === 'fr' ? 'fr' : 'en'); } catch { }
    applyNavLanguage();
    if (reload && currentPageId) {
      loadPage(currentPageId);
    }
  }
  // Expose globally for inline buttons
  window.setLanguage = setLanguage;

  async function ensureMermaid() {
    if (window.mermaid) {
      try { window.mermaid.initialize({ startOnLoad: false, theme: 'dark', fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }); } catch { }
      return window.mermaid;
    }
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    try { window.mermaid.initialize({ startOnLoad: false, theme: 'dark', fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }); } catch { }
    return window.mermaid;
  }

  async function ensureChartJS() {
    if (window.Chart) return window.Chart;
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    // Dark defaults
    try {
      Chart.defaults.color = '#cbd5e1';
      Chart.defaults.borderColor = 'rgba(148, 163, 184, 0.15)';
      Chart.defaults.font.family = 'Inter, ui-sans-serif, system-ui, sans-serif';
    } catch { }
    return window.Chart;
  }

  function cleanupCharts() {
    (window._techCharts || []).forEach((ch) => { try { ch.destroy(); } catch { } });
    window._techCharts = [];
  }

  function renderContextCharts(root) {
    const c1 = root.querySelector('#chartSolanaTraction');
    const c2 = root.querySelector('#chartJobIndex');
    if (c1) {
      const ctx = c1.getContext('2d');
      const labels = ['2021', '2022', '2023', '2024', '2025'];
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Développeurs Solana (k)', data: [8, 12, 18, 26, 35], yAxisID: 'y', borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.2)', tension: 0.3 },
            { label: 'TVL (Md$)', data: [1.2, 4.5, 7.0, 11.0, 15.0], yAxisID: 'y1', borderColor: '#14F195', backgroundColor: 'rgba(20,241,149,0.2)', tension: 0.3 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { position: 'left', title: { display: true, text: 'Talents (k)' }, grid: { drawOnChartArea: false } },
            y1: { position: 'right', title: { display: true, text: 'TVL (Md$)' }, grid: { drawOnChartArea: false } }
          },
          plugins: { legend: { labels: { boxWidth: 10 } } }
        }
      });
      (window._techCharts ||= []).push(chart);
    }
    if (c2) {
      const ctx = c2.getContext('2d');
      const labels = ['2021', '2022', '2023', '2024', '2025'];
      const chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Index Emplois Web3', data: [100, 145, 170, 195, 220], borderColor: '#a78bfa', backgroundColor: 'rgba(167,139,250,0.2)', tension: 0.3 },
            { label: 'Index Emplois Web2', data: [100, 108, 104, 100, 96], borderColor: '#94a3b8', backgroundColor: 'rgba(148,163,184,0.2)', tension: 0.3 }
          ]
        },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { boxWidth: 10 } } } }
      });
      (window._techCharts ||= []).push(chart);
    }
  }

  function styleTables(root) {
    root.querySelectorAll('table').forEach((table) => {
      if (!table.parentElement.classList.contains('overflow-x-auto')) {
        const wrapper = document.createElement('div');
        wrapper.className = 'overflow-x-auto rounded-lg border border-white/10';
        table.parentElement.insertBefore(wrapper, table);
        wrapper.appendChild(table);
      }
      table.querySelectorAll('thead').forEach((thead) => {
        thead.classList.add('bg-slate-900', 'text-slate-500', 'text-xs', 'uppercase', 'font-bold', 'tracking-wider');
      });
      table.querySelectorAll('tbody tr').forEach((tr) => {
        tr.classList.add('border-b', 'border-white/5', 'hover:bg-white/5', 'transition-colors');
      });
      table.querySelectorAll('th, td').forEach((cell) => {
        cell.classList.add('p-3', 'text-sm', 'border-b', 'border-white/5');
        if (cell.tagName === 'TD') cell.classList.add('text-slate-400');
      });

      // Mobile polish: smooth horizontal scrolling on iOS
      const wrapper = table.parentElement;
      if (wrapper && wrapper.classList.contains('overflow-x-auto')) {
        wrapper.style.webkitOverflowScrolling = 'touch';
      }
    });
  }

  function alignNumericCells(root) {
    const numRe = /^\s*[-+]?\d{1,3}(?:[\s.,]\d{3})*(?:[.,]\d+)?(?:\s*(?:%|\$|€|TND|k|M|Md\$))?\s*$/;
    root.querySelectorAll('td').forEach((td) => {
      const t = (td.textContent || '').trim();
      if (numRe.test(t)) {
        td.classList.add('text-right', 'font-mono');
      }
    });
  }

  function enhanceStatusBadges(root) {
    const map = [
      { re: /^(ok|valid[ée])$/i, cls: 'bg-green-500/20 text-green-400', text: null },
      { re: /^(critique|alerte)$/i, cls: 'bg-red-500/20 text-red-400', text: null }
    ];
    root.querySelectorAll('td, span, div').forEach((el) => {
      const t = (el.textContent || '').trim();
      for (const m of map) {
        if (m.re.test(t)) {
          const badge = document.createElement('span');
          badge.className = `px-2 py-0.5 rounded-full text-[10px] font-bold ${m.cls}`;
          badge.textContent = m.text || t.toUpperCase();
          el.replaceChildren(badge);
          break;
        }
      }
    });
  }

  function applyDesignSystem(root) {
    // Headings
    root.querySelectorAll('h1').forEach(h => h.classList.add('text-white', 'tracking-tight', 'font-bold', 'font-sans'));
    root.querySelectorAll('h2').forEach(h => h.classList.add('text-white', 'tracking-tight', 'font-bold', 'font-sans'));
    root.querySelectorAll('h3').forEach(h => h.classList.add('text-white', 'tracking-tight', 'font-bold', 'font-sans'));

    // Body text
    root.classList.add('text-slate-400');

    // Code / pre
    root.querySelectorAll('code, pre, kbd').forEach(el => el.classList.add('font-mono'));

    // Callouts (Note:, Important:, Définition:)
    root.querySelectorAll('p, li').forEach((el) => {
      const t = (el.textContent || '').trim();

      const applyCallout = (cls) => {
        if (el.tagName === 'LI') {
          el.classList.add('p-3', 'rounded-xl', 'border', 'my-2');
          cls.split(' ').forEach(c => el.classList.add(c));
        } else {
          // P tag: safe to wrap
          const box = document.createElement('div');
          box.className = `p-3 rounded-xl border ${cls} my-2`;
          el.parentNode.insertBefore(box, el);
          box.appendChild(el);
        }
      };

      if (/^\s*Note\s*:/i.test(t)) applyCallout('border-l-4 border-amber-500 bg-amber-500/10');
      if (/^\s*Important\s*:/i.test(t)) applyCallout('border-l-4 border-rose-500 bg-rose-500/10');
      if (/^\s*Définition\s*:/i.test(t)) applyCallout('border-l-4 border-blue-500 bg-blue-500/10');
    });

    // Lists → add icons if no icon present
    root.querySelectorAll('ul').forEach((ul) => {
      const nearestTitle = ul.closest('section, div')?.querySelector('h2, h3')?.textContent || '';
      const isRisks = /risque/i.test(nearestTitle);
      ul.querySelectorAll(':scope > li').forEach((li) => {
        if (li.querySelector('i[data-lucide]')) return;
        li.classList.add('flex', 'gap-2', 'items-start');
        const i = document.createElement('i');
        i.setAttribute('data-lucide', isRisks ? 'alert-triangle' : 'check-circle');
        i.className = isRisks ? 'w-4 h-4 text-amber-400 mt-0.5' : 'w-4 h-4 text-emerald-400 mt-0.5';
        li.prepend(i);
      });
    });
  }

  function setActiveLink(pageId) {
    // Re-select all links (dynamic)
    const links = document.querySelectorAll('aside nav a');
    links.forEach((l) => {
      // Clean previous state
      l.classList.remove('bg-white/10', 'text-white', 'border-l-4', 'border-indigo-500', 'focus:outline-none', 'focus:ring-2', 'focus:ring-indigo-500/60');
      l.classList.add('text-slate-400', 'border-l-4', 'border-transparent');
      l.removeAttribute('aria-current');

      l.querySelector('i[data-lucide]')?.classList.remove('text-indigo-400', 'text-white');
      l.querySelector('i[data-lucide]')?.classList.add('text-slate-400');

      if (l.dataset.page === pageId) {
        // Active state strict styling
        l.classList.add('bg-white/10', 'text-white', 'border-indigo-500');
        l.classList.remove('text-slate-400', 'border-transparent');
        l.setAttribute('aria-current', 'page');

        // Focus accessibility
        l.classList.add('focus:outline-none', 'focus:ring-2', 'focus:ring-indigo-500/60');

        // Icon highlight
        const icon = l.querySelector('i[data-lucide]');
        if (icon) {
          icon.classList.remove('text-slate-400');
          icon.classList.add('text-indigo-400');
        }
      }
    });

    const active = document.querySelector(`aside nav a[data-page="${pageId}"]`);
    if (active) {
      try { active.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch { }
      updateBreadcrumbs(active, pageId);
    }
  }

  function updateBreadcrumbs(activeLink, pageId) {
    const breadcrumbContainer = document.getElementById('breadcrumbs');
    if (!breadcrumbContainer) return; // Need to create it in DOM if not exists or assume it exists in layout

    // Build path from DOM structure
    // Sidebar structure: Section Label -> Group Label (optional) -> Link
    let path = [];

    // 1. Current Page
    path.unshift({ label: activeLink.textContent.trim(), id: pageId });

    // 2. Check parents
    // Hierarchy in sidebar is flat DOM visual but logical via indentation or containers?
    // In our renderSidebar, we flatten groups but keeping structure would be hard to deduce from DOM unless we used nested ULs.
    // However, our renderSidebar used flat buttons.
    // WE NEED TO USE THE CONFIG to deduce structure!

    const configPath = findPathInConfig(sidebarConfig, pageId);
    if (configPath) {
      // Clear previous breadcrumbs
      breadcrumbContainer.replaceChildren(); // Safer clear
      breadcrumbContainer.classList.remove('opacity-0');
      breadcrumbContainer.classList.add('opacity-100');

      // configPath = [{ labelFr: '...', ... }, ... ]
      const labels = configPath.map(item => currentLang === 'fr' ? item.labelFr : item.labelEn);

      labels.forEach((label, idx) => {
        const isLast = idx === labels.length - 1;
        const span = document.createElement('span');

        if (isLast) {
          span.className = 'text-white font-bold';
        } else {
          span.className = 'text-slate-500 hover:text-slate-300 transition-colors cursor-default';
        }
        span.textContent = label;

        breadcrumbContainer.appendChild(span);

        // Add separator if not last
        if (!isLast) {
          const sep = document.createElement('span');
          sep.className = 'mx-2 text-slate-600';
          sep.textContent = '/';
          breadcrumbContainer.appendChild(sep);
        }
      });
    }
  }

  function findPathInConfig(nodes, targetId) {
    for (const node of nodes) {
      // If node is the item
      if (node.id === targetId) return [node];

      // If node has children/items
      const children = node.items || node.children;
      if (children) {
        const result = findPathInConfig(children, targetId);
        if (result) {
          return [node, ...result];
        }
      }
    }
    return null;
  }



  // function injectBizFlow(root) {
  //   // Désactivé (Mermaid) pour éviter le flash de code + erreurs de parsing.
  //   return;
  // }

  function injectFinancePie(pageId, root) {
    // Désactivé : on s'appuie sur Chart.js pour ces vues afin d'éviter les erreurs Mermaid.
    return;
  }

  function injectTechStackContext(pageId, root) {
    if (pageId !== 'tech_stack') return;
    const target = root.querySelector('section');
    if (!target) return;

    const container = document.createElement('div');
    container.className = 'w-full flex justify-center mt-6';

    const pre = document.createElement('pre');
    pre.className = 'mermaid text-sm leading-relaxed';
    pre.textContent = `flowchart LR
    DEV["VSCode (Local)"] --> GH["GitHub (CI/CD)"]
    GH --> SOL["Solana (Devnet)"]
    GH --> EVM["EVM (Testnet)"]
    style DEV fill:#0b1220,stroke:#38bdf8,color:#e2e8f0,stroke-width:2px
    style GH fill:#0b1220,stroke:#64748b,color:#e2e8f0,stroke-width:2px
    style SOL fill:#0b1220,stroke:#14F195,color:#e2e8f0,stroke-width:2px
    style EVM fill:#0b1220,stroke:#f59e0b,color:#e2e8f0,stroke-width:2px`;

    container.appendChild(pre);
    target.appendChild(container);
  }


  function injectSyllabusGantt(pageId, root) {
    if (pageId !== 'tech_syllabus') return;
    const pre = document.createElement('pre');
    pre.className = 'mermaid text-[11px]';
    pre.textContent = `gantt
  title Parcours — Sprint 0 → Genesis → Build → Audit → Launch
  dateFormat  YYYY-MM-DD
  axisFormat  %d %b
  section Trajectoire
  Sprint 0 (Optionnel)   :s0, 2026-01-01, 7d
  Genesis (12 semaines)  :p1, after s0, 84d
  Build (16 semaines)    :l1, after p1, 112d
  Audit (20 semaines)    :l2, after l1, 140d
  Launch (Demo Day)      :milestone, ln, after l2, 1d`;
    const target = root.querySelector('section');
    if (target) target.appendChild(pre);
  }

  function runMermaidSafely() {
    try {
      const blocks = document.querySelectorAll('.mermaid');
      if (!blocks.length) return;
      if (!window.mermaid) return;
      window.mermaid.run({ querySelector: '.mermaid' })
        .catch(() => {
          // On erreur de parsing, on n’empêche pas le reste de l’UI
        });
    } catch {
      // Fallback silencieux
    }
  }

  // ---------- UX Premium helpers ----------
  function getNavSequence() {
    const seen = new Set();
    return Array.from(document.querySelectorAll('aside nav a[data-page]'))
      .filter(a => !a.dataset.lang || a.dataset.lang === currentLang)
      .filter(a => {
        if (seen.has(a.dataset.page)) return false;
        seen.add(a.dataset.page);
        return true;
      })
      .map(a => ({ id: a.dataset.page, title: a.textContent.trim(), el: a }));
  }

  function injectNextPrev(pageId, root) {
    const seq = getNavSequence();
    const idx = seq.findIndex(e => e.id === pageId);
    if (idx === -1) return;
    const prev = seq[idx - 1];
    const next = seq[idx + 1];

    // Remove existing nav if any (reload)
    root.querySelectorAll('[data-nav-nextprev]').forEach(n => n.remove());

    const labels = currentLang === 'fr'
      ? { prev: 'Précédent', next: 'Suivant' }
      : { prev: 'Previous', next: 'Next' };

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-nav-nextprev', '1');
    wrapper.className = 'mt-10 grid grid-cols-1 md:grid-cols-2 gap-3';

    const makeBtn = (isNext, item) => {
      const dirLabel = isNext ? labels.next : labels.prev;
      const iconName = isNext ? 'arrow-right' : 'arrow-left';
      const btn = document.createElement('button');
      btn.className = 'text-left border border-white/10 hover:border-indigo-500/50 p-4 rounded-xl transition-all group bg-white/5 w-full';

      const flex = document.createElement('div');
      flex.className = 'flex items-center justify-between';

      const textDiv = document.createElement('div');

      const labelDiv = document.createElement('div');
      labelDiv.className = 'text-[10px] uppercase tracking-widest text-slate-500 mb-1';
      labelDiv.textContent = dirLabel;

      const titleDiv = document.createElement('div');
      titleDiv.className = 'text-sm text-white font-bold';
      titleDiv.textContent = item.title;

      textDiv.appendChild(labelDiv);
      textDiv.appendChild(titleDiv);

      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', iconName);
      icon.className = 'w-5 h-5 text-slate-500 group-hover:text-indigo-400';

      flex.appendChild(textDiv);
      flex.appendChild(icon);
      btn.appendChild(flex);

      btn.addEventListener('click', () => loadPage(item.id));
      return btn;
    };

    if (prev) wrapper.appendChild(makeBtn(false, prev));
    if (next) wrapper.appendChild(makeBtn(true, next));

    root.appendChild(wrapper);
    if (window.lucide) try { lucide.createIcons(); } catch { }
  }

  function initProgressBarOnce() {
    if (document.getElementById('reading-progress')) return;

    const scroller = document.querySelector('main');
    if (!scroller) return;

    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.className = 'fixed top-0 left-0 h-1 z-[60] w-0 bg-gradient-to-r from-indigo-500 to-purple-500';
    document.body.appendChild(bar);

    const update = () => {
      const max = Math.max(scroller.scrollHeight - scroller.clientHeight, 1);
      const pct = Math.min(1, Math.max(0, scroller.scrollTop / max));
      bar.style.width = `${pct * 100}%`;
    };

    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    setTimeout(update, 50);
  }

  function applyHeroIfExecSummary(pageId, root) {
    if (pageId !== 'tech_00_home' && !/executive_summary/.test(pageId)) return;
    const h1 = root.querySelector('h1');
    if (h1) h1.classList.add('text-transparent', 'bg-clip-text', 'bg-gradient-to-r', 'from-white', 'to-slate-400', 'text-5xl', 'md:text-6xl', 'font-black');
  }

  function styleCodeBlocks(root) {
    root.querySelectorAll('pre:not(.mermaid)').forEach((pre) => {
      if (pre.dataset.terminalStyled) return;
      pre.dataset.terminalStyled = '1';
      const wrap = document.createElement('div');
      wrap.className = 'rounded-xl overflow-hidden border border-white/10 shadow-sm mb-4';

      const bar = document.createElement('div');
      bar.className = 'flex items-center gap-1 px-3 py-2 bg-[#0b0b0b] border-b border-white/10';
      ['bg-red-500', 'bg-yellow-500', 'bg-green-500'].forEach(cls => {
        const dot = document.createElement('div');
        dot.className = `w-2.5 h-2.5 rounded-full ${cls}`;
        bar.appendChild(dot);
      });

      pre.classList.add('bg-[#050505]', 'text-slate-200', 'p-4', 'font-mono', 'text-[12px]', 'overflow-x-auto');

      pre.parentElement.insertBefore(wrap, pre);
      wrap.appendChild(bar);
      wrap.appendChild(pre);
    });
  }

  function styleBlockquotes(root) {
    root.querySelectorAll('blockquote').forEach((bq) => {
      if (bq.dataset.styled) return;
      bq.dataset.styled = '1';
      bq.classList.add('relative', 'p-4', 'border-l-4', 'border-indigo-500', 'bg-indigo-500/5', 'rounded-r-xl');
      const icon = document.createElement('i');
      icon.setAttribute('data-lucide', 'quote');
      icon.className = 'absolute -top-2 -left-2 w-16 h-16 text-indigo-900/20 pointer-events-none';
      bq.appendChild(icon);
      if (window.lucide) try { lucide.createIcons(); } catch { }
    });
  }

  function imageFallbacks(root) {
    root.querySelectorAll('img').forEach((img) => {
      if (img.dataset.fallbackBound) return;
      img.dataset.fallbackBound = '1';
      img.addEventListener('error', () => {
        const src = img.getAttribute('src') || 'image.png';
        const name = (src.split('/').pop() || 'image').split('?')[0];
        const ph = document.createElement('div');
        ph.className = 'w-full min-h-[120px] bg-slate-800/60 border border-white/10 rounded-lg flex items-center justify-center text-slate-500 text-xs font-mono';
        ph.textContent = `Missing: ${name}`;
        img.replaceWith(ph);
      }, { once: true });
    });
  }

  function initLanguageToggle(pageId, root) {
    if (pageId !== 'tech_00_home') return;

    const fr = root.querySelector('#content-fr');
    const en = root.querySelector('#content-en');
    const btnFr = root.querySelector('#btn-fr');
    const btnEn = root.querySelector('#btn-en');

    if (!fr || !en || !btnFr || !btnEn) return;

    // Guard sur les boutons (pas sur root/contentDiv) car contentDiv est persistant
    if (btnFr.dataset.bound === '1' && btnEn.dataset.bound === '1') return;

    const setLang = (lang) => {
      const isFr = lang === 'fr';
      fr.classList.toggle('hidden', !isFr);
      en.classList.toggle('hidden', isFr);

      btnFr.classList.toggle('bg-white/10', isFr);
      btnFr.classList.toggle('text-white', isFr);
      btnFr.classList.toggle('shadow-sm', isFr);
      btnFr.classList.toggle('text-slate-500', !isFr);

      btnEn.classList.toggle('bg-white/10', !isFr);
      btnEn.classList.toggle('text-white', !isFr);
      btnEn.classList.toggle('shadow-sm', !isFr);
      btnEn.classList.toggle('text-slate-500', isFr);

      if (window.lucide) try { lucide.createIcons(); } catch { }
    };

    btnFr.addEventListener('click', () => {
      setLang('fr');
      localStorage.setItem('rbk_home_lang', 'fr');
    });
    btnEn.addEventListener('click', () => {
      setLang('en');
      localStorage.setItem('rbk_home_lang', 'en');
    });

    // Initial state logic:
    // 1. User preference (rbk_home_lang)
    // 2. Fallback to global currentLang if matches? Or just default to 'fr' inside home?
    // Let's stick to saved preference or default 'fr'.
    const saved = localStorage.getItem('rbk_home_lang') || 'fr';
    setLang(saved);

    btnFr.dataset.bound = '1';
    btnEn.dataset.bound = '1';
  }


  // History / Hash Handling (Hoisted)
  let _isHistoryNav = false;

  // ---------- Loader ----------
  async function loadPage(pageId) {
    const normalizedId = normalizePageId(pageId);
    const file = pagesByLang[currentLang]?.[normalizedId];

    // Runtime safety: even without QA, never fetch an unsafe path
    if (file && !isSafeChapterPath(file)) {
      showSecurityError(file);
      return;
    }

    if (!file) {
      showNotFoundError(pageId, normalizedId, currentLang);
      return;
    }

    currentPageId = normalizedId;
    setActiveLink(normalizedId);

    // Manage History
    if (!_isHistoryNav) {
      if (window.location.hash !== `#${normalizedId}`) {
        history.pushState({ pageId: normalizedId }, '', `#${normalizedId}`);
      }
    }

    showSpinner();

    try {
      const response = await fetch(file, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Page introuvable (${file})`);
      const html = await response.text();

      if (QA_STRICT) {
        const bad = /<\s*script\b|on\w+\s*=\s*["']|javascript:\s*/i.test(html);
        if (bad) throw new Error(`[QA] Unsafe markup detected in ${file} (script/on* attributes/javascript:)`);
      }

      // Zero innerHTML: Use the sanitizer which returns a DocumentFragment
      const fragment = sanitizeChapterHtmlToFragment(html);
      contentDiv.replaceChildren(fragment);


      if (window.lucide) lucide.createIcons();

      // Design system + data tables + badges + numeric alignment
      applyDesignSystem(contentDiv);
      styleTables(contentDiv);
      alignNumericCells(contentDiv);
      enhanceStatusBadges(contentDiv);

      // Premium polish
      applyHeroIfExecSummary(normalizedId, contentDiv);
      styleCodeBlocks(contentDiv);
      styleBlockquotes(contentDiv);
      imageFallbacks(contentDiv);
      injectNextPrev(normalizedId, contentDiv);
      initProgressBarOnce();
      initLanguageToggle(normalizedId, contentDiv);

      // Diagrams
      try {

        if (normalizedId === 'tech_stack') injectTechStackContext(normalizedId, contentDiv);
        if (normalizedId === 'tech_syllabus') injectSyllabusGantt(normalizedId, contentDiv);
        await ensureMermaid();
        runMermaidSafely();

        // Chart.js charts
        await ensureChartJS();
        cleanupCharts();
        if (normalizedId === 'tech_intro') renderContextCharts(contentDiv);
      } catch { }

      // Scroll main to top
      const scroller = document.querySelector('main');
      if (scroller) scroller.scrollTo({ top: 0, behavior: 'auto' });
      else window.scrollTo(0, 0);

    } catch (error) {
      showLoadError(error);
    }
  }

  // Global Event Delegation for dynamic elements
  document.addEventListener('click', (e) => {
    // 1. Sidebar Links (handled by explicit listeners usually, but let's cover basics if needed)
    // 2. Fallback Button
    const target = (e.target instanceof Element) ? e.target : e.target?.parentElement;
    if (!target) return;

    const fallbackBtn = target.closest('#btn-return-home');
    if (fallbackBtn) {
      e.preventDefault();
      loadPage('tech_00_home');
      return;
    }

    // 3. Dynamic links inside content
    const dyn = target.closest('a[data-page], button[data-page]');
    if (dyn) {
      // Avoid double-handling: sidebar is already bound via renderSidebar()
      const isInSidebar = !!dyn.closest('aside');
      if (!isInSidebar) {
        e.preventDefault();
        loadPage(dyn.dataset.page);
      }
      return;
    }
  });

  // Expose loadPage globally for inline onclick handlers
  window.loadPage = loadPage;

  // Charge la page d'accueil par défaut si pas de hash
  try { document.documentElement.setAttribute('lang', currentLang === 'fr' ? 'fr' : 'en'); } catch { }
  applyNavLanguage();

  if (QA_ENABLED) {
    try {
      await assertSidebarCoverage();
    } catch (err) {
      console.error("QA Check failed:", err);
      showQaError(err);
      throw err;
    }
  }

  // History / Hash Handling
  window.addEventListener('hashchange', () => {
    _isHistoryNav = true;
    const id = window.location.hash.substring(1) || 'tech_00_home';
    loadPage(id);
    _isHistoryNav = false;
  });

  const initialPage = window.location.hash.substring(1) || 'tech_00_home';
  loadPage(initialPage);
});
