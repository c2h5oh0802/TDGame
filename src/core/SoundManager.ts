/**
 * Web Audio API 8-bit 音效引擎
 */

export class SoundManager {
  private static ctx: AudioContext | null = null;
  private static noiseBuffer: AudioBuffer | null = null;
  private static lastExplosionTime: number = 0;
  private static lastCoinTime: number = 0;
  private static masterVolume: number = 1.0;

  static init(): void {
    try {
      if (!this.ctx) {
        const audioContext = window.AudioContext || (window as any).webkitAudioContext;
        this.ctx = new audioContext();

        const bufferSize = this.ctx.sampleRate * 2;
        this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = this.noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          output[i] = Math.random() * 2 - 1;
        }
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    } catch (e) {
      console.warn('音效引擎初始化失敗，可能是瀏覽器環境限制', e);
    }
  }

  static setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  static getMasterVolume(): number {
    return this.masterVolume;
  }

  static play(type: string): void {
    if (!this.ctx) this.init();
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    if (!this.ctx || this.masterVolume <= 0) return;

    try {
      const now = this.ctx.currentTime;
      const baseVol = 0.15 * this.masterVolume;

      const playTone = (
        oscType: OscillatorType,
        freq1: number,
        freq2: number | null,
        duration: number,
        volMod: number = 1
      ) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.type = oscType;
        osc.frequency.setValueAtTime(freq1, now);
        if (freq2) osc.frequency.exponentialRampToValueAtTime(freq2, now + duration);
        gain.gain.setValueAtTime(baseVol * volMod, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        osc.start(now);
        osc.stop(now + duration);
        return { osc, gain };
      };

      switch (type) {
        case 'ui_click':
          playTone('sine', 600, 800, 0.05, 0.5);
          break;
        case 'error':
          playTone('sawtooth', 150, 100, 0.2, 0.8);
          break;
        case 'spell':
          playTone('sine', 300, 1200, 0.4, 0.8);
          break;
        case 'heal':
          [523.25, 659.25, 783.99].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            gain.gain.setValueAtTime(0, now);
            gain.gain.setValueAtTime(baseVol * 0.6, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.01, now + i * 0.1 + 0.2);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.2);
          });
          break;
        case 'boss_spawn':
          const bOsc = this.ctx.createOscillator();
          const bGain = this.ctx.createGain();
          bOsc.connect(bGain);
          bGain.connect(this.ctx.destination);
          bOsc.type = 'sawtooth';
          bOsc.frequency.setValueAtTime(200, now);
          bOsc.frequency.exponentialRampToValueAtTime(40, now + 1.5);
          bGain.gain.setValueAtTime(baseVol * 2, now);
          bGain.gain.linearRampToValueAtTime(0.01, now + 1.5);
          bOsc.start(now);
          bOsc.stop(now + 1.5);
          break;
        case 'shoot':
          playTone('square', 600, 150, 0.1, 0.4);
          break;
        case 'hit':
          playTone('triangle', 200, 50, 0.1, 0.6);
          break;
        case 'player_hit':
          playTone('sawtooth', 100, 40, 0.3, 1.5);
          break;
        case 'exp':
          playTone('sine', 800, 1200, 0.05, 0.4);
          break;
        case 'coin':
          if (this.lastCoinTime && now - this.lastCoinTime < 0.03) break;
          this.lastCoinTime = now;

          const coinOsc = this.ctx.createOscillator();
          const coinGain = this.ctx.createGain();
          coinOsc.connect(coinGain);
          coinGain.connect(this.ctx.destination);
          coinOsc.type = 'sine';

          coinOsc.frequency.setValueAtTime(987.77, now);
          coinOsc.frequency.setValueAtTime(1318.51, now + 0.05);

          coinGain.gain.setValueAtTime(0, now);
          coinGain.gain.linearRampToValueAtTime(baseVol * 0.3, now + 0.02);
          coinGain.gain.setValueAtTime(baseVol * 0.3, now + 0.05);
          coinGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

          coinOsc.start(now);
          coinOsc.stop(now + 0.3);
          break;
        case 'build':
          playTone('square', 200, 50, 0.15, 1.2);
          break;
        case 'explosion':
          if (this.lastExplosionTime && now - this.lastExplosionTime < 0.05) break;
          this.lastExplosionTime = now;
          if (this.noiseBuffer) {
            const noiseSrc = this.ctx.createBufferSource();
            noiseSrc.buffer = this.noiseBuffer;
            const noiseFilter = this.ctx.createBiquadFilter();
            noiseFilter.type = 'lowpass';
            noiseFilter.frequency.setValueAtTime(1000, now);
            noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 0.3);
            const noiseGain = this.ctx.createGain();
            noiseGain.gain.setValueAtTime(baseVol * 1.5, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
            noiseSrc.connect(noiseFilter);
            noiseFilter.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noiseSrc.start(now);
            noiseSrc.stop(now + 0.3);
          }
          playTone('square', 100, 20, 0.3, 0.8);
          break;
        case 'levelup':
          [440, 554, 659, 880].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            gain.gain.setValueAtTime(0, now);
            gain.gain.setValueAtTime(baseVol * 0.7, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.01, now + i * 0.1 + 0.3);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.3);
          });
          break;
      }
    } catch (e) {
      // 忽略音效錯誤
    }
  }
}
