const questions = [
  {
    text: '1. What is the bacterial morphology under the microscope?',
    correct: 'Bacilli'
  },
  {
    text: '2. What is the appearance of a lactose-fermenting bacterium on MacConkey agar?<br><br>(Positive: Lactose fermentation)<br>(Negative: Non-Lactose fermentation)',
    correct: 'Positive'
  },
  {
    text: '3. Is the oxidase test positive or negative?',
    correct: 'Negative'
  },
  {
    text: '4. What is the TSI test result?<br><br>(Positive: A/A, Gas (+), H2S (-))<br>(Negative: K/K, Gas (+), H2S (-))',
    correct: 'Positive'
  },
  {
    text: '5. ...the Indole test?',
    correct: 'Positive'
  },
  {
    text: '6. ...Methyl Red (MR) test test?',
    correct: 'Positive'
  },
  {
    text: '7. ...Voges-Proskauer....test?',
    correct: 'Negative'
  },
  {
    text: '8. Citrate utilization test...?',
    correct: 'Negative'
  },
  {
    text: '9. ........Urease........test....?',
    correct: 'Negative'
  },
  {
    text: '10. ...The last question....<br>Gram-positive or Gram-negative?',
    correct: 'Negative'
  },
]

let currentQuestionIndex = 0

function showNextQuestion() {
  const dialogueBox = document.querySelector('#dialogueBox')
  dialogueBox.style.display = 'block'
  dialogueBox.innerHTML = questions[currentQuestionIndex].text
}
