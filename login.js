// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a elementos del formulario
    const loginForm = document.getElementById('loginForm');
    const inputs = {
        email: document.getElementById('email'),
        password: document.getElementById('password')
    };
    
    // Obtener referencias a elementos de error
    const errors = {
        email: document.getElementById('emailError'),
        password: document.getElementById('passwordError')
    };

    // Referencias a elementos de UI
    const loginError = document.getElementById('loginError');
    const submitButton = loginForm.querySelector('button[type="submit"]');
    const submitButtonText = submitButton.innerHTML;

    // Función para simular delay en el login (mejor experiencia de usuario)
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    // Validación en tiempo real con debounce (espera a que el usuario deje de escribir)
    let debounceTimeout;
    Object.keys(inputs).forEach(key => {
        // Evento cuando el usuario está escribiendo
        inputs[key].addEventListener('input', function() {
            clearTimeout(debounceTimeout);
            loginError.style.display = 'none';
            
            // Remover clase de error al empezar a escribir
            this.classList.remove('error');
            
            // Esperar 500ms después de que el usuario deje de escribir para validar
            debounceTimeout = setTimeout(() => {
                validateField(key);
            }, 500);
        });

        // Validar cuando el campo pierde el foco
        inputs[key].addEventListener('blur', function() {
            validateField(key);
        });
    });

    // Función para mostrar mensajes de error con animación suave
    function showError(field, message) {
        errors[field].textContent = message;
        errors[field].style.display = 'block';
        inputs[field].classList.add('error');
        inputs[field].classList.remove('success');
        
        // Animación de fade in para el mensaje de error
        errors[field].style.opacity = '0';
        setTimeout(() => {
            errors[field].style.transition = 'opacity 0.3s ease';
            errors[field].style.opacity = '1';
        }, 10);
    }

    // Función para mostrar estado de éxito en los campos
    function showSuccess(field) {
        errors[field].style.display = 'none';
        inputs[field].classList.remove('error');
        inputs[field].classList.add('success');
    }

    // Función para mostrar error general de login con animación
    function showLoginError(message) {
        loginError.textContent = message;
        loginError.style.display = 'block';
        loginError.style.opacity = '0';
        loginError.style.transform = 'translateY(-10px)';
        
        // Animación de entrada del mensaje
        setTimeout(() => {
            loginError.style.transition = 'all 0.3s ease';
            loginError.style.opacity = '1';
            loginError.style.transform = 'translateY(0)';
        }, 10);
    }

    // Función para mostrar/ocultar estado de carga
    function setLoading(isLoading) {
        if (isLoading) {
            submitButton.classList.add('loading');
            submitButton.disabled = true;
        } else {
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
        }
    }

    // Validación de campos individuales
    function validateField(field) {
        const value = inputs[field].value.trim();

        switch(field) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value === '') {
                    showError(field, 'El correo electrónico es requerido');
                    return false;
                } else if (!emailRegex.test(value)) {
                    showError(field, 'Ingresa un correo electrónico válido');
                    return false;
                } else {
                    showSuccess(field);
                    return true;
                }

            case 'password':
                if (value === '') {
                    showError(field, 'La contraseña es requerida');
                    return false;
                } else if (value.length < 8) {
                    showError(field, 'La contraseña debe tener al menos 8 caracteres');
                    return false;
                } else {
                    showSuccess(field);
                    return true;
                }
        }
    }

    // Manejo del envío del formulario
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validar todos los campos antes de proceder
            const isValid = Object.keys(inputs).every(key => validateField(key));
            
            if (isValid) {
                setLoading(true);
                
                try {
                    // Simular delay de red para mejor experiencia de usuario
                    await delay(1000);
                    
                    // Obtener usuarios registrados del localStorage
                    const users = JSON.parse(localStorage.getItem('users') || '[]');
                    const user = users.find(u => 
                        u.email === inputs.email.value.trim() && 
                        u.password === inputs.password.value
                    );
                    
                    if (user) {
                        // Verificar si se debe recordar la sesión
                        const rememberMe = loginForm.querySelector('[name="remember"]').checked;
                        if (rememberMe) {
                            localStorage.setItem('rememberMe', 'true');
                        }
                        
                        // Guardar datos del usuario en localStorage
                        localStorage.setItem('currentUser', JSON.stringify({
                            email: user.email,
                            nombre: user.nombre
                        }));
                        
                        // Animación de éxito y redirección
                        submitButton.innerHTML = '<i class="fas fa-check"></i> ¡Éxito!';
                        await delay(500);
                        window.location.href = 'index.html';
                    } else {
                        // Mostrar error si las credenciales son incorrectas
                        showLoginError('El correo electrónico o la contraseña son incorrectos');
                        
                        // Marcar ambos campos como error
                        inputs.email.classList.add('error');
                        inputs.password.classList.add('error');
                        inputs.email.classList.remove('success');
                        inputs.password.classList.remove('success');
                    }
                } catch (error) {
                    showLoginError('Ocurrió un error. Por favor intenta nuevamente.');
                } finally {
                    setLoading(false);
                    submitButton.innerHTML = submitButtonText;
                }
            }
        });
    }

    // Restaurar sesión si existe "recordar sesión"
    if (localStorage.getItem('rememberMe') && localStorage.getItem('currentUser')) {
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (user && user.email) {
            window.location.href = 'index.html';
        }
    }
});

// Función para actualizar la UI basada en el estado de la sesión
function updateUIBasedOnSession() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const header = document.querySelector('header');
    
    // Remover sesión anterior si existe
    const oldSession = document.querySelector('.user-session');
    if (oldSession) {
        oldSession.remove();
    }
    
    if (currentUser) {
        // Usuario ha iniciado sesión
        const userSession = document.createElement('div');
        userSession.className = 'user-session';
        userSession.innerHTML = `
            <span class="user-name">Hola, ${currentUser.nombre || currentUser.email.split('@')[0]}</span>
            <button onclick="cerrarSesion()" class="btn-logout">Cerrar Sesión</button>
        `;
        header.appendChild(userSession);
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('currentUser');
    window.location.reload();
}

// Actualizar UI cuando se carga la página
document.addEventListener('DOMContentLoaded', updateUIBasedOnSession);