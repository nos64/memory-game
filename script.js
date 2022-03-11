'use strict'

let dif = ''; //Урочень сложности
let namePlayer = ''; //Имя игрока

/**Обработка стартовой формы */
const nameInput = document.querySelector('.name');
const loadModal = document.querySelector('.load-modal')
const nameField = document.querySelector('.name-field');
const nameEnterBtn = document.querySelector('.name-enter-btn');
const difficulty = document.querySelector('.difficulty');
const loadModalRadio = document.querySelectorAll('.load-modal__radio');
const results = document.querySelector('.results');

nameEnterBtn.addEventListener('click', (e)=> {
  e.preventDefault()

  loadModal.classList.add('load-modal__overlay-open');
  results.classList.add('results-active');
  loadModalRadio.forEach(radio => {
    if (radio.checked) {
      difficulty.textContent = radio.value;
      dif = radio.value;
      createCard(difficulty.textContent);
    } 
  });
  nameInput.value !== '' 
    ? nameField.textContent = nameInput.value 
    : nameField.textContent = 'Stranger';
    namePlayer = nameField.textContent
    timer(seconds, minutes);
    return dif, namePlayer;
});

/**Reset Game */
const resetBtn = document.querySelector('.reset-button');
const resetWindow = document.querySelector('.reset-window');
const restartYesBtn = document.querySelector('.restart-window__yes-btn');
const restartCancelBtn = document.querySelector('.restart-window__cancel-btn');

resetBtn.addEventListener('click', () => {
  resetWindow.classList.add('reset-window-active');
});

restartYesBtn.addEventListener('click', () => {
  window.location.reload();
});

restartCancelBtn.addEventListener('click', () => {
  resetWindow.classList.remove('reset-window-active');
});

/**Timer */
const modalTimeResult = document.querySelector('.modal__time-result');
const timeCounter = document.querySelector(".timer-counter");

let time;
let minutes = 0;
let seconds = 0;
let seconds_str = '';
let minutes_str = '';
let timeStart = false;
let gameTime;
  
function timer(seconds, minutes) {
  time = setInterval(() => {
    seconds > 58 ? ((minutes += 1), (seconds = 0)) : (seconds += 1);
    seconds_str = seconds > 9 ? `${seconds}` : `0${seconds}`;
    minutes_str = minutes > 9 ? `${minutes}` : `0${minutes}`;
    timeCounter.textContent = `${minutes_str} min : ${seconds_str} sec`;
    modalTimeResult.textContent = `${minutes_str} min : ${seconds_str} sec`;
    gameTime = `${minutes_str} min : ${seconds_str} sec`;
  }, 1000);
}

function stopTime() {
  clearInterval(time);
}

/**Вывод карт на игровое поле */
const memoryGameEasy = document.querySelector('.memory-game1');
const memoryGameMedium = document.querySelector('.memory-game2');
const memoryGameHard = document.querySelector('.memory-game3');

function createCard(difficult) {
  if (difficult === 'easy') {
    memoryGameEasy.classList.add('memory-game-active');
    memoryGameMedium.style.display = 'none';
    memoryGameHard.style.display = 'none';
  } else if (difficult === 'medium') {
    memoryGameMedium.classList.add('memory-game-active');
    memoryGameEasy.style.display = 'none';
    memoryGameHard.style.display = 'none';
  } else if (difficult === 'hard') {
    memoryGameHard.classList.add('memory-game-active');
    memoryGameEasy.style.display = 'none';
    memoryGameMedium.style.display = 'none';
  }
};

/**Перемешивание карт */
const memoryCard = document.querySelectorAll('.memory-card');

function shuffle() {
  memoryCard.forEach(card => {
    let randomPos = Math.floor(Math.random() * 44);
    card.style.order = randomPos; //Присваиваем order картам в случайном порядке
  });
};

shuffle()

/**Изменение счетчика */
const modalMovesCounter = document.querySelector('.modal__moves-counter');
const movesCount = document.querySelector('.moves-counter');

let moves = 0;

function movesCounter() {
  moves = Math.floor((moves+1));
	movesCount.textContent = moves;
  modalMovesCounter.textContent = moves;
};

let hasFlipedCard = false; //Переменная отслеживает переворот карты (если не перевернута = true)
let firstCard;
let secondCard;
let lockBoard = false; //Переменная блокировки доски (после нажатя на вторую карту = true)

/**Переворот карты */
function flipCard(e) {
  
  if (lockBoard) return;
  if (e.target === firstCard) return;
  e.target.classList.add('flip');
  if (!hasFlipedCard) {
    hasFlipedCard = true;
    firstCard = e.target;
    return;
  }
  secondCard = e.target;
  checkForMatch();
}

/**Проверка совпадения перевернутых карт по дата атрибуту */
let counterMatch = 0; //Счетчик совпадений

function checkForMatch() {
  movesCounter();
  if (firstCard.dataset.hero === secondCard.dataset.hero) {
    counterMatch++;
    disableCards() //Если дата артибуты совпадают блокируем карты (убираем обработчик событий)
  }
  else unflipCards(); //Или переворачиваем карты рубашкой вверх
  if (dif === 'easy' && counterMatch === 12) endGame();
  else if (dif === 'medium' && counterMatch === 16) endGame();
  else if (dif === 'hard' && counterMatch === 22) endGame();
}

/**Удаление обработчика событий с открытых карт с одинаковым дата атрибутом */
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard(); //Сбрасываем переменные в дефолт
}

/**Переворот карты через 1 секунду */
function unflipCards() {
  lockBoard = true; //Блокируем доску, чтобы исключить клик по третьей и последующим картам

  setTimeout(() => {
    firstCard.classList.remove('flip'); //Убираем класс у первой карты
    secondCard.classList.remove('flip'); // Убираем класс у второй карты
    resetBoard(); //Сбрасываем переменные в дефолт через 1 секунду
  }, 1000)
};

/**Сброс переменных  hasFlipedCard, lockBoard, firstCard, secondCard  в дефолт после каждого раунда*/
function resetBoard() {
  [hasFlipedCard, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
};

/**Переворот карты (слушатель на игровое поле) */ 
const area = document.querySelector('.area');

area.addEventListener('click', (e) => {
  if (e.target.closest('.memory-card')) {
    flipCard(e)
  }
});

/**Финальное модальное окно */
const finalModal = document.querySelector('.final-modal');
const modalRestartButton = document.querySelector('.modal__restart-button');
const modalCloseButton = document.querySelector('.modal__close-button');

modalCloseButton.addEventListener('click', () => {
  finalModal.classList.remove('final-modal-active')
});

modalRestartButton.addEventListener('click', () => {
  window.location.reload()
});

function endGame() {
  stopTime()
  finalModal.classList.add('final-modal-active');
  modalTimeResult.textContent = timeCounter.textContent;
  modalMovesCounter.textContent = moves;
  fillResultsTable();
  saveInStorage ();
};

/**Сохранение результатов 10 последних игр */
function saveInStorage () {
  const resultsArray = []; //Массив для сохранения результатов
  const values = document.querySelectorAll('li');
  for (let i = 0; i < values.length; i++) {
    resultsArray.push(values[i].innerHTML);
    if (resultsArray.length > 10) {
      resultsArray.shift(values[i].innerHTML);
    }
  }
  localStorage.setItem('results', JSON.stringify(resultsArray));
};

/**Таблица результатов */
const resultsButton = document.querySelector('.open-results');
const resultsModal = document.querySelector('.results-modal');
const resultsCloseButton = document.querySelector('.results__close-button')
const resultsList = document.querySelector('.results__list');

resultsButton.addEventListener('click', () => {
  resultsModal.classList.add('results-modal-active')
});

resultsCloseButton.addEventListener('click',() => {
  resultsModal.classList.remove('results-modal-active');
});

area.addEventListener('click', (e) => {
  if (e.target !== resultsModal) resultsModal.classList.remove('results-modal-active');
})

/**Получение результатов последних 10 игр */
function getFromStorage() {
  const result = JSON.parse(localStorage.getItem('results')) || [];

  for (let i = 0; i < result.length; i++) {
    const li = document.createElement('li');
    li.innerHTML = result[i];

    resultsList.append(li);
  }
}

/**Заполнение таблицы с результатми игр */
function fillResultsTable() {
  const li = document.createElement('li');
  li.className = 'results__item';

  li.innerHTML = `
    <span class="results__name">Name: 
      <span class="results__name-value">${namePlayer}</span>
    </span>
    <span class="results__difficult">Difficult: 
      <span class="results__difficult-value">${dif}</span>
    </span>
    <span class="results__moves">Moves: 
      <span class="results__moves-value">${moves}</span>
    </span>
    <span class="results__time">Moves: 
      <span class="results__time-value">${gameTime}</span>
    </span>

  `;
  resultsList.append(li);
};

window.addEventListener('load', getFromStorage); //Получение результатов 10 последних игр во время загрузки страницы




