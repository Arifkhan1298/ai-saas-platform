/* ==========================================================================
   NEXVORA AI - Document Intelligence Interactive Module
   Simulated document scanner, extraction, and context-aware questioning
   ========================================================================== */

(function() {
  'use strict';

  const documents = {
    report: {
      name: "Q4_Enterprise_Financial_Audit.pdf",
      size: "4.8 MB • 32 pages",
      previewText: `...operating revenue reached <strong>$42.8M</strong>, reflecting a <span class="doc-highlight">34.2% Year-over-Year growth</span> driven by expanded corporate SaaS licensing. Gross profit margin settled at <strong>78.4%</strong>. Operating expenses were optimized through automated workflow adoption, reducing administrative overhead by 22%...`,
      insights: [
        "Net Operating Cash Flow increased by $6.4M in Q4.",
        "SaaS Gross Margin stands at an elite 78.4%.",
        "Recommended action: Reinvest $2.1M into Tier-1 inference infrastructure."
      ],
      entities: ["ARR: $42.8M", "Margin: 78.4%", "Growth: +34.2%", "Status: Verified SOC2"]
    },
    roadmap: {
      name: "2026_AI_Strategy_Roadmap.docx",
      size: "1.9 MB • 14 pages",
      previewText: `...prioritizing <span class="doc-highlight">autonomous agent orchestration</span> and real-time document vectors. Milestone 1 includes multi-modal semantic caching with target latency under 15ms. Phase 2 introduces zero-knowledge private enterprise data enclaves...`,
      insights: [
        "Target latency threshold: Sub-15ms for vector semantic search.",
        "Zero-knowledge privacy enclaves slated for deployment by Q3.",
        "Cross-department autonomous agent pilot to commence next month."
      ],
      entities: ["Latency: <15ms", "Encryption: AES-256", "Protocol: Vector-v4", "Target: Q3 2026"]
    },
    compliance: {
      name: "Global_Contract_Compliance.pdf",
      size: "3.2 MB • 24 pages",
      previewText: `...vendor indemnity clauses comply with <span class="doc-highlight">GDPR Article 28 and CCPA specifications</span>. Data retention is capped at 30 days for transient inference payloads with automated cryptographic purge protocols confirmed by third-party audit...`,
      insights: [
        "Fully compliant with GDPR Article 28 and CCPA frameworks.",
        "Zero data retention on private fine-tuned weights.",
        "Cryptographic purge logs validated by Ernst & Young audit."
      ],
      entities: ["GDPR: Compliant", "CCPA: Compliant", "Retention: 30 Days", "Audit: Clean"]
    }
  };

  const docSelectorBtns = document.querySelectorAll('.doc-tab-btn');
  const docTitleEl = document.getElementById('doc-preview-title');
  const docMetaEl = document.getElementById('doc-preview-meta');
  const docTextEl = document.getElementById('doc-preview-text');
  const docInsightsList = document.getElementById('doc-insights-list');
  const docEntitiesWrap = document.getElementById('doc-entities-wrap');
  const docSearchInput = document.getElementById('doc-search-input');
  const docSearchBtn = document.getElementById('doc-search-btn');

  if (!docTitleEl) return;

  docSelectorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      docSelectorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const docKey = btn.getAttribute('data-doc');
      loadDocument(docKey);
    });
  });

  function loadDocument(key) {
    const doc = documents[key] || documents.report;
    docTitleEl.textContent = doc.name;
    if (docMetaEl) docMetaEl.textContent = doc.size;
    if (docTextEl) docTextEl.innerHTML = doc.previewText;

    if (docInsightsList) {
      docInsightsList.innerHTML = doc.insights.map(point => `
        <div class="analysis-key-point">
          ${point}
        </div>
      `).join('');
    }

    if (docEntitiesWrap) {
      docEntitiesWrap.innerHTML = doc.entities.map(tag => `
        <span class="badge badge-cyan" style="font-size: 0.72rem; padding: 3px 8px;">${tag}</span>
      `).join('');
    }

    // Trigger radar scan line animation
    const scanner = document.querySelector('.doc-scanner-line');
    if (scanner) {
      scanner.style.animation = 'none';
      void scanner.offsetHeight; // reflow
      scanner.style.animation = 'scanLine 2.2s ease-in-out infinite alternate';
    }
  }

  if (docSearchBtn && docSearchInput) {
    docSearchBtn.addEventListener('click', handleDocQuery);
    docSearchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleDocQuery();
      }
    });
  }

  function handleDocQuery() {
    const query = docSearchInput.value.trim();
    if (!query) return;

    if (window.showToast) {
      window.showToast('Document Searched', `Found 3 verified citations matching "${query}" with 99.1% confidence.`, 'info');
    }
    docSearchInput.value = '';
  }
})();
