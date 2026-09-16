/**
 * ==========================================================================
 * 🌸 療癒時光小天地 - 核心互動邏輯 (Kawaii Core Script) 🌸
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // ========================================================================
  // 1. Web Audio API 可愛音效合成器 (Cute Web Audio Synth)
  // ========================================================================
  class CuteAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    // 氣泡彈跳音效 (Bubble Pop)
    playPop() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    }

    // 摸摸小動物歡樂和弦音 (Pet Squeak / Sparkle)
    playPet() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const freqs = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
      const now = this.ctx.currentTime;

      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + idx * 0.035;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.22);
      });
    }

    // 餵食嚼嚼音效 (Munch Munch)
    playMunch() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [0, 0.1].forEach((delay) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = now + delay;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, startTime);
        osc.frequency.exponentialRampToValueAtTime(140, startTime + 0.06);

        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.08);
      });
    }

    // 撒花夢幻風鈴音效 (Chime Cascade)
    playChime() {
      if (!this.enabled) return;
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      const now = this.ctx.currentTime;

      notes.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + i * 0.06;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);

        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.45);
      });
    }
  }

  const audio = new CuteAudio();

  // ========================================================================
  // 2. 時鐘、日期與問候語模組 (Clock & Greeting Engine)
  // ========================================================================
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  const ampmEl = document.getElementById('ampm');
  const fullDateTextEl = document.getElementById('fullDateText');
  const dayOfWeekTextEl = document.getElementById('dayOfWeekText');
  const greetingTextEl = document.getElementById('greetingText');

  const daysChinese = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

  function getGreeting(hour) {
    if (hour >= 5 && hour < 9) {
      return { emoji: '🌅', text: '早安晨光！迎著微風開始美好的一天吧～ (´,,•ω•,,)♡' };
    } else if (hour >= 9 && hour < 12) {
      return { emoji: '☀️', text: '元氣上午！記得喝杯溫水，保持滿滿專注力喔 ✨' };
    } else if (hour >= 12 && hour < 14) {
      return { emoji: '🍱', text: '午餐時間到！好好享用美食，補充能量再出發 🍙' };
    } else if (hour >= 14 && hour < 17) {
      return { emoji: '🍰', text: '悠閒下午茶！吃塊小餅乾，給自己一個大大的抱抱 🧁' };
    } else if (hour >= 17 && hour < 19) {
      return { emoji: '🌇', text: '傍晚夕陽好美！今天的你也超級棒，辛苦囉 🌸' };
    } else if (hour >= 19 && hour < 22) {
      return { emoji: '🌙', text: '美好晚間時光！聽首喜歡的歌，放鬆身心休息吧 🎵' };
    } else {
      return { emoji: '⭐', text: '深夜靜悄悄～小動物都在睡覺囉，要早點休息祝好夢 💤' };
    }
  }

  function updateClock() {
    const now = new Date();
    const rawHours = now.getHours();
    const rawMinutes = now.getMinutes();
    const rawSeconds = now.getSeconds();

    // 12小時制換算
    const displayHours = rawHours % 12 || 12;
    const ampm = rawHours >= 12 ? 'PM' : 'AM';

    hoursEl.textContent = String(displayHours).padStart(2, '0');
    minutesEl.textContent = String(rawMinutes).padStart(2, '0');
    secondsEl.textContent = String(rawSeconds).padStart(2, '0');
    ampmEl.textContent = ampm;

    // 日期
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    fullDateTextEl.textContent = `${year} 年 ${month} 月 ${date} 日`;
    dayOfWeekTextEl.textContent = daysChinese[now.getDay()];

    // 心情籤語
    const greeting = getGreeting(rawHours);
    if (greetingTextEl.dataset.currentHour !== String(rawHours)) {
      greetingTextEl.textContent = greeting.text;
      const emojiEl = document.querySelector('.greeting-emoji');
      if (emojiEl) emojiEl.textContent = greeting.emoji;
      greetingTextEl.dataset.currentHour = String(rawHours);
    }
  }

  setInterval(updateClock, 1000);
  updateClock();

  // ========================================================================
  // 3. 使用者名字管理模組 (User Name Customization)
  // ========================================================================
  const userNameText = document.getElementById('userNameText');
  const nameDisplayBtn = document.getElementById('nameDisplayBtn');
  const editNameBtn = document.getElementById('editNameBtn');
  const nameModal = document.getElementById('nameModal');
  const nameInput = document.getElementById('nameInput');
  const cancelNameBtn = document.getElementById('cancelNameBtn');
  const saveNameBtn = document.getElementById('saveNameBtn');

  const STORAGE_KEY_NAME = 'kawaii_user_name_010';
  const savedName = localStorage.getItem(STORAGE_KEY_NAME);
  if (savedName && savedName.trim()) {
    userNameText.textContent = savedName.trim();
  } else {
    userNameText.textContent = '親愛的主人';
  }

  function openNameModal() {
    audio.playPop();
    nameInput.value = userNameText.textContent;
    nameModal.classList.add('active');
    setTimeout(() => nameInput.focus(), 150);
  }

  function closeNameModal() {
    nameModal.classList.remove('active');
  }

  function saveNewName() {
    const trimmed = nameInput.value.trim();
    if (trimmed) {
      userNameText.textContent = trimmed;
      localStorage.setItem(STORAGE_KEY_NAME, trimmed);
    }
    audio.playPet();
    closeNameModal();
    spawnHeartBurst(window.innerWidth / 2, window.innerHeight / 2);
  }

  nameDisplayBtn.addEventListener('click', openNameModal);
  editNameBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openNameModal();
  });
  cancelNameBtn.addEventListener('click', closeNameModal);
  saveNameBtn.addEventListener('click', saveNewName);

  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveNewName();
    if (e.key === 'Escape') closeNameModal();
  });

  nameModal.addEventListener('click', (e) => {
    if (e.target === nameModal) closeNameModal();
  });

  // ========================================================================
  // 4. 動態生成背景微星與氣泡 (Floating Sparkles)
  // ========================================================================
  const sparklesContainer = document.getElementById('sparklesContainer');
  for (let i = 0; i < 24; i++) {
    const dot = document.createElement('div');
    dot.className = 'sparkle-dot';
    const size = Math.random() * 6 + 3;
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 70}%`;
    dot.style.animationDelay = `${Math.random() * 4}s`;
    dot.style.animationDuration = `${Math.random() * 3 + 2}s`;
    sparklesContainer.appendChild(dot);
  }

  // ========================================================================
  // 5. 超萌小動物系統 (Cute Walking Critters Engine)
  // ========================================================================
  const playground = document.getElementById('playground');
  const animalsTrack = document.getElementById('animalsTrack');
  const treatsLayer = document.getElementById('treatsLayer');

  // 小動物精緻 SVG 模板 (小羊、小貓咪、小兔子)
  const CRITTER_TEMPLATES = [
    {
      id: 'sheep',
      name: '小羊',
      quotes: ['咩～ 🐑', '毛茸茸的好暖和～ ☁️', '嚼嚼青草真香甜 🌱', '想要和小主人抱抱 💕', '今天也是元氣滿滿的一天～ ✨'],
      svg: `
        <svg class="critter-sprite" viewBox="0 0 100 100">
          <!-- 羊尾巴小棉球 -->
          <circle class="critter-tail" cx="20" cy="68" r="6" fill="#FFFFFF" stroke="#E9ECEF" stroke-width="1.2" />
          <!-- 蓬鬆羊毛身體 (多層雲朵質感) -->
          <g class="critter-body">
            <ellipse cx="50" cy="68" rx="25" ry="20" fill="#FFFFFF" stroke="#E9ECEF" stroke-width="1.2" />
            <circle cx="32" cy="64" r="10" fill="#FFFFFF" />
            <circle cx="44" cy="56" r="9" fill="#FFFFFF" />
            <circle cx="58" cy="56" r="9" fill="#FFFFFF" />
            <circle cx="68" cy="64" r="9" fill="#FFFFFF" />
            <circle cx="36" cy="74" r="9" fill="#FFFFFF" />
            <circle cx="64" cy="74" r="9" fill="#FFFFFF" />
            <circle cx="50" cy="74" r="9" fill="#FFFFFF" />
            <!-- 粉紅項圈與黃金小鈴鐺 -->
            <path d="M 40 64 Q 50 71 60 64" stroke="#FF70A6" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <circle cx="50" cy="68" r="3.2" fill="#FFD166" />
            <circle cx="50" cy="69" r="1" fill="#E09F3E" />
          </g>
          <!-- 小羊頭部 -->
          <g class="critter-head">
            <!-- 羊耳朵 (下垂萌萌耳) -->
            <ellipse cx="28" cy="46" rx="9" ry="5.5" fill="#FFE5D9" transform="rotate(-20 28 46)" />
            <ellipse cx="28" cy="46" rx="6" ry="3.5" fill="#FFB4A2" transform="rotate(-20 28 46)" />
            <ellipse cx="72" cy="46" rx="9" ry="5.5" fill="#FFE5D9" transform="rotate(20 72 46)" />
            <ellipse cx="72" cy="46" rx="6" ry="3.5" fill="#FFB4A2" transform="rotate(20 72 46)" />
            <!-- 臉蛋 -->
            <ellipse cx="50" cy="48" rx="20" ry="18" fill="#FFE5D9" />
            <!-- 頭頂蓬鬆棉花糖羊毛 -->
            <circle cx="42" cy="33" r="8" fill="#FFFFFF" stroke="#E9ECEF" stroke-width="1" />
            <circle cx="58" cy="33" r="8" fill="#FFFFFF" stroke="#E9ECEF" stroke-width="1" />
            <circle cx="50" cy="30" r="9" fill="#FFFFFF" stroke="#E9ECEF" stroke-width="1" />
            <circle cx="50" cy="33" r="7" fill="#FFFFFF" />
            <!-- 水靈大眼睛 -->
            <ellipse cx="42" cy="46" rx="3.4" ry="4.2" fill="#3D2C2E" />
            <circle cx="43.2" cy="44.2" r="1.3" fill="#FFFFFF" />
            <ellipse cx="58" cy="46" rx="3.4" ry="4.2" fill="#3D2C2E" />
            <circle cx="59.2" cy="44.2" r="1.3" fill="#FFFFFF" />
            <!-- 粉嫩腮紅 -->
            <ellipse cx="35" cy="51" rx="4.2" ry="2.5" fill="#FF8FA3" opacity="0.75" />
            <ellipse cx="65" cy="51" rx="4.2" ry="2.5" fill="#FF8FA3" opacity="0.75" />
            <!-- 嘴巴與小鼻 -->
            <polygon points="50,50 48.5,48.5 51.5,48.5" fill="#FF758F" />
            <path d="M 50 50 L 50 52 M 48 53 Q 50 55 52 53" stroke="#3D2C2E" stroke-width="1.5" fill="none" stroke-linecap="round" />
            <!-- 頭頂小粉花 -->
            <circle cx="38" cy="27" r="3.2" fill="#FFAFCC" />
            <circle cx="38" cy="27" r="1.3" fill="#FFE66D" />
          </g>
          <!-- 羊蹄子腳腳 -->
          <g class="critter-feet">
            <ellipse cx="38" cy="85" rx="5.5" ry="4" fill="#5E503F" />
            <ellipse cx="62" cy="85" rx="5.5" ry="4" fill="#5E503F" />
          </g>
        </svg>
      `
    },
    {
      id: 'cat',
      name: '小貓咪',
      quotes: ['喵嗚~ 🐾', '呼嚕呼嚕 🥰', '要摸摸嗎？🐱', '最喜歡小魚乾了！🐟', '伸個大懶腰～ (=^･ω･^=)'],
      svg: `
        <svg class="critter-sprite" viewBox="0 0 100 100">
          <!-- 尾巴 -->
          <path class="critter-tail" d="M 22 68 Q 10 52 14 38 Q 18 36 20 46 Q 22 58 30 72 Z" fill="#FFA559" />
          <!-- 身體 -->
          <ellipse class="critter-body" cx="50" cy="68" rx="26" ry="22" fill="#FFA559" />
          <ellipse cx="50" cy="72" rx="17" ry="14" fill="#FFE5D9" />
          <!-- 頭部 -->
          <g class="critter-head">
            <!-- 貓耳 -->
            <polygon points="32,44 26,22 46,32" fill="#FFA559" />
            <polygon points="34,40 30,26 44,32" fill="#FFC4D6" />
            <polygon points="68,44 74,22 54,32" fill="#FFA559" />
            <polygon points="66,40 70,26 56,32" fill="#FFC4D6" />
            <!-- 臉蛋 -->
            <circle cx="50" cy="46" r="23" fill="#FFA559" />
            <!-- 臉頰白斑 -->
            <ellipse cx="50" cy="52" rx="14" ry="10" fill="#FFE5D9" />
            <!-- 眼睛 -->
            <ellipse cx="42" cy="44" rx="3.5" ry="4.5" fill="#3D2C2E" />
            <circle cx="43.5" cy="42.5" r="1.5" fill="#FFFFFF" />
            <ellipse cx="58" cy="44" rx="3.5" ry="4.5" fill="#3D2C2E" />
            <circle cx="59.5" cy="42.5" r="1.5" fill="#FFFFFF" />
            <!-- 腮紅 -->
            <ellipse cx="36" cy="50" rx="4" ry="2.5" fill="#FF8FA3" opacity="0.65" />
            <ellipse cx="64" cy="50" rx="4" ry="2.5" fill="#FF8FA3" opacity="0.65" />
            <!-- 鼻子與小嘴巴 -->
            <polygon points="50,48 48,46 52,46" fill="#FF758F" />
            <path d="M 47 50 Q 50 53 53 50" stroke="#3D2C2E" stroke-width="1.8" fill="none" stroke-linecap="round" />
            <!-- 額頭虎斑 -->
            <path d="M 50 28 L 50 34 M 45 30 L 46 35 M 55 30 L 54 35" stroke="#E07A5F" stroke-width="2" stroke-linecap="round" />
          </g>
          <!-- 腳腳 -->
          <g class="critter-feet">
            <ellipse cx="38" cy="86" rx="6" ry="4" fill="#FFE5D9" />
            <ellipse cx="62" cy="86" rx="6" ry="4" fill="#FFE5D9" />
          </g>
        </svg>
      `
    },
    {
      id: 'bunny',
      name: '小兔子',
      quotes: ['蹦蹦跳！🐰', '想要胡蘿蔔 🥕', '摸摸耳朵好舒服～ 💕', '今天天氣真好呀！🌸', '咕嚕咕嚕 (*´ω｀*)'],
      svg: `
        <svg class="critter-sprite" viewBox="0 0 100 100">
          <!-- 圓棉花尾巴 -->
          <circle class="critter-tail" cx="20" cy="70" r="7" fill="#FFFFFF" />
          <!-- 身體 -->
          <ellipse class="critter-body" cx="50" cy="68" rx="25" ry="20" fill="#FFFFFF" />
          <!-- 垂耳/長耳 -->
          <g class="critter-head">
            <path d="M 38 38 C 30 15 22 22 28 44 Z" fill="#FFFFFF" />
            <path d="M 36 36 C 30 20 25 24 29 42 Z" fill="#FFCCD5" />
            <path d="M 62 38 C 70 15 78 22 72 44 Z" fill="#FFFFFF" />
            <path d="M 64 36 C 70 20 75 24 71 42 Z" fill="#FFCCD5" />
            <!-- 頭部 -->
            <circle cx="50" cy="46" r="21" fill="#FFFFFF" />
            <!-- 眼睛 -->
            <ellipse cx="43" cy="44" rx="3.5" ry="4" fill="#594A42" />
            <circle cx="44" cy="42" r="1.3" fill="#FFFFFF" />
            <ellipse cx="57" cy="44" rx="3.5" ry="4" fill="#594A42" />
            <circle cx="58" cy="42" r="1.3" fill="#FFFFFF" />
            <!-- 腮紅 -->
            <ellipse cx="37" cy="49" rx="4.5" ry="2.5" fill="#FFAFCC" opacity="0.8" />
            <ellipse cx="63" cy="49" rx="4.5" ry="2.5" fill="#FFAFCC" opacity="0.8" />
            <!-- 鼻子嘴巴 -->
            <polygon points="50,47 48.5,45 51.5,45" fill="#FF8FA3" />
            <path d="M 47.5 49 Q 50 51 52.5 49" stroke="#594A42" stroke-width="1.6" fill="none" stroke-linecap="round" />
            <!-- 頭頂小花花 -->
            <circle cx="58" cy="28" r="3.5" fill="#FFC6FF" />
            <circle cx="58" cy="28" r="1.5" fill="#FDFFB6" />
          </g>
          <!-- 腳腳 -->
          <g class="critter-feet">
            <ellipse cx="38" cy="85" rx="6" ry="4" fill="#FFFFFF" stroke="#F0E6EF" stroke-width="1" />
            <ellipse cx="62" cy="85" rx="6" ry="4" fill="#FFFFFF" stroke="#F0E6EF" stroke-width="1" />
          </g>
        </svg>
      `
    }
  ];

  class Critter {
    constructor(template, initialX) {
      this.template = template;
      this.x = initialX; // 百分比 0 ~ 100
      this.targetX = initialX;
      this.direction = Math.random() > 0.5 ? 1 : -1; // 1: 右, -1: 左
      this.speed = Math.random() * 0.15 + 0.1; // 速度
      this.state = 'walking'; // walking | idle | eating | happy
      this.idleTimer = 0;
      this.bubbleTimer = null;

      // 建立 DOM 元素
      this.el = document.createElement('div');
      this.el.className = 'critter walking';
      this.el.innerHTML = template.svg;
      this.el.style.left = `${this.x}%`;
      this.updateTransform();

      // 點擊互動摸摸
      this.el.addEventListener('click', (e) => {
        e.stopPropagation();
        this.onPet();
      });

      animalsTrack.appendChild(this.el);
      this.pickNewTarget();
    }

    pickNewTarget() {
      // 隨機在 8% ~ 88% 的寬度間漫步
      this.targetX = Math.random() * 80 + 8;
      this.direction = this.targetX > this.x ? 1 : -1;
      this.speed = Math.random() * 0.14 + 0.12;
      this.state = 'walking';
      this.el.className = 'critter walking';
      this.updateTransform();
    }

    updateTransform() {
      this.el.style.transform = `scaleX(${this.direction})`;
    }

    showSpeech(text) {
      const existing = this.el.querySelector('.critter-bubble');
      if (existing) existing.remove();

      const bubble = document.createElement('div');
      bubble.className = 'critter-bubble';
      bubble.textContent = text;
      // 保持對話文字不鏡像反轉
      bubble.style.transform = `scaleX(${this.direction}) translateX(${this.direction * -50}%)`;
      this.el.appendChild(bubble);

      setTimeout(() => {
        if (bubble.parentNode) bubble.remove();
      }, 2000);
    }

    onPet() {
      audio.playPet();
      this.state = 'happy';
      this.el.className = 'critter happy';

      // 隨機講一句話
      const randomQuote = this.template.quotes[Math.floor(Math.random() * this.template.quotes.length)];
      this.showSpeech(randomQuote);

      // 愛心飛出
      const rect = this.el.getBoundingClientRect();
      spawnFloatingHeart(rect.left + rect.width / 2, rect.top);

      setTimeout(() => {
        if (this.state === 'happy') {
          this.pickNewTarget();
        }
      }, 700);
    }

    // 發現食物並前往進食
    attractToFood(foodXPercent, onArriveCallback) {
      this.state = 'walking';
      this.el.className = 'critter walking';
      this.targetX = foodXPercent;
      this.direction = this.targetX > this.x ? 1 : -1;
      this.speed = 0.35; // 奔跑速度加快
      this.updateTransform();
      this.showSpeech('好吃的！😋');

      this.onFoodArrive = onArriveCallback;
    }

    update() {
      if (this.state === 'walking') {
        const dist = this.targetX - this.x;
        if (Math.abs(dist) < 0.8) {
          // 到達目標
          this.x = this.targetX;
          if (this.onFoodArrive) {
            const cb = this.onFoodArrive;
            this.onFoodArrive = null;
            cb(this);
          } else {
            // 進入待機狀態
            this.state = 'idle';
            this.el.className = 'critter idle';
            this.idleTimer = Math.floor(Math.random() * 120 + 80); // 待機幾秒
          }
        } else {
          this.x += Math.sign(dist) * this.speed;
        }
        this.el.style.left = `${this.x}%`;
      } else if (this.state === 'idle') {
        this.idleTimer--;
        if (this.idleTimer <= 0) {
          this.pickNewTarget();
        }
      }
    }
  }

  // 初始化建立小動物群 (小羊、小貓咪、小兔子 共三隻)
  const critters = [];
  const initialPositions = [20, 50, 80];
  CRITTER_TEMPLATES.forEach((tmpl, i) => {
    critters.push(new Critter(tmpl, initialPositions[i]));
  });

  // 召喚萌寵按鈕
  const btnSummon = document.getElementById('btnSummon');
  btnSummon.addEventListener('click', () => {
    audio.playPop();
    const tmpl = CRITTER_TEMPLATES[Math.floor(Math.random() * CRITTER_TEMPLATES.length)];
    const randomX = Math.random() * 70 + 15;
    const newCritter = new Critter(tmpl, randomX);
    critters.push(newCritter);
    newCritter.showSpeech(`我是新來的 ${tmpl.name} 🐾`);
    spawnHeartBurst(window.innerWidth * (randomX / 100), window.innerHeight - 120);

    if (critters.length > 6) {
      // 保持草坡寬敞舒適，過多時移除最老的一隻
      const oldest = critters.shift();
      if (oldest && oldest.el) oldest.el.remove();
    }
  });

  // 小動物主物理循環
  function crittersLoop() {
    critters.forEach((c) => c.update());
    requestAnimationFrame(crittersLoop);
  }
  requestAnimationFrame(crittersLoop);

  // ========================================================================
  // 6. 丟出美味點心餵食系統 (Treats & Feeding System)
  // ========================================================================
  const btnFeed = document.getElementById('btnFeed');
  const TREAT_ICONS = ['🍪', '🍓', '🍰', '🐟', '🥕', '🍙', '🍡', '🥞'];

  function dropTreat(targetXPercent) {
    audio.playPop();
    const icon = TREAT_ICONS[Math.floor(Math.random() * TREAT_ICONS.length)];
    const treatEl = document.createElement('div');
    treatEl.className = 'treat-item';
    treatEl.textContent = icon;
    treatEl.style.left = `${targetXPercent}%`;
    treatEl.style.bottom = '85px';
    treatsLayer.appendChild(treatEl);

    // 尋找離食物最近的小動物前往進食
    let closest = null;
    let minDist = 999;
    critters.forEach((c) => {
      const d = Math.abs(c.x - targetXPercent);
      if (d < minDist) {
        minDist = d;
        closest = c;
      }
    });

    if (closest) {
      closest.attractToFood(targetXPercent, (c) => {
        // 到達食物處
        audio.playMunch();
        treatEl.remove();
        c.state = 'eating';
        c.el.className = 'critter eating';
        c.showSpeech('太好吃了！💖');
        spawnFloatingHeart(c.el.getBoundingClientRect().left + 34, c.el.getBoundingClientRect().top);

        setTimeout(() => {
          c.pickNewTarget();
        }, 1800);
      });
    } else {
      setTimeout(() => treatEl.remove(), 4000);
    }
  }

  btnFeed.addEventListener('click', () => {
    const randomX = Math.random() * 70 + 15;
    dropTreat(randomX);
  });

  // 點擊草坡任意處也可以丟食物！
  playground.addEventListener('click', (e) => {
    // 避免點到小動物本身
    if (e.target.closest('.critter') || e.target.closest('.dock-btn')) return;
    const rect = playground.getBoundingClientRect();
    const clickXPercent = ((e.clientX - rect.left) / rect.width) * 100;
    dropTreat(Math.max(8, Math.min(92, clickXPercent)));
  });

  // ========================================================================
  // 7. 撒花、愛心與粒子系統 (Canvas Sakura & Hearts Particle Rain)
  // ========================================================================
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const particles = [];
  const PARTICLE_EMOJIS = ['🌸', '💖', '✨', '🌼', '💕', '⭐', '🌷'];

  class Particle {
    constructor(x, y, isBurst = false) {
      this.x = x ?? Math.random() * canvas.width;
      this.y = y ?? (isBurst ? canvas.height / 2 : -20);
      this.emoji = PARTICLE_EMOJIS[Math.floor(Math.random() * PARTICLE_EMOJIS.length)];
      this.size = Math.random() * 16 + 14;

      if (isBurst) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 7 + 2;
        this.vx = Math.cos(angle) * spd;
        this.vy = Math.sin(angle) * spd - 2;
      } else {
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = Math.random() * 1.8 + 1.2;
      }

      this.rotation = Math.random() * 360;
      this.vRot = (Math.random() - 0.5) * 4;
      this.opacity = 1;
      this.isBurst = isBurst;
      this.life = isBurst ? 70 : 350;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.rotation += this.vRot;

      if (this.isBurst) {
        this.vy += 0.12; // 重力
        this.opacity -= 0.015;
      }

      this.life--;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate((this.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, this.opacity);
      ctx.font = `${this.size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(this.emoji, 0, 0);
      ctx.restore();
    }
  }

  function particleLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw();
      if (p.life <= 0 || p.y > canvas.height + 40 || p.opacity <= 0) {
        particles.splice(i, 1);
      }
    }
    requestAnimationFrame(particleLoop);
  }
  requestAnimationFrame(particleLoop);

  function spawnPetalRain(count = 45) {
    audio.playChime();
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        particles.push(new Particle(Math.random() * canvas.width, -30, false));
      }, i * 35);
    }
  }

  function spawnHeartBurst(x, y, count = 20) {
    for (let i = 0; i < count; i++) {
      particles.push(new Particle(x, y, true));
    }
  }

  function spawnFloatingHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.textContent = Math.random() > 0.4 ? '💖' : '🌸';
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1300);
  }

  const btnPetals = document.getElementById('btnPetals');
  btnPetals.addEventListener('click', () => {
    spawnPetalRain(48);
  });

  // ========================================================================
  // 8. 主題日夜氛圍切換 (Theme Switcher)
  // ========================================================================
  const btnTheme = document.getElementById('btnTheme');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');

  const THEMES = [
    { key: 'theme-day', icon: '☀️', label: '日光白晝' },
    { key: 'theme-sunset', icon: '🌅', label: '夢幻晚霞' },
    { key: 'theme-night', icon: '🌙', label: '星空黑夜' }
  ];

  let currentThemeIdx = 0;

  function setTheme(idx) {
    currentThemeIdx = idx % THEMES.length;
    const theme = THEMES[currentThemeIdx];

    document.body.className = theme.key;
    themeIcon.textContent = theme.icon;
    themeLabel.textContent = theme.label;
    localStorage.setItem('kawaii_theme_010', theme.key);
  }

  btnTheme.addEventListener('click', () => {
    audio.playPop();
    setTheme(currentThemeIdx + 1);
  });

  const savedTheme = localStorage.getItem('kawaii_theme_010');
  if (savedTheme) {
    const foundIdx = THEMES.findIndex((t) => t.key === savedTheme);
    if (foundIdx !== -1) setTheme(foundIdx);
  }

  // ========================================================================
  // 9. 音效開關 (Sound Toggle)
  // ========================================================================
  const btnSound = document.getElementById('btnSound');
  const soundIcon = document.getElementById('soundIcon');
  const soundLabel = document.getElementById('soundLabel');

  btnSound.addEventListener('click', () => {
    audio.enabled = !audio.enabled;
    if (audio.enabled) {
      audio.init();
      audio.playPop();
      soundIcon.textContent = '🔔';
      soundLabel.textContent = '音效開';
    } else {
      soundIcon.textContent = '🔕';
      soundLabel.textContent = '靜音中';
    }
  });

  // ========================================================================
  // 10. 日曆手帳記事本模組 (Kawaii Notepad & Diary Module)
  // ========================================================================
  const dateDisplayBtn = document.getElementById('dateDisplayBtn');
  const notepadModal = document.getElementById('notepadModal');
  const closeNotepadBtn = document.getElementById('closeNotepadBtn');
  const notepadDateTitle = document.getElementById('notepadDateTitle');
  const notepadTextarea = document.getElementById('notepadTextarea');
  const moodChips = document.getElementById('moodChips');
  const tabDiaryBtn = document.getElementById('tabDiaryBtn');
  const tabTodoBtn = document.getElementById('tabTodoBtn');
  const diaryTabContent = document.getElementById('diaryTabContent');
  const todoTabContent = document.getElementById('todoTabContent');
  const newTodoInput = document.getElementById('newTodoInput');
  const addTodoBtn = document.getElementById('addTodoBtn');
  const todoList = document.getElementById('todoList');
  const todoCount = document.getElementById('todoCount');
  const saveStatus = document.getElementById('saveStatus');
  const clearNoteBtn = document.getElementById('clearNoteBtn');
  const saveNoteBtn = document.getElementById('saveNoteBtn');

  const STORAGE_KEY_NOTE = 'kawaii_notepad_text_010';
  const STORAGE_KEY_MOOD = 'kawaii_notepad_mood_010';
  const STORAGE_KEY_TODOS = 'kawaii_notepad_todos_010';

  // 讀取既有筆記與心情
  const savedNoteText = localStorage.getItem(STORAGE_KEY_NOTE);
  if (savedNoteText !== null) {
    notepadTextarea.value = savedNoteText;
  }

  const savedMood = localStorage.getItem(STORAGE_KEY_MOOD);
  if (savedMood && moodChips) {
    moodChips.querySelectorAll('.mood-chip').forEach((chip) => {
      chip.classList.toggle('active', chip.dataset.mood === savedMood);
    });
  }

  // 主頁待辦 DOM 元件
  const homeTodoList = document.getElementById('homeTodoList');
  const homeTodoBadge = document.getElementById('homeTodoBadge');
  const homeTodoEmpty = document.getElementById('homeTodoEmpty');
  const homeTodoInput = document.getElementById('homeTodoInput');
  const homeTodoSubmitBtn = document.getElementById('homeTodoSubmitBtn');
  const homeTodoAddToggleBtn = document.getElementById('homeTodoAddToggleBtn');
  const homeOpenNotebookBtn = document.getElementById('homeOpenNotebookBtn');
  const homeTodoTitleClick = document.getElementById('homeTodoTitleClick');

  // 待辦清單資料
  let todos = [];
  try {
    const rawTodos = localStorage.getItem(STORAGE_KEY_TODOS);
    if (rawTodos) {
      todos = JSON.parse(rawTodos);
    }
  } catch (e) {
    todos = [];
  }

  function renderTodos() {
    const totalCount = todos.length;
    const doneCount = todos.filter((t) => t.done).length;

    // 1. 渲染手帳彈窗中的代辦列表
    if (todoCount) todoCount.textContent = totalCount;
    if (todoList) {
      todoList.innerHTML = '';
      if (totalCount === 0) {
        const emptyLi = document.createElement('li');
        emptyLi.className = 'todo-empty-hint';
        emptyLi.textContent = '🌸 目前還沒有待辦小事～在上方輸入並新增吧！';
        todoList.appendChild(emptyLi);
      } else {
        todos.forEach((item, index) => {
          const li = document.createElement('li');
          li.className = `todo-item ${item.done ? 'done' : ''}`;

          const contentWrap = document.createElement('div');
          contentWrap.className = 'todo-content-wrap';

          const checkbox = document.createElement('div');
          checkbox.className = 'todo-checkbox';
          checkbox.textContent = item.done ? '✔' : '';

          const textSpan = document.createElement('span');
          textSpan.className = 'todo-text';
          textSpan.textContent = item.text;

          contentWrap.appendChild(checkbox);
          contentWrap.appendChild(textSpan);

          contentWrap.addEventListener('click', () => {
            item.done = !item.done;
            audio.playPop();
            saveTodos();
            renderTodos();
          });

          const delBtn = document.createElement('button');
          delBtn.className = 'todo-delete-btn';
          delBtn.innerHTML = '✕';
          delBtn.title = '刪除此項';
          delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            audio.playPop();
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
          });

          li.appendChild(contentWrap);
          li.appendChild(delBtn);
          todoList.appendChild(li);
        });
      }
    }

    // 2. 即時渲染主頁卡片上的「今日待辦」
    if (homeTodoBadge) {
      homeTodoBadge.textContent = totalCount === 0 ? '0 件小事' : `${doneCount}/${totalCount} 完成`;
    }

    if (homeTodoList && homeTodoEmpty) {
      homeTodoList.innerHTML = '';
      if (totalCount === 0) {
        homeTodoEmpty.style.display = 'flex';
        homeTodoList.style.display = 'none';
      } else {
        homeTodoEmpty.style.display = 'none';
        homeTodoList.style.display = 'flex';

        todos.forEach((item, index) => {
          const li = document.createElement('li');
          li.className = `home-todo-item ${item.done ? 'done' : ''}`;

          const contentWrap = document.createElement('div');
          contentWrap.className = 'home-todo-content';

          const checkbox = document.createElement('div');
          checkbox.className = 'home-todo-checkbox';
          checkbox.textContent = item.done ? '✔' : '';

          const textSpan = document.createElement('span');
          textSpan.className = 'home-todo-text';
          textSpan.textContent = item.text;
          textSpan.title = item.text;

          contentWrap.appendChild(checkbox);
          contentWrap.appendChild(textSpan);

          // 點擊項目切換完成狀態
          contentWrap.addEventListener('click', () => {
            item.done = !item.done;
            audio.playPop();
            if (item.done) {
              const rect = li.getBoundingClientRect();
              spawnFloatingHeart(rect.left + 24, rect.top);
            }
            saveTodos();
            renderTodos();
          });

          // 點擊刪除按鈕
          const delBtn = document.createElement('button');
          delBtn.className = 'home-todo-del-btn';
          delBtn.innerHTML = '✕';
          delBtn.title = '刪除代辦';
          delBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            audio.playPop();
            todos.splice(index, 1);
            saveTodos();
            renderTodos();
          });

          li.appendChild(contentWrap);
          li.appendChild(delBtn);
          homeTodoList.appendChild(li);
        });
      }
    }
  }

  function saveTodos() {
    localStorage.setItem(STORAGE_KEY_TODOS, JSON.stringify(todos));
  }

  // 手帳彈窗中的新增代辦
  function addNewTodo() {
    const text = newTodoInput.value.trim();
    if (!text) return;
    todos.push({ text, done: false });
    newTodoInput.value = '';
    audio.playPop();
    saveTodos();
    renderTodos();
  }

  if (addTodoBtn && newTodoInput) {
    addTodoBtn.addEventListener('click', addNewTodo);
    newTodoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addNewTodo();
    });
  }

  // 主頁卡片上的快速新增代辦
  function addHomeTodo() {
    if (!homeTodoInput) return;
    const text = homeTodoInput.value.trim();
    if (!text) return;
    todos.push({ text, done: false });
    homeTodoInput.value = '';
    audio.playPop();
    spawnFloatingHeart(window.innerWidth / 2, window.innerHeight * 0.38);
    saveTodos();
    renderTodos();
  }

  if (homeTodoSubmitBtn && homeTodoInput) {
    homeTodoSubmitBtn.addEventListener('click', addHomeTodo);
    homeTodoInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') addHomeTodo();
    });
  }

  if (homeTodoAddToggleBtn && homeTodoInput) {
    homeTodoAddToggleBtn.addEventListener('click', () => {
      audio.playPop();
      homeTodoInput.focus();
    });
  }

  // 開啟手帳本並自動切換至「今日待辦」Tab
  function openNotepadToTodo() {
    openNotepad();
    if (tabTodoBtn && tabDiaryBtn && diaryTabContent && todoTabContent) {
      tabTodoBtn.classList.add('active');
      tabDiaryBtn.classList.remove('active');
      todoTabContent.classList.add('active');
      diaryTabContent.classList.remove('active');
    }
  }

  if (homeOpenNotebookBtn) {
    homeOpenNotebookBtn.addEventListener('click', openNotepadToTodo);
  }
  if (homeTodoTitleClick) {
    homeTodoTitleClick.addEventListener('click', openNotepadToTodo);
  }

  // 初始載入時立即渲染主頁待辦
  renderTodos();

  // 分頁切換
  if (tabDiaryBtn && tabTodoBtn) {
    tabDiaryBtn.addEventListener('click', () => {
      audio.playPop();
      tabDiaryBtn.classList.add('active');
      tabTodoBtn.classList.remove('active');
      diaryTabContent.classList.add('active');
      todoTabContent.classList.remove('active');
    });

    tabTodoBtn.addEventListener('click', () => {
      audio.playPop();
      tabTodoBtn.classList.add('active');
      tabDiaryBtn.classList.remove('active');
      todoTabContent.classList.add('active');
      diaryTabContent.classList.remove('active');
    });
  }

  // 心情標籤點擊
  if (moodChips) {
    moodChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.mood-chip');
      if (!chip) return;
      audio.playPop();
      moodChips.querySelectorAll('.mood-chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      localStorage.setItem(STORAGE_KEY_MOOD, chip.dataset.mood);
    });
  }

  // 自動保存與手動保存
  let autoSaveTimeout = null;
  if (notepadTextarea) {
    notepadTextarea.addEventListener('input', () => {
      if (saveStatus) saveStatus.textContent = '✏️ 正在記錄...';
      clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY_NOTE, notepadTextarea.value);
        if (saveStatus) saveStatus.textContent = '💾 已自動保存';
      }, 600);
    });
  }

  function openNotepad() {
    audio.playChime();
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const dayName = daysChinese[now.getDay()];
    if (notepadDateTitle) {
      notepadDateTitle.textContent = `${year} 年 ${month} 月 ${date} 日 (${dayName}) 元氣手帳`;
    }

    renderTodos();
    if (notepadModal) notepadModal.classList.add('active');
  }

  function closeNotepad() {
    if (notepadModal) notepadModal.classList.remove('active');
  }

  if (dateDisplayBtn) {
    dateDisplayBtn.addEventListener('click', openNotepad);
    dateDisplayBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openNotepad();
      }
    });
  }

  if (closeNotepadBtn) {
    closeNotepadBtn.addEventListener('click', closeNotepad);
  }

  if (notepadModal) {
    notepadModal.addEventListener('click', (e) => {
      if (e.target === notepadModal) closeNotepad();
    });
  }

  // 按 Escape 關閉
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNotepad();
    }
  });

  // 清空手帳
  if (clearNoteBtn) {
    clearNoteBtn.addEventListener('click', () => {
      if (confirm('確定要清空手帳中的內容嗎？(。•́︿•̀。)')) {
        audio.playPop();
        notepadTextarea.value = '';
        todos = [];
        saveTodos();
        localStorage.removeItem(STORAGE_KEY_NOTE);
        renderTodos();
        if (saveStatus) saveStatus.textContent = '✨ 已清空';
      }
    });
  }

  // 完成儲存
  if (saveNoteBtn) {
    saveNoteBtn.addEventListener('click', () => {
      audio.playChime();
      localStorage.setItem(STORAGE_KEY_NOTE, notepadTextarea.value);
      saveTodos();
      if (saveStatus) saveStatus.textContent = '💖 保存成功！';
      spawnHeartBurst(window.innerWidth / 2, window.innerHeight / 2);
      setTimeout(() => {
        closeNotepad();
      }, 450);
    });
  }
});
