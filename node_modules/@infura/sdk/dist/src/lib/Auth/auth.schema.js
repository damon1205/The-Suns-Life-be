"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var joi_1 = __importDefault(require("joi"));
exports.default = joi_1.default.object({
    privateKey: joi_1.default.string().optional(),
    projectId: joi_1.default.string().required(),
    secretId: joi_1.default.string().required(),
    rpcUrl: joi_1.default.string()
        .uri({
        scheme: [/https?/],
    })
        .optional(),
    chainId: joi_1.default.number().required(),
    provider: joi_1.default.any().optional(),
    ipfs: joi_1.default.object({
        projectId: joi_1.default.string().optional(),
        apiKeySecret: joi_1.default.string().optional(),
    }).optional(),
});
//# sourceMappingURL=auth.schema.js.map