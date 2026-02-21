// 1. Store the current expression as a string
let expression = '';

// 2. Detect whether a character is an operator
function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

// 3. Tokenize the expression string into an array of numbers and operator strings
//    Handles unary minus at the start of the expression or after another operator
//    e.g. "-5+3" → [-5, '+', 3]   and   "4*-2" → [4, '*', -2]
function tokenize(expr) {
    const tokens = [];
    let numBuffer = '';

    for (let i = 0; i < expr.length; i++) {
        const char = expr[i];

        if (char === '-' && (i === 0 || isOperator(expr[i - 1]))) {
            // Unary minus: treat as part of the upcoming number
            numBuffer += char;
        } else if (isOperator(char)) {
            if (numBuffer !== '') {
                tokens.push(Number(numBuffer));
                numBuffer = '';
            }
            tokens.push(char);
        } else {
            numBuffer += char;
        }
    }

    if (numBuffer !== '') {
        tokens.push(Number(numBuffer));
    }

    return tokens;
}

// 4. Evaluate a flat token array, respecting operator precedence (* / before + -)
//    5. Division by zero is caught before it happens
function evaluateTokens(tokens) {
    // First pass: resolve * and /
    let i = 1;
    while (i < tokens.length) {
        if (tokens[i] === '*' || tokens[i] === '/') {
            const left = tokens[i - 1];
            const right = tokens[i + 1];

            // 5. Prevent division by zero
            if (tokens[i] === '/' && right === 0) {
                throw new Error('Division by zero');
            }

            const result = tokens[i] === '*' ? left * right : left / right;
            tokens.splice(i - 1, 3, result);
            // Do not advance i — the array shrank by 2, so the next operator
            // is now at the same index i.
        } else {
            i += 2;
        }
    }

    // Second pass: resolve + and -
    let result = tokens[0];
    for (let j = 1; j < tokens.length; j += 2) {
        const op = tokens[j];
        const operand = tokens[j + 1];
        if (op === '+') result += operand;
        else if (op === '-') result -= operand;
    }

    return result;
}

// Validate that the expression ends with a number (not an operator)
function isValidExpression(expr) {
    if (!expr) return false;
    return !isOperator(expr[expr.length - 1]);
}

// 6. Clean structure: each UI action is its own focused function

function appendToExpression(value) {
    const lastChar = expression[expression.length - 1];

    // Replace the previous operator when the user presses another operator
    // (but allow '-' right after an operator to start a negative number)
    if (isOperator(value) && value !== '-' && isOperator(lastChar)) {
        expression = expression.slice(0, -1);
    }

    // Prevent multiple decimal points within the same number segment
    if (value === '.') {
        // Scan backwards to find the start of the current number segment
        let j = expression.length - 1;
        while (j >= 0 && !isOperator(expression[j])) { j--; }
        const currentNum = expression.slice(j + 1);
        if (currentNum.includes('.')) return;
    }

    expression += value;
    document.getElementById('expression').textContent = expression;
    document.getElementById('result').textContent = '';
}

function deleteLast() {
    expression = expression.slice(0, -1);
    document.getElementById('expression').textContent = expression || '0';
    document.getElementById('result').textContent = '';
}

function clearExpression() {
    expression = '';
    document.getElementById('expression').textContent = '0';
    document.getElementById('result').textContent = '';
}

// Toggle the sign of the last number in the expression
function toggleSign() {
    if (!expression) return;

    // Find the start of the last number segment (scan back past the last operator)
    let i = expression.length - 1;
    while (i >= 0 && !isOperator(expression[i])) {
        i--;
    }
    const numStart = i + 1;
    const lastNum = expression.slice(numStart);
    if (!lastNum) return;

    expression = lastNum.startsWith('-')
        ? expression.slice(0, numStart) + lastNum.slice(1)
        : expression.slice(0, numStart) + '-' + lastNum;

    document.getElementById('expression').textContent = expression;
    document.getElementById('result').textContent = '';
}

function calculate() {
    if (!isValidExpression(expression)) {
        document.getElementById('result').textContent = 'Invalid input';
        return;
    }

    try {
        const tokens = tokenize(expression);
        const raw = evaluateTokens(tokens);

        // Keep integers exact; round decimals to avoid floating-point noise
        const formatted = Number.isInteger(raw) ? raw : parseFloat(raw.toFixed(10));
        document.getElementById('result').textContent = '= ' + formatted;
    } catch (error) {
        document.getElementById('result').textContent = error.message;
    }
}
