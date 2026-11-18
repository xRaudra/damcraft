(() => {
  const services = [
    ['brand-strategy', 'Brand Strategy', 6, '4b2d1f94-5d38-412b-b423-34f0018f9cbe.webp'],
    ['brand-identity', 'Brand Identity', 5, '838ae005-fc2e-43d6-a92b-3b43fa9c7398.webp'],
    ['user-experience-design', 'User Experience Design', 6, '85161894-b306-4744-8ff5-58426990d8d2.webp'],
    ['visual-content', 'Visual Content', 3, 'ab339f08-0b2c-497e-a2fb-2650246adf99.png'],
    ['web-development', 'Web Development', 7, 'fa82836e-77f6-4774-98b0-42e10a035d07.webp'],
    ['ecommerce', 'eCommerce', 7, 'fc13a555-159b-4672-bb22-99bb3a99e823.webp'],
    ['web-mobile-applications', 'Web & Mobile Applications', 6, '876350ec-7829-42c2-a164-7a81695d4e2b.png'],
    ['embedded-hardware', 'Embedded & Hardware', 5, '7e2e197d-c7d5-4a71-96ef-d81b13a46f96.webp'],
  ];
  const nav = document.querySelector('.replica-nav > nav');
  const servicesLink = nav?.querySelector('a[href="/services"]');
  if (!servicesLink) return;

  const icon = slug => `<svg class="service-icon" viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="/assets/services-icons.svg#${slug}"></use></svg>`;
  const cards = items => items.map(([slug, title, count, image]) => `<a class="services-card" href="/services/${slug}" style="--service-image:url('/media/${image}')"><span class="services-card-heading"><span class="services-card-title">${icon(slug)}<span>${title.replaceAll('&', '&amp;')}</span></span><span class="services-card-count">/${count} services</span></span></a>`).join('');
  const row = document.createElement('div');
  row.className = 'primary-nav-row';
  const servicesItem = document.createElement('div');
  servicesItem.className = 'services-nav-item';
  servicesLink.textContent = 'Services';
  servicesLink.setAttribute('aria-controls', 'services-dropdown');
  servicesLink.setAttribute('aria-expanded', 'false');
  servicesItem.append(servicesLink);
  row.append(servicesItem);
  [...nav.querySelectorAll(':scope > a')].forEach(link => row.append(link));
  const panel = document.createElement('div');
  panel.id = 'services-dropdown';
  panel.className = 'services-dropdown';
  panel.setAttribute('role', 'region');
  panel.setAttribute('aria-label', 'Services');
  panel.hidden = true;
  panel.innerHTML = `<div class="services-column">${cards(services.slice(0, 4))}</div><div class="services-column">${cards(services.slice(4))}</div>`;
  nav.classList.add('primary-nav');
  nav.replaceChildren(row, panel);

  let open = false;
  let closeTimer;
  const setOpen = (value, restoreFocus = false) => {
    clearTimeout(closeTimer);
    open = value;
    panel.hidden = !value;
    nav.classList.toggle('services-open', value);
    servicesLink.setAttribute('aria-expanded', String(value));
    if (restoreFocus) servicesLink.focus({ preventScroll: true });
  };
  const focusFirst = () => requestAnimationFrame(() => panel.querySelector('a')?.focus({ preventScroll: true }));
  servicesItem.addEventListener('pointerenter', event => {
    if (event.pointerType === 'mouse' && matchMedia('(hover: hover)').matches) setOpen(true);
  });
  nav.addEventListener('pointerenter', () => clearTimeout(closeTimer));
  nav.addEventListener('pointerleave', () => {
    if (!panel.contains(document.activeElement)) closeTimer = setTimeout(() => setOpen(false), 160);
  });
  row.querySelectorAll(':scope > a').forEach(link => {
    link.addEventListener('pointerenter', () => setOpen(false));
    link.addEventListener('focus', () => setOpen(false));
  });
  servicesItem.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || (event.key === ' ' && event.target === servicesLink)) {
      event.preventDefault();
      setOpen(true);
      focusFirst();
    }
  });
  nav.addEventListener('focusout', event => {
    if (!nav.contains(event.relatedTarget)) setOpen(false);
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false, nav.contains(document.activeElement));
    }
  });
  matchMedia('(max-width: 767px)').addEventListener('change', () => setOpen(false));

  const drawer = document.querySelector('.replica-menu');
  const mobileLink = drawer?.querySelector('nav > a[href="/services"]');
  if (!mobileLink) return;
  const group = document.createElement('div');
  group.className = 'mobile-services-group';
  group.innerHTML = `<button class="mobile-services-trigger" type="button" aria-label="Services" aria-expanded="false" aria-controls="mobile-services-dropdown"><small aria-hidden="true">01</small><span>Services</span><span class="mobile-services-mark" aria-hidden="true">+</span></button><div id="mobile-services-dropdown" class="mobile-services-panel" hidden><a class="mobile-services-all" href="/services">Explore all services <span aria-hidden="true">↗</span></a>${services.map(([slug, title]) => `<a href="/services/${slug}">${icon(slug)}<span>${title.replaceAll('&', '&amp;')}</span></a>`).join('')}</div>`;
  mobileLink.replaceWith(group);
  const mobileToggle = group.querySelector('button');
  const mobilePanel = group.querySelector('.mobile-services-panel');
  const setMobileOpen = value => {
    mobilePanel.hidden = !value;
    mobileToggle.setAttribute('aria-expanded', String(value));
    mobileToggle.querySelector('.mobile-services-mark').textContent = value ? '−' : '+';
  };
  mobileToggle.addEventListener('click', () => setMobileOpen(mobilePanel.hidden));
  document.querySelector('.menu-toggle')?.addEventListener('click', () => { setOpen(false); setMobileOpen(false); });
  drawer.querySelector('.menu-top button')?.addEventListener('click', () => setMobileOpen(false));
  document.addEventListener('keydown', event => { if (event.key === 'Escape') setMobileOpen(false); });
})();
