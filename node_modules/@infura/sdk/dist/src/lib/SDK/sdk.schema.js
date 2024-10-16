"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadataFolderSchema = exports.metadataSchema = exports.loadContractOptions = exports.deployOptions = void 0;
var joi_1 = __importDefault(require("joi"));
var constants_1 = require("../NFT/constants");
exports.deployOptions = joi_1.default.object({
    template: (_a = joi_1.default.string()).valid.apply(_a, Object.values(constants_1.TEMPLATES)),
    params: joi_1.default.object({
        name: joi_1.default.string().required(),
        symbol: joi_1.default.string().required(),
        contractURI: joi_1.default.string()
            .uri({
            scheme: ['ipfs', /https?/],
        })
            .required(),
        gas: joi_1.default.string().optional(),
    }),
}).required();
exports.loadContractOptions = joi_1.default.object({
    template: (_b = joi_1.default.string()).valid.apply(_b, Object.values(constants_1.TEMPLATES)),
    contractAddress: joi_1.default.string().required(),
}).required();
exports.metadataSchema = joi_1.default.object({
    metadata: joi_1.default.string().required(),
}).required();
exports.metadataFolderSchema = joi_1.default.object({
    metadata: joi_1.default.array().items(joi_1.default.string()).required(),
}).required();
//# sourceMappingURL=sdk.schema.js.map