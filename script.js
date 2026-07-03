const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const revealElements = document.querySelectorAll('.reveal');
const contactForm = document.querySelector('.contact-form');
const contactEndpoint = 'https://formspree.io/f/mjgzvbzl';

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
});

revealElements.forEach((element) => observer.observe(element));

contactForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const submitButton = contactForm.querySelector('button[type="submit"]');
  const originalText = submitButton?.textContent || 'Enviar mensaje';
  const formData = new FormData(contactForm);

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
  }

  formData.append('_subject', 'Nuevo mensaje desde la web');

  try {
    const response = await fetch(contactEndpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error('No se pudo enviar el mensaje.');
    }

    contactForm.reset();
    window.alert('Mensaje enviado correctamente.');
  } catch (error) {
    window.alert('No se ha podido enviar el mensaje. Inténtalo de nuevo.');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }
});