// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a elementos del formulario
    const registroForm = document.getElementById('registroForm');
    const inputs = {
        nombre: document.getElementById('nombre'),
        email: document.getElementById('email'),
        password: document.getElementById('password'),
        confirmPassword: document.getElementById('confirmPassword')
    };
    
    // Obtener referencias a elementos de error
    const errors = {
        nombre: document.getElementById('nombreError'),
        email: document.getElementById('emailError'),
        password: document.getElementById('passwordError'),
        confirmPassword: document.getElementById('confirmPasswordError')
    };

    // Configurar validación en tiempo real para cada campo
    Object.keys(inputs).forEach(key => {
        // Validar mientras el usuario escribe
        inputs[key].addEventListener('input', function() {
            validateField(key);
        });

        // Validar cuando el campo pierde el foco
        inputs[key].addEventListener('blur', function() {
            validateField(key);
        });
    });

    // Función para mostrar mensajes de error
    function showError(field, message) {
        errors[field].textContent = message;
        errors[field].style.display = 'block';
        inputs[field].classList.add('error');
        inputs[field].classList.remove('success');
    }

    // Función para mostrar estado de éxito
    function showSuccess(field) {
        errors[field].style.display = 'none';
        inputs[field].classList.remove('error');
        inputs[field].classList.add('success');
    }

    // Validación de campos individuales
    function validateField(field) {
        const value = inputs[field].value.trim();

        switch(field) {
            // Validación del nombre
            case 'nombre':
                if (value === '') {
                    showError(field, 'El nombre es requerido');
                } else if (value.length < 3) {
                    showError(field, 'El nombre debe tener al menos 3 caracteres');
                } else {
                    showSuccess(field);
                }
                break;

            // Validación del email
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value === '') {
                    showError(field, 'El correo electrónico es requerido');
                } else if (!emailRegex.test(value)) {
                    showError(field, 'Ingresa un correo electrónico válido');
                } else {
                    showSuccess(field);
                }
                break;

            // Validación de la contraseña
            case 'password':
                if (value === '') {
                    showError(field, 'La contraseña es requerida');
                } else if (value.length < 8) {
                    showError(field, 'La contraseña debe tener al menos 8 caracteres');
                } else {
                    showSuccess(field);
                }
                // Re-validar confirmación de contraseña si existe
                validateField('confirmPassword');
                break;

            // Validación de la confirmación de contraseña
            case 'confirmPassword':
                if (value === '') {
                    showError(field, 'Confirma tu contraseña');
                } else if (value !== inputs.password.value) {
                    showError(field, 'Las contraseñas no coinciden');
                } else {
                    showSuccess(field);
                }
                break;
        }
    }

    // Manejo del envío del formulario
    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validar todos los campos antes de proceder
            Object.keys(inputs).forEach(key => validateField(key));
            
            // Verificar si hay errores de validación
            const hasErrors = Object.keys(errors).some(
                key => errors[key].style.display === 'block'
            );
            
            if (!hasErrors) {
                // Obtener usuarios existentes o inicializar array
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                
                // Verificar si el email ya está registrado
                if (users.some(user => user.email === inputs.email.value.trim())) {
                    showError('email', 'Este correo electrónico ya está registrado');
                    return;
                }
                
                // Crear objeto con datos del nuevo usuario
                const newUser = {
                    nombre: inputs.nombre.value.trim(),
                    email: inputs.email.value.trim(),
                    password: inputs.password.value
                };
                
                // Agregar nuevo usuario al array
                users.push(newUser);
                
                // Guardar usuarios actualizados en localStorage
                localStorage.setItem('users', JSON.stringify(users));
                
                // Iniciar sesión automáticamente
                localStorage.setItem('currentUser', JSON.stringify({
                    nombre: newUser.nombre,
                    email: newUser.email
                }));
                
                // Redirigir al index
                window.location.href = 'index.html';
            }
        });
    }
}); 