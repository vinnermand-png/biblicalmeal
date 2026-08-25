/**
 * Premium digital-book reader polish.
 *
 * Keeps the existing reader renderer but corrects the desktop spread model:
 * - page 1 + 2 is the first spread
 * - next/previous moves by complete spreads
 * - the first/last single page is handled without asymmetrical navigation
 * - switching between spread and single modes preserves the current reading area
 * - hidden left slot is reset when returning to spread mode
 */
export function initBookReaderPolish(): void {
  const reader = document.getElementById('book-reader');
  if (!reader || reader.dataset.polishReady === 'true') return;

  const pagesContainer = document.getElementById('reader-pages');
  const slotLeft = document.getElementById('slot-left');
  const slotRight = document.getElementById('slot-right');
  const prevBtn = document.getElementById('reader-prev') as HTMLButtonElement | null;
  const nextBtn = document.getElementById('reader-next') as HTMLButtonElement | null;
  const counter = document.getElementById('reader-counter');
  const openBtn = document.getElementById('reader-open');
  const cover = document.getElementById('reader-cover');
  const controls = document.getElementById('reader-controls');

  if (!pagesContainer || !slotLeft || !slotRight || !prevBtn || !nextBtn || !counter) return;

  const renderedMap = new Map<string, HTMLElement>();
  reader.querySelectorAll<HTMLElement>('.book-reader__rendered').forEach((element) => {
    const id = element.dataset.physicalId;
    if (id) renderedMap.set(id, element);
  });

  const rawMeta = (window as Window & {
    __BM_PAGE_META?: Array<{ id: string; type: string; bookPageId: string; title: string }>;
    __BM_TOTAL?: number;
  }).__BM_PAGE_META;
  const total = (window as Window & { __BM_TOTAL?: number }).__BM_TOTAL ?? rawMeta?.length ?? 0;

  if (!rawMeta || total === 0) return;

  const meta = rawMeta.slice(0, total);
  let spreadStart = 0;
  let singleIndex = 0;
  let opened = false;
  let lastMode: 'spread' | 'single' | null = null;

  const isSpread = (): boolean => window.innerWidth >= 1080;

  function slotInner(slot: HTMLElement): HTMLElement | null {
    return slot.querySelector('.book-page-inner');
  }

  function clearSlot(slot: HTMLElement): void {
    const inner = slotInner(slot);
    if (inner) inner.innerHTML = '';
    slot.style.visibility = 'hidden';
    slot.style.display = 'none';
    slot.setAttribute('aria-hidden', 'true');
  }

  function fillSlot(slot: HTMLElement, index: number | null): void {
    const inner = slotInner(slot);
    if (!inner || index == null || index < 0 || index >= meta.length) {
      clearSlot(slot);
      return;
    }

    const page = meta[index];
    const rendered = renderedMap.get(page.id);

    slot.style.display = '';
    slot.style.visibility = 'visible';
    slot.removeAttribute('aria-hidden');

    inner.className = 'book-page-inner';
    if (
      page.type === 'front-matter' ||
      page.type === 'chapter-opener' ||
      page.type === 'recipe-hero' ||
      page.type === 'back-matter' ||
      page.type === 'preview-boundary'
    ) {
      inner.classList.add('book-page-inner--centered');
    }

    if (rendered) {
      inner.innerHTML = rendered.innerHTML;
    } else {
      inner.innerHTML = `<div class="book-page-placeholder">${page.title}</div>`;
    }
  }

  function normalizeStart(index: number): number {
    if (total <= 1) return 0;
    const even = Math.max(0, Math.min(index, total - 1));
    return even % 2 === 0 ? even : even - 1;
  }

  function renderSpread(start: number): void {
    spreadStart = normalizeStart(start);
    clearSlot(slotLeft);
    clearSlot(slotRight);

    fillSlot(slotLeft, spreadStart);
    if (spreadStart + 1 < total) fillSlot(slotRight, spreadStart + 1);

    pagesContainer.classList.add('book-reader__pages--spread');
    pagesContainer.classList.remove('book-reader__pages--single');
    updateControls('spread');
  }

  function renderSingle(index: number): void {
    singleIndex = Math.max(0, Math.min(index, total - 1));
    clearSlot(slotLeft);
    fillSlot(slotRight, singleIndex);

    pagesContainer.classList.remove('book-reader__pages--spread');
    pagesContainer.classList.add('book-reader__pages--single');
    updateControls('single');
  }

  function updateControls(mode: 'spread' | 'single'): void {
    if (mode === 'spread') {
      const left = spreadStart + 1;
      const right = Math.min(total, spreadStart + 2);
      counter.textContent = left === right ? `${left} / ${total}` : `${left}–${right} / ${total}`;
      prevBtn.disabled = spreadStart === 0;
      nextBtn.disabled = spreadStart + 2 >= total;
      return;
    }

    counter.textContent = `${singleIndex + 1} / ${total}`;
    prevBtn.disabled = singleIndex === 0;
    nextBtn.disabled = singleIndex >= total - 1;
  }

  function showCurrent(): void {
    const mode = isSpread() ? 'spread' : 'single';
    if (mode === lastMode) {
      if (mode === 'spread') renderSpread(spreadStart);
      else renderSingle(singleIndex);
      return;
    }

    if (mode === 'spread') {
      spreadStart = normalizeStart(singleIndex);
      renderSpread(spreadStart);
    } else {
      singleIndex = Math.min(total - 1, spreadStart + 1 < total ? spreadStart : total - 1);
      renderSingle(singleIndex);
    }
    lastMode = mode;
  }

  function openReader(): void {
    if (opened) return;
    opened = true;
    reader.dataset.polishReady = 'true';
    if (cover) cover.hidden = true;
    pagesContainer.hidden = false;
    if (controls) controls.hidden = false;
    lastMode = null;
    showCurrent();
  }

  // Take over the existing controls in capture phase so the original reader
  // listeners cannot advance a different page model underneath us.
  const interceptButton = (button: HTMLButtonElement, direction: -1 | 1): void => {
    button.addEventListener(
      'click',
      (event) => {
        if (!opened) return;
        event.preventDefault();
        event.stopImmediatePropagation();

        if (isSpread()) {
          const nextStart = direction > 0 ? spreadStart + 2 : spreadStart - 2;
          if (nextStart >= 0 && nextStart < total) renderSpread(nextStart);
        } else {
          const nextIndex = singleIndex + direction;
          if (nextIndex >= 0 && nextIndex < total) renderSingle(nextIndex);
        }
      },
      true,
    );
  };

  if (openBtn instanceof HTMLButtonElement) {
    openBtn.addEventListener('click', (event) => {
      event.stopImmediatePropagation();
      openReader();
    }, true);
  }

  interceptButton(prevBtn, -1);
  interceptButton(nextBtn, 1);

  document.addEventListener(
    'keydown',
    (event) => {
      if (!opened || pagesContainer.hidden) return;
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      event.preventDefault();
      event.stopImmediatePropagation();

      const direction = event.key === 'ArrowRight' ? 1 : -1;
      if (isSpread()) {
        const nextStart = direction > 0 ? spreadStart + 2 : spreadStart - 2;
        if (nextStart >= 0 && nextStart < total) renderSpread(nextStart);
      } else {
        const nextIndex = singleIndex + direction;
        if (nextIndex >= 0 && nextIndex < total) renderSingle(nextIndex);
      }
    },
    true,
  );

  let resizeTimer: number | undefined;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (opened) showCurrent();
    }, 120);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBookReaderPolish, { once: true });
} else {
  initBookReaderPolish();
}
