document.addEventListener('DOMContentLoaded', function() {
    const recoveryForm = document.getElementById('recoveryForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const successMessage = document.getElementById('successMessage');
    const submitButton = recoveryForm.querySelector('button[type="submit"]');
    const submitButtonText = submitButton.innerHTML;

    // Función para simular delay
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Función para mostrar error
    function showError(message) {
        emailError.textContent = message;
        emailError.style.display = 'block';
        emailInput.classList.add('error');
        emailInput.classList.remove('success');
    }

    // Función para mostrar éxito
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        emailInput.classList.remove('error');
        emailInput.classList.add('success');
        emailError.style.display = 'none';
    }

    // Función para validar email
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Mostrar estado de carga
    function setLoading(isLoading) {
        if (isLoading) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
        } else {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    // Manejo del envío del formulario
    if (recoveryForm) {
        recoveryForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            // Validar email
            if (!email) {
                showError('El correo electrónico es requerido');
                return;
            }
            
            if (!validateEmail(email)) {
                showError('Ingresa un correo electrónico válido');
                return;
            }

            setLoading(true);
            
            try {
                // Simular delay de red
                await delay(1000);
                
                // Verificar si el email existe en los usuarios registrados
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const user = users.find(u => u.email === email);
                
                if (user) {
                    // Generar código temporal de recuperación (6 dígitos)
                    const recoveryCode = Math.floor(100000 + Math.random() * 900000);
                    
                    // Guardar el código en localStorage (en una aplicación real esto se haría en el backend)
                    const recoveryData = JSON.parse(localStorage.getItem('recoveryData') || '{}');
                    recoveryData[email] = {
                        code: recoveryCode,
                        timestamp: Date.now()
                    };
                    localStorage.setItem('recoveryData', JSON.stringify(recoveryData));
                    
                    // En una aplicación real, aquí enviaríamos un email con el código
                    // Por ahora, solo mostraremos el código en la interfaz
                    showSuccess(`Se ha enviado un código de recuperación a tu correo electrónico. Por motivos de demostración, el código es: ${recoveryCode}`);
                    
                    // Limpiar el formulario
                    emailInput.value = '';
                    
                    // Redirigir después de 5 segundos
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 5000);
                } else {
                    showError('No existe una cuenta asociada a este correo electrónico');
                }
            } catch (error) {
                showError('Ocurrió un error. Por favor intenta nuevamente.');
            } finally {
                setLoading(false);
                submitButton.innerHTML = submitButtonText;
            }
        });
    }

    // Limpiar mensajes al escribir
    emailInput.addEventListener('input', function() {
        emailError.style.display = 'none';
        successMessage.style.display = 'none';
        this.classList.remove('error', 'success');
    });
}); 