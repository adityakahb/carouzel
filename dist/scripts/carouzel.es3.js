"use strict";
var exports = exports || {};
Object.defineProperty(exports, "__esModule", { value: true });
/***
 *     ██████  █████  ██████   ██████  ██    ██ ███████ ███████ ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██    ███  ██      ██
 *    ██      ███████ ██████  ██    ██ ██    ██   ███   █████   ██
 *    ██      ██   ██ ██   ██ ██    ██ ██    ██  ███    ██      ██
 *     ██████ ██   ██ ██   ██  ██████   ██████  ███████ ███████ ███████
 *
 *
 */
/**
 * v-2.0.0
 */
var CarouzelHelper;
(function (CarouzelHelper) {
    var __version = "2.0.0";
    CarouzelHelper.getV = function () {
        return __version;
    };
})(CarouzelHelper || (CarouzelHelper = {}));
var Carouzel = /** @class */ (function () {
    function Carouzel() {
    }
    Carouzel.prototype.init = function () {
        console.log(document.querySelectorAll('[data-carouzel]'));
    };
    Carouzel.prototype.getInstance = function () {
        console.log('========');
    };
    Carouzel.prototype.getVersion = function () {
        return CarouzelHelper.getV();
    };
    return Carouzel;
}());
exports.default = Carouzel;
new Carouzel().init();

//# sourceMappingURL=carouzel.js.map
