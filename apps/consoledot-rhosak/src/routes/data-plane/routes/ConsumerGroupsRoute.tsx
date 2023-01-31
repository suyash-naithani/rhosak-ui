import {
  usePaginationSearchParams,
  useSortableSearchParams,
  useURLSearchParamsChips,
} from "@rhoas/app-services-ui-components";
import {
  KafkaConsumerGroupSortableColumns,
  useConsumerGroups,
} from "consoledot-api";
import type { VoidFunctionComponent } from "react";
import { useCallback } from "react";
import { ConsumerGroups, useConsumerGroupLabels } from "ui";
import { ControlPlaneRouteRoot } from "../../control-plane/routesConsts";
import type { ControlPlaneNavigationProps } from "../../control-plane/routesConsts";
import { useDataPlaneGate } from "../useDataPlaneGate";
import { DataPlaneHeaderConnected } from "./DataPlaneHeaderConnected";
import { useHistory } from "react-router-dom";
import { instanceConsumerGroupsHref } from "../DataPlaneRoutes";

export const ConsumerGroupsRoute: VoidFunctionComponent<
  ControlPlaneNavigationProps
> = ({ instancesHref }) => {
  const { instance } = useDataPlaneGate();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const history = useHistory();

  const labels = useConsumerGroupLabels();

  const { page, perPage, setPagination, setPaginationQuery } =
    usePaginationSearchParams();
  const resetPaginationQuery = useCallback(
    () => setPaginationQuery(1, perPage),
    [perPage, setPaginationQuery]
  );

  const consumerName = useURLSearchParamsChips(
    "consumer",
    resetPaginationQuery
  );
  const [isColumnSortable, sort, sortDirection] = useSortableSearchParams(
    KafkaConsumerGroupSortableColumns,
    labels.fields
  );
  const { data } = useConsumerGroups({
    id: instance?.id,
    adminUrl: instance?.adminUrl,
    page,
    perPage,
    sort: sort || undefined,
    direction: sortDirection,
    groupId: consumerName.chips[0],
  });

  const onDeletConsumerGroup = useCallback(
    (groupId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      history.push(
        `${instanceConsumerGroupsHref(instance.id)}/${groupId}/delete`
      );
    },
    [history, instance.id]
  );

  const onViewPartition = useCallback(
    (groupId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      history.push(
        `${instanceConsumerGroupsHref(instance.id)}/${groupId}/view-partition`
      );
    },
    [history, instance.id]
  );

  const onClickResetOffset = useCallback(
    (groupId: string) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
      history.push(
        `${instanceConsumerGroupsHref(instance.id)}/${groupId}/reset-offset`
      );
    },
    [history, instance.id]
  );
  return (
    <>
      <DataPlaneHeaderConnected
        instancesHref={instancesHref}
        activeSection={"consumer"}
      />
      <ConsumerGroups
        consumers={data?.groups}
        itemCount={data?.count}
        page={page}
        perPage={perPage}
        consumerName={consumerName.chips}
        isRowSelected={() => false}
        isColumnSortable={isColumnSortable}
        onDelete={(row) => onDeletConsumerGroup(row.groupId)}
        onSearchConsumer={(value) => {
          consumerName.clear();
          consumerName.toggle(value);
        }}
        onClearAllFilters={consumerName.clear}
        onPageChange={setPagination}
        onRemoveConsumerChip={consumerName.clear}
        onRemoveConsumerChips={consumerName.clear}
        onViewPartition={(row) => onViewPartition(row.groupId)}
        onViewResetOffset={(row) => onClickResetOffset(row.groupId)}
      />
    </>
  );
};
