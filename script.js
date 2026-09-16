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
  // 3. 專屬名牌 (User Name Badge - 固定顯示：江晏瑋)
  // ========================================================================
  const userNameText = document.getElementById('userNameText');
  if (userNameText) {
    userNameText.textContent = '江晏瑋';
  }
  // 自動清理先前瀏覽器可能留下的舊名稱快取
  try {
    localStorage.removeItem('kawaii_user_name_010');
  } catch (e) {}

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

  // ========================================================================
  // 11. 萌寵接甜點大冒險小遊戲模組 (Kawaii Treat Catcher Mini Game)
  // ========================================================================
  const btnGame = document.getElementById('btnGame');
  const miniGameCard = document.getElementById('miniGameCard');

  if (btnGame && miniGameCard) {
    btnGame.addEventListener('click', () => {
      audio.playPop();
      miniGameCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  const gameCanvas = document.getElementById('gameCanvas');
  const gameStartOverlay = document.getElementById('gameStartOverlay');
  const gameOverOverlay = document.getElementById('gameOverOverlay');
  const btnStartGame = document.getElementById('btnStartGame');
  const btnRestartGame = document.getElementById('btnRestartGame');

  const gameScoreVal = document.getElementById('gameScoreVal');
  const gameBestVal = document.getElementById('gameBestVal');
  const gameComboVal = document.getElementById('gameComboVal');
  const gameLivesVal = document.getElementById('gameLivesVal');

  const gameOverScore = document.getElementById('gameOverScore');
  const gameOverMedal = document.getElementById('gameOverMedal');
  const gameOverEmoji = document.getElementById('gameOverEmoji');
  const gameOverTitle = document.getElementById('gameOverTitle');
  const gameCharChips = document.getElementById('gameCharChips');

  const btnTouchLeft = document.getElementById('btnTouchLeft');
  const btnTouchRight = document.getElementById('btnTouchRight');

  if (gameCanvas) {
    const gCtx = gameCanvas.getContext('2d');
    const STORAGE_KEY_BEST = 'kawaii_game_best_010';

    let bestScore = parseInt(localStorage.getItem(STORAGE_KEY_BEST) || '0', 10);
    if (gameBestVal) gameBestVal.textContent = bestScore;

    let isPlaying = false;
    let score = 0;
    let combo = 0;
    let lives = 3;
    let selectedChar = 'sheep';

    // 角色設定
    const CHARACTERS = {
      sheep: { name: '小羊', emoji: '🐑', bonusItem: '🌱', bonusName: '嫩草' },
      cat: { name: '小貓咪', emoji: '🐱', bonusItem: '🐟', bonusName: '小魚乾' },
      bunny: { name: '小兔子', emoji: '🐰', bonusItem: '🥕', bonusName: '胡蘿蔔' }
    };

    // 角色切換監聽
    if (gameCharChips) {
      gameCharChips.addEventListener('click', (e) => {
        const chip = e.target.closest('.char-chip');
        if (!chip) return;
        audio.playPop();
        gameCharChips.querySelectorAll('.char-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedChar = chip.dataset.char || 'sheep';
      });
    }

    // 玩家位置
    let playerX = gameCanvas.width / 2;
    const playerY = gameCanvas.height - 40;
    const playerRadius = 26;
    let playerTargetX = playerX;

    // 按鍵狀態
    const keys = { left: false, right: false };

    window.addEventListener('keydown', (e) => {
      if (!isPlaying) return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
    });

    // 觸控按鈕
    if (btnTouchLeft && btnTouchRight) {
      const setLeft = (val) => { if (isPlaying) keys.left = val; };
      const setRight = (val) => { if (isPlaying) keys.right = val; };

      btnTouchLeft.addEventListener('mousedown', () => setLeft(true));
      btnTouchLeft.addEventListener('mouseup', () => setLeft(false));
      btnTouchLeft.addEventListener('touchstart', (e) => { e.preventDefault(); setLeft(true); }, { passive: false });
      btnTouchLeft.addEventListener('touchend', () => setLeft(false));

      btnTouchRight.addEventListener('mousedown', () => setRight(true));
      btnTouchRight.addEventListener('mouseup', () => setRight(false));
      btnTouchRight.addEventListener('touchstart', (e) => { e.preventDefault(); setRight(true); }, { passive: false });
      btnTouchRight.addEventListener('touchend', () => setRight(false));
    }

    // 滑鼠與觸控直接拖曳
    function handlePointerMove(clientX) {
      if (!isPlaying) return;
      const rect = gameCanvas.getBoundingClientRect();
      const scaleX = gameCanvas.width / rect.width;
      const canvasX = (clientX - rect.left) * scaleX;
      playerTargetX = Math.max(playerRadius, Math.min(gameCanvas.width - playerRadius, canvasX));
    }

    gameCanvas.addEventListener('mousemove', (e) => {
      handlePointerMove(e.clientX);
    });

    gameCanvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX);
      }
    }, { passive: true });

    // 掉落物品列表
    let items = [];
    let floatingTexts = [];
    let gameParticles = [];
    let spawnCounter = 0;
    let animFrameId = null;

    // 物品種類定義
    const ITEM_TYPES = [
      { emoji: '🍓', points: 10, type: 'food' },
      { emoji: '🍪', points: 15, type: 'food' },
      { emoji: '🍰', points: 25, type: 'food' },
      { emoji: '⭐', points: 50, type: 'star' },
      { emoji: '🌱', points: 15, type: 'sheep_fav' },
      { emoji: '🐟', points: 15, type: 'cat_fav' },
      { emoji: '🥕', points: 15, type: 'bunny_fav' },
      { emoji: '⛈️', points: 0, type: 'hazard' }
    ];

    function spawnItem() {
      const rand = Math.random();
      let chosen;
      if (rand < 0.18) {
        // 專屬最愛食物加權
        const fav = CHARACTERS[selectedChar].bonusItem;
        chosen = ITEM_TYPES.find(i => i.emoji === fav) || ITEM_TYPES[0];
      } else if (rand < 0.35) {
        chosen = ITEM_TYPES[7]; // 烏雲
      } else if (rand < 0.45) {
        chosen = ITEM_TYPES[3]; // ⭐
      } else {
        const foodIdx = Math.floor(Math.random() * 3);
        chosen = ITEM_TYPES[foodIdx];
      }

      items.push({
        x: Math.random() * (gameCanvas.width - 60) + 30,
        y: -25,
        speed: Math.random() * 1.5 + 2.0 + Math.min(score / 250, 3.5),
        emoji: chosen.emoji,
        type: chosen.type,
        points: chosen.points,
        size: 28,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.05
      });
    }

    function addFloatingText(x, y, text, color = '#ff70a6') {
      floatingTexts.push({ x, y, text, color, alpha: 1, vy: -1.5 });
    }

    function addGameParticles(x, y, count = 8, emoji = '✨') {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spd = Math.random() * 3 + 1;
        gameParticles.push({
          x,
          y,
          vx: Math.cos(angle) * spd,
          vy: Math.sin(angle) * spd - 1,
          alpha: 1,
          size: Math.random() * 8 + 8,
          emoji
        });
      }
    }

    function updateHUD() {
      if (gameScoreVal) gameScoreVal.textContent = score;
      if (gameComboVal) gameComboVal.textContent = `x${combo}`;
      if (gameLivesVal) {
        gameLivesVal.textContent = '❤️'.repeat(Math.max(0, lives)) + '🖤'.repeat(Math.max(0, 3 - lives));
      }
    }

    function startGame() {
      audio.playChime();
      isPlaying = true;
      score = 0;
      combo = 0;
      lives = 3;
      items = [];
      floatingTexts = [];
      gameParticles = [];
      spawnCounter = 0;
      playerX = gameCanvas.width / 2;
      playerTargetX = playerX;
      keys.left = false;
      keys.right = false;

      updateHUD();
      if (gameStartOverlay) gameStartOverlay.classList.add('hidden');
      if (gameOverOverlay) gameOverOverlay.classList.add('hidden');

      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = requestAnimationFrame(gameLoop);
    }

    function endGame() {
      isPlaying = false;
      audio.playPet();

      // 更新最高紀錄
      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem(STORAGE_KEY_BEST, String(bestScore));
        if (gameBestVal) gameBestVal.textContent = bestScore;
        spawnPetalRain(35);
      }

      // 計算稱號與獎牌
      let medal = '🥉 甜點實習生';
      let emoji = '🍰';
      if (score >= 400) {
        medal = '👑 傳奇甜點守護神！';
        emoji = '🏆';
      } else if (score >= 250) {
        medal = '🥇 甜點吃貨大師';
        emoji = '🎉';
      } else if (score >= 120) {
        medal = '🥈 貪吃小行家';
        emoji = '⭐';
      }

      if (gameOverScore) gameOverScore.textContent = score;
      if (gameOverMedal) gameOverMedal.textContent = medal;
      if (gameOverEmoji) gameOverEmoji.textContent = emoji;
      if (gameOverTitle) gameOverTitle.textContent = lives <= 0 ? '愛心耗盡～挑戰結束！' : '遊戲結束！';

      if (gameOverOverlay) gameOverOverlay.classList.remove('hidden');
    }

    function gameLoop() {
      if (!isPlaying) return;

      // 1. 更新玩家位置
      if (keys.left) playerTargetX -= 6.5;
      if (keys.right) playerTargetX += 6.5;
      playerTargetX = Math.max(playerRadius, Math.min(gameCanvas.width - playerRadius, playerTargetX));
      playerX += (playerTargetX - playerX) * 0.35;

      // 2. 生成物品
      spawnCounter++;
      const spawnInterval = Math.max(26, 45 - Math.floor(score / 80));
      if (spawnCounter % spawnInterval === 0) {
        spawnItem();
      }

      // 3. 繪製背景
      gCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

      // 地面草坪花紋
      gCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      gCtx.fillRect(0, gameCanvas.height - 20, gameCanvas.width, 20);

      // 4. 更新與繪製掉落物
      for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.y += item.speed;
        item.rotation += item.rotSpeed;

        // 繪製掉落物品 Emoji
        gCtx.save();
        gCtx.translate(item.x, item.y);
        gCtx.rotate(item.rotation);
        gCtx.font = `${item.size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'middle';
        gCtx.fillText(item.emoji, 0, 0);
        gCtx.restore();

        // 碰撞偵測 (與玩家小動物)
        const dx = item.x - playerX;
        const dy = item.y - (playerY - 4);
        const dist = Math.hypot(dx, dy);

        if (dist < playerRadius + 16) {
          // 接到了！
          if (item.type === 'hazard') {
            // 吃到烏雲！
            audio.playPop();
            lives--;
            combo = 0;
            addFloatingText(item.x, item.y - 10, '💔 烏雲雷擊!', '#e63946');
            addGameParticles(item.x, item.y, 8, '⚡');

            if (lives <= 0) {
              updateHUD();
              endGame();
              return;
            }
          } else {
            // 吃到美味點心！
            audio.playMunch();
            combo++;
            let pts = item.points;

            // 如果是出戰角色的最愛點心，額外 +15 分
            const favEmoji = CHARACTERS[selectedChar].bonusItem;
            if (item.emoji === favEmoji) {
              pts += 15;
              addFloatingText(item.x, item.y - 15, `★ 最愛 +${pts}!`, '#ff477e');
              addGameParticles(item.x, item.y, 10, '💖');
            } else if (item.type === 'star') {
              pts += 20;
              addFloatingText(item.x, item.y - 15, `🌟 幸運 +${pts}!`, '#ffb703');
              addGameParticles(item.x, item.y, 12, '⭐');
            } else {
              addFloatingText(item.x, item.y - 10, `+${pts}`, '#ff70a6');
              addGameParticles(item.x, item.y, 6, '✨');
            }

            score += pts;
          }

          items.splice(i, 1);
          updateHUD();
          continue;
        }

        // 掉落地面
        if (item.y > gameCanvas.height + 20) {
          if (item.type !== 'hazard' && combo > 0) {
            combo = 0; // 漏接食物連擊歸零
            updateHUD();
          }
          items.splice(i, 1);
        }
      }

      // 5. 繪製玩家小動物
      gCtx.save();
      gCtx.translate(playerX, playerY);

      // 影子
      gCtx.fillStyle = 'rgba(0, 0, 0, 0.12)';
      gCtx.beginPath();
      gCtx.ellipse(0, 16, 22, 7, 0, 0, Math.PI * 2);
      gCtx.fill();

      // 小動物頭像/精靈
      const charData = CHARACTERS[selectedChar] || CHARACTERS.sheep;
      gCtx.font = '38px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
      gCtx.textAlign = 'center';
      gCtx.textBaseline = 'middle';
      gCtx.fillText(charData.emoji, 0, 0);

      // 頂部小碗/接籃裝飾
      gCtx.font = '16px sans-serif';
      gCtx.fillText('🎀', 0, -22);

      gCtx.restore();

      // 6. 繪製浮動粒子
      for (let i = gameParticles.length - 1; i >= 0; i--) {
        const p = gameParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) {
          gameParticles.splice(i, 1);
          continue;
        }
        gCtx.save();
        gCtx.globalAlpha = p.alpha;
        gCtx.font = `${p.size}px sans-serif`;
        gCtx.textAlign = 'center';
        gCtx.textBaseline = 'middle';
        gCtx.fillText(p.emoji, p.x, p.y);
        gCtx.restore();
      }

      // 7. 繪製浮動加分文字
      for (let i = floatingTexts.length - 1; i >= 0; i--) {
        const ft = floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.025;
        if (ft.alpha <= 0) {
          floatingTexts.splice(i, 1);
          continue;
        }
        gCtx.save();
        gCtx.globalAlpha = ft.alpha;
        gCtx.font = 'bold 15px "Zen Maru Gothic", sans-serif';
        gCtx.fillStyle = ft.color;
        gCtx.textAlign = 'center';
        gCtx.fillText(ft.text, ft.x, ft.y);
        gCtx.restore();
      }

      animFrameId = requestAnimationFrame(gameLoop);
    }

    if (btnStartGame) btnStartGame.addEventListener('click', startGame);
    if (btnRestartGame) btnRestartGame.addEventListener('click', startGame);
  }

  // =====================================================================
  // 🥁 太鼓音遊 (Taiko Rhythm Game)
  // =====================================================================
  {
    const rCanvas = document.getElementById('rhythmCanvas');
    const rCtx = rCanvas ? rCanvas.getContext('2d') : null;
    if (!rCtx) return; // Canvas 不存在則跳過

    // --- 音遊常數 ---
    const JUDGE_X = 110;          // 判定線 X 座標
    const NOTE_SPEED_BASE = 280;  // 基礎移動速度 (px/s)
    const PERFECT_WINDOW = 55;    // ±55ms PERFECT 判定窗
    const GOOD_WINDOW = 120;      // ±120ms GOOD 判定窗
    const MISS_WINDOW = 220;      // 超過此距離算 MISS
    const STORAGE_KEY_RHYTHM = 'kawaii_rhythm_best';

    // --- 三首曲目節拍譜 ---
    // 每個元素：{ type: 'red'|'blue', beat: 拍號(從0開始) }
    // BPM 定義在難度物件中
    const SONGS = {
      sakura: {
        name: '🌸 春日搖籃',
        bpm: 88,
        pattern: [
          {t:'red',b:0},{t:'red',b:1},{t:'blue',b:2},{t:'red',b:3},
          {t:'red',b:4},{t:'blue',b:5},{t:'blue',b:6},{t:'red',b:7},
          {t:'red',b:8},{t:'red',b:8.5},{t:'blue',b:9},{t:'red',b:10},
          {t:'blue',b:11},{t:'red',b:12},{t:'blue',b:13},{t:'red',b:14},
          {t:'red',b:15},{t:'blue',b:15.5},{t:'red',b:16},{t:'blue',b:17},
          {t:'red',b:18},{t:'red',b:19},{t:'blue',b:20},{t:'red',b:21},
          {t:'blue',b:22},{t:'blue',b:23},{t:'red',b:24},{t:'red',b:25},
          {t:'red',b:26},{t:'blue',b:27},{t:'red',b:28},{t:'blue',b:29},
          {t:'red',b:30},{t:'red',b:31},
        ]
      },
      star: {
        name: '⭐ 星光閃閃',
        bpm: 110,
        pattern: [
          {t:'red',b:0},{t:'blue',b:0.5},{t:'red',b:1},{t:'blue',b:1.5},
          {t:'red',b:2},{t:'red',b:2.5},{t:'blue',b:3},{t:'blue',b:3.5},
          {t:'red',b:4},{t:'blue',b:5},{t:'red',b:6},{t:'red',b:6.5},
          {t:'blue',b:7},{t:'red',b:8},{t:'blue',b:8.5},{t:'red',b:9},
          {t:'red',b:10},{t:'blue',b:10.5},{t:'blue',b:11},{t:'red',b:12},
          {t:'blue',b:13},{t:'red',b:13.5},{t:'blue',b:14},{t:'red',b:15},
          {t:'red',b:16},{t:'blue',b:16},{t:'red',b:17},{t:'blue',b:17.5},
          {t:'red',b:18},{t:'red',b:18.5},{t:'blue',b:19},{t:'red',b:20},
          {t:'blue',b:21},{t:'red',b:21.5},{t:'red',b:22},{t:'blue',b:23},
          {t:'red',b:24},{t:'blue',b:24.5},
        ]
      },
      candy: {
        name: '🍬 糖果進行曲',
        bpm: 132,
        pattern: [
          {t:'red',b:0},{t:'red',b:0.5},{t:'blue',b:1},{t:'red',b:1.5},
          {t:'blue',b:2},{t:'blue',b:2.5},{t:'red',b:3},{t:'blue',b:3.5},
          {t:'red',b:4},{t:'red',b:4.5},{t:'red',b:5},{t:'blue',b:5.5},
          {t:'red',b:6},{t:'blue',b:6.5},{t:'blue',b:7},{t:'red',b:7.5},
          {t:'red',b:8},{t:'blue',b:8},{t:'red',b:8.5},{t:'blue',b:9},
          {t:'red',b:9.5},{t:'red',b:10},{t:'blue',b:10.5},{t:'red',b:11},
          {t:'blue',b:12},{t:'red',b:12.5},{t:'blue',b:13},{t:'blue',b:13.5},
          {t:'red',b:14},{t:'red',b:14.5},{t:'blue',b:15},{t:'red',b:15.5},
          {t:'red',b:16},{t:'blue',b:16.5},{t:'red',b:17},{t:'red',b:17.5},
          {t:'blue',b:18},{t:'red',b:18.5},{t:'blue',b:19},{t:'red',b:20},
        ]
      }
    };

    // 難度倍率
    const DIFFICULTIES = {
      easy:   { label: '簡單', speedMult: 0.75, noteFilter: (i) => i % 2 === 0 },
      normal: { label: '普通', speedMult: 1.0,  noteFilter: () => true },
      hard:   { label: '困難', speedMult: 1.35, noteFilter: () => true }
    };

    // --- 遊戲狀態 ---
    let rRunning = false, rOver = false;
    let rScore = 0, rBest = parseInt(localStorage.getItem(STORAGE_KEY_RHYTHM)) || 0;
    let rCombo = 0, rMaxCombo = 0;
    let rPerfect = 0, rGood = 0, rMiss = 0;
    let rNotes = [];          // 畫面上的音符
    let rBeatmap = [];        // 當前曲目完整節拍
    let rNoteIdx = 0;         // 下一個要發射的音符 index
    let rStartTime = 0;
    let rLastTs = 0;
    let rRafId = null;
    let rCurrentSong = 'sakura';
    let rCurrentDiff = 'easy';
    let rNoteSpeed = NOTE_SPEED_BASE;
    let rBpm = 88;
    let rParticles = [];
    let rFlash = null;        // { color, alpha } 判定閃光

    // --- DOM 元素 ---
    const rhythmScoreEl  = document.getElementById('rhythmScoreVal');
    const rhythmBestEl   = document.getElementById('rhythmBestVal');
    const rhythmComboEl  = document.getElementById('rhythmComboVal');
    const rhythmAccEl    = document.getElementById('rhythmAccVal');
    const rhythmStartOv  = document.getElementById('rhythmStartOverlay');
    const rhythmOverOv   = document.getElementById('rhythmOverOverlay');
    const btnStartR      = document.getElementById('btnStartRhythm');
    const btnRestartR    = document.getElementById('btnRestartRhythm');
    const rhythmOverScore= document.getElementById('rhythmOverScore');
    const rhythmOverMedal= document.getElementById('rhythmOverMedal');
    const rhythmOverTitle= document.getElementById('rhythmOverTitle');
    const rhythmOverEmoji= document.getElementById('rhythmOverEmoji');
    const rhythmJudge    = document.getElementById('rhythmJudgeDisplay');
    const keyDEl         = document.getElementById('rhythmKeyD');
    const keyFEl         = document.getElementById('rhythmKeyF');
    const btnTouchD      = document.getElementById('btnRhythmD');
    const btnTouchF      = document.getElementById('btnRhythmF');
    const btnRhythm      = document.getElementById('btnRhythm');

    // 更新最高分顯示
    if (rhythmBestEl) rhythmBestEl.textContent = rBest;

    // --- 曲目 / 難度選擇 ---
    document.querySelectorAll('.rhythm-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        if (rRunning) return;
        document.querySelectorAll('.rhythm-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        rCurrentSong = btn.dataset.song;
      });
    });
    document.querySelectorAll('.rhythm-diff-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        if (rRunning) return;
        document.querySelectorAll('.rhythm-diff-chip').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        rCurrentDiff = btn.dataset.diff;
      });
    });

    // --- Web Audio 鼓音合成 ---
    function playDrumHit(type) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (type === 'red') {
          // 低音鼓 (紅)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain); gain.connect(ctx.destination);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(150, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.18);
          gain.gain.setValueAtTime(0.85, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
          osc.start(); osc.stop(ctx.currentTime + 0.22);
        } else {
          // 邊鼓 (藍)
          const buf = ctx.createBuffer(1, ctx.sampleRate * 0.12, ctx.sampleRate);
          const data = buf.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
          const src = ctx.createBufferSource();
          const gain = ctx.createGain();
          src.buffer = buf;
          const filter = ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.value = 2800;
          filter.Q.value = 1.2;
          src.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
          gain.gain.setValueAtTime(0.7, ctx.currentTime);
          src.start(); src.stop(ctx.currentTime + 0.12);
        }
      } catch(e) {}
    }

    function playJudgeSound(type) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (type === 'perfect') {
          [523, 659, 784].forEach((freq, i) => {
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.connect(g); g.connect(ctx.destination);
            o.type = 'triangle'; o.frequency.value = freq;
            g.gain.setValueAtTime(0, ctx.currentTime + i * 0.06);
            g.gain.linearRampToValueAtTime(0.18, ctx.currentTime + i * 0.06 + 0.02);
            g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.15);
            o.start(ctx.currentTime + i * 0.06);
            o.stop(ctx.currentTime + i * 0.06 + 0.15);
          });
        } else if (type === 'miss') {
          const o = ctx.createOscillator(), g = ctx.createGain();
          o.connect(g); g.connect(ctx.destination);
          o.type = 'sawtooth'; o.frequency.value = 120;
          g.gain.setValueAtTime(0.15, ctx.currentTime);
          g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          o.start(); o.stop(ctx.currentTime + 0.25);
        }
      } catch(e) {}
    }

    // --- 建立節拍表 ---
    function buildBeatmap() {
      const song = SONGS[rCurrentSong];
      const diff = DIFFICULTIES[rCurrentDiff];
      rBpm = song.bpm * diff.speedMult;
      rNoteSpeed = NOTE_SPEED_BASE * diff.speedMult;
      const secPerBeat = 60 / song.bpm; // 保持原始 BPM 計時，速度靠 speed 控制
      const canvasW = rCanvas.width;
      // 計算每個音符「應該到達判定線」的時間
      const travelTime = (canvasW - JUDGE_X) / rNoteSpeed; // 音符從右側到判定線的時間
      rBeatmap = song.pattern
        .filter((n, i) => diff.noteFilter(i))
        .map(n => ({
          type: n.t,
          // 預計音符到達判定線的時間 (ms)
          hitTime: (n.b * secPerBeat + travelTime) * 1000,
          // 音符發射時間 (ms)
          spawnTime: n.b * secPerBeat * 1000,
          hit: false,
          missed: false
        }));
      rBeatmap.sort((a, b) => a.spawnTime - b.spawnTime);
    }

    // --- 開始 / 重置 ---
    function startRhythm() {
      rScore = 0; rCombo = 0; rMaxCombo = 0;
      rPerfect = 0; rGood = 0; rMiss = 0;
      rNotes = []; rBeatmap = []; rNoteIdx = 0;
      rParticles = []; rFlash = null;
      rRunning = true; rOver = false;
      buildBeatmap();
      rStartTime = performance.now();
      rLastTs = rStartTime;
      updateRhythmUI();
      if (rhythmStartOv) rhythmStartOv.classList.add('hidden');
      if (rhythmOverOv)  rhythmOverOv.classList.add('hidden');
      cancelAnimationFrame(rRafId);
      rRafId = requestAnimationFrame(rhythmLoop);
    }

    // --- 判定邏輯 ---
    function judgeDrum(type) {
      if (!rRunning) return;
      playDrumHit(type);

      // 找最近一個未判定的對應類型音符
      const elapsed = performance.now() - rStartTime;
      let bestNote = null, bestDelta = Infinity;
      for (const note of rNotes) {
        if (note.hit || note.missed) continue;
        if (note.type !== type) continue;
        const delta = Math.abs(elapsed - note.hitTime);
        if (delta < bestDelta) { bestDelta = delta; bestNote = note; }
      }

      if (!bestNote || bestDelta > GOOD_WINDOW * 1.5) {
        // 空打
        showJudge('空打', '#aaa');
        rCombo = 0;
        updateRhythmUI();
        return;
      }

      bestNote.hit = true;
      const delta = bestDelta;

      if (delta <= PERFECT_WINDOW) {
        rPerfect++;
        const pts = 300 + rCombo * 5;
        rScore += pts;
        rCombo++;
        playJudgeSound('perfect');
        showJudge('✨ PERFECT!', '#ffd700');
        spawnRhythmParticles(bestNote.type === 'red' ? '#ff4d6d' : '#4ea8de', JUDGE_X, rCanvas.height / 2);
        rFlash = { color: bestNote.type === 'red' ? 'rgba(255,77,109,0.22)' : 'rgba(78,168,222,0.22)', alpha: 1 };
      } else if (delta <= GOOD_WINDOW) {
        rGood++;
        const pts = 100 + rCombo * 2;
        rScore += pts;
        rCombo++;
        showJudge('👍 GOOD', '#90e0ef');
        spawnRhythmParticles(bestNote.type === 'red' ? '#ff9dac' : '#90caf9', JUDGE_X, rCanvas.height / 2);
      } else {
        rMiss++;
        rCombo = 0;
        playJudgeSound('miss');
        showJudge('💔 MISS', '#ff6b6b');
      }

      if (rCombo > rMaxCombo) rMaxCombo = rCombo;
      updateRhythmUI();
    }

    // --- 顯示判定文字 ---
    function showJudge(text, color) {
      if (!rhythmJudge) return;
      const el = document.createElement('span');
      el.className = 'judge-text';
      el.textContent = text;
      el.style.color = color;
      el.style.left = '50%';
      rhythmJudge.appendChild(el);
      setTimeout(() => el.remove(), 850);
    }

    // --- 粒子特效 ---
    function spawnRhythmParticles(color, x, y) {
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.5;
        const speed = 60 + Math.random() * 80;
        rParticles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 4 + Math.random() * 5,
          alpha: 1,
          color
        });
      }
    }

    // --- 更新 UI ---
    function updateRhythmUI() {
      if (rhythmScoreEl) rhythmScoreEl.textContent = rScore;
      if (rhythmBestEl)  rhythmBestEl.textContent  = rBest;
      if (rhythmComboEl) rhythmComboEl.textContent = `x${rCombo}`;
      const total = rPerfect + rGood + rMiss;
      const acc = total === 0 ? 100 : Math.round(((rPerfect * 1 + rGood * 0.5) / total) * 100);
      if (rhythmAccEl) rhythmAccEl.textContent = `${acc}%`;
    }

    // --- 結束遊戲 ---
    function endRhythm() {
      rRunning = false; rOver = true;
      cancelAnimationFrame(rRafId);
      if (rScore > rBest) {
        rBest = rScore;
        localStorage.setItem(STORAGE_KEY_RHYTHM, rBest);
        if (rhythmBestEl) rhythmBestEl.textContent = rBest;
      }
      const total = rPerfect + rGood + rMiss;
      const acc = total === 0 ? 100 : Math.round(((rPerfect * 1 + rGood * 0.5) / total) * 100);
      // 稱號
      let medal, emoji, title;
      if (acc >= 95 && rMaxCombo >= 10) { medal = '👑 傳奇太鼓達人'; emoji = '🥁'; title = '完美演奏！'; }
      else if (acc >= 80)               { medal = '🥇 節奏大師';     emoji = '🎵'; title = '超棒演奏！'; }
      else if (acc >= 60)               { medal = '🥈 節拍達人';     emoji = '🎶'; title = '很不錯喔！'; }
      else                              { medal = '🥉 鼓手新手';     emoji = '🥁'; title = '繼續加油！'; }
      if (rhythmOverEmoji) rhythmOverEmoji.textContent = emoji;
      if (rhythmOverTitle) rhythmOverTitle.textContent = title;
      if (rhythmOverScore) rhythmOverScore.textContent = rScore;
      if (rhythmOverMedal) rhythmOverMedal.textContent = medal;
      const summaryEl = document.getElementById('rhythmOverSummary');
      if (summaryEl) summaryEl.innerHTML = `獲得 <span class="highlight-score">${rScore}</span> 分！準確率 ${acc}%，最高連擊 x${rMaxCombo}`;
      if (rhythmOverOv) rhythmOverOv.classList.remove('hidden');
    }

    // --- 主渲染迴圈 ---
    function rhythmLoop(ts) {
      const dt = (ts - rLastTs) / 1000;
      rLastTs = ts;
      const elapsed = ts - rStartTime; // ms

      const cw = rCanvas.width, ch = rCanvas.height;
      rCtx.clearRect(0, 0, cw, ch);

      // 1. 背景漸層
      const bgGrad = rCtx.createLinearGradient(0, 0, 0, ch);
      bgGrad.addColorStop(0, '#0d0d1a');
      bgGrad.addColorStop(1, '#0f2044');
      rCtx.fillStyle = bgGrad;
      rCtx.fillRect(0, 0, cw, ch);

      // 2. 判定閃光
      if (rFlash && rFlash.alpha > 0) {
        rCtx.fillStyle = rFlash.color.replace(/[\d.]+\)$/, `${rFlash.alpha})`);
        rCtx.fillRect(0, 0, cw, ch);
        rFlash.alpha -= dt * 4;
      }

      // 3. 節奏進度條（頂部）
      const totalDuration = rBeatmap.length > 0 ? rBeatmap[rBeatmap.length - 1].hitTime + 800 : 10000;
      const progress = Math.min(elapsed / totalDuration, 1);
      rCtx.fillStyle = 'rgba(255,255,255,0.08)';
      rCtx.fillRect(0, 0, cw, 6);
      const progGrad = rCtx.createLinearGradient(0, 0, cw, 0);
      progGrad.addColorStop(0, '#ff70a6');
      progGrad.addColorStop(1, '#70d6ff');
      rCtx.fillStyle = progGrad;
      rCtx.fillRect(0, 0, cw * progress, 6);

      // 4. 跑道線
      const laneY = ch / 2;
      rCtx.strokeStyle = 'rgba(255,255,255,0.12)';
      rCtx.lineWidth = 1;
      rCtx.setLineDash([8, 8]);
      rCtx.beginPath();
      rCtx.moveTo(JUDGE_X + 40, laneY - 38);
      rCtx.lineTo(cw, laneY - 38);
      rCtx.moveTo(JUDGE_X + 40, laneY + 38);
      rCtx.lineTo(cw, laneY + 38);
      rCtx.stroke();
      rCtx.setLineDash([]);

      // 5. 判定圈 (太鼓)
      // 外圈
      rCtx.save();
      rCtx.beginPath();
      rCtx.arc(JUDGE_X, laneY, 38, 0, Math.PI * 2);
      rCtx.fillStyle = 'rgba(255,255,255,0.06)';
      rCtx.fill();
      rCtx.strokeStyle = 'rgba(255,255,255,0.3)';
      rCtx.lineWidth = 2.5;
      rCtx.stroke();
      // 內圈（太鼓面）
      rCtx.beginPath();
      rCtx.arc(JUDGE_X, laneY, 26, 0, Math.PI * 2);
      rCtx.fillStyle = '#e63946';
      rCtx.fill();
      rCtx.strokeStyle = '#fff';
      rCtx.lineWidth = 2;
      rCtx.stroke();
      // 太鼓中心點
      rCtx.beginPath();
      rCtx.arc(JUDGE_X, laneY, 10, 0, Math.PI * 2);
      rCtx.fillStyle = '#fff';
      rCtx.globalAlpha = 0.15;
      rCtx.fill();
      rCtx.globalAlpha = 1;
      rCtx.restore();

      // 判定線
      rCtx.strokeStyle = 'rgba(255,255,255,0.55)';
      rCtx.lineWidth = 2.5;
      rCtx.beginPath();
      rCtx.moveTo(JUDGE_X, laneY - 42);
      rCtx.lineTo(JUDGE_X, laneY + 42);
      rCtx.stroke();

      // 6. 發射新音符
      while (rNoteIdx < rBeatmap.length && rBeatmap[rNoteIdx].spawnTime <= elapsed) {
        const bm = rBeatmap[rNoteIdx];
        rNotes.push({
          type: bm.type,
          hitTime: bm.hitTime,
          x: cw + 28,
          y: laneY,
          hit: bm.hit,
          missed: bm.missed,
          scale: 1,
          alpha: 1
        });
        rNoteIdx++;
      }

      // 7. 移動 & 繪製音符
      for (let i = rNotes.length - 1; i >= 0; i--) {
        const n = rNotes[i];
        if (!n.hit && !n.missed) n.x -= rNoteSpeed * dt;

        // 超過判定線一定距離 → MISS
        if (!n.hit && !n.missed && n.x < JUDGE_X - 55) {
          n.missed = true;
          rMiss++;
          rCombo = 0;
          playJudgeSound('miss');
          showJudge('💔 MISS', '#ff6b6b');
          updateRhythmUI();
        }

        // 消失條件
        if (n.x < JUDGE_X - 100 || n.alpha <= 0) {
          rNotes.splice(i, 1);
          continue;
        }

        if (n.hit) {
          n.scale += dt * 3;
          n.alpha -= dt * 5;
        }

        // 繪製音符
        rCtx.save();
        rCtx.globalAlpha = Math.max(0, n.alpha);
        rCtx.translate(n.x, n.y);
        rCtx.scale(n.scale, n.scale);

        // 音符陰影
        rCtx.shadowColor = n.type === 'red' ? '#ff4d6d' : '#4ea8de';
        rCtx.shadowBlur = 18;

        // 音符本體（圓形）
        rCtx.beginPath();
        rCtx.arc(0, 0, 22, 0, Math.PI * 2);
        const nGrad = rCtx.createRadialGradient(-6, -6, 4, 0, 0, 22);
        if (n.type === 'red') {
          nGrad.addColorStop(0, '#ffb3c1');
          nGrad.addColorStop(0.4, '#ff4d6d');
          nGrad.addColorStop(1, '#c9184a');
        } else {
          nGrad.addColorStop(0, '#ade8f4');
          nGrad.addColorStop(0.4, '#4ea8de');
          nGrad.addColorStop(1, '#1a6fad');
        }
        rCtx.fillStyle = nGrad;
        rCtx.fill();

        // 音符邊框
        rCtx.strokeStyle = 'rgba(255,255,255,0.7)';
        rCtx.lineWidth = 2;
        rCtx.stroke();

        // 音符光澤
        rCtx.beginPath();
        rCtx.arc(-7, -7, 8, 0, Math.PI * 2);
        rCtx.fillStyle = 'rgba(255,255,255,0.3)';
        rCtx.fill();

        // 音符符號
        rCtx.shadowBlur = 0;
        rCtx.font = 'bold 14px sans-serif';
        rCtx.fillStyle = '#fff';
        rCtx.textAlign = 'center';
        rCtx.textBaseline = 'middle';
        rCtx.fillText(n.type === 'red' ? '♪' : '♫', 0, 1);

        rCtx.restore();
      }

      // 8. 粒子
      for (let i = rParticles.length - 1; i >= 0; i--) {
        const p = rParticles[i];
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.92;
        p.vy *= 0.92;
        p.alpha -= dt * 2.5;
        if (p.alpha <= 0) { rParticles.splice(i, 1); continue; }
        rCtx.beginPath();
        rCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        rCtx.fillStyle = p.color;
        rCtx.globalAlpha = p.alpha;
        rCtx.fill();
        rCtx.globalAlpha = 1;
      }

      // 9. 連擊顯示
      if (rCombo >= 5) {
        rCtx.save();
        const pulse = 1 + Math.sin(ts / 150) * 0.05;
        rCtx.translate(cw / 2, 30);
        rCtx.scale(pulse, pulse);
        rCtx.font = 'bold 17px "Zen Maru Gothic", sans-serif';
        rCtx.textAlign = 'center';
        rCtx.fillStyle = rCombo >= 20 ? '#ffd700' : rCombo >= 10 ? '#ff70a6' : '#90e0ef';
        rCtx.shadowColor = rCtx.fillStyle;
        rCtx.shadowBlur = 12;
        rCtx.fillText(`🔥 ${rCombo} COMBO!`, 0, 0);
        rCtx.restore();
      }

      // 10. 樂曲結束判斷
      if (rNoteIdx >= rBeatmap.length && rNotes.length === 0 && elapsed > 500) {
        endRhythm();
        return;
      }

      if (rRunning) rRafId = requestAnimationFrame(rhythmLoop);
    }

    // --- 鍵盤輸入 ---
    document.addEventListener('keydown', (e) => {
      if (!rRunning) return;
      if (e.repeat) return;
      if (e.key === 'd' || e.key === 'D') {
        judgeDrum('red');
        if (keyDEl) { keyDEl.classList.add('pressed'); setTimeout(() => keyDEl.classList.remove('pressed'), 120); }
        if (btnTouchD) { btnTouchD.classList.add('pressing'); setTimeout(() => btnTouchD.classList.remove('pressing'), 120); }
      }
      if (e.key === 'f' || e.key === 'F') {
        judgeDrum('blue');
        if (keyFEl) { keyFEl.classList.add('pressed'); setTimeout(() => keyFEl.classList.remove('pressed'), 120); }
        if (btnTouchF) { btnTouchF.classList.add('pressing'); setTimeout(() => btnTouchF.classList.remove('pressing'), 120); }
      }
    });

    // 觸控按鈕
    if (btnTouchD) {
      btnTouchD.addEventListener('pointerdown', (e) => { e.preventDefault(); if (rRunning) { judgeDrum('red'); btnTouchD.classList.add('pressing'); } });
      btnTouchD.addEventListener('pointerup', () => btnTouchD.classList.remove('pressing'));
    }
    if (btnTouchF) {
      btnTouchF.addEventListener('pointerdown', (e) => { e.preventDefault(); if (rRunning) { judgeDrum('blue'); btnTouchF.classList.add('pressing'); } });
      btnTouchF.addEventListener('pointerup', () => btnTouchF.classList.remove('pressing'));
    }

    // 開始 / 重新開始按鈕
    if (btnStartR)   btnStartR.addEventListener('click', startRhythm);
    if (btnRestartR) btnRestartR.addEventListener('click', startRhythm);

    // Dock 按鈕
    if (btnRhythm) {
      btnRhythm.addEventListener('click', () => {
        document.getElementById('rhythmGameCard')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }

    // 初始畫布繪製（靜態待機畫面）
    function drawRhythmIdle() {
      if (!rCtx) return;
      const cw = rCanvas.width, ch = rCanvas.height;
      rCtx.clearRect(0, 0, cw, ch);
      const bgGrad = rCtx.createLinearGradient(0, 0, 0, ch);
      bgGrad.addColorStop(0, '#0d0d1a');
      bgGrad.addColorStop(1, '#0f2044');
      rCtx.fillStyle = bgGrad;
      rCtx.fillRect(0, 0, cw, ch);
      // 太鼓
      const laneY = ch / 2;
      rCtx.beginPath();
      rCtx.arc(JUDGE_X, laneY, 38, 0, Math.PI * 2);
      rCtx.fillStyle = 'rgba(255,255,255,0.06)';
      rCtx.fill();
      rCtx.strokeStyle = 'rgba(255,255,255,0.25)';
      rCtx.lineWidth = 2; rCtx.stroke();
      rCtx.beginPath();
      rCtx.arc(JUDGE_X, laneY, 26, 0, Math.PI * 2);
      rCtx.fillStyle = '#e63946'; rCtx.fill();
      rCtx.strokeStyle = '#fff'; rCtx.lineWidth = 2; rCtx.stroke();
      // 示範音符
      const demoNotes = [
        { x: cw * 0.55, type: 'red' },
        { x: cw * 0.68, type: 'blue' },
        { x: cw * 0.80, type: 'red' },
        { x: cw * 0.90, type: 'blue' },
      ];
      demoNotes.forEach(dn => {
        rCtx.beginPath();
        rCtx.arc(dn.x, laneY, 22, 0, Math.PI * 2);
        rCtx.fillStyle = dn.type === 'red' ? '#ff4d6d' : '#4ea8de';
        rCtx.shadowColor = rCtx.fillStyle;
        rCtx.shadowBlur = 14;
        rCtx.fill();
        rCtx.shadowBlur = 0;
        rCtx.strokeStyle = 'rgba(255,255,255,0.6)'; rCtx.lineWidth = 2; rCtx.stroke();
        rCtx.font = 'bold 13px sans-serif';
        rCtx.fillStyle = '#fff';
        rCtx.textAlign = 'center'; rCtx.textBaseline = 'middle';
        rCtx.fillText(dn.type === 'red' ? '♪' : '♫', dn.x, laneY + 1);
      });
    }
    drawRhythmIdle();
  }
});
