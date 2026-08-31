const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const offset = {
	x: -1265,
	y: -2710
}

const collisionsMap = []
for (let i = 0; i < collisions.length; i+= 70) {
	collisionsMap.push(collisions.slice(i, 70 + i))
}

const boundaries = []

collisionsMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 1281)
		boundaries.push(
			new Boundary({
				position: {
					x: j * Boundary.width + offset.x,
					y: i * Boundary.height + offset.y
				}
			})
		)
	})
})

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i+= 70) {
	battleZonesMap.push(battleZonesData.slice(i, 70 + i))
}

const battleZones = []

battleZonesMap.forEach((row, i) => {
	row.forEach((symbol, j) => {
		if (symbol === 1281)
		battleZones.push(
			new Boundary({
				position: {
					x: j * Boundary.width + offset.x,
					y: i * Boundary.height + offset.y
				}
			})
		)
	})
})

const treasureZonesMap = []
for (let i = 0; i < treasureZoneData.length; i += 70) {
  treasureZonesMap.push(treasureZoneData.slice(i, 70 + i))
}

function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const randomizedTreasures = shuffleArray(treasureItems)

const treasureZones = []
let treasureIndex = 0

treasureZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1281) {
    	const itemData = randomizedTreasures[treasureIndex] 

      treasureZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y
          },
          title: itemData.title,
          image: itemData.image
        })
      )
      treasureIndex++
    }
  })
})


const image = new Image()
image.src = './img/town.png'

const foregroundImage = new Image()
foregroundImage.src = './img/foregroundObjects.png'

const playerImage = new Image()
playerImage.src = './img/walkDown.png'

const playerUpImage = new Image()
playerUpImage.src = './img/walkUp.png'

const playerLeftImage = new Image()
playerLeftImage.src = './img/walkLeft.png'

const playerRightImage = new Image()
playerRightImage.src = './img/walkRight.png'

const playerDownImage = new Image()
playerDownImage.src = './img/walkDown.png'

const playerIdleDownImage = new Image()
playerIdleDownImage.src = './img/IdleDown.png'

const playerIdleUpImage = new Image()
playerIdleUpImage.src = './img/IdleUp.png'

const playerIdleLeftImage = new Image()
playerIdleLeftImage.src = './img/IdleLeft.png'

const playerIdleRightImage = new Image()
playerIdleRightImage.src = './img/IdleRight.png'


const player = new Sprite({
	position: {
		x: canvas.width / 2 - 480 / 4 / 2,
		y: canvas.height / 2 - 120 / 2
	},
	image: playerDownImage,
	frames : {
		max: 4
	},
	idleHold: 13,
	walkHold: 10,
	sprites: {
		up: playerUpImage,
		left: playerLeftImage,
		right: playerRightImage,
		down: playerDownImage,
		idleDown: playerIdleDownImage,
    	idleUp: playerIdleUpImage,
    	idleLeft: playerIdleLeftImage,
    	idleRight: playerIdleRightImage
	}
})

const background = new Sprite({
	position: {
		x: offset.x,
		y: offset.y
	},
	image: image
})

const foreground = new Sprite({
	position: {
		x: offset.x,
		y: offset.y
	},
	image: foregroundImage
})

const keys ={
	w: {
		pressed: false
	},
	a: {
		pressed: false
	},
	s: {
		pressed: false
	},
	d: {
		pressed: false
	}
}

const movables = [background, ...boundaries, foreground, ...battleZones, ...treasureZones]

function getplayerHitbox() {
	const hitboxWidth = 120 * 0.6
	const hitboxHeight = 120 * 0.3

	return {
		position: {
			x: player.position.x + (player.width - hitboxWidth) / 2,
			y: player.position.y + player.height - hitboxHeight
		},
		width: hitboxWidth,
		height: hitboxHeight
	}
}

function rectangularCollision({ rectangle1, rectangle2 }) {
	return (
		rectangle1.position.x + rectangle1.width > rectangle2.position.x && 
		rectangle1.position.x < rectangle2.position.x + rectangle2.width &&
		rectangle1.position.y < rectangle2.position.y + rectangle2.height &&
		rectangle1.position.y + rectangle1.height > rectangle2.position.y
	)
}
	//return (
	//	rectangle1.position.x + rectangle1.width >= rectangle2.position.x && 
	//	rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
	//	rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
	//	rectangle1.position.y + rectangle1.height >= rectangle2.position.y
	//)
//}

let lastKey = 's'
const battle = {
	initiated: false
}

let isModalOpen = false

function openBioResult(imagePath, titleText = 'Treasure #1') {
  const modal = document.querySelector('#bioModal')
  const modalImg = document.querySelector('#bioModalImg')
  const modalTitle = document.querySelector('#bioModalTitle')

  modalImg.src = imagePath
  modalTitle.innerText = titleText
  modal.style.display = 'flex'
  isModalOpen = true
}

document.querySelector('#bioModal').addEventListener('click', () => {
  document.querySelector('#bioModal').style.display = 'none'
  isModalOpen = false
})

window.addEventListener('click', (e) => {
  if (isModalOpen || battle.initiated) return

  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  for (let i = 0; i < treasureZones.length; i++) {
    const treasureZone = treasureZones[i]

    if (
      mouseX >= treasureZone.position.x &&
      mouseX <= treasureZone.position.x + Boundary.width &&
      mouseY >= treasureZone.position.y &&
      mouseY <= treasureZone.position.y + Boundary.height
    ) {
      openBioResult(treasureZone.image, treasureZone.title)
      break
    }
  }
})



function animate() {
	const animationId = window.requestAnimationFrame(animate)
	background.draw()
	boundaries.forEach((boundary) => {
		boundary.draw()
	})

	battleZones.forEach(battleZone => {
		battleZone.draw()
	})

	treasureZones.forEach((treasureZone) => treasureZone.draw())

	player.draw()
	foreground.draw()

	if (isModalOpen || battle.initiated) return

	const playerHitbox = getplayerHitbox()
	c.fillStyle = 'rgba(255, 0, 0, 0)'
	c.fillRect(
		playerHitbox.position.x, 
		playerHitbox.position.y,
		playerHitbox.width,
		playerHitbox.height)

	let moving = true
	player.moving = false

	//if (battle.initiated) return

	// ตรวจจับการเดินชนกล่องสมบัติ
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < treasureZones.length; i++) {
      const treasureZone = treasureZones[i]
      if (
        rectangularCollision({
          rectangle1: playerHitbox,
          rectangle2: treasureZone
        })
      ) {
        // ใส่ Path ไฟล์รูปภาพและหัวข้อที่ต้องการ
        openBioResult('./img/microscopic.png')
        break
      }
    }
  }

	//activate a battle
	if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
		for (let i = 0; i < battleZones.length; i++) {
			const battleZone = battleZones[i]
			const overlappingArea = 
				(Math.min(
					playerHitbox.position.x + playerHitbox.width, battleZone.position.x + battleZone.width) -
					Math.max(playerHitbox.position.x, battleZone.position.x)) *
				(Math.min(
					playerHitbox.position.y + playerHitbox.height, battleZone.position.y + battleZone.height) -
					Math.max(playerHitbox.position.y, battleZone.position.y))

			if (
				rectangularCollision({
					//rectangle1: player,
					rectangle1: playerHitbox,
					rectangle2: battleZone
				}) &&
				overlappingArea > playerHitbox.width * playerHitbox.height / 2
				&& Math.random() < 0.035
			) 	{

				// deactivate a new animation loop
				window.cancelAnimationFrame(animationId)

				audio.Map.stop()
				audio.initBattle.play()
				audio.battle.play()
				
				battle.initiated = true
				gsap.to('#overlappingDiv', {
					opacity: 1,
					repeat: 3,
					yoyo: true,
					duration: 0.9,
					onComplete() {
						gsap.to('#overlappingDiv', {
							opacity: 1,
							duration: 0.9,
							onComplete() {
								// activate a new animation loop
								initBattle()
								animateBattle()
								gsap.to('#overlappingDiv', {
									opacity: 0,
									duration: 0.9,
								})
							}
						})

					}
				})
				break
			}
		}
	}

	if (keys.w.pressed && lastKey === 'w') {
		player.moving = true
		player.image = player.sprites.up

		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (
				rectangularCollision({
					//rectangle1: player,
					rectangle1: playerHitbox,
					rectangle2: {
						...boundary, 
						position:{
							x: boundary.position.x,
							y: boundary.position.y + 3
						}
					}
				})
			) 	{
			moving = false
				break
			}
		}

		if (moving)
		movables.forEach((movable) => {
			movable.position.y += 3
		})
	}	else if (keys.a.pressed && lastKey === 'a') {
		player.moving = true
		player.image = player.sprites.left
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (
				rectangularCollision({
					//rectangle1: player,
					rectangle1: playerHitbox,
					rectangle2: {
						...boundary, 
						position:{
							x: boundary.position.x + 3,
							y: boundary.position.y
						}
					}
				})
			) 	{
			moving = false
				break
			}
		}

		if (moving)
		movables.forEach((movable) => {
			movable.position.x += 3
		})
	}	else if (keys.s.pressed && lastKey === 's') {
		player.moving = true
		player.image = player.sprites.down
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (
				rectangularCollision({
					//rectangle1: player,
					rectangle1: playerHitbox,
					rectangle2: {
						...boundary, 
						position:{
							x: boundary.position.x,
							y: boundary.position.y - 3
						}
					}
				})
			) 	{
			moving = false
				break
			}
		}

		if (moving)
		movables.forEach((movable) => {
			movable.position.y -= 3
		})
	}	else if (keys.d.pressed && lastKey === 'd') {
		player.moving = true
		player.image = player.sprites.right
		for (let i = 0; i < boundaries.length; i++) {
			const boundary = boundaries[i]
			if (
				rectangularCollision({
					//rectangle1: player,
					rectangle1: playerHitbox,
					rectangle2: {
						...boundary, 
						position:{
							x: boundary.position.x - 3,
							y: boundary.position.y
						}
					}
				})
			) 	{
			moving = false
				break
			}
		}


		if (moving){
		movables.forEach((movable) => {
			movable.position.x -= 3
		})

	} 

	}
	else {
		if (lastKey === 'w') player.image = player.sprites.idleUp
		else if (lastKey === 'a') player.image = player.sprites.idleLeft
		else if (lastKey === 'd') player.image = player.sprites.idleRight
		else player.image = player.sprites.idleDown
	}
}
//animate ()

window.addEventListener('click', () => {
	
})

window.addEventListener('keydown', (e) => {
	const upperKey = e.key.toLowerCase()
	switch (upperKey) {
	case 'w':
		keys.w.pressed = true
		lastKey = 'w'
		break
	case 'a':
		keys.a.pressed = true
		lastKey = 'a'
		break

	case 's':
		keys.s.pressed = true
		lastKey = 's'
		break

	case 'd':
		keys.d.pressed = true
		lastKey = 'd'
		break
	}
})

window.addEventListener('keyup', (e) => {
	const upperKey = e.key.toLowerCase()
	switch (upperKey) {
	case 'w':
		keys.w.pressed = false
		break
	case 'a':
		keys.a.pressed = false
		break
	case 's':
		keys.s.pressed = false
		break
	case 'd':
		keys.d.pressed = false
		break
	}
})

let clicked = false
addEventListener('click', () => {
	if(!clicked)
	audio.Map.play()
	clicked = true
})