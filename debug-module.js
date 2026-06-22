let prevStack = [];

export const makeNumber = (value) => ({ type: "number", value });
export const makeId = (value) => ({ type: "id", value });
export const makeBlock = (value) => ({ type: "block", value });

function labelOf(v) {
  switch (v?.type) {
    case "id": return `ID(${v.value})`;
    case "number": return `Number(${v.value})`;
    case "block": return `block(${v.value.length})`;
    default: return String(v);
  }
}

export function renderStack([...stack]) {
  const view = $("#stack-view");

  // 消去アニメ中の要素を除いた、いま表示中のスタック要素
  // DOM順なので下から上
  const children = view.children(".stack-element").not(".popping");

  // 底から一致している共通部分の長さを求める
  // prev    -> 1 2 3 4 5 6
  // current -> 1 2 3 8
  // common  -> 1 2 3
  let common = 0;
  while (
    common < prevStack.length &&
    common < stack.length &&
    prevStack[common] === stack[common]
  ) {
    common += 1;
  }

  // 共通部分より上を pop 上から下なので、逆順で見ていく
  for (let i = prevStack.length - 1; i >= common; i--) {
    const el = children.eq(i);
    el.addClass("popping");
    el.one("animationend", () => el.remove());
  }

  // おニューの部分をpushする。こっちは逆に下から上
  for (let i = common; i < stack.length; i++) {
    const el = $(`<div class="stack-element pushing">${labelOf(stack[i])}</div>`);
    el.one("animationend", () => el.removeClass("pushing"));
    el.appendTo(view);
  }

  prevStack = stack;
}

export function resetStackView() {
  $("#stack-view").empty();
  prevStack = [];
}

export function renderInstructionType(type) {
  $("#inst-name").text(type);

  $("#inst-name")[0].style.animation = "none";
  void $("#inst-name")[0].offsetWidth;
  $("#inst-name")[0].style.animation = "box-pop 0.3s ease";
}

export function renderPrint(value) {
  const el = $('<div class="print-output"></div>').text(value);
  el.one("animationend", () => el.remove());
  $("#debug-info").append(el);
}
