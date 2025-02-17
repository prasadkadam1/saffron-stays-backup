// const express = require("express");
// const fs = require("fs");
// const path = require("path");
// const cors = require("cors");
// const { log } = require("console");

// const app = express();
// const PORT = 5000;
// const Tents = path.join(__dirname, "./data/tents.json");
// const Cottages = path.join(__dirname, "./data/cottages.json");

// app.use(express.json());
// app.use(cors());

// //! everything about tents

// // Read all tents
// app.get("/tents", (req, res) => {
//     fs.readFile(Tents, "utf8", (err, data) => {
//         if (err) return res.status(500).json({ error: "Error reading file" });
//         res.json(JSON.parse(data).tents);
//     });
// });

// // Read a single tent by ID
// app.get("/tents/:id", (req, res) => {
//     const tentId = parseInt(req.params.id);
//     fs.readFile(Tents, "utf8", (err, data) => {
//         if (err) return res.status(500).json({ error: "Error reading file" });
//         const tents = JSON.parse(data).tents;
//         const tent = tents.find(t => t.id === tentId);
//         if (!tent) return res.status(404).json({ error: "Tent not found" });
//         res.json(tent);
//     });
// });

// // Create a new tent
// app.post("/tents", (req, res) => {
//     fs.readFile(Tents, "utf8", (err, data) => {
//         if (err) return res.status(500).json({ error: "Error reading file" });
//         const tentsData = JSON.parse(data);
//         const newTent = { id: Date.now(), ...req.body };
//         tentsData.tents.push(newTent);

//         fs.writeFile(Tents, JSON.stringify(tentsData, null, 2), "utf8", (err) => {
//             if (err) return res.status(500).json({ error: "Error writing file" });
//             res.status(201).json(newTent);
//         });
//     });
// });

// // Update a tent by ID
// app.put("/tents/:id", (req, res) => {
//     const tentId = parseInt(req.params.id);
//     fs.readFile(Tents, "utf8", (err, data) => {
//         if (err) return res.status(500).json({ error: "Error reading file" });

//         let tentsData = JSON.parse(data);
//         let tentIndex = tentsData.tents.findIndex(t => t.id === tentId);
//         if (tentIndex === -1) return res.status(404).json({ error: "Tent not found" });

//         tentsData.tents[tentIndex] = { ...tentsData.tents[tentIndex], ...req.body };

//         fs.writeFile(Tents, JSON.stringify(tentsData, null, 2), "utf8", (err) => {
//             if (err) return res.status(500).json({ error: "Error writing file" });
//             res.json(tentsData.tents[tentIndex]);
//         });
//     });
// });

// // Delete a tent by ID
// app.delete("/tents/:id", (req, res) => {
//     const tentId = parseInt(req.params.id);
//     fs.readFile(Tents, "utf8", (err, data) => {
//         if (err) return res.status(500).json({ error: "Error reading file" });

//         let tentsData = JSON.parse(data);
//         let tentIndex = tentsData.tents.findIndex(t => t.id === tentId);
//         if (tentIndex === -1) return res.status(404).json({ error: "Tent not found" });

//         tentsData.tents.splice(tentIndex, 1);

//         fs.writeFile(Tents, JSON.stringify(tentsData, null, 2), "utf8", (err) => {
//             if (err) return res.status(500).json({ error: "Error writing file" });
//             res.json({ message: "Tent deleted successfully" });
//         });
//     });
// });




// //! everything about camps cottages

// console.log(Tents);

// // Read all cottages
// app.get("/cottages", (req, res) => {
//     fs.readFile(Cottages, "utf8", (err, data) => {
//         if (err) return res.status(500).json({ error: "Error reading file" });
//         res.json(JSON.parse(data).cottages);
//     });
// });

// // Read a single cottage by ID
// app.get("/cottages/:id", (req, res) => {
//     const cottageId = parseInt(req.params.id);
//     fs.readFile(Cottages, "utf8", (err, data) => {
//         if (err) return res.status(500).json({ error: "Error reading file" });
//         const cottages = JSON.parse(data).cottages;
//         const cottage = cottages.find(t => t.id === cottageId);
//         if (!cottage) return res.status(404).json({ error: "cottage not found" });
//         res.json(cottage);
//     });
// });

// // Create a new cottages
// app.post("/cottages", (req, res) => {
//     fs.readFile(Cottages, "utf8", (err, data) => {
//         if (err) return res.status(500).json({ error: "Error reading file" });
//         const cottagesData = JSON.parse(data);
//         // const newCottage = { id: Date.now(), ...req.body };
//         const newCottage = { id: Math.floor(Date.now() / 1000), ...req.body };
//         cottagesData.cottages.push(newCottage);

//         fs.writeFile(Cottages, JSON.stringify(cottagesData, null, 2), "utf8", (err) => {
//             if (err) return res.status(500).json({ error: "Error writing file" });
//             res.status(201).json(newCottage);
//         });
//     });
// });

// // Update a cottage by ID
// app.put("/cottages/:id", (req, res) => {
//     const cottageId = parseInt(req.params.id);
//     fs.readFile(Cottages, "utf8", (err, data) => {
//         if (err) return res.status(500).json({ error: "Error reading file" });

//         let cottagesData = JSON.parse(data);
//         let cottageIndex = cottagesData.cottages.findIndex(t => t.id === cottageId);
//         if (cottageIndex === -1) return res.status(404).json({ error: "cottage not found" });

//         cottagesData.cottages[cottageIndex] = { ...cottagesData.cottages[cottageIndex], ...req.body };

//         fs.writeFile(Cottages, JSON.stringify(cottagesData, null, 2), "utf8", (err) => {
//             if (err) return res.status(500).json({ error: "Error writing file" });
//             res.json(cottagesData.cottages[cottageIndex]);
//         });
//     });
// });

// // Delete a cottage by ID
// app.delete("/cottages/:id", (req, res) => {
//     const cottageId = parseInt(req.params.id);
//     fs.readFile(Cottages, "utf8", (err, data) => {
//         if (err) return res.status(500).json({ error: "Error reading file" });

//         let cottagesData = JSON.parse(data);
//         let cottageIndex = cottagesData.cottages.findIndex(t => t.id === cottageId);
//         if (cottageIndex === -1) return res.status(404).json({ error: "cottage not found" });

//         cottagesData.cottages.splice(cottageIndex, 1);

//         fs.writeFile(Cottages, JSON.stringify(cottagesData, null, 2), "utf8", (err) => {
//             if (err) return res.status(500).json({ error: "Error writing file" });
//             res.json({ message: "cottages deleted successfully" });
//         });
//     });
// });


// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });













// const express = require("express");
// const fs = require("fs").promises;
// const path = require("path");
// const cors = require("cors");

// const app = express();
// const PORT = 5000;

// // Define file paths centrally
// const DATA_FILES = {
//     tents: path.join(__dirname, "./data/tents.json"),
//     cottages: path.join(__dirname, "./data/cottages.json"),
// };

// app.use(express.json());
// app.use(cors());

// // Helper function to read data from a file
// const readData = async (filePath) => {
//     try {
//         const data = await fs.readFile(filePath, "utf8");
//         return JSON.parse(data);
//     } catch (err) {
//         throw new Error("Error reading file");
//     }
// };

// // Helper function to write data to a file
// const writeData = async (filePath, data) => {
//     try {
//         await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
//     } catch (err) {
//         throw new Error("Error writing file");
//     }
// };

// // Generic function for retrieving all items
// app.get("/:type", async (req, res) => {
//     const { type } = req.params;
//     if (!DATA_FILES[type]) return res.status(400).json({ error: "Invalid resource type" });

//     try {
//         const data = await readData(DATA_FILES[type]);
//         res.json(data[type]);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Generic function for retrieving a single item by ID
// app.get("/:type/:id", async (req, res) => {
//     const { type, id } = req.params;
//     if (!DATA_FILES[type]) return res.status(400).json({ error: "Invalid resource type" });

//     try {
//         const data = await readData(DATA_FILES[type]);
//         const item = data[type].find((item) => item.id === parseInt(id));
//         if (!item) return res.status(404).json({ error: `${type.slice(0, -1)} not found` });

//         res.json(item);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Generic function for creating a new item
// app.post("/:type", async (req, res) => {
//     const { type } = req.params;
//     if (!DATA_FILES[type]) return res.status(400).json({ error: "Invalid resource type" });

//     try {
//         const data = await readData(DATA_FILES[type]);
//         const newItem = { id: Math.floor(Date.now() / 1000), ...req.body };
//         data[type].push(newItem);

//         await writeData(DATA_FILES[type], data);
//         res.status(201).json(newItem);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });





// // Generic function for updating an item by ID
// app.put("/:type/:id", async (req, res) => {
//     const { type, id } = req.params;
//     if (!DATA_FILES[type]) return res.status(400).json({ error: "Invalid resource type" });

//     try {
//         const data = await readData(DATA_FILES[type]);
//         const index = data[type].findIndex((item) => item.id === parseInt(id));

//         if (index === -1) return res.status(404).json({ error: `${type.slice(0, -1)} not found` });

//         data[type][index] = { ...data[type][index], ...req.body };

//         await writeData(DATA_FILES[type], data);
//         res.json(data[type][index]);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Generic function for deleting an item by ID
// app.delete("/:type/:id", async (req, res) => {
//     const { type, id } = req.params;
//     if (!DATA_FILES[type]) return res.status(400).json({ error: "Invalid resource type" });

//     try {
//         const data = await readData(DATA_FILES[type]);
//         const index = data[type].findIndex((item) => item.id === parseInt(id));

//         if (index === -1) return res.status(404).json({ error: `${type.slice(0, -1)} not found` });

//         data[type].splice(index, 1);

//         await writeData(DATA_FILES[type], data);
//         res.json({ message: `${type.slice(0, -1)} deleted successfully` });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// // Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });










const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Define file paths centrally
const DATA_FILES = {
    tents: path.join(__dirname, "./data/tents.json"),
    cottages: path.join(__dirname, "./data/cottages.json"),
    farmhouses: path.join(__dirname, "./data/farmhouses.json"),
    hotels: path.join(__dirname, "./data/hotels.json"),
    homestays: path.join(__dirname, "./data/homestays.json"),
    treehouses: path.join(__dirname, "./data/treehouses.json"),
    villas: path.join(__dirname, "./data/villas.json"),
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Logging HTTP requests

// Helper function to read data from a file
const readData = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, "utf8");
        return JSON.parse(data);
    } catch (err) {
        throw new Error("Error reading file");
    }
};

// Helper function to write data to a file
const writeData = async (filePath, data) => {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
    } catch (err) {
        throw new Error("Error writing file");
    }
};

// Input validation middleware
const validateItem = (req, res, next) => {
    const { type } = req.params;
    const item = req.body;

    if (!item.name || !item.capacity) {
        return res.status(400).json({ error: "Name and capacity are required" });
    }

    if (typeof item.capacity !== "number" || item.capacity <= 0) {
        return res.status(400).json({ error: "Capacity must be a positive number" });
    }

    next();
};

// Generic function for retrieving all items
app.get("/:type", async (req, res) => {
    const { type } = req.params;
    if (!DATA_FILES[type]) return res.status(400).json({ error: "Invalid resource type" });

    try {
        const data = await readData(DATA_FILES[type]);
        res.json(data[type]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generic function for retrieving a single item by ID
app.get("/:type/:id", async (req, res) => {
    const { type, id } = req.params;
    if (!DATA_FILES[type]) return res.status(400).json({ error: "Invalid resource type" });

    try {
        const data = await readData(DATA_FILES[type]);
        const item = data[type].find((item) => Number(item.id) === parseInt(id));
        if (!item) return res.status(404).json({ error: `${type.slice(0, -1)} not found` });

        res.json(item);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generic function for creating a new item
app.post("/:type", validateItem, async (req, res) => {
    const { type } = req.params;
    if (!DATA_FILES[type]) return res.status(400).json({ error: "Invalid resource type" });

    try {
        const data = await readData(DATA_FILES[type]);
        const newItem = { id: Math.floor(Date.now() / 1000), ...req.body };
        data[type].push(newItem);

        await writeData(DATA_FILES[type], data);
        res.status(201).json(newItem);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generic function for updating an item by ID
app.put("/:type/:id", validateItem, async (req, res) => {
    const { type, id } = req.params;
    if (!DATA_FILES[type]) return res.status(400).json({ error: "Invalid resource type" });

    try {
        const data = await readData(DATA_FILES[type]);
        const index = data[type].findIndex((item) => Number(item.id) === parseInt(id));

        if (index === -1) return res.status(404).json({ error: `${type.slice(0, -1)} not found` });

        data[type][index] = { ...data[type][index], ...req.body };

        await writeData(DATA_FILES[type], data);
        res.json(data[type][index]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Generic function for deleting an item by ID
app.delete("/:type/:id", async (req, res) => {
    const { type, id } = req.params;
    if (!DATA_FILES[type]) return res.status(400).json({ error: "Invalid resource type" });

    try {
        const data = await readData(DATA_FILES[type]);
        const index = data[type].findIndex((item) => Number(item.id) === parseInt(id));

        if (index === -1) return res.status(404).json({ error: `${type.slice(0, -1)} not found` });

        data[type].splice(index, 1);

        await writeData(DATA_FILES[type], data);
        res.json({ message: `${type.slice(0, -1)} deleted successfully` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});