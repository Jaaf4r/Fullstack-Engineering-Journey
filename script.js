let isOpen = true;

const statusText = document.querySelector(".status");
console.log(statusText);

const statusButton = document.querySelector("#status-button");

const clickCountText = document.querySelector("#click-count");
let clickCount = 0;

function updateCafeStatus() {
	clickCount += 1;
	clickCountText.textContent = `Status checks: ${clickCount}`;

	isOpen = !isOpen;

	if (isOpen) {
		statusText.textContent = "Yes — we are open until 8 PM!";
		statusText.classList.remove("closed");
		statusText.classList.add("open");
	} else {
		statusText.textContent = "Sorry — we are closed!";
		statusText.classList.remove("open");
		statusText.classList.add("closed");
	}
}

statusButton.addEventListener("click", updateCafeStatus);

function displayDrinks(drinks, list) {
	for (const drink of drinks) {
		const listItem = document.createElement("li");
		listItem.textContent = drink;
		list.append(listItem);
	}
}

function addNewStuff(newInput, stuff, stuffList) {
	const newStuff = newInput.value.trim();

	if (newStuff) {
		stuff.push(newStuff);
		// localStorage.setItem("lastStuff", newStuff);

		const listItem = document.createElement("li");
		listItem.textContent = newStuff;
		stuffList.append(listItem);

		newInput.value = "";
	}
}

// const savedLastStuff = localStorage.getItem("lastStuff");

const hotDrinks = ["Espresso", "Macchiato", "Chocolate coffee"];
hotDrinks.push("Cappuccino");
// if (savedLastStuff) {
// 	hotDrinks.push(savedLastStuff);
// }
const hotDrinksList = document.querySelector("#hot-drinks-list");

displayDrinks(hotDrinks, hotDrinksList);

const coldDrinks = ["Iced Coffee", "Iced Tea", "Matcha Tea"];
const coldDrinksList = document.querySelector("#cold-drinks-list");

displayDrinks(coldDrinks, coldDrinksList);

const desserts = ["Chocolate Cake", "Pecan Cheesecake", "Amaretto Cheesecake"];
const dessertsList = document.querySelector("#desserts-list");

displayDrinks(desserts, dessertsList);


const newHotDrinkInput = document.querySelector("#new-hot-drink");
const addHotDrinkButton = document.querySelector("#add-hot-drink-button");

addHotDrinkButton.addEventListener("click", function () {
	addNewStuff(newHotDrinkInput, hotDrinks, hotDrinksList);
});

const newColdDrinkInput = document.querySelector("#new-cold-drink")
const addColdDrinkButton = document.querySelector("#add-cold-drink-button");

addColdDrinkButton.addEventListener("click", function () {
	addNewStuff(newColdDrinkInput, coldDrinks, coldDrinksList);
});

const newDessertInput = document.querySelector("#new-dessert")
const addDessertButton = document.querySelector("#add-dessert-button");

addDessertButton.addEventListener("click", function () {
	addNewStuff(newDessertInput, desserts, dessertsList);
});

function removeStuff(stuff, stuffList) {
	if (stuff.length > 0) {
		stuff.pop();
		stuffList.lastElementChild.remove();
	}
}

const removeHotDrinksButton = document.querySelector("#remove-hot-drink-button");
removeHotDrinksButton.addEventListener("click", function () {
	removeStuff(hotDrinks, hotDrinksList);
});


const removeColdDrinksButton = document.querySelector("#remove-cold-drink-button");
removeColdDrinksButton.addEventListener("click", function () {
	removeStuff(coldDrinks, coldDrinksList);
});

const removeDessertButton = document.querySelector("#remove-dessert-button");
removeDessertButton.addEventListener("click", function () {
	removeStuff(desserts, dessertsList);
});