import type { Meta, StoryObj } from "@storybook/react";

import { MobileNetworkSelection } from "./MobileNetworkSelection";

const meta: Meta<typeof MobileNetworkSelection> = {
  component: MobileNetworkSelection,
};

export default meta;
type Story = StoryObj<typeof MobileNetworkSelection>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <MobileNetworkSelection />,
};
