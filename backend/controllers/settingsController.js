const Settings = require("../models/Settings");

// GET SETTINGS
exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({});
    }

    res.status(200).json(settings);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch settings",
    });
  }
};

// SAVE SETTINGS
exports.saveSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();

    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: "Settings saved successfully",
      settings,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to save settings",
    });
  }
};