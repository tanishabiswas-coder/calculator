const display = document.getElementById('display');
let currentInput = '';
let previousInput = '';
let operator = null;
let shouldResetDisplay = false;

// Get all number buttons
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        handleNumberInput(button.dataset.number);
    });
});

// Get all operator buttons
document.querySelectorAll('[data-operator]').forEach(button => {
    button.addEventListener('click', () => {
        handleOperator(button.dataset.operator);
    });
});

// Get action buttons
document.querySelector('[data-action="clear"]').addEventListener('click', clearCalculator);
document.querySelector('[data-action="delete"]').addEventListener('click', deleteLastCharacter);
document.querySelector('[data-action="equals"]').addEventListener('click', calculateResult);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') handleNumberInput(e.key);
    if (e.key === '.') handleNumberInput('.');
    if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        e.preventDefault();
        handleOperator(e.key);
    }
    if (e.key === 'Enter') calculateResult();
    if (e.key === 'Backspace') deleteLastCharacter();
    if (e.key === 'Escape') clearCalculator();
});

function handleNumberInput(num) {
    // Prevent multiple decimal points
    if (num === '.' && currentInput.includes('.')) return;
    
    if (shouldResetDisplay) {
        currentInput = num;
        shouldResetDisplay = false;
    } else {
        currentInput += num;
    }
    updateDisplay();
}

function handleOperator(op) {
    if (currentInput === '') return;
    
    if (previousInput !== '' && operator !== null && !shouldResetDisplay) {
        calculateResult();
    }
    
    previousInput = currentInput;
    operator = op;
    shouldResetDisplay = true;
    updateDisplay();
}

function calculateResult() {
    if (previousInput === '' || currentInput === '' || operator === null) return;
    
    let result;
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero!');
                clearCalculator();
                return;
            }
            result = prev / current;
            break;
        default:
            return;
    }
    
    // Round to avoid floating point errors
    result = Math.round(result * 100000000) / 100000000;
    
    currentInput = result.toString();
    previousInput = '';
    operator = null;
    shouldResetDisplay = true;
    updateDisplay();
}

function clearCalculator() {
    currentInput = '';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

function deleteLastCharacter() {
    currentInput = currentInput.toString().slice(0, -1);
    updateDisplay();
}

function updateDisplay() {
    display.value = currentInput || '0';
}
