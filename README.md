# JSXiangqi
## Introduction
This is a simple web-based xiangqi game that I created with JavaScript, HTML and CSS. Xiangqi is a traditional Chinese board game that is similar to chess, but with some unique rules and pieces. You can play this game against a friend on the same device, the function of against a basic AI opponent is developing. 
## Features
- A 9x10 board with 32 pieces representing two armies: red and black.
- Click interface for moving the pieces.
- Basic rules enforcement and checkmate detection.
- A reset button to start a new game.
- The game will stop if one of the general is checkmated. 
## How to Play
To start the game with Node.js backend, run npm install and npm start in the terminal, then open VS Code and open with live server. 
To start the game without Node.js backend, click https://leidzhang.github.io/JSXiangqi/.
To move a piece, click it and then click an empty or occupied intersection on the board. If the move is valid, the piece will be placed there. If not, the piece will stay at its original position.
The goal of the game is to checkmate the opponent’s general, who resides in a 3x3 palace at the center of the back rank.
To start a new game, click on the "New Game" button.
## Project Preview
### Initial pieces layout. 
The chessboard is assembled with two stacked tables, one for the visible grid and one for the invisible nodes, since the pieces are placed on the intersections of the grid lines. the gray table on the right records the moves of both players.
<img src="/images/opening.png" />

### Check Detection 
The red cannon is checking the black general, but the black side can use chariot to kill the cannon to rescue the general, so the red side did not win. 
<img src="/images/check_detection.png" />

### Checkmate Detection
Now the black general is checked by a red chariot, and there is no way that a black piece can rescue the general, so the black side is checkmated and the red side wins the game. 
<img src="/images/checkmate.png" />

### Endgame Selection
By choosing the options of the dropdown menu, various endgames on the board can be selected.
<img src="/images/endgame1.png" />

<img src="/images/endgame2.png" />

## License
This project is licensed under the Apache-2.0 license - see the LICENSE file for details.
## Feedback
If you have any feedback or suggestions for this project, feel free to open an issue on GitHub. I hope you enjoy playing this game!
