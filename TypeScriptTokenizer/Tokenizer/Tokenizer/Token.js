var Token = (function () {
    function Token(strIn, from, length, matchedToken) {
        this.inputString = strIn;
        this.matchedToken = matchedToken;
        this.fromIndex = from;
        this.length = length;
    }
    // Setter and Getter methods
    Token.prototype.getInputString = function () {
        return this.inputString;
    };
    Token.prototype.getFrom = function () {
        return this.fromIndex;
    };
    Token.prototype.getLenth = function () {
        return this.length;
    };
    Token.prototype.getTokenString = function () {
        return this.inputString.substr(this.fromIndex, this.length);
    };

    Token.prototype.toString = function () {
        return "From: " + this.fromIndex + " Length: " + length + " Matched String: " + this.getTokenString();
    };
    return Token;
})();
//# sourceMappingURL=Token.js.map
