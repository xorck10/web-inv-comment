document.addEventListener("DOMContentLoaded", function() {
    AOS.init({
        once: true,
        offset: 50,
        easing: 'ease-out-cubic',
    });

    createParticles();
    loadGuestName();
});

function createParticles() {
    const container = document.getElementById('particle-container');
    if (!container) return;
    
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('gold-particle');
        
        const size = Math.random() * 10 + 5; 
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}vw`;
        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        container.appendChild(particle);
    }
}

function loadGuestName() {
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to') || urlParams.get('nama');
    const guestElement = document.getElementById('guest-name');
    
    if (guestElement && guestParam) {
        guestElement.textContent = decodeURIComponent(guestParam.replace(/\+/g, ' '));
    } else if (guestElement) {
        guestElement.textContent = "Tamu Undangan";
    }
}

// Fungsi Buka Undangan & Memaksa Play Audio setelah tombol diklik
function openInvitation() {
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');
    const music = document.getElementById('wedding-song');
    const musicControl = document.getElementById('music-control');
    
    if (!cover || !mainContent) return;

    // Menjalankan musik tepat saat tombol interaksi ditekan (user gesture)
    if (music) {
        music.currentTime = 0;
        music.play().then(() => {
            if (musicControl) musicControl.classList.remove('hidden');
        }).catch(error => {
            console.log("Pemutaran audio diblokir browser:", error);
            // Jika masih gagal, tombol kontrol tetap dimunculkan agar tamu bisa play manual
            if (musicControl) musicControl.classList.remove('hidden');
        });
    }

    cover.style.opacity = '0';
    document.body.classList.remove('lock-scroll');
    
    setTimeout(() => {
        cover.style.display = 'none';
        mainContent.style.display = 'block';
        AOS.refresh();
        window.scrollTo(0, 0);
    }, 1000);
}

// Fungsi Tombol Kontrol Musik (Play/Pause Manual)
function toggleMusic() {
    const music = document.getElementById('wedding-song');
    const musicIcon = document.getElementById('music-icon');
    
    if (!music) return;

    if (music.paused) {
        music.play();
        musicIcon.classList.add('animate-spin');
    } else {
        music.pause();
        musicIcon.classList.remove('animate-spin');
    }
}
