<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const currentLang = ref('jp'); // Mặc định là tiếng Nhật
const isDropdownOpen = ref(false);

const languages = [
  { code: 'jp', name: '日本語', flag: '/nhat.png' },
  { code: 'en', name: 'English', flag: '/anh.png' },
  { code: 'vi', name: 'Tiếng Việt', flag: '/viet.png' },
  { code: 'mm', name: 'မြန်မာ', flag: '/myanma.png' }
];

const currentLangObj = computed(() => languages.find(l => l.code === currentLang.value));

const selectLang = (code) => {
  currentLang.value = code;
  isDropdownOpen.value = false;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Đóng dropdown khi click ra ngoài
const closeDropdown = (e) => {
  if (!e.target.closest('.lang-dropdown-wrapper')) {
    isDropdownOpen.value = false;
  }
};

// --- Bảo mật: Vẫn cho F12 nhưng chặn chuột phải (ngăn bôi đen / tải ảnh dễ dàng) ---
const disableRightClick = (e) => {
  e.preventDefault();
};

onMounted(() => {
  document.addEventListener('click', closeDropdown);
  document.addEventListener('contextmenu', disableRightClick);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
  document.removeEventListener('contextmenu', disableRightClick);
});

const textTr = {
  vi: {
    title: "HỆ SINH THÁI SUNSHINE GLOBAL",
    tiktok1: "TikTok Shop",
    tiktok2: "Mua Ngay",
    btn1_1: "VN",
    btn1_2: "Hỗ trợ Tiếng Việt",
    btn2_1: "EN",
    btn2_2: "Hỗ trợ Tiếng Anh",
    btn3_1: "MM",
    btn3_2: "Hỗ trợ Tiếng Myanmar",
    btn4: "Fanpage Sunshine Global",
    btn5: "Website Sunshine Telecom",
    eventLabel: "Sự kiện đang diễn ra",
    eventPrefix: "Mini Game |"
  },
  en: {
    title: "SUNSHINE GLOBAL ECOSYSTEM",
    tiktok1: "TikTok Shop",
    tiktok2: "Order Now",
    btn1_1: "VN",
    btn1_2: "Vietnamese Support",
    btn2_1: "EN",
    btn2_2: "English Support",
    btn3_1: "MM",
    btn3_2: "Myanmar Support",
    btn4: "Fanpage Sunshine Global",
    btn5: "Website Sunshine Telecom",
    eventLabel: "Current Event",
    eventPrefix: "Mini Game |"
  },
  jp: {
    title: "サンシャイン グローバル エコシステム",
    tiktok1: "TikTok Shop",
    tiktok2: "今すぐ注文",
    btn1_1: "VN",
    btn1_2: "ベトナム語サポート",
    btn2_1: "EN",
    btn2_2: "英語サポート",
    btn3_1: "MM",
    btn3_2: "ミャンマー語サポート",
    btn4: "ファンページ Sunshine Global",
    btn5: "ウェブサイト Sunshine Telecom",
    eventLabel: "現在のイベント",
    eventPrefix: "Mini Game |"
  },
  mm: {
    title: "SUNSHINE GLOBAL ဂေဟစနစ်",
    tiktok1: "TikTok Shop",
    tiktok2: "ယခုမှာယူပါ",
    btn1_1: "VN",
    btn1_2: "ဗီယက်နမ် အကူအညီ",
    btn2_1: "EN",
    btn2_2: "အင်္ဂလိပ် အကူအညီ",
    btn3_1: "MM",
    btn3_2: "မြန်မာ အကူအညီ",
    btn4: "ဖန်ပေ့ခ်် Sunshine Global",
    btn5: "ဝဘ်ဆိုဒ် Sunshine Telecom",
    eventLabel: "လက်ရှိ ကျင်းပနေသော ပွဲ",
    eventPrefix: "Mini Game |"
  }
};

const t = computed(() => textTr[currentLang.value]);

const { data: eventPayload } = await useFetch('/api/events');

const normalizeEventLink = (rawLink) => {
  if (!rawLink) {
    return null;
  }
  const trimmed = rawLink.toString().trim();
  if (!trimmed) {
    return null;
  }
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const normalized = trimmed.replace(/^\/+|\/+$/g, '');
  return `https://www.event-sunshine-telecom.io.vn/${normalized}`;
};

const activeEvents = computed(() => {
  const rows = eventPayload.value?.events ?? [];
  return rows
    .map((event) => {
      const url = normalizeEventLink(event?.link);
      if (!url) {
        return null;
      }
      return {
        ...event,
        url
      };
    })
    .filter(Boolean);
});

const openLink = (event, type, dest, url) => {
  event.preventDefault();
  
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const isAndroid = /android/i.test(userAgent);
  const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
  
  if (type === 'messenger') {
    if (isAndroid) {
      window.location.href = `intent://m.me/${dest}#Intent;package=com.facebook.orca;scheme=https;end`;
    } else if (isIOS) {
      window.location.href = `fb-messenger://user-thread/${dest}`;
      setTimeout(() => { window.location.href = url; }, 500);
    } else {
      window.open(url, '_blank');
    }
  } else if (type === 'facebook') {
    if (isAndroid) {
      window.location.href = `intent://www.facebook.com/${dest}#Intent;package=com.facebook.katana;scheme=https;end`;
    } else if (isIOS) {
      window.location.href = `fb://profile/${dest}`;
      setTimeout(() => { window.location.href = url; }, 500);
    } else {
      window.open(url, '_blank');
    }
  } else {
    window.open(url, '_blank');
  }
};
</script>

<template>
  <div class="landing-container">
    <div class="bg-wrapper"></div>
    
    <!-- Language Selector Dropdown -->
    <div class="lang-dropdown-wrapper">
      <button class="lang-selected" @click="toggleDropdown">
        <img :src="currentLangObj.flag" :alt="currentLangObj.name" class="lang-flag-main" />
        <span class="arrow" :class="{ up: isDropdownOpen }"></span>
      </button>
      
      <div v-show="isDropdownOpen" class="lang-dropdown-menu">
        <button 
          v-for="lang in languages" 
          :key="lang.code"
          :class="['lang-option', { active: currentLang === lang.code }]"
          @click="selectLang(lang.code)"
        >
          <img :src="lang.flag" :alt="lang.name" class="lang-flag" />
          <span class="lang-name">{{ lang.name }}</span>
        </button>
      </div>
    </div>

    <div class="content-wrapper">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-image-placeholder">
          <img src="/logo.png" alt="Sunshine Ecosystem Logo" class="logo-img" />
        </div>
        <h1 class="brand-title">{{ t.title }}</h1>
        <div class="divider"></div>
      </div>

      <!-- Links Section -->
      <div class="links-section">
        <a href="https://vt.tiktok.com/ZSu79d6Qa/?page=TikTokShop" target="_blank" class="btn btn-orange">
          <div class="shine"></div>
          <img src="/giohang.png" alt="Cart" class="btn-img-icon" />
          <span class="btn-text">{{ t.tiktok1 }} <span class="divider-text">|</span> {{ t.tiktok2 }}</span>
        </a>

        <a href="https://m.me/SUNSHINE.HOME.PAGE" @click="openLink($event, 'messenger', 'SUNSHINE.HOME.PAGE', 'https://m.me/SUNSHINE.HOME.PAGE')" class="btn btn-green">
          <div class="shine"></div>
          <img src="/tinnhan.png" alt="Message" class="btn-img-icon" />
          <span class="btn-text">{{ t.btn1_1 }}</span>
          <img src="/viet.png" alt="VN" class="flag-icon" />
          <span class="btn-text divider-text">|</span>
          <span class="btn-text">{{ t.btn1_2 }}</span>
        </a>

        <a href="https://m.me/SUNSHINE.HOME.PAGE" @click="openLink($event, 'messenger', 'SUNSHINE.HOME.PAGE', 'https://m.me/SUNSHINE.HOME.PAGE')" class="btn btn-green">
          <div class="shine"></div>
          <img src="/tinnhan.png" alt="Message" class="btn-img-icon" />
          <span class="btn-text">{{ t.btn2_1 }}</span>
          <img src="/anh.png" alt="EN" class="flag-icon" />
          <span class="btn-text divider-text">|</span>
          <span class="btn-text">{{ t.btn2_2 }}</span>
        </a>

        <a href="https://m.me/sunshine.myanmar.sim.wifi" @click="openLink($event, 'messenger', 'sunshine.myanmar.sim.wifi', 'https://m.me/sunshine.myanmar.sim.wifi')" class="btn btn-green">
          <div class="shine"></div>
          <img src="/tinnhan.png" alt="Message" class="btn-img-icon" />
          <span class="btn-text">{{ t.btn3_1 }}</span>
          <img src="/myanma.png" alt="MM" class="flag-icon" />
          <span class="btn-text divider-text">|</span>
          <span class="btn-text">{{ t.btn3_2 }}</span>
        </a>

        <a href="https://www.facebook.com/sunshineglobal.vn" @click="openLink($event, 'facebook', 'sunshineglobal.vn', 'https://www.facebook.com/sunshineglobal.vn')" class="btn btn-orange">
          <div class="shine"></div>
          <img src="/toanha.png" alt="Building" class="btn-img-icon" />
          <span class="btn-text">{{ t.btn4 }}</span>
        </a>

        <a href="https://shop.sunshine-telecom.net/" target="_blank" class="btn btn-orange">
          <div class="shine"></div>
          <img src="/global.png" alt="Global" class="btn-img-icon" />
          <span class="btn-text">{{ t.btn5 }}</span>
        </a>

        <a
          v-for="event in activeEvents"
          :key="event.eventId || event.title || event.link"
          :href="event.url"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-orange event-btn"
        >
          <div class="shine"></div>
          <span class="btn-icon">🎉</span>
          <span class="btn-text">
            <span class="event-prefix">{{ t.eventPrefix }}</span>
            <span>{{ event.title || t.eventLabel }}</span>
          </span>
        </a>
      </div>
    </div>

    <div class="footer-card" role="presentation" aria-label="Sunshine Telecom landscape">
      <img src="/footer.png" alt="Sunshine Telecom landscape" aria-hidden="true" />
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700;800&family=Nunito:wght@600;700&display=swap');

@font-face {
  font-family: 'FSMagistral';
  src: url('/FS MAGISTRAL-BOLD.TTF') format('truetype');
  font-weight: bold;
  font-style: normal;
}

* {
  box-sizing: border-box;
}

:global(html, body) {
  margin: 0;
  padding: 0;
  min-height: 100svh;
}

:global(body) {
  background: linear-gradient(180deg, #fdf7df 0%, #f6f6df 45%, #dcefdc 90%);
  min-height: 100svh;
}

.bg-wrapper {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-image: url('/nen.png');
  background-position: center; 
  background-size: 100% 100%;
  background-repeat: no-repeat;
  filter: contrast(1.05) brightness(1.02);
}

@media (min-width: 768px) {
  .bg-wrapper {
    background-size: cover;
  }
}

.bg-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.3) 0%, transparent 60%), 
              linear-gradient(to bottom, rgba(230, 245, 230, 0.4) 0%, transparent 40%, rgba(26, 91, 54, 0.1) 100%);
  pointer-events: none;
  z-index: 1;
}

.landing-container {
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  font-family: 'Nunito', sans-serif;
  color: #333;
  position: relative;
  overflow-x: hidden;
  padding: env(safe-area-inset-top, 0) 0 48px;
  gap: 24px;
}

.lang-dropdown-wrapper {
  position: absolute;
  top: 15px;
  right: 15px;
  z-index: 100;
  font-family: 'Nunito', sans-serif;
}

.lang-selected {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(26, 91, 54, 0.3);
  padding: 6px 12px;
  border-radius: 30px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
}

.lang-selected:hover {
  background: rgba(255, 255, 255, 0.6);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8);
}

.lang-flag-main {
  width: 28px;
  height: 28px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  border: 1px solid rgba(255,255,255,0.8);
}

.arrow {
  border: solid #1a5b36;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 3px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
  margin-left: 2px;
  margin-bottom: 2px;
  transition: transform 0.3s ease;
}

.arrow.up {
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
  margin-bottom: -2px;
}

.lang-dropdown-menu {
  position: absolute;
  top: 110%;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-width: 120px;
  animation: fadeInDown 0.2s ease-out forwards;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  color: #333;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  transition: background 0.2s ease;
}

.lang-option:hover {
  background: rgba(0, 0, 0, 0.05);
}

.lang-option.active {
  background: rgba(26, 91, 54, 0.1);
  color: #1a5b36;
}

.lang-flag {
  width: 20px;
  height: 20px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.lang-name {
  white-space: nowrap;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-wrapper {
  width: 100%;
  max-width: 450px;
  padding: 40px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeUpContent 0.8s ease-out forwards;
}

.logo-section {
  text-align: center;
  margin-bottom: 30px;
  width: 100%;
}

.logo-image-placeholder {
  width: 120px;
  height: 120px;
  margin: 0 auto 10px;
  animation: floatLogo 4s ease-in-out infinite;
}

.logo-img {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.brand-title {
  font-family: 'FSMagistral', 'Montserrat', sans-serif;
  font-size: 22px;
  font-weight: normal; 
  color: #1a5b36;
  margin: 5px 0;
  letter-spacing: 0px;
  text-shadow: 0px 0px 1px rgba(26, 91, 54, 0.4);
}

@media (max-width: 480px) {
  .brand-title {
    font-size: 18px;
    letter-spacing: 0.5px;
  }
}

.divider {
  height: 2px;
  background: linear-gradient(to right, transparent, rgba(26, 91, 54, 0.3), transparent);
  margin: 18px auto 25px;
  width: 70%;
}

.links-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 16px 20px;
  border-radius: 50px;
  text-decoration: none;
  font-family: 'FSMagistral', 'Montserrat', sans-serif;
  font-weight: normal; 
  font-size: 16px;
  color: #fdfdfd;
  position: relative;
  transition: all 0.2s ease;
  overflow: hidden;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  background: url('/nut.png') center/cover no-repeat;
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.2), 
    inset 0px 3px 6px rgba(255, 255, 255, 0.4), 
    inset 0px -4px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn:active {
  transform: translateY(2px) scale(0.98);
}

.btn-icon {
  margin-right: 8px;
  font-size: 22px;
  filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
  z-index: 3;
}

.btn-img-icon {
  height: 24px;
  width: auto;
  margin-right: 12px;
  object-fit: contain;
  filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.3));
  z-index: 3;
}

.flag-icon {
  height: 26px;
  width: auto;
  margin: 0 4px; 
  object-fit: contain;
  transform: translateY(2px);
  z-index: 3;
}

.divider-text {
  margin: 0 6px;
  opacity: 0.8;
  font-weight: 300;
}

.btn-text {
  z-index: 3;
  position: relative;
}

.event-prefix {
  margin-right: 6px;
  opacity: 0.85;
  font-size: 14px;
  letter-spacing: 0.5px;
}

.btn-orange {
  box-shadow: 
    0 6px 12px rgba(180, 110, 20, 0.3), 
    inset 0px 3px 8px rgba(255, 255, 255, 0.4), 
    inset 0px -5px 8px rgba(160, 80, 0, 0.4);
}

.btn-orange::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50px;
  background-color: #fca130;
  mix-blend-mode: color;
  pointer-events: none;
  z-index: 1;
}

.btn-orange::after {
  content: '';
  position: absolute;
  top: 1px; left: 1px; right: 1px; bottom: 1px;
  border-radius: 50px;
  border-top: 2px solid rgba(255, 255, 255, 0.6);
  background: rgba(80, 60, 20, 0.1);
  pointer-events: none;
  z-index: 2;
}

.btn-green {
  box-shadow: 
    0 6px 12px rgba(40, 90, 30, 0.3), 
    inset 0px 3px 8px rgba(255, 255, 255, 0.4), 
    inset 0px -5px 8px rgba(35, 80, 20, 0.4);
}

.btn-green::after {
  content: '';
  position: absolute;
  top: 1px; left: 1px; right: 1px; bottom: 1px;
  border-radius: 50px;
  border-top: 2px solid rgba(255, 255, 255, 0.6);
  background: rgba(30, 50, 20, 0.1);
  pointer-events: none;
  z-index: 2;
}

@keyframes floatLogo {
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-8px) rotate(1deg); }
  50% { transform: translateY(-12px) rotate(0deg); }
  75% { transform: translateY(-8px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

@keyframes fadeUpContent {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseBtn {
  0% { box-shadow: 0 4px 10px rgba(252, 161, 48, 0.4); }
  50% { box-shadow: 0 8px 20px rgba(252, 161, 48, 0.8); }
  100% { box-shadow: 0 4px 10px rgba(252, 161, 48, 0.4); }
}

@keyframes slowZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.05); }
}

@keyframes shimmerEffect {
  0% { transform: translateX(-150%) skewX(-15deg); }
  50%, 100% { transform: translateX(250%) skewX(-15deg); }
}

.links-section .btn .shine {
  animation: shimmerEffect 4s infinite linear;
}

.links-section .btn:nth-child(1) .shine { animation-delay: 0s; }
.links-section .btn:nth-child(2) .shine { animation-delay: 1s; }
.links-section .btn:nth-child(3) .shine { animation-delay: 1.5s; }
.links-section .btn:nth-child(4) .shine { animation-delay: 2s; }
.links-section .btn:nth-child(5) .shine { animation-delay: 2.5s; }
.links-section .btn:nth-child(6) .shine { animation-delay: 3s; }

.links-section .btn {
  opacity: 0;
  animation: fadeUpContent 0.5s ease-out forwards;
}

.links-section .btn:nth-child(1) { animation-delay: 0.15s; }
.links-section .btn:nth-child(2) { animation-delay: 0.25s; }
.links-section .btn:nth-child(3) { animation-delay: 0.35s; }
.links-section .btn:nth-child(4) { animation-delay: 0.45s; }
.links-section .btn:nth-child(5) { animation-delay: 0.55s; }
.links-section .btn:nth-child(6) { animation-delay: 0.65s; }

.links-section .btn:nth-child(1) { 
  animation: fadeUpContent 0.5s ease-out forwards 0.15s, pulseBtn 2s infinite ease-in-out 1s; 
}

.btn:hover {
  transform: translateY(-3px);
  filter: brightness(1.1);
}

.btn:active {
  transform: translateY(2px);
  filter: brightness(0.95);
}

.footer-card {
  width: min(960px, 100%);
  position: relative;
  margin-top: 24px;
  overflow: hidden;
  border-radius: 32px;
  min-height: clamp(220px, 24vw, 320px);
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(24px, 2vw, 32px);
  max-height: min(50vh, 520px);
}

.footer-card img {
  width: min(900px, 100%);
  height: auto;
  object-fit: contain;
  display: block;
  border-radius: 20px;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  max-height: 100%;
}

.footer-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(12px);
  pointer-events: none;
  z-index: 1;
}

@media (max-width: 640px) {
  .content-wrapper {
    padding: 32px 18px;
  }

  .btn {
    padding: 14px 16px;
    font-size: 15px;
  }

  .links-section {
    gap: 12px;
  }

  .footer-card {
    min-height: clamp(200px, 32vw, 260px);
  }
}
</style>
