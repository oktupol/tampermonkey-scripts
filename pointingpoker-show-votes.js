// ==UserScript==
// @name         Pointing Poker: Show Votes
// @namespace    https://github.com/oktupol/tampermonkey-scripts/
// @version      2026-09-24
// @description  Shows other players' votes on pointingpoker.com before "Show Votes" has been clicked.
// @author       Sebastian Wieland
// @match        https://pointingpoker.com/*
// @match        https://www.pointingpoker.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pointingpoker.com
// @grant        none
// @downloadURL  https://raw.githubusercontent.com/oktupol/tampermonkey-scripts/refs/heads/main/pointingpoker-show-votes.js
// @updateURL    https://raw.githubusercontent.com/oktupol/tampermonkey-scripts/refs/heads/main/pointingpoker-show-votes.js
// ==/UserScript==

/*
 * How the site works:
 * The site talks to a SignalR hub ("pointingPokerHub"). Every session update the server pushes contains all players,
 * including their votes (`Players[].Points`) in plain text. The client then AES-encrypts each vote with a hardcoded
 * key, stores it in a randomly named data attribute on `.playerPoints` and hides it with the `voteHidden` class until
 * all votes are shown.
 *
 * This script wraps the SignalR connection's `_parseResponse`, which every transport (SSE, WebSockets, long polling)
 * uses on incoming payloads, and records the plain-text votes before the site's own handlers encrypt them in place.
 * The recorded votes are then displayed inside the still hidden `.playerPoints` cells.
 */
(function() {
    'use strict';

    const $ = window.jQuery;
    const hub = $ && $.connection && $.connection.hub;

    if (!hub || !document.getElementById('playerArea')) {
        return;
    }

    /** @type { Map<string, string> } player id -> vote */
    const votes = new Map();

    const style = document.createElement('style');
    style.textContent = '.voteHidden .pp-peek { color: #ccc; font-style: italic; }';
    document.head.appendChild(style);

    function isPlayer(obj) {
        return 'PlayerId' in obj && 'Points' in obj;
    }

    function recordPlayer(player) {
        if (player.IsObserver || typeof player.Points !== 'string') {
            return;
        }

        if (player.Points === '') {
            votes.delete(player.PlayerId);
        } else {
            votes.set(player.PlayerId, player.Points);
        }
    }

    function scan(obj, depth) {
        if (!obj || typeof obj !== 'object' || depth > 6) {
            return;
        }

        if (Array.isArray(obj.Players)) {
            // A full session object: it's authoritative for all players, so start over.
            votes.clear();
            obj.Players.filter(isPlayer).forEach(recordPlayer);
            return;
        }

        if (isPlayer(obj)) {
            recordPlayer(obj);
            return;
        }

        Object.values(obj).forEach(value => scan(value, depth + 1));
    }

    function render() {
        document.querySelectorAll('#playerArea .player[data-playerid]').forEach(row => {
            const cell = row.querySelector('.playerPoints');

            if (!cell) {
                return;
            }

            const vote = cell.classList.contains('voteHidden') ? votes.get(row.dataset.playerid) : undefined;
            let peek = cell.querySelector('.pp-peek');

            if (vote === undefined) {
                if (peek) {
                    peek.remove();
                }
                return;
            }

            if (!peek) {
                peek = document.createElement('span');
                peek.className = 'pp-peek';
                cell.replaceChildren(peek);
            }

            if (peek.textContent !== vote) {
                peek.textContent = vote;
            }
        });
    }

    const parseResponse = hub._parseResponse;
    hub._parseResponse = function() {
        const result = parseResponse.apply(this, arguments);

        try {
            scan(result, 0);
            // The site updates the DOM after this returns.
            setTimeout(render);
        } catch (e) {
            console.error('[Pointing Poker: Show Votes]', e);
        }

        return result;
    };

    new MutationObserver(render).observe(document.getElementById('playerArea'), {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
    });
})();
