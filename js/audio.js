/**
 * ====================================================================
 * AMBIENT SOUND ENGINE (Web Audio API)
 * Minimalist, calming ambient synthesizer — mature and subtle.
 * ====================================================================
 */

class AmbientSoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.nodes = [];
    this.timer = null;

    // Pentatonic warm chord frequencies: C3, G3, D4, E4, G4, B4
    this.pitches = [130.81, 196.00, 293.66, 329.63, 392.00, 493.88];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.init();
    if (this.isPlaying) {
      this.stop();
    } else {
      this.play();
    }
    this.updateUI();
  }

  play() {
    if (!this.ctx || this.isPlaying) return;
    this.isPlaying = true;
    this.playAmbientChord();
  }

  playAmbientChord() {
    if (!this.isPlaying || !this.ctx) return;

    try {
      // Pick 2-3 gentle harmonic notes
      const chosen = [
        this.pitches[0], // root
        this.pitches[Math.floor(Math.random() * (this.pitches.length - 1)) + 1],
        this.pitches[Math.floor(Math.random() * (this.pitches.length - 1)) + 1]
      ];

      const now = this.ctx.currentTime;
      const duration = 6.5;

      chosen.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        // Lowpass warm filter
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(600, now);

        // Soft swell envelope
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.045, now + 2.5);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.4);
        osc.stop(now + duration);
      });

      this.timer = setTimeout(() => {
        if (this.isPlaying) this.playAmbientChord();
      }, 5500);
    } catch (e) {
      console.warn("Ambient audio error:", e);
    }
  }

  stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.updateUI();
  }

  // Soft subtle click sound for interactions
  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  updateUI() {
    const btn = document.getElementById("btn-sound-toggle");
    const icon = document.getElementById("sound-status-icon");
    const text = document.getElementById("sound-status-text");
    if (btn) {
      if (this.isPlaying) {
        btn.classList.add("active");
        if (icon) icon.textContent = "●";
        if (text) text.textContent = "PLAYING";
      } else {
        btn.classList.remove("active");
        if (icon) icon.textContent = "○";
        if (text) text.textContent = "AUDIO";
      }
    }
  }
}

window.soundEngine = new AmbientSoundEngine();
