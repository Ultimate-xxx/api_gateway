(function () {
  var featuresSection = document.querySelector(".features");
  var viewport = document.getElementById("featuresViewport");
  var track = document.getElementById("featuresTrack");
  var panels = track ? track.querySelectorAll(".features-panel") : [];
  var dots = document.querySelectorAll(".page-dot");

  if (!featuresSection || !viewport || !track || dots.length !== 2 || panels.length < 3) {
    return;
  }

  var currentIndex = 0;
  var autoplayTimer = null;
  var intervalMs = 5000;

  function setTransition(enabled) {
    track.style.transition = enabled
      ? "transform 0.8s cubic-bezier(0.65, 0, 0.35, 1)"
      : "none";
  }

  function updateDotsByRealIndex(realIndex) {
    dots.forEach(function (dot, dotIndex) {
      if (dotIndex === realIndex) {
        dot.classList.add("is-active");
      } else {
        dot.classList.remove("is-active");
      }
    });
  }

  function getOffsetForPanel(index) {
    var panel = panels[index];
    return panel ? panel.offsetLeft : 0;
  }

  function getNormalizedOffset(index) {
    var firstOffset = getOffsetForPanel(0);
    return getOffsetForPanel(index) - firstOffset;
  }

  function updateView(index, animate) {
    if (animate === undefined) {
      animate = true;
    }

    currentIndex = index;
    setTransition(animate);
    track.style.transform = "translate3d(" + (-getNormalizedOffset(index)) + "px, 0, 0)";
    updateDotsByRealIndex(index === 1 ? 1 : 0);
  }

  function nextPanel() {
    var nextIndex = currentIndex + 1;
    if (nextIndex > 2) {
      nextIndex = 1;
    }
    updateView(nextIndex);
  }

  function jumpToRealPanel(panelIndex) {
    updateView(panelIndex, false);
    track.offsetHeight;
    setTransition(true);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      window.clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = window.setInterval(nextPanel, intervalMs);
  }

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      var targetIndex = Number(dot.getAttribute("data-index"));
      if (targetIndex === 0 || targetIndex === 1) {
        if (currentIndex === 2) {
          jumpToRealPanel(0);
        }
        updateView(targetIndex);
        startAutoplay();
      }
    });
  });

  track.addEventListener("transitionend", function () {
    if (currentIndex === 2) {
      jumpToRealPanel(0);
    }
  });

  window.addEventListener("resize", function () {
    updateView(currentIndex, false);
  });

  featuresSection.addEventListener("mouseenter", stopAutoplay);
  featuresSection.addEventListener("mouseleave", startAutoplay);

  updateView(0, false);
  startAutoplay();
})();

(function () {
  var scrollIndicator = document.querySelector(".hero-scroll-indicator");
  if (!scrollIndicator) {
    return;
  }

  scrollIndicator.addEventListener("click", function () {
    window.scrollBy({
      top: window.innerHeight,
      behavior: "smooth"
    });
  });
})();

(function () {
  var viewport = document.getElementById("useCasesViewport");
  var track = document.getElementById("useCasesTrack");
  var prevBtn = document.getElementById("useCasesPrev");
  var nextBtn = document.getElementById("useCasesNext");
  var dots = document.querySelectorAll(".use-dot");
  var realSlides = track ? track.querySelectorAll(".use-case-item:not(.is-clone)") : [];

  if (!viewport || !track || !prevBtn || !nextBtn || dots.length === 0 || realSlides.length === 0) {
    return;
  }

  var realCount = Math.min(dots.length, realSlides.length);
  var currentIndex = 1;
  var timer = null;
  var intervalMs = 6000;
  var slideWidth = viewport.clientWidth;
  var isTransitioning = false;

  function setTransition(enabled) {
    track.style.transition = enabled
      ? "transform 1s cubic-bezier(0.65, 0, 0.35, 1)"
      : "none";
  }

  function updatePosition(animate) {
    slideWidth = viewport.clientWidth;
    setTransition(animate);
    track.style.transform = "translate3d(" + (-currentIndex * slideWidth) + "px, 0, 0)";
  }

  function updateDots() {
    var realIndex = currentIndex - 1;
    if (realIndex < 0) {
      realIndex = realCount - 1;
    }
    if (realIndex >= realCount) {
      realIndex = 0;
    }

    dots.forEach(function (dot, dotIndex) {
      if (dotIndex === realIndex) {
        dot.classList.add("is-active");
      } else {
        dot.classList.remove("is-active");
      }
    });
  }

  function goTo(index, animate) {
    if (animate && isTransitioning) {
      return;
    }

    currentIndex = index;
    if (animate) {
      isTransitioning = true;
    }
    updatePosition(animate);
    updateDots();
  }

  function nextSlide() {
    goTo(currentIndex + 1, true);
  }

  function prevSlide() {
    goTo(currentIndex - 1, true);
  }

  function stopAuto() {
    if (timer) {
      window.clearInterval(timer);
      timer = null;
    }
  }

  function startAuto() {
    stopAuto();
    timer = window.setInterval(nextSlide, intervalMs);
  }

  nextBtn.addEventListener("click", function () {
    nextSlide();
    startAuto();
  });

  prevBtn.addEventListener("click", function () {
    prevSlide();
    startAuto();
  });

  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      var target = Number(dot.getAttribute("data-index"));
      if (target >= 0 && target < realCount) {
        goTo(target + 1, true);
        startAuto();
      }
    });
  });

  track.addEventListener("transitionend", function () {
    isTransitioning = false;

    if (currentIndex >= realCount + 1) {
      var wrappedForward = ((currentIndex - 1) % realCount) + 1;
      goTo(wrappedForward, false);
    } else if (currentIndex <= 0) {
      var normalized = ((currentIndex % realCount) + realCount) % realCount;
      var wrappedBackward = normalized === 0 ? realCount : normalized;
      goTo(wrappedBackward, false);
    }
  });

  viewport.addEventListener("mouseenter", stopAuto);
  viewport.addEventListener("mouseleave", startAuto);

  window.addEventListener("resize", function () {
    isTransitioning = false;
    updatePosition(false);
  });

  goTo(1, false);
  startAuto();
})();