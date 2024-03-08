import type { Meta, StoryObj } from "@storybook/react";

import { SwapButton } from "@/app/SwapButton";

const meta: Meta<typeof SwapButton> = {
  component: SwapButton,
};

export default meta;
type Story = StoryObj<typeof SwapButton>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <SwapButton onClick={() => console.log("Clicked")} />,
};
