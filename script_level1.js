const playBoard = document.querySelector(".play_board");
const scorePoint = document.querySelector(".score");

const highScorePoint = document.querySelector(".high_score");


let gameOver = false;
let foodX, foodY;
let i=0,j=0;
let caterpillarX=5, caterpillarY=10;
let caterpillarBody = [];
let velocityX=0, velocityY=0;
let setIntervalID;
let score = 0;
let highScore = localStorage.getItem("high_score") || 0;
highScorePoint.innerText = `High Score : ${highScore}`;

let excludedValuesFoodX = [1,30];
let excludedValuesFoodY = [1,30];

const generateRandomValueFoodY = (valueX, caterpillarBody) => {
    let valueY;
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalID);
    alert("Game Over! Press OK to replay ... ");
    location.reload();
}

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY!=1 ){
        velocityX = 0;
        velocityY = -1;
    }else if (e.key === "ArrowDown" && velocityY!=-1){
        velocityX = 0;
        velocityY = 1;
    }else if (e.key === "ArrowRight" && velocityX!=-1){
        velocityX = 1;
        velocityY = 0;
    }else if (e.key === "ArrowLeft" && velocityX!=1){
        velocityX = -1;
        velocityY = 0;
    }
    initGame();
}

const boarder = () => {
    let htmlboarder = '';
    for (i=1;i<31;i++) {
        for(j=1;j<31;j++){
            if ((j==1) || (j==30)) {
                htmlboarder += `<div class="boarder horizontal" style="grid-area:${j}/${i}"></div>`;
            }else if ((i==1) || (i==30)) {
                htmlboarder += `<div class="boarder vertical" style="grid-area:${j}/${i}"></div>`;
            } 
        }
    }
    return htmlboarder;
}

const initGame = () => {
    if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`;

    let htmlMarkupboarder = boarder();

    if(caterpillarX===foodX && caterpillarY===foodY) {
        changeFoodPosition();
        caterpillarBody.push([foodX,foodY]);
        console.log(caterpillarBody);
        score++;

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high_score", highScore);

        scorePoint.innerText = ` : ${score} `;
        highScorePoint.innerText = `High Score : ${highScore}`;
    }

    for (let i=caterpillarBody.length - 1; i>0 ; i--){
        caterpillarBody[i] = caterpillarBody[i-1];
    }

    caterpillarBody[0] = [caterpillarX, caterpillarY];

    caterpillarX += velocityX;
    caterpillarY += velocityY;

    if( caterpillarX<=1 || caterpillarX>29 || caterpillarY<=1 || caterpillarY>29){
        gameOver = true;
    }

    for (let i = 0; i < caterpillarBody.length; i++) {
        let eyebody = i === 0 ? "eye" : "body";
        htmlMarkup += `<div class="${eyebody}" style="grid-area:${caterpillarBody[i][1]}/${caterpillarBody[i][0]}"></div>`;
    
        if (i !== 0 && caterpillarBody[0][1] === caterpillarBody[i][1] && caterpillarBody[0][0] === caterpillarBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup + htmlMarkupboarder;
}

changeFoodPosition();
setIntervalID = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);