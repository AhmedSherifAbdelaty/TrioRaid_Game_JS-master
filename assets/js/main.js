/**
 * @author Milad, Ahmed khatab,Amr mousa,Ahmed sherif
 * @description General class for game
 */
document.onreadystatechange = function () {
    var state = document.readyState;
    if (state == 'complete') {
        document.getElementById('interactive');
        document.getElementById('loading-page').style.visibility = "hidden";
    }
};

class Character {//start General class
    /**
     * 
     * @param {*} src URL of image
     * @param {*} classsName  CSS class to character style
     * @param {Number} characterBottomPos  The space between character and window bottom
     * @param {Number} characterLeftPos  The space between character and window left
     */
    constructor(src, classsName, characterBottomPos, characterLeftPos) {
        this.src = src;
        this.classsName = classsName;
        this.characterBottomPos = characterBottomPos;
        this.characterLeftPos = characterLeftPos;
    }
    /**
     * @description  Method for creating character
     * @argument method not required Arguments
     */
    createCharacter() {
        var character = document.createElement('img'); //create new Element
        character.setAttribute('src', this.src); //setting SRC attribute for putting url of image
        character.setAttribute('class', this.classsName); // setting CLASS attribute for image
        character.style.position = 'absolute'; // Setting the absolute position to image
        character.style.bottom = this.characterBottomPos + 'px'; //setting bottom space to character
        character.style.left = this.characterLeftPos + 'px'; //setting left space to character
        document.body.appendChild(character); //Appending new element to html file (DOM)
    }
}//end general Class

/**
 * @author Milad, Ahmed,Amr,Ahmed
 * @description Class for Hero character
 */
class Hero extends Character {//start hero class
    /**
     * 
     * @param {*} src URL of image
     * @param {*} classsName  CSS class to character style
     * @param {Number} characterBottomPos  The space between character and window bottom
     * @param {Number} characterLeftPos  The space between character and window left
     */
    constructor(src, classsName, characterBottomPos, characterLeftPos) {
        super(src, classsName, characterBottomPos, characterLeftPos);
    }
    /**
     * @description Method move hero left and right 
     * @param {Event} event Event Object
     * @param {Number} windowWidth Int Number (width of window)
     */
    moveHero(event, windowWidth) { //start method of move hero  
        var hero = document.getElementsByClassName('sea-hero')[0]; //Get hero element from html 
        if (hero != null && hero != undefined) { //check hero if exist or not
            try { //for chatch unexpected error
                if (event.keyCode == 37) { // check if left arrow button pressed on keyboard
                    this.leftArrowPress(hero); //calling function to move hero to left
                } else if (event.keyCode == 39) { //check if right arrow button pressed on keyboard
                    this.rightArrowPress(hero, windowWidth); //calling function to move hero to right
                } else if (event.keyCode == 65) { //check if  character (d) button pressed on keyboard
                    this.leftArrowPress(hero); //calling function to move hero to left
                } else if (event.keyCode == 68) { //check if character (a) button pressed on keyboard
                    this.rightArrowPress(hero, windowWidth); //calling function to move hero to right
                }
            } catch (error) { //catch error
                // console.log(error); //log unexpected error on console
            }

        }
    }//End method of move hero
    /**
     * @description Method for pressing left arrow in keyboard
     * @param {*} hero  Html Element 
     */
    leftArrowPress(hero) {
        if (parseInt(hero.style.left) > 100) {
            hero.style.left = parseInt(hero.style.left) - 8 + 'px';
        }
    }
    /**
     * @description Method for pressing right arrow in keyboard
     * @param {*} hero  Html Element
     * @param {Number} windowWidth width of window
     */
    rightArrowPress(hero, windowWidth) {
        if (parseInt(hero.style.left) < windowWidth - 100) {
            hero.style.left = parseInt(hero.style.left) + 8 + 'px';
        }
    }
}//end hero class

/**
 * @author Milad, Ahmed, Amr, Ahmed
 * @description class for Hero shots
 */

class HeroShot extends Character {//start heroShot class
    /**
     * 
     * @param {*} src URL of image
     * @param {*} classsName  CSS class to character style
     * @param {Number} characterBottomPos  The space between character and window bottom
     * @param {Number} characterLeftPos  The space between character and window left
     */
    constructor(src, classsName, characterBottomPos, characterLeftPos) {
        super(src, classsName, characterBottomPos, characterLeftPos);
    }

    /**
     * @description Mthod for creating Hero Shot 
     * @argument Method not required arguments
     */
    createShot() {
        var audio = new Audio('../assets/audio/missile.mp3');//creating audio object
        var heroShots = document.getElementsByClassName('missile1'); //get the hero shot if exist

        if (heroShots.length == 0) { // check the number of hero shot for prevent the play shot multi shots
            this.createCharacter(); //calling create method   
            audio.play(); // playing audio
        }
    }

    /**
     * @description shotMove method to move hero shot 
     * @param {*} heroShotObj   the heroshot object created (Object)
     */
    shotMove(heroShotObj) {
        try {
            var heroShot = document.getElementsByClassName('missile1'); //get shots of hero from html file  by class name
            var enemies = document.getElementsByClassName('sea-enemy'); //get enemies from html file by class name
            var loadShot = document.getElementsByClassName('sea-hero')[0];//for loading bar

            var index = 0;

            if (heroShot[index] != null) { //check if heroshot exist or not
                heroShot[index].style.bottom = parseInt(heroShot[index].style.bottom) + 1 + 'px'; //move shot
                loadShot.style.borderBottom = "15px solid red"; //set loading of shot to red
            }

            //kill enemy
            heroShotObj.killEnemy(enemies, heroShot, loadShot, index); // calling killEnemy method for killing enemy

            if (enemies.length == 0) {//for checking killed all enemies
                clearInterval(moveHeroShot); //clear interval of hero shot
                clearInterval(moveHeroShotdouble); //clear interval of hero shot
                heroShotObj.nextLevels(); // call nextLevels method                
            }

            if (heroShot != null) { // check if hero exist by flag heroShot 
                if (parseInt(heroShot[index].style.bottom) >= parseInt(enemies[0].style.bottom)) {//if the shot of hero out the last enemy bottom border it will be deleted
                    document.body.removeChild(heroShot[index]);//remove the heroShot
                    loadShot.style.borderBottom = '15px solid green'; // Loading green 
                }
            }

        } catch (error) {
            // console.log(error);
        }
    }

    /**
     * 
     * @param {*} enemies   Array Of enemies 
     * @param {*} heroShot   shots of hero
     * @param {*} loadShot  for Loaging bar 
     * @param {*} index     variable for indexing
     */
    killEnemy(enemies, heroShot, loadShot, index) {

        for (let i = 0; i < enemies.length; i++) {//for checking if  the shot of hero collides the enemies 
            //50 is shot height
            if (heroShot[index] != null && parseInt(heroShot[index].style.bottom) + 50 == parseInt(enemies[i].style.bottom) ||
                parseInt(heroShot[index].style.bottom) == parseInt(enemies[i].style.bottom)) { //check the bottom of hero == bottom of enemy

                //16 width of shoting and 51 the width of enemy
                if (enemies[i] != null && parseInt(enemies[i].style.left) <= parseInt(heroShot[index].style.left) &&
                    parseInt(heroShot[index].style.left) + 16 <= parseInt(enemies[i].style.left) + 51) {//check the shot in the body of enemy

                    enemies[i].setAttribute('src', '../assets/img/giphy.gif'); //when enemy die
                    var audio = new Audio('../assets/audio/explode.mp3'); // create audio Object
                    audio.play(); // play audio

                    document.body.removeChild(heroShot[index]); //delete shot of the hero (change src of enemy to explode)
                    loadShot.style.borderBottom = '15px solid green'; // you can shot the loading green

                    //delay before delete the explode of enemy
                    setTimeout(function () {
                        document.body.removeChild(enemies[i]); // delete the explode (enemy)
                        heroShot = null; // flag for making sure the enemy was deleted  
                        score += 1; // increament the score of hero
                        document.getElementById('Score').textContent = score; //butting the score to html file
                    }, 200);


                }
            }
        }
    } //end killEnemy Method

    /**
     * @description nextLevels Method for calling next level whem user win
     */
    nextLevels() {

        if (numberOfLevels < 3) { //levels of hero
            
            clearInterval(moveOfEnemy);
            clearInterval(moveHeroShot);
            clearInterval(moveHeroShotdouble);

            numberOfLevels++; //increament level when kill all enemy in this level
            document.body.removeChild(document.getElementsByClassName('sea-hero')[0]);//remove hero after win
            var nextLevel = document.createElement('p');//create p element

            nextLevel.setAttribute('id', 'nextLevelContainer'); //set id to p element

            nextLevel.innerHTML = `<button 
                                        id='nextLevel' 
                                        onclick=
                                        levels(${enemySpeed / 2.5},'${heroSrc}','${enemySrc}',${shotHeroSpeed / 5})
                                        >
                                            Next Level
                                        </button>`; //create button for next level and call levels method when click on it
            document.body.appendChild(nextLevel);//append p element to html file

        } else if (numberOfLevels ==3) { // check if hero finshed the three level of game
            clearInterval(moveOfEnemy);
            clearInterval(moveHeroShot);
            clearInterval(moveHeroShotdouble);
            
            document.body.removeChild(document.getElementsByClassName('sea-hero')[0]); //remove hero after win
            var win = document.createElement('p');//create new p element
            win.setAttribute('id', 'win'); //set id to p element
            win.innerHTML = `You Win <br> 
                                            <button id='play_again' onclick="window.location.reload(true);"> 
                                                Play Again 
                                            </button>`;//button if user to want play again
            document.body.appendChild(win);//append p element
        }


    }//end nextLevel Method

}//end heroShot class

class Enemies extends Character {//start enemies class
    constructor(src, classsName, characterBottomPos, characterLeftPos) {
        super(src, classsName, characterBottomPos, characterLeftPos);
    }

    /**
     * @description enemyCreate method for creating enemy
     */
    enemyCreate() {
        this.createCharacter();
    } //end enemyCreate method

    /**
     * @description moveEnemy method for moving enemies to down
     * @param {*} Enemy  Enemy is object
     */
    moveEnemy(Enemy) {
        var enemies = document.getElementsByClassName('sea-enemy');//get all enemies (array)
        var hero = document.getElementsByClassName('sea-hero')[0]; //get hero
        var catchHero = document.getElementsByClassName('sea-hero');
        //loop for move all enemies
        for (let index = 0; index < enemies.length; index++) {
            enemies[index].style.bottom = parseInt(enemies[index].style.bottom) - 1 + 'px';//move enemy by decreacing bottom
        }
        
        Enemy.killHero(hero, enemies); //calling  killed hero method

        if (catchHero.length == 0) { //hero back to live
            Enemy.livesOfHero(); //calling Lives of hero method
        }
    }

    /**
     * 
     * @param {*} hero the objecto of hero
     * @param {*} enemies  array of enemies
     */
    killHero(hero, enemies) {
        for (let index = 0; index < enemies.length; index++) {
            //110 the height of hero and and paading bottom of hero
            if (parseInt(enemies[index].style.bottom) - 110 == 0) {
                hero.setAttribute('src', '../assets/img/explode.gif');//hero died by change his src 
                var audio = new Audio('../assets/audio/explode.mp3'); // create audio
                audio.play();
                try {

                    document.body.removeChild(hero); //remove hero
                } catch (error) {

                }
                //remove all enemies
                for (let m = 0; m < 7; m++) { // for loop all enemies (all numbers of enemies)
                    for (let i = 0; i < enemies.length; i++) {
                        document.body.removeChild(enemies[i]); // remove enemy in i index 
                    }
                }
            }
        }

    } //end killHero Method

    /**
     * @description For live back of hero
     */
    livesOfHero() {
        clearInterval(moveOfEnemy); //clear set interval of enemy

        //delay of back live
        setTimeout(function () {
            if (lives > 1) { //check the lives number
                lives--; // decrease the live by one
                clearInterval(moveHeroShot); //clear interval of hero shot

                score = 0; // rest score
                document.getElementById('Score').textContent = score; //putting the resetting score to html 
                document.getElementById('lives').textContent = lives; //putting the lives in the html

                //delay the main function to new live
                setTimeout(function () {
                    levels(enemySpeed, heroSrc, enemySrc, shotHeroSpeed); //main function
                }, 1000);

            } else if (lives == 1) { // of the game end
                clearInterval(moveOfEnemy);
                clearInterval(moveHeroShot);
                clearInterval(moveHeroShotdouble);

                document.getElementById('lives').textContent = 0;
                var gameOver = document.createElement('p');
                gameOver.setAttribute('id', 'gameOver');
                gameOver.innerHTML = 'Game Over<br><button id = "play_again" onclick="window.location.reload(true);"> Play Again </button>';
                document.body.appendChild(gameOver);
                document.getElementById('home').style.display = 'block';
            }
        }, 500);

    }//end lives method
}//end enemies class

//create shot of enemies
class EnemiesShot extends Character {
    constructor(src, classsName, characterBottomPos, characterLeftPos) {
        super(src, classsName, characterBottomPos, characterLeftPos);
    }
    //create enemiesShot
    enemiesShotCreate() {
        this.createCharacter();
    }//end enemiesShotCreate
    //Move Enemy
    /**
     * 
     * @param {*} shotOfEnemy the object of enemy shot
     * @param {*} moveOfshot  inteval of shot enemy
     */
    enemiesMoveShot(shotOfEnemy, moveOfshot) {
        try {
            shotOfEnemy.style.bottom = parseInt(shotOfEnemy.style.bottom) - 10 + 'px'; /// to move down bullet

            var hero = document.getElementsByClassName('sea-hero')[0];//catch hero

            if (hero != null && hero != undefined && parseInt(shotOfEnemy.style.bottom) <= 100) {//check the bottom of shot arrive the bottom of hero + hero height
                if (parseInt(shotOfEnemy.style.left) >= parseInt(hero.style.left) &&
                    parseInt(shotOfEnemy.style.left) <= parseInt(hero.style.left) + 80) { //80 = the width of hero 
                    clearInterval(moveOfshot); //stop enemy shot
                    document.body.removeChild(shotOfEnemy); //remove shot
                    hero.src = '../assets/img/giphy.gif'; // kill hero by change src
                    var audio = new Audio('../assets/audio/explode.mp3'); //create audio
                    audio.play();

                    //return back hero
                    setTimeout(function () {
                        hero.src = `${heroSrc}`;
                    }, 200);

                    lives -= 1;
                    document.getElementById('lives').textContent = lives;

                    if (lives == 0) {
                        clearInterval(moveOfEnemy);
                        clearInterval(moveHeroShot);
                        clearInterval(moveHeroShotdouble);

                        document.getElementById('lives').textContent = 0;
                        var gameOver = document.createElement('p');
                        gameOver.setAttribute('id', 'gameOver');
                        gameOver.innerHTML = 'Game Over<br><button id = "play_again" onclick="window.location.reload(true);"> Play Again </button>';
                        document.body.appendChild(gameOver);
                        document.getElementById('home').style.display = 'block';
                        document.body.removeChild(hero);
                        clearInterval(moveOfEnemy);
                        clearInterval(shotOfenemy);
                    }
                }
            }


            if (parseInt(shotOfEnemy.style.bottom) <= 80) {
                try {
                    document.body.removeChild(shotOfEnemy);
                } catch (error) {

                }
            }

        } catch (error) {

        }

    }
}


/**
 * Bulidig game
 */

/**
 * Global variable
 */
//for set interval of heroShot and enemy moves
var moveHeroShot, moveHeroShotdouble, moveOfEnemy;
//for start enemy speed , enemy url and hero url
var enemySpeed, heroSrc, enemySrc;

var score = 0; // for score of hero
var shotHeroSpeed = 5; //start speed of hero
var numberOfLevels = 1; // for levels in game
var lives = 3; //for Lives of Hero


function levels(speed, srcHero, srcEnemy, shotHeroSpeed) {
    var start = document.getElementById('start');
    var nextLevel = document.getElementById('nextLevelContainer');

    if (start != null && start != undefined) {
        document.body.removeChild(start);
    }

    if (nextLevel != null && nextLevel != undefined) {
        document.body.removeChild(nextLevel);
    }

    var windowWidth = window.innerWidth;
    var windowHieght = window.innerHeight;

    enemySpeed = speed;
    heroSrc = srcHero;
    enemySrc = srcEnemy;
    var enemyMarginTop = 200;
    //====================================< Create Enemies >==========================================
    var Enemy;
    for (let index = 0; index < 3; index++) {
        for (let i = 300; i < windowWidth - 300; i += 62) {
            Enemy = new Enemies(`${enemySrc}`, 'sea-enemy', windowHieght - enemyMarginTop, i);
            Enemy.enemyCreate();
        }
        enemyMarginTop += 72;
    }
    //Move Enemy
    moveOfEnemy = setInterval(function () {
        Enemy.moveEnemy(Enemy);
    }, enemySpeed);

    //Enemies Shot
    var moveShotOfenemy = setInterval(function () {
        try {

            var enemies = document.getElementsByClassName('sea-enemy');
            var index = Math.floor(Math.random() * enemies.length);

            var enemyShots = document.getElementsByClassName('missile2');

            if (enemies[index] != null || enemies[index] != undefined) {
                var enemyShot = new EnemiesShot('../assets/img/missile2.png', 'missile2', parseInt(enemies[index].style.bottom), parseInt(enemies[index].style.left) + 17);

                if (enemyShots.length == 0) {
                    enemyShot.enemiesShotCreate();
                    var shotOfEnemy = document.getElementsByClassName('missile2')[0];

                    var moveOfshot = setInterval(function () {
                        enemyShot.enemiesMoveShot(shotOfEnemy, moveOfshot);
                    }, 20);
                }
            }

        } catch (error) {

        }

    }, 200);
    //====================================< End Create Enemies >==========================================

    //Create Hero 
    //=========================================< Create Hero >=============================================
    var hero = new Hero(`${heroSrc}`, 'sea-hero', 20, Math.floor(windowWidth) / 2 - 40);
    hero.createCharacter();
    //Move Hero By keyboard
    document.body.addEventListener('keydown', function (event) {
        hero.moveHero(event, windowWidth);
    });

    //=========================================< End Create Hero >============================================= 
    //HeroShot
    //===================================< Create Shot of hero >=============================================
    var heroPosition = document.getElementsByClassName('sea-hero')[0];
    if (heroPosition != null && heroPosition != undefined) {
        var heroShot = new HeroShot('../assets/img/missile1.png', 'missile1', parseInt(heroPosition.style.bottom) + 50, parseInt(heroPosition.style.left) + 32);
        /**
         * To shot by clicking on space from keyboard
         */
        document.body.addEventListener('keyup', function (event) {
            heroPosition = document.getElementsByClassName('sea-hero')[0];
            if (event.keyCode == 32) {
                if (heroPosition != null || heroPosition != undefined) {
                    heroPosition = document.getElementsByClassName('sea-hero')[0];
                    heroShot = new HeroShot('../assets/img/missile1.png', 'missile1', parseInt(heroPosition.style.bottom) + 50, parseInt(heroPosition.style.left) + 32);
                    heroShot.createShot();

                }
            }
        });
        /**
         * To shot by left click on mouse
         */
        document.body.addEventListener('mousedown', function (event) {
            heroPosition = document.getElementsByClassName('sea-hero')[0];
            if (event.button == 0) {
                if (heroPosition != null || heroPosition != undefined) {
                    heroPosition = document.getElementsByClassName('sea-hero')[0];
                    heroShot = new HeroShot('../assets/img/missile1.png', 'missile1', parseInt(heroPosition.style.bottom) + 50, parseInt(heroPosition.style.left) + 32);
                    heroShot.createShot();
                }
            }
        });

        moveHeroShot = setInterval(function () {
            heroShot.shotMove(heroShot);
        }, shotHeroSpeed);
        moveHeroShotdouble = setInterval(function () {
            heroShot.shotMove(heroShot);
        }, shotHeroSpeed);


    }

    //===============================< End Creation of hero shot > ==============================

    var div = document.getElementsByClassName('sea-hero')[0];

    window.onmousemove = function (event) {
        var x = event.pageX;
        if ((x + 25) <= window.innerWidth && x - 25 >= 0) {
            div.style.left = (x - 40) + 'px';
        }
    };
}

var begin = document.getElementById('start');
if (begin != null) {
    begin.addEventListener('click', function () {
        var audio = new Audio('../assets/audio/bg.mp3');
        audio.play();
        audio.loop = true;
    });
}
