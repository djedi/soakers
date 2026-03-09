---
title: "OG Preview"
description: "OpenGraph image preview"
layout: base.njk
permalink: /og-preview/
excludeFromNav: true
eleventyExcludeFromCollections: true
---

<style>
  /* Hide site chrome for clean screenshot */
  .navbar-area, footer, .call-btn, .breadcrumb-area, .mobile-sticky-call { display: none !important; }
  body { margin: 0; padding: 0; overflow: hidden; }

  .og-card {
    width: 1200px;
    height: 630px;
    background: linear-gradient(135deg, #1a73e8 0%, #0d47a1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    font-family: 'Josefin Sans', sans-serif;
  }

  /* Subtle background pattern */
  .og-card::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.06);
    top: -200px;
    right: -150px;
  }
  .og-card::after {
    content: '';
    position: absolute;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.05);
    bottom: -120px;
    left: -80px;
  }

  .og-content {
    text-align: center;
    z-index: 1;
    padding: 40px 60px;
  }

  .og-logo img {
    width: 480px;
    height: auto;
    filter: invert(1);
    margin-bottom: 24px;
  }

  .og-divider {
    width: 60px;
    height: 4px;
    background: #f27127;
    margin: 0 auto 28px;
    border-radius: 2px;
  }

  .og-tagline {
    font-family: 'Josefin Sans', sans-serif;
    font-size: 32px;
    font-weight: 600;
    color: #ffffff;
    margin-bottom: 16px;
    letter-spacing: 0.5px;
  }

  .og-sub {
    font-family: 'Roboto', sans-serif;
    font-size: 18px;
    font-weight: 300;
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 32px;
  }

  .og-brands {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    flex-wrap: wrap;
  }

  .og-brand-pill {
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: rgba(255,255,255,0.9);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    background: rgba(255,255,255,0.1);
    padding: 8px 18px;
    border-radius: 20px;
    border: 1px solid rgba(255,255,255,0.15);
  }

  .og-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 16px 0;
    background: rgba(0,0,0,0.15);
    font-family: 'Roboto', sans-serif;
    font-size: 16px;
    color: rgba(255,255,255,0.8);
  }

  .og-footer span {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .og-footer i {
    color: #f27127;
  }

  .og-stars {
    color: #f4b400;
    letter-spacing: 2px;
  }
</style>

<div class="og-card">
  <div class="og-content">
    <div class="og-logo"><img src="/img/logo-black.png" alt="Soakers"></div>
    <div class="og-divider"></div>
    <div class="og-tagline">Your Neighborhood Hot Tub Experts</div>
    <div class="og-sub">Family-owned in Midvale, Utah &mdash; Sales, Service &amp; Supplies</div>
    <div class="og-brands">
      <span class="og-brand-pill">Artesian</span>
      <span class="og-brand-pill">Nordic</span>
      <span class="og-brand-pill">TidalFit</span>
      <span class="og-brand-pill">South Seas</span>
      <span class="og-brand-pill">Covana</span>
    </div>
  </div>
  <div class="og-footer">
    <span><i class="fas fa-map-marker-alt"></i> Midvale, UT</span>
    <span><i class="fas fa-phone-alt"></i> 801-838-SPAS</span>
    <span class="og-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
    <span>4.8 on Google</span>
  </div>
</div>
