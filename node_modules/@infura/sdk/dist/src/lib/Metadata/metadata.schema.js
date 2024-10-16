"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.freeMetadataSchema = exports.contractMetadataSchema = exports.tokenMetadataSchema = void 0;
var joi_1 = __importDefault(require("joi"));
exports.tokenMetadataSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    image: joi_1.default.string()
        .uri({
        scheme: ['ipfs', /https?/],
    })
        .required(),
    attributes: joi_1.default.array()
        .items(joi_1.default.object({
        display_type: joi_1.default.string().optional(),
        trait_type: joi_1.default.string().required(),
        value: [joi_1.default.number().required(), joi_1.default.string().required()],
    }).optional())
        .required(),
    external_url: joi_1.default.string()
        .uri({
        scheme: ['ipfs', /https?/],
    })
        .optional(),
    animation_url: joi_1.default.string()
        .uri({
        scheme: ['ipfs', /https?/],
    })
        .optional(),
    background_color: joi_1.default.string().optional(),
    youtube_url: joi_1.default.string()
        .uri({
        scheme: [/https?/],
    })
        .optional(),
}).required();
exports.contractMetadataSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    description: joi_1.default.string().required(),
    image: joi_1.default.string()
        .uri({
        scheme: ['ipfs', /https?/],
    })
        .required(),
    external_link: joi_1.default.string()
        .uri({
        scheme: ['ipfs', /https?/],
    })
        .optional(),
    seller_fee_basis_points: joi_1.default.number().optional(),
    fee_recipient: joi_1.default.number().optional(),
}).required();
exports.freeMetadataSchema = joi_1.default.object().required();
//# sourceMappingURL=metadata.schema.js.map