/**
 * The sound of the login page. Everything is made live with the Web Audio API,
 * so there are no audio files to download.
 *
 * Nothing is created until `enable()` is called, because browsers only allow
 * sound after a click or a key press.
 */

/** A minor pentatonic scale, in semitones. Any notes picked from it sound good together. */
const PENT = [0, 3, 5, 7, 10];

/** The frequency of note number `i` on the scale. 0 is A2 (110 Hz), and every 5 steps is one octave up. */
export const noteHz = (i: number) => 110 * Math.pow(2, (PENT[((i % 5) + 5) % 5] + 12 * Math.floor(i / 5)) / 12);

/** The pitch of the plate for a given pair of vibration modes. */
export const plateHz = (n: number, m: number) => noteHz(Math.round(n + m) % 10);

export class ResonanceAudio {
  /** True while the sound is switched on. */
  enabled = false;

  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bus: GainNode | null = null;
  private plate: OscillatorNode | null = null;
  private sleep: ReturnType<typeof setTimeout> | null = null;

  /** Switch the sound on. Call this from a click. */
  async enable() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) this.build();
    if (!this.ctx || !this.master) return;
    if (this.sleep) clearTimeout(this.sleep);
    await this.ctx.resume();
    this.enabled = true;
    this.master.gain.setTargetAtTime(0.85, this.ctx.currentTime, 0.25);
    this.pluck(440, 0.18, 2.2);
  }

  /** Fade the sound out and pause the audio engine. */
  disable() {
    this.enabled = false;
    if (!this.ctx || !this.master) return;
    this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.25);
    this.sleep = setTimeout(() => {
      if (!this.enabled) void this.ctx?.suspend();
    }, 900);
  }

  /** Stop everything. Call this when the page is removed. */
  dispose() {
    this.enabled = false;
    if (this.sleep) clearTimeout(this.sleep);
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
    this.bus = null;
    this.plate = null;
  }

  /** Slide the plate's hum to a new pitch. */
  setPlateHz(hz: number) {
    if (this.ctx && this.plate) this.plate.frequency.setTargetAtTime(hz, this.ctx.currentTime, 0.5);
  }

  /** One soft plucked note. */
  pluck(freq: number, volume = 0.2, seconds = 1.6) {
    const ctx = this.ctx;
    if (!this.enabled || !ctx || !this.bus) return;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(volume, t + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + seconds);
    const body = ctx.createOscillator();
    body.type = 'triangle';
    body.frequency.value = freq;
    const shine = ctx.createOscillator();
    shine.type = 'sine';
    shine.frequency.value = freq * 2;
    const shineGain = ctx.createGain();
    shineGain.gain.value = 0.25;
    shine.connect(shineGain);
    shineGain.connect(gain);
    body.connect(gain);
    gain.connect(this.bus);
    body.start(t);
    shine.start(t);
    body.stop(t + seconds + 0.05);
    shine.stop(t + seconds + 0.05);
  }

  /** The note for a key press. The same letter always plays the same note. */
  key(key: string) {
    if (key.length === 1) this.pluck(noteHz(5 + (key.charCodeAt(0) % 10)), 0.2, 1.5);
    else if (key === 'Backspace') this.pluck(130.8, 0.12, 0.35);
  }

  /** Two quick notes, for a button press. */
  confirm() {
    this.pluck(329.63, 0.18, 1.6);
    setTimeout(() => this.pluck(493.88, 0.16, 1.6), 90);
  }

  /** A low, clashing buzz, for a wrong password. */
  buzz() {
    const ctx = this.ctx;
    if (!this.enabled || !ctx || !this.bus) return;
    const t = ctx.currentTime;
    const gain = ctx.createGain();
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 520;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.13, t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
    [110, 116.5, 164.8].forEach((f) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      o.connect(lp);
      o.start(t);
      o.stop(t + 0.75);
    });
    lp.connect(gain);
    gain.connect(this.bus);
  }

  /** A rising chord, for a successful sign in. */
  chord() {
    [220, 277.18, 329.63, 440, 554.37, 659.25, 880].forEach((f, i) => setTimeout(() => this.pluck(f, 0.16, 2.4), i * 85));
  }

  private build() {
    const Ctor = window.AudioContext ?? (window as unknown as {webkitAudioContext?: typeof AudioContext}).webkitAudioContext;
    if (!Ctor) return;
    const ctx = new Ctor();
    this.ctx = ctx;

    const master = ctx.createGain();
    master.gain.value = 0;
    const bus = ctx.createGain();
    this.master = master;
    this.bus = bus;

    // A soft echo that makes every note ring a little.
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.33;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.4;
    const tone = ctx.createBiquadFilter();
    tone.type = 'lowpass';
    tone.frequency.value = 2200;
    const wet = ctx.createGain();
    wet.gain.value = 0.5;
    bus.connect(master);
    bus.connect(delay);
    delay.connect(tone);
    tone.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(master);
    master.connect(ctx.destination);

    // The drone: three low notes that beat slowly against each other.
    ([[55, 0.1], [82.41, 0.06], [110.4, 0.035]] as const).forEach(([f, g]) => {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.value = f;
      const gain = ctx.createGain();
      gain.gain.value = g;
      o.connect(gain);
      gain.connect(bus);
      o.start();
    });

    // The plate's own hum. Its pitch follows the pattern on screen, and it swells slowly.
    const plate = ctx.createOscillator();
    plate.type = 'triangle';
    plate.frequency.value = plateHz(3, 5);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 650;
    const plateGain = ctx.createGain();
    plateGain.gain.value = 0.03;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.13;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.02;
    lfo.connect(lfoGain);
    lfoGain.connect(plateGain.gain);
    lfo.start();
    plate.connect(filter);
    filter.connect(plateGain);
    plateGain.connect(bus);
    plate.start();
    this.plate = plate;
  }
}