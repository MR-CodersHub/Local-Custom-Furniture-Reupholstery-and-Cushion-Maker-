/* ============================================================
   CRAFTWORK ATELIER - MAIN JS
   ============================================================ */
"use strict";

// ── Theme Manager ─────────────────────────────────────────────
const ThemeManager = {
  init() {
    const saved = localStorage.getItem("ca_theme") || "light";
    this.apply(saved);
    document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
      btn.addEventListener("click", () => this.toggle());
    });
  },
  apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("ca_theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach(btn => {
      btn.innerHTML = theme === "dark"
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      btn.title = theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    });
  },
  toggle() {
    const current = document.documentElement.getAttribute("data-theme") || "light";
    this.apply(current === "dark" ? "light" : "dark");
  }
};

// ── RTL Manager ───────────────────────────────────────────────
const RTLManager = {
  init() {
    const saved = localStorage.getItem("ca_dir") || "ltr";
    this.apply(saved);
    document.querySelectorAll("[data-rtl-toggle]").forEach(btn => {
      btn.addEventListener("click", () => this.toggle());
    });
  },
  apply(dir) {
    document.documentElement.setAttribute("dir", dir);
    localStorage.setItem("ca_dir", dir);
    document.querySelectorAll("[data-rtl-toggle]").forEach(btn => {
      btn.textContent = dir === "rtl" ? "LTR" : "RTL";
    });
  },
  toggle() {
    const current = document.documentElement.getAttribute("dir") || "ltr";
    this.apply(current === "rtl" ? "ltr" : "rtl");
  }
};

// ── Navbar ────────────────────────────────────────────────────
const Navbar = {
  init() {
    this.el = document.querySelector(".navbar");
    this.hamburger = document.querySelector(".hamburger");
    this.mobileNav = document.querySelector(".mobile-nav");
    this.overlay = document.querySelector(".mobile-overlay");
    this.closeBtn = document.querySelector(".mobile-nav-close");
    if (!this.el) return;
    this.handleScroll();
    window.addEventListener("scroll", () => this.handleScroll(), { passive: true });
    if (this.hamburger) this.hamburger.addEventListener("click", () => this.openMobile());
    if (this.closeBtn) this.closeBtn.addEventListener("click", () => this.closeMobile());
    if (this.overlay) this.overlay.addEventListener("click", () => this.closeMobile());
    document.addEventListener("keydown", e => { if (e.key === "Escape") this.closeMobile(); });
    this.setActiveLink();
  },
  handleScroll() {
    const scrolled = window.scrollY > 40;
    this.el.classList.toggle("scrolled", scrolled);
    if (this.el.classList.contains("transparent-nav")) {
      this.el.classList.toggle("transparent", !scrolled);
    }
  },
  openMobile() {
    this.hamburger && this.hamburger.classList.add("open");
    this.mobileNav && this.mobileNav.classList.add("open");
    this.overlay && this.overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  },
  closeMobile() {
    this.hamburger && this.hamburger.classList.remove("open");
    this.mobileNav && this.mobileNav.classList.remove("open");
    this.overlay && this.overlay.classList.remove("open");
    document.body.style.overflow = "";
  },
  setActiveLink() {
    const page = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-link").forEach(a => {
      const href = a.getAttribute("href");
      if (href === page || (page === "" && href === "index.html")) {
        a.classList.add("active");
      }
    });
  }
};

// ── Hero Slider ───────────────────────────────────────────────
const HeroSlider = {
  init() {
    this.slides = document.querySelectorAll(".hero-slide");
    this.dots = document.querySelectorAll(".hero-dot");
    this.prevBtn = document.querySelector(".hero-arrow-prev");
    this.nextBtn = document.querySelector(".hero-arrow-next");
    if (!this.slides.length) return;
    this.current = 0;
    this.total = this.slides.length;
    this.interval = null;
    this.show(0);
    this.startAutoplay();
    if (this.prevBtn) this.prevBtn.addEventListener("click", () => { this.prev(); this.restartAutoplay(); });
    if (this.nextBtn) this.nextBtn.addEventListener("click", () => { this.next(); this.restartAutoplay(); });
    this.dots.forEach((dot, i) => dot.addEventListener("click", () => { this.goTo(i); this.restartAutoplay(); }));
  },
  show(n) {
    this.slides.forEach((s, i) => {
      s.classList.toggle("active", i === n);
      const bg = s.querySelector(".hero-bg");
      if (bg) bg.classList.toggle("zoomed", i === n);
    });
    this.dots.forEach((d, i) => d.classList.toggle("active", i === n));
    if (this.slides[n]) {
      const bg = this.slides[n].querySelector(".hero-bg");
      if (bg) setTimeout(() => bg.classList.add("zoomed"), 100);
    }
    this.current = n;
  },
  goTo(n) { this.show((n + this.total) % this.total); },
  next() { this.goTo(this.current + 1); },
  prev() { this.goTo(this.current - 1); },
  startAutoplay() { this.interval = setInterval(() => this.next(), 6000); },
  restartAutoplay() { clearInterval(this.interval); this.startAutoplay(); }
};

// ── FAQ Accordion ─────────────────────────────────────────────
const FAQ = {
  init() {
    document.querySelectorAll(".faq-question").forEach(q => {
      q.addEventListener("click", () => {
        const item = q.closest(".faq-item");
        const answer = item.querySelector(".faq-answer");
        const isOpen = item.classList.contains("open");
        // Close all
        document.querySelectorAll(".faq-item.open").forEach(open => {
          open.classList.remove("open");
          const ans = open.querySelector(".faq-answer");
          if (ans) ans.style.maxHeight = null;
        });
        // Open clicked
        if (!isOpen) {
          item.classList.add("open");
          if (answer) answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  }
};

// ── Before/After Comparison ───────────────────────────────────
const Comparison = {
  init() {
    document.querySelectorAll(".comparison-wrap").forEach(wrap => {
      const before = wrap.querySelector(".comparison-before");
      const handle = wrap.querySelector(".comparison-handle");
      if (!before || !handle) return;
      let dragging = false;

      const update = x => {
        const rect = wrap.getBoundingClientRect();
        let pct = ((x - rect.left) / rect.width) * 100;
        pct = Math.max(5, Math.min(95, pct));
        before.style.width = pct + "%";
        handle.style.left = pct + "%";
      };

      handle.addEventListener("mousedown", e => { dragging = true; e.preventDefault(); });
      handle.addEventListener("touchstart", () => { dragging = true; }, { passive: true });
      window.addEventListener("mousemove", e => { if (dragging) update(e.clientX); });
      window.addEventListener("touchmove", e => { if (dragging) update(e.touches[0].clientX); }, { passive: true });
      window.addEventListener("mouseup", () => { dragging = false; });
      window.addEventListener("touchend", () => { dragging = false; });
    });
  }
};

// ── Fabric Filter ─────────────────────────────────────────────
const FabricFilter = {
  init() {
    const tabs = document.querySelectorAll(".filter-tab");
    const items = document.querySelectorAll(".fabric-item");
    if (!tabs.length) return;
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const filter = tab.dataset.filter;
        items.forEach((item, idx) => {
          const match = filter === "all" || item.dataset.category === filter;
          item.style.display = match ? "" : "none";
          if (match) {
            item.style.opacity = "0";
            item.style.transform = "translateY(16px)";
            setTimeout(() => {
              item.style.transition = "opacity 0.35s ease, transform 0.35s ease";
              item.style.opacity = "1";
              item.style.transform = "translateY(0)";
            }, idx * 40);
          }
        });
      });
    });
  }
};

// ── Scroll Reveal ─────────────────────────────────────────────
const ScrollReveal = {
  init() {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    els.forEach(el => obs.observe(el));
  }
};

// ── Counter Animation ─────────────────────────────────────────
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll(".stat-number[data-count]");
    if (!counters.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          this.animate(e.target);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => obs.observe(c));
  },
  animate(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1800;
    const step = target / (duration / 16);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current) + suffix;
      if (current >= target) clearInterval(timer);
    }, 16);
  }
};

// ── Lightbox ──────────────────────────────────────────────────
const Lightbox = {
  init() {
    this.box = document.querySelector(".lightbox");
    if (!this.box) return;
    this.img = this.box.querySelector(".lightbox-img");
    this.caption = this.box.querySelector(".lightbox-caption");
    this.closeEl = this.box.querySelector(".lightbox-close");
    document.querySelectorAll("[data-lightbox]").forEach(el => {
      el.style.cursor = "zoom-in";
      el.addEventListener("click", () => this.open(el.dataset.lightbox, el.dataset.caption || ""));
    });
    if (this.closeEl) this.closeEl.addEventListener("click", () => this.close());
    this.box.addEventListener("click", e => { if (e.target === this.box) this.close(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") this.close(); });
  },
  open(src, cap) {
    if (!this.box) return;
    if (this.img) this.img.src = src;
    if (this.caption) this.caption.textContent = cap;
    this.box.classList.add("open");
    document.body.style.overflow = "hidden";
  },
  close() {
    if (!this.box) return;
    this.box.classList.remove("open");
    document.body.style.overflow = "";
  }
};

// ── Toast Notifications ───────────────────────────────────────
const Toast = {
  container: null,
  init() {
    this.container = document.querySelector(".toast-container");
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = "toast-container";
      document.body.appendChild(this.container);
    }
  },
  show(message, type, duration) {
    type = type || "info";
    duration = duration || 4000;
    const icons = {
      success: '<svg class="toast-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
      error: '<svg class="toast-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
      info: '<svg class="toast-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
    };
    const toast = document.createElement("div");
    toast.className = "toast toast-" + type;
    const closeBtn = document.createElement("button");
    closeBtn.className = "toast-close";
    closeBtn.setAttribute("aria-label", "Close notification");
    closeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeBtn.addEventListener("click", () => this.dismiss(toast));
    toast.innerHTML = '<span class="toast-icon">' + (icons[type] || icons.info) + '</span><span class="toast-text">' + message + '</span>';
    toast.appendChild(closeBtn);
    if (this.container) this.container.appendChild(toast);
    setTimeout(() => this.dismiss(toast), duration);
    return toast;
  },
  dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.classList.add("hiding");
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 350);
  }
};

// ── Back to Top ───────────────────────────────────────────────
const BackToTop = {
  init() {
    const btn = document.querySelector(".back-to-top");
    if (!btn) return;
    window.addEventListener("scroll", () => {
      btn.classList.toggle("visible", window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }
};

// ── Form Validation ───────────────────────────────────────────
const FormValidator = {
  init() {
    document.querySelectorAll("form[data-validate]").forEach(form => {
      form.addEventListener("submit", e => {
        e.preventDefault();
        if (this.validate(form)) {
          const btn = form.querySelector("[type=submit]");
          if (!btn) return;
          const originalText = btn.innerHTML;
          btn.innerHTML = "Sending&#8230;";
          btn.disabled = true;
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
            Toast.show("Your message has been sent successfully! We will get back to you soon.", "success");
            form.reset();
          }, 1500);
        }
      });
    });
  },
  validate(form) {
    let valid = true;
    form.querySelectorAll("[required]").forEach(field => {
      const err = field.parentElement.querySelector(".form-error");
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      field.classList.remove("error");
      if (err) err.classList.remove("show");
      if (!field.value.trim()) {
        field.classList.add("error");
        if (err) { err.textContent = "This field is required."; err.classList.add("show"); }
        valid = false;
      } else if (field.type === "email" && !emailRe.test(field.value)) {
        field.classList.add("error");
        if (err) { err.textContent = "Please enter a valid email address."; err.classList.add("show"); }
        valid = false;
      }
    });
    return valid;
  }
};

// ── File Upload ───────────────────────────────────────────────
const FileUpload = {
  init() {
    document.querySelectorAll(".file-upload").forEach(area => {
      const input = area.querySelector("input[type=file]");
      if (!input) return;
      area.addEventListener("click", () => input.click());
      area.addEventListener("dragover", e => { e.preventDefault(); area.style.borderColor = "var(--terracotta)"; });
      area.addEventListener("dragleave", () => { area.style.borderColor = ""; });
      area.addEventListener("drop", e => {
        e.preventDefault();
        area.style.borderColor = "";
        const files = e.dataTransfer ? e.dataTransfer.files : null;
        if (files && files.length) {
          const txt = area.querySelector(".file-upload-text");
          if (txt) txt.innerHTML = '<strong><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> ' + files.length + ' file(s) selected</strong>';
        }
      });
      input.addEventListener("change", () => {
        const txt = area.querySelector(".file-upload-text");
        if (txt && input.files.length) txt.innerHTML = '<strong><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px;margin-right:4px" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg> ' + input.files.length + ' file(s) selected</strong>';
      });
    });
  }
};

// ── Newsletter ────────────────────────────────────────────────
const Newsletter = {
  init() {
    document.querySelectorAll(".footer-newsletter-form").forEach(form => {
      form.addEventListener("submit", e => {
        e.preventDefault();
        const input = form.querySelector(".footer-newsletter-input");
        if (input && input.value.trim()) {
          Toast.show("Thank you for subscribing! Great content coming your way.", "success");
          input.value = "";
        }
      });
    });
  }
};

// ── Countdown Timer ───────────────────────────────────────────
const Countdown = {
  init() {
    const wrap = document.querySelector("[data-countdown]");
    if (!wrap) return;
    const endDate = new Date(wrap.dataset.countdown).getTime();
    const pad = n => String(n).padStart(2, "0");
    const tick = () => {
      const diff = endDate - Date.now();
      if (diff <= 0) return;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const days = wrap.querySelector("[data-days]");
      const hrs = wrap.querySelector("[data-hours]");
      const mins = wrap.querySelector("[data-minutes]");
      const secs = wrap.querySelector("[data-seconds]");
      if (days) days.textContent = pad(d);
      if (hrs) hrs.textContent = pad(h);
      if (mins) mins.textContent = pad(m);
      if (secs) secs.textContent = pad(s);
    };
    tick();
    setInterval(tick, 1000);
  }
};

// ── Smooth Anchor ─────────────────────────────────────────────
const SmoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener("click", e => {
        const id = a.getAttribute("href");
        const target = id !== "#" ? document.querySelector(id) : null;
        if (target) {
          e.preventDefault();
          const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h")) || 80;
          window.scrollTo({ top: target.offsetTop - navH - 16, behavior: "smooth" });
        }
      });
    });
  }
};

// ── Image Lazy Loading ────────────────────────────────────────
const LazyLoad = {
  init() {
    const imgs = document.querySelectorAll("img[data-src]");
    if (!imgs.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          obs.unobserve(img);
        }
      });
    }, { rootMargin: "200px" });
    imgs.forEach(img => obs.observe(img));
  }
};

// ── Init All ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  RTLManager.init();
  Navbar.init();
  HeroSlider.init();
  FAQ.init();
  Comparison.init();
  FabricFilter.init();
  ScrollReveal.init();
  CounterAnimation.init();
  Lightbox.init();
  Toast.init();
  BackToTop.init();
  FormValidator.init();
  FileUpload.init();
  Newsletter.init();
  Countdown.init();
  SmoothScroll.init();
  LazyLoad.init();
});

// Expose globally
window.Toast = Toast;
window.Lightbox = Lightbox;
