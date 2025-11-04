const openCameraBtn = document.getElementById("openCamera");
const cameraContainer = document.getElementById("cameraContainer");
const video = document.getElementById("video");
const takePhotoBtn = document.getElementById("takePhoto");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let stream = null;

async function openCamera() {
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" } // ✅ cámara trasera
        });

        video.srcObject = stream;
        cameraContainer.style.display = "block";
        openCameraBtn.disabled = true;

        video.addEventListener("loadedmetadata", () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
        });

    } catch (e) {
        alert("No se pudo acceder a la cámara");
    }
}

function takePhoto() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const base64Image = canvas.toDataURL("image/png");
    console.log("Foto base64:", base64Image);

    closeCamera();
}

function closeCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
        video.srcObject = null;
        openCameraBtn.disabled = false;
    }
}

openCameraBtn.addEventListener("click", openCamera);
takePhotoBtn.addEventListener("click", takePhoto);
window.addEventListener("beforeunload", closeCamera);
