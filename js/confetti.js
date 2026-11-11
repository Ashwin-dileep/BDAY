/**
 * ====================================================================
 * CELEBRATION ENGINE: Confetti, Sparkles, Floating Balloons & Ribbons
 * 100% self-contained, high-performance Canvas particle system
 * ====================================================================
 */

class CelebrationEngine {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.id = "celebration-canvas";
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.ambientParticles = [];
    this.isRunning = false;
    this.colors = [
      "#ff5e7e", "#ff99c8", "#fcf6bd", "#d0f4de", "#a9def9", "#e4c1f9",
      "#ffd166", "#06d6a0", "#118ab2", "#ef476f", "#f72585", "#7209b7"
    ];

    this.setupCanvas();
    window.addEventListener("resize", () => this.resize());
    this.startAmbient();
  }

  setupCanvas() {
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100vw";
    this.canvas.style.height = "100vh";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "9999";
    document.body.appendChild(this.canvas);
    this.resize();
  }

  resize() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  // Burst of celebratory confetti (e.g., when unboxing or blowing candles)
  burst(x = window.innerWidth / 2, y = window.innerHeight / 2, count = 120) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      const size = Math.random() * 8 + 5;
      const color = this.colors[Math.floor(Math.random() * this.colors.length)];
      const shapes = ["rect", "circle", "ribbon", "heart", "star"];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4, // slight upward bias
        size: size,
        color: color,
        shape: shape,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        wobble: Math.random() * 10,
        wobbleSpeed: Math.random() * 0.1 + 0.05,
        opacity: 1,
        life: 1,
        decay: Math.random() * 0.008 + 0.006,
        gravity: 0.28
      });
    }

    if (!this.isRunning) {
      this.isRunning = true;
      requestAnimationFrame(() => this.loop());
    }
  }

  // Cannon blasts from bottom-left and bottom-right
  cannonBlast() {
    this.burst(window.innerWidth * 0.15, window.innerHeight * 0.85, 90);
    setTimeout(() => {
      this.burst(window.innerWidth * 0.85, window.innerHeight * 0.85, 90);
    }, 200);
    setTimeout(() => {
      this.burst(window.innerWidth * 0.5, window.innerHeight * 0.6, 110);
    }, 450);
  }

  // Floating ambient background particles (hearts, stars, sparkles)
  startAmbient() {
    for (let i = 0; i < 25; i++) {
      this.ambientParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 14 + 10,
        type: Math.random() > 0.5 ? "heart" : "sparkle",
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        speedY: Math.random() * 0.4 + 0.2,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.4 + 0.2,
        pulse: Math.random() * Math.PI
      });
    }
    if (!this.isRunning) {
      this.isRunning = true;
      requestAnimationFrame(() => this.loop());
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // Render & update ambient floating particles
    for (let p of this.ambientParticles) {
      p.y -= p.speedY;
      p.x += Math.sin(p.pulse) * 0.5 + p.speedX;
      p.pulse += 0.02;

      // Wrap around
      if (p.y < -20) {
        p.y = window.innerHeight + 20;
        p.x = Math.random() * window.innerWidth;
      }
      if (p.x < -20) p.x = window.innerWidth + 20;
      if (p.x > window.innerWidth + 20) p.x = -20;

      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;

      if (p.type === "heart") {
        this.drawHeart(p.x, p.y, p.size);
      } else {
        this.drawStar(p.x, p.y, 4, p.size * 0.6, p.size * 0.3);
      }
      this.ctx.restore();
    }

    // Render & update burst confetti
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.wobble += p.wobbleSpeed;
      p.life -= p.decay;

      if (p.life <= 0 || p.y > window.innerHeight + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.scale(Math.sin(p.wobble), 1);
      this.ctx.globalAlpha = Math.max(0, p.life);
      this.ctx.fillStyle = p.color;

      if (p.shape === "rect") {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.6);
      } else if (p.shape === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === "ribbon") {
        this.ctx.fillRect(-p.size / 4, -p.size, p.size / 2, p.size * 2);
      } else if (p.shape === "heart") {
        this.drawHeart(0, 0, p.size * 1.2);
      } else if (p.shape === "star") {
        this.drawStar(0, 0, 5, p.size, p.size * 0.5);
      }

      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }

  drawHeart(x, y, size) {
    const s = size / 16;
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.beginPath();
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(-4 * s, -6 * s, -12 * s, -4 * s, -12 * s, 4 * s);
    this.ctx.bezierCurveTo(-12 * s, 10 * s, -4 * s, 16 * s, 0, 20 * s);
    this.ctx.bezierCurveTo(4 * s, 16 * s, 12 * s, 10 * s, 12 * s, 4 * s);
    this.ctx.bezierCurveTo(12 * s, -4 * s, 4 * s, -6 * s, 0, 0);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawStar(cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    this.ctx.beginPath();
    this.ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      this.ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      this.ctx.lineTo(x, y);
      rot += step;
    }
    this.ctx.lineTo(cx, cy - outerRadius);
    this.ctx.closePath();
    this.ctx.fill();
  }
}

// Global celebration engine instance
window.celebration = null;
document.addEventListener("DOMContentLoaded", () => {
  window.celebration = new CelebrationEngine();
});

