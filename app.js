document.addEventListener('DOMContentLoaded', () => {
    const tetrisGrid = document.querySelector('.tetris-grid');
    let squares = Array.from(document.querySelectorAll('.tetris-grid div'));
    const displayScore = document.querySelector('#score');
    const startBtn = document.querySelector('#start-game');
    const w = 10;
    let nextR = 0;
    let timerId;

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

    let currPos = 4
    let currRotate = 0

    let r = Math.floor(Math.random() * tetrominoes.length)
    let curr = tetrominoes[r][currRotate]

    function draw() {
        curr.forEach(i => {
            squares[currPos + i].classList.add('tetromino');
        })
    }

    function undraw() {
        curr.forEach(i => {
            squares[currPos + i].classList.remove('tetromino');
        })
    }

    function control(e) {
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
    document.addEventListener('keyup', control);

    function moveDown() {
        undraw();
        currPos += w;
        draw();
        freeze();
    }

    function freeze() {
        if (curr.some(i => squares[currPos + i + w].classList.contains('taken'))) {
            curr.forEach(i => squares[currPos + i].classList.add('taken'));
            r = nextR
            nextR = Math.floor(Math.random() * tetrominoes.length);
            curr = tetrominoes[r][currRotate];
            currPos = 4;
            draw();
            displayShape();
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
        currRotate ++;
        if (currRotate === curr.length) {
             currRotate = 0;
        }
        curr = tetrominoes[r][currRotate];
        draw();
    }

    const displaySquares = document.querySelectorAll('.upcoming-grid div')
    const displayWidth  = 4
    const displayIndex   = 0

    const nextTetrominoes = [
        [0, displayWidth , displayWidth  + 1, displayWidth  + 2], // L
        [2, displayWidth  + 2, displayWidth  + 1, displayWidth ], // J
        [1, 2, displayWidth , displayWidth  + 1], // Z
        [0, 1, displayWidth  + 1, displayWidth  + 2], // S
        [1, displayWidth , displayWidth  + 1, displayWidth  + 2], // T
        [0, 1, displayWidth , displayWidth  + 1], // O
        [1, displayWidth  + 1, displayWidth  * 2 + 1, displayWidth  * 3 + 1] // I
    ]

    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
        })
        nextTetrominoes[nextR].forEach(i => {
            displaySquares[displayIndex + i].classList.add('tetromino');
        })
    }

    startBtn.addEventListener('click', () => {
        if (timerId) { // Pause Game
            clearInterval(timerId);
            timerId = null;
        }
        else {
            draw();
            timerId = setInterval(moveDown, 1000);
            nextR = Math.floor(Math.random() * tetrominoes.length);
            displayShape();
        }
    })
})

