document.addEventListener('DOMContentLoaded', () => {
  const contentDiv = document.getElementById('content');
  const links = document.querySelectorAll('aside nav a');

  // Define current language (default FR)
  let currentLang = localStorage.getItem('rbk_lang') || 'fr';

  function switchLang(lang) {
    if (!['fr', 'en'].includes(lang)) return;
    currentLang = lang;
    localStorage.setItem('rbk_lang', lang);

    // Refresh current page with new lang
    const hash = window.location.hash.replace('#', '') || '00_home';
    if (typeof window.loadPage === 'function') {
      window.loadPage(hash);
    } else {
      window.location.reload();
    }
  }

  // Expose to global scope for UI buttons
  window.switchLang = switchLang;

  if (window.lucide) {
    try { lucide.createIcons(); } catch { }
  }

  // Mapping full par langue (FR + EN)
  // Commercial files are FR-only (mapped in EN as fallback). Tech files are fully bilingual.
  const pagesByLang = {
    fr: {
      // 00. Cadrage & Synthèse
      "00_home": "chapters/00_home.html",
      "00_executive_summary": "chapters/00_executive_summary.html",
      "00_factsheet": "chapters/00_factsheet.html",
      "00_guide_lecture": "chapters/00_guide_lecture.html",
      "00_acronymes": "chapters/00_acronymes.html",

      // 01–07. Vision & Structure
      "01a_note_cadrage": "chapters/01a_note_cadrage.html",
      "01_vision": "chapters/01_vision.html",
      "02_contexte": "chapters/02_contexte.html",
      "03_arbitrage": "chapters/03_arbitrage.html",
      "04_analyse": "chapters/04_analyse.html",
      "05_partenariat": "chapters/05_partenariat.html",
      "06_methodologie": "chapters/06_methodologie.html",
      "07_structure": "chapters/07_structure.html",

      // 08–13. Programme
      "08_syllabus": "chapters/08_syllabus.html",
      "09_track_solana": "chapters/09_track_solana.html",
      "track_solana_manifest": "chapters/track_solana_manifest.html",
      "track_solana_n1": "chapters/track_solana_n1.html",
      "track_solana_n2": "chapters/track_solana_n2.html",
      "track_solana_n3": "chapters/track_solana_n3.html",
      "09_track_evm": "chapters/09_track_evm.html",
      "09_track_product": "chapters/09_track_product.html",
      "09c_team": "chapters/09c_team.html",
      "10_metiers": "chapters/10_metiers.html",
      "11_capstones": "chapters/11_capstones.html",

      // 12–15. Business
      "12_business_plan": "chapters/12_business_plan.html",
      "13_marketing": "chapters/13_marketing.html",
      "14_risques": "chapters/14_risques.html",
      "15_roadmap": "chapters/15_roadmap.html",

      // 16–19. Gouvernance
      "16_token_reputation": "chapters/16_token_reputation.html",
      "16_compliance_guide": "chapters/16_compliance_guide.html",
      "16_compliance_sbt": "chapters/16_compliance_sbt.html",
      "17_impact_odd": "chapters/17_impact_odd.html",
      "18_nexus_factory": "chapters/18_nexus_factory.html",
      "18_gouvernance": "chapters/18_gouvernance.html",
      "19_gouvernance_ethique": "chapters/19_gouvernance_ethique.html",
      "19_infrastructure_sbt": "chapters/19_infrastructure_sbt.html",

      // 20–22. Clôture
      "20_roadmap_lancement": "chapters/20_roadmap_lancement.html",
      "21_differentiation": "chapters/21_differentiation.html",
      "22_conclusion": "chapters/22_conclusion.html",

      // Annexes
      "annexe_a_gabarits": "chapters/annexe_a_gabarits.html",
      "annexe_a_syllabus": "chapters/annexe_a_syllabus.html",
      "annexe_b_finance": "chapters/annexe_b_finance.html",
      "annexe_c_juridique": "chapters/annexe_c_juridique.html",
      "annexe_d_audit": "chapters/annexe_d_audit.html",
      "annexe_e_cockpit": "chapters/annexe_e_cockpit.html",
      "annexe_f_isa": "chapters/annexe_f_isa.html",
      "annexe_g_selection": "chapters/annexe_g_selection.html",
      "annexe_h_sbt": "chapters/annexe_h_sbt.html",
      "annexe_i_dashboard": "chapters/annexe_i_dashboard.html",
      "annexe_j_offre": "chapters/annexe_j_offre.html",
      "annexe_l_mentors": "chapters/annexe_l_mentors.html",
      "annexe_m_b2b": "chapters/annexe_m_b2b.html",
      "annexe_n_stack": "chapters/annexe_n_stack.html",
      "annexe_o_competences": "chapters/annexe_o_competences.html",
      "annexe_p_charte": "chapters/annexe_p_charte.html",
      "annexe_q_cpps": "chapters/annexe_q_cpps.html",
      "annexe_r_hiring": "chapters/annexe_r_hiring.html",
      "annexe_s_juridique_kit": "chapters/annexe_s_juridique_kit.html",
      "annexe_t_staffing": "chapters/annexe_t_staffing.html",
      "annexe_u_risques": "chapters/annexe_u_risques.html",
      "annexe_v_pilotage": "chapters/annexe_v_pilotage.html",
      "annexe_w_glossaire": "chapters/annexe_w_glossaire.html",
      "annexe_z_gabarits": "chapters/annexe_z_gabarits.html",

      // --- TECH TRACK (BILINGUAL) ---
      "tech_00_home": "chapters/tech_00_home.html",
      "tech_intro": "chapters/tech_00_intro.html",
      "tech_methodology": "chapters/tech_01_methodology.html",
      "tech_pedagogy_guide": "chapters/tech_04_pedagogy_guide.html",
      "tech_soft_skills": "chapters/tech_05_soft_skills.html",
      "tech_syllabus": "chapters/tech_02_syllabus.html",
      "tech_stack": "chapters/tech_03_stack.html",
      "tech_competencies": "chapters/tech_09_competencies.html",
      "tech_solana_hub": "chapters/tech_06_solana_hub.html",
      "tech_06_foundations": "chapters/tech_06_foundations.html",
      "tech_06a_solana_n1": "chapters/tech_06a_solana_n1.html",
      "tech_06b_solana_n2": "chapters/tech_06b_solana_n2.html",
      "tech_06c_solana_n3": "chapters/tech_06c_solana_n3.html",
      "tech_06g_validator_infra_overview": "chapters/tech_06g_validator_infra_overview.html",
      "tech_06h_anchor_n1": "chapters/tech_06h_anchor_n1.html",
      "tech_06i_anchor_n2": "chapters/tech_06i_anchor_n2.html",
      "tech_06j_anchor_n3": "chapters/tech_06j_anchor_n3.html",
      "tech_06d_security_labs": "chapters/tech_06d_security_labs.html",
      "tech_06d1_security_labs_n1": "chapters/tech_06d1_security_labs_n1.html",
      "tech_06d2_security_labs_n2": "chapters/tech_06d2_security_labs_n2.html",
      "tech_06d3_security_labs_n3": "chapters/tech_06d3_security_labs_n3.html",
      "tech_06e_tokens_and_cpi": "chapters/tech_06e_tokens_and_cpi.html",
      "tech_06e1_tokens_and_cpi_n1": "chapters/tech_06e1_tokens_and_cpi_n1.html",
      "tech_06e2_tokens_and_cpi_n2": "chapters/tech_06e2_tokens_and_cpi_n2.html",
      "tech_06f_build_an_amm": "chapters/tech_06f_build_an_amm.html",
      "tech_06f1_build_an_amm_n1": "chapters/tech_06f1_build_an_amm_n1.html",
      "tech_06f2_build_an_amm_n2": "chapters/tech_06f2_build_an_amm_n2.html",
      "tech_evm_hub": "chapters/tech_07_evm_hub.html",
      "tech_capstones": "chapters/tech_08_capstones.html",
      "tech_mentor_guide": "chapters/tech_10_mentor_guide.html",
    },
    en: {
      // Commercial Fallbacks (FR)
      "00_home": "chapters/00_home.html",
      "00_executive_summary": "chapters/00_executive_summary.html",
      "00_factsheet": "chapters/00_factsheet.html",
      "00_guide_lecture": "chapters/00_guide_lecture.html",
      "00_acronymes": "chapters/00_acronymes.html",
      "01a_note_cadrage": "chapters/01a_note_cadrage.html",
      "01_vision": "chapters/01_vision.html",
      "02_contexte": "chapters/02_contexte.html",
      "03_arbitrage": "chapters/03_arbitrage.html",
      "04_analyse": "chapters/04_analyse.html",
      "05_partenariat": "chapters/05_partenariat.html",
      "06_methodologie": "chapters/06_methodologie.html",
      "07_structure": "chapters/07_structure.html",
      "08_syllabus": "chapters/08_syllabus.html",
      "09_track_solana": "chapters/09_track_solana.html",
      "track_solana_manifest": "chapters/track_solana_manifest.html",
      "track_solana_n1": "chapters/track_solana_n1.html",
      "track_solana_n2": "chapters/track_solana_n2.html",
      "track_solana_n3": "chapters/track_solana_n3.html",
      "09_track_evm": "chapters/09_track_evm.html",
      "09_track_product": "chapters/09_track_product.html",
      "09c_team": "chapters/09c_team.html",
      "10_metiers": "chapters/10_metiers.html",
      "11_capstones": "chapters/11_capstones.html",
      "12_business_plan": "chapters/12_business_plan.html",
      "13_marketing": "chapters/13_marketing.html",
      "14_risques": "chapters/14_risques.html",
      "15_roadmap": "chapters/15_roadmap.html",
      "16_token_reputation": "chapters/16_token_reputation.html",
      "16_compliance_guide": "chapters/16_compliance_guide.html",
      "16_compliance_sbt": "chapters/16_compliance_sbt.html",
      "17_impact_odd": "chapters/17_impact_odd.html",
      "18_nexus_factory": "chapters/18_nexus_factory.html",
      "18_gouvernance": "chapters/18_gouvernance.html",
      "19_gouvernance_ethique": "chapters/19_gouvernance_ethique.html",
      "19_infrastructure_sbt": "chapters/19_infrastructure_sbt.html",
      "20_roadmap_lancement": "chapters/20_roadmap_lancement.html",
      "21_differentiation": "chapters/21_differentiation.html",
      "22_conclusion": "chapters/22_conclusion.html",
      "annexe_a_gabarits": "chapters/annexe_a_gabarits.html",
      "annexe_a_syllabus": "chapters/annexe_a_syllabus.html",
      "annexe_b_finance": "chapters/annexe_b_finance.html",
      "annexe_c_juridique": "chapters/annexe_c_juridique.html",
      "annexe_d_audit": "chapters/annexe_d_audit.html",
      "annexe_e_cockpit": "chapters/annexe_e_cockpit.html",
      "annexe_f_isa": "chapters/annexe_f_isa.html",
      "annexe_g_selection": "chapters/annexe_g_selection.html",
      "annexe_h_sbt": "chapters/annexe_h_sbt.html",
      "annexe_i_dashboard": "chapters/annexe_i_dashboard.html",
      "annexe_j_offre": "chapters/annexe_j_offre.html",
      "annexe_l_mentors": "chapters/annexe_l_mentors.html",
      "annexe_m_b2b": "chapters/annexe_m_b2b.html",
      "annexe_n_stack": "chapters/annexe_n_stack.html",
      "annexe_o_competences": "chapters/annexe_o_competences.html",
      "annexe_p_charte": "chapters/annexe_p_charte.html",
      "annexe_q_cpps": "chapters/annexe_q_cpps.html",
      "annexe_r_hiring": "chapters/annexe_r_hiring.html",
      "annexe_s_juridique_kit": "chapters/annexe_s_juridique_kit.html",
      "annexe_t_staffing": "chapters/annexe_t_staffing.html",
      "annexe_u_risques": "chapters/annexe_u_risques.html",
      "annexe_v_pilotage": "chapters/annexe_v_pilotage.html",
      "annexe_w_glossaire": "chapters/annexe_w_glossaire.html",
      "annexe_z_gabarits": "chapters/annexe_z_gabarits.html",

      // --- TECH TRACK (ENGLISH) ---
      "tech_00_home": "chapters/tech_00_home_en.html",
      "tech_intro": "chapters/tech_00_intro_en.html",
      "tech_methodology": "chapters/tech_01_methodology_en.html",
      "tech_pedagogy_guide": "chapters/tech_04_pedagogy_guide_en.html",
      "tech_soft_skills": "chapters/tech_05_soft_skills_en.html",
      "tech_syllabus": "chapters/tech_02_syllabus_en.html",
      "tech_stack": "chapters/tech_03_stack_en.html",
      "tech_competencies": "chapters/tech_09_competencies_en.html",
      "tech_solana_hub": "chapters/tech_06_solana_hub_en.html",
      "tech_06_foundations": "chapters/tech_06_foundations_en.html",
      "tech_06a_solana_n1": "chapters/tech_06a_solana_n1_en.html",
      "tech_06b_solana_n2": "chapters/tech_06b_solana_n2_en.html",
      "tech_06c_solana_n3": "chapters/tech_06c_solana_n3_en.html",
      "tech_06g_validator_infra_overview": "chapters/tech_06g_validator_infra_overview_en.html",
      "tech_06h_anchor_n1": "chapters/tech_06h_anchor_n1_en.html",
      "tech_06i_anchor_n2": "chapters/tech_06i_anchor_n2_en.html",
      "tech_06j_anchor_n3": "chapters/tech_06j_anchor_n3_en.html",
      "tech_06d_security_labs": "chapters/tech_06d_security_labs_en.html",
      "tech_06d1_security_labs_n1": "chapters/tech_06d1_security_labs_n1_en.html",
      "tech_06d2_security_labs_n2": "chapters/tech_06d2_security_labs_n2_en.html",
      "tech_06d3_security_labs_n3": "chapters/tech_06d3_security_labs_n3_en.html",
      "tech_06e_tokens_and_cpi": "chapters/tech_06e_tokens_and_cpi_en.html",
      "tech_06e1_tokens_and_cpi_n1": "chapters/tech_06e1_tokens_and_cpi_n1_en.html",
      "tech_06e2_tokens_and_cpi_n2": "chapters/tech_06e2_tokens_and_cpi_n2_en.html",
      "tech_06f_build_an_amm": "chapters/tech_06f_build_an_amm_en.html",
      "tech_06f1_build_an_amm_n1": "chapters/tech_06f1_build_an_amm_n1_en.html",
      "tech_06f2_build_an_amm_n2": "chapters/tech_06f2_build_an_amm_n2_en.html",
      "tech_evm_hub": "chapters/tech_07_evm_hub_en.html",
      "tech_capstones": "chapters/tech_08_capstones_en.html",
      "tech_mentor_guide": "chapters/tech_10_mentor_guide_en.html",
    }
  };

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
    (window._rbkCharts || []).forEach((ch) => { try { ch.destroy(); } catch { } });
    window._rbkCharts = [];
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
      (window._rbkCharts ||= []).push(chart);
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
      (window._rbkCharts ||= []).push(chart);
    }
  }

  function renderBusinessCharts(root) {
    const pie = root.querySelector('#chartRevenueMix');
    if (pie) {
      const ctx = pie.getContext('2d');
      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Formation Initiale (Cash)', 'ISA (Excellence)', 'B2B (Corporate)'],
          datasets: [{ data: [85, 5, 10], backgroundColor: ['#ffffff', '#14F195', '#6366f1'], borderWidth: 0 }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });
      (window._rbkCharts ||= []).push(chart);
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
    if (pageId !== 'annexe_n_stack') return;
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
    if (pageId !== '08_syllabus') return;
    const pre = document.createElement('pre');
    pre.className = 'mermaid text-[11px]';
    pre.textContent = `gantt\n  title Macro Parcours — Genesis → Build → Audit → Launch\n  dateFormat  YYYY-MM-DD\n  axisFormat  %d %b\n  section Trajectoire\n  Sprint 0 (Cadrage)    :s0, 2026-01-01, 30d\n  Genesis (12 semaines) :p1, after s0, 84d\n  Build (16 semaines)   :p2, after p1, 112d\n  Audit (20 semaines)   :p3, after p2, 140d\n  Launch                :milestone, ln, after p3, 1d`;
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
    return Array.from(document.querySelectorAll('aside nav a'))
      // Exclude annex section separators etc. Keep clickable only
      .filter(a => a.dataset.page)
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

  // ---------- Loader ----------
  async function loadPage(pageId) {
    // --- Legacy Redirects (V5 Migration) ---
    const legacyRedirects = {
      "04_methodologie": "06_methodologie",
      "05_structure": "07_structure"
    };
    if (legacyRedirects[pageId]) {
      console.log(`[Redirect] ${pageId} -> ${legacyRedirects[pageId]}`);
      return loadPage(legacyRedirects[pageId]);
    }

    const file = pagesByLang[currentLang]?.[pageId];
    if (!file) {
      console.warn(`[LoadPage] ID ${pageId} introuvable pour la langue ${currentLang}`);
      // Fallback safety (if tech page requested in FR but only EN exists or vice versa? Unlikely with full map)
      return;
    }

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

      // Diagrams
      try {
        if (pageId === '15_roadmap' || pageId === '20_roadmap_lancement') injectGanttForRoadmap(pageId, contentDiv);
        // Mermaid désactivé pour les sections finance/business afin d’éviter le flash de code/erreurs
        if (pageId === 'annexe_n_stack') injectTechStackContext(pageId, contentDiv);
        if (pageId === '08_syllabus') injectSyllabusGantt(pageId, contentDiv);
        await ensureMermaid();
        runMermaidSafely();

        // Chart.js charts
        await ensureChartJS();
        cleanupCharts();
        if (pageId === '02_contexte') renderContextCharts(contentDiv);
        if (pageId === '04_analyse') renderAnalyseCharts(contentDiv);
        if (pageId === '12_business_plan') {
          renderBusinessCharts(contentDiv);
          injectNexusSimulator('nexus-simulator-area');
        }
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

  function renderAnalyseCharts(container) {
    if (!window._rbkCharts) window._rbkCharts = [];

    // Chart 1: Solana Talents vs Traction
    const ctx1 = container.querySelector('#chartSolanaTraction');
    if (ctx1) {
      window._rbkCharts.push(new Chart(ctx1, {
        type: 'line',
        data: {
          labels: ['2021', '2022', '2023', '2024'],
          datasets: [
            {
              label: 'Développeurs Actifs (Monthly)',
              data: [200, 2400, 2800, 3500],
              borderColor: '#9945FF',
              backgroundColor: 'rgba(153, 69, 255, 0.1)',
              yAxisID: 'y'
            },
            {
              label: 'TVL ($B)',
              data: [1, 2, 4, 8],
              borderColor: '#14F195',
              backgroundColor: 'rgba(20, 241, 149, 0.1)',
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { labels: { color: '#94a3b8' } }
          },
          scales: {
            x: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
            y: { type: 'linear', display: true, position: 'left', ticks: { color: '#9945FF' } },
            y1: { type: 'linear', display: true, position: 'right', ticks: { color: '#14F195' }, grid: { drawOnChartArea: false } }
          }
        }
      }));
    }

    // Chart 2: Job Market Index
    const ctx2 = container.querySelector('#chartJobIndex');
    if (ctx2) {
      window._rbkCharts.push(new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['2021 (Bull)', '2022 (Bear)', '2023 (Build)', '2024 (Growth)'],
          datasets: [{
            label: 'Offres Emploi Web3 (Index 100)',
            data: [100, 85, 140, 420],
            backgroundColor: [
              'rgba(148, 163, 184, 0.5)',
              'rgba(255, 255, 255, 0.2)', // Bear
              'rgba(20, 241, 149, 0.6)',
              'rgba(153, 69, 255, 0.8)'
            ],
            borderColor: 'transparent',
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
            y: { ticks: { color: '#64748b' }, grid: { color: '#1e293b' } }
          }
        }
      }));
    }
  }

  function injectNexusSimulator(targetId) {
    const container = document.getElementById(targetId);
    if (!container) return;

    const html = `
    <div class="glass-card p-6 mt-0 border border-emerald-500/30">
        <h3 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <i data-lucide="landmark" class="text-emerald-400"></i>
            Simulateur : Modèle Premium (Cash Flow)
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-6">
                <div>
                    <label class="text-xs uppercase text-emerald-300 font-bold">1. Chiffre d'Affaires (CASH)</label>
                    <p class="text-[10px] text-slate-500 mb-2">95% payé upfront (Clients Solvables)</p>
                    <input type="range" min="100000" max="2000000" step="50000" value="850000" id="sim-ca" class="w-full accent-emerald-500">
                    <div class="text-right font-mono text-emerald-300" id="val-ca">850,000 TND</div>
                </div>
                <div>
                    <label class="text-xs uppercase text-indigo-300 font-bold">2. Coûts Service Nexus (Facture)</label>
                    <p class="text-[10px] text-slate-500 mb-2">Technologie, Staffing & R&D</p>
                    <input type="range" min="50000" max="1000000" step="10000" value="595000" id="sim-costs" class="w-full accent-indigo-500">
                    <div class="text-right font-mono text-indigo-300" id="val-costs">595,000 TND</div>
                </div>
                <div class="p-3 bg-white/5 rounded border border-white/10 opacity-60">
                     <label class="text-xs uppercase text-slate-400 font-bold">3. Impact ISA (Excellence)</label>
                     <p class="text-[10px] text-slate-500">Plafonné à 2 étudiants (Volume négligeable)</p>
                </div>
            </div>

            <div class="flex flex-col justify-center space-y-4 bg-slate-900/50 p-4 rounded-xl border border-white/5">
                
                <div class="pb-2 border-b border-white/10">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-slate-400">Sortie Cash (Vers Nexus)</span>
                        <span class="font-bold font-mono text-indigo-400" id="res-nexus">595,000 TND</span>
                    </div>
                </div>

                <div class="pb-2 border-b border-white/10">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-emerald-400 font-bold">Marge Brute RBK (Immédiate)</span>
                        <span class="font-bold font-mono text-emerald-400 text-lg" id="res-rbk">255,000 TND</span>
                    </div>
                    <p class="text-[9px] text-slate-500 mt-1 text-right">Trésorerie disponible J+1</p>
                </div>
                
                <div class="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex mt-2">
                    <div id="bar-nexus" class="h-full bg-indigo-500/80 transition-all duration-500" style="width: 70%"></div>
                    <div id="bar-rbk" class="h-full bg-emerald-500/80 transition-all duration-500" style="width: 30%"></div>
                </div>
            </div>
        </div>
    </div>
    `;

    container.innerHTML += html;
    if (window.lucide) lucide.createIcons();

    // Logic
    const inputs = ['sim-ca', 'sim-costs'];
    inputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', updateSim);
    });

    function updateSim() {
      const ca = parseInt(document.getElementById('sim-ca').value);
      const costs = parseInt(document.getElementById('sim-costs').value);

      // Dans ce nouveau modèle, Nexus coute ce qu'il coute (input), pas de marge complexe calculée ici
      // On simplifie pour montrer la soustraction CASH - FACTURE
      const nexusBill = costs;
      let rbkNet = ca - nexusBill;

      // Mise à jour DOM
      document.getElementById('val-ca').innerText = ca.toLocaleString() + ' TND';
      document.getElementById('val-costs').innerText = costs.toLocaleString() + ' TND';
      document.getElementById('res-nexus').innerText = nexusBill.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' TND';

      const rbkEl = document.getElementById('res-rbk');
      rbkEl.innerText = rbkNet.toLocaleString(undefined, { maximumFractionDigits: 0 }) + ' TND';

      // Alerte si RBK est en déficit
      if (rbkNet < 0) {
        rbkEl.classList.remove('text-emerald-400');
        rbkEl.classList.add('text-rose-500');
        rbkEl.innerText += " (Déficit)";
      } else {
        rbkEl.classList.remove('text-rose-500');
        rbkEl.classList.add('text-emerald-400');
      }

      // Update Bar
      const total = Math.max(ca, nexusBill); // Base 100 on the largest to fit bar
      const pctNexus = Math.min((nexusBill / total) * 100, 100);
      const pctRbk = rbkNet > 0 ? (rbkNet / total) * 100 : 0;

      document.getElementById('bar-nexus').style.width = pctNexus + '%';
      document.getElementById('bar-rbk').style.width = pctRbk + '%';
    }
  }

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      loadPage(link.dataset.page);
    });
  });

  // Charge la page d'accueil par défaut si pas de hash
  const initialPage = window.location.hash.substring(1) || '00_home';
  loadPage(initialPage);
});
