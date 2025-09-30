const Case = require("../models/Case");
const User = require("../models/User");

// create case (public route - website submission)
exports.createCase = async (req, res) => {
  try {
    const { requesterName, requesterEmail, question, priority } = req.body;
    if (!requesterName || !requesterEmail || !question)
      return res.status(400).json({ message: "Missing fields" });

    const c = await Case.create({
      requesterName,
      requesterEmail,
      question,
      priority,
    });
    return res.status(201).json(c);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// operator: view all
exports.getAllCases = async (req, res) => {
  try {
    const cases = await Case.find()
      .populate("assignedEnabler", "name email expertiseAreas")
      .populate("assignedBy", "name email");
    return res.json(cases);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// operator/admin: assign case to enabler
exports.assignCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { enablerId, deadline } = req.body;
    const enabler = await User.findById(enablerId);
    if (!enabler || enabler.role !== "enabler" || !enabler.approved)
      return res.status(400).json({ message: "Invalid enabler" });

    const c = await Case.findById(caseId);
    if (!c) return res.status(404).json({ message: "Case not found" });

    c.assignedEnabler = enablerId;
    c.assignedBy = req.user._id;
    c.deadline = deadline ? new Date(deadline) : c.deadline;
    c.status = "Pending";
    await c.save();
    return res.json(c);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// enabler: view assigned cases
exports.getAssignedToEnabler = async (req, res) => {
  try {
    const cases = await Case.find({ assignedEnabler: req.user._id }).populate(
      "assignedBy",
      "name email"
    );
    return res.json(cases);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// enabler: accept assigned case
exports.acceptCase = async (req, res) => {
  try {
    const { caseId } = req.params;
    const c = await Case.findOne({
      _id: caseId,
      assignedEnabler: req.user._id,
    });
    if (!c)
      return res
        .status(404)
        .json({ message: "Case not found or not assigned to you" });
    c.status = "Accepted";
    await c.save();
    return res.json(c);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// enabler: update progress
exports.updateProgress = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { updateText, status, deadline } = req.body;
    const c = await Case.findOne({
      _id: caseId,
      assignedEnabler: req.user._id,
    });
    if (!c)
      return res
        .status(404)
        .json({ message: "Case not found or not assigned to you" });

    if (updateText) {
      c.progressUpdates.push({ updateText, updatedBy: req.user._id });
    }
    if (status) c.status = status;
    if (deadline) c.deadline = new Date(deadline);
    await c.save();
    return res.json(c);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// operator/admin: reports
exports.reports = async (req, res) => {
  try {
    // open/pending
    const openPending = await Case.countDocuments({
      status: { $in: ["Open", "Pending", "Accepted", "In Progress"] },
    });

    // past deadlines (not completed)
    const pastDeadlines = await Case.find({
      deadline: { $lt: new Date() },
      status: { $ne: "Completed" },
    });

    // enabler performance: completed count by enabler, grouped
    const perf = await Case.aggregate([
      { $match: { assignedEnabler: { $ne: null } } },
      {
        $group: {
          _id: "$assignedEnabler",
          completedCount: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
          totalAssigned: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "enabler",
        },
      },
      { $unwind: { path: "$enabler", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          enabler: {
            name: "$enabler.name",
            email: "$enabler.email",
            expertiseAreas: "$enabler.expertiseAreas",
          },
          completedCount: 1,
          totalAssigned: 1,
        },
      },
    ]);

    return res.json({ openPending, pastDeadlines, enablerPerformance: perf });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
