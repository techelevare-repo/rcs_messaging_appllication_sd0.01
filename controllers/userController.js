const userService = require("../services/userService");

module.exports = {
  updateInterests: async (req, res) => {
    try {
      const result = await userService.updateInterests(req.user.id, req.body.interests);
      res.json(result);
    } catch (err) { res.status(500).json({ error: err.message }); }
  },

  getDevices: async (req, res) => res.json(await userService.getDevices(req.user.id)),
  logoutDevice: async (req, res) => { await userService.logoutDevice(req.user.id, req.params.deviceId); res.json({ message: "Device logged out" }); },

  getSessions: async (req, res) => res.json(await userService.getSessions(req.user.id)),
  deleteSession: async (req, res) => { await userService.deleteSession(req.user.id, req.params.sessionId); res.json({ message: "Session deleted" }); },

  getTerms: async (req, res) => res.json(await userService.getTerms()),
  acceptTerms: async (req, res) => { await userService.acceptTerms(req.user.id); res.json({ message: "Terms accepted" }); },

  getPrivacyPolicy: async (req, res) => res.json(await userService.getPrivacyPolicy()),
  acceptPrivacyPolicy: async (req, res) => { await userService.acceptPrivacyPolicy(req.user.id); res.json({ message: "Privacy policy accepted" }); },

  getExperiments: async (req, res) => res.json(await userService.getExperiments()),
  runExperiment: async (req, res) => res.json(await userService.runExperiment(req.user.id, req.params.id)),

  createSupportTicket: async (req, res) => res.json(await userService.createSupportTicket(req.user.id, req.body)),
  getSupportTickets: async (req, res) => res.json(await userService.getSupportTickets(req.user.id)),
  getSupportTicketById: async (req, res) => res.json(await userService.getSupportTicketById(req.user.id, req.params.id)),
};
