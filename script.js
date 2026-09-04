// GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT KAMU SENDIRI
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw_64RFF_d55C3PO7e3q5nVWXLSqY9wGzaN6QDI8StHgOD_kLye-FUCPrZLNqZ8LL82/exec";

// ... (kode partikel, AOS, dan loadWishesFromSheet biarkan seperti sebelumnya) ...

// Kirim Data ke Google Sheets dan Refresh ke #wishes-section
const form = document.getElementById('wish-form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('sender-name');
        const messageInput = document.getElementById('sender-message');
        const submitBtn = form.querySelector('button');

        // Ubah teks tombol jadi indikator proses
        submitBtn.disabled = true;
        submitBtn.textContent = "Mengirim Ucapan...";

        const formData = {
            "nama": nameInput.value.trim(),
            "pesan": messageInput.value.trim()
        };

        fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(() => {
            // Beri jeda 2 detik agar Google Sheets punya waktu cukup untuk appendRow
            setTimeout(() => {
                // Reload halaman dan arahkan langsung ke #wishes-section
                window.location.href = window.location.pathname + window.location.search + '#wishes-section';
                window.location.reload();
            }, 2000);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("Gagal mengirim ucapan. Periksa koneksi internet.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Kirim Ucapan";
        });
    });
}
