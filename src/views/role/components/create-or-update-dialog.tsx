import {
  forwardRef,
  // useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  useForm,
  //  useFormContext
} from 'react-hook-form'
import { capitalize, merge } from 'lodash-es'
import { useSWRConfig } from 'swr'
import useSWRMutation from 'swr/mutation'
import type { PropsWithChildren } from 'react'
// import useSWR from 'swr'
// import useSWRMutation from 'swr/mutation'
// import { Link, useNavigate } from 'react-router-dom'
// import { Label } from '@/components/ui/label'
import type { User } from '@/apis/user/model'
import type { Profile } from '@/apis/profile/model'
import type { Gender } from '@/apis/gender/model'
import type { Role } from '@/apis/role/model'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/utils/shadcn-ui.util'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { buildFetcher } from '@/utils/fetcher'
import { GenderEnum } from '@/apis/gender/model'
import { RoleEnum, RoleEnumValue } from '@/apis/role/model'

// see: https://github.com/colinhacks/zod/discussions/2125#discussioncomment-7452235
function getZodEnumKeys<T extends Record<string, any>>(obj: T) {
  return Object.keys(obj) as [keyof T]
}
function getZodEnumValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]]
}

const roleLabelZod = z.enum(getZodEnumKeys(RoleEnum), {
  errorMap: () => ({
    message: 'Please select your role name',
  }),
}) satisfies z.ZodType<Role['label']>

const roleValueZod = z.enum(getZodEnumValues(RoleEnum), {
  errorMap: () => ({
    message: 'Please select your role value',
  }),
}) satisfies z.ZodType<Role['value']>

const formSchema = z.object({
  label: roleLabelZod,
  value: roleValueZod
}) satisfies z.ZodType<
  Omit<
    Role,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'users'
  >
>

interface CreateOrUpdateFormProps extends PropsWithChildren {
  type: 'create' | 'update'
  role?: Role
}

type FormSchema = Omit<Role, 'id' | 'createdAt' | 'updatedAt' | 'users'>

const CreateOrUpdateForm = forwardRef<
  {
    onSubmit(): Promise<void>
  },
  CreateOrUpdateFormProps
>(({ type, role }, ref) => {
  let defaultValues: Partial<FormSchema> = {
    label: role?.label,
    value: role?.value
  }

  const fetchUrlSuffix = role ? `/${role.id}` : ''
  const fetchType = type === 'create' ? 'POST' : 'PATCH'
  const fetchUrl = `/api/v1/roles${fetchUrlSuffix}`
  const { mutate } = useSWRConfig()

  const { trigger } = useSWRMutation(
    fetchUrl,
    (url: string, { arg }: { arg: FormSchema }) =>
      buildFetcher(fetchType, url, {
        data: JSON.stringify(arg),
      }),
  )

  // 1. Define your form.
  const form = useForm<FormSchema>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: FormSchema) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values)
    try {
      const result = await trigger(values)
      mutate('/api/v1/roles')

      if (result) {
        return true
      }
      return false
    } catch (e) {
      console.log(e)
      return false
    }
  }

  const handleSubmit = form.handleSubmit(onSubmit)

  useImperativeHandle(ref, () => ({
    async onSubmit() {
      await handleSubmit()
    },
  }))

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className={cn('space-y-4')}>
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rolename</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please enter rolename"
                  {...field}
                />
              </FormControl>
              {/* <FormDescription>
              This is your public display name.
            </FormDescription> */}
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rolevalue</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please enter rolevalue"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

interface CreateOrUpdateDialogProps extends PropsWithChildren {
  type: 'create' | 'update'
  role?: Role
}

const CreateOrUpdateDialog: React.FC<CreateOrUpdateDialogProps> = ({
  type,
  role,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const title = useMemo(() => `${capitalize(type)} Role`, [type])
  const formRef = useRef<{
    onSubmit(): Promise<void>
  } | null>(null)
  const memoCreateOrUpdateForm = useMemo(
    () => (
      <CreateOrUpdateForm
        ref={formRef}
        type={type}
        role={role}
      />
    ),
    [formRef, type],
  )
  const handleCancel = () => {
    setOpen(false)
  }
  const handleSave = async () => {
    await formRef.current?.onSubmit()
    handleCancel()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Edit User</Button>
      </DialogTrigger> */}
      {children}
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Make changes here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        {/* <CreateOrUpdateForm user={user} /> */}
        {memoCreateOrUpdateForm}
        <DialogFooter>
          <Button variant={'outline'} onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSave}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CreateOrUpdateDialog
