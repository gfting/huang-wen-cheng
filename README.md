[![Build Status](https://travis-ci.com/gfting/huang-wen-cheng.svg?branch=master)](https://travis-ci.com/gfting/huang-wen-cheng)

# huang-wen-cheng
Web app to play Go, named in honor of my grandfather that taught me, 黃文辰. We are rarely able to play with one another because of distance, but I hope that this will be enjoyed by both him and others.

## Setup
You can 'git clone' this project, or check out a live demo in the link above. If you want to try hacking on it, you can do 'npm i' and then 'browser-sync start --config bs-config.js'

## Introduction to Rules
Players place pieces in order one at a time. 

## Examples
Coming soon with screenshots from the game!

## Future Features

### MVP 1:
* Toggle placing black/white pieces
* Display whose turn it is
* Load positions into data structure
* Move all formatting into CSS file
* Unique IDs for each pieces based on player and position

### MVP 2: [CURRENT]
* Add examples of different board positions
* Have a scoreboard
* Game logic:
  * Remove pieces
  * BFS traversal for removal when placing different parts
* Make hover icons
* Flesh out more documentation with official javadoc format
* Add bespoke favicons
* Add more color and formatting

### MVP 3:
* Squash commit history and make it pretty
* Add multiplayer
* Enhance rules: ensure edge cases are met
* This means you can't place down a piece immediately in a location where it has just been taken. Probably need to create a better state for this
* Alternatively, utilize undo/redo stack to look at previous commands and process based on IDs

## Challenges
* Browsersync apparently doesn't play well when you have multiple event listeners. It causes coordinates to sometimes be registered as 0, which messes with relative calculations within elements.
  * This creates some serious issues while I was testing, because I thought it was a logical error. Spent a good chunk of time trying to debug something that was because of bugs within this tool.