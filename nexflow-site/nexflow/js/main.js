/**
 * NEXFLOW — JAVASCRIPT PRINCIPAL
 * Stack: Vanilla JS (sem dependências)
 * - Navegação (sticky + mobile)
 * - Scroll Reveal
 * - FAQ Accordion
 * - Animação painel de solução
 * - Rastreamento de cliques de pagamento
 * - Ano no rodapé
 */

'use strict';

/* ══════════════════════════════════════════
   UTILITÁRIOS
══════════════════════════════════════════ */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

/* ══════════════════════════════════════════
   ANO NO RODAPÉ
══════════════════════════════════════════ */
const yearEl = $('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ══════════════════════════════════════════
   NAVEGAÇÃO — NAVBAR STICKY
══════════════════════════════════════════ */
const navbar = $('.navbar');
if (navbar) {
  const handleNavScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();
}

/* ══════════════════════════════════════════
   MENU MOBILE
══════════════════════════════════════════ */
const menuBtn   = $('#menuBtn');
const menuClose = $('#menuClose');
const mobileNav = $('#mobileNav');
const mobileLinks = $$('.mobile-link');

function openMobileMenu() {
  mobileNav?.classList.add('open');
  mobileNav?.removeAttribute('aria-hidden');
  menuBtn?.classList.add('active');
  menuBtn?.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  mobileNav?.classList.remove('open');
  mobileNav?.setAttribute('aria-hidden', 'true');
  menuBtn?.classList.remove('active');
  menuBtn?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuBtn?.addEventListener('click', openMobileMenu);
menuClose?.addEventListener('click', closeMobileMenu);
mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

// Fechar ao clicar fora
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});

/* ══════════════════════════════════════════
   SCROLL SUAVE — LINKS ÂNCORA
══════════════════════════════════════════ */
$$('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = $(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // altura do navbar
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════════
   SCROLL REVEAL — INTERSECTION OBSERVER
══════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Deixar de observar após revelar (performance)
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

$$('.reveal').forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════
   PAINEL SOLUÇÃO — ANIMAÇÃO DAS LINHAS
══════════════════════════════════════════ */
const solRows = $$('.sol-row');
if (solRows.length) {
  const panelObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        solRows.forEach(row => row.classList.add('visible'));
        panelObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const panel = $('.sol-panel');
  if (panel) panelObserver.observe(panel);
}

/* ══════════════════════════════════════════
   FAQ — ACCORDION ACESSÍVEL
══════════════════════════════════════════ */
$$('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    const answerId = btn.getAttribute('aria-controls');
    const answer = $(`#${answerId}`);

    // Fechar todos os outros
    $$('.faq-q').forEach(otherBtn => {
      if (otherBtn !== btn) {
        otherBtn.setAttribute('aria-expanded', 'false');
        const otherId = otherBtn.getAttribute('aria-controls');
        const otherAnswer = $(`#${otherId}`);
        if (otherAnswer) {
          otherAnswer.hidden = true;
          slideUp(otherAnswer);
        }
      }
    });

    // Alternar actual
    if (expanded) {
      btn.setAttribute('aria-expanded', 'false');
      if (answer) {
        slideUp(answer);
        setTimeout(() => { answer.hidden = true; }, 300);
      }
    } else {
      btn.setAttribute('aria-expanded', 'true');
      if (answer) {
        answer.hidden = false;
        slideDown(answer);
      }
    }
  });
});

function slideDown(el) {
  el.style.maxHeight = '0';
  el.style.overflow = 'hidden';
  el.style.transition = 'max-height 0.3s ease';
  requestAnimationFrame(() => {
    el.style.maxHeight = el.scrollHeight + 'px';
  });
}

function slideUp(el) {
  el.style.maxHeight = el.scrollHeight + 'px';
  el.style.transition = 'max-height 0.3s ease';
  requestAnimationFrame(() => {
    el.style.maxHeight = '0';
  });
}

/* ══════════════════════════════════════════
   BOTÕES DE PAGAMENTO — RASTREAMENTO & UX
══════════════════════════════════════════ */
$$('.btn-pay').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const plan  = btn.dataset.plan  || 'Desconhecido';
    const price = btn.dataset.price || '0';

    // Rastreamento (Google Analytics / GTM se disponível)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'begin_checkout', {
        currency: 'MZN',
        value: parseFloat(price),
        items: [{ item_name: `NexFlow Plano ${plan}`, price: parseFloat(price) }]
      });
    }

    // Rastreamento via dataLayer (GTM)
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({
        event: 'payment_click',
        plan: plan,
        price: price,
        currency: 'MZN'
      });
    }

    // Log simples para depuração
    console.log(`[NexFlow] Pagamento iniciado: Plano ${plan} — MT ${price}`);

    // Feedback visual no botão
    const originalText = btn.innerHTML;
    btn.innerHTML = `<span>⏳</span> A redirecionar para Zenofy...`;
    btn.style.pointerEvents = 'none';

    // Restaurar após 3s (caso o utilizador volte)
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.pointerEvents = '';
    }, 3000);
  });
});

/* ══════════════════════════════════════════
   CONTADOR ANIMADO — TRUST METRICS
══════════════════════════════════════════ */
function animateCounter(el, target, duration = 1600) {
  const start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

// Observar e animar quando visível
const trustItems = $$('.trust-item strong');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.replace(/[^0-9]/g, '');
      if (raw) {
        const suffix = el.textContent.replace(/[0-9.]/g, '');
        const target = parseInt(raw, 10);
        animateCounter(el, target);
        // Re-adicionar sufixo após animação
        setTimeout(() => {
          el.textContent = target + suffix;
        }, 1700);
      }
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.8 });

trustItems.forEach(el => counterObserver.observe(el));

/* ══════════════════════════════════════════
   DESTAQUE DE ITEM DE NAV ACTIVO
══════════════════════════════════════════ */
const sections = $$('section[id]');
const navLinks = $$('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href')?.replace('#', '');
        link.style.color = href === id ? 'var(--green)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

/* ══════════════════════════════════════════
   NÓS FLUTUANTES — ATRASAR ANIMAÇÃO
══════════════════════════════════════════ */
$$('.float-node').forEach((node, i) => {
  node.style.animationDelay = `${i * 0.3}s`;
});

/* ══════════════════════════════════════════
   SCHEMA DINÂMICO — PREÇOS
   (Actualiza schema se preços mudarem via CMS)
══════════════════════════════════════════ */
// Esta função pode ser chamada de um CMS headless
// para actualizar os preços dinamicamente
window.NexFlow = {
  updatePrices: function(plans) {
    plans.forEach(plan => {
      const cards = $$('.price-card');
      cards.forEach(card => {
        const nameEl = card.querySelector('.price-name');
        if (nameEl && nameEl.textContent.toLowerCase() === plan.name.toLowerCase()) {
          const amountEl = card.querySelector('.amount');
          if (amountEl) amountEl.textContent = plan.price.toLocaleString('pt-MZ');
          const btnEl = card.querySelector('.btn-pay');
          if (btnEl) {
            btnEl.dataset.price = plan.price;
            btnEl.href = plan.paymentUrl;
          }
        }
      });
    });
  }
};

/* ══════════════════════════════════════════
   PERFORMANCE — LAZY LOAD IMAGENS
══════════════════════════════════════════ */
if ('loading' in HTMLImageElement.prototype) {
  $$('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  // Fallback para navegadores mais antigos
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imgObserver.unobserve(img);
      }
    });
  });
  $$('img[data-src]').forEach(img => imgObserver.observe(img));
}

/* ══════════════════════════════════════════
   ACESSIBILIDADE — SKIP TO MAIN
══════════════════════════════════════════ */
// Adicionar link "saltar para conteúdo" se não existir
if (!$('.skip-link')) {
  const skip = document.createElement('a');
  skip.href = '#inicio';
  skip.className = 'skip-link';
  skip.textContent = 'Saltar para o conteúdo principal';
  skip.style.cssText = `
    position:fixed;top:-100px;left:16px;z-index:9999;
    background:var(--green);color:#000;padding:8px 16px;border-radius:8px;
    font-weight:700;transition:top .2s;
  `;
  skip.addEventListener('focus', () => skip.style.top = '16px');
  skip.addEventListener('blur',  () => skip.style.top = '-100px');
  document.body.prepend(skip);
}

console.log('%c⚡ NexFlow Moçambique', 'color:#00ff88;font-weight:bold;font-size:16px;');
console.log('%cSistemas de automação inteligente — nexflow.co.mz', 'color:#94a3b8;');
