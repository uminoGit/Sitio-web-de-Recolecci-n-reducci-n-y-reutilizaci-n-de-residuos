// Cache de elementos DOM y variables globales
const DOM = {
    slider: null,
    slides: null,
    currentSlide: 0,
    commentsList: null,
    commentForm: null
};

// Inicialización principal
const init = () => {
    cacheDOM();
    if (DOM.slider) initSlider();
    if (DOM.commentsList) initComments();
};

// Cache de elementos DOM
const cacheDOM = () => {
    DOM.slider = document.querySelector('.slider');
    DOM.slides = document.querySelectorAll('.slide');
    DOM.commentsList = document.getElementById('commentsList');
    DOM.commentForm = document.getElementById('commentForm');
};

// Componente: Slider
const initSlider = () => {
    // Mostrar primer slide
    showSlide(0);
    
    // Event listeners para navegación
    document.querySelector('.prev')?.addEventListener('click', () => navigate(-1));
    document.querySelector('.next')?.addEventListener('click', () => navigate(1));
    
    // Auto-rotación con RequestAnimationFrame para mejor rendimiento
    let lastTime = 0;
    const autoRotate = (currentTime) => {
        if (!lastTime) lastTime = currentTime;
        
        if (currentTime - lastTime >= 5000) { // 5 segundos
            navigate(1);
            lastTime = currentTime;
        }
        
        requestAnimationFrame(autoRotate);
    };
    
    requestAnimationFrame(autoRotate);
};

// Navegación del slider
const navigate = (direction) => {
    DOM.currentSlide = (DOM.currentSlide + direction + DOM.slides.length) % DOM.slides.length;
    showSlide(DOM.currentSlide);
};

// Mostrar slide específico
const showSlide = (index) => {
    DOM.slides.forEach(slide => slide.classList.remove('active'));
    DOM.slides[index].classList.add('active');
};

// Componente: Comentarios
const initComments = () => {
    displayComments();
    DOM.commentForm?.addEventListener('submit', handleCommentSubmit);
};

// Mostrar comentarios
const displayComments = () => {
    if (!DOM.commentsList) return;
    
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    DOM.commentsList.innerHTML = comments.map(comment => `
        <div class="comment">
            <h4>${escapeHTML(comment.name)}</h4>
            <p>${escapeHTML(comment.text)}</p>
            <small>${comment.date}</small>
            <button onclick="likeComment(${comment.id})" class="like-btn">
                👍 ${comment.likes || 0}
            </button>
        </div>
    `).join('');
};

// Manejar envío de comentarios
const handleCommentSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.commentName.value.trim();
    const text = form.commentText.value.trim();
    
    if (!name || !text) return;
    
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    comments.push({
        id: Date.now(),
        name,
        text,
        date: new Date().toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }),
        likes: 0
    });
    
    localStorage.setItem('comments', JSON.stringify(comments));
    form.reset();
    displayComments();
};

// Utilidad: Escapar HTML para prevenir XSS
const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

// Función global para likes
window.likeComment = (id) => {
    const comments = JSON.parse(localStorage.getItem('comments') || '[]');
    const comment = comments.find(c => c.id === id);
    if (comment) {
        comment.likes = (comment.likes || 0) + 1;
        localStorage.setItem('comments', JSON.stringify(comments));
        displayComments();
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // ===== CARRUSEL DE IMÁGENES =====
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    // Función para mostrar un slide específico
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }

    // Función para avanzar al siguiente slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Función para retroceder al slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Configurar eventos de los botones de navegación
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto-avance del carrusel cada 5 segundos
    setInterval(nextSlide, 5000);

    // Mostrar el primer slide al cargar
    showSlide(currentSlide);

    // ===== VALIDACIÓN DE FORMULARIOS =====
    
    // Validación del formulario de registro
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', function(e) {
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Verificar que las contraseñas coincidan
            if (password !== confirmPassword) {
                e.preventDefault();
                alert('Las contraseñas no coinciden');
            }
        });
    }

    // Validación del formulario de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Verificar que los campos no estén vacíos
            if (!email || !password) {
                e.preventDefault();
                alert('Por favor complete todos los campos');
            }
        });
    }

    // ===== NAVEGACIÓN SUAVE =====
    // Configurar scroll suave para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ===== MENÚ MÓVIL =====
    // Mostrar/ocultar menú en dispositivos móviles
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const nav = document.querySelector('header nav ul');
            nav.classList.toggle('active');
        });
    }

    // ===== SISTEMA DE COMENTARIOS =====
    const commentForm = document.getElementById('commentForm');
    const commentsList = document.getElementById('commentsList');
    
    // Función para obtener el usuario actual del localStorage
    function getCurrentUser() {
        try {
            return JSON.parse(localStorage.getItem('currentUser'));
        } catch (e) {
            return null;
        }
    }

    // Función para mostrar los comentarios existentes
    function displayComments() {
        const comments = JSON.parse(localStorage.getItem('comments')) || [];
        commentsList.innerHTML = ''; // Limpiar la lista actual
        
        // Crear y mostrar cada comentario
        comments.forEach((comment, index) => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.name}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-content">
                    <p>${comment.text}</p>
                </div>
                <div class="comment-actions">
                    <button class="btn-like" data-index="${index}">
                        <span class="like-count">${comment.likes || 0}</span> Me gusta
                    </button>
                </div>
            `;
            commentsList.prepend(commentElement);
        });

        // Configurar eventos para los botones de "Me gusta"
        document.querySelectorAll('.btn-like').forEach(button => {
            button.addEventListener('click', function() {
                const index = this.dataset.index;
                const comments = JSON.parse(localStorage.getItem('comments')) || [];
                comments[index].likes = (comments[index].likes || 0) + 1;
                localStorage.setItem('comments', JSON.stringify(comments));
                displayComments();
            });
        });
    }

    // Mostrar comentarios existentes al cargar la página
    if (commentsList) {
        displayComments();
    }

    // Manejar el envío de nuevos comentarios
    if (commentForm) {
        const currentUser = getCurrentUser();
        const nameInput = document.getElementById('commentName');
        
        // Autocompletar nombre si hay usuario logueado
        if (currentUser) {
            nameInput.value = currentUser.nombre;
            nameInput.readOnly = true;
        }

        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const textInput = document.getElementById('commentText');
            const currentUser = getCurrentUser();
            
            // Verificar si el usuario está logueado
            if (!currentUser) {
                alert('Debes iniciar sesión para comentar');
                return;
            }
            
            if (textInput.value) {
                // Crear nuevo comentario
                const newComment = {
                    name: currentUser.nombre,
                    text: textInput.value,
                    date: new Date().toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    likes: 0
                };
                
                // Obtener comentarios existentes y añadir el nuevo
                const comments = JSON.parse(localStorage.getItem('comments')) || [];
                comments.push(newComment);
                
                // Guardar en localStorage
                localStorage.setItem('comments', JSON.stringify(comments));
                
                // Actualizar la visualización
                displayComments();
                
                // Limpiar el formulario
                textInput.value = '';
                
                // Mostrar mensaje de éxito
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = '¡Comentario publicado con éxito!';
                successMessage.style.color = '#2e8b57';
                successMessage.style.marginTop = '10px';
                successMessage.style.padding = '10px';
                successMessage.style.backgroundColor = '#e8f5e9';
                successMessage.style.borderRadius = '5px';
                commentForm.appendChild(successMessage);
                
                // Eliminar mensaje después de 3 segundos
                setTimeout(() => {
                    successMessage.remove();
                }, 3000);
            }
        });
    }
});

// ===== FUNCIONALIDAD DEL FORO =====
if (document.getElementById('foro')) {
    // Mostrar formulario de nuevo tema
    document.getElementById('nuevoTema').addEventListener('click', function() {
        document.getElementById('formTema').style.display = 'block';
    });

    // Ocultar formulario de nuevo tema
    document.getElementById('cancelarTema').addEventListener('click', function() {
        document.getElementById('formTema').style.display = 'none';
    });

    // Manejar envío de nuevo tema
    document.getElementById('formTema').addEventListener('submit', function(e) {
        e.preventDefault();
        const titulo = document.getElementById('tituloTema').value;
        const contenido = document.getElementById('contenidoTema').value;
        
        if (titulo && contenido) {
            // Aquí se implementaría la lógica para agregar el tema al foro
            alert(`Tema "${titulo}" creado con éxito!`);
            this.reset();
            this.style.display = 'none';
        } else {
            alert('Por favor complete todos los campos');
        }
    });
}

// ===== CALCULADORA DE RESIDUOS =====
if (document.getElementById('calculadora')) {
    document.getElementById('calcularResiduos').addEventListener('click', function() {
        // Obtener valores de los campos
        const bolsas = parseFloat(document.getElementById('bolsas').value) || 0;
        const botellas = parseFloat(document.getElementById('botellas').value) || 0;
        const papel = parseFloat(document.getElementById('papel').value) || 0;
        const organico = parseFloat(document.getElementById('organico').value) || 0;
        
        // Calcular totales
        const total = bolsas + botellas + papel + organico;
        const reduccion = total * 0.7; // Suponiendo un 70% de reducción
        
        // Mostrar resultados
        document.getElementById('resultado').innerHTML = `
            <h3>Resultados:</h3>
            <p>Residuos actuales: ${total.toFixed(2)} kg/semana</p>
            <p>Podrías reducir a: ${reduccion.toFixed(2)} kg/semana</p>
            <p>Ahorro potencial: ${(total - reduccion).toFixed(2)} kg/semana</p>
        `;
    });
}