"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEMPLATES = exports.NFT_API_URL = void 0;
var NFT_API_URL = process.env.NFT_API_URL ? process.env.NFT_API_URL : 'https://nft.api.infura.io';
exports.NFT_API_URL = NFT_API_URL;
var TEMPLATES;
(function (TEMPLATES) {
    TEMPLATES["ERC721Mintable"] = "ERC721Mintable";
    TEMPLATES["ERC721UserMintable"] = "ERC721UserMintable";
    TEMPLATES["ERC1155Mintable"] = "ERC1155Mintable";
})(TEMPLATES = exports.TEMPLATES || (exports.TEMPLATES = {}));
//# sourceMappingURL=constants.js.map