$(document).ready(() => {
  let playerTurn = true;
  let currentWord = "";

  let points = new Map();
  points["player"] = 0;
  points["ai"] = 0;
  showScore();
  function renderWord() {
    $("#main-word").text("[" + currentWord + "]");
  }

  function showScore() {
    $("#score").text(`Score: Player [${points.player}], AI [${points.ai}]`);
    updateWord("");
  }

  function disableButtons() {
    $("button").attr("disabled", true);
  }

  function enableButtons() {
    $("button").attr("disabled", false);
  }

  function updateWord(word) {
    currentWord = word;
    $("#letter").val("");
    $("#letter").focus();
    renderWord();
  }

  async function aiTurn() {
    try {
      let str = currentWord;
      let { data } = await axios.get(`/api/ai/${str}`);
      if (data[0] == "-") {
        aiChallenge(data);
      } else {
        updateWord(data);
        enableButtons();
      }
    } catch (error) {
      console.log("AI could not perform turn. " + error);
    }
  }

  // TODO
  function aiChallenge(option) {
    switch (option) {
      case "-1":
        $("#alert").html("This is a word.");
        break;
      case "-2":
        $("#alert").html("This word has no continuations.");

        break;
    }
    points["ai"]++;
    showScore();
  }

  $("#submit-before").on("click", (e) => {
    e.preventDefault();
    disableButtons();
    let letter = $("#letter").val();
    updateWord(letter + currentWord);
    console.log("pressed");
    aiTurn();
  });

  $("#submit-after").on("click", (e) => {
    e.preventDefault();
    disableButtons();
    let letter = $("#letter").val();
    updateWord(currentWord + letter);
    console.log("pressed");
    aiTurn();
  });

  $("#challenge").on("click", async (e) => {
    e.preventDefault();
    disableButtons();
    let { data } = await axios.get(`/api/ai/_${currentWord}`);
    $("#alert").text(`The computer was going for ${data}!`);
    points["ai"]++;
    showScore();
    enableButtons();
  });
});
