"use strict";
/*!
 * Copyright(c) ConsenSys Software Inc.
 * Copyright(c) https://consensys.net/
 * MIT Licensed
 */
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var Logger_1 = require("../Logger");
var Provider = /** @class */ (function () {
    function Provider() {
    }
    Provider.getProvider = function (rpcUrl) {
        if (!rpcUrl)
            Logger_1.log.throwMissingArgumentError(Logger_1.Logger.message.no_rpcURL, {
                location: Logger_1.Logger.location.PROVIDER_GETPROVIDER,
            });
        return new ethers_1.ethers.providers.getDefaultProvider(rpcUrl);
    };
    Provider.getInjectedProvider = function (injectedProvider) {
        if (!injectedProvider)
            Logger_1.log.throwMissingArgumentError(Logger_1.Logger.message.no_provider, {
                location: Logger_1.Logger.location.PROVIDER_GETINJECTEDPROVIDER,
            });
        try {
            return new ethers_1.ethers.providers.Web3Provider(injectedProvider);
        }
        catch (error) {
            return Logger_1.log.throwArgumentError(Logger_1.Logger.message.invalid_provider, 'injectedProvider', injectedProvider, {
                location: Logger_1.Logger.location.PROVIDER_GETINJECTEDPROVIDER,
                error: error,
            });
        }
    };
    return Provider;
}());
exports.default = Provider;
//# sourceMappingURL=Provider.js.map