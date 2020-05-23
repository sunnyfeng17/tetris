document.addEventListener('DOMContentLoaded', () => {
    const tetrisGrid = document.querySelector('.tetris-grid');
    let squares = Array.from(document.querySelectorAll('.tetris-grid div'));
    const displayScore = document.querySelector('#score');
    const startBtn = document.querySelector('#start-game');
    const w = 10;
    
    // Tetrominoes

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

    draw()

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

    timerId = setInterval(moveDown, 1000);

    function control(e) {
        if (e.keyCode === 37) {
            moveLeft();
        }
        if (e.keyCode === 38) {
            rotate();
        }
        if (e.keyCode === 39) {
            moveRight();
        }
        if (e.keyCode === 40) {
            moveDown();
        }
    }
    document.addEventListener('keyup', control)

    function moveDown() {
        undraw();
        currPos += w;
        draw();
        freeze();
    }

    function freeze() {
        if (curr.some(i => squares[currPos + i + w].classList.contains('taken'))) {
            curr.forEach(i =>squares[currPos + i].classList.add('taken'));
            r = Math.floor(Math.random() * tetrominoes.length);
            curr = tetrominoes[r][currRotate];
            currPos = 4;
            draw();
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
        console.log(currRotate, r)
        if (currRotate === curr.length) {
             currRotate = 0;
        }
        curr = tetrominoes[r][currRotate];
        draw();
    }

    let displaySquares = document.querySelectorAll('')
})

