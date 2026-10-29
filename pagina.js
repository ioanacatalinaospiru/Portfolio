const back = document.querySelector(".back");
const img = back.querySelector("img");
const IS_TOUCH = window.matchMedia("(hover: none) and (pointer: coarse)").matches;

let mask = null;
function buildMask() {
  try {
    const W = 90, H = Math.max(1, Math.round(W * img.naturalHeight / img.naturalWidth));
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const ctx = cv.getContext("2d");
    ctx.drawImage(img, 0, 0, W, H);
    const px = ctx.getImageData(0, 0, W, H).data;
    mask = { W, H, px };
  } catch (e) { mask = null; }
}
if (img.complete && img.naturalWidth) buildMask(); else img.addEventListener("load", buildMask);

function hit(x, y) {
  const r = back.getBoundingClientRect();
  const u = (x - r.left) / r.width, v = (y - r.top) / r.height;
  if (u < 0 || u >= 1 || v < 0 || v >= 1) return false;
  if (!mask) return true;
  const i = (Math.floor(v * mask.H) * mask.W + Math.floor(u * mask.W)) * 4 + 3;
  return mask.px[i] > 100;
}

if (!IS_TOUCH) {
  document.addEventListener("pointermove", (e) => {
    const on = hit(e.clientX, e.clientY);
    back.classList.toggle("is-active", on);
    document.body.style.cursor = on ? "pointer" : "";
  });
  document.addEventListener("pointerleave", () => back.classList.remove("is-active"));
}

document.addEventListener("click", (e) => {
  if (hit(e.clientX, e.clientY)) back.click(); // -> index.html
});
