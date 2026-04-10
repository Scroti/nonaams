/**
 * Google Drive "uc?export=view" often returns an HTML preview page for <img> requests,
 * so images break even though the same URL works in the address bar. The thumbnail
 * endpoint returns actual image data for publicly shared files.
 */
function resolveGoogleDriveImageUrl(url) {
    if (!url || typeof url !== 'string') return url;
    const u = url.trim();
    if (!u.includes('drive.google.com')) return u;

    let fileId = u.match(/\/file\/d\/([^/]+)/)?.[1];
    if (!fileId) {
        const q = u.match(/[?&]id=([^&]+)/);
        if (q) fileId = q[1];
    }
    if (!fileId) return u;

    return `https://drive.google.com/thumbnail?id=${encodeURIComponent(fileId)}&sz=w800`;
}

/** Initials for logo placeholder when `image` is empty */
function brandMediaInitials(name) {
    const s = (name || '').replace(/\s+/g, ' ').trim();
    if (!s) return '?';
    const parts = s.split(' ').filter(Boolean);
    if (parts.length >= 2) {
        const a = parts[0][0] || '';
        const b = parts[1][0] || '';
        return (a + b).toUpperCase();
    }
    const word = parts[0];
    const alnum = word.replace(/[^a-zA-Z\d]/g, '');
    if (alnum.length >= 2) return alnum.slice(0, 2).toUpperCase();
    return word.slice(0, Math.min(2, word.length)).toUpperCase();
}

function brandPlaceholderHue(name) {
    let h = 0;
    const s = name || '';
    for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
    return 160 + Math.abs(h % 120);
}

function starStringForRating(rating) {
    const r = Math.max(0, Math.min(5, Number(rating) || 0));
    const full = Math.round(r);
    return '\u2605'.repeat(full) + '\u2606'.repeat(5 - full);
}

function setHeroUpdateDate() {
    const el = document.querySelector('.date-badge__value');
    if (!el) return;
    el.textContent = new Date().toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function renderCasinoBonuses() {
    const grid = document.getElementById('casinoGrid');
    const raw = window.__CASINO_BONUSES__;
    if (!grid || !Array.isArray(raw) || raw.length === 0) return;

    const sorted = [...raw].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    grid.innerHTML = '';

    sorted.forEach((item, index) => {
        const rank = index + 1;
        const name = (item.brandName || item.casino || '').trim();
        const title = (item.title || '').trim();
        const rating = item.rating != null ? Number(item.rating) : 5;
        const ratingLabel = Number.isFinite(rating) ? rating.toFixed(1) : '5.0';
        const link = (item.link || '#').trim();
        const imageUrl = resolveGoogleDriveImageUrl((item.image || '').trim());
        const initials = brandMediaInitials(name);
        const placeholderHue = brandPlaceholderHue(name);
        const hasRasterImage = !!imageUrl;

        const article = document.createElement('article');
        article.className = 'casino-card';
        article.setAttribute('itemscope', '');
        article.setAttribute('itemtype', 'https://schema.org/Product');
        if (index === 0) article.id = 'firstBonusCard';

        const mediaInner = hasRasterImage
            ? `<img class="card-thumb" src="" alt="" width="112" height="72" loading="lazy" decoding="async" itemprop="image" />`
            : `<div class="card-thumb card-thumb--placeholder" style="--ph: ${placeholderHue}"><span class="card-thumb--placeholder-text"></span></div>`;

        const mediaHtml = `<div class="card-media">${mediaInner}</div>`;

        article.innerHTML = `
            <div class="card-rank card-rank--desktop">#${rank}</div>
            ${mediaHtml}
            <div class="card-body">
                <div class="card-heading">
                    <div class="card-heading-main">
                        <div class="card-rank card-rank--mobile">#${rank}</div>
                        <h3 itemprop="name"></h3>
                        <div class="card-rating-inline">
                            <span class="card-rating-inline__icon" aria-hidden="true">★</span>
                            <strong class="card-rating-inline__value"></strong>
                        </div>
                    </div>
                    <div class="card-rating card-rating--full">
                        <span class="stars"></span> <strong class="card-rating__value"></strong>/5
                    </div>
                </div>
                <p class="card-bonus" itemprop="description"></p>
            </div>
            <div class="card-action">
                <a href="#" class="btn-play" rel="nofollow noopener" target="_blank">GIOCA ORA</a>
            </div>
        `;

        if (hasRasterImage) {
            const img = article.querySelector('.card-thumb');
            if (img) {
                img.src = imageUrl;
                img.alt = name ? `${name} — bonus` : 'Bonus casino';
            }
        } else {
            const ph = article.querySelector('.card-thumb--placeholder');
            const sp = ph && ph.querySelector('.card-thumb--placeholder-text');
            if (sp) sp.textContent = initials;
            if (ph) ph.setAttribute('aria-label', name ? `${name} — logo` : 'Casino');
        }

        article.querySelector('.card-heading-main h3').textContent = name;
        const ratingInline = article.querySelector('.card-rating-inline');
        const ratingVal = article.querySelector('.card-rating-inline__value');
        if (ratingVal) ratingVal.textContent = ratingLabel;
        if (ratingInline) {
            ratingInline.setAttribute('aria-label', 'Valutazione ' + ratingLabel + ' su 5');
        }
        const starsEl = article.querySelector('.card-rating--full .stars');
        const ratingFullStrong = article.querySelector('.card-rating--full .card-rating__value');
        if (starsEl) starsEl.textContent = starStringForRating(rating);
        if (ratingFullStrong) ratingFullStrong.textContent = ratingLabel;
        article.querySelector('.card-bonus').textContent = title;
        const btn = article.querySelector('a.btn-play');
        btn.href = link;

        grid.appendChild(article);
    });

    const first = sorted[0];
    const bonusSnackbar = document.getElementById('bonusSnackbar');
    if (bonusSnackbar && first) {
        const nm = bonusSnackbar.querySelector('.bonus-snackbar__name');
        const offer = bonusSnackbar.querySelector('.bonus-snackbar__offer');
        const cta = bonusSnackbar.querySelector('.bonus-snackbar__cta');
        const thumb = bonusSnackbar.querySelector('.bonus-snackbar__thumb');
        const firstName = (first.brandName || first.casino || '').trim();
        const firstImg = resolveGoogleDriveImageUrl((first.image || '').trim());
        if (nm) nm.textContent = firstName;
        if (offer) offer.textContent = (first.title || '').trim();
        if (cta) cta.href = (first.link || '#').trim();
        if (thumb) {
            if (firstImg) {
                thumb.src = firstImg;
                thumb.alt = firstName ? `${firstName} — bonus` : 'Bonus';
                thumb.hidden = false;
            } else {
                thumb.removeAttribute('src');
                thumb.alt = '';
                thumb.hidden = true;
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setHeroUpdateDate();
    renderCasinoBonuses();

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

    const firstBonusCard = document.getElementById('firstBonusCard');
    const bonusSnackbar = document.getElementById('bonusSnackbar');
    if (firstBonusCard && bonusSnackbar) {
        const snackObserver = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    const show = !entry.isIntersecting;
                    bonusSnackbar.classList.toggle('bonus-snackbar--visible', show);
                    document.body.classList.toggle('bonus-snackbar-open', show);
                    bonusSnackbar.setAttribute('aria-hidden', show ? 'false' : 'true');
                });
            },
            { threshold: 0, rootMargin: '0px 0px 0px 0px' }
        );
        snackObserver.observe(firstBonusCard);
    }
});
