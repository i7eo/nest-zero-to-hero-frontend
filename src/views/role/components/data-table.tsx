import { useMemo, useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Columns, MoreHorizontal, Key } from 'lucide-react'
import useSWR from 'swr'
import CreateOrUpdateDialog from './create-or-update-dialog'
import DeleteDialog from './delete-dialog'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
import type { Role } from '@/apis/role/model'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  // TooltipArrow
} from '@/components/ui/tooltip'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DialogTrigger } from '@/components/ui/dialog'
import { AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { ApiPathEnum as ApiRolePathEnum, ApiRolesRead } from '@/apis/role'

export interface IDataTableProps {}

export const DataTable: React.FC<IDataTableProps> = () => {
  const { data: ApiRolesReadResult, isLoading: loadingRoles } = useSWR(
    ApiRolePathEnum,
    ApiRolesRead,
  )
  const roles = useMemo<Role[]>(() => {
    if (ApiRolesReadResult?.data) {
      return ApiRolesReadResult.data
    }
    return []
  }, [ApiRolesReadResult?.data])

  const isLoaded = !loadingRoles

  const columns: ColumnDef<Role>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'label',
      header: 'Rolename',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('label')}</div>
      ),
    },
    // {
    //   accessorKey: 'roles',
    //   accessorFn: (originalRow) => originalRow.roles,
    //   header: 'Role',
    //   cell: ({ row }) => {
    //     const _roles = row.original.roles

    //     return (
    //       <div className="lowercase">
    //         {roles && _roles
    //           ? roles
    //               .filter((role) =>
    //                 _roles.some((_role) => role.value === _role.value),
    //               )
    //               .map((role) => role.label)
    //               .join(', ')
    //           : null}
    //       </div>
    //     )
    //   },
    // },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        // const payment = row.original

        return (
          <CreateOrUpdateDialog
            type={'update'}
            role={{ ...row.original }}
          >
            <DeleteDialog id={row.original.id}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem
                    onClick={() =>
                      navigator.clipboard.writeText(
                        row.original.label,
                      )
                    }
                  >
                    Copy role name
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DialogTrigger asChild>
                    <DropdownMenuItem>Edit Role</DropdownMenuItem>
                  </DialogTrigger>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem>Delete Role</DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
            </DeleteDialog>
          </CreateOrUpdateDialog>
        )
      },
    },
  ]

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data: roles,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return isLoaded ? (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Filter rolenames..."
          value={(table.getColumn('label')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('label')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center">
          <CreateOrUpdateDialog type={'create'}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="mr-4">
                      <Key className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create Role</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CreateOrUpdateDialog>
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Columns className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Control Column</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="grow rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  ) : (
    <>loading...</>
  )
}
