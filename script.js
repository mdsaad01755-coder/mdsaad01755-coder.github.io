document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();

  const preloader = document.querySelector(".preloader");
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinksContainer = document.querySelector(".nav-links");
  const navLinks = document.querySelectorAll(".nav-links a");
  const backToTop = document.querySelector(".back-top");
  const contactForm = document.querySelector(".contact-form");
  const submitButton = document.querySelector(".submit-button");
  const formStatus = document.querySelector(".form-status");
  const typedRole = document.querySelector("#typed-role");

  window.setTimeout(() => {
    preloader?.classList.add("preloader-hidden");
  }, 1500);

  const handleScroll = () => {
    const hasScrolled = window.scrollY > 30;

    header?.classList.toggle("header-solid", hasScrolled);
    backToTop?.classList.toggle("show", hasScrolled);
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll, { passive: true });

  const closeMenu = () => {
    navLinksContainer?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");

    if (menuToggle) {
      menuToggle.innerHTML = '<i data-lucide="menu"></i>';
      lucide.createIcons();
    }
  };

  menuToggle?.addEventListener("click", () => {
    const menuIsOpen = navLinksContainer?.classList.toggle("open") ?? false;

    menuToggle.setAttribute("aria-expanded", String(menuIsOpen));
    menuToggle.innerHTML = menuIsOpen
      ? '<i data-lucide="x"></i>'
      : '<i data-lucide="menu"></i>';

    lucide.createIcons();
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  const roles = [
    "Cybersecurity Analyst",
    "Penetration Tester",
    "Ethical Hacker",
    "Security Researcher"
  ];

  let roleIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  const runTypingAnimation = () => {
    if (!typedRole) {
      return;
    }

    const currentRole = roles[roleIndex];
    characterIndex += deleting ? -1 : 1;
    typedRole.textContent = currentRole.slice(0, characterIndex);

    let delay = deleting ? 34 : 70;

    if (!deleting && characterIndex === currentRole.length) {
      deleting = true;
      delay = 1450;
    } else if (deleting && characterIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 280;
    }

    window.setTimeout(runTypingAnimation, delay);
  };

  runTypingAnimation();

  const canvas = document.querySelector(".matrix-canvas");
  const context = canvas?.getContext("2d");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let columns = [];
  let matrixInterval;

  const resizeCanvas = () => {
    if (!canvas || !context) {
      return;
    }

    const deviceScale = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = window.innerWidth * deviceScale;
    canvas.height = window.innerHeight * deviceScale;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    context.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
    columns = Array(Math.ceil(window.innerWidth / 18))
      .fill(0)
      .map(() => Math.random() * -40);
  };

  const drawMatrix = () => {
    if (!context) {
      return;
    }

    context.fillStyle = "rgba(5, 9, 13, 0.12)";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "rgba(0, 255, 157, 0.23)";
    context.font = "12px monospace";

    const characters = "01<>#$";

    columns.forEach((position, index) => {
      const character = characters[Math.floor(Math.random() * characters.length)];
      context.fillText(character, index * 18, position * 18);

      if (position * 18 > window.innerHeight && Math.random() > 0.985) {
        columns[index] = 0;
      } else {
        columns[index] = position + 1;
      }
    });
  };

  resizeCanvas();
  drawMatrix();

  if (!reduceMotion) {
    matrixInterval = window.setInterval(drawMatrix, 80);
  }

  window.addEventListener("resize", resizeCanvas, { passive: true });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "Website visitor").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    const originalContent = submitButton?.innerHTML;

    if (submitButton) {
      submitButton.innerHTML = "<span>Opening email app ✓</span>";
      submitButton.disabled = true;
    }

    if (formStatus) {
      formStatus.textContent = "Your email app should open with the message prepared.";
    }

    window.location.href = `mailto:mdsaad01755@gmail.com?subject=${subject}&body=${body}`;

    window.setTimeout(() => {
      if (submitButton && originalContent) {
        submitButton.innerHTML = originalContent;
        submitButton.disabled = false;
      }

      lucide.createIcons();
    }, 3000);
  });

  window.addEventListener("beforeunload", () => {
    window.clearInterval(matrixInterval);
  });
});
