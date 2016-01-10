///<reference path="TokenDefinition.ts" />
var Tokenizer = (function () {
    function Tokenizer() {
        this.definitions = new Array();
    }
    Tokenizer.prototype.addTokenDefinition = function (definition) {
        this.definitions.push(definition);
    };

    Tokenizer.prototype.tokenize = function (strIn) {
        var retVal = new TokenizationResult();
        var sourceString = strIn;
        if (!strIn || (strIn.match(/^[\s]*$/) != null)) {
            retVal.succeed = false;
        }

        return retVal;
    };
    return Tokenizer;
})();
//# sourceMappingURL=Tokenizer.js.map
