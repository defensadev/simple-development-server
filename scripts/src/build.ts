import { cleanUp, CSS, JS } from "./utils";

JS(true)
  .then(() => CSS(true))
  .then(() => {
    console.log("Build Successful! You're Good To Run In Static Mode");
    console.log("\nusing yarn:\nyarn static\n\nusing npm:\nnpm run static\n");
  });

cleanUp();
