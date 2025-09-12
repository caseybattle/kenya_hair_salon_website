"use client";

import { Marquee } from "@/components/magicui/marquee";
import { MagicCard } from "@/components/magicui/magic-card";

interface Testimonial {
  name: string;
  role?: string;
  text: string;
  initials: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Kenya B.",
    role: "Owner & Master Stylist",
    text:
      "I take pride in giving every client a luxurious experience with results that last. Your hair health and confidence come first.",
    initials: "KB",
  },
  {
    name: "Ariana P.",
    text:
      "Best silk press I’ve ever had. My hair feels light, shiny, and so healthy—got compliments all week!",
    initials: "AP",
  },
  {
    name: "Janelle R.",
    text:
      "Color and highlights are perfection. The tone matches my skin and the dimension is gorgeous.",
    initials: "JR",
  },
  {
    name: "Monique L.",
    text:
      "The luxury treatment + steam left my curls so hydrated. No frizz, just definition.",
    initials: "ML",
  },
  {
    name: "Tasha W.",
    text:
      "Wedding updo was elegant and stayed flawless all night. Couldn’t have asked for more!",
    initials: "TW",
  },
  {
    name: "Erica D.",
    text:
      "Precision cut that finally suits my face shape. Styling has been effortless since.",
    initials: "ED",
  },
];

function Stars() {
  return (
    <div className="testimonial-stars" aria-label="5 star rating">
      <i className="fas fa-star"></i>
      <i className="fas fa-star"></i>
      <i className="fas fa-star"></i>
      <i className="fas fa-star"></i>
      <i className="fas fa-star"></i>
    </div>
  );
}

export default function TestimonialMarquee() {
  // Duplicate to enrich the marquee loop
  const loop = [...testimonials, ...testimonials];

  return (
    <div className="testimonial-marquee">
      <Marquee className="[--duration:28s]" pauseOnHover>
        {loop.map((t, idx) => (
          <div key={idx} className="testimonial-card-wrapper">
            <MagicCard
              className="testimonial-card group cursor-pointer"
              gradientColor="rgba(255,255,255,0.95)"
              gradientOpacity={0.3}
              gradientFrom="rgba(255,255,255,0.98)"
              gradientTo="rgba(248,187,217,0.15)"
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar" aria-hidden>
                  {t.initials}
                </div>
                <div className="testimonial-id">
                  <div className="testimonial-name">{t.name}</div>
                  {t.role ? (
                    <div className="testimonial-meta">{t.role}</div>
                  ) : (
                    <Stars />
                  )}
                </div>
              </div>
              <p className="testimonial-text">“{t.text}”</p>
            </MagicCard>
          </div>
        ))}
      </Marquee>
    </div>
  );
}

