import type { Preview } from "@storybook/react";

import "../src/styles/globals.scss";
import "../src/app/globals.css"; // replace with the name of your tailwind css file

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
