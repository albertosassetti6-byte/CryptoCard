/* =========================================================
   CRYPTOCARD · script.js
   100% fictional data — educational purposes only
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     1) THE 10 CRYPTOCURRENCIES (each with its own expiry)
     --------------------------------------------------------- */
  const CRYPTOS = [
    { id: 'btc',  name: 'Bitcoin',   symbol: 'BTC',  glyph: '₿', color: '#F7931A', expiry: '08/29', network: 'Bitcoin Network',   balance: '0.8421 BTC'    },
    { id: 'eth',  name: 'Ethereum',  symbol: 'ETH',  glyph: 'Ξ', color: '#627EEA', expiry: '11/28', network: 'Ethereum Mainnet',  balance: '4.2170 ETH'    },
    { id: 'sol',  name: 'Solana',    symbol: 'SOL',  glyph: '◎', color: '#14F195', expiry: '03/30', network: 'Solana Mainnet',    balance: '128.45 SOL'    },
    { id: 'bnb',  name: 'BNB',       symbol: 'BNB',  glyph: '⬢', color: '#F3BA2F', expiry: '05/29', network: 'BNB Chain',         balance: '12.300 BNB'    },
    { id: 'ada',  name: 'Cardano',   symbol: 'ADA',  glyph: '₳', color: '#2A6AF5', expiry: '09/27', network: 'Cardano Network',   balance: '3,420.00 ADA'  },
    { id: 'xrp',  name: 'XRP',       symbol: 'XRP',  glyph: '✕', color: '#25A2D4', expiry: '01/31', network: 'XRP Ledger',        balance: '1,850.00 XRP'  },
    { id: 'dot',  name: 'Polkadot',  symbol: 'DOT',  glyph: '●', color: '#E6007A', expiry: '07/28', network: 'Polkadot Relay',    balance: '215.60 DOT'    },
    { id: 'doge', name: 'Dogecoin',  symbol: 'DOGE', glyph: 'Ð', color: '#C2A633', expiry: '12/27', network: 'Dogecoin Network',  balance: '9,800.00 DOGE' },
    { id: 'avax', name: 'Avalanche', symbol: 'AVAX', glyph: '▲', color: '#E84142', expiry: '04/30', network: 'Avalanche C-Chain', balance: '86.40 AVAX'    },
    { id: 'link', name: 'Chainlink', symbol: 'LINK', glyph: '⬡', color: '#2A5ADA', expiry: '06/29', network: 'Ethereum Mainnet',  balance: '310.75 LINK'   }
  ];

  const NAMES = ['JOHN DOE', 'JANE SMITH', 'ALEX MORGAN', 'CHRIS EVANS', 'MIA WALKER', 'NOAH BENNETT'];

  /* ---------------------------------------------------------
     2) DOM REFERENCES
     --------------------------------------------------------- */
  const el = {
    /* nav */
    nav:         document.getElementById('nav'),
    navToggle:   document.getElementById('navToggle'),
    navLinks:    document.getElementById('navLinks'),

    /* card */
    card:        document.getElementById('card'),
    cardInner:   document.getElementById('cardInner'),
    cardFront:   document.getElementById('cardFront'),
    cardBack:    document.getElementById('cardBack'),
    number:      document.getElementById('cardNumber'),
    holder:      document.getElementById('cardHolder'),
    expiry:      document.getElementById('cardExpiry'),
    cvv:         document.getElementById('cardCvv'),
    cryptoGlyph: document.getElementById('cryptoGlyph'),
    cryptoName:  document.getElementById('cryptoName'),
    cryptoDot:   document.getElementById('cryptoDot'),

    /* panel */
    grid:        document.getElementById('cryptoGrid'),
    holderInput: document.getElementById('holderInput'),
    generateBtn: document.getElementById('generateBtn'),
    flipBtn:     document.getElementById('flipBtn'),
    copyBtn:     document.getElementById('copyBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    balance:     document.getElementById('balance'),
    network:     document.getElementById('network'),

    /* contact form */
    contactForm:    document.getElementById('contactForm'),
    contactName:    document.getElementById('contactName'),
    contactEmail:   document.getElementById('contactEmail'),
    contactMessage: document.getElementById('contactMessage'),

    /* misc */
    toast: document.getElementById('toast'),
    year:  document.getElementById('year')
  };

  /* ---------------------------------------------------------
     3) STATE
     --------------------------------------------------------- */
  const state = {
    crypto: CRYPTOS[0],
    theme: 'gold',
    number: '0000 0000 0000 0000',
    flipped: false,
    timer: null
  };

  /* ---------------------------------------------------------
     4) UTILITIES
     --------------------------------------------------------- */
  const randomDigits = (n) => {
    let s = '';
    for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10);
    return s;
  };

  const groupNumber = (digits) => digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  const randomItem  = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function showToast(message) {
    el.toast.textContent = message;
    el.toast.classList.add('show');
    clearTimeout(el.toast._t);
    el.toast._t = setTimeout(() => el.toast.classList.remove('show'), 2200);
  }

  /* ---------------------------------------------------------
     5) CRYPTO GRID
     --------------------------------------------------------- */
  function renderCryptoGrid() {
    el.grid.innerHTML = CRYPTOS.map((c) => `
      <button class="crypto-btn${c.id === state.crypto.id ? ' active' : ''}"
              type="button"
              data-id="${c.id}"
              style="--c:${c.color}"
              aria-pressed="${c.id === state.crypto.id}">
        <span class="glyph">${c.glyph}</span>
        <span class="crypto-meta">
          <strong>${c.name}</strong>
          <small>${c.symbol}</small>
        </span>
      </button>
    `).join('');
  }

  /* ---------------------------------------------------------
     6) CARD UPDATE
     --------------------------------------------------------- */
  function updateCard() {
    const c = state.crypto;

    el.cryptoGlyph.textContent = c.glyph;
    el.cryptoName.textContent  = c.name;
    el.cryptoDot.style.background = c.color;
    el.cryptoDot.style.color = c.color;

    el.expiry.textContent  = c.expiry;
    el.network.textContent = c.network;
    el.balance.textContent = c.balance;
  }

  function updateHolder() {
    const raw = el.holderInput.value.trim();
    el.holder.textContent = raw ? raw.toUpperCase() : randomItem(NAMES);
  }

  /* ---------------------------------------------------------
     7) NUMBER GENERATION (scramble animation)
     --------------------------------------------------------- */
  function generateNumber() {
    const digits = '4' + randomDigits(15);
    const formatted = groupNumber(digits);

    state.number = formatted;
    el.cvv.textContent = String(Math.floor(Math.random() * 900) + 100);

    clearInterval(state.timer);

    let frame = 0;
    const totalFrames = 11;

    el.number.classList.add('scrambling');

    state.timer = setInterval(() => {
      frame++;

      if (frame >= totalFrames) {
        clearInterval(state.timer);
        el.number.textContent = formatted;
        el.number.classList.remove('scrambling');
        return;
      }

      let fake = '';
      for (let i = 0; i < 19; i++) {
        fake += (i % 5 === 4) ? ' ' : Math.floor(Math.random() * 10);
      }
      el.number.textContent = fake;
    }, 42);
  }

  /* ---------------------------------------------------------
     8) COLOR THEME
     --------------------------------------------------------- */
  function setTheme(theme) {
    state.theme = theme;

    el.cardFront.classList.remove('theme-gold', 'theme-silver');
    el.cardBack.classList.remove('theme-gold', 'theme-silver');
    el.cardFront.classList.add('theme-' + theme);
    el.cardBack.classList.add('theme-' + theme);

    document.querySelectorAll('.swatch').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  /* ---------------------------------------------------------
     9) FLIP (fixed & robust)
     --------------------------------------------------------- */
  function flipCard() {
    state.flipped = !state.flipped;
    el.card.classList.toggle('flipped', state.flipped);
    updateFlipLabel();
  }

  function updateFlipLabel() {
    el.flipBtn.textContent = state.flipped ? '⟲ Show front' : '⟲ Show back';
  }

  /* ---------------------------------------------------------
     10) COPY TO CLIPBOARD
     --------------------------------------------------------- */
  function copyNumber() {
    const raw = state.number.replace(/\s/g, '');
    const done = () => showToast('Number copied: ' + state.number);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(raw).then(done).catch(() => showToast('Copy not available'));
    } else {
      const ta = document.createElement('textarea');
      ta.value = raw;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); done(); }
      catch (e) { showToast('Copy not available'); }
      document.body.removeChild(ta);
    }
  }

  /* ---------------------------------------------------------
     11) DOWNLOAD IMAGE (html2canvas)
     --------------------------------------------------------- */
  async function downloadCard() {
    if (typeof html2canvas === 'undefined') {
      showToast('Library not available. Please try again.');
      return;
    }

    const btn = el.downloadBtn;
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '⏳ Rendering...';
    btn.disabled = true;

    const captureBack = state.flipped;

    /* Save current inline styles */
    const saved = {
      innerTransform:  el.cardInner.style.transform,
      innerTransition: el.cardInner.style.transition,
      frontVis:        el.cardFront.style.visibility,
      backVis:         el.cardBack.style.visibility,
      backTransform:   el.cardBack.style.transform
    };

    /* Prepare the DOM for capture:
       1) remove the 3D perspective
       2) hide the unwanted face
       3) remove the back pre-rotation (when capturing the back) */
    el.cardInner.style.transition = 'none';
    el.cardInner.style.transform  = 'none';

    if (captureBack) {
      el.cardFront.style.visibility = 'hidden';
      el.cardBack.style.transform   = 'none';
    } else {
      el.cardBack.style.visibility = 'hidden';
    }

    /* Force reflow */
    void el.card.offsetHeight;

    try {
      const canvas = await html2canvas(el.card, {
        backgroundColor: null,
        scale: 3,
        logging: false,
        useCORS: true
      });

      const face = captureBack ? 'back' : 'front';
      const filename = `cryptocard-${state.crypto.id}-${face}.png`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Image saved! 📥 (' + face + ')');
    } catch (err) {
      console.error('Download error:', err);
      showToast('Error while saving the image');
    } finally {
      /* Restore styles */
      el.cardInner.style.transform  = saved.innerTransform;
      el.cardInner.style.transition = saved.innerTransition;
      el.cardFront.style.visibility = saved.frontVis;
      el.cardBack.style.visibility  = saved.backVis;
      el.cardBack.style.transform   = saved.backTransform;

      btn.innerHTML = originalHTML;
      btn.disabled = false;
    }
  }

  /* ---------------------------------------------------------
     12) NAVBAR (mobile toggle + active link + smooth scroll)
     --------------------------------------------------------- */
  function initNav() {
    /* Hamburger toggle */
    el.navToggle.addEventListener('click', () => {
      const open = el.navLinks.classList.toggle('open');
      el.navToggle.classList.toggle('open', open);
      el.navToggle.setAttribute('aria-expanded', String(open));
    });

    /* Close mobile menu when a link is clicked */
    el.navLinks.addEventListener('click', (e) => {
      if (e.target.closest('.nav-link')) {
        el.navLinks.classList.remove('open');
        el.navToggle.classList.remove('open');
        el.navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    /* Close mobile menu on outside click */
    document.addEventListener('click', (e) => {
      if (!el.nav.contains(e.target)) {
        el.navLinks.classList.remove('open');
        el.navToggle.classList.remove('open');
        el.navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    /* Active link highlighting while scrolling */
    const sections = ['home', 'about', 'contacts', 'faq']
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const links = Array.from(document.querySelectorAll('.nav-link'));

    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          links.forEach((link) => {
            const isActive = link.getAttribute('href') === '#' + entry.target.id;
            link.classList.toggle('active', isActive);
          });
        });
      }, {
        rootMargin: '-45% 0px -50% 0px',
        threshold: 0
      });

      sections.forEach((section) => observer.observe(section));
    }
  }

  /* ---------------------------------------------------------
     13) CONTACT FORM (demo only)
     --------------------------------------------------------- */
  function initContactForm() {
    el.contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name    = el.contactName.value.trim();
      const email   = el.contactEmail.value.trim();
      const message = el.contactMessage.value.trim();

      if (!name || !email || !message) {
        showToast('Please fill in every field.');
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showToast('Please enter a valid email address.');
        return;
      }

      /* Demo only — nothing is actually sent */
      showToast('Thanks, ' + name + '! This is a demo — no message was sent.');
      el.contactForm.reset();
    });
  }

  /* ---------------------------------------------------------
     14) EVENTS
     --------------------------------------------------------- */
  function bindEvents() {
    /* Crypto selection (event delegation) */
    el.grid.addEventListener('click', (e) => {
      const btn = e.target.closest('.crypto-btn');
      if (!btn) return;

      const found = CRYPTOS.find((c) => c.id === btn.dataset.id);
      if (!found || found.id === state.crypto.id) return;

      state.crypto = found;
      renderCryptoGrid();
      updateCard();
      generateNumber();
      showToast(found.name + ' selected');
    });

    /* Generate new card */
    el.generateBtn.addEventListener('click', () => {
      generateNumber();
      updateHolder();
      showToast('New card generated ⚡');
    });

    /* Holder name */
    el.holderInput.addEventListener('input', updateHolder);

    /* Flip — click on the card */
    el.card.addEventListener('click', () => flipCard());
    el.card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flipCard();
      }
    });

    /* Flip — button */
    el.flipBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      flipCard();
    });

    /* Copy */
    el.copyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      copyNumber();
    });

    /* Download */
    el.downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      downloadCard();
    });

    /* Theme swatches */
    document.querySelectorAll('.swatch').forEach((btn) => {
      btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });
  }

  /* ---------------------------------------------------------
     15) INIT
     --------------------------------------------------------- */
  function init() {
    /* Footer year */
    if (el.year) el.year.textContent = new Date().getFullYear();

    renderCryptoGrid();
    updateCard();
    setTheme('gold');
    updateFlipLabel();

    initNav();
    bindEvents();
    initContactForm();

    /* First card, generated automatically */
    el.holderInput.value = randomItem(NAMES);
    updateHolder();
    generateNumber();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
