class Sprite {
	constructor({ 
		position, 
		velocity, 
		image, 
		frames = {max : 1}, 
		sprites = {},
		animate = true,
		idleHold = 13,
		walkHold = 10,
		randomStart = false,
		rotation = 0,
	}) {
		this.position = position
		this.velocity = velocity

		if (image instanceof Image) {
			this.image = image
		} else {
			this.image = new Image()
			this.image.src = image.src
		}

		this.frames = {max: 1, ...frames, val: 0, elapsed: 0}

		this.width = 0
    	this.height = 0

		this.image.onload = () => {
			this.width = this.image.width / this.frames.max
			this.height = this.image.height
		}

		this.idleHold = idleHold
    	this.walkHold = walkHold
    	this.animate = animate
		this.moving = false
		this.sprites = sprites
		this.opacity = 1
		this.rotation = rotation

		if (randomStart && this.frames.max > 1) {
      		this.frames.val = Math.floor(Math.random() * this.frames.max)
      		this.frames.elapsed = Math.floor(Math.random() * this.idleHold)
    	}

	}

	draw() {
		if (!this.image || !this.image.complete || this.image.naturalWidth === 0) return

		const frameWidth = this.width || (this.image.width / this.frames.max)
		const frameHeight = this.height || this.image.height

    	c.save()
		c.translate(
			this.position.x + frameWidth / 2, 
			this.position.y + frameHeight / 2
		)
		c.rotate(this.rotation)
		c.translate(
			-frameWidth / 2, 
			-frameHeight / 2
		)

		c.globalAlpha = this.opacity

		c.drawImage(
			this.image,
			this.frames.val * frameWidth,
			0,
			this.image.width / this.frames.max,
			this.image.height,
			0,
			0,
			frameWidth,
			frameHeight
	 	)
	 	c.restore()

	 	if (this.frames.max <= 1 || (this.animate !== undefined && !this.animate)) return

  		this.frames.elapsed++

	 	const currentHold = this.moving ? this.walkHold : this.idleHold

	 	if (this.frames.elapsed >= currentHold) {
			if (this.frames.val < this.frames.max - 1) this.frames.val++
			else this.frames.val = 0
			this.frames.elapsed = 0
		}
	}

}

class Monster extends Sprite {
	constructor ({ 
		position, 
		velocity, 
		image, 
		frames = {max : 1}, 
		sprites = {},
		animate = true,
		idleHold = 13,
		walkHold = 10,
		randomStart = false,
		rotation = 0,
		isEnemy = false,
		name,
		attacks
	}) {
		super({
			position, 
			velocity, 
			image, 
			frames, 
			sprites,
			animate ,
			idleHold,
			walkHold,
			randomStart,
			rotation
		})
		this.health = 100
		this.isEnemy = isEnemy
		this.name = name
		this.attacks = attacks
	}

	faint() {
		document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted! '
		gsap.to(this.position, {
			y: this.position.y + 20
		})
		gsap.to(this, {
			opacity: 0
		})
		audio.battle.stop()
		audio.victory.play()
	}
	attack ({ attack, recipient, renderedSprites }) {
		document.querySelector('#dialogueBox').style.display = 'block'
		document.querySelector('#dialogueBox').innerHTML = this.name + ' choosed ' + attack.name

		let healthBar = '#enemyHealthBar'
		if (this.isEnemy) healthBar = '#playerHealthBar'

		let rotation = 1
		if (this.isEnemy) rotation = -2.2

		recipient.health = Math.max(0, recipient.health - attack.damage)

		switch (attack.name) {
			case 'Positive' :
				audio.initFireball.play()
				const fireballImage = new Image()
				fireballImage.src = './img/fireball.png'
				const fireball = new Sprite({
					position: {
						x: this.position.x,
						y: this.position.y
					},
					image: fireballImage,
					frames: {
						max: 4,
						idleHold: 10
					},
					animate: true,
					rotation: rotation
				})

				renderedSprites.splice (1, 0, fireball)

				gsap.to(fireball.position, {
					x: recipient.position.x,
					y: recipient.position.y,
					onComplete: () => {
						//Enemy actually gets hit
						audio.fireballHit.play()
						gsap.to(healthBar, {
							//width: this.health + '%'
							width: recipient.health + '%'
						})
						gsap.to(recipient.position, {
							x: recipient.position.x + 10,
							yoyo: true,
							repeat: 5,
							duration: 0.08
						})

						gsap.to(recipient, {
							opacity: 0,
							repeat: 5,
							yoyo: true,
							duration: 0.08
						})
						renderedSprites.splice(1, 1)
					}
				})

				break

			case 'Cocci':
			case 'Bonk':
			case 'Bacilli':

				const tl = gsap.timeline ()

				let movementDistance = 20
				if(this.isEnemy) movementDistance = -20

				tl.to(this.position, {
					x: this.position.x - movementDistance
				}).to(this.position, {
					x: this.position.x + movementDistance * 2,
					duration: 0.1,
					onComplete:() => {
						//Enemy actually gets hit
						audio.tackleHit.play()
						gsap.to(healthBar, {
							//width: this.health + '%'
							width: recipient.health + '%'
						})
						gsap.to(recipient.position, {
							x: recipient.position.x + 10,
							yoyo: true,
							repeat: 5,
							duration: 0.08
						})

						gsap.to(recipient, {
							opacity: 0,
							repeat: 5,
							yoyo: true,
							duration: 0.08
						})
					}
				}).to(this.position, {
					x: this.position.x
				})

				break
			
			case 'Negative':
				audio.initFireball.play()
				const fireballNegativeImage = new Image()
				fireballNegativeImage.src = './img/fireball.png'
				const fireballNegative = new Sprite({
					position: {
						x: this.position.x,
						y: this.position.y
					},
					image: fireballNegativeImage,
					frames: {
						max: 4,
						idleHold: 10
					},
					animate: true,
					rotation: rotation
				})

				renderedSprites.splice(1, 0, fireballNegative)

				gsap.to(fireballNegative.position, {
					x: recipient.position.x,
					y: recipient.position.y,
					onComplete: () => {
						// Enemy actually gets hit
						audio.fireballHit.play()
						gsap.to(healthBar, {
							width: recipient.health + '%'
						})
						gsap.to(recipient.position, {
							x: recipient.position.x + 10,
							yoyo: true,
							repeat: 5,
							duration: 0.08
						})

						gsap.to(recipient, {
							opacity: 0,
							repeat: 5,
							yoyo: true,
							duration: 0.08
						})
						renderedSprites.splice(1, 1)
					}
				})

				break
		}
		
	}

}

class Boundary {
	static width = 96
	static height = 96

	constructor({ position, title = '', image = '' }) {
		this.position = position
		this.width = 96
		this.height = 96
		this.title = title
    	this.image = image
	}

	draw () {
		c.fillStyle = 'rgba(255, 0, 0, 0)'
		c.fillRect(this.position.x, this.position.y, this.width, this.height)
	}
}

