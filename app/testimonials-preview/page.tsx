import { ThreeDTestimonialMarqueeAngled as ThreeDTestimonialMarquee, type Testimonial } from "@/components/ui/3d-testimonial-marquee-angled";

const testimonials: Testimonial[] = [
  {
    avatar: "/assets/model.jpg",
    name: "Sarah M.",
    role: "Atlanta, GA",
    quote: "Best braiding experience ever! The attention to detail is incredible.",
    rating: 5,
  },
  {
    avatar: "/assets/kenya_hair_pics7.png",
    name: "Jasmine T.",
    role: "Duluth, GA",
    quote: "My hair has never looked this good! The silk press is perfection.",
    rating: 5,
  },
  {
    avatar: "/assets/kenya_hair_salon.png",
    name: "Amanda R.",
    role: "Bride",
    quote: "They made me feel like a princess on my wedding day!",
    rating: 5,
  },
  {
    avatar: "/assets/luxury-hair-treatment.jpg",
    name: "Nicole B.",
    role: "Norcross, GA",
    quote: "The extensions look so natural! I'm in love with my new length.",
    rating: 5,
  },
  {
    avatar: "/assets/Blowout_style.png",
    name: "Destiny K.",
    role: "Lawrenceville, GA",
    quote: "The blowout lasted for weeks! Absolutely worth it.",
    rating: 5,
  },
  {
    avatar: "/assets/Prcesion_cuts.png",
    name: "Michelle P.",
    role: "Johns Creek, GA",
    quote: "Finally found my forever salon! The precision is unmatched.",
    rating: 5,
  },
  {
    avatar: "/assets/Braids.png",
    name: "Keisha L.",
    role: "Lilburn, GA",
    quote: "Protective style done right. Zero tension, super neat—love it!",
    rating: 5,
  },
  {
    avatar: "/assets/Extensions.png",
    name: "Tiffany H.",
    role: "Suwanee, GA",
    quote: "Volume, bounce, and shine—I can’t stop getting compliments.",
    rating: 5,
  },
  {
    avatar: "/assets/Bridal_events.png",
    name: "Angela V.",
    role: "Bride",
    quote: "Timely, professional, and my updo survived a full day of dancing!",
    rating: 5,
  },
  {
    avatar: "/assets/Luxury_Style.png",
    name: "Marissa J.",
    role: "Styling Client",
    quote: "Healthy shine and movement without heat damage—so happy!",
    rating: 5,
  },
  {
    avatar: "/assets/About_salon_supreme.png",
    name: "Nia C.",
    role: "Regular Client",
    quote: "The steamer treatment is a game-changer for my scalp and curls.",
    rating: 5,
  },
  {
    avatar: "/assets/kenya_hair_salon.png",
    name: "Olivia R.",
    role: "Color Client",
    quote: "Dimensional color without frying my hair—perfectly blended.",
    rating: 5,
  },
  {
    avatar: "/assets/kenya_hair_pics7.png",
    name: "Camille P.",
    role: "Silk Press",
    quote: "Silk press lasted through humidity and still looked fresh.",
    rating: 5,
  },
  {
    avatar: "/assets/model.jpg",
    name: "Aaliyah W.",
    role: "Client",
    quote: "They listened and delivered exactly what I wanted—so happy!",
    rating: 5,
  },
  {
    avatar: "/assets/Extensions.png",
    name: "Jordan P.",
    role: "Extensions",
    quote: "Seamless blend and zero discomfort—top quality work.",
    rating: 5,
  },
  {
    avatar: "/assets/Braids.png",
    name: "Brianna S.",
    role: "Braids",
    quote: "Neat parts, even tension, and super fast—10/10!",
    rating: 5,
  },
  {
    avatar: "/assets/Prcesion_cuts.png",
    name: "Erica D.",
    role: "Cut & Style",
    quote: "The cut frames my face perfectly—I feel brand new.",
    rating: 5,
  },
  {
    avatar: "/assets/Luxury_Style.png",
    name: "Vanessa M.",
    role: "Styling",
    quote: "Soft, bouncy, and healthy—exactly the look I wanted.",
    rating: 5,
  },
  {
    avatar: "/assets/Blowout_style.png",
    name: "Kayla R.",
    role: "Blowout",
    quote: "Held up all weekend—super impressed with the finish.",
    rating: 5,
  },
  {
    avatar: "/assets/Bridal_events.png",
    name: "Sophia N.",
    role: "Bride",
    quote: "Zero stress morning, absolutely stunning style—thank you!",
    rating: 5,
  },
  {
    avatar: "/assets/kenya_hair_salon.png",
    name: "Mika H.",
    role: "Color",
    quote: "Rich tone and shine without damage—love the result.",
    rating: 5,
  },
  {
    avatar: "/assets/luxury-hair-treatment.jpg",
    name: "Deja F.",
    role: "Treatment",
    quote: "Scalp feels amazing and my curls are so hydrated.",
    rating: 5,
  },
  {
    avatar: "/assets/Extensions.png",
    name: "Nina K.",
    role: "Extensions",
    quote: "Invisible wefts and perfect color match—I’m obsessed.",
    rating: 5,
  },
  {
    avatar: "/assets/Braids.png",
    name: "Tasha E.",
    role: "Braids",
    quote: "Protective style done right—sleek and long-lasting.",
    rating: 5,
  },
  {
    avatar: "/assets/Prcesion_cuts.png",
    name: "Lena J.",
    role: "Cut",
    quote: "Clean layers and movement—photos don’t do it justice.",
    rating: 5,
  },
  {
    avatar: "/assets/Luxury_Style.png",
    name: "Ivy Q.",
    role: "Styling",
    quote: "Silky finish with zero frizz—highly recommend.",
    rating: 5,
  },
  {
    avatar: "/assets/Blowout_style.png",
    name: "Kendra Z.",
    role: "Blowout",
    quote: "Volume for days and super sleek look—love it.",
    rating: 5,
  },
  {
    avatar: "/assets/Bridal_events.png",
    name: "Renee C.",
    role: "Bridal",
    quote: "They pinned it perfectly—stayed flawless all night.",
    rating: 5,
  },
  {
    avatar: "/assets/model.jpg",
    name: "Yasmin O.",
    role: "Client",
    quote: "Friendly staff, beautiful space, and amazing results.",
    rating: 5,
  },
  {
    avatar: "/assets/kenya_hair_pics7.png",
    name: "Paige U.",
    role: "Silk Press",
    quote: "Shiny, flowy, and still healthy—my new go-to salon.",
    rating: 5,
  },
];

export default function TestimonialsPreviewPage() {
  return (
    <main data-testid="testimonials-preview-page" className="min-h-svh overflow-x-hidden bg-white dark:bg-neutral-950">
      <section id="testimonials" aria-label="Testimonials 3D Marquee" className="relative isolate">
        <div data-testid="marquee-wrap" data-expected-cards={testimonials.length} className="mx-auto max-w-none">
          <ThreeDTestimonialMarquee items={testimonials} offsetX={-615} offsetY={40} />
          {/* Angled version (for testing offset): */}
          {/* <ThreeDTestimonialMarqueeAngled items={testimonials} offsetX={-200} /> */}
        </div>
      </section>
    </main>
  );
}
