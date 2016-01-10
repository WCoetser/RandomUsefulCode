
/// <reference path="Tokenizer/Tokenizer.ts"/>

function writeContent(str: string) {
  var mainContent = <HTMLDivElement>document.querySelector("#content");
  var newElement = document.createElement("div");
  newElement.innerText = str;
  mainContent.appendChild(newElement);
}

document.addEventListener("DOMContentLoaded", function (event) {
  var btnRun = <HTMLButtonElement>document.querySelector("#btnRun");
  btnRun.addEventListener("click", ev => {
    try {
      var strIn = (<HTMLInputElement>document.querySelector("#txtIn")).value;

      var tokenizer = new Tokenizer();      
      tokenizer.addTokenDefinition(TokenType.Variable, /\:\w+/);
      tokenizer.addTokenDefinition(TokenType.Identifier, /[a-zA-Z_]\w*/);
      tokenizer.addTokenDefinition(TokenType.String, /"[^"]*"/);
      tokenizer.addTokenDefinition(TokenType.Number, /[+-]?[0-9]+[\.]?[0-9]*/);
      tokenizer.addTokenDefinition(TokenType.Whitespace, /[\s]+/);

      writeContent("Input = " + strIn);
      var result = tokenizer.tokenize(strIn);
      if (!result.succeed) {
        writeContent(result.message);
        return;
      }
      else {
        writeContent("Tokenization succeeded.");
        result.result.forEach(res => { writeContent(res.toString()); });
      }
    } catch (ex) {
      writeContent("UNHANDLED EXCEPTION: " + ex);
    }
  });
});
