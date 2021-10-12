const bcrypt = require("bcrypt");

async function comparePassword(hashedPassword, password) {
  return bcrypt.compare(password, hashedPassword);
}

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(
    parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10
  );
  return bcrypt.hash(password, salt);
}

module.exports = {
  comparePassword,
  hashPassword,
};
