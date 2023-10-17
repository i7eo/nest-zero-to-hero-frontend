import { type ColumnDef } from '@tanstack/react-table'
import DataTableColumnSortAction from './actions/sort'
import DataTableRowActions from '../row-actions'
import { Checkbox } from '@/components/ui/checkbox'

export const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    // TODO: accessorKey capitalize ?= title
    header: ({ column }) => (
      <DataTableColumnSortAction column={column} title="Username" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[500px] truncate font-medium capitalize">
        {row.getValue('username')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
