/**
 * 輸入系統
 */

import { InputState } from './types';
import { SoundManager } from './SoundManager';

export class InputManager {
  private input: InputState = {
    keys: {},
    mouseX: 0,
    mouseY: 0,
    worldMouseX: 0,
    worldMouseY: 0,
    mouseDown: false
  };

  private keyDownHandlers: Array<(code: string) => void> = [];
  private keyUpHandlers: Array<(code: string) => void> = [];
  private mouseDownHandlers: Array<(button: number) => void> = [];
  private mouseUpHandlers: Array<(button: number) => void> = [];
  private mouseMoveHandlers: Array<(x: number, y: number) => void> = [];

  constructor() {
    this.initializeEventListeners();
  }

  private initializeEventListeners(): void {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
  }

  private handleKeyDown(e: KeyboardEvent): void {
    SoundManager.init();
    this.input.keys[e.code] = true;
    this.keyDownHandlers.forEach((handler) => handler(e.code));
  }

  private handleKeyUp(e: KeyboardEvent): void {
    this.input.keys[e.code] = false;
    this.keyUpHandlers.forEach((handler) => handler(e.code));
  }

  private handleMouseMove(e: MouseEvent): void {
    this.input.mouseX = e.clientX;
    this.input.mouseY = e.clientY;
    this.mouseMoveHandlers.forEach((handler) => handler(e.clientX, e.clientY));
  }

  private handleMouseDown(e: MouseEvent): void {
    SoundManager.init();
    if (e.button === 0) {
      this.input.mouseDown = true;
      this.mouseDownHandlers.forEach((handler) => handler(e.button));
    }
  }

  private handleMouseUp(e: MouseEvent): void {
    if (e.button === 0) {
      this.input.mouseDown = false;
      this.mouseUpHandlers.forEach((handler) => handler(e.button));
    }
  }

  // 事件監聽註冊
  onKeyDown(handler: (code: string) => void): void {
    this.keyDownHandlers.push(handler);
  }

  onKeyUp(handler: (code: string) => void): void {
    this.keyUpHandlers.push(handler);
  }

  onMouseDown(handler: (button: number) => void): void {
    this.mouseDownHandlers.push(handler);
  }

  onMouseUp(handler: (button: number) => void): void {
    this.mouseUpHandlers.push(handler);
  }

  onMouseMove(handler: (x: number, y: number) => void): void {
    this.mouseMoveHandlers.push(handler);
  }

  // 輸入查詢
  isKeyPressed(code: string): boolean {
    return this.input.keys[code] ?? false;
  }

  getMouseX(): number {
    return this.input.mouseX;
  }

  getMouseY(): number {
    return this.input.mouseY;
  }

  getWorldMouseX(): number {
    return this.input.worldMouseX;
  }

  getWorldMouseY(): number {
    return this.input.worldMouseY;
  }

  setWorldMousePos(x: number, y: number): void {
    this.input.worldMouseX = x;
    this.input.worldMouseY = y;
  }

  isMouseDown(): boolean {
    return this.input.mouseDown;
  }

  getInputState(): Readonly<InputState> {
    return Object.freeze({ ...this.input });
  }
}

// 全域輸入管理器實例
export const inputManager = new InputManager();
