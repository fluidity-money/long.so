import type { Meta, StoryObj } from "@storybook/react";

import { NetworkSelection } from "./NetworkSelection";

const meta: Meta<typeof NetworkSelection> = {
  component: NetworkSelection,
};

export default meta;
type Story = StoryObj<typeof NetworkSelection>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <NetworkSelection />,
};
