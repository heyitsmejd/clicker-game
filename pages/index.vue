<template>
    <div class="flex-centered">
      <div class="user-area">
        <input type="text" v-model="username">
        <input type="password" v-model="password">
        <button @click="logIn()">Log in</button>
      </div>
      <div class="game-area">
        <div class="game-modal" v-if="viewModal">
          <div class="game-modal-bg" ></div>
          <div class="game-modal-content">
            <div class="game-modal-header">
              <div class="game-modal-text">Congratulations! Achievement Earned!</div>
              <div class="game-modal-close" @click="viewModal = !viewModal">X</div>
            </div>
            <div class="modal-pop-content">
              <div>You just clicked 200 times!</div>
              <div>Reward: <span class="bonus">+1% DPS!</span></div>
            </div>
          </div>
        </div>
          <div class="left">
              <div class="left-panel">
                <div class="stats-area">
                <div class="gold-stat stat-tab">
                  {{formatNumber(goldCount)}}
                </div>
                <div class="gem-stat stat-tab">
                  {{ formatNumber(gemCount)}}
                </div>
                <div class="click-stat stat-tab">
                 DPC: {{formatNumber(dpc)}}
                </div>
                <div class="dps-stat stat-tab">
                  DPS: {{formatNumber(dps)}}
                </div>
              </div>
                <div class="left-panel-content">
                <div class="left-big-menu">
                  <div class="tab-menu-option">
                    <div class="menu-option-content">
                      <img class="menu-icon" src="heroestab.svg">
                    </div>
                  </div>
                  <div class="tab-menu-option inactive-tab">
                   <div class="menu-option-content">
                      <img class="menu-icon" src="achtab.svg">
                    </div>
                  </div>
                  <div class="tab-menu-option inactive-tab">
                    <div class="menu-option-content">
                      <div>Achievements</div>
                    </div>
                  </div>
                  <div class="tab-menu-option inactive-tab">
                   <div class="menu-option-content">
                      <div>Stats</div>
                    </div>
                  </div>
                </div>  
                <div class="left-panel-body">
                <div class="character-list"> 
                  <div class="char-slot-bg" v-for="(character, index) in availableCharacters" :class="{ disabled : character.disabled }">
                    <div class="character" v-if="character.name != null">
                    <div class="character-left">
                      <div class="char-img">
                          <div class="char-portrait" :style="{'background-image' : `url('heroes/${character.headImg}')`}"></div>                        
                      </div>
                    </div>
                    <div class="char-info">
                      <div class="char-info-header">
                        <div class="char-dps">DPS: {{formatNumber(character.dps)}}  LVL: {{character.level}}</div>
                        <div class="char-name">{{character.name}}</div>
                      </div>
                      <div class="char-info-body">
                        <div class="char-spells">
                          <div class="char-spell-icon">
                          </div>
                          <div class="char-spell-icon">
                          </div>
                          <div class="char-spell-icon">
                          </div>
                        </div>
                                              <div class="char-cost">
                        <a class="push_button blue" v-if="!character.bought" @click="buyCharacter(character.name)">

                          <div class="char-amount-gold"><span class="purchase-amt-text">{{formatNumber(character.cost)}}</span></div>
                          <div class="char-hire-button"  >HIRE</div>
                        </a>
                        <a class="push_button purple" v-else @click="levelCharacter(character.name)">

                          <div class="char-amount-gold"><span class="purchase-amt-text">{{formatNumber(getLevelCost(character.name))}}</span></div>
                          <div class="char-hire-button">LEVEL UP</div>
                        </a>
                      </div>
                      </div>
                    </div>
                    </div>
                  </div>
                </div>                  
                </div>
                <div class="left-small-menu">
                    <a class="push_button dark-blue" @click="setLevelRate(1)" :class="{ 'is-active-option' : currentLevelRate == 1 }">
                      1x
                    </a>
                    <a  class="push_button dark-blue" @click="setLevelRate(10)" :class="{ 'is-active-option' : currentLevelRate == 10 }">
                      10x
                    </a>
                    <a class="push_button dark-blue" @click="setLevelRate(25)" :class="{ 'is-active-option' : currentLevelRate == 25 }">
                      25x
                    </a>
                    <a class="push_button dark-blue" @click="setLevelRate(100)" :class="{ 'is-active-option' : currentLevelRate == 100 }">
                      100x
                    </a>
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
                <canvas id="monster-area" class="canvas new-monster" width="512px" height="448px"></canvas>
              <div class="hit-area" id="hit-area"></div>
              <div id="hit-numbers"></div>
            </div>
            <div class="monster-status">
              <div class="monster-name">{{monsterName}}</div>
              <div class="hp-text">{{formatNumber(monsterCurrentHP)}}/{{formatNumber(monsterMaxHP)}}</div>
              <div class="monster-hp-bar">
              <div class="health health-anim-slow" :class="getHealthColor(((monsterCurrentHP/monsterMaxHP) * 100))":style="{'width' : `${((monsterCurrentHP/monsterMaxHP) * 100)}%`}"></div>
              <div class="monster-hp-bar-border"></div>
              </div>

            </div>
            <div class="skills-area">
              <div class="skill-container">
                <a @click="specialRapidClick(25)"><div class="skill-spell" :class="{ 'disabled' : !skillReady}" :style="{'background-image': `url('icons/spells/rapid.png')`}" >
                  <div class="spell-badge">1</div>
                  <div id="demo"></div>
                  <div class="tool-tip">
                    <div class="spell-tool-header">
                      <div class="spell-tool-name">
                        Rapid Fire
                      </div>
                      <div class="spell-tool-cooldown">
                        30s
                      </div>                      
                    </div>
                    <div class="spell-tool-info">
                      Rapidly attack <span class="pink-text">25</span> times.
                    </div>
                  </div>
                </div></a>
                <div class="skill-spell">
                  <div class="spell-badge">2</div>
                </div>
                <div class="skill-spell">
                  <div class="spell-badge">3</div>
                </div>
                <div class="skill-spell">
                  <div class="spell-badge">4</div>
                </div>
                <div class="skill-spell">
                  <div class="spell-badge">5</div>
                </div>
                <div class="skill-spell last">
                  <div class="spell-badge">6</div>
                </div>
              </div>
            </div>
          </div>
          </div>
      </div>
    </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import io from 'socket.io-client';
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
    this.checkAchievements()
    document.onkeydown = function(e){
        e = e || window.event;
        var key = e.which || e.keyCode;
        if(key===49){
            self.specialRapidClick(25);
        }
    }
    this.socket.on('ATTACK', data => {
      this.monsterCurrentHP = this.monsterCurrentHP - data.amount;
    })
    this.socket.on('GOLD', data => {
      this.goldCount = this.goldCount + data.goldAmount
    })
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
      var returned = bought.concat(nextChar)
      return returned.reverse()
    },
    currentLevelRate: function(){
      return this.levelRate
    }
  },
  data() {
    return {
      username: '',
      password: '',
      socket: io('localhost:3001'),
      user: '',
      viewModal: false,
      modalHeader: '',
      skillCooldown: '',
      skillReady: true,
      modalContent: '',
      modalReward: '',
      achievements: [{
        name: 'Beginner Clicker',
        reward: 0.01,
        rewardType: 'dps',
        text: `You've clicked 200 times!`,
        requirement: 200,
        requireType: 'click',
        icon: 'icons/sword.png',
        earned: false,
        seen: false
      },{
        name: 'Rapid Clicker',
        reward: 1,
        rewardType: 'dpc',
        text: `Clicked 10 times in one second`,
        requirement: 10,
        requireType: 'clicksPerSecond',
        icon: 'icons/sword.png',
        earned: false,
        seen: false
      }],
      dpsBonus: '',
      dpcBonus: '',
      clickCount: 0,
      clicksPerSecond: 0,
      dps: 0,
      dpc: 1,
      levelRate: 1,
      isBossLevel: false,
      bossKilled: false,
      isAttackable: false,
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
    logIn(){
        var self = this;
          this.$axios.$post(`http://localhost:3001/login`, { username : self.username, password : self.password})
          .then((res) => {
            console.log(res)
          }).catch(e => {
            console.log(e)
          //  console.log(e)
          })
    },
    attack(e,special,ranX,ranY){
      if(this.monsterCurrentHP > 0 && this.isAttackable)
      {
        if(!special){
          this.clickCount++;
          this.clicksPerSecond++;
        }
        else {
          var offsetX = special.clientX
          var offsetY = special.clientY
        }
          var rect = document.getElementById('monster-area').getBoundingClientRect(),
          offsetX = e.clientX - rect.left,
          offsetY = e.clientY - rect.top;
          if(offsetX < 0 || offsetY < 0)
          {
            return
          }
          event.preventDefault;
        document.getElementsByClassName('hit-area')[0].style.left = `${offsetX-50}px`;
        document.getElementsByClassName('hit-area')[0].style.top = `${offsetY-50}px`;
        document.getElementsByClassName('hit-area')[0].classList.add('hit-anim')
        
        document.getElementsByClassName('hit-area')[0].classList.remove('hit-anim')
        // -> triggering reflow /* The actual magic */
        // without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
        //Do not remove below.
        void event.target.offsetWidth;
        // -> and re-adding the class
        document.getElementsByClassName('hit-area')[0].classList.add('hit-anim')
        this.socket.emit('DAMAGE', {
          user: this.user,
          amount: this.dpc
        })

        var self = this
        this.recentHits.push({"x": offsetX, "y": offsetY, "amount": this.dpc, "maxY" : offsetY - 60,
        'maxYHit' : false})
        this.showDamageNumbers(offsetX, offsetY, this.dpc);
        setTimeout(() => {
          if(document.getElementsByClassName('hit-number-text').length > 0){
            for(let i = document.getElementsByClassName('hit-number-text').length; i > 0; i--)
            {
              document.getElementsByClassName('hit-number-text')[0].remove()
            }
          }
        },2000)
      }
      if(this.monsterCurrentHP <= 0 && !this.monsterDeath)
      {
        this.monsterDeath = true;
        this.monsterCurrentHP = 0;
        //kill monster!
        this.killMonster();
        setTimeout(() => {
          document.getElementsByClassName('health')[0].classList.remove('health-anim-slow')
          document.getElementsByClassName('health')[0].classList.add('health-anim-quick')
        }, 500)
      }
    },
    checkAchievements(){
      var self = this
      setTimeout(() => {
      self.achievements.forEach(ach => {
        if(ach.requireType == "click" && ach.requirement <= self.clickCount && !ach.earned && !ach.seen)
        {
          self.modalContent = ach.text
          self.modalHeader = ach.name 
          if(ach.rewardType == "dps"){
            self.modalReward = "+" + ach.reward + '% DPS!'
            self.dpsBonus = self.dpsBonus + ach.reward;
          }
          ach.seen = true
          ach.earned = true
          self.viewModal = true;
        }
        if(ach.requireType == "clicksPerSecond" && ach.requirement <= self.clicksPerSecond && !ach.earned && !ach.seen)
        {
          self.modalContent = ach.text
          self.modalHeader = ach.name 
          if(ach.rewardType == "dpc"){
            self.modalReward = "+" + ach.reward + ' DPC!'
            self.dpc = self.dpc + ach.reward;
          }
          ach.seen = true
          ach.earned = true
          self.viewModal = true;
        }
      })
      self.clicksPerSecond = 0;
      this.checkAchievements()
      }, 1000)
    },
    dealAutoDamage(){
      var self = this
      setTimeout(() => {
      if(self.monsterCurrentHP > 0)
      {
        if(this.isAttackable)
        {
          self.monsterCurrentHP = self.monsterCurrentHP - self.dps
          if(self.monsterCurrentHP < 0)
          {
            self.monsterCurrentHP = 0;
          }
        }
        return
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
      if(this.goldCount >= this.characters[index].cost && this.characters[index].bought != true)
      {
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
      document.getElementsByClassName('game-area')[0].style.backgroundImage = `url('${levelBg.image}')`
      }
    },
    killMonster() {
      setTimeout(() => this.recentHits = [], 750)
      document.getElementById('monster-area').classList.remove('new-monster')
      document.getElementById('monster-area').classList.add('kill-monster')
      //add some gold!
      this.socket.emit('KILL-MONSTER', {
          user: this.user,
          monsterHP: this.monsterMaxHP,
      })
      // this.goldCount = this.goldCount + Math.round(((this.monsterMaxHP / 15) * Math.floor(((this.goldBonus / 100) + 1))));
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
    simulateClick(x, y) {
    var clickEvent = document.createEvent('MouseEvents');
    clickEvent.initMouseEvent(
    'click', true, true, window, 0,
    0, 0, x, y, false, false,
    false, false, 0, null
    );
    document.elementFromPoint(x, y).dispatchEvent(clickEvent);
    }, 
    specialRapidClick(amt){
      if(this.skillReady)
      {
      var rect = document.getElementById('monster-area').getBoundingClientRect()
        var randomClicks = []
        var self = this
        for(let i = 0; i < amt; i++)
        {
            var ranX = Math.floor(Math.random() * (rect.right - rect.left)) + rect.left
            var ranY = Math.floor(Math.random() * (rect.bottom - rect.top)) + rect.top
            randomClicks.push({x: ranX, y: ranY})
        }
        function runClicks(){
          if(randomClicks.length > 0)
          {
           setTimeout(() => {
            self.simulateClick(randomClicks[0].x,randomClicks[0].y);
            randomClicks.shift()
            runClicks()
            }, 1000/amt)
          }
        }
        if(randomClicks.length > 0){
          runClicks()
        }
        this.skillReady = false;
        this.specialCooldownTimer()
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

      if(this.recentHits.length > 10)
      {
        for(let i = this.recentHits.length; i > 10; i--)
        {
          this.recentHits.shift()
        }
      }
      var self = this
          setTimeout(() => {
            self.recentHits.forEach(hit => {
              hit.x = hit.x + 5;
              if(hit.y > hit.maxY && !hit.maxYHit)
              {
                 hit.y = hit.y + 5;
              }
              if(hit.y < hit.maxY)
              {
                hit.maxYHit = true
                hit.y = hit.y - 4;
              }
              if(hit.maxYHit)
              {
                hit.y = hit.y - 4;
              }
              
            })   
            self.updateDmgPos()       
          }, 1000/120)
    },
    showDamageNumbers(offsetX, offsetY, amount){
        if(offsetX < 0 || offsetY < 0)
        {
          return
        }
          var node = document.createElement("div")
          var textnode = document.createTextNode(amount); 
          node.setAttribute('class','hit-number-text');
          node.style.left = `${offsetX}px`;
          node.style.top = `${offsetY}px`;
          node.appendChild(textnode); 
          document.getElementById("hit-numbers").appendChild(node);    
    },
    specialCooldownTimer(spell){
      // Update the count down every 1 second
      var countDownDate = new Date();
      var self = this
      var newDateObj = new Date(countDownDate.getTime() + 30000);
      var x = setInterval(function() {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = newDateObj - now;

        // Time calculations for days, hours, minutes and seconds
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Display the result in the element with id="demo"
        document.getElementById("demo").innerHTML = seconds + "s ";

        // If the count down is finished, write some text 
        if (distance < 0) {
          clearInterval(x);
          self.skillReady = true;
          document.getElementById("demo").innerHTML = "";
        }
      }, 1000);
    },
    getNewMonster(){
      this.monsterOrder += 1;
      if(this.monsterOrder > this.monsters.length - 1)
      {
        this.monsterOrder = 0;
      }
      this.monsterName = this.monsters[this.monsterOrder].monsterName
      this.monsterCurrentHP = Math.round(10 * ((this.level-1) + Math.pow(1.55, this.level - 1)))
      this.monsterMaxHP = Math.round(10 * ((this.level-1) + Math.pow(1.55, this.level - 1)))
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
      var imgX = 55;
      var imageX = 250;
      var imageY = 350;
      var step = 55;
      var stepMin = 45
      var stepMax = 65
      var canvas_size_x = 512;
      var canvas_size_y = 448;
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
        context.drawImage(imageObj, 130, step, imageX, imageY);
        global.requestAnimationFrame(draw)
      }
      draw()
      this.monsterDeath = false
      document.getElementById('monster-area').classList.remove('kill-monster')
      document.getElementById('monster-area').classList.add('new-monster')
      setTimeout(() => { 
        self.isAttackable = true;
        document.getElementsByClassName('health')[0].classList.remove('health-anim-quick')
        document.getElementsByClassName('health')[0].classList.add('health-anim-slow')
      } , 500)
    },
    getHealthColor(num){
      if(num >= 70 )
      {
        return 'green-hp'
      }
      if(num >= 25 && num < 70)
      {
        return 'orange-hp'
      }
      if(num >= 0 && num < 25){
        return 'red-hp'
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Titillium+Web');
body {
  background: black;
  min-height: 100vh;
  width: 100%;
font-family: 'Titillium Web', sans-serif;
}
.flex-centered {
  display: flex;
  justify-content: center;
}
.skills-area {
    z-index: 200;
    justify-content: center;
    width: 100%;
    display: flex;
    height: 15%;
    align-items: flex-end;
}
.game-modal-content {
    width: 40%;
    z-index: 300;
}
.modal-pop-content {
    display: flex;
    background: #4e5671;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    padding: 1em;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    color: #e2e0e0;
}
.game-modal-header {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    background: #5a627f;
    color: gold;
    padding: 1em;
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.game-modal {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.game-modal-bg {
    background: #0000006b;
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 200;
}
.monster-status {
    pointer-events: none;
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
    margin-top: 45%;
}
.monster-hp-bar {
    background: #191e2f;
    padding: 3px;
    box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset, 0 -1px 0 rgba(255, 255, 255, .1) inset;
    width: 40%;
    z-index: 99;
    height: 2em;
    border-radius: 4em;
    overflow: hidden;
    position: relative;
    -ms-user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}
.monster-hp-bar-border {
    z-index: 150;
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
    position: absolute;
    top: 0;
}
.monster-name {
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
    flex-direction: column;
}
.spell-badge {
    font-size: 0.6em;
    line-height: 0.7;
    position: absolute;
    left: 0;
    color: white;
    background: #303852;
    padding: 0.4em;
    padding-left: 0.4em;
    padding-right: 0.6em;
    box-shadow: 0 -1px 0 rgba(255, 255, 255, .1) inset, 0 4px 0 #2c375a, 0 4px 2px rgba(0, 0, 0, .5);
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
    height: 70%;
    width: 100%;
    z-index: 5;

    margin-bottom: 20%;
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
    background-image: URL("hit.svg");
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
.green-hp {
  background: #16e473;
    box-shadow: 0 1px 0px 2px rgb(22, 221, 112) inset, 0 -1px 0 rgba(255, 255, 255, 0.18) inset, 0 4px 0 #363e5a, inset 0 0px 16px 4px rgba(0, 29, 8, 0.35);
}
.orange-hp {
  background: #eaca1f !important;
position: relative;
    box-shadow: 0 1px 0px 2px rgb(255, 217, 55) inset, 0 -1px 0 rgba(255, 255, 255, 0.18) inset, 0 4px 0 #35382c, inset 0 0px 16px 4px rgba(228, 158, 0, 0.4);
}
.red-hp {
background: #f33041 !important;
box-shadow: 0 1px 0px 2px rgb(230, 2, 15) inset, 0 -1px 0 rgba(255, 255, 255, 0.18) inset, 0 4px 0 #35382c, inset 0 0px 16px 4px rgb(160, 44, 54);
}
.health {
    z-index: 40;
    height: 100%;
    width: 100%;
    border-radius: 4em;
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
    width: 100%;
    padding: 1em;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.spell-tool-cooldown {
    color: #fc3da0;
}
.pink-text {
    color: aqua;
}
.stat-tab {
    display: flex;
    width: 21%;
    height: 2em;
    font-weight: bold;
    font-size: 1em;
    color: white;
    text-shadow: 2px 2px black;
    line-height: 2;
    margin: 0.5em;
    background: #39415b;
}
.spell-tool-name {
    color: white;
}
.skill-container {
    display: flex;
    padding: 0.25em;
    background: #303852;
    border-radius: 4px;
    box-shadow: 1px 1px 0 rgb(74, 88, 133) inset, 0 -1px 0 rgba(255, 255, 255, .1) inset, 0 4px 0 #2c375a, 0 4px 2px rgba(0, 0, 0, .5);
}
.spell-tool-info {
    margin-top: 0.5em;
}
.spell-tool-header {
    font-weight: bold;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding-bottom: 0.5em;
    border-bottom: solid 1px #131725;
}
.tool-tip {
    z-index: 999;
    position: absolute;
    bottom: 106%;
    left: 0;
    display: none;
    padding: 0.8em;
    font-size: 0.8em;
    color: #008eb1;
    background: #181d2d;
    box-shadow: 1px 1px 0 rgb(36, 43, 68) inset;
    min-width: 200px;
    flex-direction: column;
}
.skill-spell:hover .tool-tip {
  display: flex;
}
#demo {
    position: absolute;
    font-size: 1em;
    width: 100%;
    display: flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: white;
    text-shadow: 1px 1px black;
}
.skill-spell {
    width: 3em;
    height: 3em;
    position: relative;
    background: #4a5885;
    margin-right: 0.25em;
    background-position: center;
    background-size: cover;
}
.last {
  margin-right: 0;
}
.kill-monster {
     -webkit-transition: opacity 1s ease-in-out;
    -moz-transition: opacity 1s ease-in-out;
    -ms-transition: opacity 1s ease-in-out;
    -o-transition: opacity 1s ease-in-out;
    opacity: 0; 
    z-index: 1;
}
.left-panel-body {
    display: flex;
    width: 100%;
    flex-direction: column;
    background: #3c4563;
    height: 82.5%;
    padding: 1em;
    box-shadow: 0 0 0 1px #5e698e;
    padding-bottom: 0;
}
.user-area {
    position: absolute;
    bottom: 5%;
}
.health-anim-slow {
  transition: width 0.5s ease-in-out;
}
.health-anim-quick {
  transition: 0s;
}
canvas#hit-numbers {
    position: absolute;
    z-index: 2;
}
.new-monster {
    z-index: 1;
    opacity: 1;
}
.left-small-menu {
    background: #3c4563;
    height: 3em;
    display: flex;
    padding: 0.5em;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    width: 100%;
    padding-bottom: 1em;
    box-shadow: 0px 1px 0 1px #5e698e;
}
/*.level-option-button:before {
    content: ' ';
    background: linear-gradient(#ffffff0f,transparent);
    width: 90%;
    height: 70%;
    position: absolute;
    border-radius: 6px;
}*/
.dark-blue {
    text-shadow: -1px -1px 0 #323c5f;
    background: #252e4a;
    border: 1px solid #44517b;
    background-image: linear-gradient(to bottom, #5c678c, #434c6a);
    border-radius: 5px;
    box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset, 0 -1px 0 rgba(255, 255, 255, .1) inset, 0 4px 0 #363e5a, 0 4px 2px rgba(0, 0, 0, .5);
}
.dark-blue:hover {
    color: #5ac2ff;
    background-image: linear-gradient(to bottom, #434c6a,#5c678c);
}
.dark-blue:active {
  background-image: linear-gradient(to bottom, #434c6a,#5c678c);
  box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset, 0 -1px 0 rgba(255, 255, 255, .1) inset;
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
    color: #34fef6 !important;
}
.level-option-button:last-child {
    margin-right: 0 !important;
}
.test {
  width: 100%;
  height: 100%;
}
.left-big-menu {
    height: 3em;
    display: flex;
    justify-content: space-around;
}
.level-up-buttons {
    border-top: solid 2px #2a3044;
    height: 3em;
    background: linear-gradient(#434c6a,#343b50);
}
#hit-numbers {
  position: absolute;
  width: 100%;
  height: 100%;
}
.hit-number-text {
  z-index: 88;
    font-size: 3em;
    color: white;
    position: absolute;
    opacity: 0;
    -webkit-animation: move-text 2s;
    animation: move-text 2s;
    background: -webkit-linear-gradient(#ecad76, #ff4b4b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-text-stroke: 1px black;
}
@keyframes move-text {

  0% {
    transform: rotate(0deg)
               translate(-50px)
               rotate(0deg);
               opacity: 1;
  }
  15% {
               opacity: 1;
  }
  30% {
    opacity: 0;
  }
  100% {
    transform: rotate(360deg)
               translate(-50px) 
               rotate(-360deg);
               opacity: 0;
  }
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
.tab-menu-option {
    height: 100%;
    width: 25%;
    background: #3c4563;
    background-size: 50%;
    background-repeat: no-repeat;
    box-shadow: 0 -1px 0 1px #5e698e;
}
.tab-menu-option:first-child {
      border-top-left-radius: 8px;
}
.tab-menu-option:last-child {
  margin-right: 0;
  border-top-right-radius: 8px;
}
.left-panel-content {
    height: 85%;
    width: 95%;
    margin-left: 1em;
    border-radius: 8px;
}
::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  background-color: #2a3148;
  height: 40px;
}

::-webkit-scrollbar
{
  width: 10px;
  height: 40px;
  background-color: red;
  border-radius: 50%;
}

::-webkit-scrollbar-thumb
{
  height: 20px;
  background-color: #52608e;
  border-radius: 4px;
  margin-right: 1em;
}
.character {
    display: flex;
    margin-left: 10%;
    width: 90%;
    height: 6em;
    position: relative;
    justify-content: space-between;
}
.character-left {
    top: 1px;
        z-index: 5;
    height: calc(100% - 2px);
    left: -3em;
    display: flex;
    align-items: center;
    flex-direction: column;
    color: white;
    position: absolute;
    background: red;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0px 0px 0 2px #8183bf;
}
.char-dps {
    justify-content: flex-end;
    display: flex;
    width: 100%;
    color: #4dc4e0;
}
.pink {
    background: linear-gradient(rgb(241, 8, 255),rgb(171, 22, 247)) !important;
}
.pink-overlay {
    background: linear-gradient(rgba(255, 118, 244, 0.34118),rgba(0, 203, 224, 0.23922));
}
.char-name {
    text-shadow: 2px 2px black;
    width: 100%;
    align-items: center;
    display: flex;
    justify-content: flex-end;
    font-size: 1.5em;
    margin-right: 0.5em;
    color: #efefef;
}
.level-select {
  display: flex;
  height: 15%;
}
.char-cost {
    align-items: center;
    display: flex;
    width: 50%;
    height: 100%;
    background: none;
    justify-content: flex-end;
    padding-bottom: 0.25em;
}
.char-slot-bg {
    display: flex;
    width: 100%;
    align-items: center;
    height: 6em;
    position: relative;
    justify-content: center;
    margin-bottom: 0.6em;
    margin-left: 0.5em;
}
.char-slot-bg:last-child {
  margin-bottom: 0;
}
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
    width: 6em;
    height: 100%;
    border-radius: 50%;
}
.char-amount-gold {
  font-size: 0.8em;
    display: flex;
    width: 100%;
    justify-content: center;
    line-height: 1;
    z-index: 2;
}
.character-list {
    display: flex;
    flex-wrap: wrap;
    background: #303852;
    height: 100%;
    align-content: flex-start;
    justify-content: center;
    overflow-y: scroll;
    padding: 0.5em;
    border: solid 1px #525f8a;
}
.disabled {
    filter: grayscale(100%);
    pointer-events: none;
}
.purchase-amt-text {
    display: inline-block;
    padding-bottom: 0;
    line-height: 2em;
}
.character:before {
    position: absolute;
    left: 0;
    top: 0;
    content: " ";
    background: linear-gradient(#3e4869,#2b3656);
    box-shadow: 0 0 0 1px #8183bf;
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
    width: 100%;
    height: 100%;
}
.char-hire-button {
    width: 100%;
    display: flex;
    justify-content: center;
    z-index: 2;
    white-space: nowrap;
    font-size: 0.8em;
}
.char-portrait {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    border-radius: 6px;
    box-shadow: inset 1px 1px 20px 17px rgba(0, 0, 0, 0.35), 0px 0px 0px 2px rgba(0, 0, 0, 0.35);
}
.char-spell-icon {
    width: 2em;
    height: 2em;
    border-radius: 4px;
    border: solid 1px #2a3147;
    background: URL("icons/spells/rapid.png");
    background-size: cover;
    -webkit-filter: grayscale(100%);
    filter: grayscale(100%);
    margin-right: 0.5em;
}
.char-spells {
    display: flex;
    width: 35%;
    margin-left: 18%;
    height: 3em;
    align-items: flex-end;
}
.char-info-header {
    display: flex;
    width: 100%;
    height: 2em;
    border-top-right-radius: 8px;
    background: #4c4e88;
    align-items: center;
}
.char-info-body {
    height: 4em;
    width: 100%;
    border-bottom-right-radius: 8px;
    background: #414273;
    flex-direction: row;
    display: flex;
}
.char-info {
    width: 100%;
    z-index: 2;
    display: flex;
    justify-content: flex-end;
        flex-direction: column;
}

.menu-option-content {
    z-index: 2;
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: center;
    color: white;
    width: 100%;
    height: 100%;
    font-size: 0.9em;
}
.menu-icon {
    height: 100%;
    width: 100%;
    margin-right: 4px;
}
.inactive-tab {
    border-bottom: solid 1px #303852;
    background: #303958;
}
.menu-option {
    z-index: 5;
    display: flex;
    width: 25%;
    margin-left: 0;
    position: relative;
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
    pointer-events: none;
    z-index: 99;
    height: 15%;
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.8em;
    color: white;
    text-shadow: 2px 2px black;
}
.purple {
    text-shadow: -1px -1px 0 #784698;
    background: #984cc5;
    border: 1px solid #4e2958;
    background-image: linear-gradient(to bottom, #dd48e6, #904fab);
    border-radius: 5px;
    box-shadow: 0 1px 0 rgba(252, 231, 255, 0.5) inset, 0 -1px 0 rgba(255, 255, 255, .1) inset, 0 4px 0 #492a54, 0 4px 2px rgba(0, 0, 0, .5);
}
.bonus {
  color: aqua;
}
.push_button {
    position: relative;
    max-height: 2em;
    width: 127px;
    padding-left: 1em;
    padding-right: 1em;
    color: #FFF;
    text-decoration: none;
    line-height: 43px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-left: 1em;
    margin-right: 1em;
}
.blue {
    text-shadow: -1px -1px 0 #3a94d4;
    background: #48b7c3;
    border: 1px solid #3a86a9;
    background-image: linear-gradient(to bottom, #53c8e2, #238bb3);
    border-radius: 5px;
    box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset, 0 -1px 0 rgba(255, 255, 255, .1) inset, 0 4px 0 #206179, 0 4px 2px rgba(0, 0, 0, .5);
}
.push_button:hover {
  color: white !important;
}

.blue:hover {
  background-image: linear-gradient(to bottom, #238bb3, #53c8e2);
  color: white;
}
.push_button:active {
      -webkit-box-shadow:0 1px 0 rgba(255, 255, 255, .5) inset, 0 -1px 0 rgba(255, 255, 255, .1) inset;
    top:2px;
}
.push_button:active:before{
    top: -11px;
    bottom: -5px;
    content: "";
}
.blue:active {
  box-shadow: 0 1px 0 rgba(255, 255, 255, .5) inset;
}
@media only screen and (max-width: 600px) {
  body {
    background-color: lightblue;
  }
  .game-area {
    width: 100%;
    height: 200%;
    min-width: 100%;
    min-height: 100vh;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column-reverse;
    background-size: 300%;
    background-position: top right;
  }
  .left, .right {
    width: 100%;
    min-width: 100%;
    min-height: 100vh
  }
  .monster-status {
        margin-top: 100%;
  }
}

</style>
