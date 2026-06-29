/* ═══════════════════════════════════════════════════════════════
   VULCAN X — JAVASCRIPT ENGINE
   Módulos: Lenis · Cursor · Preloader · Hero Entrance ·
            Video Travel (Hero→S01) · Video Scrub (S02) ·
            Unboxing (S03) · Configurador (S04) · Misc
   ═══════════════════════════════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger, Flip);

/* ─────────────────────────────────────────────────────────────
   CONFIGURAÇÃO CENTRALIZADA
   ───────────────────────────────────────────────────────────── */
const CONFIG = {
  lenis: { lerp: 0.08, smoothWheel: true },
  cursor: { ringEasing: 0.1, growClass: 'cursor-grow' },
  preloader: { durationClip: 1.4, delayClip: 0.3 },
  heroEntrance: {
    titleDuration: 1.2,
    subDuration: 1,
    scrollDuration: 0.8,
  },
  videoTravel: { flipDuration: 0.9, easeDefault: 'power4.inOut' },
};

/* ─────────────────────────────────────────────────────────────
   MÓDULO A — LENIS SMOOTH SCROLL
   Integração com ScrollTrigger para que o scrub seja fluido
   ───────────────────────────────────────────────────────────── */
let lenis;
try {
  lenis = new Lenis({
    lerp: CONFIG.lenis.lerp,
    smoothWheel: CONFIG.lenis.smoothWheel,
    infinite: false,
  });

  window.__mobileSkipFly = false; // Garante que a animação ocorra em todos os dispositivos
  
  // Conecta Lenis ao RAF do GSAP
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  
  // Conecta Lenis ao ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
} catch (e) {
  console.error('Erro ao inicializar Lenis:', e);
}
 
/* ─────────────────────────────────────────────────────────────
   MÓDULO B — CURSOR MAGNÉTICO
   ───────────────────────────────────────────────────────────── */
const curDot  = document.getElementById('cur-dot');
const curRing = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
 
try {
  document.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (curDot) gsap.set(curDot, { x: mx, y: my });
  });
  
  // Ring segue com easing suave
  (function ringLoop() {
    rx += (mx - rx) * CONFIG.cursor.ringEasing;
    ry += (my - ry) * CONFIG.cursor.ringEasing;
    if (curRing) gsap.set(curRing, { x: rx, y: ry });
    requestAnimationFrame(ringLoop);
  })();
  
  // Grow on interactive elements
  document.querySelectorAll('a, button, .cfg-btn, .spec-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add(CONFIG.cursor.growClass));
    el.addEventListener('mouseleave', () => document.body.classList.remove(CONFIG.cursor.growClass));
  });
  
  document.addEventListener('mouseleave', () => gsap.to([curDot, curRing], { opacity: 0, duration: .3 }));
  document.addEventListener('mouseenter', () => gsap.to([curDot, curRing], { opacity: 1, duration: .3 }));
} catch (e) {
  console.error('Erro ao inicializar cursor:', e);
}
 
/* ─────────────────────────────────────────────────────────────
   MÓDULO C — PRELOADER
   Animação de loading com clip-path reveal
   ───────────────────────────────────────────────────────────── */
const PreloaderModule = (() => {
  const el     = document.getElementById('preloader');
  const pctEl  = document.getElementById('pre-pct');
  const bar    = document.querySelector('.pre-line::after'); // via JS pseudo não funciona — usamos elemento
  const line   = document.querySelector('.pre-line');
  const word   = document.querySelector('.pre-wordmark span');
  let pct = 0;
  let raf;
 
  function tick() {
    pct += Math.random() * 3.5 + 0.5;
    if (pct >= 100) { pct = 100; done(); return; }
 
    if (pctEl) pctEl.textContent = Math.floor(pct) + '%';
    if (line) {
      line.style.setProperty('--prog', (pct / 100));
      const progDiv = line.querySelector('div');
      if (progDiv) progDiv.style.width = pct + '%';
    }
 
    raf = setTimeout(tick, 35 + Math.random() * 25);
  }
 
  function done() {
    if (pctEl) pctEl.textContent = '100%';
    const progDiv = line?.querySelector('div');
    if (progDiv) progDiv.style.width = '100%';
 
    const tl = gsap.timeline({ onComplete: () => {
      if (el) el.style.display = 'none';
      HeroEntranceModule.play();
    }});
 
    // Clip-path fechando pra cima (reveal cinematográfico)
    tl.to(el, {
      clipPath: 'polygon(0 0,100% 0,100% 0%,0 0%)',
      duration: CONFIG.preloader.durationClip,
      ease: 'power4.inOut',
      delay: CONFIG.preloader.delayClip,
    });
  }
 
  return {
    init() {
      try {
        if (line) line.innerHTML = '<div style="height:100%;background:#fff;width:0%;transition:width .1s"></div>';
        if (word) gsap.to(word, { y: 0, duration: 1, ease: 'power4.out', delay: .1 });
        setTimeout(tick, 300);
      } catch (e) {
        console.error('Erro ao inicializar preloader:', e);
      }
    }
  };
})();
 
/* ─────────────────────────────────────────────────────────────
   MÓDULO D — HERO ENTRANCE
   Título, sub, HUDs aparecem após preloader
   ───────────────────────────────────────────────────────────── */
const HeroEntranceModule = (() => ({
  play() {
    try {
      const tl = gsap.timeline();
   
      // Título — linhas de baixo pra cima
      tl.to(['#t1','#t2','#t3'], {
        y: 0,
        stagger: .1,
        duration: CONFIG.heroEntrance.titleDuration,
        ease: 'power4.out',
      }, 0)
      .to('#hero-sub-txt', {
        y: 0, opacity: 1,
        duration: CONFIG.heroEntrance.subDuration,
        ease: 'power3.out',
      }, .3)
      .to('#scroll-ind', {
        opacity: 1, y: 0,
        duration: CONFIG.heroEntrance.scrollDuration,
        ease: 'power3.out',
      }, .5)
      .to(['#hud-tl','#hud-tr'], {
        opacity: 1, y: 0,
        stagger: .1,
        duration: .7,
        ease: 'power3.out',
      }, .4);
    } catch (e) {
      console.error('Erro ao animar hero entrance:', e);
    }
  }
}))();
 
/* ─────────────────────────────────────────────────────────────
   MÓDULO E — VIDEO TRAVEL  (reescrito — técnica definitiva)
   ═══════════════════════════════════════════════════════════════
 
   ARQUITETURA DA ANIMAÇÃO
   ────────────────────────
   Ponto A: #vid-container — position:absolute, ocupa 100vw × 100vh
            dentro do #hero (background fullscreen).
 
   Ponto B: #vid-anchor — div estática no layout da Seção 01.
 
   TÉCNICA — 3 fases encadeadas sem saltos:
 
   FASE 1 — DESPRENDIMENTO (scroll do bridge, scrub)
     • #hero-content e HUDs somem
     • #vid-container muda para position:fixed (sai do fluxo do hero)
     • Anima de inset:0 (fullscreen) → rect intermediário centralizado
     • Tudo scrubbed suavemente pelo scroll
 
   FASE 2 — VÔO LIVRE (continua o scrub)
     • O elemento fixed voa em direção à posição do anchor
     • Calculamos rect do anchor dinamicamente
     • Interpolamos via GSAP keyframes no scrub
 
   FASE 3 — POUSO com GSAP Flip (quando scroll para)
     • No momento exato em que o anchor entra em viewport:
       1. Flip.getState() snapshot da posição fixed atual
       2. Movemos o #vid-container para dentro do #vid-anchor no DOM
       3. Resetamos estilos → ele assume tamanho do anchor
       4. Flip.from() anima da snapshot até a posição final
     • Resultado: transição física perfeita sem cortes
 
   ────────────────────────────────────────────────────────────── */
const VideoTravelModule = (() => {
 
  /* ════════════════════════════════════════════════════════════
     MÁQUINA DE ESTADOS — Video Travel Bidirecional
     ════════════════════════════════════════════════════════════
 
     STATES:
       'hero'     → vídeo é position:absolute dentro do #hero (fullscreen)
       'flying'   → vídeo é position:fixed no <body>, movendo pelo scrub
       'landing'  → Flip em andamento (hero→anchor ou anchor→hero)
       'landed'   → vídeo está dentro do #vid-anchor, S01 ativa
 
     FLUXO PARA FRENTE  (scroll ↓):
       hero → [onEnter bridge] → flying → [p≥0.97] → landing → landed
 
     FLUXO REVERSO  (scroll ↑):
       landed → [onEnterBack bridge] → unland (Flip anchor→fixed)
              → flying reverso → [onLeaveBack bridge] → hero
 
     Cada transição de DOM é feita com Flip.getState() imediatamente
     antes de mover o elemento, garantindo zero salto visual.
     ════════════════════════════════════════════════════════════ */
 
  // ── Referências DOM ────────────────────────────────────────
  const vidCont    = document.getElementById('vid-container');
  const anchor     = document.getElementById('vid-anchor');
  const ancImg     = document.getElementById('anchor-img');
  const heroEl     = document.getElementById('hero');
  const overlayEl  = document.getElementById('hero-overlay');
  const contentEl  = document.getElementById('hero-content');
  const bridge     = document.getElementById('bridge');
 
  // ── Estado global ──────────────────────────────────────────
  let phase = 'hero';  // 'hero' | 'flying' | 'landing' | 'landed'
 
  // ── Helper: lerp puro ──────────────────────────────────────
  const lerp = (a, b, t) => a + (b - a) * t;
 
  // ── Helper: eases em JS ────────────────────────────────────
  const easeOut3 = (t) => 1 - Math.pow(1 - t, 3);   // power3.out
  const easeIn3  = (t) => t * t * t;                  // power3.in
 
  /* ── detachToFixed ──────────────────────────────────────────
     Congela rect atual e muda para fixed sem salto visual.
     O elemento sai do hero e vai para o <body>.
  ─────────────────────────────────────────────────────────── */
  function detachToFixed() {
    const r = vidCont.getBoundingClientRect();
    gsap.set(vidCont, {
      position: 'fixed',
      top: r.top, left: r.left,
      width: r.width, height: r.height,
      margin: 0, zIndex: 400,
      borderRadius: 0, boxShadow: 'none',
    });
    document.body.appendChild(vidCont);
  }
 
  /* ── attachToHero ───────────────────────────────────────────
     Re-insere o vidCont dentro do hero sem salto (Flip).
     Chamado quando o usuário volta antes ou depois do pouso.
  ─────────────────────────────────────────────────────────── */
  function attachToHero(instantReset) {
    if (instantReset) {
      // Sem animação — volta direto (usado quando já está no hero)
      heroEl.insertBefore(vidCont, overlayEl);
      gsap.set(vidCont, {
        clearProps: 'position,top,left,width,height,zIndex,margin,borderRadius,boxShadow,opacity',
      });
      gsap.set(vidCont, { position: 'absolute', inset: 0 });
      return;
    }
 
    // Com Flip — snapshot antes de mover
    const state = Flip.getState(vidCont, { props: 'borderRadius,boxShadow,opacity' });
 
    heroEl.insertBefore(vidCont, overlayEl);
    gsap.set(vidCont, {
      clearProps: 'position,top,left,width,height,zIndex,margin,borderRadius,boxShadow,opacity',
    });
    gsap.set(vidCont, { position: 'absolute', inset: 0 });
 
    Flip.from(state, {
      duration: 0.9,
      ease: 'power4.inOut',
      absolute: true,
      onComplete() {
        gsap.set(vidCont, { clearProps: 'all' });
        gsap.set(vidCont, { position: 'absolute', inset: 0 });
      },
    });
  }
 
  /* ── applyFlyPosition ───────────────────────────────────────
     Calcula e aplica a posição do vidCont em vôo para o progresso p.
     Chamado a cada frame do onUpdate enquanto phase==='flying'.
     Bidirecional: p vai de 0→1 (ida) ou 1→0 (volta).
  ─────────────────────────────────────────────────────────── */
  function applyFlyPosition(p) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetR = anchor.getBoundingClientRect();
 
    // ── Keyframes do vôo ────────────────────────────────────
    // A (p=0): fullscreen background
    const aW = vw,  aH = vh,  aT = 0, aL = 0;
 
    // M (p=0.45): card flutuante, levemente deslocado para a
    //   direita em direção ao anchor — cria arco natural
    const anchorCX = targetR.left + targetR.width  / 2;
    const anchorCY = targetR.top  + targetR.height / 2;
    const mW = Math.min(vw * 0.48, 760);
    const mH = mW * (9/16);
    // Centro M interpolado em direção ao anchor
    const mCX = lerp(vw * 0.5, anchorCX, 0.3);
    const mCY = lerp(vh * 0.5, anchorCY, 0.2);
    const mT  = mCY - mH / 2;
    const mL  = mCX - mW / 2;
 
    // B (p=1): exatamente sobre o anchor
    const bW = targetR.width, bH = targetR.height;
    const bT = targetR.top,   bL = targetR.left;
 
    let W, H, T, L, br, sh, opacity;
 
    // ── Segmento 1: A → M  (0 → 0.48) — desprendimento suave
    if (p <= 0.48) {
      const t = easeOut3(p / 0.48);
      W  = lerp(aW, mW, t);
      H  = lerp(aH, mH, t);
      T  = lerp(aT, mT, t);
      L  = lerp(aL, mL, t);
      br = lerp(0, 10, t);
      sh = `0 ${lerp(0, 50, t)}px ${lerp(0, 100, t)}px rgba(0,0,0,${lerp(0, .8, t)})`;
      opacity = 1;
 
    // ── Segmento 2: M → B  (0.48 → 1.0) — pouso preciso
    } else {
      const t = (p - 0.48) / 0.52; // Garante chegada precisa ao Ponto B em p=1
      W  = lerp(mW, bW, t);
      H  = lerp(mH, bH, t);
      T  = lerp(mT, bT, t);
      L  = lerp(mL, bL, t);
      br = lerp(10, 3, t);
      sh = `0 ${lerp(50, 12, t)}px ${lerp(100, 30, t)}px rgba(0,0,0,${lerp(.8, .25, t)})`;
      opacity = 1;
    }
 
    gsap.set(vidCont, { top: T, left: L, width: W, height: H,
      borderRadius: br + 'px', boxShadow: sh, opacity });
 
    // ── Fade hero-content: some nos primeiros 22% do progresso
    gsap.set([contentEl, '#hud-tl', '#hud-tr'], {
      opacity: Math.max(0, 1 - p / 0.22),
    });
    // ── Overlay some um pouco depois
    gsap.set(overlayEl, {
      opacity: Math.max(0, 1 - p / 0.36),
    });
  }
 
  /* ── landOnAnchor ───────────────────────────────────────────
     FASE 3 FORWARD: pouso com GSAP Flip (fixed → dentro do anchor).
  ─────────────────────────────────────────────────────────── */
  function landOnAnchor() {
    if (phase !== 'landing') return;

    anchor.appendChild(vidCont);
    anchor.style.opacity = '1';

    gsap.set(vidCont, {
      clearProps: 'all',
      position: 'absolute', inset: 0, width: '100%', height: '100%'
    });

    if (ancImg) gsap.set(ancImg, { display: 'none' });
    phase = 'landed';
    animateS01Forward();
  }
 
  /* ── unlandFromAnchor ───────────────────────────────────────
     FASE 3 REVERSA: quando o usuário rola para cima com phase='landed'.
     Faz o vídeo sair do anchor, virar fixed e continuar o scrub reverso.
  ─────────────────────────────────────────────────────────── */
  function unlandFromAnchor() {
    if (phase !== 'landed') return;
    phase = 'landing'; // bloqueia re-entradas
 
    // Restaura placeholder do anchor
    if (ancImg) gsap.set(ancImg, { display: 'block' });
    reverseS01();

    const anchorR = anchor.getBoundingClientRect();
    document.body.appendChild(vidCont);
    anchor.style.opacity = '0';

    gsap.set(vidCont, {
      position: 'fixed',
      top: anchorR.top, left: anchorR.left,
      width: anchorR.width, height: anchorR.height,
      zIndex: 400, margin: 0, borderRadius: '3px'
    });

    phase = 'flying';
  }
 
  /* ── animateS01Forward / reverseS01 ─────────────────────────
     Elementos da S01: surgem no pouso, somem ao retornar.
  ─────────────────────────────────────────────────────────── */
  function animateS01Forward() {
    gsap.timeline()
      .to('.reveal-line span',  { y: 0, stagger: .08, duration: .9, ease: 'power4.out' })
      .to('.spec-card',         { opacity: 1, y: 0, stagger: .07, duration: .7, ease: 'power3.out' }, .15)
      .to('.float-tag',         { opacity: 1, x: 0, stagger: .1,  duration: .7, ease: 'power3.out' }, .25);
 
    document.querySelectorAll('.spec-bar-fill').forEach(bar => {
      const w = getComputedStyle(bar).getPropertyValue('--w') || '90%';
      gsap.to(bar, { width: w, duration: 1.2, ease: 'power3.out', delay: .4 });
    });
 
    // Galeria abaixo do anchor: aparece em cascata
    document.querySelectorAll('.s01-gallery-item').forEach((item, i) => {
      setTimeout(() => item.classList.add('visible'), 600 + i * 140);
    });
  }
 
  function reverseS01() {
    gsap.to('.reveal-line span', { y: '110%', stagger: .04, duration: .5, ease: 'power3.in' });
    gsap.to('.spec-card',        { opacity: 0, y: 20,     stagger: .04, duration: .4, ease: 'power2.in' });
    gsap.to('.float-tag',        { opacity: 0, x: -10,    stagger: .04, duration: .4, ease: 'power2.in' });
    document.querySelectorAll('.spec-bar-fill').forEach(bar => {
      gsap.to(bar, { width: 0, duration: 0.5, ease: 'power2.in' });
    });
    // Esconde galeria
    document.querySelectorAll('.s01-gallery-item').forEach(item => {
      item.classList.remove('visible');
    });
  }
 
  /* ── restoreHeroContent ─────────────────────────────────────
     Restaura a opacidade do hero-content e overlay gradualmente.
  ─────────────────────────────────────────────────────────── */
  function restoreHeroContent() {
    gsap.to([contentEl, '#hud-tl', '#hud-tr'], {
      opacity: 1, duration: 0.7, ease: 'power2.out',
    });
    gsap.to(overlayEl, { opacity: 1, duration: 0.6, ease: 'power2.out' });
  }
 
  /* ── initScrub ──────────────────────────────────────────────
     ScrollTrigger único cobrindo o bridge inteiro.
     Bidirecional: onUpdate lida com ida e volta.
  ─────────────────────────────────────────────────────────── */
  function initScrub() {
    ScrollTrigger.create({
      trigger: bridge,
      start: 'top bottom',  // bridge começa a entrar na viewport
      end:   'bottom 15%',  // Finaliza o percurso um pouco antes do fim da ponte
      scrub: true,
 
      /* ── FRAME A FRAME (ida e volta) ── */
      onUpdate(self) {
        if (window.__mobileSkipFly) return;
        const p = self.progress;

        // Detecta início do movimento (Ida)
        if (p > 0 && p < 0.99 && phase === 'hero') {
          phase = 'flying';
          detachToFixed();
        }

        if (phase !== 'flying') return;
        applyFlyPosition(p);
 
        // Limite de pouso (ida)
        if (p >= 0.99 && self.direction === 1) {
          phase = 'landing';
          landOnAnchor();
        }

        // Retorno ao Hero (Volta)
        if (p <= 0.01 && self.direction === -1) {
          phase = 'hero';
          attachToHero(true);
          restoreHeroContent();
        }
      },
 
      onLeaveBack() {
        if (phase !== 'hero' && !window.__mobileSkipFly) {
          phase = 'hero';
          attachToHero(true);
          restoreHeroContent();
        }
      },
 
      onEnterBack() {
        if (window.__mobileSkipFly) return;
        if (phase === 'landed') unlandFromAnchor();
      }
    });
  }
 
  /* ── API pública ─────────────────────────────────────────── */
  return {
    init() {
      gsap.set(anchor, { opacity: 0 });
      initScrub();
    },
  };
})();
 
/* ─────────────────────────────────────────────────────────────
   MÓDULO F — VIDEO SCRUB (Seção 02)
   Scroll controla video.currentTime
   HUD aparece sincronizado com frames
   ───────────────────────────────────────────────────────────── */
const ScrubModule = (() => {
  const scrubVid = document.getElementById('scrub-video');
  const fillEl   = document.getElementById('scrub-fill');
  const pctEl    = document.getElementById('scrub-pct');
 
  function init() {
    // Detecta mobile e troca a fonte do vídeo de scrub se houver data-mob-src
    const isMobile = window.innerWidth <= 768;
    if (isMobile && scrubVid && scrubVid.dataset.mobSrc) {
      scrubVid.src = scrubVid.dataset.mobSrc;
      if (scrubVid.dataset.mobPoster) scrubVid.poster = scrubVid.dataset.mobPoster;
      scrubVid.load(); // Recarrega o vídeo com a nova fonte mobile
    }

    // Quando o vídeo de scrub estiver pronto, pega duração
    // Se não há vídeo, usamos apenas a animação de parallax da imagem
 
    // Fade in suave e fluido sincronizado com o scroll (scrub)
    if (scrubVid) {
      gsap.to(scrubVid, {
        opacity: 1,
        scrollTrigger: {
          trigger: '#s02',
          start: 'top bottom', // Inicia o fade assim que a seção entra na viewport
          end: 'top center',   // Finaliza o fade antes do vídeo centralizar
          scrub: true,
        }
      });
    }

    // ScrollTrigger que controla o progresso
    ScrollTrigger.create({
      trigger: '#s02',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1, // Adiciona suavização de 1s para evitar travamentos no seek do vídeo
      onUpdate: (self) => {
        const p = self.progress;
 
        // Atualiza UI de progresso
        fillEl.style.height = (p * 100) + '%';
        pctEl.textContent   = Math.round(p * 100) + '%';
 
        // Controla video.currentTime se vídeo disponível
        if (scrubVid.duration && scrubVid.readyState >= 2) {
          scrubVid.currentTime = p * scrubVid.duration;
        }
 
        // Parallax sutil na imagem de fallback
        const scrubImgEl = document.getElementById('scrub-img');
        if (scrubImgEl) {
          gsap.set(scrubImgEl, { scale: 1.05 + p * .08, filter: `brightness(${.85 - p * .15})` });
        }
      }
    });
  }
 
  return { init };
})();
 
/* ─────────────────────────────────────────────────────────────
   MÓDULO G — UNBOXING (Seção 03)
   Split horizontal controlado por scroll
   ───────────────────────────────────────────────────────────── */
const UnboxingModule = (() => {
  function init() {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#s03',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        pin: '#s03-sticky',
        pinSpacing: false,
      }
    });
 
    // Fase 1 (0-50%): caixa se abre
    tl
      .to('#unbox-l',  { x: '-100%', duration: .45 }, 0)
      .to('#unbox-r',  { x: '100%',  duration: .45 }, 0)
      // Fase 2 (50-100%): produto e texto revelados
      .to('#unbox-reveal', { opacity: 1, duration: .25 }, .45)
      .to('#unbox-product-img', {
        scale: 1.15, // Aumentado para 115% para garantir o impacto visual no mobile
        duration: .3,
        ease: 'back.out(1.2)',
      }, .5)
      .to('.unbox-reveal-text', {
        scale: 1, opacity: 1,
        duration: .3,
        ease: 'back.out(1.2)',
      }, .55);
  }
 
  return { init };
})();
 
/* ─────────────────────────────────────────────────────────────
   MÓDULO H — CONFIGURADOR (Seção 04)
   Preço animado com GSAP counter; LocalStorage
   ───────────────────────────────────────────────────────────── */
const ConfigModule = (() => {
  const BASE    = 24999;
  const priceEl = document.getElementById('price-val');
  const instEl  = document.getElementById('inst-val');
  const sumRam  = document.getElementById('sum-ram');
  const sumSsd  = document.getElementById('sum-ssd');
  const sumGpu  = document.getElementById('sum-gpu');
  const toast   = document.getElementById('toast');
  const btnCart = document.getElementById('btn-cart');
 
  let config = { ram: { p:0, v:'16GB DDR5' }, storage: { p:0, v:'1TB NVMe' }, gpu: { p:0, v:'RTX 5080' } };
  let counter = { val: BASE };
 
  function total() { return BASE + config.ram.p + config.storage.p + config.gpu.p; }
 
  function animatePrice(to) {
    gsap.to(counter, {
      val: to,
      duration: .7,
      ease: 'power2.out',
      onUpdate() {
        const v = Math.round(counter.val);
        priceEl.textContent = v.toLocaleString('pt-BR');
        instEl.textContent  = `12x R$ ${Math.round(v/12).toLocaleString('pt-BR')}`;
      }
    });
  }
 
  function save() {
    try { localStorage.setItem('vlx_cfg', JSON.stringify({ config, total: total() })); } catch(e) {}
  }
 
  function showToast() {
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
 
  function init() {
    // Restaura config salva
    try {
      const saved = JSON.parse(localStorage.getItem('vlx_cfg') || 'null');
      if (saved) {
        config = saved.config;
        counter.val = saved.total;
        priceEl.textContent = Math.round(counter.val).toLocaleString('pt-BR');
        instEl.textContent  = `12x R$ ${Math.round(counter.val/12).toLocaleString('pt-BR')}`;
        sumRam.textContent  = config.ram.v;
        sumSsd.textContent  = config.storage.v;
        sumGpu.textContent  = config.gpu.v;
 
        // Restaura visual dos botões
        document.querySelectorAll('.cfg-btn').forEach(btn => {
          const g = btn.closest('.cfg-options').dataset.group;
          if (btn.dataset.val === config[g]?.v) {
            btn.closest('.cfg-options').querySelectorAll('.cfg-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
          }
        });
      }
    } catch(e) {}
 
    // Cliques nos botões
    document.querySelectorAll('.cfg-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const g = btn.closest('.cfg-options').dataset.group;
        btn.closest('.cfg-options').querySelectorAll('.cfg-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
 
        config[g] = { p: parseInt(btn.dataset.price, 10), v: btn.dataset.val };
        animatePrice(total());
        sumRam.textContent = config.ram.v;
        sumSsd.textContent = config.storage.v;
        sumGpu.textContent = config.gpu.v;
        save();
      });
    });
 
    btnCart.addEventListener('click', () => { save(); showToast(); });
 
    // Entrada da seção com scroll
    ScrollTrigger.create({
      trigger: '#s04',
      start: 'top 65%',
      once: true,
      onEnter: () => {
        gsap.from('.s04-heading', { opacity: 0, y: 60, duration: 1, ease: 'power4.out' });
        gsap.from('.cfg-group', { opacity: 0, y: 30, stagger: .1, duration: .8, delay: .2, ease: 'power3.out' });
        gsap.from('.price-block', { opacity: 0, y: 20, duration: .7, delay: .5, ease: 'power3.out' });
      }
    });
  }
 
  return { init };
})();
 
/* ─────────────────────────────────────────────────────────────
   MÓDULO I — MISC (Navbar blend, back-to-top, footer)
   ───────────────────────────────────────────────────────────── */
const MiscModule = (() => ({
  init() {
    // Back to top
    const btnTop = document.getElementById('btn-top');
    ScrollTrigger.create({
      start: 'top -400px',
      onEnter:     () => btnTop.classList.add('show'),
      onLeaveBack: () => btnTop.classList.remove('show'),
    });
    btnTop.addEventListener('click', () => lenis.scrollTo(0, { duration: 1.8 }));
 
    // Smooth scroll dos links do nav
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); lenis.scrollTo(t, { duration: 1.4, easing: t => Math.pow(t, 4) }); }
      });
    });
 
    // Footer entrada
    ScrollTrigger.create({
      trigger: '#footer',
      start: 'top 80%',
      once: true,
      onEnter: () => {
        gsap.from('.footer-wordmark', { opacity: 0, y: 40, duration: 1, ease: 'power4.out' });
        gsap.from('.footer-col', { opacity: 0, y: 20, stagger: .08, duration: .7, delay: .2, ease: 'power3.out' });
      }
    });
  }
}))();
 
/* ─────────────────────────────────────────────────────────────
   MÓDULO J — FAVICON ANIMADO
   Alterna entre 3 frames para criar um efeito de loop suave
   ───────────────────────────────────────────────────────────── */
const FaviconModule = (() => {
  const frames = ['assets/logo1.png', 'assets/logo2.png', 'assets/logo3.png'];
  let current = 0;

  return {
    init() {
      // Intervalo de 2s para uma animação elegante
      setInterval(() => {
        current = (current + 1) % frames.length;
        
        const oldLink = document.getElementById('favicon');
        const newLink = document.createElement('link');
        
        newLink.id = 'favicon';
        newLink.rel = 'icon';
        newLink.type = 'image/png';
        newLink.setAttribute('sizes', '32x32'); // Garante que o browser trate como um ícone de alta densidade
        newLink.href = `${frames[current]}?v=${Date.now()}`; // Cache bust
        
        if (oldLink) document.head.removeChild(oldLink);
        document.head.appendChild(newLink);
      }, 2000);
    }
  };
})();

/* ─────────────────────────────────────────────────────────────
   INICIALIZAÇÃO GLOBAL
   ───────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Prepara elementos para entrada (estado inicial invisible)
  gsap.set(['#t1','#t2','#t3'], { y: '110%' });
  gsap.set('#hero-sub-txt',    { y: 40, opacity: 0 });
  gsap.set('#scroll-ind',      { opacity: 0, y: 20 });
  gsap.set(['#hud-tl','#hud-tr'], { opacity: 0, y: 10 });
  gsap.set('.spec-card',       { opacity: 0, y: 30 });
  gsap.set('.float-tag',       { opacity: 0, x: -20 });
  gsap.set('.reveal-line span',{ y: '110%' });
  gsap.set('#unbox-product-img', { scale: .9 }); // Começa ligeiramente menor para um "pop" maior
  gsap.set('.unbox-reveal-text', { scale: .9, opacity: 0 });
  gsap.set('.spec-bar-fill',   { width: 0 });
 
 
/* ═══════════════════════════════════════════════════════════════
   MÓDULO MOBILE — UX completa para touch/small screens
   ═══════════════════════════════════════════════════════════════ */
const MobileModule = (() => {
 
  /* ══════════════════════════════════════════════════════════
     Mobile Module — preserva TODAS as animações GSAP do desktop
     e adiciona UX específica para touch
     ══════════════════════════════════════════════════════════ */
 
  const IS_MOBILE = () => window.innerWidth <= 768;
  const IS_TOUCH  = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 
  /* ── 1. Viewport height fix (iOS Safari address bar) ──────── */
  function fixVH() {
    const set = () => {
      document.documentElement.style.setProperty('--real-vh', window.innerHeight * 0.01 + 'px');
    };
    set();
    window.addEventListener('resize', set, { passive: true });
    window.addEventListener('orientationchange', () => setTimeout(set, 200), { passive: true });
  }
 
  /* ── 2. Hamburger + Drawer with GSAP ──────────────────────── */
  function initDrawer() {
    const btn    = document.getElementById('nav-hamburger');
    const drawer = document.getElementById('mobile-drawer');
    if (!btn || !drawer) return;
 
    let isOpen = false;
 
    function open() {
      isOpen = true;
      drawer.classList.add('open');
      drawer.setAttribute('aria-hidden', 'false');
      btn.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      if (lenis) lenis.stop();
    }
 
    function close() {
      isOpen = false;
      drawer.classList.remove('open');
      drawer.setAttribute('aria-hidden', 'true');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (lenis) lenis.start();
    }
 
    btn.addEventListener('click', () => isOpen ? close() : open());
 
    // Close drawer after navigation link is clicked
   drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();

        const target = document.querySelector(a.getAttribute('href'));

        close();

        setTimeout(() => {
          if (target && lenis) {
            lenis.scrollTo(target, {
              duration: 1.4,
          easing: t => Math.pow(t, 4)
        });
      }
      }, 100);
      });
    });
 
    // Close on ESC
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
 
    // Prevent scroll bleed through drawer
    drawer.addEventListener('touchmove', e => {
      if (isOpen) e.stopPropagation();
    }, { passive: true });
  }
 
  /* ── 3. Sticky bottom CTA (synced with price counter) ─────── */
  function initStickyCTA() {
    const cta     = document.getElementById('mobile-sticky-cta');
    const btn     = document.getElementById('mob-cta-btn');
    const mobAmt  = document.getElementById('mob-price');
    const mainAmt = document.getElementById('price-val');
    if (!cta) return;
 
    // Sync price in real-time via MutationObserver
    if (mainAmt && mobAmt) {
      mobAmt.textContent = mainAmt.textContent;
      const obs = new MutationObserver(() => {
        mobAmt.textContent = mainAmt.textContent;
      });
      obs.observe(mainAmt, { childList: true, characterData: true, subtree: true });
    }
 
    // Show after hero exits viewport
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'bottom 70%',
      onEnter:     () => { if (IS_MOBILE()) cta.classList.add('visible'); },
      onLeaveBack: () => cta.classList.remove('visible'),
    });
 
    // Scroll to configurator with Lenis
    if (btn) {
      btn.addEventListener('click', () => {
        const s04 = document.getElementById('s04');
        if (s04 && lenis) lenis.scrollTo(s04, { duration: 1.2, easing: t => 1 - Math.pow(1-t,4) });
      });
    }
  }
 
  /* ── 4. Bypass video detach physics on mobile ─────────────── 
     Desktop: vidCont detaches to position:fixed and flies via
     per-frame calculation (expensive on mobile GPU).
     Mobile: we skip the fly and directly do a Flip snap when
     S01 enters view — all GSAP animations still fire, 
     just without the intermediate flight phase.                 */
 
  /* ── 5. Touch feedback on config buttons ─────────────────── */
  function initTouchFeedback() {
    if (!IS_TOUCH) return;
    document.querySelectorAll('.cfg-btn').forEach(btn => {
      btn.addEventListener('touchstart', () => {
        btn.classList.add('pressing');
      }, { passive: true });
      const remove = () => btn.classList.remove('pressing');
      btn.addEventListener('touchend',    remove, { passive: true });
      btn.addEventListener('touchcancel', remove, { passive: true });
    });
  }
 
  /* ── 6. Reduce S02 scrub height on mobile ─────────────────── */
  function patchScrub() {
    if (!IS_MOBILE()) return;
    // Ajustado de 250vh para 400vh para manter o scrub suave também no mobile
    const s02 = document.getElementById('s02');
    if (s02) s02.style.height = '400vh';
    // Show simplified spec pills
    const pills = document.getElementById('s02-mobile-specs');
    if (pills) pills.style.display = 'flex';
    // Invalidate the ScrollTrigger so it recalculates
    ScrollTrigger.refresh();
  }
 
  /* ── 7. Scroll hint on hero (mobile only) ─────────────────── */
  function initScrollHint() {
    if (!IS_MOBILE()) return;
    const hint = document.querySelector('.hero-scroll-ind');
    if (!hint) return;
    // Hint was animated by hero entrance; add pulsing arrow for mobile
    setTimeout(() => {
      if (!hint.querySelector('.mob-arrow')) {
        const arr = document.createElement('span');
        arr.className = 'mob-arrow';
        arr.textContent = '';
        arr.style.cssText = 'font-size:1.2rem;color:var(--accent);animation:scrollRun 1.8s var(--ease-expo) infinite;display:block';
        hint.appendChild(arr);
      }
    }, 2800);
    // Auto-hide after first scroll
    if (lenis) {
      lenis.on('scroll', function hideHint() {
        gsap.to(hint, { opacity: 0, duration: 0.4 });
        lenis.off('scroll', hideHint);
      });
    }
  }
 
  /* ── 8. Prevent GSAP reduced-motion firing on mobile ─────── */
  function handleReducedMotion() {
    if (!PREFERS_REDUCED_MOTION) return;
    // Kill all non-essential tweens; keep functional ones
    gsap.globalTimeline.pause();
    // Force-show all animated elements
    document.querySelectorAll('.spec-card, .float-tag, .reveal-line span').forEach(el => {
      gsap.set(el, { clearProps: 'all' });
    });
    // Remove grain
    document.body.style.setProperty('--grain-opacity', '0');
  }
 
  return {
    init() {
      try {
        fixVH();
        initDrawer();
        initStickyCTA();
        initTouchFeedback();
        if (IS_MOBILE()) {
          patchScrub();
          initScrollHint();
        }
        handleReducedMotion();
      } catch (e) {
        console.error('Erro ao inicializar MobileModule:', e);
      }
    },
  };
})();
 
 
  // Inicia módulos
  try {
    PreloaderModule.init();
    VideoTravelModule.init();
    ScrubModule.init();
    UnboxingModule.init();
    ConfigModule.init();
    MiscModule.init();
    FaviconModule.init();
    MobileModule.init();
  } catch (e) {
    console.error('Erro ao inicializar módulos:', e);
  }
 
  // Refresh do ScrollTrigger após load completo
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});