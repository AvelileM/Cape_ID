const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureBtn = document.getElementById('captureBtn');
const form = document.getElementById('verificationForm');
const statusDiv = document.getElementById('status');

let selfieBase64 = null;

// Access camera
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  });

// Capture selfie
captureBtn.addEventListener('click', () => {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0);

  selfieBase64 = canvas.toDataURL('image/jpeg').split(',')[1];

  statusDiv.innerText = "Selfie captured!";
});

// Submit form
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const fileInput = document.getElementById('idDocument');
  const file = fileInput.files[0];

  if (!file || !selfieBase64) {
    statusDiv.innerText = "Please upload ID and capture selfie.";
    return;
  }

  const formData = new FormData();
  formData.append('idDocument', file);
  formData.append('selfie', selfieBase64);

  statusDiv.innerText = "Verifying... ⏳";

  try {
    const res = await fetch('/api/verify-instant', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      statusDiv.innerHTML = `
        ✅ Verified! <br/>
        Name: ${data.user.firstName} ${data.user.lastName}<br/>
        Time: ${data.processingTime}
      `;
    } else {
      statusDiv.innerText = "❌ " + data.error;
    }

  } catch (err) {
    statusDiv.innerText = "Error: " + err.message;
  }
});