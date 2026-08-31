const monsters = {
	Emby: {
		position: {
			x: 280,
			y: 325
		},
		image: {
		src: './img/embySprite.png' },
		frames: {
			max: 4
		},
		idleHold: 13,
		randomStart: true,
		name: 'A Hero',
		attacks: [attacks.Cocci, attacks.Bacilli, attacks.Positive, attacks.Negative]
	},
	Draggle: {
		position: {
			x: 800,
			y: 100
		},
		image: {
		src: './img/draggleSprite.png' },
		frames: {
			max: 4
		},
		idleHold: 30,
		randomStart: true,
		isEnemy: true,
		name: 'The Molted King',
		attacks: [attacks.Bonk]
	}
}