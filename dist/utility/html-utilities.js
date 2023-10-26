"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HtmlUtilities = void 0;
class HtmlUtilities {
    static elementFromString(htmlString) {
        let div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild;
    }
}
exports.HtmlUtilities = HtmlUtilities;
