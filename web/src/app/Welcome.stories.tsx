import type { Meta, StoryObj } from "@storybook/react";

import { Welcome } from "./Welcome";

const meta: Meta<typeof Welcome> = {
  title: "app/Welcome",
  component: Welcome,
};

export default meta;
type Story = StoryObj<typeof Welcome>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <Welcome />,
};
