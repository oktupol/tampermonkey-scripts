// ==UserScript==
// @name         Zeit.de Komplettansicht
// @namespace    https://sebastianwie.land/
// @version      2026-02-20_1
// @description  Mehrseitige Artikel auf Zeit.de werden immer in der Komplettansicht geöffnet, sodass man innerhalb des Artikels nicht mehr blättern muss.
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