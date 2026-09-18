// -----------------------------------------------------------------
// STATUS CHECK && UPDATE
// -----------------------------------------------------------------

let isOpen = true;
const statusText = document.querySelector(".status");
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

// -----------------------------------------------------------------
// FUNCTIONS (UPDATED)
// -----------------------------------------------------------------

// function displayDrinks(drinks, list) {
// 	for (const drink of drinks) {
// 		const listItem = document.createElement("li");
// 		listItem.textContent = drink;
// 		list.append(listItem);
// 	}
// }

function displayPricedDrinks(drinks, list) {
	for (const drink of drinks) {
		const listItem = document.createElement("li");
		listItem.textContent = `${drink.name} — $${drink.price.toFixed(2)}`;
		list.append(listItem);
	}
}

// function addNewStuff(newInput, stuff, stuffList) {
// 	const newStuff = newInput.value.trim();

// 	if (newStuff) {
// 		stuff.push(newStuff);

// 		const listItem = document.createElement("li");
// 		listItem.textContent = newStuff;
// 		stuffList.append(listItem);

// 		newInput.value = "";
// 	}
// }

function addNewPricedStuff(nameInput, priceInput, items, list) {
	const name = nameInput.value.trim();
	const price = Number(priceInput.value);

	if (name && price > 0) {
		const newItem = {
			name: name,
			price: price
		};

		items.push(newItem);

		const listItem = document.createElement("li");
		listItem.textContent = `${newItem.name} — $${newItem.price.toFixed(2)}`;
		list.append(listItem);

		nameInput.value = "";
		priceInput.value = "";
	}
}


// -----------------------------------------------------------------
// OBJECT DISPLAY
// -----------------------------------------------------------------

// const hotDrinks = ["Espresso", "Macchiato", "Chocolate coffee"];
// hotDrinks.push("Cappuccino");

const hotDrinks = [
	{ name: "Espresso", price: 2.5 },
	{ name: "Macchiato", price: 3 },
	{ name: "Chocolate coffee", price: 3.5 },
	{ name: "Cappuccino", price: 4 }
];
const hotDrinksList = document.querySelector("#hot-drinks-list");
displayPricedDrinks(hotDrinks, hotDrinksList);

// const coldDrinks = ["Iced Coffee", "Iced Tea", "Matcha Tea"];
const coldDrinks = [
	{ name: "Iced Coffee", price: 2.5 },
	{ name: "Iced Tea", price: 4 },
	{ name: "Matcha Tea", price: 4.5 }
];
const coldDrinksList = document.querySelector("#cold-drinks-list");
displayPricedDrinks(coldDrinks, coldDrinksList);

// const desserts = ["Chocolate Cake", "Pecan Cheesecake", "Amaretto Cheesecake"];
const desserts = [
	{ name: "Chocolate Cake", price: 4 },
	{ name: "Pecan Cheesecake", price: 5.5 },
	{ name: "Amaretto Cheesecake", price: 6 }
];
const dessertsList = document.querySelector("#desserts-list");
displayPricedDrinks(desserts, dessertsList);


// -----------------------------------------------------------------
// OBJECT ADDITION
// -----------------------------------------------------------------

const newHotDrinkInput = document.querySelector("#new-hot-drink");
const newHotDrinkPriceInput = document.querySelector("#new-hot-drink-price");
const addHotDrinkButton = document.querySelector("#add-hot-drink-button");

addHotDrinkButton.addEventListener("click", function () {
	addNewPricedStuff(
		newHotDrinkInput,
		newHotDrinkPriceInput,
		hotDrinks,
		hotDrinksList
	);
});

const newColdDrinkInput = document.querySelector("#new-cold-drink");
const newColdDrinkPriceInput = document.querySelector("#new-cold-drink-price");
const addColdDrinkButton = document.querySelector("#add-cold-drink-button");

addColdDrinkButton.addEventListener("click", function () {
	addNewPricedStuff(
		newColdDrinkInput,
		newColdDrinkPriceInput,
		coldDrinks, 
		coldDrinksList
	);
});

const newDessertInput = document.querySelector("#new-dessert");
const newDessertPriceInput = document.querySelector("#new-dessert-price");
const addDessertButton = document.querySelector("#add-dessert-button");

addDessertButton.addEventListener("click", function () {
	addNewPricedStuff(
		newDessertInput,
		newDessertPriceInput,
		desserts,
		dessertsList
	);
});

// -----------------------------------------------------------------
// REMOVAL
// -----------------------------------------------------------------

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


// const espresso = {
// 	name: "Espresso",
// 	price: 2.5
// };

// console.log(`${espresso.name}: $${espresso.price}`);

const sampleMenu = [
	{ name: "Espresso", price: 2.5 },
	{ name: "Macchiato", price: 3 },
	{ name: "Cappuccino", price: 3.5 }
];

for (const item of sampleMenu) {
	console.log(`${item.name} : $${item.price}`);
}
