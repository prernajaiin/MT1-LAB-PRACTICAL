
const express = require('express');

const app = express();

app.use(express.json());

// Sample food records
let foods = [
    {
        id: 1,
        foodName: "Pizza",
        category: "Fast Food",
        price: 250,
        availability: true
    },
    {
        id: 2,
        foodName: "Burger",
        category: "Fast Food",
        price: 120,
        availability: true
    },
    {
        id: 3,
        foodName: "Cold Coffee",
        category: "Beverage",
        price: 100,
        availability: false
    }
];

// GET - Display all food items
app.get('/foods', (req, res) => {
    res.json(foods);
});

// GET - Display food by ID
app.get('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const food = foods.find(f => f.id === id);

    if (!food) {
        return res.status(404).json({ message: "Food not found" });
    }

    res.json(food);
});

// POST - Add new food item
app.post('/foods', (req, res) => {
    const { id, foodName, category, price, availability } = req.body;

    if (
        id === undefined ||
        !foodName ||
        !category ||
        price === undefined ||
        typeof availability !== 'boolean' ||
        typeof price !== 'number' ||
        price <= 0 ||
        !Number.isInteger(Number(id)) ||
        Number(id) <= 0
    ) {
        return res.status(400).json({ message: "Invalid or missing food details" });
    }

    if (foods.some(f => f.id === Number(id))) {
        return res.status(400).json({ message: "Food ID already exists" });
    }

    const newFood = {
        id: Number(id),
        foodName,
        category,
        price,
        availability
    };

    foods.push(newFood);

    res.status(201).json({
        message: "Food item added successfully",
        food: newFood
    });
});

// PUT - Update food item
app.put('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = foods.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Food not found" });
    }

    const updatedFood = { ...foods[index], ...req.body };

    if (
        !updatedFood.foodName ||
        !updatedFood.category ||
        typeof updatedFood.price !== 'number' ||
        updatedFood.price <= 0 ||
        typeof updatedFood.availability !== 'boolean'
    ) {
        return res.status(400).json({ message: "Invalid food details" });
    }

    updatedFood.id = id;
    foods[index] = updatedFood;

    res.json({
        message: "Food item updated successfully",
        food: updatedFood
    });
});

// DELETE - Delete food item
app.delete('/foods/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = foods.findIndex(f => f.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Food not found" });
    }

    const deletedFood = foods.splice(index, 1);

    res.json({
        message: "Food item deleted successfully",
        food: deletedFood[0]
    });
});

// Handle invalid JSON
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({ message: "Invalid JSON data" });
    }

    res.status(500).json({ message: "Internal Server Error" });
});

// Start Express server
app.listen(4000, () => {
    console.log('Express Server running at http://localhost:4000');
});
