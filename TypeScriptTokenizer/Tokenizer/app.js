var TokenType;
(function (TokenType) {
    TokenType[TokenType["None"] = 0] = "None";
    TokenType[TokenType["Identifier"] = 1] = "Identifier";
    TokenType[TokenType["Variable"] = 2] = "Variable";
    TokenType[TokenType["String"] = 3] = "String";
    TokenType[TokenType["Number"] = 4] = "Number";
    TokenType[TokenType["Whitespace"] = 5] = "Whitespace";
})(TokenType || (TokenType = {}));
/// <reference path="tokentype.ts" />
var Token = (function () {
    function Token(strIn, from, length, matchedToken) {
        this.inputString = strIn;
        this.matchedToken = matchedToken;
        this.fromIndex = from;
        this.length = length;
    }
    // Setter and Getter methods 
    Token.prototype.getInputString = function () { return this.inputString; };
    Token.prototype.getFrom = function () { return this.fromIndex; };
    Token.prototype.getLenth = function () { return this.length; };
    Token.prototype.getTokenString = function () { return this.inputString.substr(this.fromIndex, this.length); };
    Token.prototype.toString = function () {
        return "Token Type: " + this.matchedToken
            + " From: " + this.fromIndex
            + " Length: " + this.length
            + " Matched String: " + this.getTokenString();
    };
    return Token;
})();
/// <reference path="token.ts" />
var TokenizationResult = (function () {
    function TokenizationResult() {
    }
    return TokenizationResult;
})();
/// <reference path="tokentype.ts" />
var TokenDefinition = (function () {
    function TokenDefinition() {
    }
    return TokenDefinition;
})();
/// <reference path="token.ts" />
/// <reference path="tokenizationresult.ts" />
/// <reference path="tokendefinition.ts" />
var Tokenizer = (function () {
    function Tokenizer() {
        this.definitions = new Array();
    }
    Tokenizer.prototype.addTokenDefinition = function (type, regex) {
        var tokenDef = new TokenDefinition();
        tokenDef.type = type;
        tokenDef.regex = regex;
        this.definitions.push(tokenDef);
    };
    Tokenizer.prototype.tokenize = function (strIn) {
        var retVal = new TokenizationResult();
        var sourceString = strIn;
        if (!strIn || (strIn.match(/^[\s]*$/) != null)) {
            retVal.succeed = false;
            retVal.message = "Error: Empty input given.";
            return retVal;
        }
        var nextParsePosition = 0;
        var matchedType = TokenType.None;
        retVal.result = new Array();
        do {
            matchedType = TokenType.None;
            this.definitions.forEach(function (def) {
                var match = def.regex.exec(sourceString);
                if (match != null && match.index == 0 && match.length >= 1) {
                    // Use the string indexOf member to skip the unwanted characters
                    var token = new Token(strIn, nextParsePosition, match[0].length, def.type);
                    retVal.result.push(token);
                    // Note: It is neccesary to skip by the amount adding in non-matched characters from the first group.
                    nextParsePosition += match[0].length;
                    sourceString = sourceString.substr(match[0].length);
                    // Continue to next token 
                    matchedType = def.type;
                    return;
                }
            });
        } while (nextParsePosition < strIn.length && matchedType != TokenType.None);
        retVal.succeed = nextParsePosition == strIn.length;
        if (!retVal.succeed)
            retVal.message = "Unexpected characters at position " + nextParsePosition;
        return retVal;
    };
    return Tokenizer;
})();
/// <reference path="Tokenizer/Tokenizer.ts"/>
function writeContent(str) {
    var mainContent = document.querySelector("#content");
    var newElement = document.createElement("div");
    newElement.innerText = str;
    mainContent.appendChild(newElement);
}
document.addEventListener("DOMContentLoaded", function (event) {
    var btnRun = document.querySelector("#btnRun");
    btnRun.addEventListener("click", function (ev) {
        try {
            var strIn = document.querySelector("#txtIn").value;
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
                result.result.forEach(function (res) { writeContent(res.toString()); });
            }
        }
        catch (ex) {
            writeContent("UNHANDLED EXCEPTION: " + ex);
        }
    });
});
//# sourceMappingURL=app.js.map