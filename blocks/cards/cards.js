export default async function decorate(block) {
  // Each row is a vehicle card: [image-cell, text-cell]
  // Restructure so layout is: model name, image, description, CTA
  const rows = [...block.children];
  rows.forEach((row) => {
    row.classList.add('cards-card');
    const cells = [...row.children];
    const imageCell = cells[0]; // contains <picture><img>
    const textCell = cells[1]; // contains <h3>, <p>s, CTA link

    // Extract parts from text cell
    const heading = textCell.querySelector('h3');
    const paragraphs = [...textCell.querySelectorAll('p')];
    const ctaP = paragraphs.find((p) => p.querySelector('a'));

    // Create structured card layout
    const cardTop = document.createElement('div');
    cardTop.classList.add('cards-card-top');
    if (heading) cardTop.appendChild(heading);

    const cardImage = document.createElement('div');
    cardImage.classList.add('cards-card-image');
    cardImage.append(...imageCell.childNodes);

    const cardBottom = document.createElement('div');
    cardBottom.classList.add('cards-card-bottom');
    paragraphs.forEach((p) => {
      if (p !== ctaP) cardBottom.appendChild(p);
    });
    if (ctaP) cardBottom.appendChild(ctaP);

    // Replace row contents
    row.innerHTML = '';
    row.appendChild(cardTop);
    row.appendChild(cardImage);
    row.appendChild(cardBottom);
  });
}
