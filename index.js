const express = require('express');
const cors = require('cors');
const app = express();

// 1. Setup Middleware
app.use(cors()); // This allows your GitHub website to access this API
app.use(express.json()); // This allows your API to read JSON data sent to it

const PORT = process.env.PORT || 3000;

// 2. Your API Routes
app.get('/', (req, res) => {
    res.json({ message: "Backend is officially live!" });
});

app.get('/status', (req, res) => {
    res.json({ 
        status: "Online", 
        timestamp: new Date().toISOString(),
        version: "1.0.0" 
    });
});

// 3. Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
