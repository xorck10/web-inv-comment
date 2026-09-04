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

    // Load ucapan awal saat halaman pertama kali dibuka
    loadWishes();
});

// 4. Fungsi Transisi Buka Undangan
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
        AOS.refresh(); // Refresh animasi scroll setelah konten muncul
    }, 1000);
}

// 5. Logika Gelembung Ucapan Kolektif (LocalStorage)
const STORAGE_KEY = 'wedding_wishes_rian_sinta';

// Fungsi untuk menampilkan ucapan ke layar
function loadWishes() {
    const container = document.getElementById('wishes-container');
    if (!container) return;

    let wishes = JSON.parse(localStorage.getItem(STORAGE_KEY));
    
    if (!wishes) {
        wishes = [
            {
                name: "Keluarga Besar Bp. Andi",
                message: "Selamat berbahagia Rian & Sinta! Semoga menjadi keluarga sakinah, mawaddah, warahmah. Lancar acaranya ya!",
                time: "Baru saja"
            },
            {
                name: "Sahabat Kuliah",
                message: "Waduh, akhirnya sold out juga nih bestie! Ikut seneng banget. Happy Wedding!",
                time: "2 menit lalu"
            }
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    }

    container.innerHTML = '';
    
    wishes.slice().reverse().forEach(wish => {
        const wishEl = document.createElement('div');
        wishEl.classList.add('glass', 'p-6', 'rounded-2xl', 'border', 'border-gold/10');
        wishEl.innerHTML = `
            <div class="flex justify-between items-baseline mb-3">
                <h4 class="font-semibold text-gold text-sm md:text-base">${escapeHTML(wish.name)}</h4>
                <span class="text-xs text-stone-500">${escapeHTML(wish.time)}</span>
            </div>
            <p class="text-stone-300 text-sm leading-relaxed">${escapeHTML(wish.message)}</p>
        `;
        container.appendChild(wishEl);
    });
}

// Event listener saat form ucapan dikirim
const form = document.getElementById('wish-form');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('sender-name');
        const messageInput = document.getElementById('sender-message');
        
        const newWish = {
            name: nameInput.value.trim(),
            message: messageInput.value.trim(),
            time: "Baru saja"
        };

        let wishes = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        wishes.push(newWish);
        
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
        
        nameInput.value = '';
        messageInput.value = '';
        loadWishes();
    });
}

// Fungsi Keamanan Sederhana Mencegah XSS Injection
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

