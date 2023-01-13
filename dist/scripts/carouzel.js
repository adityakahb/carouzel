"use strict";
exports.__esModule = true;
exports.Carouzel = void 0;
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
        return "Carouzel Version ".concat(__version);
    };
})(CarouzelHelper || (CarouzelHelper = {}));
var Carouzel = /** @class */ (function () {
    function Carouzel() {
    }
    Carouzel.prototype.init = function () {
        console.log('=========here');
    };
    Carouzel.prototype.getVersion = function () {
        return CarouzelHelper.getV();
    };
    return Carouzel;
}());
exports.Carouzel = Carouzel;
new Carouzel().init();

//# sourceMappingURL=carouzel.js.map
