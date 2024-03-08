import type { Meta, StoryObj } from "@storybook/react";

import { StyleLayout } from "@/app/StyleLayout";

const meta: Meta<typeof StyleLayout> = {
  component: StyleLayout,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
    },
  },
};

export default meta;
type Story = StoryObj<typeof StyleLayout>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => (
    <StyleLayout>
      <div>Test</div>
    </StyleLayout>
  ),
};
