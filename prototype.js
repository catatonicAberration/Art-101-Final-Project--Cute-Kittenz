const painting = document.querySelector(".painting");
const box = document.querySelector(".middle-box");

let clickCount = 0;
let fallDistance = 0;
let totalFallDistance = 0;
let fallAnimation;

// Each click moves the painting a little farther; click four drops it to the bottom.
painting.addEventListener("click", () => {
  if (clickCount >= 4) {
    return;
  }

  clickCount += 1;

  if (clickCount === 1) {
    // Measure the gap to the box's inner bottom edge once, before the painting moves.
    const paintingBounds = painting.getBoundingClientRect();
    const boxBounds = box.getBoundingClientRect();
    const boxBottom = boxBounds.bottom - Number.parseFloat(getComputedStyle(box).borderBottomWidth);
    totalFallDistance = Math.max(0, boxBottom - paintingBounds.bottom);
  }

  const startDistance = fallDistance;
  if (clickCount === 4) {
    fallDistance = totalFallDistance;
  } else {
    fallDistance = totalFallDistance * clickCount * 0.05;
  }

  if (fallAnimation) {
    // Stop any previous motion before starting the next click's animation.
    fallAnimation.cancel();
  }

  // These offsets make the painting wobble as it falls toward its new position.
  const jiggle = [
    { offset: 0, x: 0, rotation: 0 },
    { offset: 0.15, x: -3, rotation: -4 },
    { offset: 0.3, x: 3, rotation: 4 },
    { offset: 0.45, x: -2, rotation: -3 },
    { offset: 0.6, x: 2, rotation: 3 },
    { offset: 0.75, x: -1, rotation: -1 },
    { offset: 1, x: 0, rotation: 0 },
  ];

  const keyframes = jiggle.map(({ offset, x, rotation }) => {
    const y = startDistance + (fallDistance - startDistance) * offset;
    return {
      offset,
      transform: `translateY(${y}px) translateX(${x}px) rotate(${rotation}deg)`,
    };
  });

  const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : 450;
  // Keep the destination as the base style after the combined fall-and-jiggle animation.
  painting.style.transform = `translateY(${fallDistance}px)`;
  fallAnimation = painting.animate(keyframes, { duration, easing: "ease-in-out", fill: "both" });
});