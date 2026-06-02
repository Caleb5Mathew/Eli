/* Eli — interaction layer
   native scroll-snap + progressive enhancement
   ------------------------------------------------ */
(function () {
  "use strict";

  var track  = document.getElementById("track");
  var slides = Array.prototype.slice.call(track.querySelectorAll(".slide"));
  var bar    = document.getElementById("bar");
  var dotsEl = document.getElementById("dots");
  var prevBtn  = document.getElementById("prev");
  var nextBtn  = document.getElementById("next");
  var hint   = document.getElementById("hint");
  var total  = slides.length;
  var current = 0;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* stagger each poem line */
  slides.forEach(function (s) {
    var lines = s.querySelectorAll(".line");
    Array.prototype.forEach.call(lines, function (l, i) {
      l.style.setProperty("--li", i);
    });
  });

  /* build pagination dots */
  slides.forEach(function (s, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.setAttribute("aria-label", "Movement " + (i + 1) + " of " + total);
    if (i === 0) b.setAttribute("aria-current", "true");
    b.addEventListener("click", function () { goTo(i); });
    dotsEl.appendChild(b);
  });
  var dots = Array.prototype.slice.call(dotsEl.children);

  function setActive(i) {
    if (i === current) return;
    current = i;
    slides.forEach(function (s, n) { s.classList.toggle("is-active", n === i); });
    dots.forEach(function (d, n) {
      if (n === i) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });
    bar.style.width = ((i + 1) / total) * 100 + "%";
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === total - 1;
  }

  function goTo(i) {
    i = Math.max(0, Math.min(total - 1, i));
    slides[i].scrollIntoView({
      behavior: reduce ? "auto" : "smooth",
      inline: "start",
      block: "nearest"
    });
    hideHint();
  }

  /* active-slide detection */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && e.intersectionRatio >= 0.55) {
        setActive(slides.indexOf(e.target));
      }
    });
  }, { root: track, threshold: [0.55, 0.75] });
  slides.forEach(function (s) { io.observe(s); });

  /* mark first slide active immediately */
  slides[0].classList.add("is-active");
  bar.style.width = (1 / total) * 100 + "%";
  prevBtn.disabled = true;

  /* buttons */
  prevBtn.addEventListener("click", function () { goTo(current - 1); });
  nextBtn.addEventListener("click", function () { goTo(current + 1); });

  /* keyboard */
  window.addEventListener("keydown", function (e) {
    switch (e.key) {
      case "ArrowRight": case "PageDown": case " ":
        e.preventDefault(); goTo(current + 1); break;
      case "ArrowLeft": case "PageUp":
        e.preventDefault(); goTo(current - 1); break;
      case "Home": e.preventDefault(); goTo(0); break;
      case "End":  e.preventDefault(); goTo(total - 1); break;
    }
  });

  /* convert vertical wheel / trackpad into horizontal movement on desktop */
  var wheelLock = false;
  track.addEventListener("wheel", function (e) {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return; /* real horizontal scroll */
    e.preventDefault();
    if (wheelLock) return;
    wheelLock = true;
    goTo(current + (e.deltaY > 0 ? 1 : -1));
    setTimeout(function () { wheelLock = false; }, 620);
  }, { passive: false });

  /* mouse click-drag (mouse only — never hijack native touch momentum) */
  var dragging = false, startX = 0, startScroll = 0, moved = false;
  track.addEventListener("pointerdown", function (e) {
    if (e.pointerType !== "mouse") return;
    dragging = true; moved = false;
    startX = e.clientX; startScroll = track.scrollLeft;
    track.style.scrollSnapType = "none";
    track.setPointerCapture(e.pointerId);
    track.style.cursor = "grabbing";
  });
  track.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (Math.abs(dx) > 4) moved = true;
    track.scrollLeft = startScroll - dx;
  });
  function endDrag(e) {
    if (!dragging) return;
    dragging = false;
    track.style.cursor = "";
    track.style.scrollSnapType = "";
    if (moved) {
      hideHint();
      var w = track.clientWidth;
      goTo(Math.round(track.scrollLeft / w));
    }
  }
  track.addEventListener("pointerup", endDrag);
  track.addEventListener("pointercancel", endDrag);

  /* hint fades after first interaction or 5s */
  function hideHint() { if (hint) hint.classList.add("hide"); }
  track.addEventListener("scroll", function () {
    if (track.scrollLeft > 24) hideHint();
  }, { passive: true });
  setTimeout(hideHint, 5200);

  /* keep position sane on resize / orientation change */
  var rt;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      slides[current].scrollIntoView({ behavior: "auto", inline: "start", block: "nearest" });
    }, 150);
  });
})();
