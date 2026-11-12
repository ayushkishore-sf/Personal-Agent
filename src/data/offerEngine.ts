/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  brand: string;
  brandShort?: string;
  price: number;
  deliveryCost: number;
  size: number;
  arrival: string;
  description: string;
  image: string;
  hasNudge?: boolean;
}

export interface UpsellProduct {
  id: string;
  name: string;
  brand: string;
  originalPrice: number;
  offerPrice: number;
  discountPercent: number;
  discountLabel: string;
  badge: string;
  image: string;
  why?: string;
}

export interface OfferCardItem {
  id: string;
  badge: string;
  name: string;
  brand: string;
  originalPrice: number;
  offerPrice: number;
  why: string;
  image: string;
  isUpsellForCart?: boolean;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  requiresAuth: boolean;
}

export interface CartCalculation {
  shoePrice: number;
  socksOriginalPrice: number;
  socksDiscount: number;
  socksFinalPrice: number;
  hasSocks: boolean;
  isSignedIn: boolean;
  deliveryCost: number;
  originalDeliveryCost: number;
  isShippingFree: boolean;
  threshold: number;
  amountAwayFromFreeShipping: number;
  freeShippingProgress: number; // 0 to 100
  subtotalBeforeDiscounts: number;
  totalDiscount: number;
  finalTotal: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'trailridge-mid',
    name: 'Trailridge Mid',
    brand: 'Northern Trail Outfitters',
    brandShort: 'NTO',
    price: 95,
    deliveryCost: 8,
    size: 10,
    arrival: 'Friday',
    description: 'Waterproof hiking shoe with strong grip',
    image: '/src/assets/images/shoe_trailridge_mid_1794397797984.jpg',
    hasNudge: true,
  },
  {
    id: 'summit-trek',
    name: 'Summit Trek',
    brand: 'Cloud Kicks',
    price: 130,
    deliveryCost: 10,
    size: 10,
    arrival: 'Friday',
    description: 'Lightweight breathable trail hiker',
    image: '/src/assets/images/shoe_summit_trek_1794397799144.jpg',
    hasNudge: false,
  },
  {
    id: 'ridge-hiker',
    name: 'Ridge Hiker',
    brand: 'Ridgeline Gear',
    price: 110,
    deliveryCost: 9,
    size: 10,
    arrival: 'Friday',
    description: 'All-terrain leather trail shoe',
    image: '/src/assets/images/shoe_ridge_hiker_1794397799409.jpg',
    hasNudge: false,
  },
];

export const UPSELL_PRODUCT: UpsellProduct = {
  id: 'nto-merino-socks',
  name: 'NTO Merino Trail Socks, 2 pack',
  brand: 'Northern Trail Outfitters',
  originalPrice: 25,
  offerPrice: 20,
  discountPercent: 20,
  discountLabel: '20% off with Trailridge Mid',
  badge: '20% OFF',
  image: '/src/assets/images/socks_nto_merino_1794397799674.jpg',
  why: 'Break in new hiking shoes with proper socks.',
};

export const BUNDLE_OFFER = {
  id: 'complete-hiking-kit',
  title: 'Gear Up for the Trail: Complete your hiking kit',
  offerLine: 'Add any item and get 20% off each',
  tiedToProductId: 'trailridge-mid',
};

export const OFFER_CARDS: OfferCardItem[] = [
  {
    id: 'card-socks',
    badge: '20% OFF',
    name: 'NTO Merino Trail Socks, 2 pack',
    brand: 'Northern Trail Outfitters',
    originalPrice: 25,
    offerPrice: 20,
    why: 'Break in new hiking shoes with proper socks.',
    image: '/src/assets/images/socks_nto_merino_1794397799674.jpg',
    isUpsellForCart: true,
  },
  {
    id: 'card-bottle',
    badge: '20% OFF',
    name: 'NTO Trail Bottle, 1 liter',
    brand: 'Northern Trail Outfitters',
    originalPrice: 20,
    offerPrice: 16,
    why: 'Fits the side pocket of your Trail Daypack.',
    image: '/src/assets/images/bottle_nto_trail_1794408678619.jpg',
  },
  {
    id: 'card-rain-cover',
    badge: '20% OFF',
    name: 'NTO Daypack Rain Cover',
    brand: 'Northern Trail Outfitters',
    originalPrice: 30,
    offerPrice: 24,
    why: 'Made for your Trail Daypack.',
    image: '/src/assets/images/rain_cover_nto_1794408691834.jpg',
  },
];

export const OFFERS = {
  bundleOffer: {
    id: 'complete-hiking-kit',
    title: 'Gear Up for the Trail: Complete your hiking kit',
    offerLine: 'Add any item and get 20% off each',
    description: 'Bundle discount tied to Trailridge Mid. Socks 20% off, Bottle 20% off, Rain Cover 20% off.',
    requiresAuth: true,
  },
  freeShipping: {
    id: 'free-shipping',
    title: 'Free shipping on orders over $100',
    threshold: 100,
    requiresAuth: true,
  },
};

export const FREE_SHIPPING_THRESHOLD = 100;

export function calculateCart(isSignedIn: boolean, hasSocks: boolean): CartCalculation {
  const shoe = PRODUCTS[0]; // Trailridge Mid ($95)
  const shoePrice = shoe.price;
  const originalDeliveryCost = shoe.deliveryCost;

  if (!isSignedIn) {
    // Guest price for the Trailridge Mid: $95 plus $8 delivery equals $103
    return {
      shoePrice,
      socksOriginalPrice: 0,
      socksDiscount: 0,
      socksFinalPrice: 0,
      hasSocks: false,
      isSignedIn: false,
      deliveryCost: originalDeliveryCost,
      originalDeliveryCost,
      isShippingFree: false,
      threshold: FREE_SHIPPING_THRESHOLD,
      amountAwayFromFreeShipping: 5,
      freeShippingProgress: 95,
      subtotalBeforeDiscounts: shoePrice,
      totalDiscount: 0,
      finalTotal: shoePrice + originalDeliveryCost, // $103
    };
  }

  if (!hasSocks) {
    // Signed in with only the shoes: Cart $95, which is $5 away from free shipping. Delivery $8, Total $103
    const amountAway = FREE_SHIPPING_THRESHOLD - shoePrice; // 100 - 95 = 5
    const progress = Math.min(100, (shoePrice / FREE_SHIPPING_THRESHOLD) * 100); // 95%
    return {
      shoePrice,
      socksOriginalPrice: 0,
      socksDiscount: 0,
      socksFinalPrice: 0,
      hasSocks: false,
      isSignedIn: true,
      deliveryCost: originalDeliveryCost,
      originalDeliveryCost,
      isShippingFree: false,
      threshold: FREE_SHIPPING_THRESHOLD,
      amountAwayFromFreeShipping: amountAway,
      freeShippingProgress: progress,
      subtotalBeforeDiscounts: shoePrice,
      totalDiscount: 0,
      finalTotal: shoePrice + originalDeliveryCost, // $103
    };
  }

  // Signed in with shoes and socks:
  // Shoes $95 plus Socks $25, minus $5 kit offer discount (20% off socks) = $115.
  // Over $100 threshold, so shipping is free. Final Total $115.
  const socksOriginal = UPSELL_PRODUCT.originalPrice; // $25
  const socksDiscount = UPSELL_PRODUCT.originalPrice - UPSELL_PRODUCT.offerPrice; // $5
  const socksFinal = UPSELL_PRODUCT.offerPrice; // $20
  const subtotalAfterDiscounts = shoePrice + socksFinal; // $115
  const isShippingFree = subtotalAfterDiscounts >= FREE_SHIPPING_THRESHOLD;
  const deliveryCost = isShippingFree ? 0 : originalDeliveryCost;
  const finalTotal = subtotalAfterDiscounts + deliveryCost; // $115

  return {
    shoePrice,
    socksOriginalPrice: socksOriginal,
    socksDiscount,
    socksFinalPrice: socksFinal,
    hasSocks: true,
    isSignedIn: true,
    deliveryCost,
    originalDeliveryCost,
    isShippingFree,
    threshold: FREE_SHIPPING_THRESHOLD,
    amountAwayFromFreeShipping: 0,
    freeShippingProgress: 100,
    subtotalBeforeDiscounts: shoePrice + socksOriginal, // $120
    totalDiscount: socksDiscount, // $5
    finalTotal, // $115
  };
}
