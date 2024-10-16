"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_MINTER_ROLE = exports.DEFAULT_ADMIN_ROLE = exports.GAS_LIMIT = exports.TEMPLATES = exports.NFT_API_URL = void 0;
var dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.NFT_API_URL = process.env.NFT_API_URL
    ? process.env.NFT_API_URL
    : 'https://nft.api.infura.io';
exports.TEMPLATES = {
    ERC721Mintable: 'ERC721Mintable',
    ERC721UserMintable: 'ERC721UserMintable',
    ERC1155Mintable: 'ERC1155Mintable',
};
exports.GAS_LIMIT = 6000000;
exports.DEFAULT_ADMIN_ROLE = '0x0000000000000000000000000000000000000000000000000000000000000000';
exports.DEFAULT_MINTER_ROLE = '0x9f2df0fed2c77648de5860a4cc508cd0818c85b8b8a1ab4ceeef8d981c8956a6';
//# sourceMappingURL=constants.js.map