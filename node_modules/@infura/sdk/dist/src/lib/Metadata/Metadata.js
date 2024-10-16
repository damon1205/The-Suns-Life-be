"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var metadata_schema_1 = require("./metadata.schema");
var Logger_1 = require("../Logger");
var Metadata = /** @class */ (function () {
    function Metadata() {
    }
    /**
     * Create token metadata
     * @param {string} name Name of the token
     * @param {string} description description of the token
     * @param {string} image link to the image URL
     * @param {Array} attributes The attributes of the token
     * @param {string} external_url The external link of the token
     * @param {string} animation_url Link to the animation such as music, video
     * @param {string} background_color The background color of the token
     * @param {string} youtube_url The youtube url of the token
     * @returns string
     */
    Metadata.openSeaTokenLevelStandard = function (_a) {
        var name = _a.name, description = _a.description, image = _a.image, attributes = _a.attributes, external_url = _a.external_url, animation_url = _a.animation_url, background_color = _a.background_color, youtube_url = _a.youtube_url;
        var result = metadata_schema_1.tokenMetadataSchema.validate({
            name: name,
            description: description,
            image: image,
            attributes: attributes,
            external_url: external_url,
            animation_url: animation_url,
            background_color: background_color,
            youtube_url: youtube_url,
        });
        if (result.error) {
            return Logger_1.log.throwError(result.error.details[0].message, Logger_1.Logger.code.INVALID_ARGUMENT, {
                location: Logger_1.Logger.location.METADATA_TOKEN_CREATION,
                error: result.error.details[0].message,
            });
        }
        return JSON.stringify({
            name: name,
            description: description,
            image: image,
            attributes: attributes,
            external_url: external_url,
            animation_url: animation_url,
            background_color: background_color,
            youtube_url: youtube_url,
        });
    };
    /**
     * Create contract metadata
     * @param {string} name Name of the contract
     * @param {string} description description of the contract
     * @param {string} image link to the image URL
     * @param {string} external_link The external link of the contract
     * @param {number} seller_fee_basis_points basis point for royalty
     * @param {number} fee_recipient free to for royalty recipient
     * @returns string
     */
    Metadata.openSeaCollectionLevelStandard = function (_a) {
        var name = _a.name, description = _a.description, image = _a.image, external_link = _a.external_link, seller_fee_basis_points = _a.seller_fee_basis_points, fee_recipient = _a.fee_recipient;
        var result = metadata_schema_1.contractMetadataSchema.validate({
            name: name,
            description: description,
            image: image,
            external_link: external_link,
            seller_fee_basis_points: seller_fee_basis_points,
            fee_recipient: fee_recipient,
        });
        if (result.error) {
            return Logger_1.log.throwError(result.error.details[0].message, Logger_1.Logger.code.INVALID_ARGUMENT, {
                location: Logger_1.Logger.location.METADATA_CONTRACT_CREATION,
                error: result.error.details[0].message,
            });
        }
        return JSON.stringify({
            name: name,
            description: description,
            image: image,
            external_link: external_link,
            seller_fee_basis_points: seller_fee_basis_points,
            fee_recipient: fee_recipient,
        });
    };
    /**
     * Create free metadata
     * @param {object} metadata object of free metadata
     * @returns string
     */
    Metadata.freeLevelMetadata = function (metadata) {
        var result = metadata_schema_1.freeMetadataSchema.validate(metadata);
        if (result.error) {
            return Logger_1.log.throwError(result.error.details[0].message, Logger_1.Logger.code.INVALID_ARGUMENT, {
                location: Logger_1.Logger.location.METADATA_FREE_CREATION,
                error: result.error.details[0].message,
            });
        }
        return JSON.stringify(metadata);
    };
    return Metadata;
}());
exports.default = Metadata;
//# sourceMappingURL=Metadata.js.map