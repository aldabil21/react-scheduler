const fs = require("fs");
const path = require("path");

const init = async () => {
  try {
    const base = path.resolve("");
    const files = ["package.json", "LICENSE", "README.md"];
    for (const file of files) {
      await fs.promises.copyFile(path.join(base, file), path.join(base, "dist", file));
    }
  } catch (error) {
    throw error;
  }
};

init();
