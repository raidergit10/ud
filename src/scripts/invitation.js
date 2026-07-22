document.addEventListener('DOMContentLoaded', () => {
  // 1. Matikan Loader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('loaded');
    }, 300);
  }

  // 2. Kunci Scroll awal
  document.body.classList.add('not-open');

  // 3. Scroll Observer untuk memicu animasi saat elemen masuk layar
  const animatedElements = document.querySelectorAll('.animate__animated');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  animatedElements.forEach((el) => observer.observe(el));

  // 4. Tombol Open Invitation
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

  // 5. Tombol Kontrol Musik
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

  // 6. Modal Helper
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
});