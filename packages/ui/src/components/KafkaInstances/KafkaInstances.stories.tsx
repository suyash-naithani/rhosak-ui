import type { ComponentMeta, ComponentStory } from "@storybook/react";
import { KafkaInstances as InstancesTableComp } from "./KafkaInstances";

export default {
  component: InstancesTableComp,
  args: {
    columns: "standard",
    getUrlForInstance: () => "",
    names: [],
    owners: [],
    statuses: [],
    isRefreshing: false,
  },
} as ComponentMeta<typeof InstancesTableComp>;

const Template: ComponentStory<typeof InstancesTableComp> = (args) => (
  <InstancesTableComp {...args} />
);

export const FirstLoadShowsSpinner = Template.bind({});
FirstLoadShowsSpinner.args = {
  instances: null,
};

export const LoadingDataAfterFilteringShowsASkeleton = Template.bind({});
LoadingDataAfterFilteringShowsASkeleton.args = {
  instances: undefined,
  names: ["foo"],
};

export const NoInitialDataShowsTheRightEmptyState = Template.bind({});
NoInitialDataShowsTheRightEmptyState.args = {
  instances: [],
};

export const NoDataWithAFilterShowsTheRightEmptyState = Template.bind({});
NoDataWithAFilterShowsTheRightEmptyState.args = {
  instances: [],
  names: ["foo"],
};

export const DedicateInstances = Template.bind({});
DedicateInstances.args = {
  columns: "dedicated",
};
