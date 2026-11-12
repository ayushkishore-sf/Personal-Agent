/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PRODUCTS, OFFER_CARDS, calculateCart } from '../data/offerEngine';
import { Check, Sparkles, Truck, Plus, CheckCircle2, Flag } from 'lucide-react';

interface ActiveOfferCardProps {
  hasSocks: boolean;
  onAddSocks: () => void;
  isAddSocksTapped?: boolean;
}

export const ActiveOfferCard: React.FC<ActiveOfferCardProps> = ({
  hasSocks,
  onAddSocks,
  isAddSocksTapped = false,
}) => {
  const shoe = PRODUCTS[0];
  const cart = calculateCart(true, hasSocks);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
      {/* Header Banner - Member unlocked */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>NTO Exclusives Unlocked</span>
        </div>
        <span className="text-[11px] opacity-90 bg-emerald-700/50 px-2 py-0.5 rounded-full">
          Alex Morgan
        </span>
      </div>

      <div className="p-3.5 sm:p-4 space-y-2.5 sm:space-y-3">
        {/* Floating Toast Notification when Free Shipping is unlocked */}
        {hasSocks && (
          <div className="bg-emerald-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between shadow-md border border-emerald-700/80 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Free shipping unlocked. You saved $8.</span>
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-800 text-emerald-200 px-2 py-0.5 rounded-full">
              Friday delivery
            </span>
          </div>
        )}

        {/* Product Line */}
        <div className="flex items-center gap-3 pb-2.5 border-b border-slate-100">
          <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0 flex items-center justify-center">
            <img
              src={shoe.image}
              alt={shoe.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {shoe.name}
              </h4>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                ${shoe.price}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mt-0.5">
              Northern Trail Outfitters · Size {shoe.size}
            </p>

            <div className="flex items-center gap-3 mt-1 text-xs">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                {hasSocks ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span>Delivery</span>
                    <span className="line-through text-slate-400 font-normal">$8</span>
                    <span className="font-bold text-emerald-700">Free</span>
                  </span>
                ) : (
                  <span className="text-slate-600">Delivery ${shoe.deliveryCost}</span>
                )}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600">Arrives {shoe.arrival}</span>
            </div>
          </div>
        </div>

        {/* Bundle Offer Section */}
        <div className="space-y-2.5">
          {/* Bundle Offer Header */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 min-w-0">
              {/* Small shoe thumbnail with plus sign next to title */}
              <div className="flex items-center shrink-0">
                <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-200 p-0.5 flex items-center justify-center shrink-0">
                  <img
                    src={shoe.image}
                    alt={shoe.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <span className="text-slate-500 font-bold text-xs ml-1 mr-0.5">+</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                Gear Up for the Trail: Complete your hiking kit
              </h4>
            </div>
            <p className="text-[11px] text-slate-600 pl-7">
              Add any item and get 20% off each
            </p>
          </div>

          {/* Three Kit Offer Cards (Fitted 3-column grid without scrolling) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-2.5 w-full">
            {OFFER_CARDS.map((card) => {
              const isCardSocks = card.isUpsellForCart;
              return (
                <div
                  key={card.id}
                  className={`rounded-xl p-2 sm:p-2.5 border transition-all duration-300 flex flex-col justify-between ${
                    isCardSocks && hasSocks
                      ? 'bg-emerald-50/70 border-emerald-200 shadow-xs ring-1 ring-emerald-300/50'
                      : 'bg-slate-50/70 hover:bg-slate-50 border-slate-200/90 shadow-2xs'
                  }`}
                >
                  <div>
                    {/* Badge as hero & Kit offer label - Centered */}
                    <div className="w-full flex flex-col items-center justify-center gap-0.5">
                      <span className="text-[9.5px] sm:text-[10px] font-extrabold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded-md border border-emerald-300/80 tracking-tight inline-block shadow-2xs text-center">
                        {card.badge}
                      </span>
                      <span className="text-[8.5px] sm:text-[9px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1 py-0.5 rounded border border-amber-200/70 inline-block text-center">
                        Kit offer
                      </span>
                    </div>

                    {/* Product visual - Enlarged & Crisp */}
                    <div className="w-full h-18 sm:h-20 rounded-lg bg-white p-1 border border-slate-200/80 mx-auto my-1 flex items-center justify-center shadow-2xs overflow-hidden">
                      <img
                        src={card.image}
                        alt={card.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain mix-blend-multiply transition-transform duration-200 hover:scale-105"
                      />
                    </div>

                    {/* Product name - Smaller text */}
                    <h5 className="text-[10px] sm:text-[10.5px] font-semibold text-slate-700 leading-tight line-clamp-1 min-h-[15px]">
                      {card.name}
                    </h5>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-[9.5px] sm:text-[10px] text-slate-400 line-through tabular-nums">
                        ${card.originalPrice}
                      </span>
                      <span className="text-xs sm:text-xs font-bold text-emerald-700 tabular-nums">
                        ${card.offerPrice}
                      </span>
                    </div>

                    {/* + Free shipping tag under price */}
                    <div className="mt-0.5">
                      <span className="text-[8.5px] sm:text-[9px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200/80 inline-flex items-center gap-0.5">
                        <span className="font-bold text-emerald-500">+</span> Free shipping
                      </span>
                    </div>
                  </div>

                  {/* Add action button - White background with border when unadded */}
                  <div className="mt-2">
                    {isCardSocks ? (
                      <button
                        type="button"
                        onClick={onAddSocks}
                        disabled={hasSocks}
                        className={`w-full py-1.5 px-2 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          hasSocks
                            ? 'bg-emerald-600 text-white shadow-xs cursor-default'
                            : isAddSocksTapped
                            ? 'bg-slate-100 text-slate-800 scale-95 border border-slate-300'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs active:scale-95'
                        }`}
                      >
                        {hasSocks ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-slate-500" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="w-full py-1.5 px-2 rounded-lg text-[11px] sm:text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-2xs flex items-center justify-center gap-1 transition-all cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5 text-slate-500" />
                        <span>Add</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FREE SHIPPING MILESTONE BRIDGE (Visual & easy to understand) */}
          <div
            className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-500 ${
              hasSocks
                ? 'bg-gradient-to-br from-emerald-50/90 via-teal-50/60 to-emerald-50/90 border-emerald-300 shadow-xs'
                : 'bg-gradient-to-br from-slate-50 via-slate-50/90 to-blue-50/40 border-slate-200/90 shadow-2xs'
            }`}
          >
            {/* Header: Value Proposition & Badge */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/70">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all shrink-0 ${
                    hasSocks
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      {hasSocks ? 'Free Friday Delivery Unlocked' : 'Free Delivery on Orders Over $100'}
                    </span>
                    <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded border border-emerald-300/80">
                      SAVE $8
                    </span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 mt-0.5">
                    {hasSocks
                      ? 'Your order crossed $100 — standard $8 shipping is now completely free.'
                      : 'Your cart is at $95. Add any kit item above to instantly cross $100.'}
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="shrink-0">
                {hasSocks ? (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-lg border border-emerald-300 shadow-2xs">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Unlocked</span>
                  </div>
                ) : (
                  <div className="text-[11px] font-bold text-slate-800 bg-white px-2 py-0.5 rounded-lg border border-slate-200 shadow-2xs">
                    Only $5 away
                  </div>
                )}
              </div>
            </div>

            {/* Visual 3-Stage Milestone Bridge */}
            <div className="pt-2">
              <div className="grid grid-cols-11 items-center gap-1.5 sm:gap-2">
                {/* Stage 1: Shoe in Cart ($95) */}
                <div className="col-span-4 bg-white rounded-lg p-2 border border-slate-200/90 shadow-2xs flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-slate-50 p-0.5 shrink-0 border border-slate-100 flex items-center justify-center">
                    <img
                      src={shoe.image}
                      alt={shoe.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] text-slate-500 font-medium truncate">Shoe in cart</div>
                    <div className="text-xs font-bold text-slate-900">$95.00</div>
                  </div>
                </div>

                {/* Bridge Connector (+ Any Kit Item) */}
                <div className="col-span-3 flex flex-col items-center justify-center px-0.5">
                  <div className="w-full h-1.5 rounded-full relative bg-slate-200 overflow-visible">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        hasSocks ? 'w-full bg-emerald-500' : 'w-1/2 bg-blue-600'
                      }`}
                    />
                    <div
                      className={`absolute -top-2 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold shadow-2xs border transition-colors ${
                        hasSocks
                          ? 'bg-emerald-600 text-white border-emerald-400'
                          : 'bg-white text-slate-700 border-slate-300'
                      }`}
                    >
                      {hasSocks ? '✓' : '+'}
                    </div>
                  </div>
                  <span
                    className={`text-[9.5px] sm:text-[10px] font-bold mt-2 text-center leading-tight ${
                      hasSocks ? 'text-emerald-700' : 'text-slate-600'
                    }`}
                  >
                    {hasSocks ? 'Socks added' : 'Add any kit item'}
                  </span>
                </div>

                {/* Stage 2: Free Shipping Threshold ($100+) */}
                <div
                  className={`col-span-4 rounded-lg p-2 border transition-all shadow-2xs flex items-center gap-2 ${
                    hasSocks
                      ? 'bg-emerald-600 text-white border-emerald-700'
                      : 'bg-white border-dashed border-slate-300 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                      hasSocks ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {hasSocks ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Truck className="w-4 h-4 text-slate-600" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`text-[10px] font-medium leading-tight ${
                        hasSocks ? 'text-emerald-100' : 'text-slate-500'
                      }`}
                    >
                      {hasSocks ? 'Goal met ($115)' : 'Free Shipping ($100)'}
                    </div>
                    <div className="text-xs font-bold flex items-center gap-1">
                      <span className={hasSocks ? 'text-emerald-100' : 'text-slate-600'}>Delivery:</span>
                      <span
                        className={`line-through font-normal text-[10px] ${
                          hasSocks ? 'text-emerald-200' : 'text-slate-400'
                        }`}
                      >
                        $8
                      </span>
                      <span
                        className={`font-black ${
                          hasSocks ? 'text-amber-200' : 'text-emerald-700'
                        }`}
                      >
                        FREE
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payoff line with combined savings breakdown */}
              <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1.5">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      hasSocks ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                  />
                  <span>
                    {hasSocks ? 'Combined savings applied:' : 'Double savings bonus:'}
                  </span>
                </span>
                <span className="font-bold text-slate-900">
                  {hasSocks ? (
                    <span className="text-emerald-700">
                      Shoes + Socks for $115 · You saved $13 today
                    </span>
                  ) : (
                    <span>
                      Get 20% off kit item + Save $8 on shipping
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
