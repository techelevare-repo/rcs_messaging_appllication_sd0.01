const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middlewares/auth");

router.use(auth);

router.put("/me/interests-tags", userController.updateInterests);
router.get("/me/devices", userController.getDevices);
router.delete("/me/devices/logout/:deviceId", userController.logoutDevice);

router.get("/me/sessions", userController.getSessions);
router.delete("/me/sessions/:sessionId", userController.deleteSession);

router.get("/me/terms", userController.getTerms);
router.post("/me/accept-terms", userController.acceptTerms);

router.get("/me/privacy-policy", userController.getPrivacyPolicy);
router.post("/me/accept-privacy-policy", userController.acceptPrivacyPolicy);

router.get("/me/experiments", userController.getExperiments);
router.post("/me/experiments/:id", userController.runExperiment);

router.post("/me/support-tickets", userController.createSupportTicket);
router.get("/me/support-tickets", userController.getSupportTickets);
router.get("/me/support-tickets/:id", userController.getSupportTicketById);

module.exports = router;
