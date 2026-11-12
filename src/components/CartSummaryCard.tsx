/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { calculateCart, PRODUCTS, UPSELL_PRODUCT } from '../data/offerEngine';
import { Check, ShieldCheck, Truck, Package } from 'lucide-react';

interface CartSummaryCardProps {
  isApproved: boolean;
  onApprove: () => void;
  isApproveTapped?: boolean;
}

export const CartSummaryCard: React.FC<CartSummaryCardProps> = ({
  isApproved,
  onApprove,
  isApproveTapped = false,
}) => {
  const cart = calculateCart(true, true);
  const shoe = PRODUCTS[0];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-bold text-slate-900">Order Summary</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>NTO Member Savings Applied</span>
        </div>
      </div>

      <div className="p-4 space-y-3.5">
        {/* Item 1: Trailridge Mid */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 p-0.5 shrink-0 flex items-center justify-center">
              <img
                src={shoe.image}
                alt={shoe.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{shoe.name}</p>
              <p className="text-[11px] text-slate-500">Size {shoe.size} · Arrives {shoe.arrival}</p>
            </div>
          </div>
          <span className="font-semibold text-slate-900 tabular-nums">
            ${cart.shoePrice}
          </span>
        </div>

        {/* Item 2: NTO Merino Trail Socks */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 p-0.5 shrink-0 flex items-center justify-center">
              <img
                src={UPSELL_PRODUCT.image}
                alt={UPSELL_PRODUCT.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <div>
              <p className="font-semibold text-slate-900">{UPSELL_PRODUCT.name}</p>
              <p className="text-[11px] text-slate-500">2-pack trail bundle</p>
            </div>
          </div>
          <span className="font-semibold text-slate-900 tabular-nums">
            ${cart.socksOriginalPrice}
          </span>
        </div>

        {/* Item 3: Kit offer discount */}
        <div className="flex items-center justify-between text-xs text-emerald-700 pt-1 border-t border-dashed border-slate-200">
          <span className="font-medium">
            Complete your kit, 20% off socks
          </span>
          <span className="font-semibold tabular-nums">
            -${cart.socksDiscount}
          </span>
        </div>

        {/* Item 4: Shipping discount */}
        <div className="flex items-center justify-between text-xs text-slate-700">
          <span className="flex items-center gap-1 font-medium">
            <Truck className="w-3.5 h-3.5 text-blue-600" />
            Shipping, free over $100
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 line-through tabular-nums text-[11px]">
              ${cart.originalDeliveryCost}
            </span>
            <span className="font-semibold text-emerald-700">Free</span>
          </div>
        </div>

        {/* Total line */}
        <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
          <div>
            <span className="text-sm font-semibold text-slate-600">Total</span>
            <p className="text-[11px] text-slate-400">All discounts and free shipping included</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-slate-900 tabular-nums tracking-tight">
              ${cart.finalTotal}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
