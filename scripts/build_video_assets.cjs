/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { Resvg } = require('@resvg/resvg-js');

// Ensure directories
const publicDir = path.resolve(__dirname, '../public');
const tempDir = path.resolve(__dirname, '../.temp_frames');
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// Load product images as base64
const imgDir = path.resolve(__dirname, '../src/assets/images');
function getBase64Img(filenamePart) {
  const files = fs.readdirSync(imgDir);
  const found = files.find(f => f.includes(filenamePart) && f.endsWith('.jpg'));
  if (!found) return '';
  const buf = fs.readFileSync(path.join(imgDir, found));
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

const shoeTrailridge = getBase64Img('shoe_trailridge_mid');
const shoeSummit = getBase64Img('shoe_summit_trek');
const shoeRidge = getBase64Img('shoe_ridge_hiker');
const socksNto = getBase64Img('socks_nto_merino');
const bottleNto = getBase64Img('bottle_nto_trail');
const rainCoverNto = getBase64Img('rain_cover_nto');

// Canvas 1920x1080 (Full HD 16:9 Widescreen)
const W = 1920;
const H = 1080;

// Tablet layout coordinates
const tabW = 860;
const tabH = 960;
const tabX = Math.round((W - tabW) / 2); // 530
const tabY = Math.round((H - tabH) / 2); // 60

// Screen coordinates inside tablet
const pad = 14;
const scrX = tabX + pad; // 544
const scrY = tabY + pad; // 74
const scrW = tabW - pad * 2; // 832
const scrH = tabH - pad * 2; // 932

function generateFrameSvg(step) {
  const isSignedIn = step >= 3;
  const hasSocks = step >= 4;
  const isApproved = step >= 5;

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#dbeafe" />
      <stop offset="45%" stop-color="#f0fdf4" />
      <stop offset="100%" stop-color="#e0e7ff" />
    </linearGradient>

    <!-- Tablet Bezel Hardware Gradient -->
    <linearGradient id="bezelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#242833" />
      <stop offset="100%" stop-color="#15171d" />
    </linearGradient>

    <!-- Green Member Banner Gradient -->
    <linearGradient id="greenBanner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#059669" />
      <stop offset="100%" stop-color="#0d9488" />
    </linearGradient>

    <!-- Tablet Drop Shadow -->
    <filter id="tabletShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="24" stdDeviation="30" flood-color="#0f172a" flood-opacity="0.28" />
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#0f172a" flood-opacity="0.15" />
    </filter>

    <!-- Card Shadow -->
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#0f172a" flood-opacity="0.06" />
    </filter>

    <!-- Screen Clip Path -->
    <clipPath id="screenClip">
      <rect x="${scrX}" y="${scrY}" width="${scrW}" height="${scrH}" rx="28" />
    </clipPath>
  </defs>

  <style>
    text {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
  </style>

  <!-- 1. Outer Background -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)" />

  <!-- 2. Tablet Shell with hardware bezel -->
  <rect x="${tabX}" y="${tabY}" width="${tabW}" height="${tabH}" rx="40" fill="url(#bezelGrad)" stroke="#334155" stroke-width="2" filter="url(#tabletShadow)" />
  
  <!-- Tablet Camera Lens -->
  <circle cx="${W / 2}" cy="${tabY + 8}" r="3.5" fill="#0b0f19" stroke="#1e293b" stroke-width="1" />

  <!-- 3. Inner Screen Display (Clipped) -->
  <g clip-path="url(#screenClip)">
    <rect x="${scrX}" y="${scrY}" width="${scrW}" height="${scrH}" fill="#F8FAFC" />

    <!-- Status Bar -->
    <rect x="${scrX}" y="${scrY}" width="${scrW}" height="38" fill="#FFFFFF" />
    <line x1="${scrX}" y1="${scrY + 38}" x2="${scrX + scrW}" y2="${scrY + 38}" stroke="#F1F5F9" stroke-width="1" />
    
    <text x="${scrX + 24}" y="${scrY + 24}" font-size="12" font-weight="700" fill="#0F172A">9:41</text>
    <text x="${scrX + 58}" y="${scrY + 24}" font-size="12" font-weight="500" fill="#94A3B8">|  Wed Nov 11</text>
    
    <!-- Status icons right -->
    <g transform="translate(${scrX + scrW - 105}, ${scrY + 14})">
      <!-- Signal bars -->
      <rect x="0" y="8" width="2" height="4" rx="0.5" fill="#334155" />
      <rect x="4" y="6" width="2" height="6" rx="0.5" fill="#334155" />
      <rect x="8" y="3" width="2" height="9" rx="0.5" fill="#334155" />
      <rect x="12" y="1" width="2" height="11" rx="0.5" fill="#334155" />
      <!-- Wifi -->
      <path d="M 24 11 A 5 5 0 0 1 32 11 M 22 8 A 8 8 0 0 1 34 8 M 20 5 A 11 11 0 0 1 36 5" stroke="#334155" stroke-width="1.4" stroke-linecap="round" fill="none" />
      <!-- Battery -->
      <text x="44" y="11" font-size="11" font-weight="700" fill="#334155">92%</text>
      <rect x="70" y="2" width="20" height="10" rx="2.5" fill="none" stroke="#334155" stroke-width="1.2" />
      <rect x="72" y="4" width="14" height="6" rx="1" fill="#334155" />
      <rect x="90" y="5" width="1.5" height="4" rx="0.5" fill="#334155" />
    </g>

    <!-- Chat Header -->
    <rect x="${scrX}" y="${scrY + 38}" width="${scrW}" height="60" fill="#FFFFFF" />
    <line x1="${scrX}" y1="${scrY + 98}" x2="${scrX + scrW}" y2="${scrY + 98}" stroke="#E2E8F0" stroke-width="1" />
    
    <!-- Sparkle Agent Icon -->
    <rect x="${scrX + 24}" y="${scrY + 50}" width="36" height="36" rx="10" fill="#0F172A" />
    <text x="${scrX + 42}" y="${scrY + 74}" font-size="16" font-weight="800" fill="#FBBF24" text-anchor="middle">✦</text>
    <circle cx="${scrX + 57}" cy="${scrY + 83}" r="4" fill="#10B981" stroke="#FFFFFF" stroke-width="1.5" />

    <text x="${scrX + 70}" y="${scrY + 66}" font-size="14" font-weight="700" fill="#0F172A">Personal Agent</text>
    <text x="${scrX + 70}" y="${scrY + 81}" font-size="11" font-weight="600" fill="#059669">Online</text>

    <!-- Header badges right -->
    ${hasSocks ? `
      <g transform="translate(${scrX + scrW - 240}, ${scrY + 53})">
        <rect width="125" height="30" rx="15" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
        <text x="62" y="19" font-size="10" font-weight="700" fill="#065F46" text-anchor="middle">You saved $13 today</text>
      </g>
      <rect x="${scrX + scrW - 105}" y="${scrY + 53}" width="80" height="30" rx="15" fill="#0F172A" />
      <text x="${scrX + scrW - 65}" y="${scrY + 72}" font-size="11" font-weight="700" fill="#F8FAFC" text-anchor="middle">🛍 2 items</text>
    ` : ''}

    ${isSignedIn ? `
      <rect x="${scrX + scrW - (hasSocks ? 335 : 110)}" y="${scrY + 53}" width="90" height="30" rx="15" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1" />
      <text x="${scrX + scrW - (hasSocks ? 290 : 65)}" y="${scrY + 72}" font-size="11" font-weight="700" fill="#065F46" text-anchor="middle">✓ Alex · NTO</text>
    ` : `
      <rect x="${scrX + scrW - 88}" y="${scrY + 53}" width="68" height="30" rx="15" fill="#F1F5F9" />
      <text x="${scrX + scrW - 54}" y="${scrY + 72}" font-size="11" font-weight="600" fill="#64748B" text-anchor="middle">Guest</text>
    `}

    <!-- Conversation Bubbles based on Step -->
    ${step <= 2 ? `
      <!-- Faded Initial Greeting -->
      <g transform="translate(${scrX + (scrW - 170) / 2}, ${scrY + 112})">
        <rect width="170" height="24" rx="12" fill="#F1F5F9" />
        <text x="85" y="16" font-size="11" font-weight="500" fill="#94A3B8" text-anchor="middle">Hi Alex. How can I help you?</text>
      </g>

      <!-- Shopper Speech Bubble (Right-aligned) -->
      <g transform="translate(${scrX + scrW - 545}, ${scrY + 148})">
        <rect width="525" height="46" rx="18" fill="#0F172A" filter="url(#cardShadow)" />
        <text x="20" y="28" font-size="13" font-weight="500" fill="#FFFFFF">I have a hiking trip in 4 days and need good hiking shoes. Size 10. They must reach me by Friday.</text>
      </g>

      <!-- Agent Speech Bubble (Left-aligned) -->
      <g transform="translate(${scrX + 24}, ${scrY + 206})">
        <circle cx="15" cy="18" r="15" fill="#0F172A" />
        <text x="15" y="22" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">PA</text>
        <rect x="40" y="0" width="460" height="40" rx="16" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#cardShadow)" />
        <text x="58" y="25" font-size="13" font-weight="500" fill="#1E293B">I found three hiking shoes in size 10 that can reach you by Friday.</text>
      </g>
    ` : step === 3 || step === 4 ? `
      <!-- Agent Step 3/4 Intro Bubble -->
      <g transform="translate(${scrX + 24}, ${scrY + 100})">
        <circle cx="15" cy="18" r="15" fill="#0F172A" />
        <text x="15" y="22" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">PA</text>
        <rect x="40" y="0" width="744" height="42" rx="14" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#cardShadow)" />
        <text x="58" y="18" font-size="11.5" font-weight="500" fill="#1E293B">You are signed in, Alex. NTO has a complete your kit offer with your Trailridge Mid. Add any of these items and save.</text>
        <text x="58" y="33" font-size="11.5" font-weight="500" fill="#1E293B">The merino socks are 20% off, and adding them also gets you free shipping. Bottle and rain cover are 20% off.</text>
      </g>
    ` : `
      <!-- Agent Step 5 Intro Bubble -->
      <g transform="translate(${scrX + 24}, ${scrY + 100})">
        <circle cx="15" cy="18" r="15" fill="#0F172A" />
        <text x="15" y="22" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">PA</text>
        <rect x="40" y="0" width="744" height="42" rx="14" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#cardShadow)" />
        <text x="58" y="26" font-size="12" font-weight="500" fill="#1E293B">Your total is $115 for the shoes and the socks, delivered Friday.</text>
      </g>
    `}

    <!-- DYNAMIC MAIN CONTENT BY STEP -->
    ${step === 1 ? renderStep1Content() : ''}
    ${step === 2 ? renderStep2Content() : ''}
    ${step === 3 ? renderStep3Content() : ''}
    ${step === 4 ? renderStep4Content() : ''}
    ${step === 5 ? renderStep5Content() : ''}

    <!-- Bottom Input Bar -->
    <g transform="translate(${scrX}, ${scrY + scrH - 74})">
      <rect width="${scrW}" height="74" fill="#FFFFFF" />
      <line x1="0" y1="0" x2="${scrW}" y2="0" stroke="#E2E8F0" stroke-width="1" />
      <rect x="24" y="15" width="${scrW - 48}" height="44" rx="22" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" />
      
      <!-- Plus button -->
      <circle cx="46" cy="37" r="15" fill="#E2E8F0" />
      <text x="46" y="42" font-size="18" font-weight="400" fill="#64748B" text-anchor="middle">+</text>
      
      <!-- Placeholder text -->
      <text x="75" y="42" font-size="13" font-weight="400" fill="#94A3B8">Ask Personal Agent anything...</text>
      
      <!-- Mic -->
      <circle cx="${scrW - 74}" cy="37" r="14" fill="#E2E8F0" />
      <text x="${scrW - 74}" y="42" font-size="13" fill="#64748B" text-anchor="middle">🎤</text>
      
      <!-- Send button -->
      <circle cx="${scrW - 44}" cy="37" r="15" fill="#2563EB" />
      <text x="${scrW - 44}" y="42" font-size="13" font-weight="700" fill="#FFFFFF" text-anchor="middle">➤</text>
    </g>

    <!-- Bottom Home Indicator -->
    <rect x="${scrX + (scrW - 130) / 2}" y="${scrY + scrH - 8}" width="130" height="4" rx="2" fill="#CBD5E1" />
  </g>
</svg>
  `;
}

// --------------------------------------------------------------------------
// STEP 1: Three Product Cards
// --------------------------------------------------------------------------
function renderStep1Content() {
  const cardW = 246;
  const cardH = 390;
  const startY = scrY + 262;

  return `
    <g transform="translate(${scrX + 24}, ${startY})">
      <!-- Shoe 1: Trailridge Mid (Best Fit) -->
      <g transform="translate(0, 0)">
        <rect width="${cardW}" height="${cardH}" rx="18" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" filter="url(#cardShadow)" />
        <path d="M 0 18 Q 0 0 18 0 L ${cardW - 18} 0 Q ${cardW} 0 ${cardW} 18 L ${cardW} 32 L 0 32 Z" fill="#0F172A" />
        <text x="14" y="22" font-size="11" font-weight="800" fill="#FBBF24">✦ Best fit</text>
        <text x="${cardW - 14}" y="22" font-size="11" font-weight="500" fill="#94A3B8" text-anchor="end">Top recommendation</text>

        <rect x="0" y="32" width="${cardW}" height="145" fill="#F8FAFC" />
        <image href="${shoeTrailridge}" x="28" y="38" width="190" height="135" preserveAspectRatio="xMidYMid meet" />
        
        <rect x="14" y="44" width="56" height="20" rx="6" fill="#FFFFFF" fill-opacity="0.95" stroke="#CBD5E1" />
        <text x="42" y="58" font-size="10" font-weight="700" fill="#475569" text-anchor="middle">Size 10</text>
        
        <text x="16" y="200" font-size="10" font-weight="700" fill="#64748B" letter-spacing="0.5">NORTHERN TRAIL OUTFITTERS</text>
        <text x="16" y="222" font-size="16" font-weight="700" fill="#0F172A">Trailridge Mid</text>
        <text x="16" y="248" font-size="20" font-weight="800" fill="#0F172A">$95</text>
        <text x="64" y="246" font-size="12" font-weight="500" fill="#64748B">🚚 Delivery $8</text>
        
        <line x1="16" y1="262" x2="${cardW - 16}" y2="262" stroke="#E2E8F0" />
        <text x="16" y="280" font-size="11" font-weight="500" fill="#64748B">Your price today:</text>
        <text x="${cardW - 16}" y="280" font-size="13" font-weight="800" fill="#0F172A" text-anchor="end">$103</text>
        
        <circle cx="21" cy="298" r="3" fill="#10B981" />
        <text x="32" y="302" font-size="12" font-weight="500" fill="#64748B">Arrives Friday</text>

        <line x1="16" y1="318" x2="${cardW - 16}" y2="318" stroke="#F1F5F9" stroke-width="1" />
        <rect x="14" y="330" width="${cardW - 28}" height="42" rx="12" fill="#EFF6FF" stroke="#BFDBFE" />
        <text x="${cardW / 2}" y="356" font-size="11" font-weight="700" fill="#1E40AF" text-anchor="middle">🔒 Sign in to unlock more offers</text>
      </g>

      <!-- Shoe 2: Summit Trek -->
      <g transform="translate(268, 0)">
        <rect width="${cardW}" height="${cardH}" rx="18" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#cardShadow)" />
        <rect width="${cardW}" height="175" rx="18" fill="#F8FAFC" />
        <image href="${shoeSummit}" x="28" y="15" width="190" height="145" preserveAspectRatio="xMidYMid meet" />
        
        <rect x="14" y="14" width="56" height="20" rx="6" fill="#FFFFFF" fill-opacity="0.95" stroke="#CBD5E1" />
        <text x="42" y="28" font-size="10" font-weight="700" fill="#475569" text-anchor="middle">Size 10</text>
        
        <text x="16" y="202" font-size="10" font-weight="700" fill="#64748B" letter-spacing="0.5">CLOUD KICKS</text>
        <text x="16" y="226" font-size="16" font-weight="700" fill="#0F172A">Summit Trek</text>
        <text x="16" y="254" font-size="20" font-weight="800" fill="#0F172A">$130</text>
        <text x="74" y="252" font-size="12" font-weight="500" fill="#64748B">🚚 Delivery $10</text>
        
        <circle cx="21" cy="276" r="3" fill="#10B981" />
        <text x="32" y="280" font-size="12" font-weight="500" fill="#64748B">Arrives Friday</text>
      </g>

      <!-- Shoe 3: Ridge Hiker -->
      <g transform="translate(536, 0)">
        <rect width="${cardW}" height="${cardH}" rx="18" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#cardShadow)" />
        <rect width="${cardW}" height="175" rx="18" fill="#F8FAFC" />
        <image href="${shoeRidge}" x="28" y="15" width="190" height="145" preserveAspectRatio="xMidYMid meet" />
        
        <rect x="14" y="14" width="56" height="20" rx="6" fill="#FFFFFF" fill-opacity="0.95" stroke="#CBD5E1" />
        <text x="42" y="28" font-size="10" font-weight="700" fill="#475569" text-anchor="middle">Size 10</text>
        
        <text x="16" y="202" font-size="10" font-weight="700" fill="#64748B" letter-spacing="0.5">RIDGELINE GEAR</text>
        <text x="16" y="226" font-size="16" font-weight="700" fill="#0F172A">Ridge Hiker</text>
        <text x="16" y="254" font-size="20" font-weight="800" fill="#0F172A">$110</text>
        <text x="72" y="252" font-size="12" font-weight="500" fill="#64748B">🚚 Delivery $9</text>
        
        <circle cx="21" cy="276" r="3" fill="#10B981" />
        <text x="32" y="280" font-size="12" font-weight="500" fill="#64748B">Arrives Friday</text>
      </g>
    </g>
  `;
}

// --------------------------------------------------------------------------
// STEP 2: Agent Explanation + Touch ID Authentication Sheet
// --------------------------------------------------------------------------
function renderStep2Content() {
  const startY = scrY + 262;

  return `
    <!-- Top Best Fit Highlight Card -->
    <g transform="translate(${scrX + 24}, ${startY})">
      <rect width="250" height="260" rx="18" fill="#FFFFFF" stroke="#0F172A" stroke-width="2" filter="url(#cardShadow)" />
      <path d="M 0 18 Q 0 0 18 0 L 232 0 Q 250 0 250 18 L 250 32 L 0 32 Z" fill="#0F172A" />
      <text x="16" y="22" font-size="11" font-weight="800" fill="#FBBF24">✦ Best fit</text>
      <text x="234" y="22" font-size="11" font-weight="500" fill="#94A3B8" text-anchor="end">Top pick</text>

      <image href="${shoeTrailridge}" x="35" y="38" width="180" height="100" preserveAspectRatio="xMidYMid meet" />
      <text x="16" y="152" font-size="15" font-weight="700" fill="#0F172A">Trailridge Mid</text>
      <text x="16" y="170" font-size="11" font-weight="500" fill="#64748B">Waterproof hiking shoe with strong grip</text>

      <line x1="16" y1="184" x2="234" y2="184" stroke="#E2E8F0" />
      <text x="16" y="204" font-size="12" font-weight="500" fill="#64748B">Price $95 · Delivery $8</text>
      <text x="16" y="226" font-size="14" font-weight="800" fill="#0F172A">Your price today: $103</text>
      <text x="16" y="246" font-size="12" font-weight="600" fill="#10B981">● Arrives Friday</text>
    </g>

    <!-- Agent Speech Bubble with Sign In CTA -->
    <g transform="translate(${scrX + 300}, ${startY})">
      <circle cx="15" cy="18" r="15" fill="#0F172A" />
      <text x="15" y="22" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">PA</text>
      <rect x="40" y="0" width="465" height="140" rx="18" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#cardShadow)" />
      
      <text x="62" y="30" font-size="13" font-weight="500" fill="#1E293B">Trailridge Mid is the best fit for your trip. It is waterproof,</text>
      <text x="62" y="52" font-size="13" font-weight="500" fill="#1E293B">has strong grip on rocky trails, and arrives Friday.</text>
      <text x="62" y="74" font-size="13" font-weight="500" fill="#1E293B">NTO has more offers for signed in shoppers. Want to sign in to NTO?</text>

      <!-- Sign In Button -->
      <rect x="62" y="92" width="180" height="36" rx="10" fill="#0F172A" />
      <text x="152" y="115" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">🛡 Sign in to NTO  →</text>
    </g>

    <!-- Touch ID Slide-up Modal Overlay -->
    <g transform="translate(${scrX}, ${scrY})">
      <!-- Backdrop -->
      <rect width="${scrW}" height="${scrH}" fill="#0f172a" fill-opacity="0.45" />

      <!-- Modal Card -->
      <g transform="translate(${(scrW - 460) / 2}, ${scrH - 430})">
        <rect width="460" height="410" rx="28" fill="#FFFFFF" filter="url(#tabletShadow)" stroke="#E2E8F0" />
        
        <!-- Drag Handle -->
        <rect x="205" y="12" width="50" height="5" rx="2.5" fill="#CBD5E1" />

        <!-- NTO Badge -->
        <rect x="202" y="32" width="56" height="56" rx="16" fill="#0F172A" />
        <text x="230" y="67" font-size="18" font-weight="800" fill="#FFFFFF" text-anchor="middle">NTO</text>

        <!-- Sheet Title -->
        <text x="230" y="112" font-size="16" font-weight="800" fill="#0F172A" text-anchor="middle">Sign in to Northern Trail Outfitters</text>
        <text x="230" y="132" font-size="12" font-weight="500" fill="#64748B" text-anchor="middle">Share your NTO account to unlock member offers.</text>

        <!-- Member profile box -->
        <rect x="36" y="152" width="388" height="46" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
        <circle cx="62" cy="175" r="14" fill="#D1FAE5" />
        <text x="62" y="180" font-size="12" font-weight="800" fill="#065F46" text-anchor="middle">A</text>
        <text x="86" y="170" font-size="12" font-weight="700" fill="#0F172A">Alex Morgan</text>
        <text x="86" y="186" font-size="10" font-weight="500" fill="#64748B">NTO Trailhead Member · #84920</text>
        <rect x="340" y="165" width="70" height="20" rx="10" fill="#ECFDF5" />
        <text x="375" y="179" font-size="10" font-weight="700" fill="#059669" text-anchor="middle">✓ Verified</text>

        <!-- Touch ID Fingerprint Icon with glow -->
        <circle cx="230" cy="245" r="34" fill="#ECFDF5" stroke="#10B981" stroke-width="2.5" />
        <text x="230" y="254" font-size="28" fill="#059669" text-anchor="middle">👆</text>
        <text x="230" y="296" font-size="12" font-weight="700" fill="#059669" text-anchor="middle">Touch ID authenticated</text>

        <!-- Sign In Button -->
        <rect x="36" y="322" width="388" height="46" rx="14" fill="#059669" />
        <text x="230" y="350" font-size="14" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓ Signed In with Touch ID</text>
      </g>
    </g>
  `;
}

// --------------------------------------------------------------------------
// STEP 3: Active Offers Card (NTO Exclusives Unlocked)
// --------------------------------------------------------------------------
function renderStep3Content() {
  return renderActiveOfferSection(false);
}

// --------------------------------------------------------------------------
// STEP 4: Socks Added & Free Shipping Unlocked
// --------------------------------------------------------------------------
function renderStep4Content() {
  return renderActiveOfferSection(true);
}

function renderActiveOfferSection(socksAdded) {
  const startY = scrY + 148;
  const cardW = 784;

  return `
    <g transform="translate(${scrX + 24}, ${startY})">
      <!-- Main Active Offer Card -->
      <rect width="${cardW}" height="364" rx="18" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#cardShadow)" />
      
      <!-- Top Banner: NTO Exclusives Unlocked -->
      <path d="M 0 18 Q 0 0 18 0 L ${cardW - 18} 0 Q ${cardW} 0 ${cardW} 18 L ${cardW} 36 L 0 36 Z" fill="url(#greenBanner)" />
      <text x="20" y="23" font-size="12.5" font-weight="800" fill="#FFFFFF">✦ NTO Exclusives Unlocked</text>
      <rect x="${cardW - 116}" y="8" width="98" height="20" rx="10" fill="#065F46" fill-opacity="0.6" />
      <text x="${cardW - 67}" y="22" font-size="10" font-weight="600" fill="#D1FAE5" text-anchor="middle">Alex Morgan</text>

      <!-- Shoe Line -->
      <image href="${shoeTrailridge}" x="20" y="44" width="52" height="42" preserveAspectRatio="xMidYMid meet" />
      <text x="84" y="58" font-size="13" font-weight="700" fill="#0F172A">Trailridge Mid</text>
      <text x="84" y="74" font-size="11" font-weight="500" fill="#64748B">Northern Trail Outfitters · Size 10</text>
      <text x="${cardW - 25}" y="62" font-size="14" font-weight="800" fill="#0F172A" text-anchor="end">$95</text>
      <text x="286" y="74" font-size="11" font-weight="500" fill="#64748B">
        🚚 ${socksAdded ? 'Delivery <tspan fill="#94A3B8" text-decoration="line-through">$8</tspan> <tspan fill="#059669" font-weight="800">Free</tspan>' : 'Delivery $8'}  ·  Arrives Friday
      </text>

      <line x1="20" y1="92" x2="${cardW - 20}" y2="92" stroke="#F1F5F9" />

      <!-- Bundle Offer Header -->
      <g transform="translate(20, 100)">
        <!-- Small shoe thumbnail with plus sign -->
        <rect x="0" y="0" width="22" height="22" rx="5" fill="#F1F5F9" stroke="#E2E8F0" />
        <image href="${shoeTrailridge}" x="1" y="1" width="20" height="20" preserveAspectRatio="xMidYMid meet" />
        <text x="27" y="15" font-size="12" font-weight="700" fill="#94A3B8">+</text>
        
        <text x="40" y="15" font-size="12.5" font-weight="800" fill="#0F172A">Gear Up for the Trail: Complete your hiking kit</text>
        <text x="40" y="29" font-size="10.5" font-weight="500" fill="#64748B">Add any item and get 20% off each</text>
      </g>

      <!-- Three Offer Cards in a row (Non-scrolling 3 column grid) -->
      <g transform="translate(20, 136)">
        <!-- Card 1: Socks -->
        <g transform="translate(0, 0)">
          <rect width="236" height="126" rx="12" fill="${socksAdded ? '#ECFDF5' : '#F8FAFC'}" stroke="${socksAdded ? '#A7F3D0' : '#E2E8F0'}" />
          <!-- Centered Badges: 20% OFF and KIT OFFER -->
          <g transform="translate(86, 7)">
            <rect x="0" y="0" width="64" height="16" rx="4" fill="#D1FAE5" />
            <text x="32" y="12" font-size="9.5" font-weight="800" fill="#065F46" text-anchor="middle">20% OFF</text>
            <rect x="4" y="18" width="56" height="13" rx="3" fill="#FEF3C7" />
            <text x="32" y="28" font-size="8" font-weight="800" fill="#92400E" text-anchor="middle">KIT OFFER</text>
          </g>
          
          <!-- Bigger product image, centered -->
          <image href="${socksNto}" x="88" y="38" width="60" height="38" preserveAspectRatio="xMidYMid meet" />
          <!-- Smaller product text name, centered -->
          <text x="118" y="86" font-size="9.5" font-weight="600" fill="#0F172A" text-anchor="middle">NTO Merino Trail Socks, 2 pack</text>
          
          <!-- Price line + Free shipping tag, centered -->
          <g transform="translate(36, 92)">
            <text x="0" y="10" font-size="10.5" font-weight="500" fill="#64748B"><tspan text-decoration="line-through" fill="#94A3B8">$25</tspan> <tspan fill="#059669" font-weight="800">$20</tspan></text>
            <rect x="52" y="0" width="88" height="13" rx="3" fill="#ECFDF5" stroke="#A7F3D0" />
            <text x="96" y="10" font-size="8" font-weight="700" fill="#065F46" text-anchor="middle">+ Free shipping</text>
          </g>
          
          <!-- Add Button: + Add or Added -->
          ${socksAdded ? `
            <rect x="68" y="108" width="100" height="16" rx="4" fill="#059669" />
            <text x="118" y="120" font-size="9" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓ Added</text>
          ` : `
            <rect x="78" y="108" width="80" height="16" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
            <text x="118" y="120" font-size="9" font-weight="600" fill="#475569" text-anchor="middle">+ Add</text>
          `}
        </g>

        <!-- Card 2: Bottle -->
        <g transform="translate(254, 0)">
          <rect width="236" height="126" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
          <g transform="translate(86, 7)">
            <rect x="0" y="0" width="64" height="16" rx="4" fill="#D1FAE5" />
            <text x="32" y="12" font-size="9.5" font-weight="800" fill="#065F46" text-anchor="middle">20% OFF</text>
            <rect x="4" y="18" width="56" height="13" rx="3" fill="#FEF3C7" />
            <text x="32" y="28" font-size="8" font-weight="800" fill="#92400E" text-anchor="middle">KIT OFFER</text>
          </g>
          
          <image href="${bottleNto}" x="88" y="38" width="60" height="38" preserveAspectRatio="xMidYMid meet" />
          <text x="118" y="86" font-size="9.5" font-weight="600" fill="#0F172A" text-anchor="middle">NTO Trail Bottle, 1 liter</text>
          
          <g transform="translate(36, 92)">
            <text x="0" y="10" font-size="10.5" font-weight="500" fill="#64748B"><tspan text-decoration="line-through" fill="#94A3B8">$20</tspan> <tspan fill="#059669" font-weight="800">$16</tspan></text>
            <rect x="52" y="0" width="88" height="13" rx="3" fill="#ECFDF5" stroke="#A7F3D0" />
            <text x="96" y="10" font-size="8" font-weight="700" fill="#065F46" text-anchor="middle">+ Free shipping</text>
          </g>

          <rect x="78" y="108" width="80" height="16" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="118" y="120" font-size="9" font-weight="600" fill="#475569" text-anchor="middle">+ Add</text>
        </g>

        <!-- Card 3: Rain Cover -->
        <g transform="translate(508, 0)">
          <rect width="236" height="126" rx="12" fill="#F8FAFC" stroke="#E2E8F0" />
          <g transform="translate(86, 7)">
            <rect x="0" y="0" width="64" height="16" rx="4" fill="#D1FAE5" />
            <text x="32" y="12" font-size="9.5" font-weight="800" fill="#065F46" text-anchor="middle">20% OFF</text>
            <rect x="4" y="18" width="56" height="13" rx="3" fill="#FEF3C7" />
            <text x="32" y="28" font-size="8" font-weight="800" fill="#92400E" text-anchor="middle">KIT OFFER</text>
          </g>
          
          <image href="${rainCoverNto}" x="88" y="38" width="60" height="38" preserveAspectRatio="xMidYMid meet" />
          <text x="118" y="86" font-size="9.5" font-weight="600" fill="#0F172A" text-anchor="middle">NTO Daypack Rain Cover</text>
          
          <g transform="translate(36, 92)">
            <text x="0" y="10" font-size="10.5" font-weight="500" fill="#64748B"><tspan text-decoration="line-through" fill="#94A3B8">$30</tspan> <tspan fill="#059669" font-weight="800">$24</tspan></text>
            <rect x="52" y="0" width="88" height="13" rx="3" fill="#ECFDF5" stroke="#A7F3D0" />
            <text x="96" y="10" font-size="8" font-weight="700" fill="#065F46" text-anchor="middle">+ Free shipping</text>
          </g>

          <rect x="78" y="108" width="80" height="16" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="118" y="120" font-size="9" font-weight="600" fill="#475569" text-anchor="middle">+ Add</text>
        </g>
      </g>

      <!-- FREE SHIPPING MILESTONE BRIDGE -->
      <g transform="translate(20, 268)">
        <rect width="${cardW - 40}" height="64" rx="10" fill="${socksAdded ? '#ECFDF5' : '#F8FAFC'}" stroke="${socksAdded ? '#A7F3D0' : '#E2E8F0'}" />
        
        <!-- Header row -->
        <circle cx="24" cy="16" r="8" fill="${socksAdded ? '#059669' : '#0F172A'}" />
        <text x="24" y="19" font-size="9" fill="#FFFFFF" text-anchor="middle">🚚</text>
        <text x="38" y="19" font-size="10.5" font-weight="800" fill="#0F172A">${socksAdded ? 'Free Friday Delivery Unlocked' : 'Free Delivery on Orders Over $100'}</text>
        <rect x="232" y="8" width="54" height="15" rx="3" fill="#D1FAE5" />
        <text x="259" y="19" font-size="8.5" font-weight="800" fill="#065F46" text-anchor="middle">SAVE $8</text>
        
        ${socksAdded ? `
          <rect x="${cardW - 130}" y="8" width="80" height="16" rx="4" fill="#D1FAE5" />
          <text x="${cardW - 90}" y="19" font-size="9.5" font-weight="800" fill="#065F46" text-anchor="middle">✓ Unlocked</text>
        ` : `
          <rect x="${cardW - 130}" y="8" width="80" height="16" rx="4" fill="#FFFFFF" stroke="#CBD5E1" />
          <text x="${cardW - 90}" y="19" font-size="9.5" font-weight="700" fill="#0F172A" text-anchor="middle">Only $5 away</text>
        `}

        <!-- 3 Milestone Stages -->
        <!-- Stage 1: Shoe in cart -->
        <g transform="translate(10, 30)">
          <rect width="210" height="26" rx="5" fill="#FFFFFF" stroke="#E2E8F0" />
          <image href="${shoeTrailridge}" x="4" y="2" width="22" height="22" preserveAspectRatio="xMidYMid meet" />
          <text x="32" y="13" font-size="8.5" font-weight="600" fill="#64748B">Shoe in cart</text>
          <text x="32" y="22" font-size="9.5" font-weight="800" fill="#0F172A">$95.00</text>
        </g>

        <!-- Connector: + Add any kit item -->
        <g transform="translate(225, 30)">
          <line x1="0" y1="13" x2="275" y2="13" stroke="${socksAdded ? '#10B981' : '#CBD5E1'}" stroke-width="1.5" />
          <circle cx="137" cy="13" r="8" fill="${socksAdded ? '#059669' : '#FFFFFF'}" stroke="${socksAdded ? '#10B981' : '#94A3B8'}" stroke-width="1.5" />
          <text x="137" y="17" font-size="9" font-weight="800" fill="${socksAdded ? '#FFFFFF' : '#475569'}" text-anchor="middle">${socksAdded ? '✓' : '+'}</text>
          <text x="137" y="25" font-size="8" font-weight="700" fill="${socksAdded ? '#059669' : '#64748B'}" text-anchor="middle">${socksAdded ? 'Socks added ($20)' : 'Add any kit item ($16+)'}</text>
        </g>

        <!-- Stage 2: Free Shipping Goal -->
        <g transform="translate(515, 30)">
          <rect width="219" height="26" rx="5" fill="${socksAdded ? '#059669' : '#FFFFFF'}" stroke="${socksAdded ? '#047857' : '#E2E8F0'}" />
          <text x="10" y="12" font-size="8" font-weight="600" fill="${socksAdded ? '#D1FAE5' : '#64748B'}">${socksAdded ? 'Goal met ($115)' : 'Free Shipping ($100)'}</text>
          <text x="10" y="22" font-size="9.5" font-weight="800" fill="${socksAdded ? '#FFFFFF' : '#0F172A'}">Delivery: <tspan text-decoration="line-through" fill="${socksAdded ? '#A7F3D0' : '#94A3B8'}">$8</tspan> <tspan fill="${socksAdded ? '#FEF08A' : '#059669'}">FREE</tspan></text>
        </g>
      </g>

      <!-- Payoff Line -->
      <line x1="20" y1="338" x2="${cardW - 20}" y2="338" stroke="#F1F5F9" />
      <text x="36" y="351" font-size="10.5" font-weight="600" fill="${socksAdded ? '#059669' : '#475569'}">
        ${socksAdded ? '✓ Shoes + Socks for $115  ·  You saved $13 today ($5 kit discount + $8 shipping)' : '● Double savings: Get 20% off kit item + Save $8 on shipping'}
      </text>
    </g>

    ${socksAdded ? `
      <!-- Shopper response bubble -->
      <g transform="translate(${scrX + scrW - 200}, ${startY + 374})">
        <rect width="176" height="32" rx="14" fill="#0F172A" filter="url(#cardShadow)" />
        <text x="88" y="21" font-size="12" font-weight="500" fill="#FFFFFF" text-anchor="middle">Yes, add the socks.</text>
      </g>

      <!-- Agent response bubble -->
      <g transform="translate(${scrX + 24}, ${startY + 414})">
        <circle cx="15" cy="18" r="15" fill="#0F172A" />
        <text x="15" y="22" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">PA</text>
        <rect x="40" y="0" width="744" height="36" rx="14" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#cardShadow)" />
        <text x="58" y="23" font-size="11.5" font-weight="500" fill="#1E293B">Added the Merino Trail Socks at 20% off. Your order now qualifies for free shipping! Let me show your cart summary.</text>
      </g>
    ` : ''}
  `;
}

// --------------------------------------------------------------------------
// STEP 5: Order Summary Receipt + Purchase Approved
// --------------------------------------------------------------------------
function renderStep5Content() {
  const startY = scrY + 148;
  const cardW = 784;

  return `
    <g transform="translate(${scrX + 24}, ${startY})">
      <!-- Order Summary Card -->
      <rect width="${cardW}" height="305" rx="18" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#cardShadow)" />
      
      <!-- Top Header -->
      <path d="M 0 18 Q 0 0 18 0 L ${cardW - 18} 0 Q ${cardW} 0 ${cardW} 18 L ${cardW} 40 L 0 40 Z" fill="#F8FAFC" />
      <text x="20" y="25" font-size="13.5" font-weight="800" fill="#0F172A">📦 Order Summary</text>
      
      <rect x="${cardW - 225}" y="9" width="205" height="22" rx="11" fill="#ECFDF5" stroke="#A7F3D0" />
      <text x="${cardW - 122}" y="24" font-size="10.5" font-weight="700" fill="#065F46" text-anchor="middle">✓ NTO Member Savings Applied</text>

      <!-- Line 1: Shoes -->
      <image href="${shoeTrailridge}" x="25" y="52" width="46" height="36" preserveAspectRatio="xMidYMid meet" />
      <text x="85" y="66" font-size="13" font-weight="700" fill="#0F172A">Trailridge Mid</text>
      <text x="85" y="82" font-size="11" font-weight="500" fill="#64748B">Size 10 · Arrives Friday</text>
      <text x="${cardW - 25}" y="72" font-size="14" font-weight="700" fill="#0F172A" text-anchor="end">$95</text>

      <line x1="25" y1="96" x2="${cardW - 25}" y2="96" stroke="#F1F5F9" />

      <!-- Line 2: Socks -->
      <image href="${socksNto}" x="25" y="104" width="46" height="36" preserveAspectRatio="xMidYMid meet" />
      <text x="85" y="118" font-size="13" font-weight="700" fill="#0F172A">NTO Merino Trail Socks, 2 pack</text>
      <text x="85" y="134" font-size="11" font-weight="500" fill="#64748B">2-pack trail bundle</text>
      <text x="${cardW - 25}" y="124" font-size="14" font-weight="700" fill="#0F172A" text-anchor="end">$25</text>

      <line x1="25" y1="148" x2="${cardW - 25}" y2="148" stroke="#E2E8F0" stroke-dasharray="4" />

      <!-- Discount 1: Kit offer discount -->
      <text x="25" y="170" font-size="12.5" font-weight="600" fill="#059669">Complete your kit, 20% off socks</text>
      <text x="${cardW - 25}" y="170" font-size="13.5" font-weight="700" fill="#059669" text-anchor="end">-$5</text>

      <!-- Discount 2: Free Shipping -->
      <text x="25" y="194" font-size="12.5" font-weight="600" fill="#334155">🚚 Shipping, free over $100</text>
      <text x="${cardW - 25}" y="194" font-size="12.5" font-weight="700" fill="#059669" text-anchor="end"><tspan fill="#94A3B8" text-decoration="line-through">$8</tspan>  Free</text>

      <line x1="25" y1="210" x2="${cardW - 25}" y2="210" stroke="#CBD5E1" />

      <!-- Total Line -->
      <text x="25" y="244" font-size="15" font-weight="700" fill="#475569">Total</text>
      <text x="25" y="262" font-size="11" font-weight="500" fill="#94A3B8">All discounts and free shipping included</text>
      <text x="${cardW - 25}" y="256" font-size="28" font-weight="900" fill="#0F172A" text-anchor="end">$115</text>
    </g>

    <!-- Agent Approval Box -->
    <g transform="translate(${scrX + 24}, ${startY + 318})">
      <circle cx="15" cy="18" r="15" fill="#0F172A" />
      <text x="15" y="22" font-size="10" font-weight="800" fill="#FFFFFF" text-anchor="middle">PA</text>
      <rect x="40" y="0" width="${cardW - 40}" height="84" rx="16" fill="#FFFFFF" stroke="#E2E8F0" filter="url(#cardShadow)" />
      
      <text x="62" y="26" font-size="12.5" font-weight="500" fill="#1E293B">Your total is $115 for the shoes and the socks, delivered Friday.</text>

      <!-- Approved Green Button -->
      <rect x="62" y="38" width="180" height="34" rx="10" fill="#059669" />
      <text x="152" y="60" font-size="12" font-weight="700" fill="#FFFFFF" text-anchor="middle">✓ Purchase approved</text>

      <!-- Order number confirmation -->
      <rect x="254" y="38" width="290" height="34" rx="10" fill="#ECFDF5" stroke="#A7F3D0" />
      <text x="399" y="60" font-size="11" font-weight="600" fill="#065F46" text-anchor="middle">Order #NTO-88421 confirmed for Friday delivery!</text>
    </g>
  `;
}

// --------------------------------------------------------------------------
// EXECUTION: Render Frames & Encode MP4 / GIF
// --------------------------------------------------------------------------
const fontPath = path.resolve(__dirname, '../src/assets/fonts/PlusJakartaSans.ttf');
console.log('Rendering 1080p frames with Resvg using Plus Jakarta Sans...');

for (let s = 1; s <= 5; s++) {
  const svg = generateFrameSvg(s);
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1920 },
    font: {
      fontFiles: [fontPath],
      defaultFontFamily: 'Plus Jakarta Sans',
      loadSystemFonts: true,
    },
  });
  const png = r.render().asPng();
  const framePath = path.join(tempDir, `frame_${s}.png`);
  fs.writeFileSync(framePath, png);
  console.log(`Saved frame ${s} (${png.length} bytes, 1920x1080)`);
}

// Generate MP4 with ffmpeg (3.0 seconds per step, 30fps high quality H.264, CRF 12, faststart)
const mp4Output = path.join(publicDir, 'personal_agent_shopping_story.mp4');
const ffmpegMp4Cmd = `ffmpeg -y -framerate 1/3.0 -i "${tempDir}/frame_%d.png" -c:v libx264 -r 30 -pix_fmt yuv420p -profile:v high -level 4.1 -preset slow -crf 12 -movflags +faststart "${mp4Output}"`;
console.log('Running ffmpeg to generate studio 1080p MP4...');
execSync(ffmpegMp4Cmd, { stdio: 'inherit' });
console.log('MP4 successfully generated at:', mp4Output);

// Generate GIF with ffmpeg (two-pass palettegen at 1280px with lanczos + sierra2_4a high-definition dithering)
const gifOutput = path.join(publicDir, 'personal_agent_shopping_story.gif');
const palettePath = path.join(tempDir, 'palette.png');
const paletteCmd = `ffmpeg -y -framerate 1/2.8 -i "${tempDir}/frame_%d.png" -vf "scale=1280:-1:flags=lanczos,palettegen=max_colors=256:reserve_transparent=0:stats_mode=full" "${palettePath}"`;
const gifCmd = `ffmpeg -y -framerate 1/2.8 -i "${tempDir}/frame_%d.png" -i "${palettePath}" -lavfi "scale=1280:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=sierra2_4a:diff_mode=none" "${gifOutput}"`;

console.log('Running ffmpeg to generate studio HD GIF...');
execSync(paletteCmd, { stdio: 'inherit' });
execSync(gifCmd, { stdio: 'inherit' });
console.log('GIF successfully generated at:', gifOutput);

console.log('Video & GIF assets generation completed!');
