// Unit test the connect four state (board, victory conditions, etc.)
(function() {
    "use strict";

    var state = new ConnectFourState();
    var EXPECTED_ROWS = 6;
    var EXPECTED_COLS = 7;

    // Create tests
    var tests = {

        // Make sure new game sets the board in the right state
        newGame: function() {
            state.newGame();
            var board = state.board;

            // Test rows
            if (board.length !== EXPECTED_ROWS) {
                throw new Error("Incorrect number of rows");
            }

            // Test cols
            for (var i = 0; i < board.length; i++) {
                if (board[i].length !== EXPECTED_COLS) {
                    throw new Error("Incorrect number of columns");
                }
            }

            // Assert they're all empty
            for (i = 0; i < board.length; i++) {
                for (var j = 0; j < board[i].length; j++) {
                    if (board[i][j] !== 0) {
                        throw new Error("Board started as non empty");
                    }
                }
            }

            if (state.isFull()) {
                throw new Error("New game should not be full");
            }

            if (state.isDraw()) {
                throw new Error("New game should not be draw");
            }

            if (state.isGameOver()) {
                throw new Error("New game should not be over");
            }

            if (state.playerToMove !== 1) {
                throw new Error("Player 1 not starting first");
            }

            if (state.getWinner()) {
                throw new Error("New game should not have a winner");
            }
        },

        // Make sure when we move we stay in bounds
        moves: function() {
            state.newGame();

            for (var i = 0; i < 100; i++) {
                state.moveLeft();
            }

            if (state.pieceToDropCol !== 0) {
                throw new Error("moveLeft not working correctly");
            }

            for (i = 0; i < 100; i++) {
                state.moveRight();
            }

            if (state.pieceToDropCol !== state.board[0].length - 1) {
                throw new Error("moveRight not working correctly");
            }
        },

        // Make sure we're keeping track of the player to move correctly
        switchPlayer: function() {
            state.newGame();
        
            var currentPlayer = state.playerToMove;
            for (var i = 0; i < 50; i++) {
                state.switchPlayer();
                
                if (state.playerToMove === currentPlayer) {
                    throw new Error("Switching players not working");
                }
                
                if (state.playerToMove !== 1 && state.playerToMove !== 2) {
                    throw new Error("Player to move has invalid value");
                }
                
                currentPlayer = state.playerToMove;
            }
        },

        // Make sure we're dropping the pieces in the right place
        dropPiece: function() {

            // Helper method to see if two boards are equal
            var boardsMatch = function(board1, board2) {
                for (var i = 0; i < board1.length; i++) {
                    for (var j = 0; j < board1[i].lenth; j++) {
                        if (board1[i][j] !== board2[i][j]) {
                            throw new Error("Boards don't match!");
                        }
                    }
                }

                return true;
            };
            var expectedBoard;

            // Test if a piece is added at the right location
            // Add to Center
            expectedBoard = [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 0],
            ];
            state.dropPiece();
            boardsMatch(state.board, expectedBoard);
           
            // Center - 2
            expectedBoard = [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 1, 0, 0, 0],
            ];
            state.moveLeft();
            state.moveLeft();
            state.dropPiece();
            boardsMatch(state.board, expectedBoard);

            // Center + 3
            expectedBoard = [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 1, 0, 0, 1],
            ];
            state.moveRight();
            state.moveRight();
            state.moveRight();
            state.moveRight();
            state.moveRight();
            state.dropPiece();
            boardsMatch(state.board, expectedBoard);
            
            // Add two more to Center + 3
            expectedBoard = [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 0, 2],
                [0, 2, 0, 1, 0, 0, 1],
            ];
            state.dropPiece();
            state.dropPiece();
            boardsMatch(state.board, expectedBoard);

            // Makes sure we don't add to a filled column
            expectedBoard = [
                [0, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 0, 2],
                [0, 2, 0, 1, 0, 0, 1],
            ];
            for (var i = 0; i < 50; i++) {
                state.dropPiece();
            }
            boardsMatch(state.board, expectedBoard);

            // Make sure we don't add any to a winning board
            expectedBoard = [
                [0, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 0, 2],
                [0, 0, 0, 0, 0, 0, 1],
                [0, 0, 0, 0, 0, 2, 2],
                [0, 2, 0, 1, 1, 1, 1],
            ];
            state.moveRight();
            state.dropPiece();
            state.dropPiece();
            state.moveRight();
            state.dropPiece();
            
            boardsMatch(state.board, expectedBoard);

            // None of these moves should make a difference to the board,
            // since we have a connect four
            state.moveLeft();
            state.dropPiece();
            boardsMatch(state.board, expectedBoard);
            
            state.dropPiece();
            state.moveLeft();
            state.dropPiece();
            boardsMatch(state.board, expectedBoard);

            state.moveLeft();
            state.dropPiece();
            state.dropPiece();
            state.moveRight();
            state.dropPiece();
            boardsMatch(state.board, expectedBoard);
        },

        // Make sure we detect draws
        drawTest: function() {
            state.newGame();
            
            var fullBoard = [
                [2, 1, 2, 2, 2, 1, 2],
                [1, 2, 1, 1, 1, 2, 1],
                [2, 1, 2, 2, 2, 1, 2],
                [1, 2, 1, 1, 1, 2, 1],
                [2, 1, 2, 2, 2, 1, 2],
                [1, 2, 1, 1, 1, 2, 1],
            ];

            state.board = fullBoard;
            if (!state.isDraw()) {
                throw new Error("Game should be a draw");
            }

            if (!state.isFull()) {
                throw new Error("Game board should be full");
            }
        },

        // Make sure we detect wins        
        winningTest: function() {

            // Returns true if path1 == path2 or path1 == path2.reverse()
            var comparePaths = function(path1, path2) {
                var equalInCurrentDirection = true;
                var equalInReverseDirection = true;

                for (var i = 0; i < path1.length; i++) {
                    if (path1[i].x !== path2[i].x ||
                        path1[i].y !== path2[i].y) {
                        equalInCurrentDirection = false;
                    }

                    if (path1[path1.length - 1 - i].x !== path2[i].x ||
                        path1[path1.length - 1 - i].y !== path2[i].y) {
                        equalInReverseDirection = false;
                    }
                }

                if (!equalInCurrentDirection && !equalInReverseDirection) {
                    throw new Error("Winning path is not what was expected");
                }
            };

            // Check Vertical
            var board = [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 0],
                [0, 2, 0, 1, 0, 0, 0],
                [0, 2, 0, 1, 0, 0, 0],
                [0, 2, 0, 1, 0, 0, 0],
            ];
            var expectedPath = [
                {x: 3, y: 5},
                {x: 3, y: 4},
                {x: 3, y: 3},
                {x: 3, y: 2}
            ];

            state.newGame();
            state.board = board;
            if (state.getWinner() !== 1) {
                throw new Error("Not detecting the correct winner");
            }
            comparePaths(expectedPath, state.winningPath);
   
            
            // Check Horizontal
            board = [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 2, 0, 1, 0, 0, 0],
                [0, 2, 0, 1, 2, 0, 0],
                [2, 2, 0, 1, 1, 1, 1],
            ];
            expectedPath = [
                {x: 3, y: 5},
                {x: 4, y: 5},
                {x: 5, y: 5},
                {x: 6, y: 5}
            ];

            state.newGame();
            state.board = board;
            if (state.getWinner() !== 1) {
                throw new Error("Not detecting the correct winner");
            }
            comparePaths(expectedPath, state.winningPath);

            // Check Diagonal Bottom Left to Top Right
            board = [
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 2, 0, 0, 0],
                [0, 2, 2, 1, 1, 0, 0],
                [1, 2, 1, 1, 2, 0, 0],
                [2, 2, 2, 1, 1, 1, 0],
            ];
            expectedPath = [
                {x: 0, y: 5},
                {x: 1, y: 4},
                {x: 2, y: 3},
                {x: 3, y: 2}
            ];

            state.newGame();
            state.board = board;
            if (state.getWinner() !== 2) {
                throw new Error("Not detecting the correct winner");
            }
            comparePaths(expectedPath, state.winningPath);

            // Check Diagonal Top Left to Bottom Right
            board = [
                [0, 0, 0, 2, 0, 0, 0],
                [0, 0, 0, 1, 0, 0, 0],
                [1, 0, 0, 2, 1, 0, 0],
                [2, 2, 0, 2, 1, 1, 0],
                [1, 2, 1, 1, 2, 2, 1],
                [2, 2, 2, 1, 1, 1, 2],
            ];
            expectedPath = [
                {x: 6, y: 4},
                {x: 5, y: 3},
                {x: 4, y: 2},
                {x: 3, y: 1}
            ];

            state.newGame();
            state.board = board;
            if (state.getWinner() !== 1) {
                throw new Error("Not detecting the correct winner");
            }
            comparePaths(expectedPath, state.winningPath);
        },

        // Make sure we detect when the game is over
        isGameOver: function() {

            // This test ends in a connect four state
            this.dropPiece();

            if (!state.isGameOver()) {
                throw new Error("Game not over when connect four");
            }

            // This test ends with a draw
            this.drawTest();

            if (!state.isGameOver()) {
                throw new Error("Game not over when draw");
            }
        },
    };

    // Run all tests
    console.log("Running tests...");
    for (var test in tests) {
        if (tests.hasOwnProperty(test)) {
            console.log("Testing: " + test);
            tests[test]();
            console.log("%cPassed:  " + test, "color:green");
      }
    }
    console.log("%cAll tests passed!", "color:green");
})();
