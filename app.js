const body = document.body;
const textButtons = document.querySelectorAll("[data-text]");
const contrastToggle = document.getElementById("toggle-contrast");
const motionToggle = document.getElementById("toggle-motion");

const searchInput = document.getElementById("search-input");
const searchResults = document.getElementById("search-results");
const resultsCount = document.getElementById("results-count");

const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const todoStatus = document.getElementById("todo-status");

const guessForm = document.getElementById("guess-form");
const guessInput = document.getElementById("guess-input");
const guessStatus = document.getElementById("guess-status");
const guessReset = document.getElementById("guess-reset");

const sequenceButtons = document.querySelectorAll(".sequence-btn");
const sequenceStatus = document.getElementById("sequence-status");
const sequenceStart = document.getElementById("sequence-start");

let fontScale = 0;
const baseFont = 18;

const searchItems = [
  "Mapa accesible de la ciudad",
  "Guía de lectura fácil",
  "Atajos de teclado",
  "Biblioteca sonora",
  "Chat con intérprete de lengua de señas",
  "Calendario con recordatorios",
  "Información de transporte adaptado",
  "Directorio de apoyo emocional",
];

const todoItems = [];
let guessNumber = Math.floor(Math.random() * 20) + 1;
let guessAttempts = 0;
let sequence = [];
let playerIndex = 0;
let sequenceActive = false;

function updateFont(delta) {
  if (delta === 0) {
    fontScale = 0;
  } else {
    fontScale = Math.max(-2, Math.min(4, fontScale + delta));
  }
  const size = baseFont + fontScale * 2;
  document.documentElement.style.setProperty("--font-size", `${size}px`);
}

function toggleContrast() {
  body.classList.toggle("high-contrast", contrastToggle.checked);
}

function toggleMotion() {
  body.classList.toggle("reduce-motion", motionToggle.checked);
}

function renderSearch(filter = "") {
  const normalized = filter.trim().toLowerCase();
  const filtered = searchItems.filter((item) =>
    item.toLowerCase().includes(normalized)
  );
  searchResults.innerHTML = "";
  filtered.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.tabIndex = 0;
    searchResults.appendChild(li);
  });
  resultsCount.textContent = `Mostrando ${filtered.length} resultado${
    filtered.length === 1 ? "" : "s"
  }.`;
}

function updateTodoStatus() {
  if (todoItems.length === 0) {
    todoStatus.textContent = "No hay tareas pendientes.";
    return;
  }
  const pending = todoItems.filter((item) => !item.completed).length;
  if (pending === 0) {
    todoStatus.textContent = "Todas las tareas están completadas.";
  } else {
    todoStatus.textContent = `Tienes ${pending} tarea${
      pending === 1 ? "" : "s"
    } pendiente${pending === 1 ? "" : "s"}.`;
  }
}

function renderTodos() {
  todoList.innerHTML = "";
  todoItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = `todo-item${item.completed ? " completed" : ""}`;

    const label = document.createElement("span");
    label.textContent = item.text;

    const controls = document.createElement("div");

    const toggle = document.createElement("button");
    toggle.className = "btn";
    toggle.type = "button";
    toggle.textContent = item.completed ? "Reabrir" : "Completar";
    toggle.setAttribute(
      "aria-pressed",
      item.completed ? "true" : "false"
    );
    toggle.addEventListener("click", () => {
      todoItems[index].completed = !todoItems[index].completed;
      renderTodos();
      updateTodoStatus();
    });

    const remove = document.createElement("button");
    remove.className = "btn";
    remove.type = "button";
    remove.textContent = "Eliminar";
    remove.addEventListener("click", () => {
      todoItems.splice(index, 1);
      renderTodos();
      updateTodoStatus();
    });

    controls.append(toggle, remove);
    li.append(label, controls);
    todoList.appendChild(li);
  });
}

function evaluateGuess(value) {
  const number = Number(value);
  if (Number.isNaN(number)) {
    guessStatus.textContent = "Introduce un número válido.";
    return;
  }
  guessAttempts += 1;
  if (number === guessNumber) {
    guessStatus.textContent = `¡Correcto! Lo lograste en ${guessAttempts} intento${
      guessAttempts === 1 ? "" : "s"
    }.`;
  } else if (number < guessNumber) {
    guessStatus.textContent = "Es más alto. Intenta de nuevo.";
  } else {
    guessStatus.textContent = "Es más bajo. Intenta de nuevo.";
  }
}

function resetGuessGame() {
  guessNumber = Math.floor(Math.random() * 20) + 1;
  guessAttempts = 0;
  guessStatus.textContent = "Juego reiniciado. Escribe un número.";
  guessInput.value = "";
  guessInput.focus();
}

function playSequence() {
  sequenceActive = false;
  playerIndex = 0;
  let stepIndex = 0;
  sequenceStatus.textContent = "Observa la secuencia.";

  const interval = setInterval(() => {
    if (stepIndex >= sequence.length) {
      clearInterval(interval);
      sequenceActive = true;
      sequenceStatus.textContent = "Tu turno: repite la secuencia.";
      return;
    }
    const step = sequence[stepIndex];
    const button = document.querySelector(`[data-step="${step}"]`);
    if (button) {
      button.classList.add("primary");
      setTimeout(() => button.classList.remove("primary"), 400);
    }
    stepIndex += 1;
  }, 700);
}

function startSequenceGame() {
  sequence = [Math.ceil(Math.random() * 3)];
  sequenceStatus.textContent = "Iniciando secuencia.";
  playSequence();
}

function handleSequenceInput(step) {
  if (!sequenceActive) {
    sequenceStatus.textContent = "Primero pulsa “Iniciar”.";
    return;
  }
  if (sequence[playerIndex] === step) {
    playerIndex += 1;
    if (playerIndex === sequence.length) {
      sequenceStatus.textContent = "¡Bien hecho! Nueva ronda.";
      sequence.push(Math.ceil(Math.random() * 3));
      playSequence();
    }
  } else {
    sequenceStatus.textContent = "Secuencia incorrecta. Pulsa iniciar para intentar otra vez.";
    sequenceActive = false;
  }
}

textButtons.forEach((button) => {
  button.addEventListener("click", () => {
    updateFont(Number(button.dataset.text));
  });
});

contrastToggle.addEventListener("change", toggleContrast);
motionToggle.addEventListener("change", toggleMotion);

searchInput.addEventListener("input", (event) => {
  renderSearch(event.target.value);
});

renderSearch();

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = todoInput.value.trim();
  if (!value) return;
  todoItems.unshift({ text: value, completed: false });
  todoInput.value = "";
  renderTodos();
  updateTodoStatus();
  todoInput.focus();
});

updateTodoStatus();

guessForm.addEventListener("submit", (event) => {
  event.preventDefault();
  evaluateGuess(guessInput.value);
});

guessReset.addEventListener("click", resetGuessGame);

sequenceStart.addEventListener("click", startSequenceGame);
sequenceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleSequenceInput(Number(button.dataset.step));
  });
});

document.addEventListener("keydown", (event) => {
  if (!["1", "2", "3"].includes(event.key)) return;
  handleSequenceInput(Number(event.key));
});
