const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10); // 10 rounds
  const hash = await bcrypt.hash(password, salt);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
};

(async () => {
  //   await hashPassword("@Shsynix2025"); // Your superAdmin password
  //   await hashPassword("AdminPass123!"); // Sample admin password
  //   await hashPassword("ManagerPass123!"); // Sample manager password
  await hashPassword("@Sh49152i"); // For analyst
  await hashPassword("TechPass123!"); // For technician
  await hashPassword("UserPass123!"); // For user
})();
