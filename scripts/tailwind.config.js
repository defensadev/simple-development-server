const path = require("path");

module.exports = {
  content: [path.resolve(process.cwd(), "./public/**/*.{html,js}")],
  theme: {
    extend: {},
  },
  plugins: [],
};
