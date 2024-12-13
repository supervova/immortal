// src/assets/js/collapsibleText.js
function initCollapsibleText() {
  const showChar = 160;
  const textMore = "More";
  const textLess = "Less";
  const collapsibleText = document.querySelectorAll(".e-collapsible");
  collapsibleText.forEach((input) => {
    const element = input;
    const content = element.innerHTML;
    if (content.length > showChar) {
      const visibleText = content.slice(0, showChar);
      const hiddenText = content.slice(showChar);
      const html = `
        <span class="e-collapsible__visible">${visibleText}\u2026</span>
        <span class="e-collapsible__body">
          <span class="e-collapsible__hidden">${hiddenText}</span>
          <button class="e-collapsible__toggle" type="button">${textMore}</button>
        </span>
      `;
      element.innerHTML = html;
    }
  });
  document.addEventListener("click", (event) => {
    const { target } = event;
    if (target.classList.contains("e-collapsible__toggle")) {
      event.preventDefault();
      const collapsibleToggle = target;
      const collapsibleBody = collapsibleToggle.closest(".e-collapsible__body");
      const hiddenContent = collapsibleBody.querySelector(
        ".e-collapsible__hidden"
      );
      const visibleContent = collapsibleBody.previousElementSibling;
      if (collapsibleToggle.classList.contains("is-less")) {
        collapsibleToggle.classList.remove("is-less");
        collapsibleToggle.textContent = textMore;
        hiddenContent.style.display = "none";
        visibleContent.style.display = "inline";
      } else {
        collapsibleToggle.classList.add("is-less");
        collapsibleToggle.textContent = textLess;
        hiddenContent.style.display = "inline";
        visibleContent.style.display = "none";
      }
    }
  });
}
var collapsibleText_default = initCollapsibleText;

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
  const profileMenuId = "header-profile-menu";
  document.addEventListener("click", (event) => {
    flayouts.forEach((el) => {
      if (el.id === profileMenuId && window.innerWidth < 768) {
        return;
      }
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

// src/assets/js/header.js
function toggleProfileMenuOnResize() {
  const details = document.getElementById("header-profile-menu");
  if (!details) return;
  if (window.innerWidth < 768) {
    details.setAttribute("open", "open");
  } else {
    details.removeAttribute("open");
  }
}
function initProfileMenuHandler() {
  toggleProfileMenuOnResize();
  window.addEventListener("resize", toggleProfileMenuOnResize);
}
var initSearchHandler = () => {
  const searchToggleButtons = document.querySelectorAll(
    '[data-role="search-toggle"]'
  );
  let backdrop;
  const createBackdrop = () => {
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "backdrop";
      document.body.appendChild(backdrop);
    }
    backdrop.classList.add("is-on");
  };
  const removeBackdrop = () => {
    if (backdrop) {
      backdrop.classList.remove("is-on");
    }
  };
  searchToggleButtons.forEach((button) => {
    button.addEventListener("click", (clickEvent) => {
      clickEvent.stopPropagation();
      const targetId = button.getAttribute("data-target");
      const searchForm = document.getElementById(targetId);
      if (searchForm && searchForm.getAttribute("role") === "search") {
        const handleOutsideClick = (e) => {
          if (e.type === "keydown" && e.key !== "Escape" || e.type === "click" && searchForm.contains(e.target)) {
            return;
          }
          searchForm.classList.remove("is-open");
          removeBackdrop();
          document.removeEventListener("keydown", handleOutsideClick);
          document.removeEventListener("click", handleOutsideClick);
        };
        if (searchForm.classList.contains("is-open")) {
          searchForm.classList.remove("is-open");
          removeBackdrop();
          document.removeEventListener("keydown", handleOutsideClick);
          document.removeEventListener("click", handleOutsideClick);
          return;
        }
        searchForm.classList.add("is-open");
        createBackdrop();
        const input = searchForm.querySelector('input[type="search"]');
        if (input) input.focus();
        document.addEventListener("keydown", handleOutsideClick);
        document.addEventListener("click", handleOutsideClick, { once: true });
      }
    });
  });
  const searchForms = document.querySelectorAll('[role="search"]');
  searchForms.forEach((form) => {
    form.addEventListener("click", (formClickEvent) => {
      formClickEvent.stopPropagation();
    });
  });
};

// src/assets/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  initFlayouts();
  modal_default();
  drawer_default();
  initSearchHandler();
  initProfileMenuHandler();
  collapsibleText_default();
  chat_default(
    ".is-chat-input textarea",
    ".is-chat-input .e-btn",
    ".e-form.is-chat-input"
  );
  const page = document.querySelector(".e-page");
  const currentPageClass = page?.classList[1];
  if (currentPageClass) {
    const activeMenuItems = document.querySelectorAll(
      `.e-menu__item.${currentPageClass}`
    );
    activeMenuItems.forEach((item) => {
      item.classList.add("is-active");
    });
  }
});
export {
  openModal
};
