const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const roleHierarchy = require("../config/roleHierarchy");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, select: false },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    roles: [
      { type: String, enum: Object.keys(roleHierarchy), default: "user" },
    ],
    roleLevel: { type: Number, default: 1 },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    permissions: [
      {
        section: { type: String, required: true },
        level: {
          type: String,
          enum: ["readOnly", "readWrite", "writeOnly", "unauthorized"],
          default: "unauthorized",
          required: true,
        },
      },
    ],
    isInitialAdmin: { type: Boolean, default: false },
    lastLogin: { type: Date, default: Date.now },
    isDeleted: { type: Boolean, default: false },
    hasCompletedWelcome: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash Password Before Save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    console.log("[userModel] Password hashed:", this.password);
  } catch (err) {
    console.error("[userModel] Hashing error:", err);
    return next(err); // Pass error to Mongoose
  }
  next();
});

// Set Role Level and Log Changes
userSchema.pre("save", async function (next) {
  this.roleLevel = Math.max(
    ...this.roles.map((role) => roleHierarchy[role] || 1)
  );
  if (this.isModified("roles") || this.isModified("permissions")) {
    const AuditLog = mongoose.model("AuditLog");
    const auditEntry = new AuditLog({
      userId: this._id,
      action: this.isNew ? "create_user" : "update_user",
      entity: { entityType: "User", entityId: this._id },
      details: { roles: this.roles, permissions: this.permissions },
      metadata: {
        previousState: this.isNew ? null : this._doc,
        newState: this.toObject(),
      },
    });
    await auditEntry
      .save()
      .catch((err) => console.error("Audit log error:", err));
  }
  next();
});

// Compare Password for Login
userSchema.methods.matchPassword = async function (enteredPassword) {
  const isMatch = await bcrypt.compare(enteredPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model("User", userSchema);
