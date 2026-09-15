const root = document.documentElement;
const themeButton = document.querySelector(".theme-button");
const timeLabel = document.querySelector("#local-time");
const contactModal = document.querySelector("#contact-modal");
const contactTriggers = document.querySelectorAll(".contact-trigger");
const modalClose = document.querySelector(".modal-close");
const contactForms = document.querySelectorAll(".contact-form");
const currencyOptions = document.querySelectorAll(".currency-option");
const priceLabels = document.querySelectorAll(".price[data-ngn]");
const exchangeRates = {
  NGN: 1,
  USD: 1325,
  GBP: 1788
};

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

function buildRequestMessage(form) {
  const data = new FormData(form);
  const name = data.get("name") || "";
  const device = data.get("device") || "";
  const selectedPackage = data.get("package") || "Not sure yet";
  const issue = data.get("issue") || "";
  const date = data.get("date") || "Not selected";
  const time = data.get("time") || "Not selected";
  const urgency = data.get("urgency") || "Normal";

  return [
    "MendMode support request",
    "",
    `Name: ${name}`,
    `Device/app: ${device}`,
    `Package: ${selectedPackage}`,
    `Issue: ${issue}`,
    `Preferred date: ${date}`,
    `Preferred time: ${time}`,
    `Urgency: ${urgency}`
  ].join("\n");
}

contactForms.forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) {
      return;
    }

    const submitter = event.submitter;
    const message = buildRequestMessage(form);

    if (submitter?.dataset.send === "whatsapp") {
      window.location.href = `https://wa.me/2348143656972?text=${encodeURIComponent(message)}`;
      return;
    }

    const subject = encodeURIComponent("MendMode support request");
    const body = encodeURIComponent(message);
    window.location.href = `mailto:mendmodehelp@gmail.com?subject=${subject}&body=${body}`;
  });
});

function formatPrice(amount, currency) {
  if (currency === "NGN") {
    return `From NGN ${Math.round(amount).toLocaleString("en-NG")}`;
  }

  const converted = amount / exchangeRates[currency];
  return `About ${new Intl.NumberFormat("en", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(converted)}`;
}

function updateCurrency(currency) {
  priceLabels.forEach((label) => {
    const amount = Number(label.dataset.ngn);
    label.textContent = formatPrice(amount, currency);
  });

  currencyOptions.forEach((option) => {
    option.classList.toggle("active", option.dataset.currency === currency);
  });
}

currencyOptions.forEach((option) => {
  option.addEventListener("click", () => {
    updateCurrency(option.dataset.currency);
  });
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
