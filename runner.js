import { place, move, rmove, deleteBox, colorBox, resizeBox, cloneBox, cloneBoxAt, opacityBox, spinBox, shakeBox, fadeBox } from "./interfaces.js";

let currentId = 0;

export function resetId() {
  currentId = 0;
}

export default async function runInstructions(instructions) {
  const stack = [];
  const ctx = {
    result: $("#result")[0],
    variables: {}
  }
  await runBody(instructions, stack, ctx);
}

async function runBody(instructions, stack, ctx) {
  const queue = [...instructions];
  let idx = 0;

  while (idx < queue.length) {
    const inst = queue[idx++];
    switch (inst.type) {
      case "number": {
        stack.push(inst.value);
        break;
      }
      case "block": {
        stack.push(inst.body);
        break;
      }
      case "print": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        console.log(stack.pop())
        break;
      }
      case "plus": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(a + b);
        break;
      }
      case "minus": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(b - a);
        break;
      }
      case "mult": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(a * b);
        break;
      }
      case "div": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(a / b);
        break;
      }
      case "place": {
        if (stack.length < 4) {
          alert("stack underflow");
          return;
        }
        const h = stack.pop();
        const w = stack.pop();
        const y = stack.pop();
        const x = stack.pop();
        ctx.currentId = currentId++;
        place(ctx, x, y, w, h);
        stack.push(ctx.currentId); // 作成したBoxのIDをスタックに積む
        break;
      }
      case "move": {
        if (stack.length < 3) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        const y = stack.pop();
        const x = stack.pop();
        await move(ctx, id, x, y);
        break;
      }
      case "rmove": {
        if (stack.length < 3) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        const dy = stack.pop();
        const dx = stack.pop();
        await rmove(ctx, id, dx, dy);
        break;
      }
      case "delete": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        deleteBox(ctx, id);
        break;
      }
      case "color": {
        if (stack.length < 4) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        const b = stack.pop();
        const g = stack.pop();
        const r = stack.pop();
        colorBox(ctx, id, r, g, b);
        break;
      }
      case "resize": {
        if (stack.length < 3) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        const h = stack.pop();
        const w = stack.pop();
        await resizeBox(ctx, id, w, h);
        break;
      }
      case "loop": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const body = stack.pop();
        const n = stack.pop();
        for (let i = 0; i < n; i++) {
          queue.splice(idx, 0, ...body);
        }
        break;
      }
      case "if": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const body = stack.pop();
        const condition = stack.pop();
        if (condition) {
          queue.splice(idx, 0, ...body);
        }
        break;
      }
      case "random": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const n = stack.pop();
        stack.push(Math.floor(Math.random() * (n + 1)));
        break;
      }
      case "eq": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(b === a ? 1 : 0);
        break;
      }
      case "lt": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(b < a ? 1 : 0);
        break;
      }
      case "gt": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(b > a ? 1 : 0);
        break;
      }
      case "clone": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        ctx.currentId = currentId++;
        cloneBox(ctx, id);
        stack.push(ctx.currentId);
        break;
      }
      case "cloneAt": {
        if (stack.length < 3) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        const y = stack.pop();
        const x = stack.pop();
        ctx.currentId = currentId++;
        cloneBoxAt(ctx, id, x, y);
        stack.push(ctx.currentId);
        break;
      }
      case "opacity": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        const val = stack.pop();
        opacityBox(ctx, id, val);
        break;
      }
      case "spin": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        spinBox(ctx, id);
        break;
      }
      case "shake": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        shakeBox(ctx, id);
        break;
      }
      case "fade": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        const duration = stack.pop();
        await fadeBox(ctx, id, duration);
        break;
      }
      case "dup": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        stack.push(a);
        stack.push(a);
        break;
      }
      case "over": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(b);
        stack.push(a);
        stack.push(b);
        break;
      }
      case "swap": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(a);
        stack.push(b);
        break;
      }
      case "rot": {
        if (stack.length < 3) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        const c = stack.pop();
        stack.push(b);
        stack.push(a);
        stack.push(c);
        break;
      }
      case "sleep": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const ms = stack.pop();
        await new Promise(resolve => setTimeout(resolve, ms));
        break;
      }
      case "defineVariable": {
        ctx.variables[inst.variableName] = stack.pop();
        break;
      }
      case "variable": {
        const val = ctx.variables[inst.variableName];
        if (Array.isArray(val)) {
          queue.splice(idx, 0, ...val);
        } else {
          stack.push(val);
        }
        break;
      }
      default: {
        alert("unknown instruction");
      }
    }
  }
}
