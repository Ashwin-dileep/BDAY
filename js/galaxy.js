/**
 * ====================================================================
 * SPACE GALAXY & NEBULA BACKGROUND ENGINE
 * Procedural deep space, glowing interstellar nebula clouds & starfield.
 * Seamlessly integrates with background MP4 video when loaded!
 * ====================================================================
 */

class SpaceGalaxyEngine {
  constructor() {
    this.canvas = document.getElementById("space-galaxy-canvas");
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.video = document.getElementById("bg-video");
    this.stars = [];
    this.nebulaPuffs = [];
    this.shootingStars = [];
    this.time = 0;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Generate Stars
    const starCount = Math.floor((this.width * this.height) / 4500);
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: this.randomStarColor(),
        depth: Math.random() * 0.5 + 0.5
      });
    }

    // Generate Nebula Gas Clusters
    this.nebulaPuffs = [
      { xRatio: 0.3, yRatio: 0.35, radius: 450, color: "rgba(99, 102, 241, 0.14)", speed: 0.0003, phase: 0 },
      { xRatio: 0.75, yRatio: 0.45, radius: 520, color: "rgba(168, 85, 247, 0.16)", speed: 0.0004, phase: 1.5 },
      { xRatio: 0.5, yRatio: 0.7, radius: 600, color: "rgba(236, 72, 153, 0.11)", speed: 0.00025, phase: 3.1 },
      { xRatio: 0.2, yRatio: 0.75, radius: 480, color: "rgba(6, 182, 212, 0.12)", speed: 0.00035, phase: 4.5 },
      { xRatio: 0.65, yRatio: 0.2, radius: 380, color: "rgba(245, 158, 11, 0.09)", speed: 0.0002, phase: 2.2 }
    ];

    // Check if background video is playing
    if (this.video) {
      const showVideo = () => {
        this.video.style.opacity = "0.85";
      };
      this.video.addEventListener("play", showVideo);
      this.video.addEventListener("loadeddata", showVideo);
      this.video.addEventListener("canplay", showVideo);
      // Attempt autoplay
      this.video.play().then(showVideo).catch(() => {});
    }

    this.animate();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  randomStarColor() {
    const colors = ["#ffffff", "#fef08a", "#c7d2fe", "#e0e7ff", "#bae6fd"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  animate() {
    this.time += 1;

    // Clear background
    this.ctx.fillStyle = "#07070a";
    this.ctx.fillRect(0, 0, this.width, this.height);

    // 1. Draw Nebula Gas Clouds
    this.drawNebula();

    // 2. Draw Stars
    this.drawStars();

    // 3. Occasional Shooting Star
    this.drawShootingStars();

    requestAnimationFrame(() => this.animate());
  }

  drawNebula() {
    this.ctx.save();
    this.ctx.globalCompositeOperation = "screen";

    for (const puff of this.nebulaPuffs) {
      const offsetX = Math.sin(this.time * puff.speed + puff.phase) * 60;
      const offsetY = Math.cos(this.time * puff.speed + puff.phase) * 45;

      const cx = this.width * puff.xRatio + offsetX;
      const cy = this.height * puff.yRatio + offsetY;
      const radius = puff.radius * (1 + Math.sin(this.time * puff.speed * 0.7) * 0.08);

      const grad = this.ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, puff.color);
      grad.addColorStop(0.5, puff.color.replace(/[\d\.]+\)$/, "0.05)"));
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");

      this.ctx.fillStyle = grad;
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  drawStars() {
    for (const s of this.stars) {
      // Subtle drift
      s.y -= 0.08 * s.depth;
      if (s.y < 0) {
        s.y = this.height;
        s.x = Math.random() * this.width;
      }

      // Twinkle calculation
      const twinkle = Math.sin(this.time * s.twinkleSpeed + s.twinklePhase);
      const currentAlpha = Math.max(0.1, s.alpha + twinkle * 0.25);

      this.ctx.save();
      this.ctx.globalAlpha = currentAlpha;
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      this.ctx.fill();

      // Bright stars get subtle cross lens flare
      if (s.radius > 1.3 && currentAlpha > 0.6) {
        this.ctx.strokeStyle = s.color;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(s.x - 4, s.y);
        this.ctx.lineTo(s.x + 4, s.y);
        this.ctx.moveTo(s.x, s.y - 4);
        this.ctx.lineTo(s.x, s.y + 4);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
  }

  drawShootingStars() {
    // Random chance to spawn a shooting star
    if (Math.random() < 0.007 && this.shootingStars.length < 2) {
      this.shootingStars.push({
        x: Math.random() * this.width * 0.8 + this.width * 0.1,
        y: Math.random() * this.height * 0.4,
        length: Math.random() * 80 + 60,
        speed: Math.random() * 9 + 8,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.3,
        opacity: 1,
        decay: 0.02
      });
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      star.x += Math.cos(star.angle) * star.speed;
      star.y += Math.sin(star.angle) * star.speed;
      star.opacity -= star.decay;

      if (star.opacity <= 0 || star.x > this.width || star.y > this.height) {
        this.shootingStars.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = star.opacity;
      const tailX = star.x - Math.cos(star.angle) * star.length;
      const tailY = star.y - Math.sin(star.angle) * star.length;

      const grad = this.ctx.createLinearGradient(star.x, star.y, tailX, tailY);
      grad.addColorStop(0, "#ffffff");
      grad.addColorStop(0.4, "#a855f7");
      grad.addColorStop(1, "transparent");

      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 1.5;
      this.ctx.beginPath();
      this.ctx.moveTo(star.x, star.y);
      this.ctx.lineTo(tailX, tailY);
      this.ctx.stroke();
      this.ctx.restore();
    }
  }
}

// Global initialization
window.spaceGalaxyEngine = null;
document.addEventListener("DOMContentLoaded", () => {
  window.spaceGalaxyEngine = new SpaceGalaxyEngine();
});

