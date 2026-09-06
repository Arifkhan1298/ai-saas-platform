/* ==========================================================================
   NEXVORA AI - Interactive AI Demo Module
   Simulated AI chat interface with realistic typewriter, presets, copy & regenerate
   ========================================================================== */

(function() {
  'use strict';

  const demoPresets = {
    plan: {
      query: "Turn my ideas into a clear project plan.",
      response: `Here is your structured 4-week execution blueprint generated with Nexvora-Ultra:

1. Phase 1: Architecture & Data Ingestion (Days 1–7)
   • Set up secure vector embeddings pipeline with AES-256 encryption.
   • Establish automated document chunking and metadata tagging.

2. Phase 2: Model Fine-Tuning & Prompt Pipelines (Days 8–16)
   • Deploy customized LLM routing based on query complexity.
   • Implement sub-20ms semantic caching layer for high-frequency queries.

3. Phase 3: Collaborative Workspace & Multi-User Testing (Days 17–24)
   • Launch interactive canvas editor with live co-pilot assistance.
   • Run automated vulnerability checks and SOC2 compliance audits.

4. Phase 4: Production Deployment & Telemetry (Days 25–28)
   • Multi-region edge deployment with automated load balancing.
   • Live telemetry dashboard tracking accuracy, tokens, and latency.

Projected outcome: 40% reduction in production time and 99.4% task completion rate.`
    },
    brief: {
      query: "Draft an executive brief on autonomous agent workflows.",
      response: `Executive Brief: Autonomous Multi-Agent Orchestration

• Strategic Summary:
Modern enterprise productivity is shifting from single-prompt interactions to synchronized agent swarms. NEXVORA autonomously orchestrates research, synthesis, and verification agents in parallel.

• Key Operational Wins:
1. Cycle Time Reduction: Complex document synthesis down from 4.5 hours to 32 seconds.
2. Cross-Verification: Built-in critic models reduce hallucination rates to under 0.18%.
3. Security Parity: Role-based document access ensures sensitive corporate data never leaves your VPC.

Recommendation: Transition Tier-1 analytical workflows to autonomous agents by Q3 2026.`
    },
    finance: {
      query: "Summarize 40-page quarterly report into key risks & metrics.",
      response: `Document Intelligence Audit: Q4 Financial Performance

• Core Financial Highlights:
- Annual Recurring Revenue (ARR): $42.8M (+34.2% YoY)
- Net Retention Rate: 124%
- Operating Margin: Expanded by 480 bps to 22.4%

• Critical Risk Factors Identified:
1. Supply Chain Concentration: 62% of compute hardware sourced from two suppliers.
2. Currency Exposure: $6.4M unhedged foreign exchange volatility across APAC expansion.
3. R&D Capitalization: Increased cloud infrastructure spend ahead of Tier-4 data center launch.

Next Step: Review slide 28 for proposed mitigation hedges.`
    },
    marketing: {
      query: "Generate 5 high-converting marketing hooks for our SaaS launch.",
      response: `High-Conversion Launch Hooks (Tailored for Founders & Engineering Leaders):

1. The Speed Angle:
   "Stop spending 3 hours summarizing reports. Nexvora AI turns 50 pages into actionable decisions in 4 seconds flat."

2. The Architecture Hook:
   "What if your AI workspace actually knew your entire company roadmap? Meet the intelligence layer built for high-growth teams."

3. The Problem/Agitation Hook:
   "You don't need 8 different AI subscriptions. You need one unified cognitive workspace."

4. The ROI Guarantee:
   "Engineers save 9.4 hours every week. Creators ship 3x more content. See the benchmark report."

5. The Future-Proof Angle:
   "Intelligence that moves your ideas forward. From raw thoughts to ship-ready plans in minutes."`
    }
  };

  const promptPills = document.querySelectorAll('.prompt-pill');
  const chatBody = document.getElementById('demo-chat-body');
  const demoInput = document.getElementById('demo-input');
  const demoSendBtn = document.getElementById('demo-send-btn');
  let currentTypingTimeout = null;

  if (!chatBody) return;

  // Initialize with 'plan' preset
  runPrompt('plan');

  promptPills.forEach(pill => {
    pill.addEventListener('click', () => {
      promptPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const key = pill.getAttribute('data-preset');
      runPrompt(key);
    });
  });

  if (demoSendBtn && demoInput) {
    demoSendBtn.addEventListener('click', handleCustomSend);
    demoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCustomSend();
      }
    });
  }

  function handleCustomSend() {
    const text = demoInput.value.trim();
    if (!text) return;
    demoInput.value = '';

    // Clear active preset buttons
    promptPills.forEach(p => p.classList.remove('active'));

    const customData = {
      query: text,
      response: `Analyzed query: "${text}"

Based on your input, NEXVORA AI has processed the request through our semantic workspace pipeline:

• Immediate Action Plan:
1. Clarify core objective and target metrics for "${text.slice(0, 45)}..."
2. Synthesize foundational research and cross-reference verified data sources.
3. Automatically generate draft deliverables with smart markdown formatting.

• Confidence Score: 98.6%
• Recommended Next Step: Export this outline into your active Workspace Project.`
    };

    renderChat(customData.query, customData.response);
  }

  function runPrompt(key) {
    const data = demoPresets[key] || demoPresets.plan;
    renderChat(data.query, data.response);
  }

  function renderChat(userQuery, aiResponse) {
    if (currentTypingTimeout) {
      clearTimeout(currentTypingTimeout);
    }

    // Build chat structure
    chatBody.innerHTML = `
      <!-- User Query -->
      <div class="chat-bubble user-bubble">
        <div class="chat-avatar user">U</div>
        <div class="chat-content-wrap">
          <p>${escapeHtml(userQuery)}</p>
        </div>
      </div>

      <!-- AI Response Container -->
      <div class="chat-bubble ai-bubble">
        <div class="chat-avatar ai">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
          </svg>
        </div>
        <div class="chat-content-wrap" id="ai-response-wrap">
          <div class="thinking-indicator" id="ai-thinking">
            <span>Nexvora Neural Engine processing</span>
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
          <div id="ai-text-container" style="display: none; white-space: pre-wrap;"></div>
          <div class="chat-actions-bar" id="chat-actions" style="display: none;">
            <button class="action-pill-btn" id="btn-copy-response">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              Copy
            </button>
            <button class="action-pill-btn" id="btn-regen-response">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"></polyline>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
              </svg>
              Regenerate
            </button>
            <button class="action-pill-btn" id="btn-like-response" title="Helpful">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    const thinkingEl = document.getElementById('ai-thinking');
    const textContainer = document.getElementById('ai-text-container');
    const actionsBar = document.getElementById('chat-actions');

    // Simulate slight cognitive thinking delay
    currentTypingTimeout = setTimeout(() => {
      if (thinkingEl) thinkingEl.style.display = 'none';
      if (textContainer) {
        textContainer.style.display = 'block';
        typewriter(textContainer, aiResponse, 0, () => {
          if (actionsBar) {
            actionsBar.style.display = 'flex';
            setupResponseActions(userQuery, aiResponse);
          }
        });
      }
    }, 450);
  }

  function typewriter(element, fullText, index, onComplete) {
    // Render in chunks for silky speed
    const step = 4;
    const nextIndex = Math.min(index + step, fullText.length);
    element.innerHTML = escapeHtml(fullText.slice(0, nextIndex)) + '<span class="typing-cursor"></span>';

    if (nextIndex < fullText.length) {
      currentTypingTimeout = setTimeout(() => {
        typewriter(element, fullText, nextIndex, onComplete);
      }, 16);
    } else {
      element.innerHTML = escapeHtml(fullText);
      if (onComplete) onComplete();
    }
  }

  function setupResponseActions(userQuery, responseText) {
    const copyBtn = document.getElementById('btn-copy-response');
    const regenBtn = document.getElementById('btn-regen-response');
    const likeBtn = document.getElementById('btn-like-response');

    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(responseText).then(() => {
          if (window.showToast) {
            window.showToast('Copied to Clipboard!', 'AI response copied to your clipboard.', 'success');
          }
        }).catch(() => {
          if (window.showToast) {
            window.showToast('Copied!', 'Text ready to paste.', 'info');
          }
        });
      });
    }

    if (regenBtn) {
      regenBtn.addEventListener('click', () => {
        renderChat(userQuery, responseText);
        if (window.showToast) {
          window.showToast('Regenerating Response', 'Analyzing with latest parameters...', 'info', 2000);
        }
      });
    }

    if (likeBtn) {
      likeBtn.addEventListener('click', () => {
        likeBtn.style.color = '#10b981';
        if (window.showToast) {
          window.showToast('Feedback Received', 'Thank you for helping train NEXVORA models!', 'success');
        }
      });
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
