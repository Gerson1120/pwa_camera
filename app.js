const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const takePhotoBtn = document.getElementById("takePhoto");
const switchCameraBtn = document.getElementById("switchCamera");
const gallery = document.getElementById("gallery");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");

let stream = null;
let usingFrontCamera = false;
let photos = [];

async function openCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }

    const constraints = {
        video: {
            facingMode: usingFrontCamera ? "user" : "environment"
        }
    };

    try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
    } catch (err) {
        alert("No se puede acceder a la cámara: " + err.message);
    }
}

switchCameraBtn.addEventListener("click", () => {
    usingFrontCamera = !usingFrontCamera;
    openCamera();
});

takePhotoBtn.addEventListener("click", () => {
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);
    const imageUrl = canvas.toDataURL("image/png");
    photos.push(imageUrl);
    updateGallery();
});

function updateGallery() {
    gallery.innerHTML = "";
    photos.forEach((photo, index) => {
        const img = document.createElement("img");
        img.src = photo;
        img.addEventListener("click", () => selectPhoto(index, img));
        gallery.appendChild(img);
    });
}

function selectPhoto(index, img) {
    const selected = gallery.querySelector(".selected");
    if (selected) selected.classList.remove("selected");
    img.classList.add("selected");

    if (confirm("¿Eliminar esta foto?")) {
        photos.splice(index, 1);
        updateGallery();
    }
}

leftArrow.addEventListener("click", () => {
    gallery.scrollBy({ left: -150, behavior: "smooth" });
});

rightArrow.addEventListener("click", () => {
    gallery.scrollBy({ left: 150, behavior: "smooth" });
});

openCamera();
