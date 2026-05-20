/* Exhibit-specific interactions — loaded after main builds DOM */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('is-visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('is-visible'), 2200);
  }

  function burst(stage, className, ms = 600) {
    if (!stage) return;
    stage.classList.add(className);
    setTimeout(() => stage.classList.remove(className), ms);
  }

  function ripple(stage, e) {
    const layer = stage.querySelector('.ripple-layer') || stage;
    const rect = layer.getBoundingClientRect();
    const rip = document.createElement('span');
    rip.className = 'ripple';
    const size = Math.max(rect.width, rect.height) * 0.4;
    rip.style.width = rip.style.height = `${size}px`;
    rip.style.left = `${e.clientX - rect.left - size / 2}px`;
    rip.style.top = `${e.clientY - rect.top - size / 2}px`;
    layer.appendChild(rip);
    rip.addEventListener('animationend', () => rip.remove());
  }

  function initTilt() {
    document.querySelectorAll('.exhibit-stage').forEach((stage) => {
      const inner = stage.querySelector('.exhibit-stage__tilt');
      if (!inner || reduced) return;

      let tx = 0;
      let ty = 0;
      let cx = 0;
      let cy = 0;

      stage.addEventListener('mousemove', (e) => {
        const r = stage.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });

      stage.addEventListener('mouseleave', () => {
        tx = 0;
        ty = 0;
      });

      function loop() {
        cx += (tx - cx) * 0.1;
        cy += (ty - cy) * 0.1;
        inner.style.transform = `rotateY(${cx * 10}deg) rotateX(${-cy * 8}deg) scale(1.02)`;
        requestAnimationFrame(loop);
      }
      loop();
    });
  }

  function initGun() {
    document.querySelectorAll('.exhibit--gun .exhibit-stage').forEach((stage) => {
      const scan = stage.querySelector('.fx--scan');
      const img = stage.querySelector('img');

      stage.addEventListener('mousemove', (e) => {
        if (!scan) return;
        const r = stage.getBoundingClientRect();
        const y = ((e.clientY - r.top) / r.height) * 100;
        scan.style.setProperty('--scan-y', `${y}%`);
      });

      stage.addEventListener('mousedown', (e) => {
        stage.classList.add('is-scanning');
        burst(stage, 'is-burst');
        ripple(stage, e);
        toast('Scanning internal structure…');
        if (img) gsap?.to(img, { scale: 1.06, duration: 0.3 });
      });

      stage.addEventListener('mouseup', () => {
        stage.classList.remove('is-scanning');
        const img = stage.querySelector('img');
        if (img) gsap?.to(img, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.5)' });
      });

      stage.querySelector('[data-action="scan"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        stage.classList.add('is-scanning');
        burst(stage, 'is-burst');
        setTimeout(() => stage.classList.remove('is-scanning'), 1200);
        toast('Deep scan complete');
      });
    });
  }

  function initTV() {
    document.querySelectorAll('.exhibit--tv .exhibit-stage').forEach((stage) => {
      const screen = stage.querySelector('.tv-set__screen');
      const dial = stage.querySelector('.tv-set__dial');
      let rotation = 0;
      let dragging = false;

      const channelBurst = () => {
        screen?.classList.add('is-static');
        burst(stage, 'is-burst');
        toast('Signal interference — tuning channel…');
        setTimeout(() => screen?.classList.remove('is-static'), 500);
      };

      stage.querySelectorAll('[data-channel]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          stage.querySelectorAll('[data-channel]').forEach((b) => b.classList.remove('is-active'));
          btn.classList.add('is-active');
          channelBurst();
        });
      });

      if (dial) {
        dial.addEventListener('mousedown', (e) => {
          dragging = true;
          dial.classList.add('is-dragging');
          e.preventDefault();
        });
        window.addEventListener('mousemove', (e) => {
          if (!dragging) return;
          const r = dial.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          rotation = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
          dial.style.transform = `rotate(${rotation}deg)`;
          if (Math.random() > 0.92) channelBurst();
        });
        window.addEventListener('mouseup', () => {
          if (dragging) toast(`Channel locked at ${Math.round(((rotation % 360) + 360) % 360)}°`);
          dragging = false;
          dial.classList.remove('is-dragging');
        });
      }

      screen?.addEventListener('click', (e) => {
        ripple(stage, e);
        channelBurst();
      });
    });
  }

  function initDrone() {
    document.querySelectorAll('.exhibit--drone .exhibit-stage').forEach((stage) => {
      const cross = stage.querySelector('.hud__crosshair');
      const hud = stage.querySelector('.hud--drone');

      stage.addEventListener('mousemove', (e) => {
        const r = stage.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        if (cross) {
          cross.style.left = `${x}%`;
          cross.style.top = `${y}%`;
        }
        stage.style.setProperty('--mx', `${x}%`);
        stage.style.setProperty('--my', `${y}%`);
      });

      stage.addEventListener('click', (e) => {
        burst(stage, 'is-glitch-burst');
        ripple(stage, e);
        hud?.classList.add('is-alert');
        toast('Target acquired — structural damage confirmed');
        setTimeout(() => hud?.classList.remove('is-alert'), 800);
      });

      stage.querySelector('[data-action="analyze"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        burst(stage, 'is-glitch-burst');
        toast('Running forensic analysis…');
      });
    });
  }

  function initCamera() {
    document.querySelectorAll('.exhibit--camera .exhibit-stage').forEach((stage) => {
      let recording = false;

      const recBtn = stage.querySelector('[data-action="record"]');
      recBtn?.addEventListener('click', (e) => {
        e.stopPropagation();
        recording = !recording;
        stage.classList.toggle('is-recording', recording);
        recBtn.classList.toggle('is-recording', recording);
        recBtn.textContent = recording ? '■ Stop' : '● Record';
        toast(recording ? 'Recording testimony…' : 'Clip saved to archive');
      });

      stage.addEventListener('click', (e) => {
        if (e.target.closest('.ctrl-btn')) return;
        burst(stage, 'is-flash');
        ripple(stage, e);
        stage.dispatchEvent(new CustomEvent('waveform-spike'));
      });
    });
  }

  function initHead() {
    document.querySelectorAll('.exhibit--head .exhibit-stage').forEach((stage) => {
      const slider = stage.querySelector('[data-tune]');

      slider?.addEventListener('input', (e) => {
        const v = e.target.value;
        stage.style.setProperty('--tune', v);
        stage.querySelector('.fx--roll-head')?.style.setProperty('--roll', `${v * 0.15}deg`);
        if (v % 25 < 3) burst(stage, 'is-static-burst');
      });

      stage.addEventListener('click', (e) => {
        burst(stage, 'is-static-burst');
        ripple(stage, e);
        toast('Signal lost — head rolling in…');
      });
    });
  }

  function initVR() {
    document.querySelectorAll('.exhibit--vr .exhibit-stage').forEach((stage) => {
      stage.addEventListener('mousemove', (e) => {
        const r = stage.getBoundingClientRect();
        stage.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        stage.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      });

      const enter = () => {
        stage.classList.add('is-immersed');
        toast('Entering virtual powwow feed…');
      };
      const leave = () => stage.classList.remove('is-immersed');

      stage.addEventListener('mousedown', enter);
      stage.addEventListener('mouseup', leave);
      stage.addEventListener('mouseleave', leave);

      stage.querySelector('[data-action="immerse"]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        stage.classList.toggle('is-immersed');
        toast(stage.classList.contains('is-immersed') ? 'VR link established' : 'Disconnected');
      });
    });
  }

  function initIntroHero() {
    const frame = document.getElementById('hero-frame');
    if (!frame) return;
    const trigger = () => {
      frame.classList.add('is-static-burst');
      toast('Broadcast interference');
      setTimeout(() => frame.classList.remove('is-static-burst'), 700);
    };
    frame.addEventListener('click', trigger);
    frame.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger();
      }
    });
  }

  window.ExhibitInteractions = {
    init() {
      initTilt();
      initGun();
      initTV();
      initDrone();
      initCamera();
      initHead();
      initVR();
      initIntroHero();
    },
    toast,
    burst
  };
})();
