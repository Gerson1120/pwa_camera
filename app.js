document.addEventListener('DOMContentLoaded', () => {
    const openCameraBtn = document.getElementById('open-camera-btn');
    const cameraContainer = document.getElementById('camera-container');
    const cameraView = document.getElementById('camera-view');
    const captureBtn = document.getElementById('capture-btn');
    const switchCameraBtn = document.getElementById('switch-camera-btn');
    const closeCameraBtn = document.getElementById('close-camera-btn');

    const galleryContainer = document.getElementById('gallery-container');
    const photoGallery = document.getElementById('photo-gallery');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const deleteAllBtn = document.getElementById('delete-all-btn'); // Variable actualizada

    let currentStream;
    let facingMode = 'user';

    // --- Funciones de la Cámara ---

    const startCamera = async () => {
        try {
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: facingMode }
            });
            cameraView.srcObject = stream;
            currentStream = stream;
            cameraContainer.classList.remove('hidden');
            openCameraBtn.parentElement.classList.add('hidden');
        } catch (error) {
            console.error('Error al acceder a la cámara:', error);
            alert('No se pudo acceder a la cámara. Asegúrate de dar los permisos necesarios.');
        }
    };

    openCameraBtn.addEventListener('click', startCamera);

    switchCameraBtn.addEventListener('click', () => {
        facingMode = facingMode === 'user' ? 'environment' : 'user';
        startCamera();
    });

    closeCameraBtn.addEventListener('click', () => {
        if (currentStream) {
            currentStream.getTracks().forEach(track => track.stop());
        }
        cameraContainer.classList.add('hidden');
        openCameraBtn.parentElement.classList.remove('hidden');
    });

    captureBtn.addEventListener('click', () => {
        const canvas = document.createElement('canvas');
        canvas.width = cameraView.videoWidth;
        canvas.height = cameraView.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(cameraView, 0, 0, canvas.width, canvas.height);

        const imageUrl = canvas.toDataURL('image/jpeg');
        const img = document.createElement('img');
        img.src = imageUrl;

        photoGallery.appendChild(img);
        galleryContainer.classList.remove('hidden');
        
        // --- CAMBIO ---
        // Ya no cerramos la cámara automáticamente
        // closeCameraBtn.click(); 
    });


    // --- Funciones de la Galería ---

    prevBtn.addEventListener('click', () => {
        photoGallery.scrollBy({ left: -photoGallery.clientWidth, behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        photoGallery.scrollBy({ left: photoGallery.clientWidth, behavior: 'smooth' });
    });

    // --- CAMBIO ---
    // Nueva funcionalidad para el botón "Eliminar Todas"
    deleteAllBtn.addEventListener('click', () => {
        // Vacía el contenedor de la galería
        photoGallery.innerHTML = '';
        // Oculta el contenedor de la galería
        galleryContainer.classList.add('hidden');
    });
});