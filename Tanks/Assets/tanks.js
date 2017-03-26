gameObjPosition = [
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', '', '#', '', '', '#', '', '', '', '#', '#', '', '', '', '', '%', '#', '', '', '#'],
    ['#', '', '#', '', '#', '#', '', '', '%', '', '#', '', '', '', '#', '', '', '', '#', '#'],
    ['#', '', '', '', '', '', '', '', '', '', '', '', '', '#', '#', '#', '#', '', '', '#'],
    ['#', '', '^', '', '#', '%', '#', '#', '#', '#', '#', '#', '', '', '', '', '', '', '', '#'],
    ['#', '#', '#', '', '', '', '', '', '', '', '#', '', '', '#', '', '', '', '#', '', '#'],
    ['#', '', '', '', '', '', '', '', '', '', '#', '#', '', '', '%', '', '#', '#', '#', '#'],
    ['#', '', '#', '', '#', '#', '', '#', '', '#', '', '', '', '', '', '', '', '', '', '#'],
    ['#', '', '#', '', '', '#', '', '', '', '', '#', '#', '', '', '#', '', '', '', '', '#'],
    ['#', '', '', '', '#', '#', '', '', '#', '', '', '', '', '', '%', '#', '#', '', '', '#'],
    ['#', '', '%', '', '', '#', '#', '', '%', '', '', '', '', '', '#', '', '', '', '', '#'],
    ['#', '', '#', '#', '', '', '', '', '#', '', '#', '#', '', '', '', '#', '', '#', '', '#'],
    ['#', '', '', '#', '%', '#', '', '', '#', '', '', '', '', '', '', '#', '', '#', '', '#'],
    ['#', '#', '', '', '', '', '', '', '', '', '', '#', '', '#', '#', '', '^', '#', '#', '#'],
    ['#', '', '%', '#', '', '', '', '', '#', '', '', '', '', '', '#', '', '', '', '', '#'],
    ['#', '', '#', '', '', '#', '#', '#', '#', '#', '#', '', '', '', '', '', '', '', '', '#'],
    ['#', '', '', '', '', '', '', '', '', '', '', '', '#', '', '', '#', '#', '', '', '#'],
    ['#', '', '#', '', '', '', '', '', '', '#', '#', '', '#', '#', '', '#', '', '', '', '#'],
    ['#', '', '', '', '#', '#', '', '@', '#', '', '', '', '', '', '', '#', '', '', '', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#']
];



var canvas = document.getElementById('canv');
var ctx = canvas.getContext('2d');


function Text(text, text2, x, y, fontSize) {
    this.text = text;
    this.text2 = text2;
    this.y = y;
    this.x = x;
    this.fontSize = fontSize;
}

Text.prototype.updateText = function (index) {
    if (index == 0) {
        this.text2 = theGame.enemies.length;
    }
    if (index == 1) {
        this.text2 = theGame.player.lives;
    }
}

Text.prototype.drawText = function () {
    ctx.font = this.fontSize + "px Arial";
    ctx.fillStyle = 'white';
    ctx.fillText(this.text + this.text2, this.x, this.y);
}

function Sprite(img, width, height, spriteX, spriteY, y, x, rowMax, colMax) {
    this.img = new Image();
    this.img.src = img;
    this.width = width;
    this.height = height;
    this.spriteX = spriteX;
    this.spriteY = spriteY;
    this.row = 0;
    this.col = 0;
    this.rowMax = rowMax;
    this.colMax = colMax;
    this.y = y;
    this.x = x;
}
Sprite.prototype = {
    draw: function () {
        ctx.drawImage(
            this.img,
            this.spriteX * this.col,
            this.spriteY * this.row,
            this.spriteX,
            this.spriteY,
            this.x,
            this.y,
            this.width,
            this.height
        );
        if (this.col >= this.colMax) {
            this.col = 0;
            this.row++;
            if (this.row > this.rowMax) {
                theGame.explosions.splice(theGame.explosions.indexOf(this), 1);
            }
        } else {
            this.col++;
        }
    }
};



function Explosion(img, width, height, spriteX, spriteY, y, x, rowMax, colMax) {
    Sprite.apply(this, arguments);
}

Explosion.prototype = Object.create(Sprite.prototype);
Explosion.prototype.constructor = Explosion;





function Component(x, y, width, height, color, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.type = type;
    if (this.type == 'image') {
        this.image = new Image();
        this.image.src = color;
    }

}

Component.prototype.drawIt = function () {

    if (this instanceof Tank || this instanceof Bullet) {
        ctx.save();
        ctx.translate(this.x + 12.5 + this.bonusX, this.y + 12.5 + this.bonusY);
        ctx.rotate(this.angle);
    }

    if (this.type == 'image') {
        if (this instanceof Tank || this instanceof Bullet) {
            ctx.drawImage(this.image, ((this.width) / -2), ((this.height) / -2), this.width, this.height);
            ctx.restore();

        } else {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }

    } else {
        ctx.fillStyle = this.color;
        if (this instanceof Tank) {
            ctx.fillRect((this.x + this.bonusX) / -2, (this.y + this.bonusY) / -2, this.width, this.height);
            ctx.restore();
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

    }

};


Component.prototype.getCoor = function () {
    return [this.y / 25, this.x / 25];
};








function Wall(x, y, width, height, color, type) {
    Component.apply(this, arguments);
}

Wall.prototype = Object.create(Component.prototype);
Wall.prototype.constructor = Wall;


function Crate(x, y, width, height, color, type) {
    Wall.apply(this, arguments);
}

Crate.prototype = Object.create(Wall.prototype);
Crate.prototype.constructor = Crate;



function MovableObj(x, y, width, height, color, type) {
    Component.apply(this, arguments);
    this.bonusX = 0;
    this.bonusY = 0;
    this.angle = 0;
    this.isMoving = false;
}

MovableObj.prototype = Object.create(Component.prototype);
MovableObj.prototype.constructor = MovableObj;

MovableObj.prototype.makeExplosion = function () {
    if (this instanceof Tank) {
        theGame.explosions.push(new Explosion('./images/explosion.png', 35, 35, 120, 120, this.y, this.x, 4, 4));
    } else {
        theGame.explosions.push(new Explosion('./images/explosion.png', 25, 25, 120, 120, this.y, this.x, 4, 4));
    }
}

MovableObj.prototype.move = function (way, updateY, updateX) {
    if (!this.isMoving) {
        this.isMoving = true;

        if (this instanceof Tank) {

            if (way != this.direction) {
                if (way == 'up') {
                    if (this.angle == 270 * Math.PI / 180) {
                        this.rotate(360 * Math.PI / 180);
                    } else if (this.angle == -270 * Math.PI / 180) {
                        this.rotate(-360 * Math.PI / 180);
                    } else {
                        this.rotate(0);
                    }

                    this.direction = 'up';

                }
                if (way == 'down') {
                    if (this.angle == -90 * Math.PI / 180 || this.angle == -270 * Math.PI / 180) {
                        this.rotate(-180 * Math.PI / 180);
                    } else {
                        this.rotate(180 * Math.PI / 180);
                    }
                    this.direction = 'down';
                }
                if (way == 'right') {
                    if (this.angle == -180 * Math.PI / 180) {
                        this.rotate(-270 * Math.PI / 180);
                    } else {
                        this.rotate(90 * Math.PI / 180);
                    }
                    this.direction = 'right';
                }
                if (way == 'left') {
                    if (this.angle == 180 * Math.PI / 180) {
                        this.rotate(270 * Math.PI / 180);
                    } else {
                        this.rotate(-90 * Math.PI / 180);
                    }
                    this.direction = 'left';
                }
                return;
            }
        }

        var coor = this.getCoor();
        if (way == 'up' && this.canMoveTo(coor[0] - 1, coor[1], way)) {
            if (updateY == undefined || updateX == undefined) {
                updateY = -4;
                updateX = 0;
            }
            this.updateBonus(updateY, updateX, -1, 0, way);
        } else if (way == 'down' && this.canMoveTo(coor[0] + 1, coor[1], way)) {
            if (updateY == undefined || updateX == undefined) {
                updateY = 4;
                updateX = 0;
            }
            this.updateBonus(updateY, updateX, 1, 0, way);
        } else if (way == 'right' && this.canMoveTo(coor[0], coor[1] + 1, way)) {
            if (updateY == undefined || updateX == undefined) {
                updateY = 0;
                updateX = 4;
            }
            this.updateBonus(updateY, updateX, 0, 1, way);
        } else if (way == 'left' && this.canMoveTo(coor[0], coor[1] - 1, way)) {
            if (updateY == undefined || updateX == undefined) {
                updateY = 0;
                updateX = -4;
            }
            this.updateBonus(updateY, updateX, 0, -1, way);
        } else {
            this.isMoving = false;
        }

    }
}

MovableObj.prototype.updatePosition = function (y, x) {
    if (this.isMoving) {
        var coor = this.getCoor();
        if (this instanceof Bullet && gameObjPosition[coor[0]][coor[1]] != '-') {
            gameObjPosition[coor[0] + y][coor[1] + x] = '-';
        } else {
            var syb = gameObjPosition[coor[0]][coor[1]];
            gameObjPosition[coor[0]][coor[1]] = '';
            gameObjPosition[coor[0] + y][coor[1] + x] = syb;
        }


        this.x = (coor[1] + x) * 25;
        this.y = (coor[0] + y) * 25;
        this.bonusX = 0;
        this.bonusY = 0;
        this.isMoving = false;
    }

};

MovableObj.prototype.updateBonus = function (updateY, updateX, coor1, coor2, way) {
    var coor = this.getCoor();
    gameObjPosition[coor[0] + coor1][coor[1] + coor2] = 'x';
    var interval = setInterval(function () {

        if (this.bonusX >= 20 || this.bonusX <= -20 || this.bonusY >= 20 || this.bonusY <= -20) {

            clearInterval(interval);
            this.updatePosition(coor1, coor2);
            if (this instanceof Bullet) {
                this.move(way, updateY, updateX);
            }
        } else {
            this.bonusY += updateY
            this.bonusX += updateX
        }

    }.bind(this), 20);

}

MovableObj.prototype.canMoveTo = function (y, x, way) {
    if (gameObjPosition[y][x] == '') {

        return true;
    }
    if (this instanceof Bullet) {
        this.hit(y, x, way);
    }


    return false;
}





function Tank(x, y, width, height, color, type) {
    MovableObj.apply(this, arguments);
    this.direction = 'up';
    this.hasShot = false;
    this.bullets = [];
}

Tank.prototype = Object.create(MovableObj.prototype);
Tank.prototype.constructor = Tank;

Tank.prototype.shoot = function () {
    if (this instanceof Player) {
        this.bullets.push(new PlayerBullet(this.x,
            this.y,
            this.width - 10,
            this.height - 3,
            'images/bulletP.png',
            'image',
            this.angle));

        this.bullets[this.bullets.length - 1].move(this.direction)
    }
    if (this instanceof Enemy) {
        this.bullets.push(new EnemyBullet(this.x,
            this.y,
            this.width - 10,
            this.height - 3,
            'images/bulletE.png',
            'image',
            this.angle));
        this.bullets[this.bullets.length - 1].move(this.direction)
    }

}


Tank.prototype.rotate = function (newAngle) {

    if (this.angle >= newAngle) {
        var interval = setInterval(function () {
            this.angle -= 5 * Math.PI / 180;
            if (this.angle <= newAngle) {
                this.angle = newAngle;
                clearInterval(interval);
                this.isMoving = false;
                if (this.angle == 360 * Math.PI / 180 || this.angle == -360 * Math.PI / 180) {
                    this.angle = 0;
                }
            }
        }.bind(this), 20);
    } else {
        var interval = setInterval(function () {
            this.angle += 5 * Math.PI / 180;
            if (this.angle >= newAngle) {
                this.angle = newAngle;
                clearInterval(interval);
                this.isMoving = false;
                if (this.angle == 360 * Math.PI / 180 || this.angle == -360 * Math.PI / 180) {
                    this.angle = 0;
                }
            }
        }.bind(this), 20);
    }

}





function Player(x, y, width, height, color, type) {
    Tank.apply(this, arguments);
    this.lives = 2;
}

Player.prototype = Object.create(Tank.prototype);
Player.prototype.constructor = Player;




function Enemy(x, y, width, height, color, type) {
    Tank.apply(this, arguments);
}

Enemy.prototype = Object.create(Tank.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.bot = function () {
    if (!this.isMoving) {
        var whatToDo = this.checkSides();

        switch (whatToDo) {
            case 1: this.move('up', -2, 0); break;
            case 2: this.move('down', 2, 0); break;
            case 3: this.move('left', 0, -2); break;
            case 4: this.move('right', 0, 2); break;
            case 5:
                if (!this.hasShot) {
                    this.hasShot = true;
                    this.shoot();
                    setTimeout(function () {
                        this.hasShot = false;
                    }.bind(this), 1000);
                } break;

        }
    }
}


Enemy.prototype.checkSides = function () {
    var coor = this.getCoor();
    var shooting = this.canShootPlayer();
    if (shooting[0]) {
        if (shooting[1] == this.direction) {
            return 5;
        } else {
            if (shooting[1] == 'up') {
                return 1;
            }
            if (shooting[1] == 'down') {
                return 2;
            }
            if (shooting[1] == 'left') {
                return 3;
            }
            if (shooting[1] == 'right') {
                return 4;
            }
        }
    }
    if (Math.floor(Math.random() * 10) + 1 > 1) {
        if (this.direction == 'up') {
            if (gameObjPosition[coor[0] - 1][coor[1]] == '') {
                return 1;
            } else {
                var avail = this.randAvail();
                return avail[Math.floor(Math.random() * avail.length)];
            }
        } else if (this.direction == 'down') {
            if (gameObjPosition[coor[0] + 1][coor[1]] == '') {
                return 2;
            } else {
                var avail = this.randAvail();
                return avail[Math.floor(Math.random() * avail.length)];
            }
        } else if (this.direction == 'left') {
            if (gameObjPosition[coor[0]][coor[1] - 1] == '') {
                return 3;
            } else {
                var avail = this.randAvail();
                return avail[Math.floor(Math.random() * avail.length)];
            }
        } else {
            if (gameObjPosition[coor[0]][coor[1] + 1] == '') {
                return 4;
            } else {
                var avail = this.randAvail();
                return avail[Math.floor(Math.random() * avail.length)];
            }
        }
    } else {
        var avail = this.randAvail();
        return avail[Math.floor(Math.random() * avail.length)];
    }
}

Enemy.prototype.canShootPlayer = function () {
    var coor = this.getCoor();
    var coorP = theGame.player.getCoor();

    if (coor[0] == coorP[0]) {
        if (coor[1] > coorP[1]) {
            for (var index = coorP[1]; index < coor[1]; index++) {
                if (gameObjPosition[coor[0]][index] == '#') {
                    return [false];
                }
            }
            return [true, 'left'];
        } else {
            for (var index = coor[1]; index < coorP[1]; index++) {
                if (gameObjPosition[coor[0]][index] == '#') {
                    return [false];
                }
            }
            return [true, 'right'];
        }
    } else if (coor[1] == coorP[1]) {
        if (coor[0] > coorP[0]) {
            for (var index = coorP[0]; index < coor[0]; index++) {
                if (gameObjPosition[index][coor[1]] == '#') {
                    return [false];
                }
            }
            return [true, 'up'];
        } else {
            for (var index = coor[0]; index < coorP[0]; index++) {
                if (gameObjPosition[index][coor[1]] == '#') {
                    return [false];
                }
            }
            return [true, 'down'];
        }
    } else {
        return [false];
    }
}

Enemy.prototype.randAvail = function () {
    var coor = this.getCoor();

    if (gameObjPosition[coor[0] - 1][coor[1]] == '' &&
        gameObjPosition[coor[0] + 1][coor[1]] == '' &&
        gameObjPosition[coor[0]][coor[1] - 1] == '' &&
        gameObjPosition[coor[0]][coor[1] + 1] == '') {
        return [1, 2, 3, 4];
    } else if (gameObjPosition[coor[0] - 1][coor[1]] == '' &&
        gameObjPosition[coor[0] + 1][coor[1]] == '' &&
        gameObjPosition[coor[0]][coor[1] - 1] == '') {
        return [1, 2, 3];
    } else if (gameObjPosition[coor[0] - 1][coor[1]] == '' &&
        gameObjPosition[coor[0] + 1][coor[1]] == '' &&
        gameObjPosition[coor[0]][coor[1] + 1] == '') {
        return [1, 2, 4];
    } else if (gameObjPosition[coor[0] - 1][coor[1]] == '' &&
        gameObjPosition[coor[0]][coor[1] - 1] == '' &&
        gameObjPosition[coor[0]][coor[1] + 1] == '') {
        return [1, 3, 4];
    } else if (gameObjPosition[coor[0] + 1][coor[1]] == '' &&
        gameObjPosition[coor[0]][coor[1] - 1] == '' &&
        gameObjPosition[coor[0]][coor[1] + 1] == '') {
        return [2, 3, 4];
    } else if (gameObjPosition[coor[0] - 1][coor[1]] == '' &&
        gameObjPosition[coor[0] + 1][coor[1]] == '') {
        return [1, 2];
    } else if (gameObjPosition[coor[0] - 1][coor[1]] == '' &&
        gameObjPosition[coor[0]][coor[1] - 1] == '') {
        return [1, 3];
    } else if (gameObjPosition[coor[0] - 1][coor[1]] == '' &&
        gameObjPosition[coor[0]][coor[1] + 1] == '') {
        return [1, 4];
    } else if (gameObjPosition[coor[0] + 1][coor[1]] == '' &&
        gameObjPosition[coor[0]][coor[1] - 1] == '') {
        return [2, 3];
    } else if (gameObjPosition[coor[0] + 1][coor[1]] == '' &&
        gameObjPosition[coor[0]][coor[1] + 1] == '') {
        return [2, 4];
    } else if (gameObjPosition[coor[0]][coor[1] - 1] == '' &&
        gameObjPosition[coor[0]][coor[1] + 1] == '') {
        return [3, 4];
    } else if (gameObjPosition[coor[0] - 1][coor[1]] == '') {
        return [1];
    } else if (gameObjPosition[coor[0] + 1][coor[1]] == '') {
        return [2];
    } else if (gameObjPosition[coor[0]][coor[1] - 1] == '') {
        return [3];
    } else {
        return [4];
    }


}

function Bullet(x, y, width, height, color, type, angle) {
    MovableObj.call(this, x, y, width, height, color, type);
    this.angle = angle;
}

Bullet.prototype = Object.create(MovableObj.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.hit = function (y, x, way) {
    for (var index = 0; index < 3; index++) {
        if (way == 'up') {
            this.bonusY += -4;
        }
        if (way == 'down') {
            this.bonusY += 4;
        }
        if (way == 'left') {
            this.bonusX += -4;
        }
        if (way == 'right') {
            this.bonusX += 4;
        }

    }
    setTimeout(function () {
        this.bonusY = 0;
        this.bonusX = 0;



        if (this instanceof PlayerBullet) {
            if (gameObjPosition[y][x] == '^') {
                for (var index = 0; index < theGame.enemies.length; index++) {
                    var coor = theGame.enemies[index].getCoor();

                    if (y == coor[0] && x == coor[1]) {
                        theGame.enemies[index].makeExplosion();
                        theGame.enemies.splice(index, 1);
                        gameObjPosition[y][x] = '';
                        theGame.player.bullets.splice(theGame.player.bullets.indexOf(this), 1);
                        if (gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] == '-') {
                            gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] = '';
                        }
                        if (theGame.enemies.length <= 0) {
                            setTimeout(function () {
                                theGame.stop('win');
                            }, 200)
                        }
                    }
                }
            } else if (gameObjPosition[y][x] == '%') {
                for (var index = 0; index < theGame.crates.length; index++) {
                    var coor = theGame.crates[index].getCoor();
                    if (y == coor[0] && x == coor[1]) {
                        gameObjPosition[y][x] = '';
                        theGame.crates.splice(theGame.crates.indexOf(theGame.crates[index]), 1);
                        theGame.player.bullets.splice(theGame.player.bullets.indexOf(this), 1);

                        if (gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] == '-') {
                            gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] = '';
                        }
                    }
                }
            } else {
                theGame.player.bullets.splice(theGame.player.bullets.indexOf(this), 1);
                if (gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] == '-') {
                    gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] = '';
                }
            }
            this.makeExplosion();
        }


        if (this instanceof EnemyBullet) {
            if (gameObjPosition[y][x] == '@') {

                theGame.player.lives--;
                if (theGame.player.lives <= 0) {
                    theGame.player.makeExplosion();
                    theGame.player.width = 0;
                    theGame.player.height = 0;

                    gameObjPosition[y][x] = '';


                    setTimeout(function () {
                        theGame.stop('lose');
                    }, 200)
                }
                for (var index = 0; index < theGame.enemies.length; index++) {
                    if (theGame.enemies[index].bullets.indexOf(this) != -1) {
                        theGame.enemies[index].bullets.splice(theGame.enemies[index].bullets.indexOf(this), 1);
                    }
                }
                if (gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] == '-') {
                    gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] = '';
                }
            } else if (gameObjPosition[y][x] == '%') {
                for (var index = 0; index < theGame.crates.length; index++) {
                    var coor = theGame.crates[index].getCoor();
                    if (y == coor[0] && x == coor[1]) {
                        gameObjPosition[y][x] = '';

                        theGame.crates.splice(theGame.crates.indexOf(theGame.crates[index]), 1);

                        for (var index = 0; index < theGame.enemies.length; index++) {
                            if (theGame.enemies[index].bullets.indexOf(this) != -1) {
                                theGame.enemies[index].bullets.splice(theGame.enemies[index].bullets.indexOf(this), 1);
                            }
                        }
                        if (gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] == '-') {
                            gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] = '';
                        }
                    }
                }
            } else {
                for (var index = 0; index < theGame.enemies.length; index++) {
                    if (theGame.enemies[index].bullets.indexOf(this) != -1) {
                        theGame.enemies[index].bullets.splice(theGame.enemies[index].bullets.indexOf(this), 1);
                    }
                }
                if (gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] == '-') {
                    gameObjPosition[this.getCoor()[0]][this.getCoor()[1]] = '';
                }
                this.makeExplosion();
            }

        }


    }.bind(this), 100);
}


function PlayerBullet(x, y, width, height, color, type, angle) {
    Bullet.call(this, x, y, width, height, color, type, angle);
}

PlayerBullet.prototype = Object.create(Bullet.prototype);
PlayerBullet.prototype.constructor = PlayerBullet;

function EnemyBullet(x, y, width, height, color, type, angle) {
    Bullet.call(this, x, y, width, height, color, type, angle);
}

EnemyBullet.prototype = Object.create(Bullet.prototype);
EnemyBullet.prototype.constructor = EnemyBullet;


var theGame = {
    texts: [],
    walls: [],
    crates: [],
    enemies: [],
    player: null,
    explosions: [],
    frame: null,


    startGame: function () {
        theGame.getComponents();
        theGame.displayComponents();

        theGame.frame = requestAnimationFrame(theGame.update);
    },

    getComponents: function () {

        for (var index = 0; index < gameObjPosition.length; index++) {
            for (var index2 = 0; index2 < gameObjPosition[index].length; index2++) {
                var element = gameObjPosition[index][index2];
                if (element == '#') {
                    theGame.walls.push(new Wall(25 * index2, 25 * index, 25, 25, 'images/wall.png', 'image'));
                }
                if (element == '@') {
                    theGame.player = new Player(25 * index2, 25 * index, 25, 25, 'images/tankPlayer.png', 'image');
                }
                if (element == '^') {
                    theGame.enemies.push(new Enemy(25 * index2, 25 * index, 25, 25, 'images/tankEnemy.png', 'image'));
                }
                if (element == '%') {
                    theGame.crates.push(new Crate(25 * index2, 25 * index, 25, 25, 'images/crate.png', 'image'));
                }
            }
        }

        theGame.texts.push(new Text('Enemy tanks: ', theGame.enemies.length, 20, 30, 15));
        theGame.texts.push(new Text('Player lives: ', theGame.player.lives, 20, 50, 15));

    },

    displayComponents: function () {


        for (var index = 0; index < theGame.walls.length; index++) {
            theGame.walls[index].drawIt();
        }

        for (var index = 0; index < theGame.crates.length; index++) {
            theGame.crates[index].drawIt();
        }
        for (var index = 0; index < theGame.enemies.length; index++) {
            theGame.enemies[index].drawIt();
            theGame.enemies[index].bot();

            for (var index2 = 0; index2 < theGame.enemies[index].bullets.length; index2++) {
                theGame.enemies[index].bullets[index2].drawIt();
            }
        }
        for (var index = 0; index < theGame.explosions.length; index++) {
            theGame.explosions[index].draw();
        }
        for (var index = 0; index < theGame.player.bullets.length; index++) {
            theGame.player.bullets[index].drawIt();
        }


        theGame.player.drawIt();

        for (var index = 0; index < theGame.texts.length; index++) {
            theGame.texts[index].updateText(index);
            theGame.texts[index].drawText();
        }

    },

    update: function () {
        theGame.clear();
        theGame.displayComponents();
        theGame.frame = requestAnimationFrame(theGame.update);
    },

    clear: function () {
        ctx.clearRect(0, 0, 500, 500);
    },

    stop: function (state) {

        if (state == 'lose') {
            theGame.texts.push(new Text('You Lose', ' ', 190, 230, 30));
        } else if (state == 'win') {
            theGame.texts.push(new Text('You Win', ' ', 190, 230, 30));
        }


        for (var index = 0; index < theGame.texts.length; index++) {
            theGame.texts[index].updateText(index);
            theGame.texts[index].drawText();
        }
        cancelAnimationFrame(theGame.frame);
    },


}

setTimeout(theGame.startGame, 500);







document.addEventListener('keydown', function (e) {
    if (!theGame.player.isMoving) {
        switch (e.keyCode) {
            case 38: theGame.player.move('up', -3, 0); break;
            case 40: theGame.player.move('down', 3, 0); break;
            case 37: theGame.player.move('left', 0, -3); break;
            case 39: theGame.player.move('right', 0, 3); break;
            case 32:
                if (!theGame.player.hasShot) {
                    theGame.player.hasShot = true;
                    theGame.player.shoot();
                    setTimeout(function () {
                        theGame.player.hasShot = false;
                    }, 500);
                } break;

        }
    }
});

