const express = require("express");
const { DatabaseSync } = require("node:sqlite");

const app = express();
const database = new DatabaseSync("data/vinland-cafe.db");

database.exec(`
	CREATE TABLE IF NOT EXISTS menu_items (
	id INTEGER PRIMARY KEY,
	name TEXT NOT NULL,
	price REAL NOT NULL CHECK (price > 0),
	category TEXT NOT NULL DEFAULT 'hot'
	)
`);

const menuItemColumns = database
	.prepare("PRAGMA table_info(menu_items)")
	.all();

const categoryColumnExists = menuItemColumns.some(function (column) {
	return column.name === "category";
});

if (!categoryColumnExists) {
	database.exec(`
		ALTER TABLE menu_items
		ADD COLUMN category TEXT NOT NULL DEFAULT 'hot';
	`);
}

database
	.prepare(`
		UPDATE menu_items
		SET category = 'hot'
		WHERE category IS NULL
	`)
	.run();

database.exec(`
	CREATE UNIQUE INDEX IF NOT EXISTS unique_menu_item_name
	ON menu_items (name COLLATE NOCASE);
`);

const menuItemCount = database
	.prepare("SELECT COUNT(*) AS count FROM menu_items")
	.get();

if (menuItemCount.count === 0) {
	const insertMenuItem = database.prepare(`
		INSERT INTO menu_items (name, price, category)
		VALUES (?, ?, ?)
	`);

	insertMenuItem.run("Espresso", 2.5, 'hot');
	insertMenuItem.run("Macchiato", 3.5, 'hot');
	insertMenuItem.run("Cappuccino", 4, 'hot');
}

const savedMenuItems = database
	.prepare("SELECT id, name, price, category FROM menu_items ORDER BY id")
	.all();

console.log(savedMenuItems);

app.use(express.json());
app.use(express.static("public/"));
const port = process.env.PORT || 3000;
const allowedCategories = ["hot", "cold", "dessert"];


app.get("/api/menu", function (request, response) {
	const menuItems = database
		.prepare("SELECT id, name, price, category FROM menu_items ORDER BY id")
		.all();

	response.status(200).json(menuItems);
});

app.post("/api/menu", function (request, response) {
	const newDrink = request.body;
	const category = newDrink.category;

	if (!newDrink.name) {
		return response.status(400).json({
			message: "A drink name is required."
		});
	}

	if (
		typeof newDrink.price !== "number" ||
		newDrink.price <= 0
	) {
		return response.status(400).json({
			message: "A positive numeric price is required."
		})
	}

	const name = newDrink.name.trim();

	const existingDrink = database
		.prepare("SELECT id FROM menu_items WHERE lower(name) = lower(?)")
		.get(name);

	if (existingDrink) {
		return response.status(409).json({
			message: "A drink with that name already exists.",
		});
	}

	if (!allowedCategories.includes(category)) {
		return response.status(400).json({
			message: "Category must be hot, cold, or dessert.",
		});
	}

	const insertMenuItem = database.prepare(`
		INSERT INTO menu_items (name, price, category)
		VALUES (?, ?, ?)
	`);

	const result = insertMenuItem.run(
		name,
		newDrink.price,
		category
	);

	const createdDrink = database
		.prepare("SELECT id, name, price, category FROM menu_items WHERE id = ?")
		.get(Number(result.lastInsertRowid));

	response.status(201).json(createdDrink);
});

app.delete("/api/menu/:id", function (request, response) {
	const id = Number(request.params.id);

	const menuItem = database
		.prepare("SELECT id, name, price, category FROM menu_items WHERE id = ?")
		.get(id);

	if (!menuItem) {
		return response.status(404).json({
			message: "Drink not found.",
		});
	}

	database
		.prepare("DELETE FROM menu_items WHERE id = ?")
		.run(id);

	response.status(200).json(menuItem);
});

app.patch("/api/menu/:id", function (request, response) {
	const id = Number(request.params.id);
	const newPrice = request.body.price;

	if (typeof newPrice !== "number" || newPrice <= 0) {
		return response.status(400).json({
			message: "Price must be a positive number.",
		});
	}

	const menuItem = database
		.prepare("SELECT id, name, price, category FROM menu_items WHERE id = ?")
		.get(id);

	if (!menuItem) {
		return response.status(404).json({
			message: "Drink not found.",
		});
	}

	database
		.prepare("UPDATE menu_items SET price = ? WHERE id = ?")
		.run(newPrice, id);

	const updatedMenuItem = database
		.prepare("SELECT id, name, price, category FROM menu_items WHERE id= ?")
		.get(id);

	response.status(200).json(updatedMenuItem);
});

app.listen(port, function () {
	console.log(`Server running at http://localhost:${port}`);
});
