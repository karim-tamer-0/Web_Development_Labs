// ---------- DOM selection ----------
const screen = document.querySelector("#screen");
const history = document.querySelector("#history");
const keypad = document.querySelector(".keypad");

// ---------- Calculator state ----------
let current = "0";
let previous = null;
let operator = null;
let resetScreen = false;
let justCalculated = false;

// ---------- Display ----------
function updateDisplay() {
    screen.textContent = current;

    // Highlight the selected operator.
    document.querySelectorAll("[data-op]").forEach(button => {
        const active = button.dataset.op === operator && !resetScreen;
        button.classList.toggle("active", active);
    });
}

function formatNumber(number) {
    if (!Number.isFinite(number)) {
        throw new Error("Invalid calculation");
    }

    // Avoid floating-point artifacts and excessively long results.
    return String(Number(number.toPrecision(12)));
}

// ---------- Number input ----------
function inputNumber(value) {
    if (current === "Error" || resetScreen || justCalculated) {
        current = value === "00" ? "0" : value;
        resetScreen = false;
        justCalculated = false;
        updateDisplay();
        return;
    }

    if (current.replace("-", "").length >= 15) return;

    if (value === "00") {
        current = current === "0" ? "0" : current + "00";
    } else {
        current = current === "0" ? value : current + value;
    }

    updateDisplay();
}

function inputDecimal() {
    if (current === "Error" || resetScreen || justCalculated) {
        current = "0.";
        resetScreen = false;
        justCalculated = false;
    } else if (!current.includes(".")) {
        current += ".";
    }

    updateDisplay();
}

// ---------- Math logic ----------
function calculate(a, b, op) {
    switch (op) {
        case "+": return a + b;
        case "-": return a - b;
        case "*": return a * b;
        case "/": return b === 0 ? NaN : a / b;
        default: return b;
    }
}

function chooseOperator(nextOperator) {
    if (current === "Error") return;

    const value = Number(current);

    if (operator && !resetScreen) {
        const result = calculate(previous, value, operator);

        if (!Number.isFinite(result)) {
            showError();
            return;
        }

        current = formatNumber(result);
    }

    previous = Number(current);
    operator = nextOperator;
    resetScreen = true;
    justCalculated = false;
    history.textContent = `${current} ${nextOperator}`;
    updateDisplay();
}

function equals() {
    if (operator === null || resetScreen || current === "Error") return;

    const a = previous;
    const b = Number(current);
    const op = operator;

    const result = calculate(a, b, op);

    if (!Number.isFinite(result)) {
        showError();
        return;
    }

    history.textContent = `${a} ${op} ${b} =`;
    current = formatNumber(result);
    previous = null;
    operator = null;
    resetScreen = true;
    justCalculated = true;

    updateDisplay();
}

// ---------- Special operations ----------
function clearCalculator() {
    current = "0";
    previous = null;
    operator = null;
    resetScreen = false;
    justCalculated = false;
    history.textContent = "";
    updateDisplay();
}

function toggleSign() {
    if (current === "Error" || current === "0") return;

    current = current.startsWith("-")
        ? current.slice(1)
        : "-" + current;

    updateDisplay();
}

function percentage() {
    if (current === "Error") return;

    current = formatNumber(Number(current) / 100);
    resetScreen = false;
    justCalculated = false;
    updateDisplay();
}

function showError() {
    current = "Error";
    previous = null;
    operator = null;
    resetScreen = true;
    justCalculated = false;
    history.textContent = "Cannot divide by zero";
    updateDisplay();
}

// ---------- Event handling ----------
keypad.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button || !keypad.contains(button)) return;

    if (button.dataset.number !== undefined) {
        inputNumber(button.dataset.number);
        return;
    }

    if (button.dataset.op) {
        chooseOperator(button.dataset.op);
        return;
    }

    switch (button.dataset.action) {
        case "clear":
            clearCalculator();
            break;
        case "sign":
            toggleSign();
            break;
        case "percent":
            percentage();
            break;
        case "decimal":
            inputDecimal();
            break;
        case "equals":
            equals();
            break;
    }
});

// Initialize the display.
updateDisplay();