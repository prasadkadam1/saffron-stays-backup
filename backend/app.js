const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Swagger Configuration
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Camping API",
            version: "1.0.0",
            description: "API for managing different types of camping accommodations",
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ["./app.js"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Define file paths centrally
const DATA_FILES = {
    tents: path.join(__dirname, "./data/tents.json"),
    cottages: path.join(__dirname, "./data/cottages.json"),
    farmhouses: path.join(__dirname, "./data/farmhouses.json"),
    hotels: path.join(__dirname, "./data/hotels.json"),
    homestays: path.join(__dirname, "./data/homestays.json"),
    treehouses: path.join(__dirname, "./data/treehouses.json"),
    villas: path.join(__dirname, "./data/villas.json"),
    apartments: path.join(__dirname, "./data/apartments.json"),
    camps: path.join(__dirname, "./data/camps.json"),
};

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); // Logging HTTP requests



/**
 * @swagger
 * components:
 *   schemas:
 *     Camp:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         campName:
 *           type: string
 *         type:
 *           type: string
 *         suitableFor:
 *           type: string
 *         freeServices:
 *           type: array
 *           items:
 *             type: string
 *         refundPolicy:
 *           type: string
 *         prices:
 *           type: object
 *           properties:
 *             actual:
 *               type: number
 *             afterDiscount:
 *               type: number
 *         address:
 *           type: object
 *           properties:
 *             landmark:
 *               type: string
 *             village:
 *               type: string
 *             dist:
 *               type: string
 *             location:
 *               type: string
 *         amenities:
 *           type: array
 *           items:
 *             type: string
 */

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










//! swagger

/**
 * @swagger
 * /apartments:
 *   get:
 *     summary: Retrieve a list of all apartments
 *     responses:
 *       200:
 *         description: List of apartments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/apartments'
 */

/**
 * @swagger
 * /apartments/{id}:
 *   get:
 *     summary: Retrieve a list of all apartments
 *     responses:
 *       200:
 *         description: List of apartments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/apartments'
 */

/**
 * @swagger
 * /apartments:
 *   post:
 *     summary: Retrieve a list of all apartments
 *     responses:
 *       200:
 *         description: List of apartments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/apartments'
 */


/**
 * @swagger
 * /apartments/{id}:
 *   put:
 *     summary: Retrieve a list of all apartments
 *     responses:
 *       200:
 *         description: List of apartments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/apartments'
 */


/**
 * @swagger
 * /apartments/{id}:
 *   delete:
 *     summary: Retrieve a list of all apartments
 *     responses:
 *       200:
 *         description: List of apartments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/apartments'
 */





//==============

/**
 * @swagger
 * /camps:
 *   get:
 *     summary: Retrieve a list of all camps
 *     responses:
 *       200:
 *         description: List of camps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/camp'
 */

/**
 * @swagger
 * /camp/{id}:
 *   get:
 *     summary: Retrieve a list of all camps
 *     responses:
 *       200:
 *         description: List of camps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/camp'
 */

/**
 * @swagger
 * /camp:
 *   post:
 *     summary: Retrieve a list of all camps
 *     responses:
 *       200:
 *         description: List of camps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/camp'
 */


/**
 * @swagger
 * /camp/{id}:
 *   put:
 *     summary: Retrieve a list of all camps
 *     responses:
 *       200:
 *         description: List of camps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/camp'
 */


/**
 * @swagger
 * /camp/{id}:
 *   delete:
 *     summary: Retrieve a list of all camps
 *     responses:
 *       200:
 *         description: List of camps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/camp'
 */





//==============

/**
 * @swagger
 * /cottages:
 *   get:
 *     summary: Retrieve a list of all cottages
 *     responses:
 *       200:
 *         description: List of cottages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/cottages'
 */

/**
 * @swagger
 * /cottages/{id}:
 *   get:
 *     summary: Retrieve a list of all cottages
 *     responses:
 *       200:
 *         description: List of cottages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/cottages'
 */

/**
 * @swagger
 * /cottages:
 *   post:
 *     summary: Retrieve a list of all cottages
 *     responses:
 *       200:
 *         description: List of cottages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/cottages'
 */


/**
 * @swagger
 * /cottages/{id}:
 *   put:
 *     summary: Retrieve a list of all cottages
 *     responses:
 *       200:
 *         description: List of cottages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/cottages'
 */


/**
 * @swagger
 * /cottages/{id}:
 *   delete:
 *     summary: Retrieve a list of all cottages
 *     responses:
 *       200:
 *         description: List of camps
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/cottages'
 */




//==============

/**
 * @swagger
 * /farmhouses:
 *   get:
 *     summary: Retrieve a list of all farmhouses
 *     responses:
 *       200:
 *         description: List of farmhouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/farmhouses'
 */

/**
 * @swagger
 * /farmhouses/{id}:
 *   get:
 *     summary: Retrieve a list of all farmhouses
 *     responses:
 *       200:
 *         description: List of farmhouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/farmhouses'
 */

/**
 * @swagger
 * /farmhouses:
 *   post:
 *     summary: Retrieve a list of all farmhouses
 *     responses:
 *       200:
 *         description: List of farmhouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/farmhouses'
 */


/**
 * @swagger
 * /farmhouses/{id}:
 *   put:
 *     summary: Retrieve a list of all farmhouses
 *     responses:
 *       200:
 *         description: List of farmhouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/farmhouses'
 */


/**
 * @swagger
 * /farmhouses/{id}:
 *   delete:
 *     summary: Retrieve a list of all farmhouses
 *     responses:
 *       200:
 *         description: List of farmhouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/farmhouses'
 */




//==============

/**
 * @swagger
 * /homestays:
 *   get:
 *     summary: Retrieve a list of all homestays
 *     responses:
 *       200:
 *         description: List of homestays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/homestays'
 */

/**
 * @swagger
 * /homestays/{id}:
 *   get:
 *     summary: Retrieve a list of all homestays
 *     responses:
 *       200:
 *         description: List of homestays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/homestays'
 */

/**
 * @swagger
 * /homestays:
 *   post:
 *     summary: Retrieve a list of all homestays
 *     responses:
 *       200:
 *         description: List of homestays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/homestays'
 */


/**
 * @swagger
 * /homestays/{id}:
 *   put:
 *     summary: Retrieve a list of all homestays
 *     responses:
 *       200:
 *         description: List of homestays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/homestays'
 */


/**
 * @swagger
 * /homestays/{id}:
 *   delete:
 *     summary: Retrieve a list of all homestays
 *     responses:
 *       200:
 *         description: List of homestays
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/homestays'
 */



//==============

/**
 * @swagger
 * /hotels:
 *   get:
 *     summary: Retrieve a list of all hotels
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/hotels'
 */

/**
 * @swagger
 * /hotels/{id}:
 *   get:
 *     summary: Retrieve a list of all hotels
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/hotels'
 */

/**
 * @swagger
 * /hotels:
 *   post:
 *     summary: Retrieve a list of all hotels
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/hotels'
 */


/**
 * @swagger
 * /hotels/{id}:
 *   put:
 *     summary: Retrieve a list of all hotels
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/hotels'
 */


/**
 * @swagger
 * /hotels/{id}:
 *   delete:
 *     summary: Retrieve a list of all hotels
 *     responses:
 *       200:
 *         description: List of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/hotels'
 */



//==============

/**
 * @swagger
 * /tents:
 *   get:
 *     summary: Retrieve a list of all tents
 *     responses:
 *       200:
 *         description: List of tents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/tents'
 */

/**
 * @swagger
 * /tents/{id}:
 *   get:
 *     summary: Retrieve a list of all tents
 *     responses:
 *       200:
 *         description: List of tents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/tents'
 */

/**
 * @swagger
 * /tents:
 *   post:
 *     summary: Retrieve a list of all tents
 *     responses:
 *       200:
 *         description: List of tents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/tents'
 */


/**
 * @swagger
 * /tents/{id}:
 *   put:
 *     summary: Retrieve a list of all tents
 *     responses:
 *       200:
 *         description: List of tents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/tents'
 */


/**
 * @swagger
 * /tents/{id}:
 *   delete:
 *     summary: Retrieve a list of all tents
 *     responses:
 *       200:
 *         description: List of tents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/tents'
 */






//==============

/**
 * @swagger
 * /treehouses:
 *   get:
 *     summary: Retrieve a list of all treehouses
 *     responses:
 *       200:
 *         description: List of treehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/treehouses'
 */

/**
 * @swagger
 * /treehouses/{id}:
 *   get:
 *     summary: Retrieve a list of all treehouses
 *     responses:
 *       200:
 *         description: List of treehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/treehouses'
 */

/**
 * @swagger
 * /treehouses:
 *   post:
 *     summary: Retrieve a list of all treehouses
 *     responses:
 *       200:
 *         description: List of treehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/treehouses'
 */


/**
 * @swagger
 * /treehouses/{id}:
 *   put:
 *     summary: Retrieve a list of all treehouses
 *     responses:
 *       200:
 *         description: List of treehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/treehouses'
 */


/**
 * @swagger
 * /treehouses/{id}:
 *   delete:
 *     summary: Retrieve a list of all treehouses
 *     responses:
 *       200:
 *         description: List of treehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/treehouses'
 */


//==============

/**
 * @swagger
 * /villas:
 *   get:
 *     summary: Retrieve a list of all villas
 *     responses:
 *       200:
 *         description: List of villas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/villas'
 */

/**
 * @swagger
 * /villas/{id}:
 *   get:
 *     summary: Retrieve a list of all villas
 *     responses:
 *       200:
 *         description: List of villas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/villas'
 */

/**
 * @swagger
 * /villas:
 *   post:
 *     summary: Retrieve a list of all villas
 *     responses:
 *       200:
 *         description: List of villas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/villas'
 */


/**
 * @swagger
 * /villas/{id}:
 *   put:
 *     summary: Retrieve a list of all villas
 *     responses:
 *       200:
 *         description: List of villas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/villas'
 */


/**
 * @swagger
 * /villas/{id}:
 *   delete:
 *     summary: Retrieve a list of all villas
 *     responses:
 *       200:
 *         description: List of villas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/villas'
 */