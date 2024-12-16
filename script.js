const player = document.getElementById('player');
const gameArea = document.getElementById('gameArea');
const scoreDisplay = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const startScreen = document.getElementById('startScreen');
const helpBtn = document.getElementById('helpBtn');
const helpScreen = document.getElementById('helpScreen');

let bullets = [];
let invaders = [];
let score = 0;
let invaderSpeed = 1; 
let invaderSpawnRate = 2000; 
let gameInterval;

const bulletWidth = 10;
const bulletHeight = 20;
const invaderWidth = 60;
const invaderHeight = 60;


startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none'; 
    gameArea.style.display = 'block'; 
    startGame();
});


helpBtn.addEventListener('click', () => {
    helpScreen.style.display = 'block'; 
    gameArea.style.display = 'none';
});

document.getElementById('closeHelpBtn').addEventListener('click', () => {
    helpScreen.style.display = 'none'; 
    gameArea.style.display = 'block'; 
});


document.addEventListener('mousemove', (e) => {
    const gameAreaRect = gameArea.getBoundingClientRect();
    const playerWidth = player.offsetWidth;
    let newLeft = e.clientX - gameAreaRect.left - playerWidth / 2;

    if (newLeft < 0) newLeft = 0;
    if (newLeft > gameArea.offsetWidth - playerWidth) {
        newLeft = gameArea.offsetWidth - playerWidth;
    }
    player.style.left = `${newLeft}px`;
});


document.addEventListener('mousedown', shootBullet);
document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        shootBullet();
    }

    
    if (e.key === 'Escape') {
        resetGame();
    }
});

function shootBullet() {
    const bullet = document.createElement('div');
    bullet.classList.add('bullet');
    const playerRect = player.getBoundingClientRect();
    const gameAreaRect = gameArea.getBoundingClientRect();

    bullet.style.left = `${playerRect.left - gameAreaRect.left + player.offsetWidth / 2 - bulletWidth / 2}px`;
    bullet.style.bottom = `${gameArea.offsetHeight - (playerRect.bottom - gameAreaRect.top)}px`;

    gameArea.appendChild(bullet);
    bullets.push(bullet);

    const firingSound = new Audio('firingaudio.mp3');
    firingSound.play();
}


function spawnInvaders() {
    const invader = document.createElement('div');
    invader.classList.add('invader');

    const randomX = Math.random() * (gameArea.offsetWidth - invaderWidth);
    invader.style.left = `${randomX}px`;
    invader.style.top = '0px';

    gameArea.appendChild(invader);
    invaders.push(invader);

    setTimeout(spawnInvaders, invaderSpawnRate); 
}


function checkCollisions() {
    bullets.forEach((bullet, bulletIndex) => {
        const bulletRect = bullet.getBoundingClientRect();
        invaders.forEach((invader, invaderIndex) => {
            const invaderRect = invader.getBoundingClientRect();

           
            if (
                bulletRect.left < invaderRect.right &&
                bulletRect.right > invaderRect.left &&
                bulletRect.top < invaderRect.bottom &&
                bulletRect.bottom > invaderRect.top
            ) {
               
                bullet.remove();
                invader.remove();
                bullets.splice(bulletIndex, 1);
                invaders.splice(invaderIndex, 1);

                
                createExplosion(invaderRect.left, invaderRect.top);

                score += 10;
                scoreDisplay.textContent = `Score: ${score}`;

                const explosionSound = new Audio('expolosionaudio.mp3');
                explosionSound.play(); 
            }
        });
    });

    invaders.forEach((invader, invaderIndex) => {
        const playerRect = player.getBoundingClientRect();
        const invaderRect = invader.getBoundingClientRect();

        if (
            playerRect.left < invaderRect.right &&
            playerRect.right > invaderRect.left &&
            playerRect.top < invaderRect.bottom &&
            playerRect.bottom > invaderRect.top
        ) {
            
            endGame();

          
            createFinalExplosion(playerRect.left, playerRect.top);

        
            const audio = new Audio('finalexplosionaudio.mp3');
            audio.play();
        }
    });
}

function createExplosion(x, y) {
    const explosion = document.createElement('img');
    explosion.classList.add('explosion');
    explosion.src = 'explosion2.gif'; 
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;

    gameArea.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 500); 
}


function createFinalExplosion(x, y) {
    const explosion = document.createElement('img');
    explosion.classList.add('explosion');
    explosion.src = 'finalexplosion.png'; 
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;

    gameArea.appendChild(explosion);

    setTimeout(() => {
        explosion.remove();
    }, 500); 
}


function endGame() {
    const gameOverMessage = document.createElement('div');
    gameOverMessage.classList.add('game-over');
    gameOverMessage.textContent = 'GAME OVER';
    gameArea.appendChild(gameOverMessage);


    const gameOverImage = document.createElement('img');
    gameOverImage.src = 'gameover.gif';
    gameOverImage.style.position = 'absolute';
    gameOverImage.style.top = '50%';
    gameOverImage.style.left = '50%';
    gameOverImage.style.transform = 'translate(-50%, -50%)';
    gameOverImage.style.transition = 'opacity 1s ease-in-out';
    gameArea.appendChild(gameOverImage);

    setTimeout(() => {
        gameOverImage.style.opacity = 1;
    }, 100);

    clearInterval(gameInterval);
    document.removeEventListener('keydown', shootBullet);
    document.removeEventListener('mousedown', shootBullet);

    player.style.display = 'none';
    invaders.forEach((invader) => invader.style.display = 'none');
}

function updateGame() {
   
    bullets = bullets.filter((bullet) => {
        const bottom = parseFloat(bullet.style.bottom);
        bullet.style.bottom = `${bottom + 10}px`;

        if (bottom > gameArea.offsetHeight) {
            bullet.remove();
            return false;
        }
        return true;
    });

    
    invaders = invaders.filter((invader) => {
        const top = parseFloat(invader.style.top);
        invader.style.top = `${top + invaderSpeed}px`;

        if (top > gameArea.offsetHeight) {
            invader.remove();
            return false;
        }
        return true;
    });

    
    if (invaders.length < 5) {
        spawnInvaders();
    }

   
    checkCollisions();
}


function startGame() {
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    bullets = [];
    invaders = [];

    document.querySelectorAll('.bullet').forEach((b) => b.remove());
    document.querySelectorAll('.invader').forEach((i) => i.remove());

    spawnInvaders();
    gameInterval = setInterval(updateGame, 1000 / 60); 
}

function resetGame() {
  
    gameArea.style.display = 'none';
    startScreen.style.display = 'block';

  
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;

    player.style.display = 'block';
    invaders.forEach((invader) => invader.remove());

    const gameOverImage = document.querySelector('img[src="gameover.gif"]');
    if (gameOverImage) {
        gameOverImage.remove();
    }
}
