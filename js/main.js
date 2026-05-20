(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildExhibits() {
    const container = document.getElementById('exhibits');
    if (!container || !window.EXHIBITS) return;

    window.EXHIBITS.forEach((item, i) => {
      const article = document.createElement('article');
      article.className = `exhibit exhibit--${item.id}`;
      article.id = `exhibit-${i}`;
      article.dataset.theme = item.id;

      let visualInner = '';

      if (item.id === 'gun') {
        visualInner = `
          <img src="${item.image}" alt="${item.alt}" draggable="false">
          <div class="fx fx--scan" aria-hidden="true"></div>
          <div class="fx fx--holo-lines" aria-hidden="true"></div>
          <div class="fx fx--scan-beam" aria-hidden="true"></div>`;
      } else if (item.id === 'tv') {
        visualInner = `
          <div class="tv-set">
            <div class="tv-set__screen">
              <img src="${item.image}" alt="${item.alt}" draggable="false">
              <div class="crt-overlay" aria-hidden="true"></div>
              <div class="crt-flicker" aria-hidden="true"></div>
              <div class="tv-static" aria-hidden="true"></div>
            </div>
            <div class="tv-set__controls">
              <button type="button" class="tv-knob is-active" data-channel="1" aria-label="Channel 1"></button>
              <button type="button" class="tv-knob" data-channel="2" aria-label="Channel 2"></button>
              <button type="button" class="tv-knob" data-channel="3" aria-label="Channel 3"></button>
              <div class="tv-set__dial" title="Drag to tune"></div>
            </div>
          </div>`;
      } else if (item.id === 'drone') {
        visualInner = `
          <img src="${item.image}" alt="${item.alt}" draggable="false">
          <div class="hud hud--drone" aria-hidden="true">
            <div class="hud__box hud__box--tl">STRUCTURAL ANALYSIS<span>ID_492731</span></div>
            <div class="hud__box hud__box--tr">SYSTEM FAILURE / COMPONENT DAMAGE</div>
            <div class="hud__grid"></div>
            <div class="hud__glitch"></div>
            <div class="hud__glitch hud__glitch--2"></div>
            <div class="hud__crosshair"></div>
            <div class="hud__reticle"></div>
          </div>`;
      } else if (item.id === 'camera') {
        visualInner = `
          <img src="${item.image}" alt="${item.alt}" draggable="false">
          <canvas class="waveform-canvas" data-waveform aria-hidden="true"></canvas>
          <div class="fx fx--runic" aria-hidden="true"></div>
          <div class="rec-indicator" aria-hidden="true"><span class="rec-dot"></span> REC</div>`;
      } else if (item.id === 'head') {
        visualInner = `
          <img src="${item.image}" alt="${item.alt}" draggable="false">
          <div class="crt-overlay crt-overlay--heavy" aria-hidden="true"></div>
          <div class="fx fx--roll-head" aria-hidden="true"></div>
          <div class="fx fx--static-noise" aria-hidden="true"></div>`;
      } else if (item.id === 'vr') {
        visualInner = `
          <img src="${item.image}" alt="${item.alt}" draggable="false">
          <div class="fx fx--vr-glow" aria-hidden="true"></div>
          <canvas class="particles-canvas" data-particles aria-hidden="true"></canvas>
          <div class="fx fx--binary-rain" aria-hidden="true"></div>
          <div class="fx fx--vr-scan" aria-hidden="true"></div>`;
      } else {
        visualInner = `<img src="${item.image}" alt="${item.alt}">`;
      }

      const ctrls = {
        gun: '<div class="exhibit-controls"><button type="button" class="ctrl-btn" data-action="scan">▶ Run scan</button><span class="exhibit-hint">Hold · Move cursor</span></div>',
        tv: '<div class="exhibit-controls"><span class="exhibit-hint">Rotate dial · Click screen · Switch channel</span></div>',
        drone: '<div class="exhibit-controls"><button type="button" class="ctrl-btn" data-action="analyze">◎ Analyze</button><span class="exhibit-hint">Aim · Click to lock</span></div>',
        head: '<div class="exhibit-controls"><label class="tune-label">Tune <input type="range" min="0" max="100" value="50" data-tune></label><span class="exhibit-hint">Slide · Click for static</span></div>',
        vr: '<div class="exhibit-controls"><button type="button" class="ctrl-btn ctrl-btn--cyan" data-action="immerse">◉ Enter VR</button><span class="exhibit-hint">Hold · Move for depth</span></div>'
      };
      ctrls.camera = '<div class="exhibit-controls"><button type="button" class="ctrl-btn ctrl-btn--rec" data-action="record">● Record</button><span class="exhibit-hint">Click viewfinder · Toggle record</span></div>';

      article.innerHTML = `
        <span class="page-badge">Artifact ${item.num}</span>
        <div class="exhibit__visual ${item.id === 'tv' ? 'exhibit__visual--tv' : ''}">
          <div class="exhibit-stage" data-theme="${item.id}">
            <div class="exhibit-stage__tilt">
              <div class="ripple-layer" aria-hidden="true"></div>
              ${visualInner}
            </div>
            ${ctrls[item.id] || ''}
          </div>
        </div>
        <div class="exhibit__copy">
          <span class="exhibit__num">${item.num}</span>
          <h2>${item.title}</h2>
          <p class="exhibit__meta">${item.meta}</p>
          <blockquote>“${item.quote}” <cite>— ${item.cite}</cite></blockquote>
          <p>${item.body}</p>
        </div>`;

      container.appendChild(article);
    });

    buildWorksCited(container);
  }

  function buildWorksCited(container) {
    const article = document.createElement('article');
    article.className = 'exhibit exhibit--works-cited';
    article.id = 'exhibit-6';
    article.innerHTML = `
      <span class="page-badge">Works Cited</span>
      <div class="exhibit__copy exhibit__copy--centered">
        <h2>Works Cited</h2>
        <p class="works-cited__entry">Orange, Tommy. <em>There There</em>. Alfred A. Knopf, 2018.</p>
      </div>`;
    container.appendChild(article);
  }

  function initGrain() {
    const canvas = document.getElementById('grain-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = 0;
    let h = 0;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function draw() {
      const imageData = ctx.createImageData(w, h);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255;
        data[i] = data[i + 1] = data[i + 2] = v;
        data[i + 3] = 18;
      }
      ctx.putImageData(imageData, 0, 0);
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    if (!prefersReduced) draw();
  }

  function initCursor() {
    const cursor = document.getElementById('cursor');
    const label = document.getElementById('cursor-label');
    if (!cursor || prefersReduced) return;

    let x = 0, y = 0, tx = 0, ty = 0;

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX;
      ty = e.clientY;
    });

    function tick() {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
      requestAnimationFrame(tick);
    }
    tick();

    const setLabel = (text, hover) => {
      if (label) label.textContent = text || '';
      cursor.classList.toggle('is-hover', !!hover);
      cursor.classList.toggle('is-press', false);
    };

    document.querySelectorAll('button, a, .room__thumb, .exhibit-stage, .ctrl-btn, #hero-frame').forEach((el) => {
      el.addEventListener('mouseenter', () => {
        const hint = el.dataset.cursorLabel || (el.classList.contains('exhibit-stage') ? 'Interact' : 'Open');
        setLabel(hint, true);
      });
      el.addEventListener('mouseleave', () => setLabel('', false));
    });

    window.addEventListener('mousedown', () => cursor.classList.add('is-press'));
    window.addEventListener('mouseup', () => cursor.classList.remove('is-press'));
  }

  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    const update = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${h > 0 ? (window.scrollY / h) * 100 : 0}%`;
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initRoomParallax() {
    const room = document.getElementById('room');
    if (!room || prefersReduced) return;

    const walls = room.querySelectorAll('[data-depth]');
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    window.addEventListener('mousemove', (e) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      targetX = nx;
      targetY = ny;
    });

    function animate() {
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;

      walls.forEach((wall) => {
        const d = parseFloat(wall.dataset.depth) || 0.3;
        const rx = curY * 4 * d;
        const ry = -curX * 6 * d;
        const base = wall.classList.contains('room__wall--left')
          ? 'rotateY(28deg) translateZ(-80px)'
          : wall.classList.contains('room__wall--right')
            ? 'rotateY(-28deg) translateZ(-80px)'
            : 'translate(-50%, -50%) translateZ(40px)';

        if (wall.classList.contains('room__wall--center')) {
          wall.style.transform = `translate(calc(-50% + ${curX * 12}px), calc(-50% + ${curY * 8}px)) translateZ(40px) rotateX(${rx}deg) rotateY(${ry}deg)`;
        } else {
          wall.style.transform = `${base} rotateX(${rx}deg) rotateY(${ry}deg)`;
        }
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  function playIntro() {
    const room = document.getElementById('room');
    if (!room || typeof gsap === 'undefined') return;

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' }
    });

    tl.from(room, { opacity: 0, duration: 0.4 })
      .from('#intro .page-badge', { opacity: 0, x: -16, duration: 0.6 }, 0.05)
      .from('.room__wall--left', { x: -80, opacity: 0, duration: 1 }, 0.1)
      .from('.room__title', { y: 40, opacity: 0, duration: 1 }, 0.2)
      .from('.room__hero-frame', { scale: 0.85, opacity: 0, duration: 1.1 }, 0.35)
      .from('.room__credit', { opacity: 0, y: 12, duration: 0.7 }, 0.55)
      .from('.room__wall--right', { x: 80, opacity: 0, duration: 1 }, 0.25)
      .from('.room__thumb', { y: 30, opacity: 0, stagger: 0.08, duration: 0.7 }, 0.5)
      .from('.scroll-hint', { opacity: 0, y: 20, duration: 0.6 }, 0.9);

    return tl;
  }

  function initScroll() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    let lenis;
    if (typeof Lenis !== 'undefined' && !prefersReduced) {
      lenis = new Lenis({ duration: 1.2, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    document.querySelectorAll('.exhibit').forEach((el) => {
      el.classList.add('will-animate');

      const badge = el.querySelector('.page-badge');
      if (badge) {
        gsap.from(badge, {
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' },
          opacity: 0,
          x: -16,
          duration: 0.6,
          ease: 'power2.out'
        });
      }

      const stage = el.querySelector('.exhibit-stage');
      if (stage) {
        gsap.from(stage, {
          scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none reverse' },
          scale: 0.88,
          rotateY: -8,
          opacity: 0,
          duration: 1.1,
          ease: 'power3.out'
        });
      }

      gsap.from(el.querySelector('.exhibit__copy > *'), {
        scrollTrigger: { trigger: el, start: 'top 72%', toggleActions: 'play none none reverse' },
        y: 28,
        opacity: 0,
        stagger: 0.08,
        duration: 0.85,
        ease: 'power2.out'
      });

      ScrollTrigger.create({
        trigger: el,
        start: 'top 55%',
        end: 'bottom 45%',
        onToggle: (self) => el.classList.toggle('is-active', self.isActive)
      });

      const img = el.querySelector('.exhibit-stage img');
      if (img) {
        gsap.to(img, {
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
          y: -40,
          ease: 'none'
        });
      }
    });

    const indexEl = document.getElementById('current-index');
    const sections = [
      document.getElementById('intro'),
      ...document.querySelectorAll('.exhibit')
    ];

    sections.forEach((section, i) => {
      if (!section) return;
      ScrollTrigger.create({
        trigger: section,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => updateNav(i),
        onEnterBack: () => updateNav(i)
      });
    });

    function updateNav(i) {
      document.querySelectorAll('.exhibit-nav button').forEach((btn) => {
        const g = btn.dataset.goto;
        const active = g === 'intro' ? i === 0 : parseInt(g, 10) === i - 1;
        btn.classList.toggle('is-active', active);
      });
      if (indexEl && i > 0) {
        indexEl.textContent = String(i).padStart(2, '0');
      } else if (indexEl) {
        indexEl.textContent = '01';
      }
      document.body.classList.toggle('is-dark', i > 0 && i % 2 === 1);
    }

    return lenis;
  }

  function initNav(lenis) {
    document.querySelectorAll('.exhibit-nav button').forEach((btn) => {
      btn.addEventListener('click', () => {
        const g = btn.dataset.goto;
        let target;
        if (g === 'intro') target = document.getElementById('intro');
        else target = document.getElementById(`exhibit-${g}`);

        if (!target) return;
        if (lenis) lenis.scrollTo(target, { offset: 0 });
        else target.scrollIntoView({ behavior: 'smooth' });
      });
    });

    document.querySelectorAll('.room__thumb').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        const idx = thumb.dataset.index;
        const target = document.getElementById(`exhibit-${idx}`);
        if (!target) return;
        if (lenis) lenis.scrollTo(target);
        else target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function initWaveforms() {
    document.querySelectorAll('[data-waveform]').forEach((canvas) => {
      const stage = canvas.closest('.exhibit-stage');
      const ctx = canvas.getContext('2d');
      let t = 0;
      let amp = 0.35;
      let spike = 0;

      function resize() {
        const r = stage.getBoundingClientRect();
        canvas.width = r.width * 0.55;
        canvas.height = r.height * 0.18;
      }

      stage?.addEventListener('mousemove', (e) => {
        const r = stage.getBoundingClientRect();
        amp = 0.25 + ((e.clientX - r.left) / r.width) * 0.5;
      });

      stage?.addEventListener('waveform-spike', () => {
        spike = 1;
      });

      function draw() {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const boost = 1 + spike * 1.5;
        spike *= 0.92;
        ctx.strokeStyle = `rgba(255,255,255,${0.7 + spike * 0.3})`;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8 + spike * 20;
        ctx.lineWidth = 2 + spike;
        ctx.beginPath();
        for (let x = 0; x < w; x++) {
          const n =
            (Math.sin(x * 0.02 + t) * 0.35 +
              Math.sin(x * 0.05 + t * 1.3) * 0.25 +
              Math.sin(x * 0.01 + t * 0.7) * 0.4) *
            amp *
            boost;
          const y = h / 2 + n * h * 0.4;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        t += 0.05 + spike * 0.08;
        if (!prefersReduced) requestAnimationFrame(draw);
      }

      resize();
      window.addEventListener('resize', resize);
      draw();
    });
  }

  function initParticles() {
    document.querySelectorAll('[data-particles]').forEach((canvas) => {
      const stage = canvas.closest('.exhibit-stage');
      const ctx = canvas.getContext('2d');
      const particles = Array.from({ length: 80 }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.003,
        vy: 0.002 + Math.random() * 0.005,
        size: 1 + Math.random() * 2.5
      }));
      let mx = 0.5;
      let my = 0.5;
      let immersed = false;

      function resize() {
        const r = stage.getBoundingClientRect();
        canvas.width = r.width;
        canvas.height = r.height;
      }

      stage?.addEventListener('mousemove', (e) => {
        const r = stage.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width;
        my = (e.clientY - r.top) / r.height;
      });

      const obs = new MutationObserver(() => {
        immersed = stage.classList.contains('is-immersed');
      });
      obs.observe(stage, { attributes: true, attributeFilter: ['class'] });

      function draw() {
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);
        const pull = immersed ? 0.015 : 0.006;
        particles.forEach((p) => {
          p.x += (mx - p.x) * pull + p.vx;
          p.y -= p.vy + (immersed ? 0.008 : 0);
          if (p.y < 0) p.y = 1;
          if (p.x < 0 || p.x > 1) p.vx *= -1;
          const alpha = immersed ? 0.9 : 0.45;
          ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.shadowColor = '#00d4ff';
          ctx.shadowBlur = immersed ? 12 : 4;
          ctx.beginPath();
          ctx.arc(p.x * w, p.y * h, p.size * (immersed ? 1.4 : 1), 0, Math.PI * 2);
          ctx.fill();
        });
        if (!prefersReduced) requestAnimationFrame(draw);
      }

      resize();
      window.addEventListener('resize', resize);
      draw();
    });
  }

  buildExhibits();

  initGrain();
  initCursor();
  initScrollProgress();
  initRoomParallax();
  initWaveforms();
  initParticles();

  const lenis = initScroll();
  initNav(lenis);

  if (window.ExhibitInteractions) window.ExhibitInteractions.init();

  document.querySelectorAll('.exhibit-stage').forEach((s) => {
    s.dataset.cursorLabel = 'Interact';
  });

  if (!prefersReduced) playIntro();
})();
