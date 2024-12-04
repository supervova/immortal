/**
 * Drawer functionality
 * @module drawer
 */

/**
 * Initialize drawer functionality
 */
const initDrawer = () => {
  // Handle opening drawers
  document.addEventListener('click', (event) => {
    const openButton = event.target.closest('[data-role="open-drawer"]');
    if (openButton) {
      const targetId = openButton.dataset.target;
      const drawer = document.getElementById(targetId);

      if (drawer) {
        drawer.classList.toggle('is-open');
      }
    }
  });

  // Handle closing drawers
  document.addEventListener('click', (event) => {
    const closeButton = event.target.closest('[data-role="close-drawer"]');
    if (closeButton) {
      const drawer = closeButton.closest('[data-role="drawer"]');
      if (drawer) {
        drawer.classList.remove('is-open');
      }
    }

    // Close drawer when clicking outside
    const openDrawer = document.querySelector('[data-role="drawer"].is-open');
    if (openDrawer && !openDrawer.contains(event.target)) {
      const openButton = event.target.closest('[data-role="open-drawer"]');
      if (!openButton) {
        openDrawer.classList.remove('is-open');
      }
    }
  });

  // Handle ESC key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const openDrawer = document.querySelector('[data-role="drawer"].is-open');
      if (openDrawer) {
        openDrawer.classList.remove('is-open');
      }
    }
  });
};

// Export the initialization function
export default initDrawer;
