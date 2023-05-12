const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const K = 4; // παράμετρος K δυνατές κινήσεις
const M = 20; // παράμετρος Μ πλήθος κύβων

const initialGameState = {
    cubes: M, // η αρχική ποσότητα των κύβων
    player: "MAX", // ο παίκτης που παίζει πρώτος
    round: 1,
};

const POSSIBLE_MOVES = [1, 2, K]; // πίνακας πιθανών κινήσεων

function evaluate(game) {
    if (game.cubes === 0) {
        // Το παιχνίδι έχει τελειώσει
        return game.player === "MAX" ? -1 : 1;
    }

    // Σε όλες τις υπόλοιπες περιπτώσεις, δεν υπάρχει νικητής
    return 0;
}

function minimax(game, depth, isMax) {
    const score = evaluate(game);

    if (depth === 0 || score !== 0) {
        return score;
    }

    if (isMax) {
        let maxEval = -Infinity; // η αρχική τιμή καθορισμού καλύτερης κίνησης
        for (let possibleMove of POSSIBLE_MOVES) {
            // επιλογή κάθε δυνατής κίνησης
            if (possibleMove <= game.cubes) {
                // έλεγχος για το αν μπορεί να γίνει η κίνηση
                const childState = {
                    cubes: game.cubes - possibleMove,
                    player: "MIN",
                };
                const eval = minimax(childState, depth - 1, !isMax); // υπολογισμός της αξίας του κόμβου
                maxEval = Math.max(maxEval, eval); // ανανέωση της καλύτερης τιμής
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity; // η αρχική τιμή καθορισμού καλύτερης κίνησης
        for (let possibleMove of POSSIBLE_MOVES) {
            // επανάληψη για όλα τα δυνατά βήματα
            if (possibleMove <= game.cubes) {
                // έλεγχος για το αν μπορεί να γίνει η κίνηση
                const childState = {
                    cubes: game.cubes - possibleMove,
                    player: "MAX",
                };
                const eval = minimax(childState, depth - 1, !isMax); // υπολογισμός της αξίας του κόμβου
                minEval = Math.min(minEval, eval); // ανανέωση της καλύτερης τιμής
            }
        }
        return minEval;
    }
}

(function start(game) {
    if (game.player === "MAX") {
        const bestMove = {
            // Η κίνηση που θα κάνει ο MAX παίκτης
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
                    player: "MIN",
                };
                const eval = minimax(childState, game.cubes, false); // υπολογισμός βέλτιστης κίνησης με βάση τον αλγόριθμο Minimax
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
        game.cubes -= bestMove.move; // αφαιρεί τους κύβους που επιλέχθηκαν από το τραπέζι
        game.player = "MIN"; // εναλλαγή σειράς παικτών
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
                `${game.player === "MAX" ? "MIN" : "MAX"}`
            );
            rl.close();
        }
    } else {
        rl.question(
            `How many cubes do you want to remove? (1,2 or ${K}): `,
            (answer) => {
                const move = parseInt(answer);
                if (
                    isNaN(move) ||
                    !POSSIBLE_MOVES.includes(move) ||
                    move > game.cubes
                ) {
                    console.log(
                        "\x1b[33m%s\x1b[0m",
                        `Invalid move. Please choose 1,2 or ${K} cubes.`
                    );
                    start(game);
                } else {
                    game.cubes -= move;
                    game.player = "MAX";
                    console.log(
                        `You removed: \x1b[31m%s\x1b[0m.`,
                        `${move} cubes`
                    );
                    if (evaluate(game) === 0) {
                        start(game);
                    } else {
                        console.log(
                            "\x1b[32m%s\x1b[0m!",
                            `${game.player === "MAX" ? "MIN" : "MAX"} wins`
                        );
                        rl.close();
                    }
                }
            }
        );
    }
})(initialGameState);
