import parseProgram from "./parser.js"
import runInstructions, { resetId } from "./runner.js"

$(document).ready(function() {
    // 指定したタブをアクティブにしてビューを切り替える
    function activateTab(tab) {
      $(".tab-button").removeClass("active");
      $(`.tab-button[data-tab="${tab}"]`).addClass("active");
      $(".view").removeClass("active");
      $(`#${tab}-view`).addClass("active");
    }

    // メニューバーのタブで「入力欄」と「結果」を行き来する
    $(".tab-button").on("click", function() {
      activateTab($(this).data("tab"));
    });

    $(".run-button").on("click", async function() {
      console.log("clicked");
      console.log($("#command-input"));
      // 実行時は結果タブへ自動で切り替える
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
      resetId();
    });
  }
);
