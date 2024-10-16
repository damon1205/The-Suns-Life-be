"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/*!
 * Copyright(c) ConsenSys Software Inc.
 * Copyright(c) https://consensys.net/
 * MIT Licensed
 */
var ethers_1 = require("ethers");
var availableChains_1 = require("./availableChains");
var Signer_1 = __importDefault(require("../Signer/Signer"));
var Provider_1 = __importDefault(require("../Provider/Provider"));
var utils_1 = require("../utils");
var Logger_1 = require("../Logger");
var auth_schema_1 = __importDefault(require("./auth.schema"));
var ipfsService_1 = __importDefault(require("../../services/ipfsService"));
var Auth = /** @class */ (function () {
    function Auth(opts) {
        var _a, _b;
        if (!opts.privateKey && !opts.provider) {
            Logger_1.log.throwMissingArgumentError(Logger_1.Logger.message.no_pk_or_provider, {
                location: Logger_1.Logger.location.AUTH_CONSTRUCTOR,
            });
        }
        if (opts.privateKey && opts.provider) {
            Logger_1.log.throwTooManyArgumentError(Logger_1.Logger.message.only_privateKey_or_provider_required, {
                location: Logger_1.Logger.location.AUTH_CONSTRUCTOR,
            });
        }
        if (!availableChains_1.availableChains.includes(opts.chainId)) {
            Logger_1.log.throwArgumentError(Logger_1.Logger.message.chain_not_supported, 'chainId', opts.chainId, {
                location: Logger_1.Logger.location.AUTH_CONSTRUCTOR,
            });
        }
        var result = auth_schema_1.default.validate(opts);
        if (result.error) {
            Logger_1.log.throwMissingArgumentError(result.error.details[0].message, {
                location: Logger_1.Logger.location.AUTH_CONSTRUCTOR,
            });
        }
        this.privateKey = opts.privateKey;
        this.projectId = opts.projectId;
        this.secretId = opts.secretId;
        this.chainId = opts.chainId;
        this.rpcUrl = opts.rpcUrl;
        if (!(0, utils_1.isValidString)(this.rpcUrl)) {
            this.rpcUrl = (0, utils_1.formatRpcUrl)({
                chainId: this.chainId,
                projectId: this.projectId,
            });
        }
        if (opts.ipfs) {
            this.ipfs = new ipfsService_1.default({
                projectId: (_a = opts.ipfs) === null || _a === void 0 ? void 0 : _a.projectId,
                apiKeySecret: (_b = opts.ipfs) === null || _b === void 0 ? void 0 : _b.apiKeySecret,
            });
        }
        this.setProvider(opts.provider);
    }
    Auth.prototype.getChainId = function () {
        return this.chainId;
    };
    Auth.prototype.getRpcUrl = function () {
        return this.rpcUrl;
    };
    Auth.prototype.getApiAuthHeader = function () {
        return {
            Authorization: "Basic ".concat(this.base64encode()),
        };
    };
    Auth.prototype.base64encode = function () {
        return Buffer.from("".concat(this.projectId, ":").concat(this.secretId)).toString('base64');
    };
    Auth.prototype.getIpfsClient = function () {
        return this.ipfs;
    };
    Auth.prototype.getApiAuth = function () {
        return this.base64encode();
    };
    Auth.prototype.getSigner = function () {
        if (this.privateKey) {
            return Signer_1.default.getWallet(this.privateKey, this.provider);
        }
        return this.provider.getSigner();
    };
    Auth.prototype.setProvider = function (provider) {
        if (provider instanceof ethers_1.ethers.providers.InfuraProvider) {
            Logger_1.log.throwArgumentError(Logger_1.Logger.message.unsupported_provider, 'provider', 'ethers.providers.InfuraProvider', {
                location: Logger_1.Logger.location.AUTH_SET_PROVIDER,
                error: Logger_1.Logger.message.unsupported_provider,
            });
            return;
        }
        if (this.privateKey) {
            this.provider = Provider_1.default.getProvider(this.rpcUrl);
            return;
        }
        if (provider) {
            this.provider = Provider_1.default.getInjectedProvider(provider);
        }
    };
    return Auth;
}());
exports.default = Auth;
//# sourceMappingURL=Auth.js.map