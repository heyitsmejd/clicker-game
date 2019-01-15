<template>
  <section class="container">
    <div class="flex-centered">
      <div class="game-area">
          <div class="left">
              <div class="left-panel">
                <div class="stats-area">
                <div class="gold-stat stat-tab"><img class="stat-icon" src="/icons/coin.png">{{formatNumber(goldCount)}}</div>
                <div class="gem-stat stat-tab"><img class="stat-icon" src="/icons/gem.png">{{formatNumber(gemCount)}}</div>
                <div class="click-stat stat-tab"><img class="stat-icon" src="/icons/dagger.png">DPC</div>
                <div class="dps-stat stat-tab"><img class="stat-icon" src="/icons/wand.png">DPS: {{formatNumber(dps)}}</div>
              </div>
                <div class="left-panel-content">
                <div class="left-big-menu"></div>
                <div class="left-small-menu">
                    <a class="level-option-button level-rate-btn" @click="setLevelRate(1)" :class="{ 'is-active-option' : currentLevelRate == 1 }">
                      1x
                    </a>
                    <a  class="level-option-button level-rate-btn" @click="setLevelRate(10)" :class="{ 'is-active-option' : currentLevelRate == 10 }">
                      10x
                    </a>
                    <a class="level-option-button level-rate-btn" @click="setLevelRate(25)" :class="{ 'is-active-option' : currentLevelRate == 25 }">
                      25x
                    </a>
                    <a class="level-option-button level-rate-btn" @click="setLevelRate(100)" :class="{ 'is-active-option' : currentLevelRate == 100 }">
                      100x
                    </a>
                </div>     
                <div class="character-list"> 
                  <div class="char-slot-bg" v-for="(character, index) in availableCharacters" :class="{ disabled : character.disabled }">
                    <div class="character" v-if="character.name != null">
                    <div class="character-left">
                      <div class="char-cost">
                        <a class="buy-char" v-if="!character.bought" @click="buyCharacter(character.name)">
                          <div class="button-overlay"></div>
                          <div class="char-cost-amount">
                          <div class="char-amount-gold"><img class="buy-icon" src="/icons/coin.png"><span class="purchase-amt-text">{{formatNumber(character.cost)}}</span></div>
                          <div class="char-hire-button"  >HIRE</div>
                          </div>
                        </a>
                        <a class="buy-char" v-else @click="levelCharacter(character.name)">
                          <div class="button-overlay pink-overlay"></div>
                          <div class="char-cost-amount pink">
                          <div class="char-amount-gold"><img class="buy-icon" src="/icons/coin.png"><span class="purchase-amt-text">{{formatNumber(getLevelCost(character.name))}}</span></div>
                          <div class="char-hire-button">LEVEL UP</div>
                        </div>
                        </a>
                      </div>
                    </div>
                    <div class="char-info">
                      <div class="char-stats">
                        <div class="char-name">{{character.name}}</div>
                        <div class="char-dps">DPS: {{formatNumber(character.dps)}}  LVL: {{character.level}}</div>
                      </div>
                      <div class="char-img">
                          <div class="char-portrait" :style="{'background-image' : `url('/heroes/${character.headImg}')`}"></div>                        
                      </div>
                    </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
            <div class="right">
            <div class="level-select">
              
            </div>
            <div class="level-area">
              <div class="current-level">
                Level {{level}}
              </div>
              <div class="level-monster-count" v-if="!isBossLevel">
                {{monsterCount}}/{{monsterMaxCount}}
              </div>
            </div>
            <div class="click-area" @click="attack($event)">
                <canvas id="hit-numbers" class="canvas" width="512px" height="640px"></canvas>
                <canvas id="monster-area" class="canvas new-monster" width="512px" height="640px"></canvas>
              <div class="hit-area" id="hit-area"></div>
            </div>
            <div class="monster-status">
              <div class="monster-name">{{monsterName}}</div>
              <div class="hp-text">{{formatNumber(monsterCurrentHP)}}/{{formatNumber(monsterMaxHP)}}</div>
              <div class="monster-hp-bar">
              <div class="health" :style="{'width' : `${((monsterCurrentHP/monsterMaxHP) * 100)}%`,
              'background' : `${getHealthColor(((monsterCurrentHP/monsterMaxHP) * 100))}`}"></div>
              </div>
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
    this.updateDmgPos()
  },
  computed: {
    availableCharacters: function() { 
      var character = this.characters;
      var bought = character.filter(i => i.bought)
      if(bought.length == character.length)
      {
        return bought.reverse()
      }
      var nextChar = character.find((char, index) => char.bought == false)
      //var disabledChar = character.findIndex(char => char.name == nextChar.name)
      var returned = bought.concat(nextChar)
      return returned.reverse()
      // if(disabledChar != null)
      // {
      //   if(bought.length == 0)
      //   {
      //     return returned.concat(character[disabledChar + 1],character[disabledChar + 2]).reverse()
      //   }
      //   if(bought.length == character.length)
      //   {
      //     return returned.reverse()
      //   }
      //   else{
      //     return returned.concat(character[disabledChar + 1]).reverse()
      //   }
        
      // }
      // else {
      //   return returned.reverse()
      // }
    },
    currentLevelRate: function(){
      return this.levelRate
    }
  },
  data() {
    return {
      dps: 0,
      dpc: 1,
      levelRate: 1,
      isBossLevel: false,
      bossKilled: false,
      isAttackable: true,
      monsterOrder: -1,
      monsterCurrentHP: '',
      monsterMaxHP: '',
      image: '',
      monsterName: '',
      goldCount: 500000000000000000000000000,
      goldBonus: 100,
      vipCount: 0,
      vipBonus: 0,
      gemCount: 0,
      monsterDeath: true,
      gemBonus: 0,
      level: 1,
      monsterCount: 0,
      monsterMaxCount: 10,
      rebirth: 0,
      recentHits: [],
      maps: [{
        name: 'Verdant Plains',
        levelMin: 1,
        levelMax: 5,
        image: 'testbg2.jpg'
      },{
        name: 'Shoddy Village',
        levelMin: 6,
        levelMax: 10,
         image: 'level2.jpg'
      },{
        name: 'Gloomy Hills',
        levelMin: 11,
        levelMax: 15,
         image: 'testbg.jpg'
      },],
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
        image: 'slug.svg',
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
        this.monsterCurrentHP = this.monsterCurrentHP - this.dpc;
        var self = this
        this.recentHits.push({"x": offsetX, "y": offsetY, "amount": this.dpc, "maxY" : offsetY - 60,
        'maxYHit' : false})
        // setTimeout(() => {
        //     self.recentHits.shift()
        // }, 750)
        this.showDamageNumbers();
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
        if(this.isAttackable)
        {
          self.monsterCurrentHP = self.monsterCurrentHP - self.dps
        }
      }
      if(self.monsterCurrentHP <= 0 && self.monsterDeath == false)
      {
        this.isAttackable = false;
        self.monsterDeath = true
        self.monsterCurrentHP = 0;
        self.killMonster();
      }  }  ) 
      setTimeout(() => self.dealAutoDamage(), 1000)
    },

    buyCharacter(charName){

      var index = this.characters.findIndex( slot => slot.name == charName )
      console.log(this.characters.length, index+2)
      if(this.goldCount >= this.characters[index].cost && this.characters[index].bought != true)
      {
        console.log('Bought ' + charName + '!')
        this.characters[index].bought = true;
        this.dps = this.dps + this.characters[index].dps
        this.characters[index+1].disabled = false;
        this.goldCount = this.goldCount -this.characters[index].cost;
      }
    },
    checkNextLevel(){;
      if(this.monsterCount < (this.monsterMaxCount + 1)) { this.monsterCount++; }
      if(this.monsterCount == (this.monsterMaxCount + 1)) { this.level++; this.monsterCount = 1; }
      if(this.bossKilled)
      {
        this.bossKilled = false;
        this.monsterCount = 1;
        this.level++
      var levelBg = this.maps.find(i => {
        return i.levelMin <= this.level && i.levelMax >= this.level
      })
      console.log(levelBg)
      document.getElementsByClassName('game-area')[0].style.backgroundImage = `url('${levelBg.image}')`
      }
    },
    killMonster() {
      setTimeout(() => this.recentHits = [], 750)
      document.getElementById('monster-area').classList.remove('new-monster')
      document.getElementById('monster-area').classList.add('kill-monster')
      //add some gold!
      this.goldCount = this.goldCount + Math.round(((this.monsterMaxHP / 15) * Math.floor(((this.goldBonus / 100) + 1))));
      var self = this
      if(this.isBossLevel)
      {
        this.isBossLevel = false;
        this.bossKilled = true;
        setTimeout(() => self.changeMonster(), 1500)

      }
      else {
        setTimeout(() => self.changeMonster(), 1500)
      }
      
      console.log('monster died!')
    },
    formatNumber(num){
       if (num >= 1000000000000000000000000000000000000000000000000000000000000000000) {
          return 'A lot';
       }
       if (num >= 1000000000000000000000000000000000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + '*';
       }
       if (num >= 1000000000000000000000000000000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + '&';
       }
       if (num >= 1000000000000000000000000000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + '^';
       }
       if (num >= 1000000000000000000000000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + '%';
       }
       if (num >= 1000000000000000000000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + '$';
       }
       if (num >= 1000000000000000000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + '#';
       }
       if (num >= 1000000000000000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + '@';
       }
       if (num >= 1000000000000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + '!';
       }
       if (num >= 1000000000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + 'D';
       }
       if (num >= 1000000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + 'U';
       }
       if (num >= 1000000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + 'd';
       }
       if (num >= 1000000000000000000000000000000) {
          return (num / 1000000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + 'N';
       }
       if (num >= 1000000000000000000000000000) {
          return (num / 1000000000000000000000000000).toFixed(1).replace(/\.0$/, '') + 'O';
       }
       if (num >= 1000000000000000000000000) {
          return (num / 1000000000000000000000000).toFixed(1).replace(/\.0$/, '') + 'S';
       }
       if (num >= 1000000000000000000000) {
          return (num / 1000000000000000000000).toFixed(1).replace(/\.0$/, '') + 's';
       }
       if (num >= 1000000000000000000) {
          return (num / 1000000000000000000).toFixed(1).replace(/\.0$/, '') + 'Q';
       }
       if (num >= 1000000000000000) {
          return (num / 1000000000000000).toFixed(1).replace(/\.0$/, '') + 'q';
       }
       if (num >= 1000000000000) {
          return (num / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
       }
       if (num >= 1000000000) {
          return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
       }
       if (num >= 1000000) {
          return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
       }
       if (num >= 1000) {
          return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
       }
       return num;
    },
    changeMonster() {
      if(this.monsterDeath == true)
      {
          this.checkNextLevel()
          this.getNewMonster()      
      }
    },
    setLevelRate(amt){
      this.levelRate = amt
    },
    getLevelCost(charName){
      var index = this.characters.findIndex( slot => slot.name == charName)
      let char = this.characters[index]
      let totalLevelCost = 0;
      let startingLevel = char.level;
      let endLevel = char.level + this.levelRate;
      for (let i = startingLevel; i < endLevel; i++)
      {
          if(i > 25)
          {
            totalLevelCost = totalLevelCost + Math.round(char.baseCost * (Math.pow(1.07525,i)))
          } else {
              totalLevelCost = totalLevelCost + Math.round(char.baseCost * (Math.pow(1.06975,i)))
          }
      }
      return totalLevelCost
    },
    calcExtraDps(charName){
      var index = this.characters.findIndex( slot => slot.name == charName)
      let char = this.characters[index]
      let totalDps = char.baseDps * char.level;
      console.log(`${charName}'s new dps is ${totalDps}`)
      char.dps = totalDps;
    },
    levelCharacter(charName){
      var index = this.characters.findIndex( slot => slot.name == charName)
      let char = this.characters[index]
      let totalLevelCost = this.getLevelCost(charName);
      let endLevel = char.level + this.levelRate;
        if(this.goldCount >= totalLevelCost)
        {
          this.goldCount = this.goldCount - totalLevelCost
          char.level = endLevel;
          this.calcExtraDps(charName)
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
    updateDmgPos(){
      var self = this
          setTimeout(() => {
            console.log('bang')
            self.recentHits.forEach(hit => {
              hit.x = hit.x + 2;
              if(hit.y > hit.maxY && !hit.maxYHit)
              {
                 hit.y = hit.y + 2;
              }
              if(hit.y < hit.maxY)
              {
                hit.maxYHit = true
                hit.y = hit.y - 2;
              }
              if(hit.maxYHit)
              {
                hit.y = hit.y - 2;
              }
              
            })   
            self.updateDmgPos()       
          }, 10)
    },
    showDamageNumbers(){
        var self = this;
        function draw() {
        var canvas = document.getElementById('hit-numbers');
        var context = canvas.getContext('2d');
        var canvas_size_x = 512;
        var canvas_size_y = 640;
        var reverse = false;
        context.font = "30px Arial";
        context.shadowOffsetX = 1;
        context.shadowOffsetY = 1;
        context.shadowColor = "rgba(0,0,0,0.8)";
        context.fillStyle = `rgba(255,255,255,1)`;       
        context.clearRect(0, 0, canvas_size_x, canvas_size_y);
        self.recentHits.forEach(hit => {
          context.fillText(hit.amount, hit.x, hit.y);
        })
        global.requestAnimationFrame(draw)
        }
        draw()
    },
    getNewMonster(){
      this.monsterOrder += 1;
      if(this.monsterOrder > this.monsters.length - 1)
      {
        this.monsterOrder = 0;
      }
      this.monsterName = this.monsters[this.monsterOrder].monsterName
      this.monsterCurrentHP = Math.round(10 * ((this.level-1) + Math.pow(1.025, this.level)))
      this.monsterMaxHP = Math.round(10 * ((this.level-1) + Math.pow(1.025, this.level)))
      this.image = this.monsters[this.monsterOrder].image
      if(this.level % 5 === 0)
      {
        this.isBossLevel = true;
        this.bossKilled = false;
        this.monsterName = this.bosses[0].monsterName
        this.monsterCurrentHP = Math.round(10 * ((this.level-1) + Math.pow(1.55, this.level)) * 10)
        this.monsterMaxHP = Math.round(10 * ((this.level-1) + Math.pow(1.55, this.level)) * 10)
        this.image = this.bosses[0].image
      }
      var self = this
      var imgX = 265;
      var imageX = 200;
      var imageY = 300;
      var step = 165;
      var stepMin = 155
      var stepMax = 175
      var canvas_size_x = 512;
      var canvas_size_y = 640;
      var reverse = false;
      function draw() {
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
      var canvas = document.getElementById('monster-area');
      var context = canvas.getContext('2d');
      var imageObj = new Image();
      imageObj.src = self.image;
      context.font = "30px Arial";
      context.shadowOffsetX = 1;
      context.shadowOffsetY = 1;
      context.shadowColor = "rgba(0,0,0,0.8)";
      context.fillStyle = `rgba(255,255,255,1)`;       
      context.clearRect(0, 0, canvas_size_x, canvas_size_y);
        context.drawImage(imageObj, 150, step, imageX, imageY);
        global.requestAnimationFrame(draw)
      }
      draw()
      this.monsterDeath = false
      document.getElementById('monster-area').classList.remove('kill-monster')
      document.getElementById('monster-area').classList.add('new-monster')
      setTimeout(() => { this.isAttackable = true} , 1000)
    },
    getHealthColor(num){
      if(num >= 66 )
      {
        return '#2fd764'
      }
      if(num >= 33 && num < 66)
      {
        return '#d7cb2f'
      }
      if(num >= 0 && num < 33){
        return '#d72f5c'
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
  font-family: dosis;
}
.flex-centered {
  display: flex;
  justify-content: center;
}
.monster-status {
    align-items: flex-end;
    z-index: 10;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: center;
    height: 20%;
    margin-top: 50%;
}
.monster-hp-bar {
    width: 40%;
    z-index: 99;
    background: #4c3f3f;
    height: 2em;
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
    font-family: dosis;
    color: white;
    font-size: 2em;
    left: 1em;
    z-index: 99;
    text-shadow: 2px 2px black;
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
    z-index: 55;
}
.canvas {
  width: 100%;
  height: 100%;
}
.left-panel {
    display: flex;
    height: 100%;
    background: #434c6a;
    flex-direction: column;
}
.right {
    width: 50%;
    height: 100%;
    position: relative;
}
.click-area {
    position: absolute;
    justify-content: center;
    display: flex;
    height: 100%;
    width: 100%;
    z-index: 5;
    bottom: 0;
}
.hit-area {
  z-index: 3;
      -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    position: absolute;
    opacity: 0;
    animation-iteration-count: 1;
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

.health {
    height: 100%;
    width: 100%;
    background: red;
    border-radius: 4em;
    transition: width 1s ease;
    position: relative;
}
.hp-text {
    width: 100%;
    color: white;
    justify-content: center;
    display: flex;
        z-index: 99;
}
.stats-area {
    height: 25%;
    width: 100%;
    padding: 0.5em;
    display: flex;
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
.kill-monster {
     -webkit-transition: opacity 1s ease-in-out;
    -moz-transition: opacity 1s ease-in-out;
    -ms-transition: opacity 1s ease-in-out;
    -o-transition: opacity 1s ease-in-out;
    opacity: 0; 
    z-index: 1;
}
canvas#hit-numbers {
    position: absolute;
    z-index: 2;
}
.new-monster {
/*     -webkit-transition: opacity 2s ease-in;
    -moz-transition: opacity 2s ease-in;
    -o-transition: opacity 2s ease-in;
    -ms-transition: opacity 2s ease-in;
    transition: opacity 2s ease-in;*/
    z-index: 1;
    opacity: 1;
    animation: slide-in 1s normal forwards ease-in;
}
/*@keyframes slide-in {
  from {  margin-right: -500px; }
  to { margin-right: 0 }
}*/
.left-small-menu {
    background: linear-gradient(#434c6a,#343b50);
    height: 3em;
    border-top: solid 2px #2a3044;
    display: flex;
    padding: 0.5em;
}
.level-option-button:before {
    content: ' ';
    background: linear-gradient(#ffffff0f,transparent);
    width: 90%;
    height: 70%;
    position: absolute;
    border-radius: 6px;
}
.level-option-button {
    color: grey;
    font-weight: bold;
    align-items: center;
    background: #24262f;
    margin-right: 1em;
    width: 25%;
    display: flex;
    border-radius: 8px;
    justify-content: center;
    align-content: center;
    position: relative;
}
.level-option-button:hover {
  color: #5ac2ff;
}
.is-active-option {
  color: #5ac2ff;
}
.level-option-button:last-child {
    margin-right: 0 !important;
}
.left-big-menu {
    border-top: solid 2px #2a3044;
    height: 5em;
    background: linear-gradient(#434c6a,#343b50);
}
.level-up-buttons {
    border-top: solid 2px #2a3044;
    height: 3em;
    background: linear-gradient(#434c6a,#343b50);
}
.skills {
    width: 4em;
    height: 100%;
    background: #434c6a;
    box-shadow: inset 0 0 0 2px #2a3044;
    padding: 0.5em;
}
.button-overlay {
    top: 10%;
    left: 8%;
    content: " ";
    width: 85%;
    height: 80%;
    position: absolute;
    background: linear-gradient(#00ffff57,#10ff003d);
    border-radius: 1em;
    z-index: 1;
}
.left-panel-content {
    height: 75%;
    width: 100%;
}

::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #191e2f;
}

::-webkit-scrollbar
{
  width: 10px;
  background-color: red;
  border-radius: 50%;
}

::-webkit-scrollbar-thumb
{
  background-color: #52608e;
  border-radius: 4px;
/*  background-image: -webkit-gradient(linear, 0 0, 0 100%,
                     color-stop(.5, rgba(255, 255, 255, .2)),
             color-stop(.5, transparent), to(transparent));*/
}
.character {
    display: flex;
    width: 100%;
    height: 115px;
    border-radius: 8px;
    position: relative;
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
    width: 100%;
    color: lightgray;
}
.pink {
    background: linear-gradient(rgb(241, 8, 255),rgb(171, 22, 247)) !important;
}
.pink-overlay {
    background: linear-gradient(rgba(255, 118, 244, 0.34118),rgba(0, 203, 224, 0.23922));
}
.char-name {
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: flex-end;
    padding-top: 0.5em;
    font-size: 1.5em;
    color: white;
}
.level-select {
  display: flex;
  height: 15%;
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
.char-slot-bg {
    display: flex;
    width: 100%;
    height: 117.4px;
    position: relative;
    background: radial-gradient(#dcd0d05e, #0c0c0c47);
    border: solid 2px #00000029;
}
/*.panel-bg {
    position: absolute;
    top: -5%;
    left: -5%;
    position: absolute;
    background: linear-gradient(#5ac2ff, #30468e);
    border: solid 2px black;
    width: 110%;
    height: 110%;
}*/
.char-cost-amount {
    box-shadow: inset 0px 0px 20px 3px #000000;
    width: 100%;
    height: 100%;
    display: flex;
    border-radius: 1em;
    background: linear-gradient(#5ac2ff, #30468e);
    font-size: 1em;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.char-img {
    width: 6.5em;
    height: 100%;
    padding: 1em;
    padding-right: 1.25em;
    padding-bottom: 1.25em;
}
.char-amount-gold {
    display: flex;
    width: 100%;
    justify-content: center;
    line-height: 3;
    margin-bottom: -0.8em;
    z-index: 2;
}
.character-list {
    display: flex;
    flex-wrap: wrap;
    overflow-y: scroll;
    background: #303852;
    height: 352px;
    align-content: flex-start;
    justify-content: center;
    box-shadow: inset 0 0 20px 20px #00000030;
}
.disabled {
    filter: grayscale(100%);
    pointer-events: none;
}
.purchase-amt-text {
    display: inline-block;
    font-size: 1.5em;
    padding-bottom: 0;
    line-height: 2em;
}
.health:before {
    position: absolute;
    content: " ";
    background: linear-gradient(rgba(222, 215, 215, 0.05),rgba(14, 14, 14, 0.13));
    box-shadow: 4px 4px 20px 0px rgba(0,0,0,0.2902);
    border-radius: 1em;
    width: 100%;
    height: 100%;
}
.character:before {
    position: absolute;
    left: 2%;
    top: 6%;
    content: " ";
    background: linear-gradient(#546290,#3d4a77);
    box-shadow: 4px 4px 20px 0px #0000004a;
    border-radius: 6px;
    width: 95.5%;
    height: 85%;
}
.char-hire-button {
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 1.2em;
    z-index: 2;
}
.char-portrait {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    border-radius: 6px;
    box-shadow: inset 1px 1px 20px 17px rgba(0, 0, 0, 0.35), 0px 0px 0px 2px rgba(0, 0, 0, 0.35);
}
.char-info {
    width: 60%;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
}
.buy-char {
    padding: 0.25em;
    box-shadow: inset 0 0 0px 1px #2b2d31;
    margin-bottom: 4px;
    height: 100%;
    position: relative;
    display: flex;
    width: 100%;
    background: #303852;
    border-radius: 1em;
    color: white;
}
img.buy-icon {
    height: 3em;
}
.buy-char:hover {
  color: white;
  box-shadow: inset 0 0 0px 5px #155182;
  z-index: 10;
}
.level-area {
    z-index: 99;
    height: 15%;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-family: dosis;
    font-weight: bold;
    font-size: 1.8em;
    color: white;
    text-shadow: 2px 2px black;
}
</style>
