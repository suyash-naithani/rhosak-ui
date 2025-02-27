import { TableVariant } from "@patternfly/react-table";
import type { TableViewProps } from "@rhoas/app-services-ui-components";
import { TableView } from "@rhoas/app-services-ui-components";
import { useTranslation } from "react-i18next";
import type { Account, Permissions } from "../types";
import { PrincipalCell, PermissionOperationCell, ResourceCell } from "./Cells";
import { useCallback, useEffect, useState } from "react";
import { PageSection } from "@patternfly/react-core";
import { PermissionsTableEmptyState } from "./EmptyPermissionsTable";

type SubUnion<T, U extends T> = U;
export type PermissionsField = keyof Permissions;
const Columns: SubUnion<
  PermissionsField,
  "account" | "permission" | "resource"
>[] = ["account", "permission", "resource"];

export type PermissionsTableProps<T extends Permissions> = {
  allAccounts: Account[] | undefined;
  permissions: Array<T> | undefined;
  onDelete: (rowIndex: number) => void;
  onDeleteSelected: (rowIndex: number[]) => void;
  onManagePermissions: () => void;
  onManagePermissionsActionItem: (account: string) => void;
  onPerPageChange: (page: number, perPage: number) => void;
} & Pick<
  TableViewProps<T, (typeof Columns)[number]>,
  | "itemCount"
  | "page"
  | "perPage"
  | "onPageChange"
  | "isRowSelected"
  | "onClearAllFilters"
  | "onCheck"
>;

export const PermissionsTable = <T extends Permissions>({
  allAccounts,
  permissions,
  onDelete,
  itemCount,
  page,
  perPage,
  onDeleteSelected,
  onPageChange,
  onManagePermissions,
  onManagePermissionsActionItem,
}: PermissionsTableProps<T>) => {
  const { t } = useTranslation("manage-kafka-permissions");
  const [checkedRows, setCheckedRows] = useState<number[]>([]);

  useEffect(() => {
    //Only clear all the checked row when they are deleted
    setCheckedRows([]);
  }, [permissions]);

  const labels: { [field in (typeof Columns)[number]]: string } = {
    account: t("account_id_title"),
    permission: t("table.permissions_column_title"),
    resource: t("table.resource_column_title"),
  };

  const onCheck: TableViewProps<T, (typeof Columns)[number]>["onCheck"] =
    useCallback(
      ({ rowIndex }, isSelecting) => {
        if (rowIndex != undefined) {
          setCheckedRows(
            isSelecting
              ? [...checkedRows, rowIndex]
              : checkedRows.filter((t) => t !== rowIndex)
          );
        }
      },
      [checkedRows]
    );

  const isRowChecked = (rowIndex: number) => {
    return checkedRows.includes(rowIndex);
  };

  const onBulkDelete = () => {
    onDeleteSelected(checkedRows);
  };

  return (
    <PageSection hasOverflowScroll={true}>
      <TableView
        variant={TableVariant.compact}
        tableOuiaId={"permissions-table"}
        ariaLabel={t("consumerGroup.consumer_group_list")}
        actions={[
          {
            onClick: onManagePermissions,
            label: t("dialog_title"),
            isPrimary: true,
          },
        ]}
        kebabActions={[
          {
            onClick: onBulkDelete,
            label: t("delete_selected"),
            isDisabled: checkedRows.length > 0 ? false : true,
          },
        ]}
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
                        allAccounts={
                          allAccounts?.filter(
                            (value) => `User:${value.id}` == row.account
                          )[0]
                        }
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
        renderActions={({ ActionsColumn, rowIndex, row }) => (
          <ActionsColumn
            items={[
              {
                title: t("manage"),
                onClick: () =>
                  onManagePermissionsActionItem(
                    row.account == "User:*"
                      ? "all-accounts"
                      : row.account?.split(":")[1]
                  ),
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
    </PageSection>
  );
};
