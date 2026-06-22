const isNumericString = (str) => /^[0-9]+$/.test(str);

export default function parseProgram(program) {
  const result = [];
  console.log(program);
  const words = program.trim().split(/\s+/);
  console.log(words);
  for (let idx=0; idx<words.length; idx++) {
    if (isNumericString(words[idx])) {
      result.push({
        type: "number",
        value: Number(words[idx]),
      });
      continue;
    }

    switch (words[idx]) {
      case "+": {
        result.push({ type: "plus" });
        break;
      }
      case "-": {
        result.push({ type: "minus"});
        break;
      }
      case "*": {
        result.push({ type: "mult" });
        break;
      }
      case "/": {
        result.push({ type: "div" });
        break;
      }
      case "print": {
        result.push({ type: "print" });
        break;
      }
      case "place": {
        result.push({ type: "place" });
        break;
      }
      case "move": {
        result.push({ type: "move" });
        break;
      }
      case "rmove": {
        result.push({ type: "rmove" });
        break;
      }
      case "delete": {
        result.push({ type: "delete" });
        break;
      }
      case "color": {
        result.push({ type: "color" });
        break;
      }
      case "resize": {
        result.push({ type: "resize" });
        break;
      }
      case "loop": {
        result.push({ type: "loop" });
        break;
      }
      case "if": {
        result.push({ type: "if" });
        break;
      }
      case "random": {
        result.push({ type: "random" });
        break;
      }
      case "=": {
        result.push({ type: "eq" });
        break;
      }
      case "<": {
        result.push({ type: "lt" });
        break;
      }
      case ">": {
        result.push({ type: "gt" });
        break;
      }
      case "clone": {
        result.push({ type: "clone" });
        break;
      }
      case "cloneAt": {
        result.push({ type: "cloneAt" });
        break;
      }
      case "opacity": {
        result.push({ type: "opacity" });
        break;
      }
      case "spin": {
        result.push({ type: "spin" });
        break;
      }
      case "shake": {
        result.push({ type: "shake" });
        break;
      }
      case "fade": {
        result.push({ type: "fade" });
        break;
      }
      case "dup": {
        result.push({ type: "dup" });
        break;
      }
      case "over": {
        result.push({ type: "over" });
        break;
      }
      case "swap": {
        result.push({ type: "swap" });
        break;
      }
      case "rot": {
        result.push({ type: "rot" });
        break;
      }
      case "sleep": {
        result.push({ type: "sleep" });
        break;
      }
      case "call": {
        result.push({ type: "call" });
        break;
      }
      case "[": {
        idx++;
        const bodyWords = [];
        while (idx < words.length && words[idx] !== "]") {
          bodyWords.push(words[idx]);
          idx++;
        }
        result.push({ type: "block", body: parseProgram(bodyWords.join(" ")) });
        break;
      }
      case "->": {
        idx += 1;
        if (idx === words.length) {
          alert("->の後ろには変数名を書いてください");
        }
        const variableName = words[idx];
        result.push({ type: "defineVariable", variableName });
        break;
      }
      default: {
        result.push({ type: "variable", variableName: words[idx] });
      }
    }
  }
  return result;
}
