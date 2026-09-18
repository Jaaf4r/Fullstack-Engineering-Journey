const express = require("express");

const app = express();
app.use(express.json());
const port = 3000;

const menu = [
	{ name: "Espresso", price: 2.5 },
	{ name: "Macchiato", price: 3 },
	{ name: "Cappuccino", price: 4 }
  ];

app.get("/", function (request, response) {
	response.send("Vinland Cafe server is running!");
});

app.get("/api/menu", function (request, response) {
	response.status(200).json(menu);
});

app.post("/api/menu", function (request, response) {
	const newDrink = request.body;

	menu.push(newDrink);

	response.status(201).json(newDrink);
});

app.listen(port, function () {
	console.log(`Server running at http://localhost:${port}`);
});
