const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const maxAllowedRemovableCubes = 4;
const totalCubesNumber = 20;

const MAX = "MAX";
const MIN = "MIN";

const initialGameState = {
    cubes: totalCubesNumber, // initial cube number
    player: MAX, // player to play first
    round: 1,
};

const POSSIBLE_MOVES = [1, 2, maxAllowedRemovableCubes];

function evaluate(game) {
    if (game.cubes === 0) {
        // Game over
        return game.player === MAX ? -1 : 1;
    }

    // In every other case, there is no winner
    return 0;
}

function minimax(game, depth, isMax) {
    const score = evaluate(game);

    if (depth === 0 || score !== 0) {
        return score;
    }

    if (isMax) {
        let maxEval = -Infinity; // define best value
        for (let possibleMove of POSSIBLE_MOVES) {
            // iterate every possible move
            if (possibleMove <= game.cubes) {
                // check if move can be played
                const childState = {
                    cubes: game.cubes - possibleMove,
                    player: MIN,
                };
                const eval = minimax(childState, depth - 1, !isMax); // calculate node value
                maxEval = Math.max(maxEval, eval); // update best value
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity; // define best value
        for (let possibleMove of POSSIBLE_MOVES) {
            // iterate every possible move
            if (possibleMove <= game.cubes) {
                // check if move can be played
                const childState = {
                    cubes: game.cubes - possibleMove,
                    player: MAX,
                };
                const eval = minimax(childState, depth - 1, !isMax); // calculate node value
                minEval = Math.min(minEval, eval); // update best value
            }
        }
        return minEval;
    }
}

(function start(game) {
    if (game.player === MAX) {
        const bestMove = {
            // The move that MAX player will play
            move: null,
            eval: -Infinity,
        };
        for (let possibleMove of POSSIBLE_MOVES) {
            if (possibleMove === game.cubes) {
                bestMove.move = possibleMove;
                break;
            }
            if (possibleMove <= game.cubes) {
                const childState = {
                    cubes: game.cubes - possibleMove,
                    player: MIN,
                };

                // calculate optimal move with the Minimax algorithm
                const eval = minimax(childState, game.cubes, false);
                if (eval > bestMove.eval) {
                    bestMove.move = possibleMove;
                    bestMove.eval = eval;
                }
            }
        }

        console.log(
            `========== ROUND ${game.round} (\x1b[36m%s\x1b[0m) ============`,
            `${game.cubes} cubes left`
        );
        game.cubes -= bestMove.move; // remove selected cubes number
        game.player = MIN; // switch player turn
        game.round++;
        console.log(
            `MAX removes: \x1b[31m%s\x1b[0m.`,
            `${bestMove.move} cube(s)`
        );
        console.log(`\x1b[36m%s\x1b[0m`, `${game.cubes} cubes left.`);
        if (evaluate(game) === 0) {
            start(game);
        } else {
            console.log(
                "\x1b[32m%s\x1b[0m wins!",
                `${game.player === MAX ? MIN : MAX}`
            );
            rl.close();
        }
    } else {
        rl.question(
            `How many cubes do you want to remove? (1,2 or ${maxAllowedRemovableCubes}): `,
            (answer) => {
                const move = parseInt(answer);
                if (
                    isNaN(move) ||
                    !POSSIBLE_MOVES.includes(move) ||
                    move > game.cubes
                ) {
                    console.log(
                        "\x1b[33m%s\x1b[0m",
                        `Invalid move. Please choose 1,2 or ${maxAllowedRemovableCubes} cubes.`
                    );
                    start(game);
                } else {
                    game.cubes -= move;
                    game.player = MAX;
                    console.log(
                        `You removed: \x1b[31m%s\x1b[0m.`,
                        `${move} cubes`
                    );
                    if (evaluate(game) === 0) {
                        start(game);
                    } else {
                        console.log(
                            "\x1b[32m%s\x1b[0m!",
                            `${game.player === MAX ? MIN : MAX} wins`
                        );
                        rl.close();
                    }
                }
            }
        );
    }
})(initialGameState);
