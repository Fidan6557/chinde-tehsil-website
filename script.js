"use strict";

const SITE_CONFIG = {
  // Add digits only, including country code. Example: "994501234567"
  whatsappNumber: "994709070602",
  // Add a real form endpoint when available. The endpoint must accept JSON.
  formEndpoint: "",
  instagramUrl: "",
  email: "",
  address: "",
};

const WHATSAPP_MESSAGE =
  "Salam. Çində təhsil ilə bağlı konsultasiya almaq istəyirəm.";

const header = document.querySelector("[data-header]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const dialog = document.querySelector("[data-consultation-dialog]");
const consultationForm = document.querySelector("[data-consultation-form]");
const formStatus = document.querySelector("[data-form-status]");
let lastFocusedElement = null;

function setHeaderState() {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
}

function closeMenu() {
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Menyunu aç");
  mobileMenu?.setAttribute("aria-hidden", "true");
  mobileMenu?.classList.remove("is-open");
  header?.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
  document.querySelector("main")?.removeAttribute("inert");
  document.querySelector("footer")?.removeAttribute("inert");
}

function toggleMenu() {
  const isOpen = menuToggle?.getAttribute("aria-expanded") === "true";
  menuToggle?.setAttribute("aria-expanded", String(!isOpen));
  menuToggle?.setAttribute("aria-label", isOpen ? "Menyunu aç" : "Menyunu bağla");
  mobileMenu?.setAttribute("aria-hidden", String(isOpen));
  mobileMenu?.classList.toggle("is-open", !isOpen);
  header?.classList.toggle("menu-active", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
  document.querySelector("main")?.toggleAttribute("inert", !isOpen);
  document.querySelector("footer")?.toggleAttribute("inert", !isOpen);
}

function openDialog() {
  if (!dialog) return;
  lastFocusedElement = document.activeElement;
  closeMenu();
  dialog.showModal();
  document.body.classList.add("dialog-open");
  window.setTimeout(() => dialog.querySelector("input")?.focus(), 100);
}

function closeDialog() {
  if (!dialog?.open) return;
  dialog.close();
  document.body.classList.remove("dialog-open");
  lastFocusedElement?.focus();
}

function configureContactLinks() {
  const whatsappNumber = SITE_CONFIG.whatsappNumber.replace(/\D/g, "");
  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`
    : "";

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    if (!whatsappUrl) return;
    link.href = whatsappUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });

  document.querySelectorAll("[data-requires-whatsapp]").forEach((element) => {
    element.hidden = !whatsappUrl;
  });

  const instagram = document.querySelector("[data-instagram]");
  if (instagram && SITE_CONFIG.instagramUrl) {
    instagram.href = SITE_CONFIG.instagramUrl;
    instagram.target = "_blank";
    instagram.rel = "noopener noreferrer";
    instagram.hidden = false;
  }

  const email = document.querySelector("[data-email]");
  if (email && SITE_CONFIG.email) {
    email.href = `mailto:${SITE_CONFIG.email}`;
    email.textContent = SITE_CONFIG.email;
    email.hidden = false;
  }

  const address = document.querySelector("[data-address]");
  if (address && SITE_CONFIG.address) {
    address.textContent = SITE_CONFIG.address;
    address.hidden = false;
  }

  const hasContact = Boolean(
    whatsappUrl || SITE_CONFIG.instagramUrl || SITE_CONFIG.email || SITE_CONFIG.address,
  );
  const contactColumn = document.querySelector("[data-contact-column]");
  const footerGrid = document.querySelector(".footer-grid");
  if (contactColumn) contactColumn.hidden = !hasContact;
  footerGrid?.classList.toggle("has-contact", hasContact);
}

function setupAccordion() {
  document.querySelectorAll(".accordion-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = document.getElementById(button.getAttribute("aria-controls"));
      const isExpanded = button.getAttribute("aria-expanded") === "true";

      document.querySelectorAll(".accordion-item button").forEach((otherButton) => {
        if (otherButton === button) return;
        otherButton.setAttribute("aria-expanded", "false");
        const otherPanel = document.getElementById(otherButton.getAttribute("aria-controls"));
        if (otherPanel) otherPanel.hidden = true;
      });

      button.setAttribute("aria-expanded", String(!isExpanded));
      if (panel) panel.hidden = isExpanded;
    });
  });
}

function setupReveals() {
  const elements = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -50px" },
  );

  elements.forEach((element) => observer.observe(element));
}

const validationMessages = {
  fullName: "Ad və soyadınızı daxil edin.",
  phone: "Düzgün telefon nömrəsi daxil edin.",
  email: "Düzgün email ünvanı daxil edin.",
  level: "Təhsil səviyyəsini seçin.",
  fieldOfStudy: "Maraqlandığınız sahəni daxil edin.",
  scholarship: "Təqaüd seçimini qeyd edin.",
};

function setFieldError(field, message = "") {
  const key = field.type === "radio" ? field.name : field.id;
  const error = document.querySelector(`[data-error-for="${key}"]`);
  if (field.type !== "radio") field.setAttribute("aria-invalid", String(Boolean(message)));
  if (error) error.textContent = message;
}

function validateForm(form) {
  let isValid = true;
  const requiredFields = [...form.querySelectorAll("[required]")].filter(
    (field, index, fields) => field.type !== "radio" || fields.findIndex((item) => item.name === field.name) === index,
  );

  requiredFields.forEach((field) => {
    let valid = true;

    if (field.type === "radio") {
      valid = Boolean(form.querySelector(`input[name="${field.name}"]:checked`));
    } else if (field.name === "phone") {
      valid = field.value.replace(/\D/g, "").length >= 9;
    } else {
      valid = field.checkValidity();
    }

    setFieldError(field, valid ? "" : validationMessages[field.name]);
    if (!valid) isValid = false;
  });

  const emailField = form.elements.email;
  if (emailField.value && !emailField.checkValidity()) {
    setFieldError(emailField, validationMessages.email);
    isValid = false;
  }

  if (!isValid) {
    form.querySelector('[aria-invalid="true"]')?.focus();
  }

  return isValid;
}

function buildWhatsappFormMessage(data) {
  return [
    WHATSAPP_MESSAGE,
    "",
    `Ad və soyad: ${data.fullName}`,
    `Telefon: ${data.phone}`,
    data.email ? `Email: ${data.email}` : "",
    `Təhsil səviyyəsi: ${data.level}`,
    `Sahə: ${data.fieldOfStudy}`,
    `Təqaüd: ${data.scholarship}`,
    data.message ? `Əlavə qeyd: ${data.message}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function submitConsultation(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!validateForm(form)) return;

  const submitButton = form.querySelector('[type="submit"]');
  const buttonLabel = submitButton.querySelector("span");
  const data = Object.fromEntries(new FormData(form).entries());
  submitButton.setAttribute("aria-busy", "true");
  buttonLabel.textContent = "Göndərilir…";
  formStatus.hidden = true;
  formStatus.classList.remove("is-error");

  try {
    if (SITE_CONFIG.formEndpoint) {
      const response = await fetch(SITE_CONFIG.formEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Form endpoint returned an error.");

      form.reset();
      formStatus.textContent = "Müraciətiniz göndərildi. Sizinlə qısa zamanda əlaqə saxlanılacaq.";
      formStatus.hidden = false;
      return;
    }

    const whatsappNumber = SITE_CONFIG.whatsappNumber.replace(/\D/g, "");
    if (whatsappNumber) {
      const message = buildWhatsappFormMessage(data);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      const whatsappWindow = window.open(whatsappUrl, "_blank");

      formStatus.textContent = "WhatsApp açılır. Açılmadısa ";
      const fallbackLink = document.createElement("a");
      fallbackLink.href = whatsappUrl;
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      fallbackLink.textContent = "buraya klikləyin";
      formStatus.append(fallbackLink, ".");
      formStatus.hidden = false;

      if (whatsappWindow) {
        whatsappWindow.opener = null;
      } else {
        window.location.assign(whatsappUrl);
      }
      return;
    }

    throw new Error("Göndəriş kanalı konfiqurasiya edilməyib.");
  } catch (error) {
    formStatus.textContent =
      "Form hazırdır, lakin göndəriş kanalı hələ qoşulmayıb. Sayt sahibi əlaqə məlumatını əlavə etməlidir.";
    formStatus.classList.add("is-error");
    formStatus.hidden = false;
  } finally {
    submitButton.removeAttribute("aria-busy");
    buttonLabel.textContent = "Müraciət göndər";
  }
}

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

menuToggle?.addEventListener("click", toggleMenu);
mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

document.querySelectorAll("[data-open-consultation]").forEach((button) => {
  button.addEventListener("click", openDialog);
});

document.querySelectorAll("[data-close-consultation]").forEach((button) => {
  button.addEventListener("click", closeDialog);
});

dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closeDialog();
});

dialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeDialog();
});

consultationForm?.addEventListener("submit", submitConsultation);
consultationForm?.querySelectorAll("input, select, textarea").forEach((field) => {
  field.addEventListener("input", () => setFieldError(field));
  field.addEventListener("change", () => setFieldError(field));
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

configureContactLinks();
setupAccordion();
setupReveals();
