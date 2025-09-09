const User = require("../models/User");
const Device = require("../models/Device");
const Session = require("../models/Session");
const Terms = require("../models/Terms");
const PrivacyPolicy = require("../models/PrivacyPolicy");
const Experiment = require("../models/Experiment");
const SupportTicket = require("../models/SupportTicket");

module.exports = {
  updateInterests: async (userId, interests) => {
    const user = await User.findByPk(userId);
    user.interests = interests;
    await user.save();
    return user;
  },

  getDevices: (userId) => Device.findAll({ where: { userId } }),
  logoutDevice: (userId, deviceId) => Device.destroy({ where: { id: deviceId, userId } }),

  getSessions: (userId) => Session.findAll({ where: { userId } }),
  deleteSession: (userId, sessionId) => Session.destroy({ where: { id: sessionId, userId } }),

  getTerms: () => Terms.findAll(),
  acceptTerms: (userId) => Terms.create({ userId, acceptedAt: new Date() }),

  getPrivacyPolicy: () => PrivacyPolicy.findAll(),
  acceptPrivacyPolicy: (userId) => PrivacyPolicy.create({ userId, acceptedAt: new Date() }),

  getExperiments: () => Experiment.findAll(),
  runExperiment: (userId, id) => Experiment.update({ runBy: userId }, { where: { id } }),

  createSupportTicket: (userId, data) => SupportTicket.create({ ...data, userId }),
  getSupportTickets: (userId) => SupportTicket.findAll({ where: { userId } }),
  getSupportTicketById: (userId, id) => SupportTicket.findOne({ where: { userId, id } }),
};
