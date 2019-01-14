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
                    <div class="character-left">
                      <div class="char-cost">
                        <a class="buy-char" v-if="!character.bought" @click="buyCharacter(character.name)">
                          <div class="char-cost-amount">
                          <div class="char-amount-gold"><img class="buy-icon" src="/icons/coin.png">{{character.cost}}</div>
                          <div class="char-hire-button"  >HIRE</div>
                          </div>
                        </a>
                        <a class="buy-char" v-else @click="levelCharacter(character.name)">
                          <div class="char-cost-amount">
                          <div class="char-amount-gold"><img class="buy-icon" src="/icons/coin.png">{{character.cost}}</div>
                          <div class="char-hire-button">LEVEL UP</div>
                        </div>
                        </a>
                      </div>
                    </div>
                    <div class="char-info">
                      <div class="char-name">{{character.name}}</div>
                      <div class="char-dps">DPS: {{character.dps}}  LVL: {{character.level}}</div>
                    </div>
                    <a class="char-portrait" :style="{'background-image' : `url('/heroes/${character.headImg}')`}"></a>
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
    var self = this
    setTimeout(() => self.dealAutoDamage(), 1500)
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
      isAttackable: true,
      monsterOrder: -1,
      monsterCurrentHP: '',
      monsterMaxHP: '',
      image: '',
      monsterName: '',
      goldCount: 500,
      goldBonus: 100,
      vipCount: 0,
      vipBonus: 0,
      gemCount: 0,
      monsterDeath: true,
      gemBonus: 0,
      level: 4,
      monsterCount: 0,
      monsterMaxCount: 10,
      rebirth: 0,
      monsters: [{
        image: 'bluebug.svg',
        monsterMaxHP: 1,
        monsterName: 'Dangerous Boop'
      },{
        image: 'redbug.svg',
        monsterMaxHP: 1,
        monsterName: 'Cunning Boop'
      }],
      bosses: [
      {
        image: 'slug.png',
        monsterMaxHP: 1,
        monsterName: 'Recently Awoken Boop'
      }],
      characters: [
      { name: 'Luna',
        fullImg: 'luna.jpg',
        headImg: 'luna-head.jpg',
        dps: 1,
        level: 1,
        baseDps: 1,
        baseCost: 10,
        disabled: false,
        bought: false,
        cost: 10 },
      { name: 'Suyeon',
        fullImg: 'suyeon.jpg',
        headImg: 'suyeon-head.jpg',
        dps: 5,
        level: 1,
        baseDps: 5,
        baseCost: 49,
        bought: false,
        disabled: true,
        cost: 49 },
      { name: 'Yukki',
        fullImg: 'yukki.jpg',
        headImg: 'yukki-head.jpg',
        dps: 19,
        level: 1,
        baseDps: 19,
        bought: false,
        baseCost: 240,
        disabled: true,
        cost: 240 },
      { name: 'Mikon',
        fullImg: 'mikon.jpg',
        headImg: 'mikon-head.jpg',
        dps: 70,
        level: 1,
        bought: false,
        baseDps: 70,
        baseCost: 1176,
        disabled: true,
        cost: 1176 },
      { name: 'Fate',
        fullImg: 'fate.jpg',
        headImg: 'fate-head.jpg',
        dps: 257,
        level: 1,
        bought: false,
        baseDps: 257,
        baseCost: 5762,
        disabled: true,
        cost: 5762 },
      { name: 'Albedo',
        fullImg: 'albedo.jpg',
        headImg: 'albedo-head.jpg',
        dps: 941,
        level: 1,
        baseCost: 28234,
        disabled: true,
        baseDps: 28334,
        bought: false,
        cost: 28234 },
      ]
    }
  },
  methods: {
    attack(e){

      if(this.monsterCurrentHP > 0 && this.isAttackable)
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
        this.monsterCurrentHP = this.monsterCurrentHP - 25;
      }
      if(this.monsterCurrentHP <= 0 && !this.monsterDeath)
      {
        this.monsterDeath = true;
        this.monsterCurrentHP = 0;
        //kill monster!
        this.killMonster();
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
      }  }  ) 
      setTimeout(() => self.dealAutoDamage(), 1000)
    },

    buyCharacter(charName){
      var index = this.characters.findIndex( slot => slot.name == charName )
      if(this.goldCount >= this.characters[index].cost && this.characters[index].bought != true)
      {
        console.log('Bought ' + charName + '!')
        this.characters[index].bought = true;
        this.dps = this.dps + this.characters[index].dps
        this.characters[index+1].disabled = false;
        this.goldCount = this.goldCount -this.characters[index].cost;
      }
    },
    checkNextLevel(){
      if(this.level % 5 === 0)
      {
        this.monsterMaxCount = 1;
        this.monsterCount = 1;
        return 
      }
      if(this.monsterCount < (this.monsterMaxCount + 1)) { this.monsterCount++; }
      if(this.monsterCount == (this.monsterMaxCount + 1)) { this.level++; this.monsterCount = 1; }
    },
    killMonster() {
      //add some gold!
      this.goldCount = this.goldCount + Math.round(((this.monsterMaxHP / 15) * Math.floor(((this.goldBonus / 100) + 1))));
      var canvas = document.getElementById('monster-area');
      var context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      var self = this
      setTimeout(() => self.changeMonster(), 1500)
      console.log('monster died!')
    },
    changeMonster() {
      if(this.monsterDeath == true)
      {
          this.checkNextLevel()
          this.getNewMonster()      
      }
    },
    levelCharacter(charName){
      var index = this.characters.findIndex( slot => slot.name == charName)
      let char = this.characters[index]
      if(this.goldCount >= char.cost){
        this.goldCount = this.goldCount - char.cost;
        char.level++;
        char.dps = Math.round(char.baseDps * char.level * 1.07)
        char.cost = Math.round(char.baseCost * (1.07 * char.level))
        //Lets update our DPS total now.
        var totalDps = 0
        this.characters.forEach(slot => {
          if(slot.bought)
          {
            totalDps = totalDps + slot.dps
          }
        })
        this.dps = totalDps
      }
    },
    getNewMonster(){
      this.monsterOrder += 1;
      if(this.monsterOrder > this.monsters.length - 1)
      {
        this.monsterOrder = 0;
      }
      this.monsterName = this.monsters[this.monsterOrder].monsterName
      this.monsterCurrentHP = Math.round(10 * ((this.level-1) + Math.pow(1.55, this.level)))
      this.monsterMaxHP = Math.round(10 * ((this.level-1) + Math.pow(1.55, this.level)))
      this.image = this.monsters[this.monsterOrder].image
      if(this.level % 5 === 0)
      {
      this.monsterName = this.bosses[0].monsterName
      this.monsterCurrentHP = Math.round(10 * ((this.level-1) + Math.pow(1.55, this.level)) * 10)
      this.monsterMaxHP = Math.round(10 * ((this.level-1) + Math.pow(1.55, this.level)) * 10)
      this.image = this.bosses[0].image
      }
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
      this.monsterDeath = false
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
    width: 1024px;
    min-width: 1024px;
    height: 640px;
    min-height: 640px;
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
    width: 98%;
    height: 116px;
    margin: 1%;
    border-radius: 8px;
    background: #3e3c3c;
}
.character-left {
    display: flex;
    width: 40%;
    align-items: center;
    flex-direction: column;
    color: white;
    position: relative;
}
.char-dps {
    justify-content: flex-end;
    display: flex;
    padding-right: 1em;
    width: 100%;
    color: lightgray;
}
.char-name {
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: flex-end;
    padding-top: 0.5em;
    padding-right: 0.5em;
    font-size: 1.5em;
    color: white;
}
.char-cost {
    padding: 1em;
    align-items: center;
    align-self: flex-start;
    display: flex;
    width: 100%;
    height: 100%;
    background: none;
    justify-content: center;
}
.char-cost-amount {
    width: 100%;
    height: 100%;
    display: flex;
    border-radius: 1em;
    background: #232121;
    font-size: 1em;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.char-amount-gold {
    display: flex;
    width: 100%;
    justify-content: center;
    line-height: 3;
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
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 1.2em;
}
.char-portrait {
    border-bottom-left-radius: 6px;
    z-index: 2;
    width: 20%;
    height: 112px;
    background-size: cover;
    background-position: center;
    border-top-left-radius: 6px;
    box-shadow: inset 1px 1px 20px 17px rgba(0, 0, 0, 0.35);
}
.char-info {
    width: 40%;
}
.buy-char {
    padding: 0.25em;
    margin-bottom: 4px;
    height: 100%;
    position: relative;
    display: flex;
    width: 100%;
    background: #2E9CCA;
    border-radius: 1em;
    color: white;
}
img.buy-icon {
    height: 3em;
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
