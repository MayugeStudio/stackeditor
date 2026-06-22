import parseProgram from "./parser.js"
import runInstructions, { resetId } from "./runner.js"

const example1 = `
0 -> i 20 [
i 38 * 30 +
250
30 30
place -> _
i 1 + -> i
] loop
0 -> i
20 [
i 13 *
255 i 13 * -
220
i color
i 1 + -> i
] loop
0 -> i
20 [
i spin
60 sleep
i 1 + -> i
] loop`

const example2 = `
[
  700 random 100 + -> x
  x 420 8 24 place -> r
  255 220 80 r color
  x 140 random 60 + r move
  r delete
  300 sleep
] -> firework
8 [ firework call ] loop`


$(document).ready(function() {
    // タブ関連
    function activateTab(tab) {
      $(".tab-button").removeClass("active");
      $(`.tab-button[data-tab="${tab}"]`).addClass("active");
      $(".view").removeClass("active");
      $(`#${tab}-view`).addClass("active");
    }

    $(".tab-button").on("click", function() {
      activateTab($(this).data("tab"));
    });

    // プログラム例表示ボタン
    $(".example-1-button").on("click", function() {
      console.log("example1")
      //activateTab("editor");
      $("#command-input").val(example1);
    });

    $(".example-2-button").on("click", function() {
      console.log("example2")
      $("#command-input").val(example2);
    });

    // 実行ボタンなど
    $(".run-button").on("click", async function() {
      console.log("clicked");
      console.log($("#command-input"));

      activateTab("result");
      const program = $("#command-input").val();
      const insts = parseProgram(program);
      for (const inst of insts) {
        console.log(inst);
      }
      await runInstructions(insts);
    });

    $(".clear-button").on("click", function() {
      console.log("clear");
      $("#result").empty();
      $("#stack-view").empty();
      resetId();
    });


    $(".clear-and-run-button").on("click", async function() {
      console.log("clear-and-run");
      $("#result").empty();
      $("#stack-view").empty();
      resetId();

      activateTab("result");
      const program = $("#command-input").val();
      const insts = parseProgram(program);
      for (const inst of insts) {
        console.log(inst);
      }
      await runInstructions(insts);
    });

    // その他イベント
    $(".ref").on("click", function() {
      console.log($(this).attr('data-example'));
      $("#command-input").val($(this).attr('data-example'));
    });

    $("#debug-speed").on("input", function() {
      let interval = $("#debug-speed").val();
      $("#debug-speed-label").text(`命令間隔: ${interval}`);
    });

    let interval = $("#debug-speed").val();
    $("#debug-speed-label").text(`命令間隔: ${interval}`);
});
