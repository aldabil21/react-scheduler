const fs = require("fs");
const path = require("path");

const init = async () => {
  try {
    const base = path.resolve("");
    const files = ["LICENSE", "README.md"];
    for (const file of files) {
      await fs.promises.copyFile(path.join(base, file), path.join(base, "dist", file));
    }

    // clean up package.json on the fly
    const package = await fs.promises.readFile(path.join(base, "package.json"), {
      encoding: "utf-8",
    });
    const obj = JSON.parse(package);
    delete obj.scripts;
    delete obj.devDependencies;
    delete obj["lint-staged"];
    obj.homepage = "https://github.com/aldabil21/react-scheduler#readme";

    await fs.promises.writeFile(path.join(base, "dist", "package.json"), JSON.stringify(obj), {
      encoding: "utf-8",
    });
  } catch (error) {
    throw error;
  }
};

init();
