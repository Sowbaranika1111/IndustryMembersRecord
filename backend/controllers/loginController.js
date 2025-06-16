const User = require("../models/Batchmate.js");
const { sendOtpEmail } = require("../config/nodemailer");
 
// @desc    Generate and send OTP to user's email
// @route   POST /api/login/generate-otp
// @access  Public
exports.generateOtp = async (req, res) => {
  try {
    const { enterpriseId } = req.body;
    if (!enterpriseId) {
      return res.status(400).json({ message: "Enterprise ID is required." });
    }
 
    const email_address = `${enterpriseId.trim().toLowerCase()}@accenture.com`;
    const user = await User.findOne({ email_address });
 
    if (!user) {
      return res.status(404).json({ message: "User with this Enterprise ID not found." });
    }
 
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(otp)
    const otp_expiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
 
    // The 'pre-save' hook in the model will hash the OTP automatically
    user.otp = otp;
    user.otp_expiry = otp_expiry;
    await user.save();
 
    // Send the PLAIN TEXT OTP to the user's email
    await sendOtpEmail(user.email_address, otp);
 
    res.status(200).json({
      success: true,
      message: `An OTP has been sent to ${user.email_address}. It will expire in 5 minutes.`,
    });
  } catch (error) {
    console.error("Error in generateOtp:", error);
    res.status(500).json({ message: "Server error while generating OTP.", error: error.message });
  }
};
 
// @desc    Verify OTP and log the user in by creating a session
// @route   POST /api/login/verify-otp
// @access  Public
exports.verifyOtpAndLogin = async (req, res) => {
  try {
    const { enterpriseId, otp } = req.body;
    if (!enterpriseId || !otp) {
      return res.status(400).json({ message: "Enterprise ID and OTP are required." });
    }
 
    const email_address = `${enterpriseId.trim().toLowerCase()}@accenture.com`;
    const user = await User.findOne({ email_address });
 
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
 
    // Check if OTP exists and is not expired
    if (!user.otp || user.otp_expiry < new Date()) {
      user.otp = undefined;
      user.otp_expiry = undefined;
      await user.save();
      return res.status(400).json({ message: "OTP is invalid or has expired. Please request a new one." });
    }
 
    // Compare submitted OTP with the hashed OTP in the DB
    const isMatch = await user.compareOtp(otp);
 
    if (!isMatch) {
      return res.status(400).json({ message: "OTP mismatched. Please try again." });
    }
 
    // --- OTP is correct ---
    // Clear the OTP fields to prevent reuse
    user.otp = undefined;
    user.otp_expiry = undefined;
    await user.save();
 
    // --- Create Session ---
    req.session.user = {
      id: user._id,
      email: user.email_address,
      name: user.name,
      role: user.role,
    };
 
    res.status(200).json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id,
        email: user.email_address,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in verifyOtpAndLogin:", error);
    res.status(500).json({ message: "Server error during OTP verification." });
  }
};
 
// @desc    Check user authentication status
// @route   GET /api/login/check-auth
// @access  Private (relies on session)
exports.checkAuth = async (req, res) => {
  if (req.session.user) {
    res.status(200).json({
      isAuthenticated: true,
      user: req.session.user,
    });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
};
 
// @desc    Logout user by destroying the session
// @route   POST /api/login/logout
// @access  Private
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Could not log out, please try again." });
    }
    res.clearCookie('connect.sid'); // The default session cookie name
    res.status(200).json({ success: true, message: "You have been logged out." });
  });
};
 
 
// @desc    Update a user's role (for internal/Postman use)
// @route   PUT /api/login/role-update
// @access  Internal/Admin
exports.editLoginAdminRole = async (req, res) => {
  // Your provided code was solid. I've just matched the response style.
  try {
    const { email_address, role } = req.body;
    if (!email_address || !role) {
      return res.status(400).json({ message: "Both 'email_address' and 'role' are required." });
    }
 
    const allowedRoles = ["user", "admin"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}` });
    }
 
    const user = await User.findOneAndUpdate(
      { email_address: email_address.trim().toLowerCase() },
      { role: role },
      { new: true, runValidators: true } // 'new' returns the updated doc
    ).select("-otp -otp_expiry"); // Don't send back sensitive fields
 
    if (!user) {
      return res.status(404).json({ message: "No user found with the given email address." });
    }
 
    res.status(200).json({
      success: true,
      message: `Role successfully updated to '${role}'.`,
      user: { id: user._id, email: user.email_address, role: user.role },
    });
  } catch (err) {
    console.error("Error in editLoginAdminRole:", err);
    res.status(500).json({ message: "Internal server error while updating role." });
  }
};
 
 
// @desc    Fetch user details by email
// @route   GET /api/login/details
// @access  Internal/Admin
exports.getUserByEmail = async (req, res) => {
    // I renamed this from getAdminByEmail for clarity.
    // Your original code had a bug where it didn't send a success response.
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: "Email query parameter is required." });
        }
 
        const user = await User.findOne({ email_address: email.trim().toLowerCase() })
                               .select("-otp -otp_expiry");
 
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
 
        // Bug fix: Added success response
        res.status(200).json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email_address, role: user.role },
        });
 
    } catch (err) {
        console.error("Error in getUserByEmail:", err);
        res.status(500).json({ message: "Internal server error while fetching user." });
    }
};