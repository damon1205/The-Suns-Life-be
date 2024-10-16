"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
var ERC721Mintable_1 = __importDefault(require("../ContractTemplates/ERC721Mintable"));
var Logger_1 = require("../Logger");
var ContractFactory = /** @class */ (function () {
    function ContractFactory() {
    }
    ContractFactory.factory = function (template, signer) {
        if (template === constants_1.TEMPLATES.ERC721Mintable) {
            return new ERC721Mintable_1.default(signer);
        }
        return Logger_1.log.throwError(Logger_1.Logger.message.invalid_template, Logger_1.Logger.code.INVALID_ARGUMENT, {
            location: Logger_1.Logger.location.CONTRACTFACTORY_FACTORY,
        });
    };
    return ContractFactory;
}());
exports.default = ContractFactory;
//# sourceMappingURL=contractFactory.js.map