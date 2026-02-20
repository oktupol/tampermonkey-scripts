// ==UserScript==
// @name         Zeit.de Komplettansicht
// @namespace    https://sebastianwie.land/
// @version      2026-02-20
// @description  Öffnet alle Artikel immer in der Komplettansicht, sodass man nicht mehr blättern muss.
// @author       Sebastian Wieland
// @match        https://www.zeit.de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zeit.de
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/oktupol/tampermonkey-scripts/refs/heads/main/zeit-komplettansicht.js
// @updateURL    https://raw.githubusercontent.com/oktupol/tampermonkey-scripts/refs/heads/main/zeit-komplettansicht.js
// ==/UserScript==

(function() {
    'use strict';

    /** @type { HTMLAnchorElement | null } */
    const link = document.querySelector('a[data-ct-label="all"]');

    if (!link) {
        return;
    }

    window.location.replace(link.href);
})();