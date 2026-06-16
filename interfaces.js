function boxId(id) {
  return `Box${id}`;
}


export function place(ctx, x, y, w, h) {
  const box = document.createElement("div");
  box.classList.add("box");
  box.style.top = `${y}px`;
  box.style.left = `${x}px`;
  box.style.width = `${w}px`;
  box.style.height = `${h}px`;
  box.id = boxId(ctx.currentId);
  ctx.result.appendChild(box);
  $(box).css("animation", "box-pop 0.3s ease");
}

export async function move(ctx, id, x, y) {
  const targetId = boxId(id);
  const $el = $(`#${targetId}`);
  await $el.animate({ left: x, top: y }, 500).promise();
  const el = $el[0];
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "box-pop 0.3s ease";
}

export async function rmove(ctx, id, dx, dy) {
  const targetId = boxId(id);
  const $el = $(`#${targetId}`);
  const current = $el.position();
  await $el.animate({ left: current.left + dx, top: current.top + dy }, 500).promise();
  const el = $el[0];
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "box-pop 0.3s ease";
}

export function colorBox(ctx, id, r, g, b) {
  $(`#${boxId(id)}`).css("background-color", `rgb(${r}, ${g}, ${b})`);
}

export async function resizeBox(ctx, id, w, h) {
  const $el = $(`#${boxId(id)}`);
  await $el.animate({ width: w, height: h }, 300).promise();
  const el = $el[0];
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "box-pop 0.3s ease";
}

function createClone(ctx, id, x, y) {
  const $el = $(`#${boxId(id)}`);
  const box = document.createElement("div");
  box.classList.add("box");
  box.style.top = `${y}px`;
  box.style.left = `${x}px`;
  box.style.width = `${$el.width()}px`;
  box.style.height = `${$el.height()}px`;
  box.style.backgroundColor = $el.css("background-color");
  box.style.opacity = $el.css("opacity");
  box.id = boxId(ctx.currentId);
  ctx.result.appendChild(box);
  $(box).css("animation", "box-pop 0.3s ease");
}

export function cloneBox(ctx, id) {
  const $el = $(`#${boxId(id)}`);
  const pos = $el.position();
  createClone(ctx, id, pos.left, pos.top);
}

export function cloneBoxAt(ctx, id, x, y) {
  createClone(ctx, id, x, y);
}

export function opacityBox(ctx, id, val) {
  $(`#${boxId(id)}`).css("opacity", val);
}

export function spinBox(ctx, id) {
  const el = $(`#${boxId(id)}`)[0];
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "spin-anim 0.6s linear";
}

export function shakeBox(ctx, id) {
  const el = $(`#${boxId(id)}`)[0];
  el.style.animation = "none";
  void el.offsetWidth;
  el.style.animation = "shake-anim 0.5s ease";
}

export async function fadeBox(ctx, id, duration) {
  const $el = $(`#${boxId(id)}`);
  await $el.fadeOut(duration).promise();
  $el.remove();
}

export function deleteBox(ctx, id) {
  const N = 30;
  const targetId = boxId(id);
  const $el = $(`#${targetId}`);
  const pos = $el.position();
  const cx = pos.left + $el.width() / 2;
  const cy = pos.top + $el.height() / 2;
  $el.remove();
  for (let i=0; i<N; i++) {
    const size = 3 + Math.random() * 8;
    const angle = (i / N) * Math.PI * 2;
    const dist = 40 + Math.random() * 80;
    const duration = 300 + Math.random() * 400;
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const $p = $("<p>", { class: "particle" })
      .css(
        {
          width: size, height: size,
          left: cx - size / 2,
          top: cy - size /2,
          "--dx": `${dx}px`,
          "--dy": `${dy}px`,
          animation: `particle-fly ${duration}ms ease-out forwards`,
        })
      .appendTo(ctx.result);
    setTimeout(() => $p.remove(), duration);
  }
}
