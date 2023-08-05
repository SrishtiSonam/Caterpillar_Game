const playBoard = document.querySelector(".play_board");
const scorePoint = document.querySelector(".score");

const highScorePoint = document.querySelector(".high_score");


let gameOver = false;
let foodX, foodY;
let caterpillarX=5, caterpillarY=10;
let caterpillarBody = [];
let velocityX=0, velocityY=0;
let setIntervalID;
let score = 0;
let highScore = localStorage.getItem("high_score") || 0;
highScorePoint.innerText = `High Score : ${highScore}`;


const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 3) + 10;
    foodY = Math.floor(Math.random() * 3) + 10;
}

const handleGameOver = () => {
    clearInterval(setIntervalID);
    alert("Game Over! Press OK to replay ...");
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

const initGame = () => {
    if (gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`;

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

    if( caterpillarX<=0 || caterpillarX>30 || caterpillarY<=0 || caterpillarY>30){
        gameOver = true;
    }

    for (let i = 0; i < caterpillarBody.length; i++) {
        let eyebody = i === 0 ? "eye" : "body";
        htmlMarkup += `<div class="${eyebody}" style="grid-area:${caterpillarBody[i][1]}/${caterpillarBody[i][0]}"></div>`;
    
        if (i !== 0 && caterpillarBody[0][1] === caterpillarBody[i][1] && caterpillarBody[0][0] === caterpillarBody[i][0]) {
            gameOver = true;
        }
    }


    playBoard.innerHTML = htmlMarkup;
}

changeFoodPosition();
setIntervalID = setInterval(initGame, 125);

document.addEventListener("keydown", changeDirection);