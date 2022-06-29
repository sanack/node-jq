/* eslint-disable */
const jq = require("./build/index");

const main = () => {
  jq.run(".", '{ test: "object" }', { input: "string" })
    .then((res) => console.log(res))
    .catch((_err) => console.error("Trying to catch error", _err));
};

main();
