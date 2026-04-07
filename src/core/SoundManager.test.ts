/**
 * 音效系統測試
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SoundManager } from '@/core/SoundManager';

describe('SoundManager', () => {
  beforeEach(() => {
    SoundManager.init();
  });

  it('should initialize without errors', () => {
    expect(() => {
      SoundManager.init();
    }).not.toThrow();
  });

  it('should handle volume control', () => {
    SoundManager.setMasterVolume(0.5);
    expect(SoundManager.getMasterVolume()).toBe(0.5);

    SoundManager.setMasterVolume(1.0);
    expect(SoundManager.getMasterVolume()).toBe(1.0);
  });

  it('should clamp volume to valid range', () => {
    SoundManager.setMasterVolume(2.0);
    expect(SoundManager.getMasterVolume()).toBe(1.0);

    SoundManager.setMasterVolume(-0.5);
    expect(SoundManager.getMasterVolume()).toBe(0);
  });

  it('should play sound effects without errors', () => {
    expect(() => {
      SoundManager.play('ui_click');
      SoundManager.play('spell');
      SoundManager.play('explosion');
      SoundManager.play('levelup');
    }).not.toThrow();
  });

  it('should handle zero volume gracefully', () => {
    SoundManager.setMasterVolume(0);
    expect(() => {
      SoundManager.play('ui_click');
    }).not.toThrow();
  });
});
