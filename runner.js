import { place, move, rmove, deleteBox, colorBox, resizeBox, cloneBox, cloneBoxAt, opacityBox, spinBox, shakeBox, fadeBox } from "./interfaces.js";
import { renderStack, renderInstructionType, resetStackView, renderPrint, makeNumber, makeId, makeBlock } from "./debug-module.js";


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
  resetStackView();
  await runBody(instructions, stack, ctx);
}

async function runBody(instructions, stack, ctx) {
  const queue = [...instructions];
  let idx = 0;

  while (idx < queue.length) {
    const inst = queue[idx++];

    switch (inst.type) {
      case "number": {
        stack.push(makeNumber(inst.value));
        break;
      }
      case "block": {
        stack.push(makeBlock(inst.body));
        break;
      }
      case "print": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const value = stack.pop().value;
        console.log(value);
        renderPrint(value);
        break;
      }
      case "plus": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(makeNumber(b.value + a.value));
        break;
      }
      case "minus": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(makeNumber(b.value - a.value));
        break;
      }
      case "mult": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(makeNumber(b.value * a.value));
        break;
      }
      case "div": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(makeNumber(b.value / a.value));
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
        place(ctx, x.value, y.value, w.value, h.value);
        stack.push(makeId(ctx.currentId)); // 作成したBoxのIDをスタックに積む
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
        await move(ctx, id.value, x.value, y.value);
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
        await rmove(ctx, id.value, dx.value, dy.value);
        break;
      }
      case "delete": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        deleteBox(ctx, id.value);
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
        colorBox(ctx, id.value, r.value, g.value, b.value);
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
        await resizeBox(ctx, id.value, w.value, h.value);
        break;
      }
      case "loop": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const body = stack.pop();
        const n = stack.pop();
        for (let i = 0; i < n.value; i++) {
          queue.splice(idx, 0, ...body.value);
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
        if (condition.value) {
          queue.splice(idx, 0, ...body.value);
        }
        break;
      }
      case "random": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const n = stack.pop();
        stack.push(makeNumber(Math.floor(Math.random() * (n.value + 1))));
        break;
      }
      case "eq": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(makeNumber(b.value === a.value ? 1 : 0));
        break;
      }
      case "lt": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(makeNumber(b.value < a.value ? 1 : 0));
        break;
      }
      case "gt": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const a = stack.pop();
        const b = stack.pop();
        stack.push(makeNumber(b.value > a.value ? 1 : 0));
        break;
      }
      case "clone": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        ctx.currentId = currentId++;
        cloneBox(ctx, id.value);
        stack.push(makeId(ctx.currentId));
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
        cloneBoxAt(ctx, id.value, x.value, y.value);
        stack.push(makeId(ctx.currentId));
        break;
      }
      case "opacity": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        const val = stack.pop();
        opacityBox(ctx, id.value, val.value);
        break;
      }
      case "spin": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        spinBox(ctx, id.value);
        break;
      }
      case "shake": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        shakeBox(ctx, id.value);
        break;
      }
      case "fade": {
        if (stack.length < 2) {
          alert("stack underflow");
          return;
        }
        const id = stack.pop();
        const duration = stack.pop();
        await fadeBox(ctx, id.value, duration.value);
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
        await new Promise(resolve => setTimeout(resolve, ms.value));
        break;
      }
      case "defineVariable": {
        ctx.variables[inst.variableName] = stack.pop();
        break;
      }
      case "variable": {
        stack.push(ctx.variables[inst.variableName]);
        break;
      }
      case "call": {
        if (stack.length === 0) {
          alert("stack underflow");
          return;
        }
        const block = stack.pop();
        if (block?.type !== "block") {
          alert("call expects a block");
          return;
        }
        queue.splice(idx, 0, ...block.value);
        break;
      }
      default: {
        alert("unknown instruction");
      }
    }

    renderInstructionType(inst.type);

    console.log(stack);
    renderStack([...stack]);

    const interval = $("#debug-speed").val();
    console.log(interval);
    await new Promise(resolve => setTimeout(resolve, interval));
  }
}
