const { execSync } = require("child_process");
const fs = require("fs");

const code_dir = "./javascript_code";
const rules_dir = ".";

const runner = () => {
  fileNames = fs.readdirSync(code_dir);
  slice(
    fileNames.filter((filename) => filename.endsWith(".js")),
    60
  ).map((filenames, i) => {
    args = `node ./snippets/node_modules/eslint/bin/eslint.js ${filenames
      .map((filename) => code_dir + "/" + filename)
      .join(
        " "
      )} -f json -o ./reports/${i}.json --config ./snippets/.eslintrc.json`;
    console.log(args);
    console.log(execSync(args));
  });
  return reports;
};

const slice = (list, size, length = list.length) => {
  return Array(size)
    .fill(1)
    .map((_, i) =>
      list.slice(
        Math.floor((i * length) / size),
        Math.floor(((i + 1) * length) / size) >= list.length
          ? list.length
          : Math.floor(((i + 1) * length) / size)
      )
    );
};

runner();
