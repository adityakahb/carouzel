"use strict";
var exports = exports || {};
Object.defineProperty(exports, "__esModule", { value: true });
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
var Carouzel;
(function (Carouzel) {
    var __version = "2.0.0";
    var $$ = function (str) {
        return document.querySelectorAll(str) || [];
    };
    var instances = {};
    var Root = /** @class */ (function () {
        function Root(el, settings) {
        }
        Root.prototype.getInstance = function () { };
        Root.prototype.goToNext = function () { };
        Root.prototype.goToPrevious = function () { };
        Root.prototype.goToSlide = function () { };
        Root.prototype.destroy = function () { };
        return Root;
    }());
    var initGlobal = function () {
        $$('[data-carouzel]').forEach(function (el) {
            new Root(el);
        });
    };
    Carouzel.init = function (el, settings) {
        return new Root(el, settings);
    };
    Carouzel.getVersion = function () {
        return __version;
    };
    initGlobal();
    console.log('=======instances', instances);
})(Carouzel = exports.Carouzel || (exports.Carouzel = {}));
var temp = Carouzel.init();
console.log('=======temp', temp);

//# sourceMappingURL=carouzel.js.map
