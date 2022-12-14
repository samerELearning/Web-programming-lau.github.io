/*************************************************************
 * script.js
 * @author Samer Saber
 * This code's purpose is to implement a tic tac toe game,
 * and a minimax algorithm in order to play against a smart computer.
 * Other files include: index.html, syle.css
 * Last modified on Saturday, 2nd of October 2022
 *************************************************************/

let message;//Stores message that will show on page
let score;//Holds 'score' element in html file
let user_score;//Keeps track of user score
let ai_score;//Keeps track of AI's score
let turn;//Keeps track of player's turn
let start;//Stores '1' when game first starts

const board  = [0,1,2,3,4,5,6,7,8];//Keeps track of board cells

const tokens = document.getElementsByTagName("img");
const cells  = document.getElementsByClassName("cell");

window.onload = function() {
    
    message     = document.getElementById("message");
    score       = document.getElementById("score");
    turn        = 1;
    user_score  = 0;
    ai_score    = 0;
    start       = 0;

}

/**
 * This function is called from the html file.
 * The purpose of this function is to set the red token image
 * to visible on the cell that was clicked by the user,
 * and to call the function 'aiPlaceToken(index)' to determine
 * and place AI's move. And output message if user wins.
 * @param {Integer} index The index of the cell
 */
function placeToken(index)
{
    if (turn && board[index] != "r" && board[index] != "y")
    {
        tokens[index + 1].style.visibility = "visible";
        board[index]                       = "r";
        turn                               = 0;
        start                              = 1;

        
        if (board.filter(c => c != "y" && c != "r").length == 0)
        {
        //If no more empty cells, then it's a tie
            ai_score         += 1;
            user_score       += 1;
            message.innerText = "It's a tie!";
            score.innerText   = "Your score: " + user_score + "\n" + "Computer's score: " + ai_score;
        }
        else
        {
            aiPlaceToken(minimax(board, "y").index);
        }
    }
}


/**
 * This function is called in 'placeToken(index)' function.
 * The purpose of this function is to change the red token image
 * to yellow token image and set it to visible on the cell
 * determined by the AI. And output a message if AI wins.
 * if AI wins.
 * @param {Integer} index The index of the cell
 */
function aiPlaceToken(index)
{
    tokens[index + 1].src              = "img/yellow.png";
    tokens[index + 1].style.visibility = "visible";
    board[index]                       = "y";

    if (hasWon(board, "y"))
    {
        ai_score         += 1;
        message.innerText = "Computer Wins!";
        score.innerText   = "Your score: " + user_score + "\n" + "Computer's score: " + ai_score;
    }
    else
    {
        turn = 1;
    }
}

/**
 * This function is called from the html file.
 * The purpose of this function is to hide all token
 * images, and reset the game.
 */
function restartGame()
{
    if (start)
    {
    //If game started
        for (var i = 1; i < tokens.length; i++)
        {
            tokens[i].style.visibility = "hidden";
            tokens[i].src              = "img/red.png";
            board[i - 1]               = i - 1;
        }

        board[8] = 8;

        message.innerText   = "Let's Play Again!";
        turn                = 1;
        start               = 0;
    }
}

/**
 * This function is called inside 'minimax()'.
 * The purpose of this function is to return a list
 * of empty board cells.
 * @param   {List} board The list of board cells
 * @returns {List}     The list of empty board cells
 */
function emptyCells(board)
{
    return board.filter(c => c != "y" && c != "r");
}

/**
 * This function is called inside 'minimax()'.
 * The purpose of this function is to determine
 * if the player passed in the parameter has won
 * the game or not, by checking all winning combinations.
 * @param   {List}   board  The list of board cells
 * @param   {String} player 'y' for AI or 'r' for human
 * @returns {boolean}       True if won, false otherwise
 */
function hasWon(board, player)
{
    if ((board[0] == player && board[1] == player && board[2] == player) ||
        (board[3] == player && board[4] == player && board[5] == player) ||
        (board[6] == player && board[7] == player && board[8] == player) ||
        (board[0] == player && board[3] == player && board[6] == player) ||
        (board[1] == player && board[4] == player && board[7] == player) ||
        (board[2] == player && board[5] == player && board[8] == player) ||
        (board[0] == player && board[4] == player && board[8] == player) ||
        (board[2] == player && board[4] == player && board[6] == player))
    {
        return true;
    }
    else
    {
        return false;
    }
}

/**
 * This function is called in 'placeToken()' function
 * The purpose of this function is to determine the best move possible
 * by the AI, using recursion.
 * @param   {List}   temp_board The list of board cells
 * @param   {String} player     'y' for AI or 'r' for human
 * @returns {Object}            The best move out of all possible moves
 */
function minimax(temp_board, player)
{
    console.log(1);//////////////////////////////////////////////////////////
    const empty_cells = emptyCells(temp_board);

    if (hasWon(temp_board, "r"))
    {
    //If human wins
        return {score:-10};
    }
    else if (hasWon(temp_board, "y"))
    {
    //If AI wins
        return {score:10};
    }
    else if (empty_cells.length === 0)
    {
    //If there's a tie
        return {score:0};
    }

    const possible_moves = [];

    for (var i = 0; i < empty_cells.length; i++)
    {
        const move = {};
        move.index = temp_board[empty_cells[i]];

        temp_board[empty_cells[i]] = player;

        if (player == "y")
        {
            let result = minimax(temp_board, "r");
            move.score = result.score;
        }
        else
        {
            let result = minimax(temp_board, "y");
            move.score = result.score;
        }

        temp_board[empty_cells[i]] = move.index;
        possible_moves.push(move);
    }

    let best_move;
    let best_score;

    if (player === "y")
    {
        best_score = -10000;

        for (var i = 0; i < possible_moves.length; i++)
        {
            if (possible_moves[i].score > best_score)
            {
                best_score = possible_moves[i].score;
                best_move  = i;
            }
        }
    }
    else
    {
        best_score = 10000;

        for (var i = 0; i < possible_moves.length; i++)
        {
            if (possible_moves[i].score < best_score)
            {
                best_score = possible_moves[i].score;
                best_move  = i;
            }
        }
    }

    return possible_moves[best_move];
}