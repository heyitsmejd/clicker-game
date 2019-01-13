<template>
  <section class="container">
    <div class="flex-centered">
      <div class="game-area">
          <div class="left">
              <div class="stats-area">
                <div class="gold-stat stat-tab"><img class="stat-icon" src="/icons/coin.png">{{goldCount}}</div>
                <div class="gem-stat stat-tab"><img class="stat-icon" src="/icons/gem.png">{{gemCount}}</div>
                <div class="click-stat stat-tab"><img class="stat-icon" src="/icons/dagger.png">DPC</div>
                <div class="dps-stat stat-tab"><img class="stat-icon" src="/icons/wand.png">DPS: {{dps}}</div>
              </div>
              <div class="left-panel">
                <div class="panel-left">
                <div class="left-tabs"></div>
                <div class="small-menu"></div>
                <div class="level-up-buttons"></div>
                <div class="character-list"> 
                  <div class="character" v-for="(character, index) in availableCharacters" :class="{ disabled : character.disabled }">
                    <a class="char-portrait" :style="{'background-image' : `url('/heroes/${character.headImg}')`}"></a>
                    <div class="character-right">
                      <div class="char-dps">{{character.dps}}</div>
                      <div class="char-name">{{character.name}}</div>
                      <div class="char-cost">
                        <a class="buy-char" @click="buyCharacter(character.name)">
                          <div class="char-cost-amount"><img class="buy-icon" src="/icons/coin.png">{{character.cost}}</div>
                          <div class="char-hire-button" v-if="!character.bought">HIRE</div>
                          <div class="char-hire-button" v-else>LEVEL UP</div>
                        </a>
                      </div>
                    </div>
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
    this.changeMonster()
    //start auto DPS..
    this.dealAutoDamage()
  },
  computed: {
    availableCharacters: function() { 
      var character = this.characters;
      var bought = character.filter(i => i.bought)
      var nextChar = character.find((char, index) => char.bought == false)
      var disabledChar = character.findIndex(char => char.name == nextChar.name)
      var returned = bought.concat(nextChar)
      return returned.concat(character[disabledChar + 1]).reverse()
    }
  },
  data() {
    return {
      dps: 0,
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
      monsterDeath: true,
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
      ],
      characters: [
      { name: 'Luna',
        fullImg: 'luna.jpg',
        headImg: 'luna-head.jpg',
        dps: 1,
        level: 1,
        disabled: false,
        bought: false,
        cost: 10 },
      { name: 'Suyeon',
        fullImg: 'suyeon.jpg',
        headImg: 'suyeon-head.jpg',
        dps: 5,
        level: 1,
        bought: false,
        disabled: true,
        cost: 50 },
      { name: 'Yukki',
        fullImg: 'yukki.jpg',
        headImg: 'yukki-head.jpg',
        dps: 19,
        level: 1,
        bought: false,
        disabled: true,
        cost: 100 },
      { name: 'Mikon',
        fullImg: 'mikon.jpg',
        headImg: 'mikon-head.jpg',
        dps: 78,
        level: 1,
        bought: false,
        disabled: true,
        cost: 150 },
      { name: 'Fate',
        fullImg: 'fate.jpg',
        headImg: 'fate-head.jpg',
        dps: 310,
        level: 1,
        bought: false,
        disabled: true,
        cost: 218 },
      { name: 'Albedo',
        fullImg: 'albedo.jpg',
        headImg: 'albedo-head.jpg',
        dps: 1119,
        level: 1,
        disabled: true,
        bought: false,
        cost: 375 },
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
    dealAutoDamage(){
      var self = this
      setTimeout(() => {
      if(self.monsterCurrentHP > 0)
      {
        self.monsterCurrentHP = self.monsterCurrentHP - self.dps
      }
      if(self.monsterCurrentHP <= 0 && self.monsterDeath == false)
      {
        self.monsterDeath = true
        self.monsterCurrentHP = 0;
        self.killMonster();
      }     
      self.dealAutoDamage()   
      }, 1000)
     
    },

    buyCharacter(charName){
      var index = this.characters.findIndex( slot => slot.name == charName )
      if(this.goldCount >= this.characters[index].cost && this.characters[index].bought != true)
      {
        console.log('Bought ' + charName + '!')
        this.characters[index].bought = true;
        this.dps = this.dps + this.characters[index].dps
        this.characters[index+1].disabled = false;
        this.goldBonus = this.goldCount -this.characters[index].cost;
      }
    },
    checkNextLevel(){
      if(this.monsterCount < this.monsterMaxCount) { this.monsterCount++ }
      if(this.monsterCount == this.monsterMaxCount) { this.level++; this.monsterCount = 1; }
    },
    killMonster() {
      //add some gold!
      this.monsterDeath = true
      this.goldCount = this.goldCount + ((this.monsterMaxHP / 5) * Math.floor(((this.goldBonus / 100) + 1)));
      var canvas = document.getElementById('monster-area');
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      var self = this
      self.checkNextLevel()
      self.changeMonster()
      console.log('monster died!')
    },
    changeMonster() {
      if(this.monsterDeath == true)
      {
        this.getNewMonster()
      }
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
      this.monsterDeath == false
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
    background-image: URL('testbg2.jpg');
    background-size: cover;
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
    transition: width 1s ease;
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
    background: #383232;
    height: 3em;
}
.small-menu {
  height: 5em;
  background: #403b3b;
}
.level-up-buttons {
    height: 3em;
    background: #383232;
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

::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #2b2626;
}

::-webkit-scrollbar
{
  width: 10px;
  background-color: #2b2626;
}

::-webkit-scrollbar-thumb
{
  background-color: #0ae;
  
  background-image: -webkit-gradient(linear, 0 0, 0 100%,
                     color-stop(.5, rgba(255, 255, 255, .2)),
             color-stop(.5, transparent), to(transparent));
}
.character {
    box-shadow: inset -2px -2px 0 2px #232121;
    display: flex;
    width: 48%;
    height: 116px;
    margin: 1%;
    border-radius: 8px;
    background: #3e3c3c;
}
.character-right {
    display: flex;
    width: calc(100% - 5em);
    align-items: center;
    flex-direction: column;
    color: white;
    position: relative;
}
.char-dps {
    align-self: center;
    display: flex;
    background: #363e4e;
    padding: 0.3em;
    width: 100%;
    justify-content: center;
    border-top-right-radius: 8px;
    margin-right: 8px;
}
.char-name {
    height: 30px;
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
}
.char-cost {
    align-self: center;
    display: flex;
    padding: 0.3em;
    width: 100%;
    background: none;
    justify-content: center;
    border-bottom-right-radius: 8px;
    margin-right: 8px;
}
.char-cost-amount {
    top: 2px;
    width: 90px;
    position: absolute;
    background: #232121;
    border-radius: 6px;
    left: 2px;
    font-size: 0.9em;
    text-align: center;
    padding-top: 0;
    line-height: 1.2;
}
.character-list {
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
    background: #383232;
    height: 313px;
    align-content: flex-start;
    justify-content: flex-end;
}
.disabled {
    filter: grayscale(100%);
    pointer-events: none;
}
.char-hire-button {
    position: absolute;
    bottom: -2px;
    width: 100%;
    text-align: center;
}
.char-portrait {
    border-bottom-left-radius: 6px;
    z-index: 2;
    width: 80px;
    height: 112px;
    background-size: cover;
    background-position: center;
    border-top-left-radius: 6px;
    box-shadow: inset 1px 1px 20px 17px rgba(0, 0, 0, 0.35);
}
.buy-char {
    margin-bottom: 4px;
    height: 2.5em;
    position: relative;
    display: flex;
    width: 80%;
    background: #2E9CCA;
    border-radius: 6px;
    color: white;
}
img.buy-icon {
    height: 1.9em;
    position: absolute;
    left: 5%;
    top: -5px;
}
.buy-char:hover {
  background: #4cb5e0;
  color: white;
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
