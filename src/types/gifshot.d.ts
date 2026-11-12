/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

declare module 'gifshot' {
  export interface GifOptions {
    images?: (string | HTMLImageElement | HTMLCanvasElement)[];
    video?: string[];
    gifWidth?: number;
    gifHeight?: number;
    interval?: number;
    numFrames?: number;
    frameDuration?: number;
    sampleInterval?: number;
    numWorkers?: number;
    progressCallback?: (captureProgress: number) => void;
  }

  export interface GifResult {
    error: boolean;
    errorCode: string;
    errorMsg: string;
    image: string; // base64 data URL
  }

  export function createGIF(
    options: GifOptions,
    callback: (obj: GifResult) => void
  ): void;

  export function isSupported(): boolean;
}
