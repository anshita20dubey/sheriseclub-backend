const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/roles"); // ✅ ab ek function milega
const caseController = require("../controllers/caseController");

// ✅ Apply middlewares
router.use(auth);
router.use(allowRoles("enabler"));

// Routes
router.get("/my-cases", caseController.getAssignedToEnabler);
router.post("/accept/:caseId", caseController.acceptCase);
router.post("/update/:caseId", caseController.updateProgress);

module.exports = router;
