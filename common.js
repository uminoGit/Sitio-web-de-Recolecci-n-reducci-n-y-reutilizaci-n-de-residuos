// Función principal de inicialización
const init = () => {
    // Cache de elementos DOM frecuentemente usados
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    
    // Inicializar componentes
    initBackToTop();
    initResponsiveMenu();
    initUserSession();
    initLazyLoading();
    initErrorHandling();
    initTooltips();
};

// Componente: Botón Volver Arriba
const initBackToTop = () => {
    const btn = document.createElement('a');
    Object.assign(btn, {
        href: '#',
        className: 'back-to-top',
        innerHTML: '↑',
        ariaLabel: 'Volver arriba'
    });
    document.body.appendChild(btn);

    // Throttle para optimizar el scroll
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                btn.classList.toggle('visible', window.pageYOffset > 300);
                ticking = false;
            });
            ticking = true;
        }
    });

    btn.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });
};

// Componente: Menú Responsive
const initResponsiveMenu = () => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    const toggle = document.createElement('button');
    Object.assign(toggle, {
        className: 'menu-toggle',
        innerHTML: '☰',
        ariaLabel: 'Abrir menú'
    });
    
    nav.insertBefore(toggle, nav.firstChild);
    toggle.addEventListener('click', () => {
        const ul = nav.querySelector('ul');
        ul.classList.toggle('active');
        toggle.setAttribute('aria-expanded', ul.classList.contains('active'));
    });
};

// Componente: Manejo de Sesión
const initUserSession = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const header = document.querySelector('header');
    
    // Limpiar sesión anterior
    const oldSession = document.querySelector('.user-session');
    if (oldSession) oldSession.remove();
    
    if (currentUser) {
        const session = document.createElement('div');
        session.className = 'user-session';
        session.innerHTML = `
            <span class="user-name">${currentUser.nombre || currentUser.email.split('@')[0]}</span>
            <button onclick="cerrarSesion()" class="btn-logout">Cerrar Sesión</button>
        `;
        header.appendChild(session);
    }
};

// Componente: Lazy Loading de Imágenes
const initLazyLoading = () => {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => 
            imageObserver.observe(img)
        );
    }
};

// Componente: Manejo de Errores de Imágenes
const initErrorHandling = () => {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'img/placeholder.jpg';
            this.alt = 'Imagen no disponible';
        });
    });
};

// Componente: Tooltips
const initTooltips = () => {
    document.querySelectorAll('[data-tooltip]').forEach(el => {
        const tooltip = document.createElement('span');
        Object.assign(tooltip, {
            className: 'tooltip',
            textContent: el.dataset.tooltip,
            role: 'tooltip'
        });
        el.appendChild(tooltip);
    });
};

// Función global de cierre de sesión
window.cerrarSesion = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('rememberMe');
    window.location.reload();
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init); 