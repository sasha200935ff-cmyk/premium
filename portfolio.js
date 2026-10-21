(() => {
  const filters = document.getElementById('filters');
  const grid = document.getElementById('portfolioGrid');
  if (!filters || !grid) return;

  filters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    filters.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const cat = btn.dataset.category;
    grid.querySelectorAll('.project-card, .work-card').forEach((card) => {
      const show = cat === 'all' || card.dataset.category === cat;
      card.style.display = show ? '' : 'none';
      if (show) {
        card.classList.remove('visible');
        requestAnimationFrame(() => card.classList.add('visible'));
      }
    });
  });
})();
