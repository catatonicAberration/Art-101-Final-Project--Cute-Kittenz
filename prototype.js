const painting = document.querySelector(".painting");
const box = document.querySelector(".middle-box");
const key = document.querySelector(".key");
const door = document.querySelector(".door");

let keyDragOffsetX = 0;
let keyDragOffsetY = 0;

function updateKeyVisibility() {
  const paintingBounds = painting.getBoundingClientRect();
  const keyBounds = key.getBoundingClientRect();
  const covered = paintingBounds.left < keyBounds.right
    && paintingBounds.right > keyBounds.left
    && paintingBounds.top < keyBounds.bottom
    && paintingBounds.bottom > keyBounds.top;

  key.classList.toggle("is-revealed", !covered);
}

function placeKeyBehindPainting() {
  const boxBounds = box.getBoundingClientRect();
  const paintingBounds = painting.getBoundingClientRect();
  key.style.left = `${paintingBounds.left + (paintingBounds.width - key.offsetWidth) / 2 - boxBounds.left}px`;
  key.style.top = `${paintingBounds.top + (paintingBounds.height - key.offsetHeight) / 2 - boxBounds.top}px`;
}

key.addEventListener("pointerdown", (event) => {
  if (!key.classList.contains("is-revealed")) return;

  event.preventDefault();
  const bounds = key.getBoundingClientRect();
  keyDragOffsetX = event.clientX - bounds.left;
  keyDragOffsetY = event.clientY - bounds.top;
  key.classList.add("is-dragging");
  key.setPointerCapture(event.pointerId);
});

key.addEventListener("pointermove", (event) => {
  if (!key.classList.contains("is-dragging")) return;

  const boxBounds = box.getBoundingClientRect();
  key.style.left = `${event.clientX - boxBounds.left - keyDragOffsetX}px`;
  key.style.top = `${event.clientY - boxBounds.top - keyDragOffsetY}px`;
});

key.addEventListener("pointerup", (event) => {
  if (!key.classList.contains("is-dragging")) return;

  key.classList.remove("is-dragging");
  const doorBounds = door.getBoundingClientRect();
  const keyBounds = key.getBoundingClientRect();
  const keyCenterX = keyBounds.left + keyBounds.width / 2;
  const keyCenterY = keyBounds.top + keyBounds.height / 2;

  if (keyCenterX >= doorBounds.left && keyCenterX <= doorBounds.right
    && keyCenterY >= doorBounds.top && keyCenterY <= doorBounds.bottom) {
    key.classList.add("is-used");
    door.classList.add("is-open");
  }
});

key.addEventListener("pointercancel", () => key.classList.remove("is-dragging"));

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
  fallAnimation.addEventListener("finish", updateKeyVisibility, { once: true });
});

placeKeyBehindPainting();
updateKeyVisibility();
