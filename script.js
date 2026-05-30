// --- FLOATING HEARTS ---
const heartsContainer = document.getElementById('heartsContainer');
function createHeart() {
  const heart = document.createElement('div');
  heart.classList.add('floating-heart');
  heart.innerHTML = '❤️';
  heart.style.left = Math.random() * 100 + '%';
  heart.style.animationDuration = 6 + Math.random() * 8 + 's';
  heart.style.fontSize = 16 + Math.random() * 24 + 'px';
  heartsContainer.appendChild(heart);
  setTimeout(() => { heart.remove(); }, 10000);
}
setInterval(createHeart, 800);

// --- LIGHTBOX LOGIC ---
const galleryCards = document.querySelectorAll('.card');
const imagesData = Array.from(galleryCards).map(card => ({
  src: card.querySelector('img').src,
  note: card.querySelector('.note-overlay').textContent
}));
let currentIndex = 0;
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxNote = document.getElementById('lightboxNote');

function openLightbox(src, note) {
  // find index
  currentIndex = imagesData.findIndex(item => item.src.includes(src.split('/').pop()) || item.src === src);
  if (currentIndex === -1) currentIndex = 0;
  updateLightbox();
  lightbox.classList.add('active');
}

function closeLightbox() {
  lightbox.classList.remove('active');
}

function navigateLightbox(direction) {
  currentIndex = (currentIndex + direction + imagesData.length) % imagesData.length;
  updateLightbox();
}

function updateLightbox() {
  lightboxImg.src = imagesData[currentIndex].src;
  lightboxNote.textContent = imagesData[currentIndex].note;
}

// Close lightbox with Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
  if (e.key === 'ArrowRight') navigateLightbox(1);
});

// --- HERO SLIDER ---
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
  const sliderTrack = heroSlider.querySelector('.slider-track');
  const slides = heroSlider.querySelectorAll('.slide');
  const prevButton = heroSlider.querySelector('.slider-control.prev');
  const nextButton = heroSlider.querySelector('.slider-control.next');
  let currentSlide = 0;

  function updateHeroSlider() {
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  prevButton.addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateHeroSlider();
  });
  nextButton.addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateHeroSlider();
  });

  setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    updateHeroSlider();
  }, 5500);
}

// --- MUSIC PLAYER TOGGLE ---
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let musicPlaying = false;
musicToggle.addEventListener('click', () => {
  if (musicPlaying) {
    bgMusic.pause();
    musicToggle.innerHTML = '<i class="fas fa-music"></i>';
    musicToggle.style.background = 'rgba(255,255,255,0.7)';
  } else {
    bgMusic.play().catch(e => console.log('Autoplay prevented, click again.'));
    musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    musicToggle.style.background = 'rgba(236,72,153,0.2)';
  }
  musicPlaying = !musicPlaying;
});
// Try to autoplay on first user interaction (click anywhere)
document.body.addEventListener('click', () => {
  if (!musicPlaying) {
    bgMusic.play().then(() => {
      musicPlaying = true;
      musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
      musicToggle.style.background = 'rgba(236,72,153,0.2)';
    }).catch(()=>{});
  }
}, { once: true });

// Smooth scroll for internal links (just for bonus)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

// ========== AUTHENTICATION & USER PROFILE ==========

// Display user name on page load
window.addEventListener('DOMContentLoaded', () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  if (currentUser) {
    document.getElementById('userName').textContent = `👋 Welcome, ${currentUser.name}!`;
  }
});

// Logout function
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.setItem('currentUser', JSON.stringify(null));
    window.location.href = 'auth.html';
  }
}

