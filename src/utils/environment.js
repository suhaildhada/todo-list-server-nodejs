const getEnvironment = () => {
  return process.env.NODE_ENV || "development";
};
const isDevelopment = () => {
  return getEnvironment() === "development";
};
const isProduction = () => {
  return getEnvironment() === "production";
};

module.exports = {
  getEnvironment,
  isDevelopment,
  isProduction,
};
