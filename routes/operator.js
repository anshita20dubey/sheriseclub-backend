const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const caseController = require("../controllers/caseController");
const userController = require("../controllers/userController"); // ✅ add this line

// secure routes
router.use(auth);
router.use(allowRoles("operator", "admin")); // operator & admin can access

// case routes
router.get("/cases", caseController.getAllCases);
router.post("/assign/:caseId", caseController.assignCase);

// enabler list for assignment
router.get("/enablers", userController.getApprovedEnablers); // ✅ now it works

module.exports = router;
