const playBoard = document.querySelector(".play_board");
const scorePoint = document.querySelector(".score");

const highScorePoint = document.querySelector(".high_score");

let i=0,j=0;
let gameOver = false;
let foodX, foodY;
let caterpillarX=5, caterpillarY=10;
let caterpillarBody = [];
let velocityX=0, velocityY=0;
let setIntervalID;
let score = 0;
let highScore = localStorage.getItem("high_score") || 0;
highScorePoint.innerText = `High Score : ${highScore}`;

var excludedValuesFoodX = [9,10,11,12,13,14,15,16,17,18,19,20,21,22];
var excludedValuesFoodY = [12,18];

const generateRandomValueFoodY = (valueX) => {
    var valueY;
    if(excludedValuesFoodX.includes(valueX)){
        do {
            valueY = Math.floor(Math.random() * (30 - 1 + 1)) + 1;
        } while (excludedValuesFoodY.includes(valueY));
    }else{
        valueY = Math.floor(Math.random() * 30) + 1;
    }
    return valueY;
}

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = generateRandomValueFoodY(foodX);
}

const handleGameOver = () => {
    clearInterval(setIntervalID);
    alert("Game Over! Press OK to replay ...");
    location.reload();
}

const boarder = () => {
    let htmlboarder = '';
    for (i=1;i<31;i++) {
        for(j=1;j<31;j++){
            if ( ( ((j==1) || (j==30)) && ((i<10) || (i>20)) ) || ( (excludedValuesFoodY.includes(j)) && (excludedValuesFoodX.includes(i)) ) ){
                htmlboarder += `<div class="boarder horizontal" style="grid-area:${j}/${i}"></div>`;
            }else if ( ((i==1) || (i==30)) && ((j<10) || (j>20)) ) {
                htmlboarder += `<div class="boarder vertical" style="grid-area:${j}/${i}"></div>`;
            } 
        }
    }
    return htmlboarder;
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

    let htmlMarkupboarder = boarder();

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

    for (let i=caterpillarBody.length - 1; i>0 ; i--){    //////////////////////////////////////////////////////////////////////////////
        caterpillarBody[i] = caterpillarBody[i-1];
    }

    caterpillarBody[0] = [caterpillarX, caterpillarY];

    caterpillarX += velocityX;
    caterpillarY += velocityY;

    if ( ( ((caterpillarY==1) || (caterpillarY==30)) && ((caterpillarX<10) || (caterpillarX>20)) ) || ( (excludedValuesFoodY.includes(caterpillarY)) && (excludedValuesFoodX.includes(caterpillarX)) ) || ( ((caterpillarX==1) || (caterpillarX==30)) && ((caterpillarY<10) || (caterpillarY>20)) ) ) {  
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
// boarder();
setIntervalID = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);