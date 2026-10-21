(() => {
  // Custom cursor
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  if (window.matchMedia('(pointer: fine)').matches) {
    document.body.appendChild(dot);
    document.body.appendChild(ring);
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });
    (function animRing() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(animRing);
    })();
    document.querySelectorAll('a, button, .work-card, .filter-btn, .btn').forEach((el) => {
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  }

  // Header scroll
  const header = document.querySelector('.header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mobile menu
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
      burger.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burger.classList.remove('open');
      });
    });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal, .reveal-scale, .skill-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));

  // Phone mask
  document.querySelectorAll('input[name="phone"], #phone').forEach((phoneInput) => {
    phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '');
      if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
      digits = digits.slice(0, 10);
      let result = '';
      if (digits.length > 0) {
        result = '+7';
        if (digits.length > 0) result += ' (' + digits.slice(0, 3);
        if (digits.length >= 3) result += ')';
        if (digits.length > 3) result += ' ' + digits.slice(3, 6);
        if (digits.length > 6) result += ' ' + digits.slice(6, 8);
        if (digits.length > 8) result += ' ' + digits.slice(8, 10);
      }
      phoneInput.value = result;
    });
  });

  // Contact form
  document.querySelectorAll('#contactForm, form.contact-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (form.querySelector('[name="name"]')?.value || '').trim();
      const email = (form.querySelector('[name="email"]')?.value || '').trim();
      const topic = form.querySelector('[name="topic"]')?.value || '';
      const phone = (form.querySelector('[name="phone"]')?.value || '').trim();
      const message = (form.querySelector('[name="message"]')?.value || '').trim();
      if (name.length < 2) { showToast('Введите имя (минимум 2 буквы)', true); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Введите корректный email', true); return; }
      if (!topic) { showToast('Выберите тему обращения', true); return; }
      try {
        const key = 'handiz_requests';
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        list.unshift({ id: Date.now(), name, email, phone, topic, message, date: new Date().toLocaleString('ru-RU'), status: 'Новая' });
        localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
      } catch (_) {}
      form.reset();
      showToast('Заявка отправлена! Свяжусь с вами в ближайшее время.');
    });
  });

  function showToast(msg, isError) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.toggle('error', !!isError);
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), 3800);
  }
  window.showToast = showToast;

  // Smooth counter animation for stats
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const io2 = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io2.disconnect();
      let n = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const t = setInterval(() => {
        n += step;
        if (n >= target) { n = target; clearInterval(t); }
        el.textContent = n + (el.dataset.suffix || '');
      }, 30);
    }, { threshold: 0.5 });
    io2.observe(el);
  });
})();
