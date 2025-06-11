const mongoose = require("mongoose");
const LoginAdmin = require("../models/Batchmate.js");

//! Update admin role
// http://localhost:5000/api/login/role-update {"email_address":"acd@accenture.com","role":"admin"}

exports.editLoginAdminRole = async (req, res) => {
  try {
    const { email_address, new_role } = req.body;

    if (!email_address || !new_role) {
      return res.status(400).json({
        success: false,
        error: "Both 'email_address' and 'new_role' fields are required.",
      });
    }

    const normalizedEmail = email_address.trim().toLowerCase();
    const allowedRoles = ["user", "admin"];

    if (!allowedRoles.includes(new_role)) {
      return res.status(400).json({
        success: false,
        error: `Invalid role. Allowed roles are: ${allowedRoles.join(", ")}`,
      });
    }

    const admin = await LoginAdmin.findOne({ email_address: normalizedEmail });

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "No admin found with the given email address.",
      });
    }

    if (admin.role === new_role) {
      return res.status(200).json({
        success: true,
        message: `No changes made. Role is already set to '${new_role}'.`,
        admin: {
          _id: admin._id,
          email_address: admin.email_address,
          role: admin.role,
          updatedAt: admin.updatedAt,
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Proceed to update
    admin.role = new_role;
    const updatedAdmin = await admin.save();

    res.status(200).json({
      success: true,
      message: `Role successfully updated to '${new_role}'.`,
      admin: {
        _id: updatedAdmin._id,
        email_address: updatedAdmin.email_address,
        role: updatedAdmin.role,
        updatedAt: updatedAdmin.updatedAt,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Error in editLoginAdminRole:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error while updating admin role.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

//! fetch admin details by mail
//GET http://localhost:5000/api/login/login-id?email=acd@accenture.com
exports.getAdminByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email query parameter is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: "Invalid email format.",
      });
    }

    // Fetch admin with the given email and 'admin' role
    const admin = await LoginAdmin.findOne({
      email_address: normalizedEmail,
      role: "admin",
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found or not an admin role.",
      });
    }
  } catch (err) {
    console.error("Error in getAdminByEmail:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error while fetching admin.",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};
