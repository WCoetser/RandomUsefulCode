
/// <reference path="tokentype.ts" />

class Token {

  private inputString: string;
  private fromIndex: number;
  private length: number;
  private matchedToken: TokenType;

  constructor(strIn: string, from: number, length: number, matchedToken: TokenType) {
    this.inputString = strIn;
    this.matchedToken = matchedToken;
    this.fromIndex = from;
    this.length = length;
  }

  // Setter and Getter methods 
  getInputString(): string { return this.inputString; }
  getFrom(): number { return this.fromIndex; }
  getLenth(): number { return this.length; }
  getTokenString(): string { return this.inputString.substr(this.fromIndex, this.length); }

  toString(): string {
    return "Token Type: " + this.matchedToken
      + " From: " + this.fromIndex
      + " Length: " + this.length
      + " Matched String: " + this.getTokenString();
  }
}

 