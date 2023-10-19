import * as React from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Columns, MoreHorizontal, UserPlus } from 'lucide-react'
import useSWR from 'swr'
import CreateOrUpdateDialog from './create-or-update-dialog'
import DeleteDialog from './delete-dialog'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table'
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

export interface IDictionary {
  id: string
  label: string
  value: string
}

export interface IUser {
  // id: string
  username: string
  profile: IProfile
  roles: IRole[]
}

export interface IProfile {
  // id: string
  avator: string
  email: string
  address: string
  gender: string
}

// export interface IRole {
//   // id: string
//   label: string
//   value: string
// }

export interface IRole extends Omit<IDictionary, 'id'> {}

export interface IDataTableProps {}

export const DataTable: React.FC<IDataTableProps> = () => {
  const { data: dictGenders, isLoading: loadingGenders } = useSWR(
    '/api/v1/dict/genders',
  )
  const genders: IDictionary[] = dictGenders
  const { data: dictRoles, isLoading: loadingRoles } =
    useSWR('/api/v1/dict/roles')
  const roles: IDictionary[] = dictRoles
  const { data: result, isLoading: loadingUsers } = useSWR('/api/v1/users')
  const users: IUser[] = result
  console.log(genders, roles, users)

  const isLoaded = !loadingUsers && !loadingGenders && !loadingRoles

  const columns = React.useMemo<ColumnDef<IUser>[]>(
    () => [
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
        accessorKey: 'username',
        header: 'Username',
        cell: ({ row }) => (
          <div className="capitalize">{row.getValue('username')}</div>
        ),
      },
      {
        accessorKey: 'roles',
        accessorFn: (originalRow) => originalRow.roles,
        header: 'Role',
        cell: ({ row }) => {
          const roleValues = row.original.roles.map((role) => role.value)

          return (
            <div className="lowercase">
              {roles
                .filter((role) => roleValues.includes(role.value))
                .map((role) => role.label)
                .join(', ')}
            </div>
          )
        },
      },
      {
        accessorKey: 'gender',
        accessorFn: (originalRow) => originalRow.profile.gender,
        header: 'Gender',
        cell: ({ row }) => (
          <div className="lowercase">
            {
              genders.find(
                (gender) => gender.value === row.original.profile.gender,
              )!.label
            }
          </div>
        ),
      },
      {
        accessorKey: 'avator',
        accessorFn: (originalRow) => originalRow.profile.avator,
        header: 'Avator',
        cell: ({ row }) => (
          <div className="lowercase">{row.original.profile.avator}</div>
        ),
      },
      {
        accessorKey: 'email',
        accessorFn: (originalRow) => originalRow.profile.email,
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => (
          <div className="lowercase">{row.original.profile.email}</div>
        ),
      },
      {
        accessorKey: 'address',
        accessorFn: (originalRow) => originalRow.profile.address,
        header: () => <div className="text-right">Address</div>,
        cell: ({ row }) => {
          // const amount = parseFloat(row.getValue('amount'))

          // // Format the amount as a dollar amount
          // const formatted = new Intl.NumberFormat('en-US', {
          //   style: 'currency',
          //   currency: 'USD',
          // }).format(amount)

          // return <div className="text-right font-medium">{formatted}</div>
          return (
            <div className="text-right font-medium">
              {row.original.profile.address}
            </div>
          )
        },
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          // const payment = row.original

          return (
            <CreateOrUpdateDialog
              type={'update'}
              user={{ ...row.original }}
              genders={genders}
              roles={roles}
            >
              <DeleteDialog>
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
                          row.original.profile.email,
                        )
                      }
                    >
                      Copy user email
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DialogTrigger asChild>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                    </DialogTrigger>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem>Delete User</DropdownMenuItem>
                    </AlertDialogTrigger>
                  </DropdownMenuContent>
                </DropdownMenu>
              </DeleteDialog>
            </CreateOrUpdateDialog>
          )
        },
      },
    ],
    [genders, roles],
  )
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data: users,
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
          placeholder="Filter emails..."
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center">
          <CreateOrUpdateDialog type={'create'} genders={genders} roles={roles}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="mr-4">
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Create User</p>
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
