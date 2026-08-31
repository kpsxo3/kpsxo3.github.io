const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battleBackground.png'
const battleBackground = new Sprite({
	position: {
		x: 0,
		y: 0
	},
	image: battleBackgroundImage
})


let draggle 
let emby 
let renderedSprites 
let battleAnimationId
let queue 

function showQuestion() {
	const currentQ = questions[currentQuestionIndex]
	const dialogueBox = document.querySelector('#dialogueBox')
	if (dialogueBox && currentQ) {
		dialogueBox.style.display = 'block'
		dialogueBox.innerHTML = currentQ.question || currentQ.text
	}
}

function initBattle () {
	document.querySelector('#userInterface').style.display = 'block'
	document.querySelector('#dialogueBox').style.display = 'block'
	document.querySelector('#enemyHealthBar').style.width = '100%'
	document.querySelector('#playerHealthBar').style.width = '100%'
	document.querySelector('#attacksBox').replaceChildren()

	draggle = new Monster(monsters.Draggle)
	emby = new Monster(monsters.Emby)
	renderedSprites = [draggle, emby]
	queue = []

	emby.attacks.forEach(attack => {
	const button = document.createElement('button')
	button.innerHTML = attack.name
	document.querySelector('#attacksBox').append(button)
	})

	showQuestion()

	//our event listerners for our buttons (attack)
	document.querySelectorAll('#attacksBox button').forEach((button) => {
	button.addEventListener('click', (e) => {
		const selectedAnswer = e.currentTarget.innerHTML.trim()
		const currentQ = questions[currentQuestionIndex]

		if (selectedAnswer === currentQ.correct) {
			const selectedAttack = attacks[selectedAnswer]
			emby.attack({
				attack: selectedAttack,
				recipient: draggle,
				renderedSprites
			})

			if (draggle.health <= 0) {
				queue.push(() => {
					draggle.faint()
				})
				queue.push(() => {
					//fade back to black
					gsap.to('#overlappingDiv', {
						opacity: 1,
						onComplete: () => {
							cancelAnimationFrame(battleAnimationId)
							animate()
							document.querySelector('#userInterface').style.display = 'none'
							gsap.to('#overlappingDiv', {
								opacity: 0
							})
							battle.initiated = false

							audio.Map.play()

							keys.w.pressed = false
							keys.a.pressed = false
							keys.s.pressed = false
							keys.d.pressed = false
							window.focus()
						}
					})
				})
				return
			}
		} else {
			draggle.attack({
				attack: attacks.Bonk,
				recipient: emby,
				renderedSprites
			})

			if (emby.health <= 0) {
				queue.push(() => {
					emby.faint()
				})
				queue.push(() => {
				//fade back to black
					gsap.to('#overlappingDiv', {
						opacity: 1,
						onComplete: () => {
							cancelAnimationFrame(battleAnimationId)
							animate()
							document.querySelector('#userInterface').style.display = 'none'
							gsap.to('#overlappingDiv', {
								opacity: 0
							})
							battle.initiated = false

							audio.Map.play()

							keys.w.pressed = false
							keys.a.pressed = false
							keys.s.pressed = false
							keys.d.pressed = false
							window.focus()
						}
					})
				})

				return
			}
		}

		currentQuestionIndex = (currentQuestionIndex + 1) % questions.length

		queue.push(() => {
				showQuestion()
			})
	})


	button.addEventListener('mouseenter', (e) => {
		const selectedAttack = attacks[e.currentTarget.innerHTML.trim()]
		if (selectedAttack) {
			document.querySelector('#attackType').innerHTML = selectedAttack.type
		}
	})
})
}

function animateBattle() {
	battleAnimationId = window.requestAnimationFrame(animateBattle)
	battleBackground.draw()

	console.log(battleAnimationId)

	renderedSprites.forEach((sprite) => {
		sprite.draw()
	})
}

//animate()
//initBattle ()
//animateBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
	if (queue.length > 0) {
		queue[0]()
		queue.shift()
	} else {
		e.currentTarget.style.display = 'none'
	}
})