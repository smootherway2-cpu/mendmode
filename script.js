const root = document.documentElement;
const themeButton = document.querySelector(".theme-button");
const timeLabel = document.querySelector("#local-time");
const contactModal = document.querySelector("#contact-modal");
const contactTriggers = document.querySelectorAll(".contact-trigger");
const modalClose = document.querySelector(".modal-close");

const savedTheme = localStorage.getItem("personal-site-theme");
if (savedTheme) {
  root.dataset.theme = savedTheme;
}

themeButton.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "" : "light";

  if (nextTheme) {
    root.dataset.theme = nextTheme;
    localStorage.setItem("personal-site-theme", nextTheme);
  } else {
    delete root.dataset.theme;
    localStorage.removeItem("personal-site-theme");
  }
});

function openContactModal() {
  contactModal.hidden = false;
  modalClose.focus();
}

function closeContactModal() {
  contactModal.hidden = true;
}

contactTriggers.forEach((trigger) => {
  trigger.addEventListener("click", openContactModal);
});

modalClose.addEventListener("click", closeContactModal);

contactModal.addEventListener("click", (event) => {
  if (event.target === contactModal) {
    closeContactModal();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !contactModal.hidden) {
    closeContactModal();
  }
});

function updateTime() {
  const now = new Date();
  timeLabel.textContent = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

updateTime();
window.setInterval(updateTime, 30_000);
