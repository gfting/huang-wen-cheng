[![Build Status](https://travis-ci.com/gfting/huang-wen-cheng.svg?branch=master)](https://travis-ci.com/gfting/huang-wen-cheng)

[![Netlify Status](https://api.netlify.com/api/v1/badges/d9a7cfa1-3440-4f51-8fe2-205404db05e9/deploy-status)](https://app.netlify.com/sites/huang-wen-cheng/deploys)

# huang-wen-cheng

Try it out live at https://go.gfting.dev!

Web app to play Go, named in honor of my grandfather that taught me, 黃文辰. We are rarely able to play with one another because of distance, but I hope that this will be enjoyed by both him and others. 

**He died May 15th, 2019 before the completion of this project. 

## Introduction to Rules

Black goes first. Players take turns placing pieces one at a time. The goal is to claim the largest terrority on the board. On the way, you can capture your opponent's pieces by surrounding their entire connected mass on all adjacent locations in cardinal directions. Therefore, you don't need to occupy the northwest, northeast, southwest, or souteast locations in order to capture a piece.

For additional reference: the [Wikipedia Go Page](<https://en.wikipedia.org/wiki/Go_(game)>) is fairly comprehensive.
The resources at [Masters of Games](https://www.mastersofgames.com/rules/go-rules.htm) is also useful. 

## Dev setup

You can `git clone` this project, or check out a live demo in the link above. If you want to try hacking on it, you can do `npm i` and then `npm run dev` for a live reload local server.

Linting: just run 'npm run lint'.

## Examples

Coming soon with screenshots from the game!

## Future Features

### MVP 1 [DONE]

- Toggle placing black/white pieces
- Display whose turn it is
- Load positions into data structure
- Move all formatting into CSS file
- Unique IDs for each pieces based on player and position

### MVP 2: [CURRENT]

- Add examples of different board positions
- Have a scoreboard
- Change to class-based structure for pieces
- Game logic for removal
- Add bespoke favicons
- Add more color and formatting
- custom hover icon
  .custom {
    cursor: url(images/my-cursor.png), auto;
  }

### MVP 3:

- Squash commit history and make it pretty
- Add multiplayer
- Enhance rules: ensure edge cases are met
- This means you can't place down a piece immediately in a location where it has just been taken. Probably need to create a better state for this
- Alternatively, utilize undo/redo stack to look at previous commands and process based on IDs
- Add different board sizes (9 x 9, 13 x 13) you can select from
- Make pieces prettier
- Refactor everything to 0 | 1 | 2 for null, black, white
- make the board a class
- custom IDs for players
- add a highlighter for most recent move
- utilize game states. honestly, this will require a full rewrite, I think
- Just rewrite the whole thing utilizing React. There are some cases that my current implementation just doens't work for
- Add some kind of registration
- Add on a testing suite


### Future Implementations
- Add an iMessage app implementation
- make a new app with React Native || NativeScript

## Challenges

- Browsersync apparently doesn't play well when you have multiple event listeners. It causes coordinates to sometimes be registered as 0, which messes with relative calculations within elements.
  - This creates some serious issues while I was testing, because I thought it was a logical error. Spent a good chunk of time trying to debug something that was because of bugs within this tool.
