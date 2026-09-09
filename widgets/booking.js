/**
 * Booking engine widget for the Saudia homepage.
 * Static, structural implementation of the flight-booking search panel:
 * tabbed sections, trip-type toggles, Book-with-Miles switch, From/To fields
 * with a swap control, and quick links. Interactive behaviour is limited to
 * tab switching and swapping the origin/destination values.
 * @param {Element} widget The widget block element (contains the loaded HTML)
 */
export default function decorate(widget) {
  const tabs = widget.querySelectorAll('.booking-tab');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('is-active'));
      tab.classList.add('is-active');
    });
  });

  const swap = widget.querySelector('.booking-swap');
  const from = widget.querySelector('#booking-from');
  const to = widget.querySelector('#booking-to');
  if (swap && from && to) {
    swap.addEventListener('click', () => {
      const tmp = from.value;
      from.value = to.value;
      to.value = tmp;
    });
  }
}
