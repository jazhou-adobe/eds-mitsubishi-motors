export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  // Tag image-only cells and enforce an ALTERNATING image side per row:
  // row 1 (index 0) image-left, row 2 image-right, row 3 image-left, ...
  // The image side is driven by row INDEX (not authored cell order), so the
  // promo grid reads as a clean left/right alternation regardless of how the
  // content was authored or how the DA pipeline orders the cells.
  [...block.children].forEach((row, i) => {
    // find the image cell (the column whose only content is a picture)
    let imgCell = null;
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
          imgCell = picWrapper;
        }
      }
    });

    if (imgCell) {
      const imageLeft = i % 2 === 0; // even index -> image left, odd -> image right
      row.classList.add(imageLeft ? 'columns-img-left' : 'columns-img-right');
      // Ensure DOM cell order matches the desired side so flex row (no reverse)
      // renders the image on the correct side.
      const isFirst = row.firstElementChild === imgCell;
      if (imageLeft && !isFirst) {
        row.insertBefore(imgCell, row.firstElementChild);
      } else if (!imageLeft && isFirst) {
        row.appendChild(imgCell);
      }
    }
  });
}
