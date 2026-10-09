// Contextual cross-links between model pages and feature pages, rendered by
// src/_includes/related-links.njk. Feature → model mappings follow what each
// feature page says the feature is available on.
const lines = {
  island: { name: "Island Spas", url: "/spa-models/island-spas/" },
  elite: { name: "Artesian Elite", url: "/spa-models/artesian-elite/" },
  southSeas: { name: "South Seas Spas", url: "/spa-models/south-seas-spas/" },
  garden: { name: "Garden Spas", url: "/spa-models/garden-spas/" },
  tidalfit: { name: "TidalFit Swim Spas", url: "/spa-models/swim-spas/" },
  nordicLuxury: { name: "Nordic Luxury Series", url: "/spa-models/nordic-luxury/" },
  nordicSport: { name: "Nordic Sport Edition", url: "/spa-models/nordic-sport/" },
  nordicModern: { name: "Nordic Modern Series", url: "/spa-models/nordic-modern/" },
  nordicClassic: { name: "Nordic Classic Series", url: "/spa-models/nordic-classic/" },
  nordic110: { name: "Nordic ALL-IN-110V", url: "/spa-models/nordic-all-in-110v/" },
};

const features = {
  jets: { name: "Hydrotherapy jets", url: "/hydrotherapy-jets/" },
  lighting: { name: "LED lighting", url: "/led-lighting/" },
  stereo: { name: "Stereo systems", url: "/stereo-systems/" },
  water: { name: "Water features", url: "/water-features/" },
  covers: { name: "Covers & lifters", url: "/covers/" },
  covana: { name: "Covana automated covers", url: "/covana/" },
  steps: { name: "Steps", url: "/steps/" },
};

const { island, elite, southSeas, garden, tidalfit } = lines;
const { nordicLuxury, nordicSport, nordicModern, nordicClassic, nordic110 } = lines;
const { jets, lighting, stereo, water, covers, covana, steps } = features;

// page url -> { models, features, modelsHeading? }
module.exports = {
  // Model pages
  "/spa-models/island-spas/": { models: [elite, southSeas, garden], features: [jets, lighting, stereo, water, covers] },
  "/spa-models/artesian-elite/": { models: [island, southSeas, tidalfit], features: [jets, lighting, stereo, water, steps] },
  "/spa-models/south-seas-spas/": { models: [island, garden, nordicLuxury], features: [lighting, stereo, water, covers] },
  "/spa-models/garden-spas/": { models: [nordic110, southSeas, island], features: [lighting, covers, steps] },
  "/spa-models/swim-spas/": { models: [elite, island], features: [lighting, stereo, water, steps, covana] },
  "/spa-models/nordic-luxury/": { models: [nordicSport, nordicModern, nordicClassic], features: [covers, covana, steps] },
  "/spa-models/nordic-sport/": { models: [nordicLuxury, nordicModern, nordic110], features: [covers, covana, steps] },
  "/spa-models/nordic-modern/": { models: [nordicLuxury, nordicSport, nordicClassic], features: [covers, covana, steps] },
  "/spa-models/nordic-classic/": { models: [nordicLuxury, nordicModern, nordic110], features: [covers, covana, steps] },
  "/spa-models/nordic-all-in-110v/": { models: [garden, nordicSport, nordicClassic], features: [covers, covana, steps] },

  // Feature pages
  "/hydrotherapy-jets/": { models: [elite, island] },
  "/led-lighting/": { models: [elite, island, southSeas, garden, tidalfit] },
  "/stereo-systems/": { models: [elite, island, southSeas, tidalfit] },
  "/water-features/": { models: [island, elite, southSeas, tidalfit] },
  "/steps/": { models: [elite, tidalfit] },
  "/covers/": { modelsHeading: "Hot tubs we carry", models: [island, southSeas, nordicLuxury, garden], features: [covana] },
  "/covana/": { modelsHeading: "Hot tubs we carry", models: [island, elite, nordicLuxury], features: [covers] },
};
