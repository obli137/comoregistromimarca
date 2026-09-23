const WHATSAPP_NUMBER = "5491140995952";
const STEP_LABELS = ["Nombre", "Marca", "Productos y servicios"];

function sanitizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}

function setError(elementId, message) {
  const error = document.getElementById(elementId);
  if (!error) {
    return;
  }

  if (!message) {
    error.textContent = "";
    error.classList.add("hidden");
    return;
  }

  error.textContent = message;
  error.classList.remove("hidden");
}

function buildWhatsAppMessage({ name, brand, products }) {
  const lines = [
    "Hola, quiero registrar mi marca.",
    "",
    `Nombre: ${name}`,
  ];

  if (brand) {
    lines.push(`Marca: ${brand}`);
  }

  lines.push(`Productos y/o servicios: ${products}`);
  return lines.join("\n");
}

function initLeadForm() {
  const form = document.getElementById("lead-form");
  if (!form) {
    return;
  }

  const steps = Array.from(form.querySelectorAll(".step"));
  const currentStepEl = document.getElementById("step-current");
  const stepLabelEl = document.getElementById("step-label");
  const progressEl = document.getElementById("step-progress");
  const fullNameInput = document.getElementById("fullName");
  const brandNameInput = document.getElementById("brandName");
  const productsInput = document.getElementById("products");
  let currentStep = 1;

  function showStep(stepNumber) {
    currentStep = stepNumber;
    steps.forEach((step) => {
      const isActive = Number(step.dataset.step) === stepNumber;
      step.classList.toggle("hidden", !isActive);
    });

    currentStepEl.textContent = String(stepNumber);
    stepLabelEl.textContent = STEP_LABELS[stepNumber - 1];
    progressEl.style.width = `${Math.round((stepNumber / steps.length) * 100)}%`;

    const activeStep = steps.find((step) => Number(step.dataset.step) === stepNumber);
    const focusable = activeStep?.querySelector("input, textarea");
    focusable?.focus();
  }

  function validateCurrentStep() {
    if (currentStep === 1) {
      const name = sanitizeText(fullNameInput.value);
      if (name.length < 2) {
        setError("fullName-error", "Ingresá tu nombre completo.");
        fullNameInput.focus();
        return false;
      }
      setError("fullName-error", "");
      return true;
    }

    if (currentStep === 3) {
      const products = sanitizeText(productsInput.value);
      if (products.length < 2) {
        setError("products-error", "Contanos qué productos y/o servicios ofrece tu marca.");
        productsInput.focus();
        return false;
      }
      setError("products-error", "");
      return true;
    }

    return true;
  }

  form.addEventListener("click", (event) => {
    const nextButton = event.target.closest("[data-next]");
    const backButton = event.target.closest("[data-back]");

    if (nextButton) {
      if (!validateCurrentStep()) {
        return;
      }
      showStep(Math.min(currentStep + 1, steps.length));
      return;
    }

    if (backButton) {
      showStep(Math.max(currentStep - 1, 1));
    }
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateCurrentStep()) {
      return;
    }

    const name = sanitizeText(fullNameInput.value);
    const brand = sanitizeText(brandNameInput.value);
    const products = sanitizeText(productsInput.value);
    const message = buildWhatsAppMessage({ name, brand, products });
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  });

  showStep(1);
}

document.addEventListener("DOMContentLoaded", initLeadForm);
