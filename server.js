const express = require("express");

const app = express();
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

	newDrink.id = nextMenuId;
	nextMenuId += 1;

	menu.push(newDrink);

	response.status(201).json(newDrink);
});

app.delete("/api/menu/:id", function (request, respone) {
	const id = Number(request.params.id);

	const drinkIndex = menu.findIndex(function (drink) {
		return drink.id === id;
	});

	if (drinkIndex === -1) {
		return respone.status(404).json({
			error: "Drink not found."
		});
	}

	const deletedDrink = menu.splice(drinkIndex, 1)[0];

	respone.json(deletedDrink);
});


app.listen(port, function () {
	console.log(`Server running at http://localhost:${port}`);
});
