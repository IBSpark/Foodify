const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        message: "Google token missing",
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, name, picture } = payload;

    // Create JWT token
    const appToken = jwt.sign(
      {
        email,
        name,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      token: appToken,
      user: {
        name,
        email,
        picture,
      },
    });

  } catch (error) {
    console.error("Google Auth Error:", error);

    res.status(401).json({
      message: "Google authentication failed",
    });
  }
};

module.exports = googleAuth;