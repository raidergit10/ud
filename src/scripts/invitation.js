document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ============================================================
  // 1. PRELOADER / LANDING LOADER
  //    Preload semua aset (gambar bg, bunga, galeri, foto, font)
  //    ke cache dulu -> begitu loader hilang, tampilan sudah siap
  //    dan tidak "reload"/pop-in saat di-scroll.
  // ============================================================
  const loader = document.getElementById('loader');
  const percentEl = document.getElementById('loaderPercent');
  const barEl = document.getElementById('loaderBar');

  // Kunci scroll selama loading
  document.body.classList.add('is-loading', 'not-open');

  // Kumpulkan URL aset yang perlu di-preload
  const assetUrls = new Set();
  // Background dari CSS (tidak terdeteksi lewat <img>)
  assetUrls.add('/images/bg2.webp');
  assetUrls.add('/images/p2.jpg');
  // Semua <img> di halaman (termasuk yang loading="lazy")
  document.querySelectorAll('img[src]').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('data:')) assetUrls.add(src);
  });

  const urls = Array.from(assetUrls);
  const total = urls.length || 1;
  let loadedCount = 0;

  const updateProgress = () => {
    const pct = Math.min(100, Math.round((loadedCount / total) * 100));
    if (percentEl) percentEl.textContent = pct;
    if (barEl) barEl.style.width = pct + '%';
  };

  const preloadOne = (url) =>
    new Promise((resolve) => {
      const img = new Image();
      const done = () => {
        loadedCount++;
        updateProgress();
        resolve();
      };
      img.onload = done;
      img.onerror = done;
      img.src = url;
    });

  let loaderHidden = false;
  const hideLoader = () => {
    if (loaderHidden) return;
    loaderHidden = true;

    loadedCount = total;
    updateProgress();

    document.body.classList.remove('is-loading');

    if (loader) {
      loader.classList.add('loaded');
      loader.addEventListener(
        'transitionend',
        () => loader.remove(),
        { once: true }
      );
      // fallback hapus loader kalau transitionend tak terpanggil
      setTimeout(() => loader && loader.remove(), 900);
    }

    // Baru mulai reveal section setelah loader hilang -> kesan landing mulus
    initReveal();
  };

  const MIN_SHOW = 900; // biar animasi loading sempat terlihat
  const startedAt = performance.now();

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

  Promise.all([Promise.all(urls.map(preloadOne)), fontsReady]).then(() => {
    const elapsed = performance.now() - startedAt;
    const wait = Math.max(0, MIN_SHOW - elapsed);
    setTimeout(hideLoader, wait);
  });

  // Jaring pengaman: kalau ada aset lambat/gantung, tetap tampil maks 7 detik
  setTimeout(hideLoader, 7000);

  updateProgress();

  // ============================================================
  // 2. REVEAL saat elemen masuk layar (ringan, tanpa delay)
  //    Dipanggil setelah preloader selesai.
  // ============================================================
  let revealInitialized = false;
  function initReveal() {
    if (revealInitialized) return;
    revealInitialized = true;

    const animatedElements = document.querySelectorAll('.animate__animated');

    if (reduceMotion || !('IntersectionObserver' in window)) {
      animatedElements.forEach((el) => el.classList.add('is-visible', 'reveal-done'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('is-visible');
            el.addEventListener(
              'transitionend',
              () => el.classList.add('reveal-done'),
              { once: true }
            );
            obs.unobserve(el);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  }

  // ============================================================
  // 3. Tombol Open Invitation
  // ============================================================
  const openBtn = document.getElementById('btnOpenInvitation');
  const mainContent = document.getElementById('mainContent');
  const audio = document.getElementById('music');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      document.body.classList.remove('not-open');

      if (mainContent) {
        mainContent.scrollIntoView({ behavior: 'smooth' });
      }

      if (audio) {
        audio.play().catch((err) => console.log('Autoplay ditolak browser:', err));
      }
    });
  }

  // ============================================================
  // 4. Tombol Kontrol Musik
  // ============================================================
  const musicBtn = document.getElementById('btnMusic');
  if (musicBtn && audio) {
    musicBtn.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    });
  }

  // ============================================================
  // 5. Modal Helper (QR & RSVP)
  // ============================================================
  const toggleModal = (modalId, show) => {
    const modal = document.getElementById(modalId);
    const overlay = document.getElementById('modalOverlay');
    if (modal && overlay) {
      modal.style.display = show ? 'block' : 'none';
      modal.classList.toggle('show', show);
      overlay.style.display = show ? 'block' : 'none';
    }
  };

  document.getElementById('btnQrModal')?.addEventListener('click', () => toggleModal('qrModal', true));
  document.getElementById('closeQrModalBtn')?.addEventListener('click', () => toggleModal('qrModal', false));

  document.getElementById('btnOpenRsvpModal')?.addEventListener('click', () => toggleModal('rsvpModal', true));
  document.getElementById('closeRsvpModalBtn')?.addEventListener('click', () => toggleModal('rsvpModal', false));

  document.getElementById('modalOverlay')?.addEventListener('click', () => {
    toggleModal('qrModal', false);
    toggleModal('rsvpModal', false);
  });

  // ============================================================
  // 6b. Tombol Kembali ke Atas
  //     Muncul saat scroll ke bawah, naik smooth saat ditekan.
  // ============================================================
  const backToTopBtn = document.getElementById('btnBackToTop');
  if (backToTopBtn) {
    const SHOW_AFTER = 350; // px scroll sebelum tombol muncul
    let ticking = false;

    const syncBackToTop = () => {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      backToTopBtn.classList.toggle('show', scrolled > SHOW_AFTER);
      ticking = false;
    };

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(syncBackToTop);
          ticking = true;
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener('click', () => {
      const behavior = reduceMotion ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior });
    });

    syncBackToTop();
  }

  // ============================================================
  // 6. Countdown (Waktu Acara)
  // ============================================================
  const countdownWrapper = document.querySelector('.countdown-wrapper');
  if (countdownWrapper && countdownWrapper.dataset.datetime) {
    const target = new Date(countdownWrapper.dataset.datetime).getTime();
    const elDay = countdownWrapper.querySelector('.day .number');
    const elHour = countdownWrapper.querySelector('.hour .number');
    const elMinute = countdownWrapper.querySelector('.minute .number');
    const elSecond = countdownWrapper.querySelector('.second .number');
    const pad = (n) => String(n).padStart(2, '0');

    const updateCountdown = () => {
      let diff = target - Date.now();
      if (isNaN(diff) || diff < 0) diff = 0;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (elDay) elDay.textContent = pad(days);
      if (elHour) elHour.textContent = pad(hours);
      if (elMinute) elMinute.textContent = pad(minutes);
      if (elSecond) elSecond.textContent = pad(seconds);
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});
