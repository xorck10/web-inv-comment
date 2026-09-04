// GANTI DENGAN URL WEB APP GOOGLE APPS SCRIPT KAMU SENDIRI
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw_64RFF_d55C3PO7e3q5nVWXLSqY9wGzaN6QDI8StHgOD_kLye-FUCPrZLNqZ8LL82/exec";

document.addEventListener('DOMContentLoaded', () => {
    // 1. Inisialisasi AOS Animation
    AOS.init({ once: true, offset: 50 });

    // 2. Generate Background Gold Particles
    const particleContainer = document.getElementById('particle-container');
    if (particleContainer) {
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.classList.add('gold-particle');
            const size = Math.random() * 10 + 5; 
            particle.style.width = `${size}px`; 
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 10 + 8}s`;
            particle.style.animationDelay = `${Math.random() * 5}s`;
            particleContainer.appendChild(particle);
        }
    }

    // 3. Tangkap Nama Tamu dari URL (Parameter ?to=Nama+Tamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to') || urlParams.get('nama');
    const guestElement = document.getElementById('guest-name');
    
    if (guestElement) {
        if (guestParam) {
            guestElement.textContent = decodeURIComponent(guestParam.replace(/\+/g, ' '));
        } else {
            guestElement.textContent = "Tamu Undangan";
        }
    }

    // 4. Muat ucapan dari Google Sheets saat halaman dimuat
    loadWishesFromSheet();
});

// Fungsi Transisi Buka Undangan
function openInvitation() {
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const body = document.body;
    
    window.scrollTo(0, 0);
    cover.classList.add('opacity-0');
    body.classList.remove('lock-scroll');
    
    setTimeout(() => {
        cover.style.display = 'none';
        mainContent.style.display = 'block';
        AOS.refresh(); 
    }, 1000);
}

// Ambil Data dari Google Sheets
function loadWishesFromSheet() {
    const container = document.getElementById('wishes-container');
    if (!container) return;

    container.innerHTML = '<p class="text-center text-gold animate-pulse text-sm">Memuat doa restu...</p>';

    fetch(WEB_APP_URL)
        .then(response => response.json())
        .then(result => {
            container.innerHTML = '';
            const wishes = result.data; 

            if (!wishes || wishes.length === 0) {
                container.innerHTML = '<p class="text-center text-stone-500 text-sm">Belum ada ucapan. Jadilah yang pertama!</p>';
                return;
            }

            wishes.forEach(wish => {
                const wishEl = document.createElement('div');
                wishEl.classList.add('glass', 'p-6', 'rounded-2xl', 'border', 'border-gold/10');
                wishEl.innerHTML = `
                    <div class="flex justify-between items-baseline mb-3">
                        <h4 class="font-semibold text-gold text-sm md:text-base">${escapeHTML(wish.nama)}</h4>
                        <span class="text-xs text-stone-500">${escapeHTML(wish.waktu)}</span>
                    </div>
                    <p class="text-stone-300 text-sm leading-relaxed">${escapeHTML(wish.pesan)}</p>
                `;
                container.appendChild(wishEl);
            });
        })
        .catch(error => {
            console.error('Error:', error);
            container.innerHTML = '<p class="text-center text-red-500 text-sm">Gagal memuat ucapan.</p>';
        });
}

// Kirim Data ke Google Sheets dan Refresh ke #wishes-section
const form = document.getElementById('wish-form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('sender-name');
        const messageInput = document.getElementById('sender-message');
        const submitBtn = form.querySelector('button');

        submitBtn.disabled = true;
        submitBtn.textContent = "Mengirim...";

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
            setTimeout(() => {
                // Refresh halaman dan langsung melompat ke elemen #wishes-section
                window.location.href = window.location.pathname + window.location.search + '#wishes-section';
                window.location.reload();
            }, 1500);
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("Gagal mengirim ucapan.");
            submitBtn.disabled = false;
            submitBtn.textContent = "Kirim Ucapan";
        });
    });
}

// Fungsi Keamanan Mencegah XSS Injection
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
