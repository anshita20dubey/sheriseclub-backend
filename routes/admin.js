const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles");
const userController = require("../controllers/userController");
const caseController = require("../controllers/caseController");

// ✅ secure admin routes
router.use(auth);
router.use(allowRoles("admin"));

// ✅ user management
router.get("/pending-enablers", userController.getPendingEnablers);
router.post("/approve-enabler/:id", userController.approveEnabler);
router.get("/enablers", userController.getApprovedEnablers);
// ✅ case management
router.get("/cases", caseController.getAllCases);

module.exports = router;
