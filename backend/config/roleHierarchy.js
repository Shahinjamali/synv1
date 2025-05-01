module.exports = {
  owner: {
    superadmin: 4, // Highest-level owner role, full access
    manager: 3, // Mid-level owner role
    admin: 2, // Owner admin role
    user: 1, // Basic owner role
  },
  customer: {
    admin: 5, // Customer admin role, full customer access
    manager: 4, // Customer manager role
    analyst: 3, // Customer analyst role
    technician: 2, // Customer technician role
    user: 1, // Basic customer role
  },
};
