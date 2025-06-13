// Optimizador de imágenes
const ImageOptimizer = {
    // Verificar soporte de WebP
    checkWebPSupport: async () => {
        try {
            return document.createElement('canvas')
                .toDataURL('image/webp')
                .indexOf('data:image/webp') === 0;
        } catch (e) {
            return false;
        }
    },

    // Lazy loading mejorado
    lazyLoad: () => {
        if (!('IntersectionObserver' in window)) {
            ImageOptimizer.loadAllImages();
            return;
        }

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    ImageOptimizer.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '50px 0px'
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    },

    // Cargar imagen individual
    loadImage: async (img) => {
        const src = img.dataset.src;
        if (!src) return;

        // Determinar tamaño óptimo
        const containerWidth = img.parentElement.offsetWidth;
        const optimalSize = ImageOptimizer.selectImageSize(containerWidth);
        
        // Construir URL con tamaño óptimo
        const supportsWebP = await ImageOptimizer.checkWebPSupport();
        const optimizedSrc = ImageOptimizer.buildOptimizedUrl(src, optimalSize, supportsWebP);

        // Precargar imagen
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'image';
        preloadLink.href = optimizedSrc;
        document.head.appendChild(preloadLink);

        // Cargar imagen con fallback
        const tempImage = new Image();
        tempImage.onload = () => {
            img.src = optimizedSrc;
            img.classList.add('loaded');
        };
        tempImage.onerror = () => {
            img.src = src; // Fallback a imagen original
        };
        tempImage.src = optimizedSrc;
    },

    // Seleccionar tamaño óptimo
    selectImageSize: (containerWidth) => {
        const breakpoints = [320, 640, 768, 1024, 1366, 1920];
        return breakpoints.find(bp => bp >= containerWidth) || breakpoints[breakpoints.length - 1];
    },

    // Construir URL optimizada
    buildOptimizedUrl: (src, size, supportsWebP) => {
        const url = new URL(src, window.location.origin);
        url.searchParams.set('width', size);
        if (supportsWebP) {
            url.searchParams.set('format', 'webp');
        }
        return url.toString();
    },

    // Cargar todas las imágenes (fallback)
    loadAllImages: () => {
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    },

    // Inicializar
    init: () => {
        // Agregar estilos para fade-in de imágenes
        const style = document.createElement('style');
        style.textContent = `
            img[data-src] {
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
            }
            img.loaded {
                opacity: 1;
            }
        `;
        document.head.appendChild(style);

        // Iniciar lazy loading
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ImageOptimizer.lazyLoad);
        } else {
            ImageOptimizer.lazyLoad();
        }
    }
};

// Auto-inicializar
ImageOptimizer.init(); 