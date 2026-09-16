let isOpen = true;

const statusText = document.querySelector(".status");

console.log(statusText);


const statusButton = document.querySelector("#status-button");

const clickCountText = document.querySelector("#click-count");
let clickCount = 0;

function updateCafeStatus() {
	clickCount += 1;
	clickCountText.textContent = `Status check: ${clickCount}`;

	if (isOpen) {
		statusText.textContent = "Yes — we are open until 8 PM!";
	} else {
		statusText.textContent = "Sorry — we are closed!";
	}

	isOpen = !isOpen;
}

statusButton.addEventListener("click", updateCafeStatus);


const hotDrinks = ["Espresso", "Macchiato", "Chocolate coffee"];

console.log(hotDrinks);