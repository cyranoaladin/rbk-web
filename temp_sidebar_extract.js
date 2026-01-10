
            [
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

            // NB: on garde tech_solana_n1/n2/n3 pour l’UI (lisible), et pagesByLang fait l’alias
            { id: 'tech_06a_solana_n1', labelFr: '↳ N1 — Rust utile + outils', labelEn: '↳ N1 — Rust + tools (Solana)' },
            { id: 'tech_06b_solana_n2', labelFr: '↳ N2 — Anchor : Counter → Patterns', labelEn: '↳ N2 — Anchor: Counter → Patterns' },
            { id: 'tech_06c_solana_n3', labelFr: '↳ N3 — Capstone Anchor → Native', labelEn: '↳ N3 — Capstone Anchor → Native' },

            { id: 'tech_06d_security_labs', labelFr: '↳ Security Labs (Anchor + Native)', labelEn: '↳ Security labs (Anchor + Native)' },
            { id: 'tech_06e_tokens_and_cpi', labelFr: '↳ Tokens / Token-2022 / CPI', labelEn: '↳ Tokens / Token-2022 / CPI' },
            { id: 'tech_06f_build_an_amm', labelFr: '↳ Build an AMM', labelEn: '↳ Build an AMM' },
            { id: 'tech_06g_validator_infra_overview', labelFr: '↳ Validator/Infra (ouverture)', labelEn: '↳ Validator/Infra (overview)' },
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
  ]
        