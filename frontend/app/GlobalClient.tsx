'use client';

import { useEffect } from 'react';

export default function GlobalClient() {
  useEffect(() => {
    // ─── 1. CUSTOM CURSOR LOGIC ──────────────────────────────────────
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (dot && ring) {
      let mouseX = 0, mouseY = 0;
      let ringX = 0, ringY = 0;

      const onMouseMove = (e: MouseEvent) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
      };

      document.addEventListener('mousemove', onMouseMove);

      const animateRing = () => {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.transform = `translate(${ringX - 16}px, ${ringY - 16}px)`;
        requestAnimationFrame(animateRing);
      };
      animateRing();

      const attachHoverListeners = () => {
        const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
        interactives.forEach(el => {
          const onEnter = () => {
            ring.style.width = '52px';
            ring.style.height = '52px';
            ring.style.background = 'rgba(197, 160, 89, 0.06)';
            dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px) scale(0)`;
          };
          const onLeave = () => {
            ring.style.width = '32px';
            ring.style.height = '32px';
            ring.style.background = 'transparent';
            dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px) scale(1)`;
          };
          el.addEventListener('mouseenter', onEnter);
          el.addEventListener('mouseleave', onLeave);
        });
      };
      attachHoverListeners();

      // Re-attach hover listeners when DOM changes (e.g. navigation or updates)
      const observer = new MutationObserver(attachHoverListeners);
      observer.observe(document.body, { childList: true, subtree: true });

      return () => {
        document.removeEventListener('mousemove', onMouseMove);
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    // ─── 2. SCROLL PROGRESS INDICATOR ──────────────────────────────────
    const progressBar = document.getElementById('scroll-progress');
    if (progressBar) {
      const onScroll = () => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
        progressBar.style.width = scrolled + '%';
      };
      window.addEventListener('scroll', onScroll);
      return () => window.removeEventListener('scroll', onScroll);
    }
  }, []);

  useEffect(() => {
    // ─── 3. STAGGERED SECTION REVEAL INTERSECTION OBSERVER ──────────────
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    const attachRevealObservers = () => {
      const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
      elements.forEach(el => revealObserver.observe(el));
    };

    attachRevealObservers();

    // Re-attach when DOM shifts
    const domObserver = new MutationObserver(attachRevealObservers);
    domObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      revealObserver.disconnect();
      domObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    // ─── 4. DISMISS PRELOADER SCREEN ───────────────────────────────────
    const preloader = document.getElementById('jjr-preloader');
    if (preloader) {
      // Enforce a minimum display time of 300ms for a satisfying animation experience
      const timer = setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 300);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return null;
}
