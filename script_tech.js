document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('content');
  const links = document.querySelectorAll('aside nav a');

  if (window.lucide) {
    try { lucide.createIcons(); } catch { }
  }

  // Mapping strict par langue
  const pagesByLang = {
    fr: {
      tech_00_home: "chapters/tech_00_home.html",
      tech_intro: "chapters/tech_00_intro.html",
      tech_methodology: "chapters/tech_01_methodology.html",
      tech_syllabus: "chapters/tech_02_syllabus.html",
      tech_stack: "chapters/tech_03_stack.html",
      tech_pedagogy_guide: "chapters/tech_04_pedagogy_guide.html",
      tech_soft_skills: "chapters/tech_05_soft_skills.html",
      tech_solana_hub: "chapters/tech_06_solana_hub.html",
      tech_solana_n1: "chapters/tech_06a_solana_n1.html",
      tech_solana_n2: "chapters/tech_06b_solana_n2.html",
      tech_solana_n3: "chapters/tech_06c_solana_n3.html",
      tech_evm_hub: "chapters/tech_07_evm_hub.html",
      tech_capstones: "chapters/tech_08_capstones.html",
      tech_competencies: "chapters/tech_09_competencies.html",
      tech_mentor_guide: "chapters/tech_10_mentor_guide.html"
    },
    en: {
      tech_00_home: "chapters/tech_00_home_en.html",
      tech_intro: "chapters/tech_00_intro_en.html",
      tech_methodology: "chapters/tech_01_methodology_en.html",
      tech_syllabus: "chapters/tech_02_syllabus_en.html",
      tech_stack: "chapters/tech_03_stack_en.html",
      tech_pedagogy_guide: "chapters/tech_04_pedagogy_guide_en.html",
      tech_soft_skills: "chapters/tech_05_soft_skills_en.html",
      tech_solana_hub: "chapters/tech_06_solana_hub_en.html",
      tech_solana_n1: "chapters/tech_06a_solana_n1_en.html",
      tech_solana_n2: "chapters/tech_06b_solana_n2_en.html",
      tech_solana_n3: "chapters/tech_06c_solana_n3_en.html",
      tech_evm_hub: "chapters/tech_07_evm_hub_en.html",
      tech_capstones: "chapters/tech_08_capstones_en.html",
      tech_competencies: "chapters/tech_09_competencies_en.html",
      tech_mentor_guide: "chapters/tech_10_mentor_guide_en.html"
    }
  };

  let currentLang = localStorage.getItem('wb_lang') || 'fr';
  let currentPageId = null;

  function applyNavLanguage() {
    document.querySelectorAll('[data-lang]').forEach((el) => {
      el.classList.toggle('hidden', el.dataset.lang !== currentLang);
    });
  }

  function setLanguage(lang, reload = true) {
    if (!pagesByLang[lang]) return;
    currentLang = lang;
    localStorage.setItem('wb_lang', lang);
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
      const wrap = (cls) => {
        const box = document.createElement('div');
        box.className = `p-3 rounded-xl border ${cls} my-2`;
        el.parentNode.insertBefore(box, el);
        box.appendChild(el);
      };
      if (/^\s*Note\s*:/i.test(t)) wrap('border-l-4 border-amber-500 bg-amber-500/10');
      if (/^\s*Important\s*:/i.test(t)) wrap('border-l-4 border-rose-500 bg-rose-500/10');
      if (/^\s*Définition\s*:/i.test(t)) wrap('border-l-4 border-blue-500 bg-blue-500/10');
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
    links.forEach((l) => {
      if (l.dataset.lang && l.dataset.lang !== currentLang) {
        l.classList.remove('bg-white/10', 'text-white', 'border-r-2', 'border-indigo-500');
        l.classList.add('text-slate-400', 'hover:text-white');
        return;
      }
      if (l.dataset.page === pageId) {
        l.classList.add('bg-white/10', 'text-white', 'border-r-2', 'border-indigo-500');
        l.classList.remove('text-slate-400', 'hover:text-white');
      } else {
        l.classList.remove('bg-white/10', 'text-white', 'border-r-2', 'border-indigo-500');
        l.classList.add('text-slate-400', 'hover:text-white');
      }
    });

    // Keep active link visible in sidebar (avoid querySelector on class with "/")
    const nav = document.querySelector('aside nav');
    const active = Array.from(document.querySelectorAll('aside nav a')).find(a =>
      a.classList.contains('bg-white/10') || (a.classList.contains('text-white') && a.classList.contains('border-indigo-500'))
    );
    if (active && nav) {
      try { active.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } catch { }
    }
  }

  function injectGanttForRoadmap(pageId, root) {
    const container = document.createElement('div');
    container.className = 'mt-6';
    const pre = document.createElement('pre');
    pre.className = 'mermaid text-[11px]';
    if (pageId === '15_roadmap') {
      pre.textContent = `gantt\n  title Roadmap 120 Jours\n  dateFormat  YYYY-MM-DD\n  axisFormat  %d %b\n  section Préparation\n  Sprint 0 (MVP & Légal)    :crit, s0, 2026-01-01, 90d\n  section Exécution\n  Phase 1 (Prod & Indus.)   :active, s1, after s0, 60d\n  Phase 2 (Sélection)       : s2, after s1, 30d\n  section Lancement\n  Phase 3 (Launch Ops)      :milestone, s3, after s2, 30d`;
    } else if (pageId === '20_roadmap_lancement') {
      pre.textContent = `gantt\n  title Plan de Lancement (90 Jours)\n  dateFormat  YYYY-MM-DD\n  axisFormat  %d %b\n  section Mois 1\n  Cadrage & Alliance    :m1, 2026-02-01, 30d\n  section Mois 2\n  Production & Infra    :m2, after m1, 30d\n  section Mois 3\n  Sélection & Launch     :m3, after m2, 30d`;
    } else {
      return;
    }
    container.appendChild(pre);
    // Insert near first section
    const firstSection = root.querySelector('section');
    (firstSection || root).appendChild(container);
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
    if (pageId !== '06_syllabus') return;
    const pre = document.createElement('pre');
    pre.className = 'mermaid text-[11px]';
    pre.textContent = `gantt\n  title Macro Parcours — Sprint 0 → Piscine → Lab → Launch\n  dateFormat  YYYY-MM-DD\n  axisFormat  %d %b\n  section Trajectoire\n  Sprint 0 (Cadrage)    :s0, 2026-01-01, 30d\n  Piscine (4 semaines)  :p1, after s0, 28d\n  Lab (16 semaines)     :l1, after p1, 112d\n  Launch                :milestone, ln, after l1, 1d`;
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

    const wrapper = document.createElement('div');
    wrapper.setAttribute('data-nav-nextprev', '1');
    wrapper.className = 'mt-10 grid grid-cols-1 md:grid-cols-2 gap-3';

    const makeBtn = (dir, item) => {
      const btn = document.createElement('button');
      btn.className = 'text-left border border-white/10 hover:border-indigo-500/50 p-4 rounded-xl transition-all group bg-white/5';
      btn.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <div class="text-[10px] uppercase tracking-widest text-slate-500 mb-1">${dir}</div>
            <div class="text-sm text-white font-bold">${item.title}</div>
          </div>
          <i data-lucide="${dir === 'Suivant' ? 'arrow-right' : 'arrow-left'}" class="w-5 h-5 text-slate-500 group-hover:text-indigo-400"></i>
        </div>`;
      btn.addEventListener('click', () => loadPage(item.id));
      return btn;
    };

    if (prev) wrapper.appendChild(makeBtn('Précédent', prev));
    if (next) wrapper.appendChild(makeBtn('Suivant', next));

    root.appendChild(wrapper);
    if (window.lucide) try { lucide.createIcons(); } catch { }
  }

  function initProgressBarOnce() {
    if (document.getElementById('reading-progress')) return;
    const bar = document.createElement('div');
    bar.id = 'reading-progress';
    bar.className = 'fixed top-0 left-0 h-1 z-[60] w-0 bg-gradient-to-r from-indigo-500 to-purple-500';
    document.body.appendChild(bar);

    const scroller = document.querySelector('main');
    const update = () => {
      if (!scroller) return;
      const max = Math.max(scroller.scrollHeight - scroller.clientHeight, 1);
      const pct = Math.min(1, Math.max(0, scroller.scrollTop / max));
      bar.style.width = `${pct * 100}%`;
    };
    ['scroll', 'resize'].forEach(ev => scroller.addEventListener(ev, update, { passive: true }));
    window.addEventListener('resize', update, { passive: true });
    setTimeout(update, 50);
  }

  function applyHeroIfExecSummary(pageId, root) {
    if (pageId !== '00_executive_summary' && !/executive_summary/.test(pageId)) return;
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
    if (root.dataset.langBound === '1') return;
    const fr = root.querySelector('#content-fr');
    const en = root.querySelector('#content-en');
    const btnFr = root.querySelector('#btn-fr');
    const btnEn = root.querySelector('#btn-en');
    if (!fr || !en || !btnFr || !btnEn) return;

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

    btnFr.addEventListener('click', () => setLang('fr'));
    btnEn.addEventListener('click', () => setLang('en'));
    setLang('fr');
    root.dataset.langBound = '1';
  }


  // ---------- Loader ----------
  async function loadPage(pageId) {
    const file = pagesByLang[currentLang]?.[pageId];
    if (!file) return;

    currentPageId = pageId;
    setActiveLink(pageId);
    history.replaceState({ pageId }, '', `#${pageId}`);

    contentDiv.innerHTML = '<div class="flex items-center justify-center h-64"><div class="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>';

    try {
      const response = await fetch(file, { cache: 'no-cache' });
      if (!response.ok) throw new Error(`Page introuvable (${file})`);
      const html = await response.text();
      contentDiv.innerHTML = html;

      if (window.lucide) lucide.createIcons();

      // Design system + data tables + badges + numeric alignment
      applyDesignSystem(contentDiv);
      styleTables(contentDiv);
      alignNumericCells(contentDiv);
      enhanceStatusBadges(contentDiv);

      // Premium polish
      applyHeroIfExecSummary(pageId, contentDiv);
      styleCodeBlocks(contentDiv);
      styleBlockquotes(contentDiv);
      imageFallbacks(contentDiv);
      injectNextPrev(pageId, contentDiv);
      initProgressBarOnce();
      initLanguageToggle(pageId, contentDiv);

      // Diagrams
      try {
        if (pageId === '15_roadmap' || pageId === '20_roadmap_lancement') injectGanttForRoadmap(pageId, contentDiv);
        if (pageId === 'tech_stack') injectTechStackContext(pageId, contentDiv);
        if (pageId === 'tech_syllabus') injectSyllabusGantt(pageId, contentDiv);
        await ensureMermaid();
        runMermaidSafely();

        // Chart.js charts
        await ensureChartJS();
        cleanupCharts();
        if (pageId === 'tech_intro') renderContextCharts(contentDiv);
      } catch { }

      window.scrollTo(0, 0);
    } catch (error) {
      contentDiv.innerHTML = `<div class="p-8 text-rose-400 bg-rose-900/10 rounded-xl border border-rose-500/20">
        <h3 class="font-bold mb-2">Erreur de chargement</h3>
        <p>${error.message}</p>
        <p class="text-xs mt-4 text-slate-500">Vérifiez que le fichier existe bien dans le dossier chapters/.</p>
      </div>`;
    }
  }

  // Expose loadPage globally for inline onclick handlers
  window.loadPage = loadPage;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      if (link.dataset.lang && link.dataset.lang !== currentLang) return;
      e.preventDefault();
      loadPage(link.dataset.page);
    });
  });

  // Charge la page d'accueil par défaut si pas de hash
  applyNavLanguage();
  const initialPage = window.location.hash.substring(1) || 'tech_00_home';
  loadPage(initialPage);
});
