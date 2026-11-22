const crypto = require("crypto");
const userRepo = require("../repositories/UserRepository");

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

class AuthController {
  async register(req, res) {
    try {
      const { name, fullName, email, password, businessName, phone } =
        req.body || {};
      const resolvedName = fullName || name;

      if (!resolvedName || !String(resolvedName).trim()) {
        return res.status(400).json({ error: "Full name is required." });
      }
      if (!email || !String(email).trim()) {
        return res.status(400).json({ error: "Email is required." });
      }
      if (!password || String(password).length < 4) {
        return res
          .status(400)
          .json({ error: "Password must be at least 4 characters." });
      }

      const existing = await userRepo.findByEmail(email);
      if (existing) {
        return res
          .status(409)
          .json({ error: "An account with this email already exists." });
      }

      const createdUser = await userRepo.create({
        fullName: resolvedName,
        email,
        password: hashPassword(password),
        businessName,
        phone,
      });

      res.status(201).json({
        message: "Account registered successfully",
        user: createdUser,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body || {};

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required." });
      }

      const user = await userRepo.findByEmail(email);
      if (!user || user.password_hash !== hashPassword(password)) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          name: user.full_name,
          fullName: user.full_name,
          email: user.email,
          businessName: user.business_name,
          phone: user.phone,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = new AuthController();