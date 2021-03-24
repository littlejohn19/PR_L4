let preQuestions = null;

let nextBtn = document.querySelector('.next');
let prevBtn = document.querySelector('.previous');

let quizEl = document.querySelector('.list');
let questionEl = document.querySelector('.question');
let questionNumberEl = document.querySelector('.question-number');
let answersEls = document.querySelectorAll('.list-group-item');
let userScorePoint = document.querySelector('.score');
let resultTableEl = document.querySelector('.result-table');

let resultsEl = document.querySelector('.results');
let pointsEl = document.querySelector('.score');
let restartBtn = document.querySelector('.restart');
let index = 0;
let points = 0;

let history = JSON.parse(localStorage.getItem('history') || JSON.stringify([]))
let areAnswersBlocked = false;

fetch('https://quiztai.herokuapp.com/api/quiz')
	.then(resp => resp.json())
	.then(resp => {
		preQuestions = resp;
		preQuestions.map(item => {
			item.selected_answer = null;
		});
		showQuestion();
	});

const markCorrect = answer => {
	answer.classList.add('correct');
}

const markInCorrect = answer => {
	answer.classList.add('incorrect');
}

const disableAnswers = () => {
	areAnswersBlocked = true;
}

for (let i = 0; i < answersEls.length; i++) {
	answersEls[i].addEventListener('click', e => {
		let isAnswered = preQuestions[index].selected_answer !== null;
		if (areAnswersBlocked || isAnswered) {
			e.preventDefault()
			return;
		}

		if (e.target.innerHTML === preQuestions[index].correct_answer) {
			points++;
			pointsEl.innerText = points;
			markCorrect(e.target);
		} else {
			markInCorrect(e.target);
		}
		preQuestions[index].selected_answer = e.target.innerHTML;
		disableAnswers();
	});
}

nextBtn.addEventListener('click', e => {
	if (index === preQuestions.length - 1) {
		finish();
	} else if (index < preQuestions.length) {
		index++;
		showQuestion();
	}
});

prevBtn.addEventListener('click', e => {
	if (index > 0) {
		index--;
		showQuestion();
	}
});

restartBtn.addEventListener('click', e => {
	e.preventDefault();

	index = 0;
	points = 0;
	userScorePoint.innerHTML = points;

	quizEl.style.display = 'block';
	resultsEl.style.display = 'none';

	preQuestions.map(item => {
		item.selected_answer = null;
	});

	showQuestion();
});

const finish = () => {
	quizEl.style.display = 'none';
	resultsEl.style.display = 'block';

	history.push(points);

	localStorage.setItem('history', JSON.stringify(history));

	let sum = history.reduce((a, b) => a + b, 0);
	let avg = (sum / history.length) || 0;

	resultTableEl.innerHTML = '';
	history.map((points, key) => {
		resultTableEl.innerHTML += `<tr>
                <th scope="row">${key + 1}</th>
                <td class="userScorePoint">${points}</td>
                <td class="average">${parseFloat(avg).toFixed(2)}</td>
            </tr>`
	});
}

const clearAnswers = () => {
	for (let i = 0; i < answersEls.length; i++) {
		answersEls[i].innerHTML = '';
		answersEls[i].style.display = 'none';
		answersEls[i].classList.remove('correct');
		answersEls[i].classList.remove('incorrect');
	}
}

const showAnswers = () => {
	clearAnswers();
	areAnswersBlocked = false;

	for (let i = 0; i < preQuestions[index].answers.length; i++) {
		answersEls[i].innerHTML = preQuestions[index].answers[i];
		answersEls[i].style.display = 'block';

		if (preQuestions[index].answers[i] === preQuestions[index].selected_answer) {
			if (preQuestions[index].selected_answer === preQuestions[index].correct_answer) {
				answersEls[i].classList.add('correct');
			} else {
				answersEls[i].classList.add('incorrect');
			}
		}
	}
}

const showQuestion = () => {
	questionEl.innerHTML = preQuestions[index].question;
	questionNumberEl.innerHTML = index + 1;
	showAnswers();
}
