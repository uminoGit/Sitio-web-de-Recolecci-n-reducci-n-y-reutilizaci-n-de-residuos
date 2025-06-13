// Función para manejar el envío de reportes técnicos
function handleTechnicalReport(event) {
    event.preventDefault();
    
    const form = event.target;
    const issue = form.querySelector('#issue').value.trim();
    const description = form.querySelector('#description').value.trim();
    const email = form.querySelector('#contact-email').value.trim();
    
    // Validar campos
    if (!issue || !description || !email) {
        showError('Por favor complete todos los campos');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('Por favor ingrese un correo electrónico válido');
        return;
    }
    
    // Simular envío del reporte
    showLoading();
    
    setTimeout(() => {
        // En un caso real, aquí se enviaría el reporte al servidor
        const report = {
            issue,
            description,
            email,
            date: new Date().toISOString(),
            status: 'pending'
        };
        
        // Guardar en localStorage para demostración
        const reports = JSON.parse(localStorage.getItem('technicalReports') || '[]');
        reports.push(report);
        localStorage.setItem('technicalReports', JSON.stringify(reports));
        
        // Mostrar mensaje de éxito
        showSuccess('Su reporte ha sido enviado. Nos pondremos en contacto pronto.');
        form.reset();
    }, 1500);
}

// Funciones auxiliares
function showError(message) {
    const errorDiv = document.getElementById('report-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('report-success');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }
}

function showLoading() {
    const submitBtn = document.querySelector('#technical-report-form button[type="submit"]');
    if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Enviando...';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }, 1500);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('technical-report-form');
    if (form) {
        form.addEventListener('submit', handleTechnicalReport);
    }
}); 