<template>
		<div class="flex-centered" v-if="!loggedIn">
			<div class="preload"></div>
			<div class="login-screen" >
				<div class="game-menu">
					<div class="game-logo">
					</div>
					<div class="user-area">
						<div v-if="loadingDone">
							<div v-if="!registering">
								<div class="error-message" v-if="loginError">
									{{loginError}}
								</div>
								<input class="login-input" type="text" v-model="username" placeholder="Username">
								<input class="login-input"type="password" v-model="password" placeholder="Password">
								<button class="login-button" @click="logIn()">Log in</button>
								<a class="register-text" @click="registering = !registering; loginError = ''">Need an account? Register here.</a>
							</div>
							<div v-else>
								<div class="error-message" v-if="loginError">
									{{loginError}}
								</div>
								<input class="login-input" type="text" v-model="username" placeholder="Username">
								<input class="login-input"type="password" v-model="password" placeholder="Password">
								<input class="login-input" type="email" v-model="email" placeholder="Email">
								<button class="login-button" @click="register()">Register</button>
							</div>
						</div>
						<div v-else>
							<div class="loading-bar">
								<div class="loading-text">Loading.. Please Wait</div>
								<div class="loading-bar-fill" :style="{ 'width' : `${loadingPercent}%`}"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="flex-centered" v-else>
			<div class="game-area">
				<div class="game-modal" v-if="disconnected">
					<div class="game-modal-bg" ></div>
					<div class="game-modal-content">
						<div class="game-modal-header">
							<div class="game-modal-text">You've been disconnected.</div>
						</div>
						<div class="modal-pop-content">
							<div>Please reload the page</div>
							<div> 
												<a class="push_button blue" @click="location.reload()">
															RELOAD
												</a>
							</div>
						</div>
					</div>
				</div>
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
				<div class="game-modal" v-if="dropModal">
					<div class="game-modal-bg" @click="dropModal = !dropModal"></div>
					<div class="game-modal-content">
						<div class="game-modal-header">
							<div class="game-modal-text">You've obtained an item!</div>
							<div class="game-modal-close" @click="dropModal = !dropModal">X</div>
						</div>
						<div class="modal-pop-content">
											<div class="inventory-container">
													<div class="inventory-slot" v-for="item in itemDrops" :style="{ 'background-image' : `URL('icons/items/${item.icon}')`}" @click="equipItem(item.itemType,item.id)">
														<div class="inventory-slot-tooltip">
															{{item.name}}
														</div>
													</div>
											</div>
						</div>
					</div>
				</div>
				<div class="special-attack">
					<div class="background"></div>
					<div class="character-face"></div>
					 <div class="special-text"></div>
				</div>
					<div class="left">
							<div class="left-panel">
								<div class="stats-area">
								<div class="gold-stat stat-tab">
									<div class="gold-coin"></div>
									<span class="big-stat-text">{{formatNumber(goldCount)}}</span>
								</div>
								<div class="gem-stat stat-tab">
									<div class="gem-icon"></div>
									<span class="big-stat-text">{{ formatNumber(gemCount)}}</span>
								</div>
<!--                 <div class="click-stat stat-tab">
								 DPC: {{formatNumber(dpc)}}
								</div>
								<div class="dps-stat stat-tab">
									DPS: {{formatNumber(dps)}}
								</div> -->
							</div>
								<div class="left-panel-content">
								<div class="left-big-menu">
									<a class="tab-menu-option " @click="changeTab(0)" :class="{ 'inactive-tab' : currentTab != 0 }">
										<div class="menu-option-content">
											<div>Heroes</div>
										</div>
									</a>
									<a class="tab-menu-option " @click="changeTab(1)" :class="{ 'inactive-tab' : currentTab != 1 }">
									 <div class="menu-option-content">
											<div>Inventory</div>
										</div>
									</a>
									<a class="tab-menu-option " @click="changeTab(2)" :class="{ 'inactive-tab' : currentTab != 2 }">
										<div class="menu-option-content">
											<div>Divine</div>
										</div>
									</a>
									<a class="tab-menu-option " @click="changeTab(3)" :class="{ 'inactive-tab' : currentTab != 3 }">
									 <div class="menu-option-content">
											<div>Skills</div>
										</div>
									</a>
								</div>  
								<div class="left-panel-body">
									<div class="heroes-tab" v-if="currentTab == 0">
									<div class="character-list" > 
										<div class="char-slot-bg" v-if="availableNext.name != null">
											<div class="character" >
											<div class="character-left">
												<div class="char-img">
														<div class="char-portrait" :style="{'background-image' : `url('heroes/${availableNext.headImg}')`}">
															<div class="char-stars">
															 <div class="star"></div>
															 <div class="star"></div>
															 <div class="star"></div>
															</div>
														</div>                        
												</div>
											</div>
											<div class="char-info">
												<div class="char-info-header">
													<div class="char-dps">DPS: {{formatNumber(availableNext.dps)}}  LVL: {{availableNext.level}}</div>
													<div class="char-name">{{availableNext.name}}</div>
												</div>
												<div class="char-info-body">
												<!--   <div class="char-spells">
														<div class="char-spell-icon">
														</div>
														<div class="char-spell-icon">
														</div>
														<div class="char-spell-icon">
														</div>
													</div> -->
													<div class="char-cost">
													<a class="push_button purple" :class="{ 'purple-glow' : goldCount >= availableNext.cost }" @click="buyCharacter(availableNext.name)">
														<div class="char-hire-button"  >HIRE HERO</div>
														<div class="char-amount-gold">
															<div class="gold-coin-small"></div>
															<div class="char-amount-cost">
																{{formatNumber(availableNext.cost)}}
															</div>
														</div>
													</a>
												</div>
												</div>
											</div>
											</div>
										</div>
										<div class="char-slot-bg" v-for="(character, index) in availableCharacters">
											<div class="character" v-if="character.name != null">
											<div class="character-left">
												<div class="char-img">
														<div class="char-portrait" :style="{'background-image' : `url('heroes/${character.headImg}')`}">
															<div class="char-stars">
															 <div class="star"></div>
															 <div class="star"></div>
															 <div class="star"></div>
															</div>
														</div>                        
												</div>
											</div>
											<div class="char-info">
												<div class="char-info-header">
													<div class="char-name">{{character.name}}</div>
													<div class="char-stat">LVL: <span class="text-orange">{{character.level}}</span></div>
													<div class="char-stat">DPS: <span class="text-green">{{formatNumber(character.dps)}}</span></div>
												</div>
												<div class="char-info-body">
													<div class="char-cost">
													<a class="push_button blue" @click="levelCharacter(character.name)">
														<div class="char-hire-button">LEVEL UP <span class="level-rate" v-if="currentLevelRate > 1">({{currentLevelRate}}x)</span></div>
														<div class="char-amount-gold">
															<div class="gold-coin-small"></div>
															<div class="char-amount-cost">
																{{formatNumber(getLevelCost(character.name))}}
															</div>
														</div>
													</a>
												</div>
												</div>
											</div>
											</div>
										</div>
									</div>
																		<div class="left-small-menu">
										<a class="push_button dark-blue sm-btn-margin" @click="changeLevelRate(1)" :class="{ 'is-active-option' : currentLevelRate == 1 }">
											1x
										</a>
										<a  class="push_button dark-blue sm-btn-margin" @click="changeLevelRate(10)" :class="{ 'is-active-option' : currentLevelRate == 10 }">
											10x
										</a>
										<a class="push_button dark-blue sm-btn-margin" @click="changeLevelRate(25)" :class="{ 'is-active-option' : currentLevelRate == 25 }">
											25x
										</a>
										<a class="push_button dark-blue sm-btn-margin" @click="changeLevelRate(100)" :class="{ 'is-active-option' : currentLevelRate == 100 }">
											100x
										</a>
								</div> 
									</div>  
									<div class="inventory-tab" v-if="currentTab == 1"> 
										<div class="equipment-area">
											<div class="inventory-head">Equipped Items</div>
											<div class="equipment-container">
												
												<div class="equipment-slot">
													<div>Weapon</div>
													<div class="equipment-icon" :style="{ 'background-image' : `URL('icons/items/${equippedWeapon.icon}')`}">
																											<div class="inventory-slot-tooltip" v-if="equippedWeapon.name">
															<div class="item-name">{{equippedWeapon.name}}</div>
															<div class="item-description"> Increases DPC by {{equippedWeapon.bonusAmount}}</div>
														</div>
													</div>
													<div v-if="equippedWeapon.bonusAmount > 0">+{{equippedWeapon.bonusAmount}} DPC</div>
													<div v-else>+0 DPC</div>
												</div>
												<div class="equipment-slot">
													<div>Amulet</div>  
													<div class="equipment-icon">
														
													</div>
													<div>+0% Crit</div>                    
												</div>
												<div class="equipment-slot">
													<div>Ring</div>  
													<div class="equipment-icon" :style="{ 'background-image' : `URL('icons/items/${equippedRing.icon}')`}">
																											<div class="inventory-slot-tooltip" v-if="equippedRing.name">
															<div class="item-name">{{equippedRing.name}}</div>
															<div class="item-description"> Increases DPC by {{equippedRing.bonusAmount}}</div>
														</div>
													</div>
													<div v-if="equippedRing.bonusAmount > 0">+{{Math.round(equippedRing.bonusAmount * 100)}}% Gold</div>
													<div v-else>+0% Gold</div>                     
												</div>
												<div class="equipment-slot">
													<div>Scroll</div>  
													<div class="equipment-icon">
														
													</div>
													 <div>+0% Souls</div>                       
												</div>

											</div>
											</div>
											<div class="inventory-area">
											<div class="inventory-head">Available Items</div>
											<div class="inventory-container">
													<div class="inventory-slot" v-for="item in inventory" :style="{ 'background-image' : `URL('icons/items/${item.icon}')`}" @click="equipItem(item.itemType,item.id)">
														<div class="inventory-slot-tooltip">
															<div class="item-name">{{item.name}}</div>
															<div class="item-description"> Increases DPC by {{item.bonusAmount}}</div>
														</div>
													</div>
											</div>
										</div>
									</div>    
									<div v-if="currentTab == 2"> 
											Souls Tab! 
									</div> 
									<div v-if="currentTab == 3"> 
											Specials Tab! 
									</div>             
								</div>
							</div>
							</div>
						</div>
						<div class="right">
						<div class="level-select">
							<div class="level-area">
								<div class="current-level">
									<div class="level-text small-text">Level</div>
									<div class="level-text">{{level}}</div>
								</div>
								<div class="level-info">
									<div class="level-name">Gloomy Hills</div>
									<div class="level-name" @click="redoBoss()">Back To Boss</div>
								</div>
								<div class="level-progress">
									<div class="level-prog-fill" :style="{'width' : `${monsterCount * 10}%`}" v-if="!isBossLevel"></div>
									<div class="level-prog-fill" id="boss-fill" :style="{'width' : `${Math.floor(bossTime * 3.33)}%`}" v-else>
										<div id="boss-timer">{{bossTime}}</div>
									</div>
								</div>
							</div>
						</div>
						<div class="loot-area">
							<div class="chest-area">
								<div class="chest"></div>
							</div>
						</div>
						<div class="click-area" @click="attack($event)">
								<canvas id="monster-area" class="canvas new-monster" width="512px" height="448px"></canvas>
							<div class="hit-area" id="hit-area"></div>
							<div id="hit-numbers" class="hit-numbers-div" width="512px" height="448px"></div>
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
	beforeMount() {
		let img = []
		var imgList = ['loadingbg.jpg', 'logo.png']
		for(var x = 0; x < imgList.length; x++)
			{
				img[x] = new Image();
				img[x].src = imgList[x]          
			}    
	},
	mounted() {
	 this.preloadImg();
	 var self = this

		document.onkeydown = function(e){
				e = e || window.event;
				var key = e.which || e.keyCode;
				if(key===49){
						self.specialRapidClick(25);
				}
		}
		this.socket.on('SocketId', data => {
			this.mySocket = data.socketId
		})
		this.socket.on('BOSS-TIMER', data => {
			console.log(data)
			this.isBossLevel = true
			this.bossTime = data.currentTime
		})
		this.socket.on('LEVEL-CHAR', data => {
			console.log(data)
			let updateChar = data.hero
			let updateIndex = this.boughtHero.findIndex( slot => slot.name == updateChar.name )
			this.boughtHero[updateIndex] = updateChar
			this.goldCount = data.goldCount
			console.log(this.goldCount)
		})
		this.socket.on('ITEM-DROP', data => {
			this.itemDrops = data.itemDrops
			this.inventory = data.inventory
			this.dropModal = true
			console.log(this.inventory)
		})
		this.socket.on('BUY-CHAR', data => {
			this.menuSound()
			this.boughtHero = data.bought
			this.nextHero = data.next
			this.goldCount = data.gold
			this.dps = data.dps
		})
		this.socket.on('EQUIPPED', data => {
			
			this.inventory = data.inventory
			if(data.equippedWeapon){
				this.dpc = data.dpc
				this.equippedWeapon = data.equippedWeapon
			}
			if(data.equippedRing){
				this.goldBonus = data.goldBonus
				this.equippedRing = data.equippedRing
			}      
		})
		this.socket.on('DOWN-LEVEL', data => {
			console.log(data)
			this.isBossLevel = data.bossFight
			this.level = data.level
			this.monsterCount = data.monsterCount
				setTimeout(() => {
					self.image = data.currentMonster.image
					self.monsterName = data.currentMonster.name
					self.getNewMonster()
					self.monsterCurrentHP = data.currentMonster.monsterCurrentHP
					self.monsterMaxHP = data.currentMonster.monsterMaxHP
			//		self.bossKilled = data.bossKilled
				}, 500)
			
		})

		this.socket.on('disconnect', data => {
				console.log('please relog')
			 // this.disconnected = true;
				this.loggedIn = false

		})
		this.socket.on('BOSS-START', data => {

		})
		this.socket.on('ATTACK', data => {
			this.monsterCurrentHP = data.monsterCurrentHP;
			if(this.monsterCurrentHP < 0){
				this.monsterCurrentHP = 0
			}
		})
		this.socket.on('GOLD', data => {
			this.killMonster();
			console.log(data)
			var self = this
			this.monsterCount = data.monsterCount,
			this.goldCount = data.goldCount
			this.isBossLevel = data.isBoss
			if(!this.isBossLevel && this.monsterCount != 11)
			{
				setTimeout(() => {
					self.image = data.currentMonster.image
					self.monsterName = data.currentMonster.name
					self.getNewMonster()
					self.monsterCurrentHP = data.currentMonster.monsterCurrentHP
					self.monsterMaxHP = data.currentMonster.monsterMaxHP
			//		self.bossKilled = data.bossKilled
				}, 1500)
			}

		})
		this.socket.on('HERO-LEVEL', data => {
			//do shit
		})
		// this.socket.on('BOSS-END', data => {
		// 	// this.monsterCount = data.monsterCount
		// 	// this.bossKilled = data.bossKilled
		// })
		this.socket.on('READY', data => {
				this.isAttackable = data.canAttack
		})
		this.socket.on('LOGIN', data => {
		 // console.log(data)
			this.loggedIn = true;
			this.goldCount = data.gold
			this.level = data.level
			this.monsterCount = data.monsterCount
			this.boughtHero = data.heroes
			this.nextHero = data.nextHero
			this.dps = data.dps
			this.dpc = data.dpc
			this.image = data.currentMonster.image
			this.monsterName = data.currentMonster.name
			this.equippedWeapon = data.equippedWeapon
			this.equippedAmulet = data.equippedAmulet
			this.equippedRing = data.equippedRing
			this.equippedScroll = data.equippedScroll
			this.inventory = data.inventory
				this.monsterCurrentHP = data.currentMonster.monsterCurrentHP
				this.monsterMaxHP = data.currentMonster.monsterMaxHP
			//	this.bossKilled = data.bossKilled  
			var self = this
			setTimeout(() => {
				self.getNewMonster()      
			}, 20)
			this.updateDmgPos()
			this.checkAchievements()
			})
		this.socket.on('LEVEL-CHANGE', data => {
			this.monsterCount = data.monsterCount
			this.level = data.level
			this.isBossLevel = data.bossFight
			if(this.isBossLevel){
				this.monsterCurrentHP = data.currentMonster.monsterCurrentHP
				this.monsterName = data.currentMonster.name
				this.image = data.currentMonster.image
				this.monsterMaxHP = data.currentMonster.monsterMaxHP
			}
			//self.getNewMonster()
		})
	},
	computed: {
		availableCharacters: function() { 
			return this.boughtHero.reverse()
		},
		availableNext: function() { 
			return this.nextHero
		},
		currentLevelRate: function(){
			return this.levelRate
		},
		playerInventory: function(){
			return this.inventory
		}
	},
	data() {
		return {
			inventory: [],
			equippedWeapon : [],
			equippedAmulet : [],
			equippedRing : [],
			equippedScroll : [],
			currentTab: 0,
			boughtHero: [],
			itemDrops: [],
			nextHero: [],
			loggedIn: false,
			bossFailed: false,
			mySocket: '',
			imageList: ['testbg2.jpg','levels/12.jpg','testbg.jpg','demongirl.png','spirit.png','slug.svg','heroes/luna-head.jpg','heroes/suyeon-head.jpg','heroes/yukki-head.jpg','heroes/mikon-head.jpg','heroes/fate-head.jpg','heroes/albedo-head.jpg',"logo.png","icons/spells/rapid.png",'icons/sword.png','gem.svg','coin.svg','hit.svg',"heroestab.svg","achtab.svg",'demongirl2.png','demongirl3.png','slug.svg'
			],
			username: '',
			password: '',
			email: '',
			registering: false,
			animFrame: '',
			bossTime: false,
			// socket: io('https://clickergame.tk/'),
			socket: io('http://localhost:3001'),
			user: '',
			viewModal: false,
			dropModal: false,
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
			isAttacking: false,
			dps: 0,
			dpc: 0,
			levelRate: 1,
			isBossLevel: false,
			loginError: '',
			bossKilled: true,
			isAttackable: true,
			monsterOrder: -1,
			monsterCurrentHP: '',
			monsterMaxHP: '',
			image: '',
			disconnected: false,
			monsterName: '',
			goldCount: 0,
			goldBonus: 0,
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
			characters: [
			{ name: 'Luna',
				fullImg: 'luna.jpg',
				headImg: 'luna-head.jpg',
				dps: 1,
				level: 1,
				baseDps: 1,
				baseCost: 10,
				cost: 10 },
			{ name: 'Suyeon',
				fullImg: 'suyeon.jpg',
				headImg: 'suyeon-head.jpg',
				dps: 5,
				level: 1,
				baseDps: 5,
				baseCost: 49,
				cost: 49 },
			{ name: 'Yukki',
				fullImg: 'yukki.jpg',
				headImg: 'yukki-head.jpg',
				dps: 19,
				level: 1,
				baseDps: 19,
				baseCost: 240,
				cost: 240 },
			{ name: 'Mikon',
				fullImg: 'mikon.jpg',
				headImg: 'mikon-head.jpg',
				dps: 70,
				level: 1,
				baseDps: 70,
				baseCost: 1176,
				cost: 1176 },
			{ name: 'Fate',
				fullImg: 'fate.jpg',
				headImg: 'fate-head.jpg',
				dps: 257,
				level: 1,
				baseDps: 257,
				baseCost: 5762,
				cost: 5762 },
			{ name: 'Albedo',
				fullImg: 'albedo.jpg',
				headImg: 'albedo-head.jpg',
				dps: 941,
				level: 1,
				baseCost: 28234,
				baseDps: 28334,
				cost: 28234 },
				{ name: 'Kayle',
				fullImg: 'albedo.jpg',
				headImg: 'kayle-head.jpg',
				dps: 3444,
				level: 1,
				baseCost: 138346,
				baseDps: 3444,
				cost: 138346 },
				{ name: 'Rie',
				fullImg: 'albedo.jpg',
				headImg: 'rie-head.jpg',
				dps: 12605,
				level: 1,
				baseCost: 677895,
				baseDps: 12605,
				cost: 677895 },
				{ name: 'Nell',
				fullImg: 'albedo.jpg',
				headImg: 'nell-head.jpg',
				dps: 46134,
				level: 1,
				baseCost: 3321685,
				baseDps: 46134,
				cost: 3321685 }
			],
			loadingPercent: 0,
			loadingDone: false,
			currentImage: 0,
			preloadImagesObj: []
		}
	},
	methods: {
		preloadImg(){
			var self = this
			if(this.currentImage == this.imageList.length){
				this.loadingDone = true;
			}
			else {
				setTimeout(() => {
					this.preloadImagesObj[self.currentImage] = new Image();
					this.preloadImagesObj[self.currentImage].src = self.imageList[self.currentImage]
					this.preloadImagesObj[self.currentImage].onload = function(){ 
				 // console.log(self.loadingPercent)
					self.loadingPercent = self.loadingPercent + percentInc;
					self.currentImage++;  
					self.preloadImg();      
					}
				}, 1)
			}
			var percentInc = 100 / this.imageList.length        
		},
		equipItem(slot,id){
			this.socket.emit('EQUIP', {
				 itemType : slot, id : id
			})
		},
		logIn(){
				var self = this;
			 // this.$axios.$post(`https://clickergame.tk/api/login`, { username : self.username, password : self.password})
					this.$axios.$post(`http://localhost:3001/api/login`, { username : self.username, password : self.password})
					.then((res) => {
						this.socket.emit('CheckUser', {
							user: this.username, socketId: this.mySocket
				})

					}).catch(e => {
					 this.loginError = e.response.data
					})
		},
		register(){
				var self = this;
			 // this.$axios.$post(`https://clickergame.tk/api/login`, { username : self.username, password : self.password})
					this.$axios.$post(`http://localhost:3001/api/register`, { username : self.username, password : self.password, email : self.email})
					.then((res) => {
						console.log(res)
						self.socket.emit('CheckUser', {
							user: this.username, socketId: this.mySocket
				})

					}).catch(e => {
						this.loginError = e.response.data
					})
		},
		changeTab(num){
			return this.currentTab = num
		},
		slashSound(){
			var bflat = new Audio();
			bflat.src = "audio/slash.mp3";
			bflat.volume = 0.3;
			bflat.play();
		},
		menuSound(){
			var bflat = new Audio();
			bflat.src = "audio/accent.mp3";
			bflat.play();
		},
		redoBoss(){
						this.socket.emit('RESTART-BOSS', {
						})
						console.log('restarting boss..')
		},
		attack(e,special,ranX,ranY){
			if(this.monsterCurrentHP > 0 && this.isAttackable)
			{
				if(!special){
					this.clickCount++;
					this.clicksPerSecond++;
					this.slashSound()
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
					this.isAttacking = true;
					var self = this
					setTimeout(() => self.isAttacking = false, 100)
				let random = Math.floor(Math.random() * 360) + 1;
				document.getElementsByClassName('hit-area')[0].style.left = `${offsetX-125}px`;
				document.getElementsByClassName('hit-area')[0].style.top = `${offsetY-125}px`;
				document.getElementsByClassName('hit-area')[0].style.transform = `rotate(${random}deg)`;
				document.getElementsByClassName('hit-area')[0].classList.add('hit-anim')
				
				document.getElementsByClassName('hit-area')[0].classList.remove('hit-anim')
				// -> triggering reflow /* The actual magic */
				// without this it wouldn't work. Try uncommenting the line and the transition won't be retriggered.
				//Do not remove below.
				void event.target.offsetWidth;
				// -> and re-adding the class
				document.getElementsByClassName('hit-area')[0].classList.add('hit-anim')
				this.socket.emit('DAMAGE', {
					// user: this.user,
					// monsterMaxHP: this.monsterMaxHP,
					// monsterCurrentHP: this.monsterCurrentHP,
					// socketId: this.mySocket
				})
				var self = this
				this.recentHits.push({"x": offsetX, "y": offsetY, "amount": this.dpc, "maxY" : offsetY - 60,
				'maxYHit' : false, "opacity" : 1})

				this.showDamageNumbers(offsetX, offsetY, this.dpc);
				function clearDamageNumers() {
					setTimeout(() => {
					  if(document.getElementsByClassName('hit-number-text').length > 0){
					    for(let i = 0 ; i < document.getElementsByClassName('hit-number-text').length; i++)
					    {
					      document.getElementsByClassName('hit-number-text')[i].style.opacity = `${document.getElementsByClassName('hit-number-text')[i].opacity - 0.05}`
					      if(document.getElementsByClassName('hit-number-text')[i].opacity <= 0){
					      	document.getElementsByClassName('hit-number-text')[i].remove()
					      }
					    }
					    clearDamageNumers()
					  }
					  else {
					  	return 
					  }
					  
					 },1000/24)	
				}

			}
			if(this.monsterCurrentHP <= 0 && !this.monsterDeath)
			{
				this.monsterDeath = true;
				this.monsterCurrentHP = 0;
				//kill monster!
				
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
		buyCharacter(charName){
			
			this.socket.emit('BUY-CHAR', {
				name : charName
			})
			// var index = this.characters.findIndex( slot => slot.name == charName )
			// if(this.goldCount >= this.characters[index].cost && this.characters[index].bought != true)
			// {
			//   this.characters[index].bought = true;
			//   this.dps = this.dps + this.characters[index].dps
			//   this.characters[index+1].disabled = false;
			//   this.goldCount = this.goldCount -this.characters[index].cost;
			// }
		},
		checkNextLevel(){
			var levelBg = this.maps.find(i => {
				return i.levelMin <= this.level && i.levelMax >= this.level
			})
			document.getElementsByClassName('game-area')[0].style.backgroundImage = `url('${levelBg.image}')`
		},
		killMonster() {
			setTimeout(() => this.recentHits = [], 750)
			document.getElementById('monster-area').classList.remove('new-monster')
			document.getElementById('monster-area').classList.add('kill-monster')
			document.getElementsByClassName('monster-name')[0].classList.add('kill-monster')
			// if(this.isBossLevel){
			//   this.bossKilled = 
			// }
			// this.socket.emit('KILL-MONSTER', {
			// 		user: this.user,
			// 		monsterHP: this.monsterMaxHP,
			// 		monsterCount: this.monsterCount,
			// 		socketId: this.mySocket,
			// 		isBoss: this.isBossLevel,
			// 		bossKilled: this.bossKilled
			// })
			this.isAttackable = false;
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
		getLevelCost(charName){
			var index = this.boughtHero.findIndex( slot => slot.name == charName)
			let char = this.boughtHero[index]
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
		changeLevelRate(val){
			this.levelRate = val
			this.socket.emit('LEVEL-RATE', { levelRate : val })
		},
		levelCharacter(charName){
			this.socket.emit('LEVEL-CHAR', { name : charName })
			// var index = this.characters.findIndex( slot => slot.name == charName)
			// let char = this.characters[index]
			// let totalLevelCost = this.getLevelCost(charName);
			// let endLevel = char.level + this.levelRate;
			//   if(this.goldCount >= totalLevelCost)
			//   {
			//     this.goldCount = this.goldCount - totalLevelCost
			//     char.level = endLevel;
			//     this.calcExtraDps(charName)
			//     char.cost = Math.round(char.baseCost * (1.07 * char.level))
			//     //Lets update our DPS total now.
			//     var totalDps = 0
			//     this.characters.forEach(slot => {
			//       if(slot.bought)
			//       {
			//         totalDps = totalDps + slot.dps
			//       }
			//     })
			//     this.dps = totalDps
			//   }
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
				  setTimeout(() => {
				  			document.getElementsByClassName('hit-number-text')[0].remove()
				  }, 1000)
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
			this.recentHits = []
			var self = this
			var imgX = 55;
			var imageX = 390;
			var imageY = 546;
			var step = 0;
			var stepMin = 0
			var stepMax = 0
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
			if(self.isAttacking){
				document.getElementById('monster-area').classList.add('monster-hit')        
			} else {
				document.getElementById('monster-area').classList.remove('monster-hit')        
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
			// context.shadowColor = "rgb(190, 190, 190)";
			// context.shadowOffsetX = 10;
			// context.shadowOffsetY = 10
			// context.shadowBlur = 10;
			context.font = "50px arial";
			var gradient = context.createLinearGradient(0, 0, 150, 100);
			gradient.addColorStop(0, "rgb(255, 0, 128)");
			gradient.addColorStop(1, "rgb(255, 153, 51)");
			context.fillStyle = gradient;
			context.clearRect(0, 0, canvas_size_x, canvas_size_y);
				context.drawImage(imageObj, 60, step, imageX, imageY);
				global.requestAnimationFrame(draw)
			}

			// context.fillText("Text Effects", 10, 50);
			draw()
			this.monsterDeath = false
			document.getElementById('monster-area').classList.remove('kill-monster')
			document.getElementsByClassName('monster-name')[0].classList.remove('kill-monster')
			document.getElementById('monster-area').classList.add('new-monster')
			setTimeout(() => { 
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
/*@import url('https://fonts.googleapis.com/css?family=Titillium+Web');*/
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
	  margin-top: 25%;
		width: 40%;
		z-index: 300;
		border-radius: 1em;
		box-shadow: 0 0 0 1px black, 0 0 0 3px #968610, 0 0 14px 2px black;
    -webkit-animation: slide 0.5s forwards;
    -webkit-animation-delay: 1s;
    animation: slide 0.5s forwards;
    animation-delay: 1s;
    opacity: 0;
    z-index: 999;
}
.modal-pop-content {
		display: flex;
		background: #4e5671;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding: 1em;
		border-bottom-left-radius: 1em;
		border-bottom-right-radius: 1em;
		color: #e2e0e0;
}
.game-modal-text {
		width: 100%;
		display: flex;
		justify-content: center;
		align-content: center;
}
.game-modal-header {
		border-top-left-radius: 1em;
		border-top-right-radius: 1em;
		background: radial-gradient(#5d5047, #483f39);
		color: white;
		padding: 1em;
		display: flex;
		font-size: 1.2em;
		font-weight: bold;
		text-shadow: 2px 2px black;
		border-bottom: 2px #71655d solid;
		justify-content: space-between;
		width: 100%;
		z-index: 2;
}
.game-modal {
		position: absolute;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
}

@-webkit-keyframes slide {
    100% { bottom: 0; }
}

@keyframes slide {
    100% { margin-top: 0; opacity: 1 }
}
.game-modal-bg {
		background: #0000006b;
		width: 100%;
		height: 100%;
		position: absolute;
		z-index: 200;
    -webkit-animation: slide 0.5s forwards;
    -webkit-animation-delay: 1s;
    animation: slide 0.5s forwards;
    animation-delay: 1s;
    opacity: 0;
    z-index: 999;
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
		margin-top: 64%;
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
.loading-bar {
		background: #0e2030;
		border-radius: 3em;
		border: solid 2px #d1507c;
		color: white;
		width: 100%;
		height: 2.5em;
		margin-bottom: 1em;
		position: relative;
		overflow: hidden;
}
.loading-bar-fill {
		background: #505ec6;
		height: 100%;
		border-radius: 1em;
		transition: width 0.25s ease-in;
}
.loading-text {
		display: flex;
		height: 100%;
		position: absolute;
		width: 100%;
		justify-content: center;
		align-items: center;
}
.preload{
		position: absolute;
		top: -9999px;
		left: -9999px;
}
.login-screen {
		width: 1024px;
		height: 640px;
		width: 1024px;
		min-width: 1024px;
		height: 640px;
		min-height: 640px;
		background: grey;
		position: relative;
		overflow: hidden;
		background-image: URL('loadingbg.jpg');
		background-size: cover;
		justify-content: center;
		align-items: center;
		display: flex;
		-moz-user-select: none;
		-khtml-user-select: none;
		-webkit-user-select: none;
}
.game-menu {
		flex-direction: column;
		display: flex;
		width: 50%;
		height: 50%;
		justify-content: center;
		align-items: center;
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
		background-image: URL('levels/12.jpg');
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
.inventory-head {
		width: 100%;
		display: flex;
		font-size: 1.5em;
		color: #fff0a1;
		justify-content: center;
		text-shadow: 2px 2px black;
		padding-top: 0.5em;
		margin-bottom: 0.5em;
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
span.big-stat-text {
		font-size: 2em;
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
		background: #5d5149;
		padding: 0.4em;
		padding-left: 0.4em;
		padding-right: 0.6em;
		box-shadow: 0 -1px 0 rgba(255, 255, 255, .1) inset, 0 4px 0 #312b26, 0 4px 2px rgba(0, 0, 0, .5);
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
		cursor: URL("mouse.svg"), auto;
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
		width: 250px;
		height: 250px;
		background-repeat: no-repeat;
		background-position: center;
		background-size: 100%;
		background-image: URL("slash.png");
	/*  animation: hit 0.4s;*/
}
.hit-anim {
			-webkit-animation: hit;
		animation: hit normal forwards;
		-webkit-animation-duration: 0.2s;
		animation-duration: 0.2s;
}
@keyframes hit {
	0% { opacity: 1.0; }
	50% {opacity: 0.5;  }
	100% {opacity: 0;  }
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
.inventory-tab, .heroes-tab, .divine-tab, .skills-tab {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		overflow-y: hidden;
}
.inventory-row {
		width: 100%;
		height: 33%;
		display: flex;
		margin-bottom: 0.5em;
}
.inventory-container {
		flex-wrap: wrap;
		display: flex;
		height: 100%;
		padding: 1em;
		overflow-y: scroll;
		width: 100%;
		margin-top: auto;
		margin-bottom: 2.5%;
		justify-content: flex-start;
		padding-top: 0;
		padding-right: 0;
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

.gold-coin {
		content: " ";
		position: absolute;
		left: 5%;
		background-image: URL("goldcoin.png");
		height: 2em;
		background-position: center;
		background-size: cover;
		width: 2em;
}
.stat-tab {
		justify-content: center;
		border-radius: 2em;
		padding-right: 0.5em;
		padding-left: 0.5em;
		border: solid 2px #080707;
		display: flex;
		width: 49%;
		height: 3em;
		font-weight: bold;
		color: white;
		text-shadow: 2px 2px black;
		background: linear-gradient(#483f39,#3a312b);
		align-items: center;
		position: relative;
		box-shadow: inset 0px 2px #6d635c;
}
.spell-tool-name {
		color: white;
}
.skill-container {
		display: flex;
		padding: 0.25em;
		background: #27211d;
		border-radius: 4px;
		box-shadow: 1px 1px 0 rgb(93, 81, 73) inset, 0 -1px 0 rgba(255, 255, 255, .1) inset, 0 4px 0 #5d5149, 0 4px 2px rgba(0, 0, 0, .5);
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
		background: #423832;
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
}
.left-panel-body {
		display: flex;
		width: 100%;
		flex-direction: column;
		height: 91%;
		border: solid 1px black;
		border-top: none;
		border-bottom: none;
		padding-bottom: 0;
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		background: #271f1c;
}
.error-message {
		margin: 1em 0 1em 0;
		width: 100%;
		background: #242729;
		border: solid 2px #0e2030;
		border-radius: 2em;
		padding: 0.5em;
		color: #ff4900;
		display: flex;
		justify-content: center;
		font-size: 0.75em;
}
.game-logo {
		width: 100%;
		height: 50%;
		background-image: URL("logo.png");
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		margin-bottom: 1em;
}
button.login-button {
		width: 100%;
		background: #d1507c;
		border: solid 2px #0e2030;
		border-radius: 2em;
		padding: 0.5em;
		color: white;
}
.user-area {
		display: flex;
		width: 50%;
		justify-content: center;
		flex-direction: column;
}
.login-input {
		background: #0e2030;
		border-radius: 3em;
		border: solid 2px #d1507c;
		color: white;
		width: 100%;
		height: 2.5em;
		margin-bottom: 1em;
		padding: 1em;
}
.health-anim-slow {
	transition: width 0.25s ease-in-out;
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
	box-shadow: inset 2px 0px #73655c;
		background: #5d5149;
		height: 3em;
		display: flex;
		padding: 0.5em;
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		width: 100%;
		padding-bottom: 1em;
		border: solid 1px black;
		border-top: none;
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
text-shadow: -1px -1px 0 #000000;
		font-weight: bold;
		background: #483e37;
		background-image: linear-gradient(to bottom, #5d5149, #3a312b);
		border: solid 2px #2b2522;
		box-shadow: inset 2px 2px 0px 1px rgb(97, 82, 72), inset -2px -2px 1px 1px rgba(53, 45, 35, 0.74118);
		height: 100%;
		padding: 0.9em !important;
}
.dark-blue:hover {
		color: #ffe041 !important;
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
		color: #ffe041 !important
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
.equipment-container {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		border-radius: 8px;
		align-items: center;
		margin-top: 0.25em;
		margin-bottom: 1em;
	}
.item-name {
		width: 100%;
		border-bottom: solid 2px gray;
		font-weight: bolder;
}
.inventory-area {
		height: 75%;
		display: flex;
		flex-direction: column;
		background: radial-gradient(ellipse at top, rgba(71,61,51,1) 0%, rgba(26,23,18,1) 100%);
		padding-right: 0.5em;
}
.inventory-slot {
		height: 3.9em;
		background: #463f3a;
		width: 3.9em;
		margin: 0.25em;
		border-radius: 8px;
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		position: relative;
}
.item-description {
		width: 100%;
		flex-wrap: nowrap;
		flex-grow: 1;
		display: flex;
		margin-top: 0.5em;
		white-space: nowrap;
}
span.level-rate {
		font-size: 0.7em;
		line-height: 2;
		margin-left: 0.25em;
}
.inventory-slot-tooltip {
		position: absolute;
		left: 0;
		bottom: 100%;
		background: #161719;
		border: solid 2px #a0968f;
		z-index: 400;
		padding: 1em;
		border-radius: 8px;
		justify-content: center;
		align-items: center;
		display: none;
		flex-direction: column;
		font-size: 0.9em;
		font-weight: bold;
		color: white;
}
.equipment-icon:hover .inventory-slot-tooltip {
	display: flex;
}
.inventory-slot:hover .inventory-slot-tooltip {
	display: flex;
}
.loot-area {
		display: none;
		width: 20%;
		position: absolute;
		height: 30%;
		right: 5%;
		bottom: -6%;
}
.equipment-slot {
			white-space: nowrap;
		font-size: 0.9em;
		font-weight: bold;
		color: white;
		width: 25%;
		height: 100%;
		margin: 0.5em;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
}
.equipment-icon {
		background-size: cover;
		background-position: center;
		background-repeat: no-repeat;
		width: 5em;
		height: 5em;
		background-color: #2f2b28;
		border-radius: 8px;
				position: relative;
}
.equipment-icon:after {
		 position: absolute;
		width: 100%;
		height: 100%;
		content: ' ';
		background: URL("item-border.png");
		background-size: cover;   
}

.hit-number-text {
	z-index: 88;
		font-size: 3em;
		color: white;
		position: absolute;
		opacity: 0;
		-webkit-animation: move-text 2s;
		animation: move-text 2s;
		font-weight: bolder;
		background: -webkit-linear-gradient(#f3f5e9, #ebf5a9);
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
	25% {
		opacity: 1;
	}
	45% {
		opacity: 0;
	}
	100% {
		transform: rotate(360deg)
							 translate(-50px) 
							 rotate(-360deg);
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
		background: #5d5149;
		background-size: 50%;
		background-repeat: no-repeat;
		border: solid 1px black;
		border-bottom: none;
		box-shadow: inset 2px 2px #73655c;
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
	background-color: #483f39;
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
	background-color: #a09476;
	border-radius: 4px;
	margin-right: 1em;
}
.level-monster-count {
		z-index: 150;
}
.character {
		display: flex;
		width: 100%;
		height: 6em;
		position: relative;
		justify-content: space-between;
		background: linear-gradient(135deg,#6d6155, #564a3d);
		border: solid 2px #3a312b;
		padding: 0.5em;
		padding-left: 0;
}
.char-stars {
		width: 100%;
		position: absolute;
		bottom: -5%;
		display: flex;
		justify-content: center;
		overflow: visible;
}
.star {
		width: 1em;
		height: 1em;
		background-image: URL("/icons/fillstar.svg");
		background-size: contain;
		z-index: 20;
		background-repeat: no-repeat;
}
.character-left {
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		color: white;
		width: 6em;
}
.char-dps {
		justify-content: flex-start;
		display: flex;
		width: 100%;
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
		display: flex;
		font-size: 1.5em;
		margin-right: 0.5em;
		color: #efefef;
		line-height: 1.2;
		margin-bottom: 0.5em;
}
.level-select {
		display: flex;
		height: 14%;
		align-content: flex-start;
		justify-content: center;
}
.char-cost {
		align-items: center;
		display: flex;
		width: 100%;
		height: 100%;
		background: none;
		justify-content: flex-end;
}
.char-slot-bg {
		display: flex;
		width: 100%;
		align-items: center;
		position: relative;
		justify-content: center;
}
.monster-hit {
		transform: rotate(-5deg);
		transition: 0.2s;
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
		width: 100%;
		height: 100%;
		padding: 0.5em;
		padding-top: 0;
		padding-bottom: 0;
}
.char-amount-gold {
		display: flex;
		width: 100%;
		justify-content: center;
		line-height: 1;
		z-index: 2;
}
.char-amount-cost {
		line-height: 1.1;
}
.character-list {
		display: flex;
		flex-wrap: wrap;
		background: #3a312b;
		height: 90%;
		align-content: flex-start;
		overflow-y: scroll;
		justify-content: center;
		overflow-x: hidden;
		border: solid 1px #211d1a;
}
.level-info {
		display: flex;
		justify-content: space-between;
		width: 100%;
}
.left-small-menu {
		height: 3em;
		display: flex;
		padding: 0.5em;
		border-bottom-left-radius: 8px;
		border-bottom-right-radius: 8px;
		width: 100%;
		padding-bottom: 1em;
		border-top: none;
}
.level-prog-fill {
		height: 100%;
		box-shadow: inset 0px 2px #d2b878;
		background: linear-gradient(#b79a56,#887037);
/*    transition: width 0.25s ease-in;*/
}
#boss-timer {
	display: flex;
	width: 100%;
	justify-content: center;
	position: absolute;
	height: 100%;
}
.level-progress {
		width: 100%;
		background: #3a312b;
		border: solid 2px black;
		border-radius: 8px;
		overflow: hidden;
		position: relative;
		margin-top: 1em;
		height: 3em;
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
/*.character:before {
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
}*/
.char-hire-button {
		width: 100%;
		display: flex;
		justify-content: center;
		z-index: 2;
		white-space: nowrap;
}
.char-portrait {
		width: 100%;
		height: 100%;
		position: relative;
		background-size: cover;
		background-position: center;
		border-radius: 1em;
		box-shadow: inset 0 0 0 2px #292827, inset 0 0 0 5px #e2dacb, inset 0 0 4px 5px #171616;
}
.char-spell-icon {
		width: 2.5em;
		height: 2.5em;
		border-radius: 4px;
		border: solid 2px #2a3147;
		background: URL("icons/spells/rapid.png");
		background-size: cover;
		-webkit-filter: grayscale(100%);
		filter: grayscale(100%);
		margin-right: 0.5em;
}
.char-spells {
		display: flex;
		width: 100%;
		align-items: flex-end;
}
.char-info-header {
		display: flex;
		width: 50%;
		color: white;
		font-weight: bold;
		flex-direction: column;
		align-content: flex-start;
}
.char-info-body {
		width: 50%;
		flex-direction: row;
		display: flex;
		border-top: none;
				justify-content: flex-end;
}
.chest-area {
		z-index: 500;
		width: 100%;
		height: 40%;
		border-radius: 50%;
		background: #00d4b8c7;
		box-shadow: 0px 0px 20px 5px #1259daa6;
		position: relative;
}
.chest {
		position: absolute;
		background-image: URL("chest.png");
		width: 120%;
		height: 140%;
		background-size: cover;
		left: -10%;
		bottom: -13%;
}
.chest-area:hover {
	animation: shake 1s infinite;
}
@keyframes shake {
	0% {
		transform: rotate(0deg);
	}
	50% {
		transform: rotate(3deg);
	}
	60% {
		transform: rotate(4deg);
	}
	70% {
		transform: rotate(1deg);
	}
	100% {
		transform: rotate(0deg);
	}
}
.chest-area {
		width: 100%;
		height: 40%;
		border-radius: 50%;
		background: #00d4b8c7;
		position: relative;
		animation: glow 2s infinite;
}
@keyframes glow {
	0% {
		box-shadow: 0px 0px 20px 4px #5ee0c3a6;
	}
	25% {
		box-shadow: 0px 0px 20px 9px #48d1d28c;
	}
	50% {
		box-shadow: 0px 0px 20px 3px #48d2a0a6;
	}
	75% {
		box-shadow: 0px 0px 20px 9px #48d1d28c;
	}
	100% {
		box-shadow: 0px 0px 20px 4px #5ee0c3a6;
	}
}
span.text-green {
		color: #8dfd8d;
}
span.text-orange {
		color: #ffc56c;
}
.char-stat {
		font-size: 0.8em;
		line-height: 1.8;
}
.char-info {
		width: 80%;
		z-index: 2;
		display: flex;
		flex-direction: row;
				text-shadow: 1px 1px black;
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
.special-attack {
		position: absolute;
		z-index: 400;
		background: #00000054;
		width: 100%;
		height: 100%;
		display: none;
}
/*.character-face {
		position: absolute;
		width: 120%;
		height: 30%;
		left: -10%;
		top: 30%;
		background-image: url("heroes/luna.jpg");
		background-repeat: no-repeat;
		background-size: cover;
		border-top: solid 3px black;
		border-bottom: solid 3px black;
		background-position-y: 20%;
		transform: rotate(5deg);
}*/
.menu-icon {
		height: 100%;
		width: 100%;
		margin-right: 4px;
}
.inactive-tab {
		box-shadow: inset 0px 2px #63564e;
		border-bottom: solid 1px #382e28;
		background: #483f39;
}
.glow {color: #fff;/* -webkit-animation: glow2 1s ease-in-out infinite alternate; */-moz-animation: glow2 1s ease-in-out infinite alternate;animation: glow2 1s ease-in-out infinite alternate;}

@-webkit-keyframes glow2 {
	from {
		text-shadow: 0 0 5px #ffffff, 0 0 20px #fff, 0 0 10px #dc41a8, 0 0 40px #ffd113, 0 0 50px #f7f22a, 0 0 60px #fdaa2f, 0 0 20px #f6ff39;
	}
	
	to {
		text-shadow: 0 0 10px #fff, 0 0 30px #ff00ab, 0 0 20px #ffc12f, 0 0 50px #ffa725, 0 0 60px #c3b529, 0 0 70px #bdcc12, 0 0 20px #ffec00;
	}
}
.inventory-slot:after {
		position: absolute;
		width: 100%;
		height: 100%;
		content: ' ';
		background: URL("item-border.png");
		background-size: cover;
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
.small-text {
		font-size: 1.2rem !important;
		margin-top: -1em;
}
.level-text {
		display: flex;
		font-size: 2em;
		justify-content: center;
		align-items: center;
		width: 100%;
		text-shadow: 2px 2px black;
}
.current-level {
		flex-direction: column;
		display: flex;
		position: absolute;
		justify-content: inherit;
		align-items: center;
		top: -5%;
		left: -4%;
		width: 33%;
		background-size: cover;
		background-repeat: no-repeat;
		background-image: URL("menubadge.png");
		height: 150%;
}
.level-area {
		padding: 2.5%;
		padding-bottom: 3%;
		padding-left: 25%;
		z-index: 99;
		height: 100%;
		display: flex;
		width: 80%;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		font-size: 1em;
		color: white;
		background: #5d5149;
		box-shadow: inset -2px -3px black;
		border-bottom-right-radius: 8px;
		border-bottom-right-radius: 8px;
}
/*blue*/
.blue { 
		margin-top: 4px;
		height: 80%;
		text-shadow: -1px -1px 0 #3a94d4;
		background: #008ec7;
		background-image: radial-gradient(ellipse at top, #13f3ff, #00a8ffbd);
		border-radius: 2px;
		border: solid 2px #2b2522;
		box-shadow: inset 2px 2px 0px 1px rgba(106, 219, 230, 0.36863), inset -2px -2px 1px 1px rgba(39, 60, 62, 0.74118);
}
.blue:hover {
		background-image: radial-gradient(ellipse at top, #aafbff, rgba(61, 179, 241, 0.74118));
		box-shadow: inset 2px 2px 0px 1px rgba(106, 219, 230, 0.36863), inset -2px -2px 1px 1px rgba(39, 60, 62, 0.74118), 0px 0 13px 5px rgba(86, 181, 195, 0.27);
}
.bonus {
	color: aqua;
}
.gold-coin-small {
		height: 1em;
		width: 1em;
		background-image: URL("coin.svg");
		background-size: contain;
		margin-right: 0.25em;
}
.push_button {
		position: relative;
		border-radius: 1em !important;
		width: 8em;
		padding-left: 1em;
		padding-right: 1em;
		color: #FFF;
		text-decoration: none;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		font-weight: 600;
}
.sm-btn-margin {
		margin-left: 1em;
		margin-right: 1em;
}
.purple {
		margin-top: 4px;
		height: 80%;
		text-shadow: -1px -1px 0 #3a1d2d;
		background: #46243d;
		background-image: radial-gradient(ellipse at top, #ff52f2, rgba(233, 38, 243, 0.74118));
		border-radius: 2px;
		border: solid 2px #2b2522;
		box-shadow: inset 2px 2px 0px 1px rgba(243, 163, 218, 0.36863), inset -2px -2px 1px 1px rgba(37, 17, 35, 0.74118);
}
.push_button:hover {
	color: white !important;
}

.purple:hover {
		background-image: radial-gradient(ellipse at top, #e487dd, rgba(235, 115, 241, 0.74118));
		box-shadow: inset 2px 2px 0px 1px rgba(243, 163, 218, 0.36863), inset -2px -2px 1px 1px rgba(37, 17, 35, 0.74118), 0 0 9px 3px rgba(242, 73, 233, 0.32);
}
.push_button:active {

}
.push_button:active:before{

}
.blue:active {

}
.purple-glow {
    animation: purpleGlow 2s infinite ease-in;
}
@keyframes purpleGlow {
	0%{

		box-shadow: inset 2px 2px 0px 1px rgba(243, 163, 218, 0.36863), inset -2px -2px 1px 1px rgba(37, 17, 35, 0.74118), 0 0 0px 1px #cac527;
	}
	25%{
		box-shadow: inset 2px 2px 0px 1px rgba(243, 163, 218, 0.36863), inset -2px -2px 1px 1px rgba(37, 17, 35, 0.74118), 0 0 1px 2px #cac527;
	}
	50%{
		box-shadow: inset 2px 2px 0px 1px rgba(243, 163, 218, 0.36863), inset -2px -2px 1px 1px rgba(37, 17, 35, 0.74118), 0 0 0px 0px #cac527;
	}
	75%{
		box-shadow: inset 2px 2px 0px 1px rgba(243, 163, 218, 0.36863), inset -2px -2px 1px 1px rgba(37, 17, 35, 0.74118), 0 0 1px 2px #cac527;
	}
	100%{
		box-shadow: inset 2px 2px 0px 1px rgba(243, 163, 218, 0.36863), inset -2px -2px 1px 1px rgba(37, 17, 35, 0.74118), 0 0 0px 1px #cac527;
	}
}
.equipment-area {
		display: flex;
		flex-direction: column;
		background: radial-gradient(ellipse at center, rgba(99,85,75,1) 0%, rgba(63,56,48,1) 100%);
		border-bottom: solid 1px black;
		box-shadow: inset 0px -1px 0 0px #6b6158, 0 1px 11px 0px #0000009e;
		z-index: 1;
}
@media only screen and (max-width: 800px) {
	body {
		background-color: lightblue;
		overscroll-behavior: none;
	}
	.game-area {
		width: 100%;
		height: 100%;
		min-width: 100%;
		min-height: 100vh;
		display: flex;
/*    flex-wrap: wrap;
		flex-direction: column-reverse;*/
 /*   background-size: 300%;*/
		background-position: top right;
	}
.left, .right {
		width: 50%;
		min-width: 50%;
		height: 100vh;
		min-height: 100vh;
}
.left-panel-content {
		height: 79%;
		width: 100%;
		margin-left: 0;
		border-radius: 8px;
}
.char-name {
		text-shadow: 2px 2px black;
		width: 6em;
		align-items: center;
		display: flex;
		justify-content: flex-end;
		font-size: 1.5em;
		margin-right: 0.5em;
		color: #efefef;
}
.char-spells {
		display: flex;
		width: 100%;
		align-items: flex-end;
}
.char-portrait {
		width: 100%;
		height: 100%;
		background-size: cover;
		background-position: center;
		border-radius: 0;
}
/*.character-left {
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		color: white;
		overflow: hidden;
}*/
.character-left {
		height: 100%;
		display: flex;
		align-items: center;
		flex-direction: column;
		color: white;
		overflow: hidden;
		width: 6em;
}
.monster-status {
		margin-top: 45%;
}
.loot-area {
		top: 77%;
		position: absolute;
		right: 2.5%;
		width: 20%;
		height: 30%;
}
	.login-screen {
		width: 100%;
		height: 100vh;
		min-width: 100%;
		min-height: 100vh;
		background: grey;
		position: relative;
		overflow: hidden;
		background-image: URL('loadingbg.jpg');
		background-size: cover;
		justify-content: center;
		align-items: center;
		display: flex;
		-moz-user-select: none;
		-khtml-user-select: none;
		-webkit-user-select: none;
}
.skills-area {
		z-index: 200;
		justify-content: center;
		width: 100%;
		display: flex;
		height: 15%;
		align-items: flex-end;
		display: none;
}
.stats-area {
		width: 100%;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
}
.game-logo {
		width: 100%;
		height: 50%;
		background-image: URL('logo.png');
		background-repeat: no-repeat;
		background-position: center;
		background-size: contain;
		margin-bottom: 1em;
}
.left-panel-content {
		height: 75%;
		width: 95%;
		margin-left: 0;
		border-radius: 8px;
}
}

</style>
