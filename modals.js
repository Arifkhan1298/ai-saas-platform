/* ==========================================================================
   NEXVORA AI - Accessible Modals System
   Auth Modals (Sign In / Sign Up) and Dynamic "Try Tool" Interactive Sandbox
   ========================================================================== */

(function() {
  'use strict';

  // Tool definitions for dynamic interactive sandbox
  const toolSandboxConfigs = {
    'writer': {
      title: 'AI Writer Studio',
      badge: 'Content Engine',
      placeholder: 'E.g., Write a persuasive LinkedIn launch announcement for our new AI features...',
      sampleOutput: `🚀 Exciting Announcement: Today, we are unveiling the next evolution of intelligent workspace software!

With NEXVORA AI, we solved the biggest bottlenecks modern teams face: fragmented tools, slow document synthesis, and creative fatigue. 

Key milestones:
✅ 40% faster document authoring
✅ Deep semantic cross-referencing
✅ Enterprise-grade AES-256 data protection

Join over 120,000 creators leading the future of autonomous work. Link in the comments! #AI #Innovation #Productivity`
    },
    'doc-analyzer': {
      title: 'Document Analyzer',
      badge: 'Deep Ingestion',
      placeholder: 'Enter document snippet or question to analyze across pages...',
      sampleOutput: `📊 Synthesis Complete (Analyzed 42 paragraphs in 0.84s):

1. Primary Finding: Operating expenses dropped by 18.2% following AI workflow migration.
2. Compliance Status: All data retention policies comply with SOC2 Type II benchmarks.
3. Actionable Next Step: Execute cross-regional replication before Q3 customer audit.`
    },
    'research': {
      title: 'AI Research Assistant',
      badge: 'Deep Knowledge',
      placeholder: 'Ask any complex research query across academic or corporate papers...',
      sampleOutput: `🔬 Verified Research Dossier:

Topic: Multi-Agent Consensus Mechanisms in Large Language Models
• Consensus Accuracy: 99.4% when combining independent verification nodes.
• Latency Overhead: Capped under 85ms using semantic caching.
• Citations: 4 cross-verified sources tagged in the knowledge graph.`
    },
    'summarizer': {
      title: 'Smart Summarizer',
      badge: 'Concise Synthesis',
      placeholder: 'Paste long text, transcript, or article to distill into key bullet points...',
      sampleOutput: `⚡ Executive 3-Point Summary:

• Point 1: Next-gen AI interfaces must prioritize low latency and contextual workspace memory over isolated chat screens.
• Point 2: Teams using collaborative AI agents achieve 3.4x faster delivery cycles.
• Point 3: Data security and private vector enclaves are non-negotiable for enterprise SaaS.`
    },
    'idea-gen': {
      title: 'Idea Generator',
      badge: 'Creative Brainstorming',
      placeholder: 'Enter a domain, problem statement, or theme to brainstorm concepts...',
      sampleOutput: `💡 3 High-Impact Concepts Generated:

1. 'Semantic Diff Engine': Highlight exact logical deviations between legal contracts automatically.
2. 'Zero-Latency Co-pilot': Predictive sentence completion tuned specifically to your team's tone of voice.
3. 'Autonomous Brief Builder': Turn Slack conversation threads into formal project specifications in one click.`
    },
    'productivity': {
      title: 'AI Productivity Assistant',
      badge: 'Workflow Optimizer',
      placeholder: 'Enter your daily task list or project objectives to optimize schedule...',
      sampleOutput: `🎯 Optimized Daily Execution Matrix:

• 09:00 - 10:30 (Peak Cognitive Band): Architecture review for Q3 data pipeline.
• 11:00 - 11:45: Rapid document approvals (NEXVORA pre-screened).
• 14:00 - 15:30: High-leverage feature implementation.
Estimated time saved today: 2 hours 45 minutes.`
    }
  };

  const authModal = document.getElementById('auth-modal');
  const toolModal = document.getElementById('tool-modal');

  const authModalTitle = document.getElementById('auth-modal-title');
  const authModalSubtitle = document.getElementById('auth-modal-subtitle');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authToggleText = document.getElementById('auth-toggle-prompt');
  const authToggleLink = document.getElementById('auth-toggle-link');
  const signupExtraFields = document.getElementById('signup-extra-fields');

  let currentAuthMode = 'signin'; // 'signin' or 'signup'

  // Open Auth Modal helper
  window.openAuthModal = function(mode = 'signin', plan = '') {
    currentAuthMode = mode;
    if (!authModal) return;

    if (currentAuthMode === 'signup') {
      if (authModalTitle) authModalTitle.textContent = plan ? `Get Started with ${plan}` : 'Create Your NEXVORA Account';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Unlock intelligent workspace features in under 60 seconds.';
      if (authSubmitBtn) authSubmitBtn.textContent = 'Create Free Account →';
      if (authToggleText) authToggleText.textContent = 'Already have an account?';
      if (authToggleLink) authToggleLink.textContent = 'Log In';
      if (signupExtraFields) signupExtraFields.style.display = 'block';
    } else {
      if (authModalTitle) authModalTitle.textContent = 'Welcome Back to NEXVORA';
      if (authModalSubtitle) authModalSubtitle.textContent = 'Enter your credentials to access your intelligent workspace.';
      if (authSubmitBtn) authSubmitBtn.textContent = 'Log In to Workspace →';
      if (authToggleText) authToggleText.textContent = "Don't have an account?";
      if (authToggleLink) authToggleLink.textContent = 'Sign Up for Free';
      if (signupExtraFields) signupExtraFields.style.display = 'none';
    }

    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  // Open Tool Sandbox modal helper
  window.openToolModal = function(toolKey) {
    if (!toolModal) return;
    const config = toolSandboxConfigs[toolKey] || toolSandboxConfigs['writer'];

    const titleEl = document.getElementById('sandbox-tool-title');
    const badgeEl = document.getElementById('sandbox-tool-badge');
    const inputEl = document.getElementById('sandbox-tool-input');
    const outputEl = document.getElementById('sandbox-tool-output');

    if (titleEl) titleEl.textContent = config.title;
    if (badgeEl) badgeEl.textContent = config.badge;
    if (inputEl) {
      inputEl.placeholder = config.placeholder;
      inputEl.value = '';
    }
    if (outputEl) outputEl.innerHTML = `<span style="color: var(--text-dim); font-style: italic;">Your generated results will appear here...</span>`;

    toolModal.setAttribute('data-active-tool', toolKey);
    toolModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeModals = function() {
    if (authModal) authModal.classList.remove('active');
    if (toolModal) toolModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  // Wire Close buttons
  document.querySelectorAll('.modal-close, .modal-backdrop-dismiss').forEach(el => {
    el.addEventListener('click', () => {
      window.closeModals();
    });
  });

  // Close with Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeModals();
    }
  });

  // Toggle between signin / signup inside modal
  if (authToggleLink) {
    authToggleLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.openAuthModal(currentAuthMode === 'signin' ? 'signup' : 'signin');
    });
  }

  // Handle Auth Form Submission
  const authForm = document.getElementById('auth-modal-form');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email')?.value || 'user@nexvora.ai';
      window.closeModals();
      if (window.showToast) {
        if (currentAuthMode === 'signup') {
          window.showToast('Account Created!', `Welcome to NEXVORA AI, ${email.split('@')[0]}!`, 'success');
        } else {
          window.showToast('Welcome Back!', `Logged in successfully as ${email}`, 'success');
        }
      }
    });
  }

  // Social Auth Buttons (Google & GitHub)
  document.querySelectorAll('.social-auth-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.getAttribute('data-provider') || 'Service';
      window.closeModals();
      if (window.showToast) {
        window.showToast('Authentication Verified', `Authenticated successfully via ${provider}!`, 'success');
      }
    });
  });

  // Handle Tool Sandbox Execution
  const runSandboxBtn = document.getElementById('sandbox-run-btn');
  if (runSandboxBtn) {
    runSandboxBtn.addEventListener('click', () => {
      const activeTool = toolModal?.getAttribute('data-active-tool') || 'writer';
      const config = toolSandboxConfigs[activeTool] || toolSandboxConfigs['writer'];
      const outputEl = document.getElementById('sandbox-tool-output');
      const inputEl = document.getElementById('sandbox-tool-input');

      if (outputEl) {
        outputEl.innerHTML = `<div class="thinking-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span> Synthesizing with Nexvora-Ultra engine...</div>`;
        
        setTimeout(() => {
          outputEl.innerHTML = `<div style="white-space: pre-wrap; font-size: 0.9rem; line-height: 1.65; color: var(--text-primary);">${config.sampleOutput}</div>`;
          if (window.showToast) {
            window.showToast('Generation Complete', `${config.title} generated response in 0.42s`, 'success');
          }
        }, 600);
      }
    });
  }

  // Wire buttons across page with data-action="auth"
  document.querySelectorAll('[data-auth-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const mode = btn.getAttribute('data-auth-trigger') || 'signin';
      window.openAuthModal(mode);
    });
  });

  // Wire "Try Tool ->" buttons
  document.querySelectorAll('[data-tool-trigger]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const toolKey = btn.getAttribute('data-tool-trigger');
      window.openToolModal(toolKey);
    });
  });
})();
