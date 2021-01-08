$(document).ready(() => {
  let playerTurn = true;
  let currentWord = "";

  let points = new Map();
  points["player"] = 0;
  points["ai"] = 0;

  function renderWord() {
    $("#main-word").text("[" + currentWord + "]");
  }

  function disableButtons() {
    $("button").attr("disabled", true);
  }

  function enableButtons() {
    $("button").attr("disabled", false);
  }

  function updateWord(word) {
    currentWord = word;
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
        break;

      case "-2":
        break;
    }
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
  setInterval(() => {
    if (playerTurn) {
    }
  }, 1000);
});
