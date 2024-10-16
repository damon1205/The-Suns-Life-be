"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ethers_1 = require("ethers");
var Logger_1 = require("../Logger");
var utils_1 = require("../utils");
var constants_1 = require("../constants");
var HasRoyalty = /** @class */ (function () {
    function HasRoyalty() {
    }
    /**
     * Set contract information from the calling class (ERC721, ERC721User, ...)
     * @param {ethers.Contract} contract instance of the deployed contract
     * @returns void
     */
    HasRoyalty.prototype.setContract = function (contract) {
        this.contractDeployed = contract;
        this.contractAddress = contract.address;
    };
    /**
     * Set royalties information for the receiver address with the provided fee
     * @param {object} params object containing all parameters
     * @param {string} params.publicAddress - address
     * @param {number} params.fee - fee
     * @notice Warning: This method will consume gas (49000 gas estimated)
     * @returns {Promise<ethers.providers.TransactionResponse>} - Transaction
     */
    HasRoyalty.prototype.setRoyalties = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            return __generator(this, function (_a) {
                if (!this.contractDeployed && !this.contractAddress) {
                    Logger_1.log.throwArgumentError(Logger_1.Logger.message.contract_not_deployed, 'contractAddress', this.contractAddress, {
                        location: Logger_1.Logger.location.HASROYALTY_SETROYALTIES,
                    });
                }
                if (!params.publicAddress || !ethers_1.utils.isAddress(params.publicAddress)) {
                    Logger_1.log.throwMissingArgumentError(Logger_1.Logger.message.invalid_public_address, {
                        location: Logger_1.Logger.location.HASROYALTY_SETROYALTIES,
                    });
                }
                if (!params.fee || !Number.isInteger(params.fee) || !(params.fee > 0 && params.fee < 10000)) {
                    Logger_1.log.throwArgumentError(Logger_1.Logger.message.fee_must_be_between_0_and_10000, 'fee', params.fee, {
                        location: Logger_1.Logger.location.HASROYALTY_SETROYALTIES,
                    });
                }
                try {
                    options = { gasLimit: constants_1.GAS_LIMIT };
                    options = (0, utils_1.addGasPriceToOptions)(options, params.gas);
                    return [2 /*return*/, this.contractDeployed.setRoyalties(params.publicAddress, params.fee, options)];
                }
                catch (error) {
                    return [2 /*return*/, Logger_1.log.throwError(Logger_1.Logger.message.ethers_error, Logger_1.Logger.code.NETWORK, {
                            location: Logger_1.Logger.location.HASROYALTY_SETROYALTIES,
                            error: error,
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    /**
     * Returns receiver address and royalty amount based on sell price
     * @param {object} params object containing all parameters
     * @param {number} params.tokenId - Token ID
     * @param {number} params.sellPrice - Sell price
     * @returns {Promise<object>} - Returns receiver address and bigNumber
     * representing royalty amount based on sell price
     */
    HasRoyalty.prototype.royaltyInfo = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.contractDeployed) {
                    Logger_1.log.throwArgumentError(Logger_1.Logger.message.contract_not_deployed, 'contractAddress', this.contractAddress, {
                        location: Logger_1.Logger.location.HASROYALTY_ROYALTYINFO,
                    });
                }
                if (!(0, utils_1.isDefined)(params.tokenId) || !Number.isInteger(params.tokenId) || params.tokenId < 0) {
                    Logger_1.log.throwMissingArgumentError(Logger_1.Logger.message.no_tokenId_supplied, {
                        location: Logger_1.Logger.location.HASROYALTY_ROYALTYINFO,
                    });
                }
                if (!params.sellPrice || !(0, utils_1.isValidPositiveNumber)(params.sellPrice)) {
                    Logger_1.log.throwMissingArgumentError(Logger_1.Logger.message.no_sell_price_supplied_or_not_valid, {
                        location: Logger_1.Logger.location.HASROYALTY_ROYALTYINFO,
                    });
                }
                try {
                    return [2 /*return*/, this.contractDeployed.royaltyInfo(params.tokenId, params.sellPrice)];
                }
                catch (error) {
                    return [2 /*return*/, Logger_1.log.throwError(Logger_1.Logger.message.ethers_error, Logger_1.Logger.code.NETWORK, {
                            location: Logger_1.Logger.location.HASROYALTY_ROYALTYINFO,
                            error: error,
                        })];
                }
                return [2 /*return*/];
            });
        });
    };
    return HasRoyalty;
}());
exports.default = HasRoyalty;
//# sourceMappingURL=hasRoyalty.js.map