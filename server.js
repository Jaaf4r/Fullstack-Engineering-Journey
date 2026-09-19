const express = require("express");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const database = new DatabaseSync("data/vinland-cafe.db");

database.exec(`
	CREATE TABLE IF NOT EXISTS menu_items (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	price REAL NOT NULL CHECK (price > 0)
	)
`);

const menuItemCount = database
	.prepare("SELECT COUNT(*) AS count FROM menu_items")
	.get();

if (menuItemCount.count === 0) {
	const insertMenuItem = database.prepare(`
		INSERT INTO menu_items (name, price)
		VALUES (?, ?)
	`);

	insertMenuItem.run("Espresso", 2.5);
	insertMenuItem.run("Macchiato", 3.5);
	insertMenuItem.run("Cappuccino", 4);
}
// console.log(menuItemCount);

const savedMenuItems = database
	.prepare("SELECT id, name, price FROM menu_items ORDER BY id")
	.all();

console.log(savedMenuItems);

app.use(express.json());
app.use(express.static("public/"));
const port = 3000;

const menu = [
	{ id: 1, name: "Espresso", price: 2.5 },
	{ id: 2, name: "Macchiato", price: 3 },
	{ id: 3, name: "Cappuccino", price: 4 }
];

let nextMenuId = 4;

// app.get("/", function (request, response) {
// 	response.send("Vinland Cafe server is running!");
// });

app.get("/api/menu", function (request, response) {
	const menuItems = database
		.prepare("SELECT id, name, price FROM menu_items ORDER BY id")
		.all();

	response.status(200).json(menu);
});

app.post("/api/menu", function (request, response) {
	const newDrink = request.body;

	if (!newDrink.name) {
		return response.status(400).json({
			error: "A drink name is required."
		});
	}

	if (
		typeof newDrink.price !== "number" ||
		newDrink.price <= 0
	) {
		return response.status(400).json({
			error: "A positive numeric price is required."
		})
	}

	const insertMenuItem = database(`
		INSERT INTO menu_items (name, price)
		VALUES (?, ?)
	`);

	const result = insertMenuItem.run(
		newDrink.name,
		newDrink.price
	);

	const createdDrink = database
		.prepare("SELECT id, name, price FROM menu_items WHERE id = ?")
		.get(Number(result.lastInsertRowid));

	response.status(201).json(createdDrink);
});

app.delete("/api/menu/:id", function (request, response) {
	const id = Number(request.params.id);

	const drinkIndex = menu.findIndex(function (drink) {
		return drink.id === id;
	});

	if (drinkIndex === -1) {
		return response.status(404).json({
			error: "Drink not found."
		});
	}

	const deletedDrink = menu.splice(drinkIndex, 1)[0];

	response.json(deletedDrink);
});

app.patch("/api/menu/:id", function (request, response) {
	const id = Number(request.params.id);

	const drink = menu.find(function (item) {
		return item.id === id;
	});

	if (!drink) {
		return response.status(404).json({
			error: "Drink not found."
		});
	}

	const newPrice = request.body.price;

	if (typeof newPrice !== "number" || newPrice <= 0) {
		return response.status(400).json({
			error: "A positive numeric price is required."
		});
	}

	drink.price = newPrice;

	response.json(drink);
});

app.listen(port, function () {
	console.log(`Server running at http://localhost:${port}`);
});
