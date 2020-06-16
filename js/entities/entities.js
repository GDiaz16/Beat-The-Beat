/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init: function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        //this.body.gravity = 10;

        //this.layer = me.game.world.getChildByName("layer2")[0];
        //var zIndex10 = me.game.world.getChildByProp("z", 4);
        //this.pos.z = 0;
        //console.log(this.pos)

        // max walking & jumping speed
        this.body.setMaxVelocity(5, 2.5);
        this.body.setFriction(0.6, 0.3);
        this.body.velX = 3;
        this.body.velY = 1.5;

        // set the display to follow our position on both axis
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH, 0.4);

        // ensure the player is updated even when outside of the viewport
        this.alwaysUpdate = true;

        // define a basic walking animation (using all frames)
        this.renderable.addAnimation("walk-back", [54, 55, 56, 57, 58, 59, 60, 62, 63, 65]);

        this.renderable.addAnimation("walk-front", [3, 4, 5, 6, 7, 8, 9, 10, 11, 13]);


        // define a standing animation (using the first frame)
        this.renderable.addAnimation("stand-view-down", [156]);
        this.renderable.addAnimation("stand-view-up", [42]);
        this.isUp = true;

        // set the standing animation as default
        this.renderable.setCurrentAnimation("stand-view-up");

        this.body.setShape(-75, -112);

    },

    /**
     * update the entity
     */
    update: function (dt) {

        if (me.input.isKeyPressed('left')) {

            // flip the sprite on horizontal axis
            this.renderable.flipX(false);
            // update the default force
            this.body.force.x = -this.body.velX;
            this.body.force.y = -this.body.velY;
            this.isUp = true;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk-back")) {
                this.renderable.setCurrentAnimation("walk-back");
            }
        } else if (me.input.isKeyPressed('right')) {

            // unflip the sprite
            this.renderable.flipX(true);
            // update the entity velocity
            this.body.force.x = this.body.velX;
            this.body.force.y = this.body.velY;
            this.isUp = false;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk-front")) {
                this.renderable.setCurrentAnimation("walk-front");
            }
        } else if (me.input.isKeyPressed('up')) {

            // flip the sprite on horizontal axis
            this.renderable.flipX(true);
            // update the default force
            this.body.force.x = this.body.velX;
            this.body.force.y = -this.body.velY;
            this.isUp = true;
            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk-back")) {
                this.renderable.setCurrentAnimation("walk-back");
            }
        } else if (me.input.isKeyPressed('down')) {
            // unflip the sprite
            this.renderable.flipX(false);
            // update the entity velocity
            this.body.force.x = -this.body.velX;
            this.body.force.y = this.body.velY;
            this.isUp = false;

            // change to the walking animation
            if (!this.renderable.isCurrentAnimation("walk-front")) {
                this.renderable.setCurrentAnimation("walk-front");
            }
        } else {
            this.body.force.x = 0;
            this.body.force.y = 0
            if (this.isUp) {
                // change to the standing animation
                this.renderable.setCurrentAnimation("stand-view-up");
            } else {
                this.renderable.setCurrentAnimation("stand-view-down");

            }
        }

        /*    if (this.body.overlaps('hole1')){
   
           } */
        /* 
                var tile = this.layer.getTile(this.pos.x, this.pos.y);
                if(tile !==null){
                //console.log(tile.pos);  
                    //this.layer.z = 4;
            } */
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

    /**
      * colision handler
      * (called when colliding with other objects)
      */
    onCollision: function (response, other) {

        // Make all other objects solid
        return true;
    }
});

/**
 * a Coin entity
 */
game.BoxEntity = me.CollectableEntity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function (x, y, settings) {
        // call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.setShape(-128, -60);
        this.renderable.addAnimation("stand", [2]);
        this.renderable.setCurrentAnimation("stand");

    },



    // this function is called by the engine, when
    // an object is touched by something (here collected)
    onCollision: function (response, other) {
        //Restar una caja al nivel en el que se encuentre
        if (other.type == 'player') {
            switch (me.levelDirector.getCurrentLevel().name) {
                case 'escenario':
                    game.data.remainingBoxesL1 = game.data.remainingBoxesL1 - 1;
                    document.getElementById('rem-boxes').innerHTML = '<p>Cajas faltantes: +' + game.data.remainingBoxesL1 + '</p>';

                    break;
                case 'escenario2':
                    game.data.remainingBoxesL2 = game.data.remainingBoxesL2 - 1;
                    document.getElementById('rem-boxes').innerHTML = '<p>Cajas faltantes: +' + game.data.remainingBoxesL2 + '</p>';

                    break;
                case 'escenario3':
                    game.data.remainingBoxesL3 = game.data.remainingBoxesL3 - 1;
                    document.getElementById('rem-boxes').innerHTML = '<p>Cajas faltantes: +' + game.data.remainingBoxesL3 + '</p>';

                    break;
            }
            // Remover una caja cuando se toca
            me.game.world.removeChild(this);
        }



        return false
    }
});

game.LevelEntity = me.Entity.extend({
    // extending the init function is not mandatory
    // unless you need to add some extra initialization
    init: function (x, y, settings) {
        this.level = settings.nextLevel;
        // call the parent constructor
        this._super(me.Entity, 'init', [x, y, settings]);
    },

    updateParams: function () {
        switch (this.level) {
            case 'escenario':
                document.getElementById('rem-boxes').innerHTML = '<p>Cajas faltantes: +' + game.data.remainingBoxesL1 + '</p>';
                document.getElementById('level').innerHTML = '<p>Nivel: 1/3</p>';

                break;
            case 'escenario2':
                document.getElementById('rem-boxes').innerHTML = '<p>Cajas faltantes: +' + game.data.remainingBoxesL2 + '</p>';
                document.getElementById('level').innerHTML = '<p>Nivel: 2/3</p>';

                break;
            case 'escenario3':
                document.getElementById('rem-boxes').innerHTML = '<p>Cajas faltantes: +' + game.data.remainingBoxesL3 + '</p>';
                document.getElementById('level').innerHTML = '<p>Nivel: 3/3</p>';

                break;

        }
    },


    // this function is called by the engine, when
    // an object is touched by something 
    onCollision: function (response, other) {
        switch (this.level) {

            case 'escenario2':
                if (game.data.remainingBoxesL1 > 0) {
                    document.getElementById('in-game').style.display = 'block';
                } else {
                    this.updateParams(this.level);
                    me.levelDirector.loadLevel(this.level);
                }
                break;

            case 'escenario3':
                if (game.data.remainingBoxesL2 > 0) {
                    document.getElementById('in-game').style.display = 'block';
                } else {
                    this.updateParams(this.level);
                    me.levelDirector.loadLevel(this.level);
                }
                break;
            case 'end':
                if (game.data.remainingBoxesL3 > 0) {
                    document.getElementById('in-game').style.display = 'block';
                } else {
                    document.getElementById('result').innerHTML = '<h2>Ganaste!!</h2>';
                    document.getElementById('description').innerHTML = '<p>Completaste todas las cajas y los monstruos no pudieron contigo</p>';
                    document.getElementById('end-screen').style.backgroundColor = 'rgba(17, 182, 39, 0.596)';
                    document.getElementById('end-screen').style.display = 'block';

                }
                break;



        }
        return false
    }
});

game.EnemyEntity = me.Sprite.extend(
    {
        init: function (x, y, settings) {
            // save the area size as defined in Tiled
            var width = settings.width;
            var height = settings.height;
            this.lastTime = 0;
            // define this here instead of tiled
            settings.image = "ghost";

            // adjust the size setting information to match the sprite size
            // so that the entity object is created with the right size
            settings.framewidth = settings.width = 172;
            settings.frameheight = settings.height = 179;

            // call the parent constructor
            this._super(me.Sprite, 'init', [x, y, settings]);

            // add a physic body
            this.body = new me.Body(this);
            // add a default collision shape
            this.body.addShape(new me.Rect(this.width / 3, this.height / 2, this.width / 2, this.height / 2));
            // configure max speed and friction
            this.body.setMaxVelocity(3, 1.5);
            this.body.setFriction(0.4, 0.2);
            // enable physic collision (off by default for basic me.Renderable)
            this.isKinematic = false;

            this.addAnimation("walk-view-down", [1, 2, 3, 4, 5, 6, 7, 8]);
            this.addAnimation("walk-view-up", [9, 10, 11, 12, 13, 14, 15, 16, 17]);

            this.UpDown = settings.UpDown;

            if (this.UpDown) {
                // set start/end position based on the initial area size
                x = this.pos.x - 2 * this.width;
                this.startX = x;
                this.pos.x = this.endX = x + width - this.width;

                y = this.pos.y - this.height;//-height;
                this.startY = y;//-2*height;
                this.pos.y = this.endY = y + height - this.height;
            } else {
                // set start/end position based on the initial area size
                x = this.pos.x;//+ this.height;
                this.startX = x;
                this.pos.x = this.endX = x + width - this.width;

                y = this.pos.y + this.height;//-height;
                this.startY = y;//-2*height;
                this.pos.y = this.endY = y + height - this.height;
            }
            // to remember which side we were walking
            this.walkLeft = false;

            // make it "alive"
            this.alive = true;
            this.alwaysUpdate = true;


        },

        // manage the enemy movement
        update: function (dt) {

            if (this.UpDown) {


                if (this.alive) {

                    if (this.walkLeft && this.pos.y <= this.startY) {
                        this.walkLeft = false;
                        this.body.force.x = -this.body.maxVel.x;
                        this.body.force.y = this.body.maxVel.y;
                        if (!this.isCurrentAnimation("walk-view-down")) {
                            this.setCurrentAnimation("walk-view-down");
                            this.flipX(true);
                        }

                    }
                    else if (!this.walkLeft && this.pos.y >= this.endY) {
                        this.walkLeft = true;
                        this.body.force.x = this.body.maxVel.x;
                        this.body.force.y = -this.body.maxVel.y;

                        if (!this.isCurrentAnimation("walk-view-up")) {
                            this.setCurrentAnimation("walk-view-up");
                            this.flipX(false);

                        }
                    }


                }
                else {
                    this.body.force.x = 0;
                    this.body.force.y = 0;
                }
            } else {
                if (this.alive) {
                    //this.setCurrentAnimation("walk-view-down");

                    if (this.walkLeft && this.pos.x <= this.startX - this.width) {
                        this.walkLeft = false;
                        this.body.force.x = this.body.maxVel.x;
                        this.body.force.y = this.body.maxVel.y;
                        if (!this.isCurrentAnimation("walk-view-down")) {
                            this.setCurrentAnimation("walk-view-down");
                            this.flipX(false);
                        }
                    }
                    else if (!this.walkLeft && this.pos.x >= this.endX) {
                        this.walkLeft = true;
                        this.body.force.x = -this.body.maxVel.x;
                        this.body.force.y = -this.body.maxVel.y;
                        if (!this.isCurrentAnimation("walk-view-up")) {
                            this.setCurrentAnimation("walk-view-up");
                            this.flipX(true);

                        }
                    }


                }
                else {
                    this.body.force.x = 0;
                    this.body.force.y = 0;

                }
            }
            // check & update movement
            this.body.update(dt);

            // handle collisions against other shapes
            me.collision.check(this);

            // return true if we moved or if the renderable was updated
            return (this._super(me.Sprite, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
        },

        /**
         * colision handler
         * (called when colliding with other objects)
         */
        onCollision: function (response, other) {
            //Reducir el puntaje de salud
            if (game.data.health >= 1 && other.type == 'player') {
                var d = new Date();
                if (d.getTime() - this.lastTime > 600) {
                    console.log(d.getTime() - this.lastTime);

                    this.lastTime = d.getTime();
                    game.data.health = game.data.health - 1;
                    document.getElementById('health').innerHTML = '<p>Salud: +' + game.data.health + '</p>';
                }
            } else if (game.data.health <= 1) {
                document.getElementById('result').innerHTML = '<h2>Perdiste</h2>';
                document.getElementById('description').innerHTML = '<p>Los monstruos han acabado contigo</p>';
                document.getElementById('end-screen').style.backgroundColor = 'rgba(182, 17, 17, 0.596)';
                document.getElementById('end-screen').style.display = 'block';

            }
            if (response.b.body.collisionType !== me.collision.types.WORLD_SHAPE) {
                return false;
            }
            // Make all other objects solid
            return false;
        }
    });
