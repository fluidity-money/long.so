import type { Meta, StoryObj } from "@storybook/react";

import { CampaignBanner } from "./campaign-banner";

const meta: Meta<typeof CampaignBanner> = {
  component: CampaignBanner,
};

export default meta;
type Story = StoryObj<typeof CampaignBanner>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/api/csf
 * to learn how to use render functions.
 */
export const Primary: Story = {
  render: () => <CampaignBanner />,
};
