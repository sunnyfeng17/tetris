// Base code follows this tutorial: https://www.youtube.com/watch?v=rAUn1Lom6dw

document.addEventListener('DOMContentLoaded', () => {
   
    const tetrisGrid = document.querySelector('.tetris-grid');
    const upcomingGrid = document.querySelector('.upcoming-grid');

    // Create 10 x 20 grid for main game
    for (let i = 0; i < 200; i++) {
        tetrisGrid.appendChild(document.createElement('div'));
    }
    // Create 10 x 1 grid to help freeze tetrominoes
    for (let i = 200; i < 210; i++) {
        stop = tetrisGrid.appendChild(document.createElement('div'));
        stop.className = 'taken';
    }
    // Create 4 x 4 grid for displaying next tetromino
    for (let i = 0; i < 16; i++) {
        upcomingGrid.appendChild(document.createElement('div'));
    }

    let squares = Array.from(document.querySelectorAll('.tetris-grid div'));
    const upcomingSquares = document.querySelectorAll('.upcoming-grid div');

    const startBtn = document.querySelector('#start-game');
    const pauseBtn = document.querySelector('#pause-game');
    const displayScore = document.querySelector('#score');
    const displayLine = document.querySelector('#line');

    const w = 10; // Main width
    const displayW  = 4 // Next width
    const displayI   = 0
    let score = 0;
    let linesCleared = 0;
    let nextR = 0;
    let timerId;

    let playing = false;
    
    const colours = [
        'url(images/blue.png)',
        'url(images/orange.png)',
        'url(images/red.png)',
        'url(images/green.png)',
        'url(images/purple.png)',
        'url(images/yellow.png)',
        'url(images/cyan.png)'
    ];

    const lT = [
        [0, w, w + 1, w + 2],
        [1, w + 1, w * 2 + 1, 2],
        [w, w + 1, w + 2, w * 2 + 2],
        [1, w + 1, w * 2 + 1, w * 2]
    ];

    const jT = [
        [2, w + 2, w + 1, w],
        [1, w + 1, w * 2 + 1, w * 2 + 2],
        [w * 2, w, w + 1, w + 2],
        [0, 1, w + 1, w * 2 + 1]
    ];

    const zT = [
        [1, 2, w, w + 1],
        [0, w, w + 1, w * 2 + 1],
        [w + 1, w + 2, w * 2, w * 2 + 1],
        [0, w, w + 1, w * 2 + 1]
    ];

    const sT = [
        [0, 1, w + 1, w + 2],
        [1, w + 1, w, w * 2],
        [w, w + 1, w * 2 + 1, w * 2 + 2],
        [1, w + 1, w, w * 2]
    ];

    const tT = [
        [1, w, w + 1, w + 2],
        [1, w + 1, w * 2 + 1, w + 2],
        [w, w + 1, w + 2, w * 2 + 1],
        [1, w + 1, w * 2 + 1, w]
    ];

    const oT = [
        [0, 1, w, w + 1],
        [0, 1, w, w + 1],
        [0, 1, w, w + 1],
        [0, 1, w, w + 1]
    ];

    const iT = [
        [1, w + 1, w * 2 + 1, w * 3 + 1],
        [w, w + 1, w + 2, w + 3],
        [1, w + 1, w * 2 + 1, w * 3 + 1],
        [w, w + 1, w + 2, w + 3]
    ];

    const tetrominoes = [lT, jT, zT, sT, tT, oT, iT];

    let currPos = 4;
    let currRotate = 0;

    let r = Math.floor(Math.random() * tetrominoes.length);
    let curr = tetrominoes[r][currRotate];

    function draw() {
        curr.forEach(i => {
            squares[currPos + i].style.backgroundImage = colours[r];
        })
    }

    function undraw() {
        curr.forEach(i => {
            squares[currPos + i].style.backgroundImage = '';
        })
    }

    function control(e) {
        if (playing) {
            if (e.keyCode === 37) {
                moveLeft();
            }
            else if (e.keyCode === 38) {
                rotate();
            }
            else if (e.keyCode === 39) {
                moveRight();
            }
            else if (e.keyCode === 40) {
                moveDown();
            }
        }
    }
    
    document.addEventListener('keydown', control)

    function moveDown() {
        undraw();
        currPos += w;
        draw();
        freeze();
    }

    function freeze() {
        if (curr.some(i => squares[currPos + i + w].classList.contains('taken'))) {
            setInterval(timerId);
            curr.forEach(i => squares[currPos + i].classList.add('taken'));
            r = nextR
            nextR = Math.floor(Math.random() * tetrominoes.length);
            curr = tetrominoes[r][currRotate];
            currPos = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        }
    }


    function moveLeft() {
        undraw()
        const isAtLeftEdge = curr.some(i => (currPos + i) % w === 0)
        if (!isAtLeftEdge) {
            currPos -= 1;
        } 
        if (curr.some(i => squares[currPos + i].classList.contains('taken'))) {
            currPos += 1;
        }
        draw();
    }

    function moveRight() {
        undraw()
        const isAtRightEdge = curr.some(i => (currPos + i) % w === w - 1)
        if (!isAtRightEdge) {
            currPos += 1;
        } 
        if (curr.some(i => squares[currPos + i].classList.contains('taken'))) {
            currPos -= 1;
        }
        draw();
    }
    
    function rotate() {
        undraw();
        const overflowLeft = curr.some(i => (currPos + i) % w === 9)
        const overflowRight = curr.some(i => (currPos + i) % w === 0)
        if (overflowLeft) {
            currPos--;
        }
        if (overflowRight) {
            currPos++;
        }
        currRotate++;
        if (currRotate === curr.length) {
             currRotate = 0;
        }
        curr = tetrominoes[r][currRotate];
        draw();
    }

    const upcomingTetrominoes = [
        [0, displayW , displayW  + 1, displayW  + 2], // L
        [2, displayW  + 2, displayW  + 1, displayW ], // J
        [1, 2, displayW , displayW  + 1], // Z
        [0, 1, displayW  + 1, displayW  + 2], // S
        [1, displayW , displayW  + 1, displayW  + 2], // T
        [0, 1, displayW , displayW  + 1], // O
        [1, displayW  + 1, displayW  * 2 + 1, displayW  * 3 + 1] // I
    ]

    function displayShape() {
        upcomingSquares.forEach(s => {
            s.style.backgroundImage = ''
        })
        upcomingTetrominoes[nextR].forEach(i => {
            upcomingSquares[displayI + i].style.backgroundImage = colours[nextR];
        })
    }

    startBtn.addEventListener('click', () => {
        if (!playing) {
            playing = true;
            draw();
            timerId = setInterval(moveDown, 1000);
            nextR = Math.floor(Math.random() * tetrominoes.length);
            displayShape();
        }
    })

    pauseBtn.addEventListener('click', () => {
        if (playing) {
            playing = false;
            clearInterval(timerId);
            timerId = null;
        }
    })

    function addScore(){
        for (let i = 0; i < 199; i += w) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
            if (row.every(i => squares[i].classList.contains('taken'))) {
                score += 10;
                linesCleared += 1;
                displayScore.innerHTML = score;
                displayLine.innerHTML = linesCleared;
                row.forEach(i => {
                    squares[i].classList.remove('taken');
                    squares[i].style.backgroundImage = ''
                })
                const squaresRemoved = squares.splice(i, w);
                squares = squaresRemoved.concat(squares)
                squares.forEach(s => tetrisGrid.appendChild(s))
            }
        }
    }

    function gameOver() {
        if (curr.some(i => squares[currPos + i].classList.contains('taken'))){
            displayScore.innerHTML = "GAMEOVER";
            clearInterval(timerId)
        }
    }
})

