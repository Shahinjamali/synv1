const bcrypt = require("bcryptjs");
const storedHash =
  "$2a$10$3QwXz5zT9eK5qX7v8mZ2qO9eJ6lK8pN2vT5mR7sX9zY0wQ1uA3vB6";
bcrypt
  .compare("@Shsynix2025", storedHash)
  .then((match) => console.log("Match:", match));
