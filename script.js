const form = document.querySelector('.lead-form');
const status = document.querySelector('.form-status');

const navToggle = document.querySelector('.nav-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (navToggle && mobileNav) {
  const closeNav = () => {
    mobileNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const toggleNav = () => {
    const isOpen = mobileNav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('nav-open', isOpen);
  };

  navToggle.addEventListener('click', toggleNav);
  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
}

const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
    rootMargin: '0px 0px -30px 0px'
  }
);

revealItems.forEach((item) => revealObserver.observe(item));

if (form && status) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    const name = String(payload.name || '').trim();
    const phone = String(payload.phone || '').trim();
    const comment = String(payload.comment || '').trim();

    if (!name || !phone) {
      status.textContent = 'Будь ласка, заповніть ім’я та телефон для заявки.';
      status.style.color = '#8a2d2d';
      return;
    }

    console.log('Нова заявка Glevakha Plaza:', payload);

    status.textContent = `Дякуємо, ${name}! Ми зв’яжемося з вами найближчим часом.`;
    status.style.color = '#1e5d3d';
    form.reset();
  });
}
