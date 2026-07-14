/**
 * cards — vehicle range carousel.
 *
 * One slide visible at a time (large model name, vehicle image, description
 * + CTA). Section head (eyebrow + heading) is authored as default content in
 * the section BEFORE the block and reabsorbed here. A "N / total" counter and
 * circular prev/next arrows drive slide navigation. A grey band sits behind
 * the lower half of the vehicle image.
 *
 * Authoring rows (one per vehicle):
 *   cell 1: <picture> vehicle image
 *   cell 2: <h3> model name, <p> description(s), <p><em><a> CTA
 */
export default async function decorate(block) {
  const rows = [...block.children];

  // Build slides from authored rows
  const slides = rows.map((row) => {
    const cells = [...row.children];
    const imageCell = cells[0];
    const textCell = cells[1];
    const heading = textCell.querySelector('h3');
    const paragraphs = [...textCell.querySelectorAll('p')];
    const ctaP = paragraphs.find((p) => p.querySelector('a'));
    const bodyPs = paragraphs.filter((p) => p !== ctaP);
    return {
      picture: imageCell.querySelector('picture, img'),
      name: heading ? heading.textContent.trim() : '',
      bodyPs,
      ctaP,
    };
  });
  const total = slides.length;

  // Reabsorb the section head (eyebrow + heading) authored as default content
  // in the section before the block.
  let eyebrowText = '';
  let headingText = '';
  const sectionWrapper = block.closest('.block-content') || block.parentElement;
  const section = block.closest('.section') || (sectionWrapper && sectionWrapper.parentElement);
  let headWrapper = null;
  if (section) {
    headWrapper = section.querySelector(':scope > .default-content-wrapper, :scope > .default-content');
    if (headWrapper) {
      const hs = headWrapper.querySelectorAll('p, h1, h2, h3, h4');
      if (hs.length >= 2) {
        eyebrowText = hs[0].textContent.trim();
        headingText = hs[1].textContent.trim();
      } else if (hs.length === 1) {
        headingText = hs[0].textContent.trim();
      }
      headWrapper.remove();
    }
  }

  // Build carousel DOM
  const root = document.createElement('div');
  root.className = 'cards-carousel';

  const head = document.createElement('div');
  head.className = 'cards-head';
  if (eyebrowText) {
    const eb = document.createElement('p');
    eb.className = 'cards-eyebrow';
    eb.textContent = eyebrowText;
    head.appendChild(eb);
  }
  if (headingText) {
    const h = document.createElement('h2');
    h.className = 'cards-title';
    h.textContent = headingText;
    head.appendChild(h);
  }
  const counter = document.createElement('p');
  counter.className = 'cards-counter';
  head.appendChild(counter);
  root.appendChild(head);

  // Viewport holds the model name + image + body/CTA of the active slide
  const stage = document.createElement('div');
  stage.className = 'cards-stage';

  const prev = document.createElement('button');
  prev.type = 'button';
  prev.className = 'cards-arrow cards-arrow-prev';
  prev.setAttribute('aria-label', 'Previous vehicle');
  prev.textContent = '\u2190';

  const next = document.createElement('button');
  next.type = 'button';
  next.className = 'cards-arrow cards-arrow-next';
  next.setAttribute('aria-label', 'Next vehicle');
  next.textContent = '\u2192';

  const slidesWrap = document.createElement('div');
  slidesWrap.className = 'cards-slides';

  slides.forEach((s, i) => {
    const slide = document.createElement('div');
    slide.className = 'cards-slide';
    slide.dataset.index = String(i);

    const name = document.createElement('h3');
    name.className = 'cards-slide-name';
    name.textContent = s.name;
    slide.appendChild(name);

    const media = document.createElement('div');
    media.className = 'cards-slide-media';
    if (s.picture) media.appendChild(s.picture);
    slide.appendChild(media);

    const info = document.createElement('div');
    info.className = 'cards-slide-info';
    const copy = document.createElement('div');
    copy.className = 'cards-slide-copy';
    s.bodyPs.forEach((p) => copy.appendChild(p));
    info.appendChild(copy);
    if (s.ctaP) {
      const actions = document.createElement('div');
      actions.className = 'cards-slide-actions';
      actions.appendChild(s.ctaP);
      info.appendChild(actions);
    }
    slide.appendChild(info);

    slidesWrap.appendChild(slide);
  });

  stage.appendChild(prev);
  stage.appendChild(slidesWrap);
  stage.appendChild(next);
  root.appendChild(stage);

  block.replaceChildren(root);

  // Interaction: show one slide at a time
  let current = 0;
  const render = () => {
    [...slidesWrap.children].forEach((el, i) => {
      el.classList.toggle('is-active', i === current);
    });
    counter.textContent = `${current + 1} / ${total}`;
    prev.disabled = false;
    next.disabled = false;
  };
  prev.addEventListener('click', () => {
    current = (current - 1 + total) % total;
    render();
  });
  next.addEventListener('click', () => {
    current = (current + 1) % total;
    render();
  });
  render();
}
