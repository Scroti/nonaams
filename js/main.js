document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('mobileToggle');
    const nav = document.getElementById('mainNav');

    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            toggle.classList.toggle('active');
        });

        nav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                toggle.classList.remove('active');
            });
        });
    }

    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const wasActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(el => {
                el.classList.remove('active');
                el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            if (!wasActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    const form = document.getElementById('subscribeForm');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value) {
                const btn = form.querySelector('button');
                btn.textContent = 'Grazie!';
                btn.disabled = true;
                input.disabled = true;
                setTimeout(() => {
                    btn.textContent = 'Iscriviti';
                    btn.disabled = false;
                    input.disabled = false;
                    input.value = '';
                }, 3000);
            }
        });
    }

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll(
        '.casino-card, .review-card, .info-card, .game-card, .license-card, .provider-card, .faq-item'
    ).forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
});
