"use strict";
/*!
 * Copyright(c) ConsenSys Software Inc.
 * Copyright(c) https://consensys.net/
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var Logger_1 = require("../Logger");
var Signer = /** @class */ (function () {
    function Signer() {
    }
    Signer.getWallet = function (privateKey, provider) {
        if (!privateKey)
            Logger_1.log.throwMissingArgumentError(Logger_1.Logger.message.no_privateKey, {
                location: Logger_1.Logger.location.SIGNER_GETWALLET,
            });
        if (!provider)
            Logger_1.log.throwMissingArgumentError(Logger_1.Logger.message.no_provider, {
                location: Logger_1.Logger.location.SIGNER_GETWALLET,
            });
        return new ethers_1.ethers.Wallet(privateKey, provider);
    };
    return Signer;
}());
exports.default = Signer;
//# sourceMappingURL=Signer.js.map