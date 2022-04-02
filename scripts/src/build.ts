import { CSS, JS } from "./builder";

JS()
  .then(() => CSS())
  .then(() => {
    console.log("Build Successful! You're Good To Run In Static Mode");
    console.log("\nusing yarn:\nyarn static\n\nusing npm:\nnpm run static\n");
  });
