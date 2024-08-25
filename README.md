# Do The Worm

A javascript bookmarklet that will create a worm graph from a playHQ Play-by-Play table by parsing the dom, and doing some mildy evil things to import chartjs without CSP. Designed to look similar to the afl's worm graphs.

## Some random thoughts

 1. PlayHQ have CSP turned on, but then import from `polyfill.io` (the one with the vulnerabilities) and will allow any package to be imported from `unpkg`
 2. Initially, I had bundled chartjs with vite as a way to circumvent csp, but as a result my bookmarklet was around 80,000 characters. This is in theory workable, but I couldn't get it to copy paste. Using a dynamic import fixed this as i no longer had to bundle chartjs and could instead load it from a cdn. This did make my types all broken though. A 200kb bookmarklet felt against the spirit of what i was trying to do.

## Current "quirks" I would like to fix

1. If you don't scroll to the bottom of the page,it will render a graph with the first part of the first page missing. I wonder if i can trick react into not lazily loading it, or if i can just scroll to it in javascript.
2. Image copy button is whack and doesn't paste nicely into messenger. Right click to image works fine on chromium but not on safari.and I can paste into notes but not messenger?
3. the current copy bookmarklet page is really annoying. I got lazy and just dumped the string onto the page to copy. I should at least make it selectable, ideally a button that copies it all.