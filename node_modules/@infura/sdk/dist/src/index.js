"use strict";
/*!
 * Copyright(c) ConsenSys Software Inc.
 * Copyright(c) https://consensys.net/
 * MIT Licensed
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = exports.TEMPLATES = exports.Auth = void 0;
var Auth_1 = __importDefault(require("./lib/Auth/Auth"));
exports.Auth = Auth_1.default;
var Metadata_1 = __importDefault(require("./lib/Metadata/Metadata"));
exports.Metadata = Metadata_1.default;
__exportStar(require("./lib/SDK/sdk"), exports);
var constants_1 = require("./lib/constants");
Object.defineProperty(exports, "TEMPLATES", { enumerable: true, get: function () { return constants_1.TEMPLATES; } });
//# sourceMappingURL=index.js.map