/* ==========================================================================
   MERIDIAN DENTAL CLINIC — JAVASCRIPT
   Premium UX Interactions & Animations
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     1. NAVBAR SCROLL EFFECT
  =============================== */
  const header = document.querySelector("header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });


  /* ===============================
     2. MOBILE MENU TOGGLE
  =============================== */
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuBtn.classList.toggle("open");
    });
  }


  /* ===============================
     3. SMOOTH SCROLL
  =============================== */
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener("click", (e) => {
      const target = document.querySelector(link.getAttribute("href"));

      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: "smooth"
        });
      }
    });
  });


  /* ===============================
     4. ACTIVE NAV LINK ON SCROLL
  =============================== */
  const sections = document.querySelectorAll("section[id]");

  window.addEventListener("scroll", () => {
    let current = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (pageYOffset >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    document.querySelectorAll(".nav-links a").forEach(a => {
      a.classList.remove("active");
      if (a.getAttribute("href") === `#${current}`) {
        a.classList.add("active");
      }
    });
  });


  /* ===============================
     5. SCROLL REVEAL ANIMATION
  =============================== */
  const revealElements = document.querySelectorAll(".reveal");

  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.85;

    revealElements.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;

      if (elementTop < triggerBottom) {
        el.classList.add("active");
      }
    });
  };

  window.addEventListener("scroll", revealOnScroll);
  revealOnScroll();


  /* ===============================
     6. COUNTER ANIMATION
  =============================== */
  const counters = document.querySelectorAll(".counter");

  const runCounters = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute("data-target");
      let count = 0;
      const speed = target / 200;

      const updateCount = () => {
        if (count < target) {
          count += speed;
          counter.innerText = Math.ceil(count);
          requestAnimationFrame(updateCount);
        } else {
          counter.innerText = target;
        }
      };

      updateCount();
    });
  };

  const counterSection = document.querySelector(".stats");
  if (counterSection) {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        runCounters();
        observer.disconnect();
      }
    }, { threshold: 0.5 });

    observer.observe(counterSection);
  }


  /* ===============================
     7. TESTIMONIAL SLIDER
  =============================== */
  let currentSlide = 0;
  const slides = document.querySelectorAll(".testimonial");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) slide.classList.add("active");
    });
  }

  if (slides.length > 0) {
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }, 5000);
  }


  /* ===============================
     8. BACK TO TOP BUTTON
  =============================== */
  const toTopBtn = document.querySelector(".back-to-top");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      toTopBtn.classList.add("show");
    } else {
      toTopBtn.classList.remove("show");
    }
  });

  if (toTopBtn) {
    toTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  /* ===============================
     9. FORM VALIDATION
  =============================== */
  const form = document.querySelector("form");

  if (form) {
    form.addEventListener("submit", (e) => {
      const inputs = form.querySelectorAll("input, textarea");
      let valid = true;

      inputs.forEach(input => {
        if (input.value.trim() === "") {
          valid = false;
          input.classList.add("error");
        } else {
          input.classList.remove("error");
        }
      });

      if (!valid) {
        e.preventDefault();
        alert("Please fill all required fields.");
      }
    });
  }


  /* ===============================
     10. LOADING ANIMATION
  =============================== */
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });

});