export default async function decorate(widget) {
  // The quicklinks widget is primarily CSS-driven.
  // Add any interactive behavior here (e.g., hide on scroll to footer).
  const items = widget.querySelectorAll('.quicklinks-item');
  items.forEach((item) => {
    item.setAttribute('role', 'link');
  });
}
