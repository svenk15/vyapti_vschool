import { useId, type ReactNode } from "react";

export type ServerTableColumn<Row> = Readonly<{
  key: string;
  label: string;
  render: (row: Row) => ReactNode;
  rowHeader?: boolean;
}>;

/** Accessible table presentation for rows already filtered and authorized by a server query. */
export function ServerTable<Row>({
  caption,
  rows,
  columns,
  rowKey,
}: {
  caption: string;
  rows: readonly Row[];
  columns: readonly ServerTableColumn<Row>[];
  rowKey: (row: Row) => string;
}) {
  const captionId = useId();

  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-labelledby={captionId}>
      <table className="data-table">
        <caption id={captionId}>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col">{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => {
                const value = column.render(row);
                return column.rowHeader
                  ? <th key={column.key} scope="row">{value}</th>
                  : <td key={column.key}>{value}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
