# Tampermonkey Scripts

A collection of [Tampermonkey](https://www.tampermonkey.net/) scripts which I have installed in my browsers.

You may install these, but I do not take any responsibility for anything that happens. I expect you to read and
understand the source code of each userscript you are installing. Be aware that by default, auto-updates are enabled in
Tampermonkey. If you're uncomfortable with that idea, either disable the feature, or strip the scripts which you install
from the `updateURL` and `downloadURL` annotations.

---

## Userscripts

### Zeit.de Komplettansicht

Mehrseitige Artikel auf Zeit.de werden immer in der Komplettansicht geöffnet, sodass man innerhalb des Artikels nicht
mehr blättern muss. Das Userscript simuliert dabei einen Klick auf den "Auf einer Seite lesen"-Button, der bei manchen
Artikeln vorhanden ist.

Download-URL:
```
https://raw.githubusercontent.com/oktupol/tampermonkey-scripts/refs/heads/main/zeit-komplettansicht.js
```