// -----------------------------------------------------------------
// STATUS CHECK
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
// MENU STATE
// -----------------------------------------------------------------

let hotDrinks = [];
let coldDrinks = [];
let desserts = [];

let selectedHotDrinkId = null;
let selectedColdDrinkId = null;
let selectedDessertId = null;

const hotDrinksList = document.querySelector("#hot-drinks-list");
const coldDrinksList = document.querySelector("#cold-drinks-list");
const dessertsList = document.querySelector("#desserts-list");

const newHotDrinkInput = document.querySelector("#new-hot-drink");
const newHotDrinkPriceInput = document.querySelector("#new-hot-drink-price");
const addHotDrinkButton = document.querySelector("#add-hot-drink-button");
const updateHotDrinkPriceInput = document.querySelector("#update-hot-drink-price");
const updateHotDrinkButton = document.querySelector("#update-hot-drink-button");
const hotDrinkMessage = document.querySelector("#hot-drink-message");

const newColdDrinkInput = document.querySelector("#new-cold-drink");
const newColdDrinkPriceInput = document.querySelector("#new-cold-drink-price");
const addColdDrinkButton = document.querySelector("#add-cold-drink-button");
const updateColdDrinkPriceInput = document.querySelector("#update-cold-drink-price");
const updateColdDrinkButton = document.querySelector("#update-cold-drink-button");
const coldDrinkMessage = document.querySelector("#cold-drink-message");

const newDessertInput = document.querySelector("#new-dessert");
const newDessertPriceInput = document.querySelector("#new-dessert-price");
const addDessertButton = document.querySelector("#add-dessert-button");
const updateDessertPriceInput = document.querySelector("#update-dessert-price");
const updateDessertButton = document.querySelector("#update-dessert-button");
const dessertMessage = document.querySelector("#dessert-message");

// -----------------------------------------------------------------
// API AND DISPLAY HELPERS
// -----------------------------------------------------------------

function requestMenuApi(url, options, fallbackMessage) {
	return fetch(url, options)
		.then(async function (response) {
			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || fallbackMessage);
			}

			return data;
		});
}

function renderMenuItems(items, list, onEdit, onDelete) {
	list.replaceChildren();

	for (const item of items) {
		const listItem = document.createElement("li");
		listItem.textContent =
			`${item.name} — $${item.price.toFixed(2)}`;

		const editButton = document.createElement("button");
		editButton.type = "button";
		editButton.textContent = "Edit price";
		editButton.setAttribute("aria-label", `Edit the price of ${item.name}`);
		editButton.addEventListener("click", function () {
			onEdit(item);
		});

		const deleteButton = document.createElement("button");
		deleteButton.type = "button";
		deleteButton.textContent = "Delete";
		deleteButton.setAttribute("aria-label", `Delete ${item.name}`);
		deleteButton.addEventListener("click", function () {
			onDelete(item.id);
		});

		listItem.append(" ", editButton, " ", deleteButton);
		list.append(listItem);
	}
}

function renderHotDrinks() {
	renderMenuItems(hotDrinks, hotDrinksList, selectHotDrink, removeHotDrink);
}

function renderColdDrinks() {
	renderMenuItems(coldDrinks, coldDrinksList, selectColdDrink, removeColdDrink);
}

function renderDesserts() {
	renderMenuItems(desserts, dessertsList, selectDessert, removeDessert);
}

function addMenuItem(category, nameInput, priceInput, items, render, messageElement) {
	const name = nameInput.value.trim();
	const price = Number(priceInput.value);

	if (!name || !Number.isFinite(price) || price <= 0) {
		messageElement.textContent =
			"Enter a name and a price greater than 0.";
		return;
	}

	requestMenuApi(
		"/api/menu",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ name: name, price: price, category: category })
		},
		"The server could not add the item."
	)
		.then(function (createdItem) {
			items.push(createdItem);
			render();

			nameInput.value = "";
			priceInput.value = "";
			messageElement.textContent =
				`${createdItem.name} was added successfully.`;
		})
		.catch(function (error) {
			console.error(error);
			messageElement.textContent = error.message;
		});
}

function updateMenuItem(
	selectedId,
	priceInput,
	items,
	render,
	messageElement,
	noSelectionMessage,
	clearSelection
) {
	const price = Number(priceInput.value);

	if (selectedId === null) {
		messageElement.textContent = noSelectionMessage;
		return;
	}

	if (!Number.isFinite(price) || price <= 0) {
		messageElement.textContent = "Enter a new price greater than 0.";
		return;
	}

	requestMenuApi(
		`/api/menu/${selectedId}`,
		{
			method: "PATCH",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ price: price })
		},
		"The server could not update the price."
	)
		.then(function (updatedItem) {
			const itemIndex = items.findIndex(function (item) {
				return item.id === updatedItem.id;
			});

			if (itemIndex !== -1) {
				items[itemIndex] = updatedItem;
			}

			clearSelection();
			render();
			messageElement.textContent =
				`${updatedItem.name} now costs $${updatedItem.price.toFixed(2)}.`;
		})
		.catch(function (error) {
			console.error(error);
			messageElement.textContent = error.message;
		});
}

function deleteMenuItem(
	id,
	items,
	render,
	messageElement,
	clearSelectionIfDeleted
) {
	if (!Number.isInteger(id) || id < 1) {
		messageElement.textContent = "Could not identify the item to delete.";
		return;
	}

	requestMenuApi(
		`/api/menu/${id}`,
		{ method: "DELETE" },
		"The server could not remove the item."
	)
		.then(function (deletedItem) {
			const itemIndex = items.findIndex(function (item) {
				return item.id === deletedItem.id;
			});

			if (itemIndex !== -1) {
				items.splice(itemIndex, 1);
			}

			clearSelectionIfDeleted(deletedItem.id);
			render();
			messageElement.textContent =
				`${deletedItem.name} was removed successfully.`;
		})
		.catch(function (error) {
			console.error(error);
			messageElement.textContent = error.message;
		});
}

// -----------------------------------------------------------------
// HOT DRINKS
// -----------------------------------------------------------------

function selectHotDrink(drink) {
	selectedHotDrinkId = drink.id;
	updateHotDrinkPriceInput.value = drink.price;
	updateHotDrinkPriceInput.focus();
	hotDrinkMessage.textContent =
		`Editing ${drink.name}. Enter a new price.`;
}

function clearHotSelection() {
	selectedHotDrinkId = null;
	updateHotDrinkPriceInput.value = "";
}

function clearHotSelectionIfDeleted(id) {
	if (selectedHotDrinkId === id) {
		clearHotSelection();
	}
}

function removeHotDrink(id) {
	deleteMenuItem(
		id,
		hotDrinks,
		renderHotDrinks,
		hotDrinkMessage,
		clearHotSelectionIfDeleted
	);
}

addHotDrinkButton.addEventListener("click", function () {
	addMenuItem(
		"hot",
		newHotDrinkInput,
		newHotDrinkPriceInput,
		hotDrinks,
		renderHotDrinks,
		hotDrinkMessage
	);
});

updateHotDrinkButton.addEventListener("click", function () {
	updateMenuItem(
		selectedHotDrinkId,
		updateHotDrinkPriceInput,
		hotDrinks,
		renderHotDrinks,
		hotDrinkMessage,
		"Choose a drink's Edit price button first.",
		clearHotSelection
	);
});

// -----------------------------------------------------------------
// COLD DRINKS
// -----------------------------------------------------------------

function selectColdDrink(drink) {
	selectedColdDrinkId = drink.id;
	updateColdDrinkPriceInput.value = drink.price;
	updateColdDrinkPriceInput.focus();
	coldDrinkMessage.textContent =
		`Editing ${drink.name}. Enter a new price.`;
}

function clearColdSelection() {
	selectedColdDrinkId = null;
	updateColdDrinkPriceInput.value = "";
}

function clearColdSelectionIfDeleted(id) {
	if (selectedColdDrinkId === id) {
		clearColdSelection();
	}
}

function removeColdDrink(id) {
	deleteMenuItem(
		id,
		coldDrinks,
		renderColdDrinks,
		coldDrinkMessage,
		clearColdSelectionIfDeleted
	);
}

addColdDrinkButton.addEventListener("click", function () {
	addMenuItem(
		"cold",
		newColdDrinkInput,
		newColdDrinkPriceInput,
		coldDrinks,
		renderColdDrinks,
		coldDrinkMessage
	);
});

updateColdDrinkButton.addEventListener("click", function () {
	updateMenuItem(
		selectedColdDrinkId,
		updateColdDrinkPriceInput,
		coldDrinks,
		renderColdDrinks,
		coldDrinkMessage,
		"Choose a cold drink's Edit price button first.",
		clearColdSelection
	);
});

// -----------------------------------------------------------------
// DESSERTS
// -----------------------------------------------------------------

function selectDessert(dessert) {
	selectedDessertId = dessert.id;
	updateDessertPriceInput.value = dessert.price;
	updateDessertPriceInput.focus();
	dessertMessage.textContent =
		`Editing ${dessert.name}. Enter a new price.`;
}

function clearDessertSelection() {
	selectedDessertId = null;
	updateDessertPriceInput.value = "";
}

function clearDessertSelectionIfDeleted(id) {
	if (selectedDessertId === id) {
		clearDessertSelection();
	}
}

function removeDessert(id) {
	deleteMenuItem(
		id,
		desserts,
		renderDesserts,
		dessertMessage,
		clearDessertSelectionIfDeleted
	);
}

addDessertButton.addEventListener("click", function () {
	addMenuItem(
		"dessert",
		newDessertInput,
		newDessertPriceInput,
		desserts,
		renderDesserts,
		dessertMessage
	);
});

updateDessertButton.addEventListener("click", function () {
	updateMenuItem(
		selectedDessertId,
		updateDessertPriceInput,
		desserts,
		renderDesserts,
		dessertMessage,
		"Choose a dessert's Edit price button first.",
		clearDessertSelection
	);
});

// -----------------------------------------------------------------
// INITIAL MENU LOAD
// -----------------------------------------------------------------

requestMenuApi("/api/menu", undefined, "The server could not load the menu.")
	.then(function (menu) {
		hotDrinks = menu.filter(function (item) {
			return item.category === "hot";
		});

		coldDrinks = menu.filter(function (item) {
			return item.category === "cold";
		});

		desserts = menu.filter(function (item) {
			return item.category === "dessert";
		});

		renderHotDrinks();
		renderColdDrinks();
		renderDesserts();
	})
	.catch(function (error) {
		console.error(error);
		hotDrinkMessage.textContent = error.message;
		coldDrinkMessage.textContent = error.message;
		dessertMessage.textContent = error.message;
	});
