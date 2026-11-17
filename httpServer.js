
const http = require('http');
const fs = require('fs');
const path = require('path');

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

const server = http.createServer((req, res) => {

    // GET /
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Food Ordering Application</h1>');
    }

    // GET /foods
    else if (req.method === 'GET' && req.url === '/foods') {
        const availableFoods = foods.filter(food => food.availability === true);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(availableFoods));
    }

    // GET /about
    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About Us</h1><p>We provide online food ordering services.</p>');
    }

    // GET /menu
    else if (req.method === 'GET' && req.url === '/menu') {
        const menuPath = path.join(__dirname, 'public', 'menu.html');

        fs.readFile(menuPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading menu file');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // POST /add-food
    else if (req.method === 'POST' && req.url === '/add-food') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            try {
                const newFood = JSON.parse(body);

                if (
                    !newFood.id ||
                    !newFood.foodName ||
                    !newFood.category ||
                    newFood.price === undefined ||
                    typeof newFood.availability !== 'boolean' ||
                    typeof newFood.price !== 'number' ||
                    newFood.price <= 0
                ) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid or missing food details' }));
                    return;
                }

                foods.push(newFood);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Food added successfully', food: newFood }));
            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON data' }));
            }
        });
    }

    // Invalid route
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 - Page Not Found');
    }

});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
