import type { Preview } from "@storybook/react";

import "../src/styles/globals.scss";
import "../src/app/globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
});

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
  decorators: [
    (Story) => (
      <body className={inter.className}>
        <div className="h-screen w-screen overflow-hidden bg-white">
          <Story />
        </div>
      </body>
    ),
  ],
};

export default preview;
