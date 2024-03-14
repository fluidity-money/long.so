import type { Meta, StoryObj } from "@storybook/react";

import { SwapForm } from "@/app/SwapForm";
import { Provider } from "@/app/Provider";
import { useWelcomeStore } from "@/stores/useWelcomeStore";
import { useEffect } from "react";

const meta: Meta<typeof SwapForm> = {
  component: SwapForm,
  decorators: [
    (Story) => (
      <Provider>
        <Story />
      </Provider>
    ),
    (Story) => {
      const { setWelcome } = useWelcomeStore();

      useEffect(() => {
        setWelcome(false);
      }, [setWelcome]);

      return <Story />;
    },
  ],
};

export default meta;
type Story = StoryObj<typeof SwapForm>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <SwapForm />,
};
