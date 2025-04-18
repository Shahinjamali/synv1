/**
 * @swagger
 * tags:
 *   name: testsRoutes.js
 *   description: API endpoints for testsRoutes.js
 *
 * /api/testsRoutes.js:
 *   get:
 *     summary: Get all entries
 *     tags: [testsRoutes.js]
 *     responses:
 *       200:
 *         description: A list of items
 */
const express = require("express");
const router = express.Router();

// Test API

router.get("/", (req, res) => {
  res.json({ message: "Test route is working!" });
});

module.exports = router;
