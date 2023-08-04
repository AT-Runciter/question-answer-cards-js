const cardsContainer = document.getElementById('cards-container');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const currentEl = document.getElementById('current');
const showBtn = document.getElementById('show');
const hideBtn = document.getElementById('hide');
const questionEl = document.getElementById('question');
const answerEl = document.getElementById('answer');
const addCardBtn = document.getElementById('add-card');
const clearBtn = document.getElementById('clear');
const addContainer = document.getElementById('add-container');

let currentActiveCard = 0;

const cardsEl = [];

const cardsData = getCardsData() || [];

function createCards() {
    cardsData.forEach((data, index) => createCard(data, index));
}

function createCard(data, index) {
    const card = document.createElement('div');
    card.classList.add('card');

    if (index === 0) {
        card.classList.add('active');
    }

    card.innerHTML = `
    <div class="inner-card">
      <div class="inner-card-front">
        <p>${data.question}</p>
      </div>
      <div class="inner-card-back">
        <p>${data.answer}</p>
      </div>
    </div>
    <button class="delete-btn" onclick="deleteCard(${index})">Delete this card</button>
  `;

    card.addEventListener('click', function () {
        card.classList.toggle('show-answer');
    });

    cardsEl.push(card);

    cardsContainer.appendChild(card);

    updateCurrentText();
}

function updateCurrentText() {
    currentEl.innerText = `${currentActiveCard + 1}/${cardsEl.length}`;
}

function getCardsData() {
    const cards = JSON.parse(localStorage.getItem('cards'));
    return cards === null ? [] : cards;
}

function setCardsData(cards) {
    localStorage.setItem('cards', JSON.stringify(cards));
    window.location.reload();
}

function deleteCard(index) {
    cardsData.splice(index, 1);
    cardsEl.splice(index, 1);

    updateCurrentText();
    setCardsData(cardsData);
}

createCards();

nextBtn.addEventListener('click', showNextCard);
prevBtn.addEventListener('click', showPrevCard);

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
        showNextCard();
    } else if (event.key === 'ArrowLeft') {
        showPrevCard();
    }
});

function showNextCard() {
    cardsEl[currentActiveCard].classList.remove('active');
    currentActiveCard = (currentActiveCard + 1) % cardsEl.length;
    cardsEl[currentActiveCard].classList.add('active');
    updateCurrentText();
}

function showPrevCard() {
    cardsEl[currentActiveCard].classList.remove('active');
    currentActiveCard = (currentActiveCard - 1 + cardsEl.length) % cardsEl.length;
    cardsEl[currentActiveCard].classList.add('active');
    updateCurrentText();
}

showBtn.addEventListener('click', function () {
    addContainer.classList.add('show');
});

hideBtn.addEventListener('click', function () {
    addContainer.classList.remove('show');
});

addCardBtn.addEventListener('click', function () {
    const question = questionEl.value.trim();
    const answer = answerEl.value.trim();

    if (question && answer) {
        const newCard = { question, answer };

        createCard(newCard, cardsData.length);
        questionEl.value = '';
        answerEl.value = '';
        addContainer.classList.remove('show');
        cardsData.push(newCard);
        setCardsData(cardsData);
    }
});

clearBtn.addEventListener('click', function () {
    localStorage.clear();
    cardsContainer.innerHTML = '';
    window.location.reload();
});
