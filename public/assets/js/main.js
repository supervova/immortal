// src/assets/js/modal.js
var animationDuration = 400;
var visibleModal = null;
var toggleTitleStyle = (el, root) => {
  if (window.matchMedia("(max-width: 767px)").matches) {
    const observer = new IntersectionObserver(
      ([entry]) => el.classList.toggle("is-pinned", entry.intersectionRatio < 1),
      {
        threshold: [1],
        root: document.querySelector(root),
        rootMargin: "0px 50px"
      }
    );
    observer.observe(el);
  }
};
var getExternalContent = (event) => {
  const modalExternal = document.getElementById("modal-external");
  const container = modalExternal.querySelector(".e-modal__content");
  const href = event.currentTarget.getAttribute("href");
  event.preventDefault();
  fetch(href).then((response) => response.text()).then((html) => {
    const parser = new DOMParser();
    const contentSource = parser.parseFromString(html, "text/html");
    const content = contentSource.querySelector(".content").innerHTML;
    container.insertAdjacentHTML("beforeend", content);
  });
  modalExternal.addEventListener("close", () => {
    container.innerHTML = "";
  });
};
var closeModal = (modal) => {
  if (!modal || modal.hasAttribute("closing")) {
    return;
  }
  visibleModal = null;
  modal.setAttribute("closing", "");
  modal.addEventListener(
    "transitionend",
    () => {
      modal.removeAttribute("closing");
      if (typeof modal.close === "function") {
        modal.close();
      }
    },
    { once: true }
  );
};
var openModal = (modal) => {
  setTimeout(() => {
    visibleModal = modal;
  }, animationDuration);
  modal.showModal();
  const header = modal.querySelector("header");
  if (header) {
    toggleTitleStyle(header, ".e-modal[open]");
  }
};
var modalToggle = (event) => {
  const trigger = event.currentTarget;
  const isLink = trigger.hasAttribute("href");
  const win = trigger.getAttribute("data-target");
  const modal = document.getElementById(win);
  event.preventDefault();
  if (modal.open) {
    closeModal(modal);
  } else {
    openModal(modal);
  }
  if (isLink) {
    getExternalContent(event);
  }
};
var initModals = () => {
  document.addEventListener("click", (event) => {
    if (!visibleModal) return;
    const modalContent = visibleModal.firstElementChild;
    const isClickInside = modalContent.contains(event.target);
    if (!isClickInside) {
      closeModal(visibleModal);
    }
  });
  document.querySelectorAll('[data-role="close-modal"]').forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const modal = event.currentTarget.closest(".e-modal");
      closeModal(modal);
    });
  });
  document.querySelectorAll('[data-role="open-modal"]').forEach((elem) => {
    elem.addEventListener("click", (event) => {
      modalToggle(event);
    });
  });
};
var modal_default = initModals;

// src/assets/js/drawer.js
var initDrawer = () => {
  document.addEventListener("click", (event) => {
    const openButton = event.target.closest('[data-role="open-drawer"]');
    if (openButton) {
      const targetId = openButton.dataset.target;
      const drawer = document.getElementById(targetId);
      if (drawer) {
        drawer.classList.toggle("is-open");
      }
    }
  });
  document.addEventListener("click", (event) => {
    const closeButton = event.target.closest('[data-role="close-drawer"]');
    if (closeButton) {
      const drawer = closeButton.closest('[data-role="drawer"]');
      if (drawer) {
        drawer.classList.remove("is-open");
      }
    }
    const openDrawer = document.querySelector('[data-role="drawer"].is-open');
    if (openDrawer && !openDrawer.contains(event.target)) {
      const openButton = event.target.closest('[data-role="open-drawer"]');
      if (!openButton) {
        openDrawer.classList.remove("is-open");
      }
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openDrawer = document.querySelector('[data-role="drawer"].is-open');
      if (openDrawer) {
        openDrawer.classList.remove("is-open");
      }
    }
  });
};
var drawer_default = initDrawer;

// src/assets/js/flayout.js
function initFlayouts() {
  const flayouts = Array.from(
    document.querySelectorAll('[data-role="flayout"]')
  );
  document.addEventListener("click", (event) => {
    flayouts.forEach((el) => {
      if (!el.contains(event.target)) {
        el.removeAttribute("open");
      }
    });
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Esc" || event.key === "Escape") {
      const openFlayout = document.querySelector('[data-role="flayout"][open]');
      if (openFlayout) {
        openFlayout.removeAttribute("open");
      }
    }
  });
}

// src/assets/js/chat.js
function initTextareaAutoResize(textareaSelector, sendButtonSelector, formSelector) {
  const chatInput = document.querySelector(textareaSelector);
  const sendButton = document.querySelector(sendButtonSelector);
  const form = document.querySelector(formSelector);
  if (!chatInput || !sendButton || !form) {
    return;
  }
  const initialHeight = chatInput.offsetHeight;
  const resizeTextarea = () => {
    chatInput.style.height = "auto";
    const maxHeight = parseInt(getComputedStyle(chatInput).maxHeight, 10);
    const newHeight = Math.min(chatInput.scrollHeight, maxHeight);
    chatInput.style.height = `${newHeight}px`;
  };
  chatInput.addEventListener("input", () => {
    resizeTextarea();
    const hasContent = chatInput.value.trim() !== "";
    sendButton.disabled = !hasContent;
  });
  const resetHeight = () => {
    chatInput.style.height = `${initialHeight}px`;
    sendButton.disabled = true;
  };
  sendButton.addEventListener("click", (e) => {
    if (chatInput.value.trim() === "") {
      e.preventDefault();
    }
  });
  chatInput.addEventListener("blur", () => {
    if (chatInput.value.trim() === "") {
      resetHeight();
    }
  });
  form.addEventListener("submit", (e) => {
    if (chatInput.value.trim() === "") {
      e.preventDefault();
    }
  });
}
var chat_default = initTextareaAutoResize;

// src/assets/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  initFlayouts();
  modal_default();
  drawer_default();
  chat_default(
    ".is-chat-input textarea",
    ".is-chat-input .e-btn",
    ".e-form.is-chat-input"
  );
});
export {
  openModal
};
