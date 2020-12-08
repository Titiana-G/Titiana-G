var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;

var snake = {
    x: 160,
    y: 160,


    // vitesse du serpent

    dx: grid,
    dy: 0,


    // garder une trace de toutes les grilles occupées par le corps du serpent
    cells: [],


    // longueur du serpentqui grandit en mangeant une pomme
    maxCells: 4
};
var apple = {
    x: 320,
    y: 320
};


// obtenir des nombres entiers aléatoires dans une plage spécifique
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


// boucle de jeu
function loop() {
    requestAnimationFrame(loop);


    // boucle de jeu lente à 15 fps au lieu de 60 (60/15 = 4)
    if (++count < 4) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);


    // déplace le serpent par sa vitesse
    snake.x += snake.dx;
    snake.y += snake.dy;


    // enveloppe la position du serpent horizontalement sur le bord de l'écran
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 0;
    }


    // enveloppe la position du serpent verticalement sur le bord de l'écran
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    } else if (snake.y >= canvas.height) {
        snake.y = 0;
    }


    // garder une trace de l'endroit où snake a été. l'avant du tableau est toujours la tête
    snake.cells.unshift({
        x: snake.x,
        y: snake.y
    });


    // supprime les cellules au fur et à mesure que nous nous en éloignons
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }


    // dessine la pomme
    context.fillStyle = 'red';
    context.fillRect(apple.x, apple.y, grid - 1, grid - 1);


    // dessine le serpent une cellule à la fois
    context.fillStyle = 'green';
    snake.cells.forEach(function (cell, index) {


        // dessiner 1 px plus petit que la grille crée un effet de grille dans le corps du serpent afin que vous puissiez voir combien de temps il est
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);


        // le serpent a mangé une pomme
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;


            // la toile mesure 400x400, ce qui correspond à des grilles de 25x25 
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }


        // vérifier la collision avec toutes les cellules après celle-ci (tri à bulles modifié) 
        for (var i = index + 1; i < snake.cells.length; i++) {


            // serpent occupe le même espace qu'une partie du corps. réinitialiser le jeu
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;

                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}


// écoute les événements du clavier pour déplacer le serpent
document.addEventListener('keydown', function (e) {

    // empêche le serpent de revenir en arrière sur lui-même en vérifiant qu'il est
    // ne se déplace pas déjà sur le même axe (en appuyant à gauche en se déplaçant
    // gauche ne fera rien, et appuyer à droite tout en se déplaçant à gauche
    // ne devrait pas te laisser entrer en collision avec ton propre corps)

    // touche gauche
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    //touche haut
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    //touche droite
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // touche gauche
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

//start
requestAnimationFrame(loop);