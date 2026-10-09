---
title: "Contact Us & Request a Quote"
description: "Request a hot tub quote or service visit, or visit our showroom at 6905 S State St, Midvale, UT. Call 801-838-SPAS. Open Monday–Saturday, 10 AM–5 PM."
layout: base.njk
permalink: /contact/
---

<!-- Hero Banner -->
<section class="page-hero">
  <div class="container text-center">
    <h1>Contact Soakers in Midvale</h1>
    <p>
      Have questions about a hot tub, need service, or want a quote? Call, email, send us a message below, or stop by the showroom.
    </p>
  </div>
</section>

<!-- Contact Cards -->
<section class="pt-100 pb-70">
  <div class="container">
    <div class="row">
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card border-0 shadow-sm h-100 text-center p-4">
          <div class="card-body">
            <div class="mb-3">
              <i class="fas fa-phone-alt fa-3x" style="color: #1168b7;"></i>
            </div>
            <h4>Call Us</h4>
            <p class="mb-0">
              <a href="tel:+18018387727" style="font-size: 20px; font-weight: 700; color: #0d5495;">
                801-838-SPAS (7727)
              </a>
            </p>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-6 mb-4">
        <div class="card border-0 shadow-sm h-100 text-center p-4">
          <div class="card-body">
            <div class="mb-3">
              <i class="fas fa-envelope fa-3x" style="color: #1168b7;"></i>
            </div>
            <h4>Email Us</h4>
            <p class="mb-0">
              <a href="mailto:service@soakers.biz" style="font-size: 18px; font-weight: 700; color: #0d5495;">
                service@soakers.biz
              </a>
            </p>
          </div>
        </div>
      </div>
      <div class="col-lg-4 col-md-12 mb-4">
        <div class="card border-0 shadow-sm h-100 text-center p-4">
          <div class="card-body">
            <div class="mb-3">
              <i class="fas fa-map-marker-alt fa-3x" style="color: #1168b7;"></i>
            </div>
            <h4>Visit Us</h4>
            <p style="font-size: 16px; margin-bottom: 5px;">
              <strong>6905 S State St, Suite A</strong><br>
              Midvale, UT 84047
            </p>
            <p style="color: #666; font-size: 14px; margin-bottom: 0;">
              Mon – Sat: 10:00 AM – 5:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Quote / Service Request Form (Netlify Forms) -->
<section class="pb-70">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h2 class="text-center">Request a Quote or Service Visit</h2>
        <p class="text-center mb-4">
          Tell us what you're looking for and we'll get back to you, usually within one business day.
          Need help right now? Call <a href="tel:+18018387727">801-838-7727</a>.
        </p>
        <form class="quote-form" name="contact" method="POST" action="/contact/thanks/" data-netlify="true" netlify-honeypot="company_website">
          <input type="hidden" name="form-name" value="contact" />
          <p class="quote-form__honeypot" aria-hidden="true">
            <label>Leave this empty: <input name="company_website" tabindex="-1" autocomplete="off" /></label>
          </p>
          <div class="row">
            <div class="col-md-6 quote-form__field">
              <label for="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" autocomplete="name" required />
            </div>
            <div class="col-md-6 quote-form__field">
              <label for="contact-phone">Phone</label>
              <input id="contact-phone" name="phone" type="tel" autocomplete="tel" />
            </div>
            <div class="col-md-6 quote-form__field">
              <label for="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" autocomplete="email" required />
            </div>
            <div class="col-md-6 quote-form__field">
              <label for="contact-interest">I'm interested in</label>
              <select id="contact-interest" name="interest" required>
                <option value="">Choose one…</option>
                <option>Buying a hot tub or swim spa</option>
                <option>Service or repair</option>
                <option>Parts, chemicals or covers</option>
                <option>Something else</option>
              </select>
            </div>
            <div class="col-12 quote-form__field">
              <label for="contact-message">Message</label>
              <textarea id="contact-message" name="message" rows="5" placeholder="Which model you're curious about, or what's going on with your spa (brand, age, symptoms)." required></textarea>
            </div>
          </div>
          <button type="submit" class="btn-primary">Send message</button>
        </form>
      </div>
    </div>
  </div>
</section>

<!-- Directions, hours & service area -->
<section class="pb-70">
  <div class="container">
    <div class="row">
      <div class="col-lg-4 mb-4">
        <h2>Directions</h2>
        <p>
          We're at <strong>6905 S State St, Suite A</strong> in Midvale. From I-15, take the 7200 South exit,
          head east to State Street, and turn left (north). The showroom is on State Street just north of
          Fort Union Blvd (7000 South). About 15–20 minutes from downtown Salt Lake City.
        </p>
        <p><a href="https://www.google.com/maps/place/Soakers/@40.6253922,-111.8898613,16z" target="_blank" rel="noopener noreferrer">Open in Google Maps →</a></p>
      </div>
      <div class="col-lg-4 mb-4">
        <h2>Hours</h2>
        <p>
          Monday – Saturday: 10:00 AM – 5:00 PM<br>
          Sunday: Closed
        </p>
        <p>Come sit in the display models — no appointment needed. For service visits, call or send the form above to get on the schedule.</p>
      </div>
      <div class="col-lg-4 mb-4">
        <h2>Service Area</h2>
        <p>
          From our Midvale showroom we serve Salt Lake City, Sandy, Murray, Draper, West Jordan, South Jordan,
          Cottonwood Heights, Holladay, and the rest of the Wasatch Front. See all <a href="/services/">sales and service options</a>.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Contact FAQ -->
<section class="pb-70">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-8">
        <h2 class="text-center mb-4">Common Questions</h2>
        <h3>Do I need an appointment to visit the showroom?</h3>
        <p>No. Stop by any time Monday through Saturday, 10 AM to 5 PM, to see and sit in the display models.</p>
        <h3>Do you service hot tubs you didn't sell?</h3>
        <p>Yes. We service all brands, not just the ones we sell. Use the form above or call 801-838-7727 to request a service visit.</p>
        <h3>Do you offer financing?</h3>
        <p>Yes, through Mountain America Credit Union. See <a href="/financing/">financing options</a> or ask us in the showroom.</p>
        <h3>Do you deliver and install?</h3>
        <p>Yes. We coordinate delivery and can help with setup and initial water treatment.</p>
      </div>
    </div>
  </div>
</section>

{% include "map-embed.njk" %}

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ContactPage",
      "@id": "https://soakers.biz/contact/#webpage",
      "url": "https://soakers.biz/contact/",
      "name": "Contact Soakers",
      "isPartOf": { "@id": "https://soakers.biz/#website" },
      "about": { "@id": "https://soakers.biz/#business" }
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Do I need an appointment to visit the showroom?", "acceptedAnswer": { "@type": "Answer", "text": "No. Stop by any time Monday through Saturday, 10 AM to 5 PM, to see and sit in the display models." } },
        { "@type": "Question", "name": "Do you service hot tubs you didn't sell?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We service all brands, not just the ones we sell. Use the contact form or call 801-838-7727 to request a service visit." } },
        { "@type": "Question", "name": "Do you offer financing?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, through Mountain America Credit Union. See our financing page or ask us in the showroom." } },
        { "@type": "Question", "name": "Do you deliver and install?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We coordinate delivery and can help with setup and initial water treatment." } }
      ]
    }
  ]
}
</script>
