/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../data/offerEngine';
import { Lock, Sparkles, Check, Truck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isBestFit?: boolean;
  showTodayPrice?: boolean;
  isUnlocked?: boolean;
  onNudgeClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isBestFit = false,
  showTodayPrice = false,
  isUnlocked = false,
  onNudgeClick,
}) => {
  const todayPrice = product.price + product.deliveryCost;

  return (
    <div
      className={`relative flex flex-col bg-white rounded-2xl border transition-all duration-300 overflow-hidden shadow-xs shrink-0 w-[214px] sm:w-[220px] ${
        isBestFit
          ? 'border-slate-800 ring-2 ring-slate-800/10 shadow-md'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      {/* Best fit banner */}
      {isBestFit && (
        <div className="bg-slate-900 text-white text-[11px] font-semibold py-1 px-3 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-300" />
            Best fit
          </span>
          <span className="text-[10px] text-slate-300">Top recommendation</span>
        </div>
      )}

      {/* Product Image */}
      <div className="relative h-32 w-full bg-slate-50 flex items-center justify-center p-2 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-xs text-[10px] font-medium text-slate-600 px-2 py-0.5 rounded-md border border-slate-200/80">
          Size {product.size}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
            {product.brand}
          </p>
          <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
            {product.name}
          </h4>

          {/* Pricing baseline */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-base font-bold text-slate-900 tabular-nums">
              ${product.price}
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Truck className="w-3 h-3 text-slate-400" />
              Delivery ${product.deliveryCost}
            </span>
          </div>

          {/* Today's price breakdown for Best fit */}
          {showTodayPrice && (
            <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px]">Your price today:</span>
              <span className="font-bold text-slate-900 tabular-nums text-xs">
                ${todayPrice}
              </span>
            </div>
          )}

          {/* Arrival info */}
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Arrives {product.arrival}
          </p>
        </div>

        {/* Nudge if Trailridge Mid */}
        {product.hasNudge && (
          <div className="mt-1 pt-1.5 border-t border-slate-100">
            {isUnlocked ? (
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>NTO account linked · Offers unlocked</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onNudgeClick}
                className="w-full p-2 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/80 text-left flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-1.5 text-[11px] text-blue-900 font-medium">
                  <Lock className="w-3 h-3 text-blue-600 shrink-0" />
                  <span>Sign in to unlock more offers</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
