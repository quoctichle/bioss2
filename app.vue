<script setup>
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
      window.location.href = `fb://profile/${dest}`; // hoặc fb://facewebmodal/f?href=${url}
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
    
    <div class="content-wrapper">
      <!-- Logo Section -->
      <div class="logo-section">
        <div class="logo-image-placeholder">
          <!-- User can replace with actual logo image -->
          <img src="/logo.png" alt="Sunshine Ecosystem Logo" class="logo-img" />
        </div>
        <h1 class="brand-title">HỆ SINH THÁI SUNSHINE</h1>
        <p class="brand-subtitle">SUNSHINE ECOSYSTEM 🌍</p>
        <div class="divider"></div>
      </div>

      <!-- Links Section -->
      <div class="links-section">
        <a href="https://vt.tiktok.com/ZSu79d6Qa/?page=TikTokShop" target="_blank" class="btn btn-orange">
          <img src="/giohang.png" alt="Cart" class="btn-img-icon" />
          <span class="btn-text">TikTok Shop <span class="divider-text">|</span> Order Now</span>
        </a>

        <a href="https://m.me/SUNSHINE.HOME.PAGE" @click="openLink($event, 'messenger', 'SUNSHINE.HOME.PAGE', 'https://m.me/SUNSHINE.HOME.PAGE')" class="btn btn-green">
          <img src="/tinnhan.png" alt="Message" class="btn-img-icon" />
          <span class="btn-text">VN</span>
          <img src="/viet.png" alt="VN" class="flag-icon" />
          <span class="btn-text divider-text">|</span>
          <span class="btn-text">Vietnamese Support</span>
        </a>

        <a href="https://m.me/SUNSHINE.HOME.PAGE" @click="openLink($event, 'messenger', 'SUNSHINE.HOME.PAGE', 'https://m.me/SUNSHINE.HOME.PAGE')" class="btn btn-green">
          <img src="/tinnhan.png" alt="Message" class="btn-img-icon" />
          <span class="btn-text">EN</span>
          <img src="/anh.png" alt="EN" class="flag-icon" />
          <span class="btn-text divider-text">|</span>
          <span class="btn-text">English Support</span>
        </a>

        <a href="https://m.me/sunshine.myanmar.sim.wifi" @click="openLink($event, 'messenger', 'sunshine.myanmar.sim.wifi', 'https://m.me/sunshine.myanmar.sim.wifi')" class="btn btn-green">
          <img src="/tinnhan.png" alt="Message" class="btn-img-icon" />
          <span class="btn-text">MM</span>
          <img src="/myanma.png" alt="MM" class="flag-icon" />
          <span class="btn-text divider-text">|</span>
          <span class="btn-text">Myanmar Support</span>
        </a>

        <a href="https://www.facebook.com/sunshineglobal.vn" @click="openLink($event, 'facebook', 'sunshineglobal.vn', 'https://www.facebook.com/sunshineglobal.vn')" class="btn btn-green">
          <img src="/toanha.png" alt="Building" class="btn-img-icon" />
          <span class="btn-text">Ecosystem <span class="divider-text">|</span> Sunshine Global</span>
        </a>

        <a href="https://sunshine-telecom.net/" target="_blank" class="btn btn-green">
          <img src="/global.png" alt="Global" class="btn-img-icon" />
          <span class="btn-text">Official Website</span>
        </a>
      </div>
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

.bg-wrapper {
  position: fixed;
  inset: 0;
  z-index: -1;
  background: url('/nen.png') center/cover no-repeat;
}

.landing-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  font-family: 'Nunito', sans-serif;
  color: #333;
}

.content-wrapper {
  width: 100%;
  max-width: 450px;
  padding: 40px 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
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

.brand-subtitle {
  font-family: 'FSMagistral', 'Montserrat', sans-serif;
  font-size: 13px;
  color: #e8862f; 
  font-weight: normal; 
  margin: 0;
  letter-spacing: 0.5px;
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

/* Nền chung cơ bản cho các nút */
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
  color: #fdfdfd; /* Giảm độ trắng gắt của chữ */
  position: relative;
  transition: all 0.2s ease;
  overflow: hidden;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.4);
  
  /* Sử dụng trực tiếp ảnh nut.png làm nền duy nhất, không dùng mix-blend-mode */
  background: url('/nut.png') center/cover no-repeat;
  
  /* Hiệu ứng 3D nổi khối cơ bản nhưng mờ và đằm hơn */
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.2), 
    inset 0px 3px 6px rgba(255, 255, 255, 0.4), 
    inset 0px -4px 6px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* Bỏ lớp ::after highlight chung rực rỡ cũ đi (nó đã được tạo lại êm dịu hơn cho từng màu nút bên dưới) */
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
  height: 26px; /* Cờ to hơn hẳn */
  width: auto;
  margin: 0 4px; 
  object-fit: contain;
  transform: translateY(2px); /* Đẩy cờ thấp xuống (số dương là đi xuống) */
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

/* Biến nút thành cam bằng cách phủ lớp màu đè lên nut.png */
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
  background-color: #fca130; /* Trầm lại, bớt chói rực vàng */
  mix-blend-mode: color; /* Đổi tone màu của nut.png thành cam mà không mất vân/shadow */
  pointer-events: none;
  z-index: 1;
}

/* Thêm lớp màn hơi ngả úa retro phủ lên để giảm chói (Vintage effect) */
.btn-orange::after {
  content: '';
  position: absolute;
  top: 1px; left: 1px; right: 1px; bottom: 1px;
  border-radius: 50px;
  border-top: 2px solid rgba(255, 255, 255, 0.6); /* Giảm độ gắt của viền sáng */
  background: rgba(80, 60, 20, 0.1); /* Phủ màng trầm nhẹ */
  pointer-events: none;
  z-index: 2;
}

/* Nút xanh tự dùng ảnh gốc nut.png, chỉ thêm bóng Vintage */
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
  border-top: 2px solid rgba(255, 255, 255, 0.6); /* Nhẹ nhàng hơn */
  background: rgba(30, 50, 20, 0.1); /* Lớp bụi/sepia cực nhẹ cản sáng ảnh gốc làm nó đằm lại */
  pointer-events: none;
  z-index: 2;
}
</style>
