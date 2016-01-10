/// <reference path="token.ts" />
/// <reference path="tokenizationresult.ts" />
/// <reference path="tokendefinition.ts" />

class Tokenizer {

  private definitions: Array<TokenDefinition>;

  constructor() {
    this.definitions = new Array<TokenDefinition>();
  }

  addTokenDefinition(type: TokenType, regex: RegExp) {
    var tokenDef = new TokenDefinition();
    tokenDef.type = type;
    tokenDef.regex = regex;
    this.definitions.push(tokenDef);
  }

  tokenize(strIn: string): TokenizationResult {
    var retVal = new TokenizationResult();
    var sourceString = strIn;
    if (!strIn || (strIn.match(/^[\s]*$/) != null)) {
      retVal.succeed = false;
      retVal.message = "Error: Empty input given."
      return retVal;
    }
    var nextParsePosition = 0;
    var matchedType = TokenType.None;
    retVal.result = new Array<Token>();
    do {
      matchedType = TokenType.None;
      this.definitions.forEach(def => {
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
    }
    while (nextParsePosition < strIn.length && matchedType != TokenType.None);
    retVal.succeed = nextParsePosition == strIn.length;
    if (!retVal.succeed) retVal.message = "Unexpected characters at position " + nextParsePosition;    
    return retVal;
  }
}

