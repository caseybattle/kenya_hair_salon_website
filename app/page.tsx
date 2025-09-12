"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Marquee } from '@/components/magicui/marquee'
import { MagicCard } from '@/components/magicui/magic-card'
import { ShimmerButton } from '@/components/magicui/shimmer-button'
import { BlurFade } from '@/components/magicui/blur-fade'
import { ThreeDMarquee } from '@/components/ui/3d-marquee'
import { ThreeDTestimonialMarquee, type Testimonial } from '@/components/ui/3d-testimonial-marquee'
import { AnimatedTestimonials } from '@/components/ui/animated-testimonials'

const testimonials: Testimonial[] = [
  {
    avatar: '/assets/model.jpg',
    name: 'Sarah M.',
    role: 'Atlanta, GA',
    quote: 'Best braiding experience ever! The attention to detail is incredible.',
    rating: 5,
  },
  {
    avatar: '/assets/kenya_hair_pics7.png',
    name: 'Jasmine T.',
    role: 'Duluth, GA',
    quote: "My hair has never looked this good! The silk press is perfection.",
    rating: 5,
  },
  {
    avatar: '/assets/kenya_hair_salon.png',
    name: 'Amanda R.',
    role: 'Bride',
    quote: 'They made me feel like a princess on my wedding day!',
    rating: 5,
  },
  {
    avatar: '/assets/luxury-hair-treatment.jpg',
    name: 'Nicole B.',
    role: 'Norcross, GA',
    quote: "The extensions look so natural! I'm in love with my new length.",
    rating: 5,
  },
  {
    avatar: '/assets/Blowout_style.png',
    name: 'Destiny K.',
    role: 'Lawrenceville, GA',
    quote: 'The blowout lasted for weeks! Absolutely worth it.',
    rating: 5,
  },
  {
    avatar: '/assets/Prcesion_cuts.png',
    name: 'Michelle P.',
    role: 'Johns Creek, GA',
    quote: 'Finally found my forever salon! The precision is unmatched.',
    rating: 5,
  },
  {
    avatar: '/assets/Braids.png',
    name: 'Keisha L.',
    role: 'Lilburn, GA',
    quote: 'Protective style done right. Zero tension, super neat—love it!',
    rating: 5,
  },
  {
    avatar: '/assets/Extensions.png',
    name: 'Tiffany H.',
    role: 'Suwanee, GA',
    quote: 'Volume, bounce, and shine—I can’t stop getting compliments.',
    rating: 5,
  },
  {
    avatar: '/assets/Bridal_events.png',
    name: 'Angela V.',
    role: 'Bride',
    quote: 'Timely, professional, and my updo survived a full day of dancing!',
    rating: 5,
  },
  {
    avatar: '/assets/Luxury_Style.png',
    name: 'Marissa J.',
    role: 'Styling Client',
    quote: 'Healthy shine and movement without heat damage—so happy!',
    rating: 5,
  },
  {
    avatar: '/assets/About_salon_supreme.png',
    name: 'Nia C.',
    role: 'Regular Client',
    quote: 'The steamer treatment is a game-changer for my scalp and curls.',
    rating: 5,
  },
  {
    avatar: '/assets/kenya_hair_salon.png',
    name: 'Olivia R.',
    role: 'Color Client',
    quote: 'Dimensional color without frying my hair—perfectly blended.',
    rating: 5,
  },
  {
    avatar: '/assets/kenya_hair_pics7.png',
    name: 'Camille P.',
    role: 'Silk Press',
    quote: 'Silk press lasted through humidity and still looked fresh.',
    rating: 5,
  },
  // Added more testimonials for continuous scroll density
  {
    avatar: '/assets/model.jpg',
    name: 'Aaliyah W.',
    role: 'Client',
    quote: 'They listened and delivered exactly what I wanted—so happy!',
    rating: 5,
  },
  {
    avatar: '/assets/Extensions.png',
    name: 'Jordan P.',
    role: 'Extensions',
    quote: 'Seamless blend and zero discomfort—top quality work.',
    rating: 5,
  },
  {
    avatar: '/assets/Braids.png',
    name: 'Brianna S.',
    role: 'Braids',
    quote: 'Neat parts, even tension, and super fast—10/10!',
    rating: 5,
  },
  {
    avatar: '/assets/Prcesion_cuts.png',
    name: 'Erica D.',
    role: 'Cut & Style',
    quote: 'The cut frames my face perfectly—I feel brand new.',
    rating: 5,
  },
  {
    avatar: '/assets/Luxury_Style.png',
    name: 'Vanessa M.',
    role: 'Styling',
    quote: 'Soft, bouncy, and healthy—exactly the look I wanted.',
    rating: 5,
  },
  {
    avatar: '/assets/Blowout_style.png',
    name: 'Kayla R.',
    role: 'Blowout',
    quote: 'Held up all weekend—super impressed with the finish.',
    rating: 5,
  },
  {
    avatar: '/assets/Bridal_events.png',
    name: 'Sophia N.',
    role: 'Bride',
    quote: 'Zero stress morning, absolutely stunning style—thank you!',
    rating: 5,
  },
  {
    avatar: '/assets/kenya_hair_salon.png',
    name: 'Mika H.',
    role: 'Color',
    quote: 'Rich tone and shine without damage—love the result.',
    rating: 5,
  },
  {
    avatar: '/assets/luxury-hair-treatment.jpg',
    name: 'Deja F.',
    role: 'Treatment',
    quote: 'Scalp feels amazing and my curls are so hydrated.',
    rating: 5,
  },
  {
    avatar: '/assets/Extensions.png',
    name: 'Nina K.',
    role: 'Extensions',
    quote: 'Invisible wefts and perfect color match—I’m obsessed.',
    rating: 5,
  },
  {
    avatar: '/assets/Braids.png',
    name: 'Tasha E.',
    role: 'Braids',
    quote: 'Protective style done right—sleek and long-lasting.',
    rating: 5,
  },
  {
    avatar: '/assets/Prcesion_cuts.png',
    name: 'Lena J.',
    role: 'Cut',
    quote: 'Clean layers and movement—photos don’t do it justice.',
    rating: 5,
  },
  {
    avatar: '/assets/Luxury_Style.png',
    name: 'Ivy Q.',
    role: 'Styling',
    quote: 'Silky finish with zero frizz—highly recommend.',
    rating: 5,
  },
  {
    avatar: '/assets/Blowout_style.png',
    name: 'Kendra Z.',
    role: 'Blowout',
    quote: 'Volume for days and super sleek look—love it.',
    rating: 5,
  },
  {
    avatar: '/assets/Bridal_events.png',
    name: 'Renee C.',
    role: 'Bridal',
    quote: 'They pinned it perfectly—stayed flawless all night.',
    rating: 5,
  },
  {
    avatar: '/assets/model.jpg',
    name: 'Yasmin O.',
    role: 'Client',
    quote: 'Friendly staff, beautiful space, and amazing results.',
    rating: 5,
  },
  {
    avatar: '/assets/kenya_hair_pics7.png',
    name: 'Paige U.',
    role: 'Silk Press',
    quote: 'Shiny, flowy, and still healthy—my new go-to salon.',
    rating: 5,
  },
];

export default function SalonSupreme() {
  useEffect(() => {
    // Smooth scrolling for navigation links
    const handleSmoothScroll = (e: Event) => {
      e.preventDefault();
      const target = e.target as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (href?.startsWith('#')) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    // Scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.querySelector('.navbar') as HTMLElement;
      if (navbar) {
        if (window.scrollY > 100) {
          navbar.style.background = 'rgba(255,255,255,0.98)';
          navbar.style.boxShadow = '0 4px 25px rgba(0,0,0,0.12)';
        } else {
          navbar.style.background = 'rgba(255,255,255,0.95)';
          navbar.style.boxShadow = '0 4px 25px rgba(0,0,0,0.08)';
        }
      }
    };

    // Load saved theme on page load
    const loadTheme = () => {
      const savedTheme = localStorage.getItem('theme');
      const html = document.documentElement;
      const themeIcon = document.getElementById('theme-icon');

      if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        if (themeIcon) themeIcon.className = 'fas fa-sun';
      } else {
        html.removeAttribute('data-theme');
        if (themeIcon) themeIcon.className = 'fas fa-moon';
      }
    };

    // Set minimum date for appointment booking (today)
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('date') as HTMLInputElement;
    if (dateInput) dateInput.setAttribute('min', today);

    // Setup event listeners
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', handleSmoothScroll);
    });

    document.querySelectorAll('.fade-in').forEach(el => {
      observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    loadTheme();

    // Gallery lightbox effect
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', function(this: HTMLElement) {
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 300);
      });
    });

    // CTA analytics tracking
    const trackEvent = (name: string, payload: Record<string, any>) => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', name, payload);
      } else {
        console.log('analytics', name, payload);
      }
    };

    const handleCtaClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const location = target?.dataset?.location || 'unknown';
      const label = target?.textContent?.trim() || 'CTA';
      trackEvent('cta_click', { location, label });
    };

    const ctaElements = Array.from(document.querySelectorAll('a.cta-primary')) as HTMLAnchorElement[];
    ctaElements.forEach((el) => el.addEventListener('click', handleCtaClick));

    // Cleanup
    return () => {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleSmoothScroll);
      });
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
      ctaElements.forEach((el) => el.removeEventListener('click', handleCtaClick));
    };
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const themeIcon = document.getElementById('theme-icon');

    if (html.getAttribute('data-theme') === 'dark') {
      html.removeAttribute('data-theme');
      if (themeIcon) themeIcon.className = 'fas fa-moon';
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      if (themeIcon) themeIcon.className = 'fas fa-sun';
      localStorage.setItem('theme', 'dark');
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const bookingData = Object.fromEntries(formData);

    const requiredFields = ['name', 'email', 'phone', 'service', 'date'];
    const missingFields = requiredFields.filter(field => !bookingData[field]);

    if (missingFields.length > 0) {
      alert('Please fill in all required fields: ' + missingFields.join(', '));
      return;
    }

    const submitButton = document.querySelector('.form-button') as HTMLButtonElement;
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Booking...';
    submitButton.disabled = true;

    setTimeout(() => {
      alert('Thank you! Your appointment request has been submitted. We will contact you within 24 hours to confirm your booking.');
      form.reset();
      if (submitButton && originalText) {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    }, 2000);
  };

  const handleMobileMenu = () => {
    console.log('Mobile menu clicked - implement mobile navigation');
  };

  return (
    <div className="font-[--font-body]">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <ul className="nav-menu">
            <li><a href="#home" className="nav-link">Home</a></li>
            <li><a href="#services" className="nav-link">Services</a></li>
            <li><a href="#testimonials" className="nav-link">Testimonials</a></li>
            <li><a href="#contact" className="nav-link">Contact Us</a></li>
          </ul>
          <div className="nav-cta">
            <button className="theme-toggle" onClick={toggleTheme} title="Toggle Dark Mode">
              <i className="fas fa-moon" id="theme-icon"></i>
            </button>
            <a href="tel:+14705145300" className="phone-number">CALL US: (470) 514-5300</a>
            <a href="#contact" className="cta-primary" data-location="navbar">Book Appointment</a>
          </div>
          <button className="mobile-menu" onClick={handleMobileMenu}>
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="social-sidebar">
          <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
          <a href="#" className="social-icon"><i className="fas fa-dollar-sign"></i></a>
        </div>

        <div className="hero-content">
          <h1 className="hero-title"><span className="first-letter">S</span>alon<span style={{ marginLeft: "-20px" }}> Supreme</span></h1>
          <p className="hero-subtitle">LUXURY HAIR SALON</p>
          <p className="hero-description">Transform your hair with Kenya's premier salon. Expert styling, natural hair care, and luxury treatments that celebrate your unique beauty.</p>
          <div className="hero-cta-group">
            <a href="#contact" className="cta-primary" data-location="hero">Book Appointment</a>
          </div>
        </div>

        <div className="hero-image">
          <div className="model-image">
            <Image
              src="/assets/SALON (3).png"
              alt="Beautiful woman with natural curls wearing Salon Supreme shirt"
              className="model-photo"
              width={800}
              height={1000}
              priority
            />
          </div>
        </div>

        <div className="accessibility-btn">
          <i className="fas fa-universal-access"></i>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section">
        <div className="container">
          <h2 className="section-title fade-in">Our Services</h2>
          <div className="services-marquee-container">
            <Marquee className="[--duration:20s]" pauseOnHover>
              <BlurFade delay={0.1} className="marquee-item">
                <MagicCard 
                  className="service-card group cursor-pointer" 
                  gradientColor="rgba(255,255,255,0.95)"
                  gradientOpacity={0.3}
                  gradientFrom="rgba(255,255,255,0.98)" 
                  gradientTo="rgba(248,187,217,0.1)"
                >
                  <div className="service-image">
                    <Image
                      src="/assets/Prcesion_cuts.png"
                      alt="Beautiful precision cut with textured curls"
                      className="service-photo"
                      fill
                      sizes="(max-width: 768px) 100vw, 280px"
                    />
                  </div>
                  <div className="service-content">
                    <h3 className="service-title">Precision Cuts & Styling</h3>
                    <p className="service-description">Expert cutting techniques tailored to your face shape and lifestyle.</p>
                    <ShimmerButton 
                      className="service-price-button" 
                      shimmerColor="rgba(255,255,255,0.8)" 
                      background="linear-gradient(135deg, #F8BBD9, #E91E63)"
                      borderRadius="12px"
                    >
                      Starting at $75
                    </ShimmerButton>
                  </div>
                </MagicCard>
              </BlurFade>

              <BlurFade delay={0.2} className="marquee-item">
                <MagicCard 
                  className="service-card group cursor-pointer" 
                  gradientColor="rgba(255,255,255,0.95)"
                  gradientOpacity={0.3}
                  gradientFrom="rgba(255,255,255,0.98)" 
                  gradientTo="rgba(233,30,99,0.1)"
                >
                  <div className="service-image">
                    <Image
                      src="/assets/Luxury_Style.png"
                      alt="Beautiful woman with luxury hair treatment results"
                      className="service-photo"
                      fill
                      sizes="(max-width: 768px) 100vw, 280px"
                    />
                  </div>
                  <div className="service-content">
                    <h3 className="service-title">Luxury Hair Treatments</h3>
                    <p className="service-description">Premium conditioning treatments, keratin therapy, and scalp rejuvenation for ultimate hair health.</p>
                    <ShimmerButton 
                      className="service-price-button" 
                      shimmerColor="rgba(255,255,255,0.8)" 
                      background="linear-gradient(135deg, #E91E63, #F8BBD9)"
                      borderRadius="12px"
                    >
                      Starting at $85
                    </ShimmerButton>
                  </div>
                </MagicCard>
              </BlurFade>

              <BlurFade delay={0.3} className="marquee-item">
                <MagicCard 
                  className="service-card group cursor-pointer" 
                  gradientColor="rgba(255,255,255,0.95)"
                  gradientOpacity={0.3}
                  gradientFrom="rgba(255,255,255,0.98)" 
                  gradientTo="rgba(248,187,217,0.1)"
                >
                  <div className="service-image">
                    <Image
                      src="/assets/Extensions.png"
                      alt="Beautiful extensions and updo hairstyle"
                      className="service-photo"
                      fill
                      sizes="(max-width: 768px) 100vw, 280px"
                    />
                  </div>
                  <div className="service-content">
                    <h3 className="service-title">Extensions & Updo&apos;s</h3>
                    <p className="service-description">Premium hair extensions, elegant updos, and special occasion styling for any event.</p>
                    <ShimmerButton 
                      className="service-price-button" 
                      shimmerColor="rgba(255,255,255,0.8)" 
                      background="linear-gradient(135deg, #F8BBD9, #E91E63)"
                      borderRadius="12px"
                    >
                      Starting at $95
                    </ShimmerButton>
                  </div>
                </MagicCard>
              </BlurFade>

              <BlurFade delay={0.4} className="marquee-item">
                <MagicCard 
                  className="service-card group cursor-pointer" 
                  gradientColor="rgba(255,255,255,0.95)"
                  gradientOpacity={0.3}
                  gradientFrom="rgba(255,255,255,0.98)" 
                  gradientTo="rgba(233,30,99,0.1)"
                >
                  <div className="service-image">
                    <Image
                      src="/assets/kenya_hair_pics7.png"
                      alt="Beautiful braided hairstyle with color highlights"
                      className="service-photo"
                      style={{ objectPosition: '50% 2%' }}
                      width={300}
                      height={200}
                    />
                  </div>
                  <div className="service-content">
                    <h3 className="service-title">Color & Highlights</h3>
                    <p className="service-description">Professional coloring services including balayage, highlights, ombre, and full color transformations.</p>
                    <ShimmerButton 
                      className="service-price-button" 
                      shimmerColor="rgba(255,255,255,0.8)" 
                      background="linear-gradient(135deg, #E91E63, #F8BBD9)"
                      borderRadius="12px"
                    >
                      Starting at $125
                    </ShimmerButton>
                  </div>
                </MagicCard>
              </BlurFade>

              <BlurFade delay={0.5} className="marquee-item">
                <MagicCard 
                  className="service-card group cursor-pointer" 
                  gradientColor="rgba(255,255,255,0.95)"
                  gradientOpacity={0.3}
                  gradientFrom="rgba(255,255,255,0.98)" 
                  gradientTo="rgba(248,187,217,0.1)"
                >
                  <div className="service-image">
                    <Image
                      src="/assets/Blowout_style.png"
                      alt="Beautiful blowout and styling results"
                      className="service-photo"
                      width={300}
                      height={200}
                    />
                  </div>
                  <div className="service-content">
                    <h3 className="service-title">Blowouts & Styling</h3>
                    <p className="service-description">Professional blowouts, sleek styles, and voluminous looks that last. Perfect for any occasion.</p>
                    <ShimmerButton 
                      className="service-price-button" 
                      shimmerColor="rgba(255,255,255,0.8)" 
                      background="linear-gradient(135deg, #F8BBD9, #E91E63)"
                      borderRadius="12px"
                    >
                      Starting at $65
                    </ShimmerButton>
                  </div>
                </MagicCard>
              </BlurFade>

              <BlurFade delay={0.6} className="marquee-item">
                <MagicCard 
                  className="service-card group cursor-pointer" 
                  gradientColor="rgba(255,255,255,0.95)"
                  gradientOpacity={0.3}
                  gradientFrom="rgba(255,255,255,0.98)" 
                  gradientTo="rgba(248,187,217,0.1)"
                >
                  <div className="service-image">
                    <Image
                      src="/assets/Bridal_events.png"
                      alt="Beautiful bridal and event styling"
                      className="service-photo"
                      width={300}
                      height={200}
                    />
                  </div>
                  <div className="service-content">
                    <h3 className="service-title">Bridal & Events</h3>
                    <p className="service-description">Special occasion styling, bridal packages, and event hair services for your big day.</p>
                    <ShimmerButton 
                      className="service-price-button" 
                      shimmerColor="rgba(255,255,255,0.8)" 
                      background="linear-gradient(135deg, #F8BBD9, #E91E63)"
                      borderRadius="12px"
                    >
                      Starting at $120
                    </ShimmerButton>
                  </div>
                </MagicCard>
              </BlurFade>
            </Marquee>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="section gallery">
        <div className="container">
          <BlurFade delay={0.1}>
            <h2 className="section-title fade-in">Our Work</h2>
            <p className="gallery-subtitle">Discover the artistry of beautiful transformations</p>
          </BlurFade>
          <div className="gallery-grid">
            <BlurFade delay={0.2} className="gallery-item fade-in">
              <MagicCard className="portfolio-card" gradientColor="rgba(255,255,255,0.1)">
                <div className="portfolio-image">
                  <div className="image-placeholder">
                    <i className="fas fa-cut"></i>
                    <span>Precision Cuts</span>
                  </div>
                  <div className="portfolio-overlay">
                    <div className="portfolio-content">
                      <h3>Textured Bob</h3>
                      <p>Modern layered cut with perfect texture</p>
                      <div className="portfolio-tags">
                        <span className="tag">Cut</span>
                        <span className="tag">Style</span>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
            
            <BlurFade delay={0.3} className="gallery-item fade-in">
              <MagicCard className="portfolio-card" gradientColor="rgba(255,255,255,0.1)">
                <div className="portfolio-image">
                  <div className="image-placeholder">
                    <i className="fas fa-palette"></i>
                    <span>Color Magic</span>
                  </div>
                  <div className="portfolio-overlay">
                    <div className="portfolio-content">
                      <h3>Balayage Highlights</h3>
                      <p>Natural sun-kissed dimensional color</p>
                      <div className="portfolio-tags">
                        <span className="tag">Color</span>
                        <span className="tag">Highlights</span>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
            
            <BlurFade delay={0.4} className="gallery-item fade-in">
              <MagicCard className="portfolio-card" gradientColor="rgba(255,255,255,0.1)">
                <div className="portfolio-image">
                  <div className="image-placeholder">
                    <i className="fas fa-magic"></i>
                    <span>Natural Beauty</span>
                  </div>
                  <div className="portfolio-overlay">
                    <div className="portfolio-content">
                      <h3>Curl Definition</h3>
                      <p>Enhanced natural texture with deep conditioning</p>
                      <div className="portfolio-tags">
                        <span className="tag">Natural</span>
                        <span className="tag">Treatment</span>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
            
            <BlurFade delay={0.5} className="gallery-item fade-in">
              <MagicCard className="portfolio-card" gradientColor="rgba(255,255,255,0.1)">
                <div className="portfolio-image">
                  <div className="image-placeholder">
                    <i className="fas fa-crown"></i>
                    <span>Bridal Elegance</span>
                  </div>
                  <div className="portfolio-overlay">
                    <div className="portfolio-content">
                      <h3>Wedding Updo</h3>
                      <p>Sophisticated bridal styling with volume</p>
                      <div className="portfolio-tags">
                        <span className="tag">Bridal</span>
                        <span className="tag">Updo</span>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
            
            <BlurFade delay={0.6} className="gallery-item fade-in">
              <MagicCard className="portfolio-card" gradientColor="rgba(255,255,255,0.1)">
                <div className="portfolio-image">
                  <div className="image-placeholder">
                    <i className="fas fa-fire"></i>
                    <span>Volume & Shine</span>
                  </div>
                  <div className="portfolio-overlay">
                    <div className="portfolio-content">
                      <h3>Luxury Blowout</h3>
                      <p>Glamorous volume with mirror-like shine</p>
                      <div className="portfolio-tags">
                        <span className="tag">Blowout</span>
                        <span className="tag">Styling</span>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
            
            <BlurFade delay={0.7} className="gallery-item fade-in">
              <MagicCard className="portfolio-card" gradientColor="rgba(255,255,255,0.1)">
                <div className="portfolio-image">
                  <div className="image-placeholder">
                    <i className="fas fa-leaf"></i>
                    <span>Hair Health</span>
                  </div>
                  <div className="portfolio-overlay">
                    <div className="portfolio-content">
                      <h3>Keratin Treatment</h3>
                      <p>Smooth, healthy hair with lasting results</p>
                      <div className="portfolio-tags">
                        <span className="tag">Treatment</span>
                        <span className="tag">Keratin</span>
                      </div>
                    </div>
                  </div>
                </div>
              </MagicCard>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <div className="container">
          <h2 className="section-title fade-in">About Salon Supreme</h2>
          <div className="about-content">
            <div className="about-text fade-in">
              <p>
                Salon Supreme &amp; Braiding is a licensed, full-service salon in Gwinnett County (Duluth, GA), specializing in braids, weaves, hair coloring, silk press treatments, locs, and more. We pair expert technique with a relaxed, welcoming atmosphere—complete with music, movies/daytime TV, and complimentary snacks—to make every visit enjoyable.
              </p>
              <p>
                Every appointment begins with a complimentary shampoo using our LED color-changing nozzle, which filters water through mineral stones to help reduce dryness and frizz. For deeper hydration, you can add a luxury conditioning service under the dryer or our Micro Nano Mist LED steamer for an additional $25—ideal for soothing dry scalps and revitalizing hair, especially during colder months.
              </p>
              <p>
                We are committed to high-quality service and results that leave you feeling refreshed, rejuvenated, and confident.
              </p>
            </div>
            <div className="about-image fade-in">
              <Image
                src="/assets/About_salon_supreme.png"
                alt="About Salon Supreme"
                width={400}
                height={400}
                className="about-photo"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section testimonials">
        <div className="container">
          <h2 className="section-title fade-in">What Clients Say</h2>
          <p className="testimonials-subtitle fade-in">Real experiences from clients who love their results</p>
          <div className="testimonials-marquee-wrap fade-in" style={{paddingLeft: 0, paddingRight: 0}}>
            {/* Replaced with Aceternity-like animated testimonials to fill container without side gaps */}
            <AnimatedTestimonials
              className="mt-2"
              items={testimonials}
              autoplay
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section contact">
        <div className="container">
          <h2 className="section-title fade-in">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info fade-in">
              <div className="contact-item">
                <i className="fas fa-map-marker-alt contact-icon"></i>
                <div>
                  <h3>Location</h3>
                  <p>3064 Old Norcross Road, Suite 130<br/>Duluth, GA 30096</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-phone contact-icon"></i>
                <div>
                  <h3>Phone</h3>
                  <p>(470) 514-5300</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-envelope contact-icon"></i>
                <div>
                  <h3>Email</h3>
                  <p>salonsupreme01@gmail.com</p>
                </div>
              </div>

              <div className="contact-item">
                <i className="fas fa-clock contact-icon"></i>
                <div>
                  <h3>Hours</h3>
                  <p>Monday: 9:30 AM - 3:30 PM<br/>Tuesday: 9:00 AM - 4:00 PM<br/>Wednesday: 9:00 AM - 8:00 PM<br/>Thursday: 9:00 AM - 5:00 PM<br/>Friday: 9:00 AM - 8:00 PM<br/>Saturday: 9:00 AM - 8:00 PM<br/>Sunday: Closed</p>
                </div>
              </div>

              {/* Google Maps embed for accuracy & directions */}
              <div style={{marginTop: '1rem'}}>
                <iframe
                  title="Salon Supreme location"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://www.google.com/maps?q=${encodeURIComponent('3064 Old Norcross Road, Suite 130, Duluth, GA 30096')}&output=embed`}
                  width="100%"
                  height="240"
                  style={{ border: 0, borderRadius: 12 }}
                />
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent('3064 Old Norcross Road, Suite 130, Duluth, GA 30096')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="contact-map-link"
                >
                  View on Google Maps
                </a>
              </div>
            </div>

            {/* Right column: Dark glass contact card */}
            <div className="booking-form fade-in">
              <h3 className="contact-card-title">Contact us</h3>
              <form id="contactForm" onSubmit={handleFormSubmit} className="contact-form-stack">
                <div className="form-group">
                  <label className="form-label" htmlFor="fullName">Full Name</label>
                  <input type="text" id="fullName" name="fullName" className="form-input" placeholder="Your full name" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" className="form-input" placeholder="your.email@example.com" required />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="company">Company (optional)</label>
                  <input type="text" id="company" name="company" className="form-input" placeholder="Company" />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone</label>
                  <input type="tel" id="phone" name="phone" className="form-input" placeholder="(470) 514-5300" />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="message">Message</label>
                  <textarea id="message" name="message" className="form-textarea" rows={5} placeholder="Type your message here" required></textarea>
                </div>

                <button type="submit" className="form-button" style={{width: '100%'}}>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <div className="footer-brand">
                <h3 className="footer-title">Salon Supreme</h3>
                <p className="footer-tagline">Where Luxury Meets Beauty</p>
                <p className="footer-description">
                  Transform your hair with Kenya's premier salon. Expert styling, natural hair care, 
                  and luxury treatments that celebrate your unique beauty.
                </p>
              </div>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Services</h4>
              <ul className="footer-links">
                <li><a href="#services">Precision Cuts</a></li>
                <li><a href="#services">Color & Highlights</a></li>
                <li><a href="#services">Hair Treatments</a></li>
                <li><a href="#services">Bridal Styling</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Quick Links</h4>
              <ul className="footer-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About Us</a></li>
                <li><a href="#testimonials">Testimonials</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4 className="footer-heading">Contact Info</h4>
              <div className="footer-contact">
                <div className="contact-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>3064 Old Norcross Road, Suite 130, Duluth, GA 30096</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-phone"></i>
                  <span>(470) 514-5300</span>
                </div>
                <div className="contact-item">
                  <i className="fas fa-envelope"></i>
                  <span>salonsupreme01@gmail.com</span>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="social-links">
              <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-link"><i className="fab fa-facebook"></i></a>
              <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-link"><i className="fab fa-tiktok"></i></a>
            </div>
            <p className="copyright">&copy; 2024 Salon Supreme. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
