document.addEventListener('DOMContentLoaded', function() {
    // Datos de ejemplo para los archivos descargables
    const downloadableFiles = [
        {
            id: 1,
            title: "Guía de Compostaje Doméstico",
            description: "Manual completo sobre cómo iniciar y mantener tu compostaje en casa.",
            category: "guides",
            fileType: "pdf",
            size: "2.5 MB",
            downloads: 128,
            path: "assets/downloads/guia-compostaje.pdf"
        },
        {
            id: 2,
            title: "Plantilla de Seguimiento de Residuos",
            description: "Hoja de cálculo para registrar y analizar tus residuos domésticos.",
            category: "templates",
            fileType: "doc",
            size: "500 KB",
            downloads: 85,
            path: "assets/downloads/plantilla-residuos.docx"
        },
        {
            id: 3,
            title: "Infografía: Separación de Residuos",
            description: "Guía visual para la correcta separación de residuos en el hogar.",
            category: "infographics",
            fileType: "pdf",
            size: "1.8 MB",
            downloads: 256,
            path: "assets/downloads/infografia-separacion.pdf"
        },
        {
            id: 4,
            title: "Kit de Herramientas de Reciclaje",
            description: "Conjunto de recursos y herramientas para optimizar tu reciclaje.",
            category: "tools",
            fileType: "zip",
            size: "15 MB",
            downloads: 64,
            path: "assets/downloads/kit-reciclaje.zip"
        }
    ];

    const grid = document.getElementById('downloadsGrid');
    const searchInput = document.getElementById('searchDownloads');
    const categoryFilter = document.getElementById('categoryFilter');

    // Función para renderizar los archivos
    function renderFiles(files) {
        grid.innerHTML = '';
        files.forEach(file => {
            const card = document.createElement('div');
            card.className = 'download-card';
            card.innerHTML = `
                <h3>${file.title}</h3>
                <p>${file.description}</p>
                <div class="download-info">
                    <span class="file-type ${file.fileType}">${file.fileType.toUpperCase()}</span>
                    <span>${file.size}</span>
                    <span>${file.downloads} descargas</span>
                </div>
                <a href="${file.path}" class="download-btn" download>Descargar</a>
            `;
            grid.appendChild(card);
        });
    }

    // Función para filtrar archivos
    function filterFiles() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;

        const filteredFiles = downloadableFiles.filter(file => {
            const matchesSearch = file.title.toLowerCase().includes(searchTerm) ||
                                file.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || file.category === category;
            return matchesSearch && matchesCategory;
        });

        renderFiles(filteredFiles);
    }

    // Event listeners para búsqueda y filtrado
    searchInput.addEventListener('input', filterFiles);
    categoryFilter.addEventListener('change', filterFiles);

    // Renderizar todos los archivos inicialmente
    renderFiles(downloadableFiles);

    // Función para registrar las descargas
    function trackDownload(fileId) {
        const file = downloadableFiles.find(f => f.id === fileId);
        if (file) {
            file.downloads++;
            // Aquí podrías implementar la lógica para guardar las estadísticas en el servidor
        }
    }

    // Event listener para los botones de descarga
    grid.addEventListener('click', function(e) {
        if (e.target.classList.contains('download-btn')) {
            const card = e.target.closest('.download-card');
            const fileId = parseInt(card.dataset.fileId);
            trackDownload(fileId);
        }
    });
}); 