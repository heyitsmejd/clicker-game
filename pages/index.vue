<template>
  <section class="container">
    <div class="flex-centered">
      <div class="game-area">
          <div class="left">
              <div class="stats-area">
                <div class="gold-stat stat-tab"><img class="stat-icon" src="/icons/coin.png">{{goldCount}}</div>
                <div class="gem-stat stat-tab"><img class="stat-icon" src="/icons/gem.png">{{gemCount}}</div>
                <div class="click-stat stat-tab"><img class="stat-icon" src="/icons/dagger.png">12323</div>
                <div class="dps-stat stat-tab"><img class="stat-icon" src="/icons/wand.png">51515</div>
              </div>
              <div class="left-panel">
                <div class="panel-left">
                <div class="left-tabs"></div>
                <div class="small-menu"></div>
                <div class="level-up-buttons"></div>
                <div class="character-list">
                  <div class="character">
                    Box one
                  </div>
                  <div class="character">
                    Box two
                  </div>
                  <div class="character">
                    Box one
                  </div>
                  <div class="character">
                    Box two
                  </div>
                  <div class="character">
                    Box one
                  </div>
                  <div class="character">
                    Box two
                  </div>
                  <div class="character">
                    Box one
                  </div>
                  <div class="character">
                    Box two
                  </div>
                  <div class="character">
                    Box one
                  </div>
                  <div class="character">
                    Box two
                  </div>
                </div>
              </div>
              <div class="skills"></div>
              </div>
            </div>
            <div class="right">
            <div class="level-area">
              <div class="current-level">
                Level {{level}}
              </div>
              <div class="level-monster-count">
                {{monsterCount}}/{{monsterMaxCount}}
              </div>
            </div>
            <div class="click-area" @click="attack($event)">
                <!-- <canvas id="monster-area" class="monster-bounce" :style="{ 'background-image' : `url('${image}')`, 'width' : '100%', 'height' : '100%'}" ></canvas> -->
                <canvas id="monster-area" width="460px" height="530px"></canvas>
              <div class="hit-area" id="hit-area"></div>
            </div>
            <div class="monster-status">
              <div class="monster-name">{{monsterName}}</div>
              <div class="monster-hp-bar">
              <div class="health" :style="{'width' : `${((monsterCurrentHP/monsterMaxHP) * 100)}%`,
              'background' : `${getHealthColor(((monsterCurrentHP/monsterMaxHP) * 100))}`}"></div>
              </div>
              <div class="hp-text">{{monsterCurrentHP}}/{{monsterMaxHP}}</div>
            </div>
          </div>
          </div>
      </div>
    </div>
  </section>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  mounted() {
    this.getNewMonster()
  },
  computed: {
  },
  data() {
    return {
      monsterOrder: -1,
      monsterCurrentHP: '',
      monsterMaxHP: '',
      image: '',
      monsterName: '',
      goldCount: 0,
      goldBonus: 100,
      vipCount: 0,
      vipBonus: 0,
      gemCount: 0,
      gemBonus: 0,
      level: 1,
      monsterCount: 1,
      monsterMaxCount: 10,
      rebirth: 0,
      monsters: [
      {
        image: 'slug.png',
        monsterMaxHP: 10,
        monsterName: 'Fiesty Boop'
      },{
        image: 'bluebug.svg',
        monsterMaxHP: 15,
        monsterName: 'Dangerous Boop'
      },{
        image: 'redbug.svg',
        monsterMaxHP: 25,
        monsterName: 'Cunning Boop'
      }
      ]
    }
  },
  methods: {
    attack(e){
      if(this.monsterCurrentHP > 0)
      {
        var rect = e.currentTarget.getBoundingClientRect(),
        offsetX = e.clientX - rect.left,
        offsetY = e.clientY - rect.top;
        if(offsetX < 0 || offsetY < 0)
        {
          return
        }
        document.getElementsByClassName('hit-area')[0].style.left = `${offsetX-50}px`;
        document.getElementsByClassName('hit-area')[0].style.top = `${offsetY-50}px`;
        document.getElementsByClassName('hit-area')[0].classList.add('hit-anim')
        event.preventDefault;
        document.getElementsByClassName('hit-area')[0].classList.remove('hit-anim')
        // -> triggering reflow /* The actual magic */
        // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
        void event.target.offsetWidth;
        // -> and re-adding the class
        document.getElementsByClassName('hit-area')[0].classList.add('hit-anim')
        this.monsterCurrentHP = this.monsterCurrentHP - 8;
      }
      if(this.monsterCurrentHP <= 0)
      {
        this.monsterCurrentHP = 0;
        //kill monster!
        this.killMonster();
        //start new monster..
        this.getNewMonster();
      }
    },
    checkNextLevel(){
      if(this.monsterCount < this.monsterMaxCount) { this.monsterCount++ }
      if(this.monsterCount == this.monsterMaxCount) { this.level++; this.monsterCount = 1; }
    },
    killMonster() {
      //add some gold!
      this.goldCount = this.goldCount + ((this.monsterMaxHP / 5) * Math.floor(((this.goldBonus / 100) + 1)));
      var canvas = document.getElementById('monster-area');
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      this.checkNextLevel()
      console.log('monster died!')
    },
    getNewMonster(){

      this.monsterOrder += 1;
      if(this.monsterOrder > this.monsters.length - 1)
      {
        this.monsterOrder = 0;
      }
      this.monsterName = this.monsters[this.monsterOrder].monsterName
      this.monsterCurrentHP = this.monsters[this.monsterOrder].monsterMaxHP
      this.monsterMaxHP = this.monsters[this.monsterOrder].monsterMaxHP
      this.image = this.monsters[this.monsterOrder].image
      var canvas = document.getElementById('monster-area');
      var context = canvas.getContext('2d');
      var imageObj = new Image();
      imageObj.src = this.image;
      var imgX = 75;
      var imageX = 300;
      var imageY = 300;
      var step = 170;
      var stepMin = 155
      var stepMax = 195
      var canvas_size_x = 460;
      var canvas_size_y = 530;
      var reverse = false;

        function draw() {
          context.clearRect(0, 0, canvas_size_x, canvas_size_y);
          if(!reverse){
            step = step + 1;
             if(step >= stepMax)
            {
              reverse = true;
            }
          }
          if(reverse == true) {
             step = step - 1; 
             if(step <= stepMin)
            {
              reverse = false;
            }

          }
       context.drawImage(imageObj, 75, step, imageX, imageY);
       global.requestAnimationFrame(draw)
      }
      draw()
    },
    getHealthColor(num){
      if(num >= 66 )
      {
        return 'green'
      }
      if(num >= 33 && num < 66)
      {
        return 'orange'
      }
      if(num >= 0 && num < 33){
        return 'red'
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Dosis:800');
body {
  background: black;
  min-height: 100vh;
  width: 100%;
}
.flex-centered {
  display: flex;
  justify-content: center;
}
.monster-status {
    z-index: 10;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    width: 40%;
    position: absolute;
    bottom: 5%;
    right: 5%;
}
.monster-hp-bar {
    background: #4c3f3f;
    height: 3em;
    border-radius: 4em;
    box-shadow: 0px 0px 0 3px black;
    overflow: hidden;
   /*
     Introduced in IE 10.
     See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
   */
   -ms-user-select: none;
   user-select: none;
}
.monster-name {
    color: white;
    position: absolute;
    top: -40px;
    font-size: 1.5em;
    left: 1em;
}
.game-area {
    width: 1024px;
    height: 640px;
    background: grey;
    position: relative;
    overflow: hidden;
    background-image: URL('game-bg.svg');
    display: flex;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
}
.nav-bar {
    height: 4em;
    color: white;
}
.inventory-panel {
    padding-left: 6%;
    display: flex;
    width: 66%;
    height: 100%;
    justify-content: space-between;
}
.inventory.gold-tab {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 1em;

    background: #908960;
    box-shadow: 0px 0px 0 3px #464439;
    margin: 0.5em;
    width: 10em;
    align-items: center;
    height: 76px;
}
.inventory.gems-tab:before {
    content: ' ';
    background-image: url(/gem.svg);
    position: absolute;
    left: -2em;
    bottom: -3px;
    height: 82px;
    width: 82px;
    background-repeat: no-repeat;
    background-size: cover;
}
.inventory.gold-tab:before {
    content: ' ';
    background-image: url(/coin.svg);
    position: absolute;
    left: -2em;
    bottom: -3px;
    height: 82px;
    width: 82px;
    background-repeat: no-repeat;
    background-size: cover;
}
.inventory.gems-tab {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 1em;
    background: #908960;
    box-shadow: 0px 0px 0 3px #464439;
    margin: 0.5em;
    width: 10em;
    align-items: center;
    height: 76px;
}
span.large-btn-text {
    font-size: 1.7em;
}
span.med-btn-text {
    font-size: 1.1em;
}
.item-count {
    width: 100%;
    height: 50%;
    display: flex;
    background-image: linear-gradient(to right,#358269, #2bab81, #358269);
    border-top-right-radius: 1em;
    padding-left: 1.5em;
    color: white;
    justify-content: center;
    align-items: center;
}
.item-bonus {
    width: 100%;
    height: 50%;
    display: flex;
        background: linear-gradient(to right,#353e82, #356682, #353e82);
    border-bottom-right-radius: 1em;
    border-bottom-left-radius: 1em;
    padding-left: 1.5em;
    color: white;
    justify-content: center;
    align-items: center;

}
.inventory.vip-tab {
    position: relative;
    display: flex;
    flex-direction: column;
    border-radius: 1em;
    background: #908960;
    box-shadow: 0px 0px 0 3px #464439;
    margin: 0.5em;
    width: 10em;
    align-items: center;
    height: 76px;
}
.left {
    width: 50%;
    height: 100%;
}
.left-panel {
    height: 100%;
    background: #383232;
}
.right {
    width: 50%;
    height: 100%;
}
.click-area {
    position: absolute;
    justify-content: center;
    display: flex;
    height: 80%;
    bottom: 10%;
    width: 50%;
    z-index: 5;
}
.hit-area {
    position: absolute;
    opacity: 0;
    animation-iteration-count: 1;
    z-index: 6;
    width: 100px;
    height: 100px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100%;
    background-image: url(/hit.svg);
}
.hit-anim {
      -webkit-animation: hit;
    animation: hit normal forwards;
    -webkit-animation-duration: 0.2s;
    animation-duration: 0.2s;
}
@keyframes hit {
  0% { opacity: 1.0;  background-size: 120%;}
  50% {opacity: 0.5;  background-size: 35%}
  100% {opacity: 0;  background-size: 100%;}
}
.monster {
    width: 300px;
    height: 400px;
    right: 80px;
    top: 5%;
}
.monster-bounce {
    background-size: cover;
    background-position: center;
    animation: bounce infinite;
    animation-duration: 0.5s;
}
@keyframes bounce {
  0% { background-size: 100%;}
  50% {background-size: 95%}
  100% { background-size: 100%;}
}
.health {
    height: 100%;
    width: 100%;
    background: red;
    border-radius: 4em;
}
.hp-text {
    position: absolute;
    color: white;
    bottom: 25%;
    right: 45%;
}
.stats-area {
    display: flex;
    padding: 0.5em;
    flex-wrap: wrap;
}
.stat-tab {
    display: flex;
    width: 48%;
    height: 2em;
    margin: 1%;
    font-family: dosis;
    font-weight: bold;
    font-size: 1.8em;
    color: white;
    text-shadow: 2px 2px black;
    line-height: 2;
}
.left-tabs {
    background: red;
    height: 3em;
}
.small-menu {
  height: 5em;
  background: orange;
}
.level-up-buttons {
    height: 3em;
    background: blue;
}
.skills {
    width: 4em;
    height: 100%;
    background: pink;
}
.panel-left {
    height: 489px;
    width: calc(100% - 4em);
    background: darkgrey;
}
.character-list {
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
}
.level-area {
    margin-top: 20%;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    font-family: dosis;
    font-weight: bold;
    font-size: 1.8em;
    color: white;
    text-shadow: 2px 2px black;
}
</style>
