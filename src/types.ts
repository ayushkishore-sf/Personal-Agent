/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StoryStep = 1 | 2 | 3 | 4 | 5;

export type MessageSender = 'shopper' | 'agent' | 'system';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text?: string;
  timestamp: string;
  stepOrigin: StoryStep;
  // Custom payloads for rich message attachments
  type?: 'text' | 'greeting' | 'products-carousel' | 'explain-pick' | 'offers-overview' | 'cart-summary';
}
