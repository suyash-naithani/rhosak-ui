import {
  InnerScrollContainer,
  OuterScrollContainer,
  TableVariant,
} from "@patternfly/react-table";
import type { TableViewProps } from "@rhoas/app-services-ui-components";
import { TableView, Pagination } from "@rhoas/app-services-ui-components";
import { useTranslation } from "react-i18next";
import type { Permissions } from "../types";
import { PrincipalCell, PermissionOperationCell, ResourceCell } from "./Cells";
import { useState } from "react";
import { PermissionsToolbar } from "./PermissionsToolbar";
import { PageSection } from "@patternfly/react-core";
import { PermissionsTableEmptyState } from "./EmptyPermissionsTable";

type SubUnion<T, U extends T> = U;
export type PermissionsField = keyof Permissions;
const Columns: SubUnion<
  PermissionsField,
  "account" | "permission" | "resource"
>[] = ["account", "permission", "resource"];

export type PermissionsTableProps<T extends Permissions> = {
  permissions: Array<T> | undefined;
  onDelete: (rowIndex: number) => void;
  onDeleteSelected: (rowIndex: number[]) => void;
  onManagePermissions: () => void;
  onPerPageChange: (page: number, perPage: number) => void;
} & Pick<
  TableViewProps<T, (typeof Columns)[number]>,
  | "itemCount"
  | "page"
  | "perPage"
  | "onPageChange"
  | "isRowSelected"
  | "onClearAllFilters"
>;

export const PermissionsTable = <T extends Permissions>({
  permissions,
  onDelete,
  itemCount,
  page,
  perPage,
  onDeleteSelected,
  onPageChange,
  onManagePermissions,
  onPerPageChange,
}: PermissionsTableProps<T>) => {
  const { t } = useTranslation("manage-kafka-permissions");
  const [checkedRows, setCheckedRows] = useState<number[]>([]);

  const labels: { [field in (typeof Columns)[number]]: string } = {
    account: t("account_id_title"),
    permission: t("table.permissions_column_title"),
    resource: t("table.resource_column_title"),
  };
  const onCheck = (isSelecting: boolean, rowIndex: number) => {
    if (rowIndex != undefined) {
      setCheckedRows(
        isSelecting
          ? [...checkedRows, rowIndex]
          : checkedRows.filter((row) => row !== rowIndex)
      );
    }
  };

  const isRowChecked = (rowIndex: number) => {
    return checkedRows.includes(rowIndex);
  };

  return (
    <PageSection hasOverflowScroll={true}>
      <OuterScrollContainer className={"pf-u-h-100"}>
        <PermissionsToolbar
          onManagePermissions={onManagePermissions}
          onDeleteSelected={onDeleteSelected}
          checkedRows={checkedRows}
          onChangeCheckedRows={setCheckedRows}
          itemCount={itemCount || 0}
          page={page}
          perPage={perPage || 10}
          onChange={onPerPageChange}
        />
        <InnerScrollContainer>
          <TableView
            variant={TableVariant.compact}
            tableOuiaId={"card-table"}
            ariaLabel={t("consumerGroup.consumer_group_list")}
            data={permissions}
            columns={Columns}
            onCheck={onCheck}
            isRowChecked={({ rowIndex }) => isRowChecked(rowIndex)}
            renderHeader={({ column, Th, key }) => (
              <Th key={key}>{labels[column]}</Th>
            )}
            renderCell={({ column, row, Td, key }) => {
              return (
                <Td key={key} dataLabel={labels[column]}>
                  {(() => {
                    switch (column) {
                      case "account":
                        return (
                          <PrincipalCell
                            isReviewTable={false}
                            principal={row.account}
                            isDeleteEnabled={false}
                          />
                        );
                      case "permission":
                        return (
                          <PermissionOperationCell
                            permission={row.permission.permission}
                            operation={row.permission.operation}
                          />
                        );
                      case "resource":
                        return (
                          <ResourceCell
                            patternType={row.resource.patternType}
                            resourceType={row.resource.resourceType}
                            resourceName={row.resource.resourceName}
                          />
                        );
                    }
                  })()}
                </Td>
              );
            }}
            renderActions={({ ActionsColumn, rowIndex }) => (
              <ActionsColumn
                items={[
                  {
                    title: t("manage"),
                    onClick: () => onManagePermissions(),
                  },
                  {
                    title: t("common:delete"),
                    onClick: () => onDelete(rowIndex),
                  },
                ]}
              />
            )}
            itemCount={itemCount}
            page={page}
            onPageChange={onPageChange}
            perPage={perPage}
            emptyStateNoData={
              <PermissionsTableEmptyState
                openManagePermissions={onManagePermissions}
              />
            }
            emptyStateNoResults={
              <PermissionsTableEmptyState
                openManagePermissions={onManagePermissions}
              />
            }
          />
        </InnerScrollContainer>

        {itemCount != undefined && itemCount > 20 ? (
          <Pagination
            isCompact
            itemCount={itemCount || 0}
            page={page}
            perPage={perPage || 10}
            onChange={onPerPageChange}
            variant={"bottom"}
          />
        ) : null}
      </OuterScrollContainer>
    </PageSection>
  );
};
