(function () {
    'use strict';

    function titleCaseSegment(segment) {
        if (!segment) return '';
        return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
    }

    /**
     * First DNS label of the host (e.g. miglioricasino-nonaams from miglioricasino-nonaams.it.com).
     * Skips "www." when present.
     */
    function getBrandSlugFromHostname(hostname) {
        if (!hostname || /^\d+\.\d+\.\d+\.\d+$/.test(hostname)) {
            return null;
        }
        const lower = hostname.toLowerCase();
        const parts = lower.split('.').filter(Boolean);
        if (parts.length === 0) return null;
        let label = parts[0];
        if (label === 'www' && parts.length > 1) {
            label = parts[1];
        }
        const slug = label.replace(/[^a-z0-9-]/gi, '');
        return slug || null;
    }

    function brandFromSlug(slug) {
        const segments = slug.split('-').filter(Boolean);
        if (segments.length === 0) {
            return { slug: 'casino', main: 'Casino', accent: '', displayFull: 'Casino' };
        }
        if (segments.length === 1) {
            const main = titleCaseSegment(segments[0]);
            return { slug, main, accent: '', displayFull: main };
        }
        const main = titleCaseSegment(segments[0]);
        const accent = segments.slice(1).map(titleCaseSegment).join(' ');
        const displayFull = segments.map(titleCaseSegment).join(' ');
        return { slug, main, accent, displayFull };
    }

    function resolveBrand() {
        const override = document.documentElement.getAttribute('data-brand-slug');
        if (override && override.trim()) {
            return brandFromSlug(override.trim().toLowerCase().replace(/[^a-z0-9-]/g, ''));
        }

        const devHost = document.documentElement.getAttribute('data-dev-hostname');
        const hostname =
            window.location.hostname ||
            devHost ||
            '';

        if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '') {
            const fallback = document.documentElement.getAttribute('data-default-brand-slug') || 'miglioricasino-nonaams';
            return brandFromSlug(fallback);
        }

        const slug = getBrandSlugFromHostname(hostname);
        if (!slug) {
            const fallback = document.documentElement.getAttribute('data-default-brand-slug') || 'miglioricasino-nonaams';
            return brandFromSlug(fallback);
        }

        return brandFromSlug(slug);
    }

    function applyBrand() {
        const origin = window.location.origin || '';
        const baseUrl = origin && origin !== 'null' ? origin + '/' : '';
        const brand = resolveBrand();

        document.querySelectorAll('.brand-logo-main').forEach(el => {
            el.textContent = brand.main;
        });

        document.querySelectorAll('.brand-logo-accent').forEach(el => {
            if (brand.accent) {
                el.textContent = brand.accent;
                el.removeAttribute('hidden');
            } else {
                el.textContent = '';
                el.setAttribute('hidden', '');
            }
        });

        document.querySelectorAll('.brand-display-full').forEach(el => {
            el.textContent = brand.displayFull;
        });

        document.querySelectorAll('a.logo, a.footer-logo').forEach(el => {
            el.setAttribute('aria-label', brand.displayFull + ' — Home');
        });

        const emailLocal = 'info';
        const host = window.location.hostname || document.documentElement.getAttribute('data-dev-hostname') || 'example.com';
        const email = emailLocal + '@' + host;
        document.querySelectorAll('.brand-email').forEach(el => {
            el.textContent = email;
            el.setAttribute('href', 'mailto:' + email);
        });

        if (baseUrl) {
            const linkCanonical = document.querySelector('link[rel="canonical"]');
            if (linkCanonical) linkCanonical.setAttribute('href', baseUrl);

            document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(link => {
                link.setAttribute('href', baseUrl);
            });

            const ogUrl = document.querySelector('meta[property="og:url"]');
            if (ogUrl) ogUrl.setAttribute('content', baseUrl);
        }

        const ogSite = document.querySelector('meta[property="og:site_name"]');
        if (ogSite) ogSite.setAttribute('content', brand.displayFull);

        const baseTitle =
            'Migliori Casino Online Non AAMS 2026 – TOP Siti Sicuri con Bonus Italia | ' + brand.displayFull;
        document.title = baseTitle;

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute(
                'content',
                'Migliori Casino Online Non AAMS 2026 – TOP Siti Sicuri con Bonus | ' + brand.displayFull
            );
        }

        const twTitle = document.querySelector('meta[name="twitter:title"]');
        if (twTitle) {
            twTitle.setAttribute(
                'content',
                'Migliori Casino Online Non AAMS 2026 – TOP Siti Sicuri Italia | ' + brand.displayFull
            );
        }

        const schemaEl = document.getElementById('schema-website');
        if (schemaEl && baseUrl) {
            try {
                const data = JSON.parse(schemaEl.textContent);
                data.name = brand.displayFull;
                data.url = baseUrl;
                if (data.potentialAction && data.potentialAction.target) {
                    data.potentialAction.target = baseUrl + '?s={search_term_string}';
                }
                schemaEl.textContent = JSON.stringify(data);
            } catch (e) {
                /* ignore */
            }
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyBrand);
    } else {
        applyBrand();
    }
})();
