document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".navbar");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section-reveal");
  const counters = document.querySelectorAll(".count");
  const form = document.querySelector(".appointment-form");
  const statusEl = document.querySelector(".form-status");

  const sliderTrack = document.querySelector(".slider-track");
  const slides = Array.from(document.querySelectorAll(".testimonial-card"));
  const prevBtn = document.querySelector(".slider-arrow.prev");
  const nextBtn = document.querySelector(".slider-arrow.next");
  const dotsContainer = document.querySelector(".slider-dots");

  let currentSlide = 0;
  let autoplayTimer = null;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;

  const setNavbarState = () => {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  const closeMenuOnMobile = () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  navToggle?.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenuOnMobile();
    });
  });

  window.addEventListener("scroll", setNavbarState, { passive: true });
  setNavbarState();

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    link.addEventListener("click", (e) => {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offsetTop = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: offsetTop, behavior: "smooth" });
      }
    });
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.16 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = Number(el.dataset.target || 0);
        const duration = 1800;
        const startTime = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString();
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target.toLocaleString();
          }
        };

        requestAnimationFrame(animate);
        observer.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  const createDots = () => {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = "";

    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider-dot";
      dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
      dot.addEventListener("click", () => {
        currentSlide = index;
        updateSlider(true);
        resetAutoplay();
      });
      dotsContainer.appendChild(dot);
    });
  };

  const dots = () => Array.from(document.querySelectorAll(".slider-dot"));

  const setSlidePosition = (animate = true) => {
    if (!sliderTrack) return;
    sliderTrack.style.transition = animate ? "transform 0.5s ease" : "none";
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    currentTranslate = -currentSlide * 100;
    prevTranslate = currentTranslate;
    updateDots();
  };

  const updateDots = () => {
    dots().forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide);
    });
  };

  const updateSlider = (animate = true) => {
    if (!slides.length) return;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    if (currentSlide >= slides.length) currentSlide = 0;
    setSlidePosition(animate);
  };

  const nextSlide = () => {
    currentSlide += 1;
    updateSlider(true);
  };

  const prevSlide = () => {
    currentSlide -= 1;
    updateSlider(true);
  };

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayTimer) clearInterval(autoplayTimer);
  };

  const resetAutoplay = () => {
    stopAutoplay();
    startAutoplay();
  };

  prevBtn?.addEventListener("click", () => {
    prevSlide();
    resetAutoplay();
  });

  nextBtn?.addEventListener("click", () => {
    nextSlide();
    resetAutoplay();
  });

  const getPositionX = (event) => {
    return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
  };

  const animation = () => {
    if (!sliderTrack) return;
    sliderTrack.style.transform = `translateX(${currentTranslate}%)`;
    if (isDragging) requestAnimationFrame(animation);
  };

  const dragStart = (event) => {
    isDragging = true;
    startX = getPositionX(event);
    stopAutoplay();
    animationID = requestAnimationFrame(animation);
    sliderTrack.style.transition = "none";
  };

  const dragMove = (event) => {
    if (!isDragging) return;
    const currentX = getPositionX(event);
    const diff = ((currentX - startX) / sliderTrack.offsetWidth) * 100;
    currentTranslate = prevTranslate + diff;
  };

  const dragEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - prevTranslate;
    if (movedBy < -12) {
      nextSlide();
    } else if (movedBy > 12) {
      prevSlide();
    } else {
      updateSlider(true);
    }

    resetAutoplay();
  };

  if (sliderTrack) {
    sliderTrack.addEventListener("touchstart", dragStart, { passive: true });
    sliderTrack.addEventListener("touchmove", dragMove, { passive: true });
    sliderTrack.addEventListener("touchend", dragEnd);

    sliderTrack.addEventListener("mousedown", dragStart);
    sliderTrack.addEventListener("mousemove", dragMove);
    sliderTrack.addEventListener("mouseup", dragEnd);
    sliderTrack.addEventListener("mouseleave", dragEnd);

    sliderTrack.addEventListener("dragstart", (e) => e.preventDefault());
  }

  createDots();
  updateSlider(false);
  startAutoplay();

  const setMinDate = () => {
    const dateInput = form?.querySelector('input[name="date"]');
    if (!dateInput) return;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    dateInput.min = `${year}-${month}-${day}`;
  };

  setMinDate();

  const showStatus = (message, type = "success") => {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.className = `form-status ${type}`;
  };

  const clearStatus = () => {
    if (!statusEl) return;
    statusEl.textContent = "";
    statusEl.className = "form-status";
  };

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    clearStatus();

    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const message = String(formData.get("message") || "").trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[0-9+\s()-]{7,}$/;

    if (name.length < 2) {
      showStatus("Please enter your full name.", "error");
      return;
    }

    if (!emailPattern.test(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }

    if (!phonePattern.test(phone)) {
      showStatus("Please enter a valid phone number.", "error");
      return;
    }

    if (!service) {
      showStatus("Please choose a treatment service.", "error");
      return;
    }

    if (!date) {
      showStatus("Please select a preferred appointment date.", "error");
      return;
    }

    if (message.length < 12) {
      showStatus("Please add a short note about your request.", "error");
      return;
    }

    showStatus(
      `Thank you, ${name}. Your request for ${service} has been received. Our team will contact you shortly.`,
      "success"
    );

    form.reset();
    setMinDate();
  });

  const handleActiveNav = () => {
    const sectionsForNav = Array.from(document.querySelectorAll("main section[id]"));
    let currentId = "";

    sectionsForNav.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 140 && rect.bottom >= 140) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute("href") || "";
      const isActive = href === `#${currentId}`;
      link.classList.toggle("active", isActive);
    });
  };

  window.addEventListener("scroll", handleActiveNav, { passive: true });
  handleActiveNav();

  window.addEventListener("resize", () => {
    updateSlider(false);
    handleActiveNav();
  });
});