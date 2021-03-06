/*----------------------------------------------------------------------------------------------------------------*/
//Global variables that are used throughout the game
let numberOfShips = 0;
let difficulty = -1;
var game = null;
let turnTracker = null;
let miss_snd = new sound("./static/miss.mp3")
let hit_snd = new sound("./static/hit.mp3")
/**
  * @param lastRow : integer 0-9
  * @param lastCol : integer 0-9
  * @param lastDir : integer 0 (up), 1 (right), 2 (down), 3 (left)
**/
let aiMedium = {row: 0, col: 0, dir: 0, hit: false}
/*----------------------------------------------------------------------------------------------------------------*/
//Funcionality to play sounds
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}
//changes game state to AI
function moveToAISelect(){
    document.getElementById("startmenu").style.display = "none"
    document.getElementById("aiselect").style.display = "block";
}
//allows user to select the 3 types of difficulty and assign a value to change to the difficulty
function moveToDifficultySelect(){
    document.getElementById("aiselect").style.display = "none";
    document.getElementById("difficultyselect").style.display = "block";
    const difficultySelectButtons = document.querySelectorAll(".difficultyselectbutton");
    for(let i=0; i<difficultySelectButtons.length; i++)
    {
        difficultySelectButtons[i].addEventListener('click', () => {
            difficulty = i;
            moveToShipSelect();
        });
    }
}


/*----------------------------------------------------------------------------------------------------------------*/
//First function that is called, simply is called when start is pressed
function moveToShipSelect() {
    document.getElementById("aiselect").style.display = "none";
    document.getElementById("difficultyselect").style.display = "none";                                                                        //Hides and reveals the appropriate
    document.getElementById("shipselect").style.display = "block";         //Ids
    const shipSelectButtons = document.querySelectorAll(".shipselectbutton");
    for(let i = 0; i < shipSelectButtons.length; i++) {
        shipSelectButtons[i].addEventListener('click', () => {                  //Creates buttons that alter the
            numberOfShips = i+1;                                                //numberOfShips
            moveToPlayerOnePlacementPrep();                                     //Moves to the next step of game
        });
    }
}

/*----------------------------------------------------------------------------------------------------------------*/
//Here buttons are made that call functions that determine player placement
function moveToPlayerOnePlacementPrep() {
    document.getElementById("shipselect").style.display = "none";
    document.getElementById("difficultyselect").style.display = "none";
    document.getElementById("shipprep").style.display = "block";
    document.getElementById("gobtn").addEventListener("click", moveToPlayerOnePlacement);
    //Defaulted in global variables, -1 for normal game
    if (difficulty == -1)
    {
        document.getElementById("placeshipsbtn").addEventListener("click", moveToPlayerTwoPlacementPrep);
    }
    //difficulty set in moveToDifficultySelect 0 easy, 1 medium, 2 hard
    else
    {
        document.getElementById("placeshipsbtn").addEventListener("click", moveToAIPlacement);
    }
}

//Goes to player one placement after creating the battleship class
function moveToPlayerOnePlacement() {
    game = new Battleship(numberOfShips);
    moveToPlayerPlacement(1);
}
/*----------------------------------------------------------------------------------------------------------------*/
//Creates buttons for player two
function moveToPlayerTwoPlacementPrep() {
    document.getElementById("shipplacement").style.display = "none";
    document.getElementById("placeships").style.display = "none";
    document.getElementById("shipprep").style.display = "block";
    document.getElementById("gobtn").style.display = "none";
    document.getElementById("gobtn2").style.display = "inline-block";
    document.getElementById("gobtn2").addEventListener("click", moveToPlayerTwoPlacement)
    document.getElementById("prepplayer").innerHTML = "Player 2";
}
/*----------------------------------------------------------------------------------------------------------------*/
//Allows for ai to randomly place boards and confirmation to move to ai randomly placing ships
function moveToAIPlacement()
{
    document.getElementById("shipplacement").style.display = "none";
    document.getElementById("placeships").style.display = "none";
    document.getElementById("shipprep").style.display = "block";
    document.getElementById("gobtn").style.display = "none";
    document.getElementById("gobtn2").style.display = "inline-block";
    document.getElementById("gobtn2").addEventListener("click", AiPlacement)
    document.getElementById("prepplayer").innerHTML = "AI";
}
function AiPlacement()
{
    let currBoard = 2;
    game.setAiMode(currBoard);
    //Iterate through ships
    for(let i=1; i<=numberOfShips; i++)
    {
      //Globalizing the variables
      let valid = false;
      let row, column, direction;
      //Won't continue until coordinates are valid for each ship
      do
      {
        //gets randoms for the row and y coordinates
        row = Math.floor(Math.random() * 10);
        column = Math.floor(Math.random() * 10);
        direction = Math.floor(Math.random() * 2);
        //vertical
        if(direction == 0)
        {
          //validates EACH coordinate to potentially be placed
          for(let j=0; j<i; j++)
          {
            try
            {
              valid = game.isValidPlacement(currBoard,row+j, column);
            }
            catch(error)
            { //If there is any error in checking placement, assume it is not valid
              console.log(error + ": trying new coordinates")
              valid = false;
            }
            finally
            {
              //break if not a valid placement to try new coordinates
              if(valid==false)
              {
                break;
              }
            }
          }
        }
        //horizontal
        else if(direction = 1)
        {
          //validates EACH coordinate to potentially be placed
          for(let j=0; j<i; j++)
          {
            try
            {
              valid = game.isValidPlacement(currBoard, row, column+j);
            }
            catch(error)
            { //If there is any error in checking placement, assume it is not valid
              console.log(error + ": trying new coordinates")
              valid = false;
            }
            finally
            {
              //break if not a valid placement to try new coordinates
              if(valid == false)
              {
                break;
              }
            }
          }
        }
      }
      while(valid == false)
      //Iterate through each ships length to place on the board
      for(let j=0; j<i; j++)
      {
        //Vertical placement
        if(direction == 0)
        {
          //increments the y coordinate
          game.placeShip(currBoard, row+j, column);
        }
        //Horizontal placement
        else if(direction == 1)
        {
          //increment the row coordinate
          game.placeShip(currBoard, row, column+j);
        }
      }
    }
    //if the ship test placements are valid continue the game with the placed ships
   let test = game.board2.isValid(numberOfShips);
   if(test)
   {
     document.getElementById("gobtn2").style.display = "none";
     let start = document.getElementById("startgame")
     start.style.display = "block";
     start.addEventListener("click", gameRunner);
   }
}
//Goes to player two placement after disabling board of player one
function moveToPlayerTwoPlacement() {
    document.getElementById("gobtn2").style.display = "none";
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let cell = document.getElementById(getId(1, i, j));
            //Disable editing of player 1's board
            cell.removeEventListener("click", editShips);
        }
    }
    let placeShipBtn = document.getElementById("placeshipsbtn")
    placeShipBtn.removeEventListener("click", moveToPlayerTwoPlacementPrep)
    placeShipBtn.addEventListener("click", gameRunner);
    moveToPlayerPlacement(2);
}
/*----------------------------------------------------------------------------------------------------------------*/
//Function that goes preps a players board before beiing able to place ships
/**
 * @param {number} board - which board is being set up
 */
function moveToPlayerPlacement(board) {
    alert(`Rules for placement:
    Place ${numberOfShips} ship(s) on your board of sizes: ${determineShips()}
    You must place each part of the ship individually
    You are not allowed to place ships within one block of each other
    The game will only continue if you correctly place the ships
    A button will appear at the bottom of the screen once your ships are placed
    Upon firing, the chosen cell turns blue for a miss, red for a hit, and black if the ship is sunk`);
    document.getElementById("shipprep").style.display = "none";
    document.getElementById("shipplacement").style.display = "block";
    document.getElementById("numberofshipsselected").innerText = numberOfShips;
    showTurn(board);
    loadBoards(board);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let cell = document.getElementById(getId(board, i, j));
            cell.addEventListener("click", editShips);
        }
    }
}

//highlights the current player's turn
function showTurn(player) {
    if (player == 1) {
        document.getElementById("player1").firstElementChild.classList.add("turn");
        document.getElementById("player2").firstElementChild.classList.remove("turn");
    } else {
        document.getElementById("player2").firstElementChild.classList.add("turn");
        document.getElementById("player1").firstElementChild.classList.remove("turn");
    }
}

//Function that determines whether a clicked cell is a valid ship placeement
function editShips() {
    let x = ordPair(this.id)[0];
    let y = ordPair(this.id)[1];
    let currBoard = getBoardFromId(this.id);
    if (this.className === "grid-item-ship") {
        this.className = "grid-item";
        game.placeShip(currBoard, x, y);
    } else if (game.isValidPlacement(currBoard, x, y)){
        this.className = "grid-item-ship";
        game.placeShip(currBoard, x, y);
    }
    if (game.isValid(currBoard)) {
        //Show placeships
        document.getElementById("placeships").style.display = "block";
    } else {
        //Hide placeships
        document.getElementById("placeships").style.display = "none";
    }
}

/*----------------------------------------------------------------------------------------------------------------*/
//Mostly utility functions
//Determines what ships (x by y) ships are in the game
function determineShips() {
    s = "";
    for (let i = 1; i <= numberOfShips; i++) {
        s += "1x"+i + ", ";
    }

    return s.slice(0,-2);
}

//Loads each players boards
function loadBoards(player) {
    const opponent = player == 1 ? 2 : 1;
    const playerBoard = game.getBoard(player);
    const opponentBoard = game.getBoard(opponent, hidden=true);
    const aiBoard = game.getBoard(2,hidden=true);
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let playerCell = document.getElementById(getId(player, i, j));
            let opponentCell = document.getElementById(getId(opponent, i, j));
            playerCell.className = playerCellClass(playerBoard[i][j]);
            opponentCell.className = opponentCellClass(opponentBoard[i][j]);
        }
    }
}

//Determines the cell type the current player should be
function playerCellClass(value) {
    if (value == -3) {
        return "grid-item-sunk";
    } else if (value == -2) {
        return "grid-item-hit";
    } else if (value == 1) {
        return "grid-item-ship";
    } else if (value == 0) {
        return "grid-item";
    } else {
        return "grid-item-miss";
    }
}

//Determines the cell type the current opponent should be
function opponentCellClass(value) {
    if (value == -2) {
        return "grid-item-hit";
    } else if (value == -3) {
        return "grid-item-sunk";
    } else if (value == 0) {
        return "grid-item-opponent";
    } else if (value == -3) {
        return "grid-item-sunk";
    } else {
        return "grid-item-miss";
    }
}

//Determines who's turn it is
class Turn {
    constructor(start) {
        this.turn = start;
    }
    getTurn() {
        return this.turn;
    }
    nextTurn() {
        this.turn = this.turn == 1 ? 2 : 1;
        return this.turn;
    }
}
/*----------------------------------------------------------------------------------------------------------------*/
//Global fire function
let fired = false;
//function that if the player has not fired, fire at the clicked cell and remove its event
function fire() {
    let x = ordPair(this.id)[0];
    let y = ordPair(this.id)[1];
    let opponent = getBoardFromId(this.id)
    //only fire once a turn
    if (!fired) {
        //fires and plays a sound depending on fire success
        if(game.firedAt(opponent,x,y))
        {
          hit_snd.play();
        }
        else
        {
          miss_snd.play();
        }
        //update logic
        fired = true;
        //update boards
        loadBoards(turnTracker.getTurn());
        //disable click feature on the cell
        this.removeEventListener("click", fire);
    }
    //show button to continue
    document.getElementById("endTurn").style.display = "block";
    document.getElementById("endTurnBtn").addEventListener("click", playerFirePrep);
    if(turnTracker.getTurn() == 1)      //updates when user fires
    {
        statUpdater(1);
    }
    if(turnTracker.getTurn() == 2)
    {
        statUpdater(2);
    }
}

function aiFire(difficulty)
{
  let row, col;
  //deactivates clicking on the player's board while AI is firing
  for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
          let aiBoard = document.getElementById(getId(1, i, j));
          aiBoard.style.pointerEvents = 'none';
      }
  }
  //starts the easy difficulty where the ai would just randomly fire on the board until it hits a ship
  if(difficulty == 0)
  {
    row = Math.floor(Math.random() * 10);
    col = Math.floor(Math.random() * 10);
  }
  //starts the medium difficulty where the ai would randomly fire and if it detects a ship start firing top right down left and continue until ship is destroyed and start randomly firing again
  else if(difficulty == 1)
  {
    coords = _mediumDifficultyMove(aiMedium);
    row = coords['row'];
    col = coords['col'];
  }
  //starts the hard difficulty where the ai would know where the player has placed ships and fire on them
  else if(difficulty == 2)
  {
    const aiBoard = game.getBoard(1,hidden=false);
    let stop = false;
  //Nested for loop checks ai board for any ships, if found, then it sets coordinates to fire, then breaks out of loop
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if(aiBoard[i][j] == 1)
            {
                row = i;
                col = j;
                stop = true;
                break;
            }
        }
       if(stop==true)
        {
            break;
        }
    }
  }
  //only fire once a turn
  if (!fired) {
      //fires and plays a sound depending on fire success
      if(game.firedAt(1,row,col))
      {
        hit_snd.play();
        //For medium difficulty, update the aiMedium object to keep track of most recent hit
        if(difficulty==1)
        {
          aiMedium.hit = true;
          aiMedium.row = row;
          aiMedium.col = col;
        }

      }
      else
      {
        miss_snd.play();
        //Cycle to the next direction if a hit has been encountered and all directions haven't been tried
        (aiMedium.hit == true && aiMedium.dir != 3) ? aiMedium.dir +=1 : null;
      }
      //update logic
      fired = true;
      //update boards of only player 1 so they cannot see ai ship placement
      loadBoards(1);
      //disable click feature on the cell
      this.removeEventListener("click", fire);
  }
  //show button to continue
  document.getElementById("endTurn").style.display = "block";
  document.getElementById("endTurnBtn").addEventListener("click", playerFirePrep);

  if(turnTracker.getTurn() == 1)      //updates when user fires
  {
      statUpdater(1);
  }
  if(turnTracker.getTurn() == 2)
  {
      statUpdater(2);
  }
}

/**
  * @Return row and column coordinates
**/
function _mediumDifficultyMove(move)
{
  /*
    Helper function for aiFire to simplify medium branch instructions
      - Fires at random until a ship is hit, then
      - Searches orthogonally adjacent for subsequent fires, and
      - If all directions are checked, start firing at random again
      - utilizes aiMedium object declared globally in line 9
  */
  //recent move not a hit, random coordinates
  if(move.hit == false)
  {
    do
    {
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);
    }
    while(!(_isValidFire(row, col)));
    return {'row': row, 'col': col};
  }
  //recent move a hit, move orthoganally adjacent using recursion
  else
  {
    //up
    if(move.dir == 0)
    {
      if(_isValidFire(move.row-1,move.col))
      {
        return {'row':move.row-1, 'col': move.col};
      }
      else
      {
        //failed up, check right
        move.dir +=1;
        return _mediumDifficultyMove(move);
      }
    }
    //right
    else if(move.dir == 1)
    {
      if(_isValidFire(move.row,move.col+1))
      {
        return {'row':move.row, 'col': move.col+1};
      }
      else
      {
        //failed right, check down
        move.dir +=1;
        return _mediumDifficultyMove(move);
      }
    }
    //down
    else if(move.dir == 2)
    {
      if(_isValidFire(move.row+1,move.col))
      {
        return {'row':move.row+1, 'col': move.col};
      }
      else
      {
        //failed down, check left
        move.dir +=1;
        return _mediumDifficultyMove(move);
      }
    }
    //left
    else if(move.dir == 3)
    {
      if(_isValidFire(move.row,move.col-1))
      {
        return {'row':move.row, 'col': move.col-1};
      }
      else
      {
        //backtrack if cell to the left or below is hit (not sunk or empty)
        if(_isHit(move.row,move.col-1))
        {
          move.col -= 1;
          move.dir = 3;
        }
        else if(_isHit(move.row+1, move.col))
        {
          move.row += 1;
          move.dir = 2;
        }
        else
        {
          //No valid moves, set hit to false and dir to 0 to generate new random coordinates
          move.hit = false;
          move.dir = 0;
        }
        //In all cases, must recurse at least one more time
        return _mediumDifficultyMove(move);
      }
    }
  }
}
/**
  * @param row row to check
  * @param col column to check
**/
function _isHit(row, col)
{
  const aiBoard = game.getBoard(1,hidden=true);
  //Coordinates out of board boundaries
    if(row > 9 || row < 0 || col > 9 || col < 0)
    {
      return false;
    }
  //Hit not sunk
    else if(aiBoard[row][col] == -2)
    {
      return true;
    }
    else
    {
      return false;
    }
}
/**
  * @param row row to check
  * @param col column to check
**/
function _isValidFire(row,col)
{
  const aiBoard = game.getBoard(1, hidden=true);
  try
  {
    //Coordinates out of board boundaries
    if(row < 0 || row > 9 || col < 0 || col > 9)
    {
      return false;
    }
    //Coordinate has either: been fired on, hit, or sunk
    else if(aiBoard[row][col] == -1 || aiBoard[row][col] == -2 || aiBoard[row][col] == -3)
    {
      return false;
    }
  }
  catch(error)
  {
    console.log(error + " : AI trying new firing coordinates")
    return false;
  }
  //Return true in all other cases
  return true;
}

//Preps the players for firing
function playerFirePrep() {
    if (game.isGameOver()) {
        let winner = turnTracker.getTurn();
        //shows winning page
        document.getElementById("shipplacement").style.display = "none";
        document.getElementById("endTurnBtn").style.display = "none";
        document.getElementById("statistics").style.display = "none";
        document.getElementById("winningpage").style.display = "block";
        document.getElementById("whowon").innerHTML = `Player ${winner} won!`;
    } else {
        document.getElementById("statistics").style.display = "none";
        let player = turnTracker.nextTurn();
        //shows fire prep phase for next player
        document.getElementById("shipplacement").style.display = "none";
        document.getElementById("shipprep").style.display = "block";
        document.getElementById("gobtn").style.display = "inline-block";
        document.getElementById("gobtn").removeEventListener("click", moveToPlayerOnePlacement);
        document.getElementById("gobtn").addEventListener("click", playerFire);
        document.getElementById("promptforward").innerHTML = "Ready to continue?";
        document.getElementById("prepplayer").innerHTML = `Player ${player}`;
        document.getElementById("endTurn").style.display = "none";
        fired = false;
    }
}

//Depending on who is currently the player, gives events to the other board
function playerFire() {
    let player = turnTracker.getTurn();
    let opponent = player == 1 ? 2 : 1;
    //show board
    document.getElementById("shipplacement").style.display = "block";
    document.getElementById("statistics").style.display = "block";
    document.getElementById("shipprep").style.display = "none";
    document.getElementById("gobtn").style.display = "none";
    document.getElementById("endTurn").style.display = "none";
    showTurn(player);
    loadBoards(player);
    //make sure player can't attack self
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let cellP = document.getElementById(getId(player, i, j));
            let cellO = document.getElementById(getId(opponent, i, j));
            cellP.style.pointerEvents = 'none';
            cellO.style.pointerEvents = 'auto';
        }
    }
    //Detect if the AI needs to fire or not
    if(player == 2 && game.isAiGame(2))
    {
      aiFire(difficulty);
    }
    if(turnTracker.getTurn() == 1)          //Updates stats depending on which player's turn it is, updates when user clicks square to fire
    {
        statUpdater(1);
    }
    if(turnTracker.getTurn() == 2)
    {
        statUpdater(2);
    }
}

/*----------------------------------------------------------------------------------------------------------------*/
//Function that runs the whole game
function gameRunner() {
    document.getElementById("placeships").style.display = "none";
    document.getElementById("startgame").style.display = "none";
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let cell2 = document.getElementById(getId(2, i, j));
            let cell1 = document.getElementById(getId(1, i, j));
            //Disable editing of player 2's board
            cell2.removeEventListener("click", editShips);
            cell1.addEventListener("click", fire);
            cell2.addEventListener("click", fire);
        }
    }
    turnTracker = new Turn(2);
    playerFirePrep();
}

/*----------------------------------------------------------------------------------------------------------------*/
function statUpdater(player) {      //Function that updates statistics of the player
    if(player == 1)
    {
        let num = game.board2.hits/(game.board2.hits+game.board2.misses) * 100;
        document.getElementById("stats").innerHTML = "Player 1 Stats";
        document.getElementById("shots").innerHTML = "Shots: " + (game.board2.hits + game.board2.misses);       //Hits and misses added up to get number of shots
        document.getElementById("misses").innerHTML = "Misses: " + game.board2.misses;
        if(game.board2.hits+game.board2.misses == 0)
        {
            document.getElementById("accuracy").innerHTML = "Accuracy: 0%"         //Accuracy set to 0% because 0 cannot be divided by 0
        }
        else
        {
            document.getElementById("accuracy").innerHTML = "Accuracy: " + (Math.round(num*100)/100).toFixed(2) + "%";      //Accuracy of player is calculated and rounded
        }
    }
    if(player == 2)
    {
        let num = game.board1.hits/(game.board1.hits+game.board1.misses) * 100;
        document.getElementById("stats").innerHTML = "Player 2 Stats";
        document.getElementById("shots").innerHTML = "Shots: " + (game.board1.hits + game.board1.misses);
        document.getElementById("misses").innerHTML = "Misses: " + game.board1.misses;
        if(game.board1.hits+game.board1.misses == 0)
        {
            document.getElementById("accuracy").innerHTML = "Accuracy: 0%"
        }
        else
        {
            document.getElementById("accuracy").innerHTML = "Accuracy: " +  (Math.round(num*100)/100).toFixed(2) + "%";
        }
    }
}
