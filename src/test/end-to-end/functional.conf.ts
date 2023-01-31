import { join } from "path";
import { config as testConfig } from "../config";

const { setHeadlessWhen } = require("@codeceptjs/configure");

setHeadlessWhen(testConfig.TestHeadlessBrowser);

export const config: CodeceptJS.MainConfig = {
  name: "functional",
  tests: "./tests/*-test.ts",
  include: {
    I: "./tests/custom-steps.ts",
  },
  output: join(testConfig.TestFunctionalOutputPath, "functional/reports"),
  helpers: testConfig.helpers,
  plugins: {
    ...testConfig.plugins,
    pauseOnFail: {
      enabled: !testConfig.TestHeadlessBrowser,
    },
  },
};
