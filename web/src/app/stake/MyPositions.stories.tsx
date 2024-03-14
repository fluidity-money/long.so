import type { Meta, StoryObj } from "@storybook/react";

import { MyPositions } from "./MyPositions";

const meta: Meta<typeof MyPositions> = {
  title: "app/stake/MyPositions",
  component: MyPositions,
  parameters: {
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof MyPositions>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => (
    <div className="flex w-[500px] flex-col p-4">
      <MyPositions />
    </div>
  ),
};
