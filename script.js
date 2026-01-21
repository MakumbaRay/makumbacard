document.getElementById('card-number').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
    
    // Actualizar la vista previa
    document.getElementById('card-number-preview').textContent = formattedValue || '•••• •••• •••• ••••';
});

document.getElementById('expiry').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
    
    // Actualizar la vista previa
    document.getElementById('card-expiry-preview').textContent = value || 'MM/AA';
});

document.getElementById('cvc').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    e.target.value = value;
    
    // Actualizar la vista previa
    document.getElementById('card-cvc-preview').textContent = value ? '•'.repeat(value.length) : '•••';
});

// Manejar el envío del formulario
document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevenir el envío normal del formulario
    
    // Obtener los valores del formulario
    const cardNumber = document.getElementById('card-number').value;
    const expiry = document.getElementById('expiry').value;
    const cvc = document.getElementById('cvc').value;
    
    // Validación básica
    if (cardNumber.replace(/\s/g, '').length < 13) {
        showMessage('error', 'Por favor, ingresa un número de tarjeta válido.');
        return;
    }
    
    if (!expiry.match(/^\d{2}\/\d{2}$/)) {
        showMessage('error', 'Por favor, ingresa una fecha de vencimiento válida (MM/AA).');
        return;
    }
    
    // Simular el envío del formulario (en una aplicación real, aquí enviarías los datos a un servidor)
    setTimeout(function() {
        // Mostrar mensaje de éxito
        showMessage('success', '¡Tarjeta agregada exitosamente! Gracias por tu información.');
        
        // Limpiar el formulario
        document.getElementById('payment-form').reset();
        
        // Restablecer la vista previa
        document.getElementById('card-number-preview').textContent = '•••• •••• •••• ••••';
        document.getElementById('card-expiry-preview').textContent = 'MM/AA';
        document.getElementById('card-cvc-preview').textContent = '•••';
    }, 1000);
});

// Función para mostrar mensajes de éxito o error
function showMessage(type, message) {
    const successMessage = document.getElementById('success-message');
    const errorMessage = document.getElementById('error-message');
    
    // Ocultar ambos mensajes
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';
    
    // Mostrar el mensaje correspondiente
    if (type === 'success') {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
    } else if (type === 'error') {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(function() {
        successMessage.style.display = 'none';
        errorMessage.style.display = 'none';
    }, 5000);
}