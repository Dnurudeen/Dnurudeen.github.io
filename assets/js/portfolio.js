/**
 * Portfolio JavaScript
 * Handles theme toggle, navigation, scroll effects, and animations
 */

// Theme Management
const ThemeManager = {
  init() {
    this.applySystemTheme();
    this.bindThemeToggle();
    this.watchSystemTheme();
  },

  applySystemTheme() {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      // Use system preference as default
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      document.documentElement.setAttribute(
        "data-theme",
        prefersDark ? "dark" : "light",
      );
    }
  },

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  },

  bindThemeToggle() {
    const toggleBtn = document.querySelector(".theme-toggle");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => this.toggleTheme());
    }
  },

  watchSystemTheme() {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        // Only apply system theme if user hasn't set a preference
        if (!localStorage.getItem("theme")) {
          document.documentElement.setAttribute(
            "data-theme",
            e.matches ? "dark" : "light",
          );
        }
      });
  },
};

// Navigation Management
const NavManager = {
  init() {
    this.handleScroll();
    this.bindMobileMenu();
    this.bindSmoothScroll();
  },

  handleScroll() {
    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar?.classList.add("scrolled");
      } else {
        navbar?.classList.remove("scrolled");
      }
    });
  },

  bindMobileMenu() {
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");

    if (menuBtn && navLinks) {
      menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuBtn.classList.toggle("active");
      });

      // Close menu when clicking a link
      navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navLinks.classList.remove("active");
          menuBtn.classList.remove("active");
        });
      });
    }
  },

  bindSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          const offset = 80; // Account for fixed navbar
          const targetPosition =
            target.getBoundingClientRect().top + window.pageYOffset - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      });
    });
  },
};

// Scroll Reveal Animation
const ScrollReveal = {
  init() {
    this.observeElements();
  },

  observeElements() {
    const elements = document.querySelectorAll(".reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    elements.forEach((el) => observer.observe(el));
  },
};

// Project Tabs
const ProjectTabs = {
  init() {
    this.bindTabs();
  },

  bindTabs() {
    const tabBtns = document.querySelectorAll(".tab-btn");
    const projectSections = document.querySelectorAll(
      ".project-category-section",
    );

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");

        // Update active tab
        tabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // Show/hide sections
        projectSections.forEach((section) => {
          if (
            target === "all" ||
            section.getAttribute("data-category") === target
          ) {
            section.style.display = "block";
          } else {
            section.style.display = "none";
          }
        });
      });
    });
  },
};

// Typing Effect (Optional - for hero text)
const TypingEffect = {
  init() {
    const element = document.querySelector(".typing-text");
    if (!element) return;

    const texts = JSON.parse(element.getAttribute("data-texts") || "[]");
    if (texts.length === 0) return;

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentText = texts[textIndex];

      if (isDeleting) {
        element.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
      } else {
        element.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
      }

      let typeSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2000; // Pause at end
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        typeSpeed = 500; // Pause before next word
      }

      setTimeout(type, typeSpeed);
    };

    type();
  },
};

// Counter Animation
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll(".counter");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !entry.target.classList.contains("counted")
          ) {
            this.animateCounter(entry.target);
            entry.target.classList.add("counted");
          }
        });
      },
      { threshold: 0.5 },
    );

    counters.forEach((counter) => observer.observe(counter));
  },

  animateCounter(element) {
    const target = parseInt(element.getAttribute("data-target"));
    const suffix = element.getAttribute("data-suffix") || "";
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target + suffix;
      }
    };

    updateCounter();
  },
};

// Initialize all modules
document.addEventListener("DOMContentLoaded", () => {
  ThemeManager.init();
  NavManager.init();
  ScrollReveal.init();
  ProjectTabs.init();
  TypingEffect.init();
  CounterAnimation.init();
});

// Active nav link based on scroll position
window.addEventListener("scroll", () => {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;

    if (
      window.scrollY >= sectionTop &&
      window.scrollY < sectionTop + sectionHeight
    ) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});
