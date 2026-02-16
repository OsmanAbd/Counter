const increaseButton = document.getElementById("increment");
const decreaseButton = document.getElementById("decrement");
const resetButton = document.getElementById("reset");
const counterDisplay = document.getElementById("counter");
let counter = 0;
counterDisplay.textContent = counter;
updateCounterColor()
function increment() {
    counter++;
    counterDisplay.textContent = counter;
    updateCounterColor()
}
function decrement() {
    counter--;
    counterDisplay.textContent = counter;
    updateCounterColor()
}
function reset() {
    counter = 0;
    counterDisplay.textContent = counter;
    updateCounterColor()
}   
increaseButton.addEventListener("click", increment);
decreaseButton.addEventListener("click", decrement);
resetButton.addEventListener("click", reset);
function updateCounterColor() {
if (counter > 0) {
    counterDisplay.style.color = "green";
}
else if (counter < 0) {
    counterDisplay.style.color = "red";
}
else {
    counterDisplay.style.color = "grey";
}
}
