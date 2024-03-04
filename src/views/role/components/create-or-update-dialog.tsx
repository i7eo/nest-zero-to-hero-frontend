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
import { RoleEnum } from '@/apis/role/model'

// see: https://github.com/colinhacks/zod/discussions/2125#discussioncomment-7452235
function getZodEnumValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]]
}

const genderZod = z.enum(getZodEnumValues(GenderEnum), {
  errorMap: () => ({
    message: 'Please select your gender',
  }),
}) satisfies z.ZodType<Gender['value']>

const roleZod = z.enum(getZodEnumValues(RoleEnum), {
  errorMap: () => ({
    message: 'Please select your role',
  }),
}) satisfies z.ZodType<Role['value']>

const profileZod = z.object({
  gender: genderZod,
  avator: z.string(),
  email: z.string().email({
    message: 'You have to enter correct email.',
  }),
  address: z.string(),
}) satisfies z.ZodType<Omit<Profile, 'id' | 'gender' | 'user' | 'createdAt' | 'updatedAt'>>

const formSchema = z.object({
  username: z.string(),
  password: z.string(),
  profile: profileZod,
  roles: roleZod.array(),
}) satisfies z.ZodType<
  Omit<
    User,
    | 'id'
    | 'profile'
    | 'logs'
    | 'roles'
    | 'createdAt'
    | 'updatedAt'
    | 'afterInsert'
    | 'afterRemove'
  >
>

interface CreateOrUpdateFormProps extends PropsWithChildren {
  type: 'create' | 'update'
  user?: User
  genders: Gender[]
  roles: Role[]
}

const CreateOrUpdateForm = forwardRef<
  {
    onSubmit(): Promise<void>
  },
  CreateOrUpdateFormProps
>(({ type, user, genders, roles }, ref) => {
  let defaultValues: z.infer<typeof formSchema> = {
    username: '',
    password: '',
    profile: {
      avator: '',
      email: '',
      address: '',
      gender: GenderEnum.female,
    },
    roles: [RoleEnum.guest],
  }
  let fetchUrlSuffix = ''

  if (user) {
    defaultValues = merge(defaultValues, { ...user })
    fetchUrlSuffix += `/${user.id}`
  }

  const fetchType = type === 'create' ? 'POST' : 'PATCH'
  const fetchUrl = `/api/v1/users${fetchUrlSuffix}`
  const { mutate } = useSWRConfig()

  const { trigger } = useSWRMutation(
    fetchUrl,
    (url: string, { arg }: { arg: z.infer<typeof formSchema> }) =>
      buildFetcher(fetchType, url, {
        data: JSON.stringify(arg),
      }),
  )

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values)
    try {
      const result = await trigger(values)
      mutate('/api/v1/users')

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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please enter username"
                  {...field}
                  type="email"
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="Please enter password"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roles"
          render={() => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <div className="flex flex-row space-x-3 space-y-0">
                {roles.map((role) => (
                  <FormField
                    key={role.id}
                    control={form.control}
                    name="roles"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={
                                !!field.value?.some(
                                  (value) => value === role.value,
                                )
                              }
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, role.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== role.value,
                                      ),
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {role.label}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile.gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <FormControl className="flex flex-row space-x-3 space-y-0">
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {genders.map((gender) => (
                    <FormItem
                      key={gender.id}
                      className="flex flex-row items-center space-x-3 space-y-0"
                    >
                      <FormControl>
                        <RadioGroupItem value={gender.value} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        {gender.label}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile.avator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avator</FormLabel>
              <FormControl>
                <Input placeholder="Please enter avator" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Please enter email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="profile.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Please enter address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <div className={cn('flex flex-col gap-4')}>
          <Button asChild variant={'outline'}>
            Cancel
          </Button>
          <Button
            type="submit"
            className={cn('bg-indigo-600 hover:bg-indigo-500')}
          >
            Continue
          </Button>
        </div> */}
      </form>
    </Form>
  )
})

interface CreateOrUpdateDialogProps extends PropsWithChildren {
  type: 'create' | 'update'
  user?: User
  genders: Gender[]
  roles: Role[]
}

const CreateOrUpdateDialog: React.FC<CreateOrUpdateDialogProps> = ({
  type,
  user,
  genders,
  roles,
  children,
}) => {
  const [open, setOpen] = useState(false)
  const title = useMemo(() => `${capitalize(type)} User`, [type])
  const formRef = useRef<{
    onSubmit(): Promise<void>
  } | null>(null)
  const memoCreateOrUpdateForm = useMemo(
    () => (
      <CreateOrUpdateForm
        ref={formRef}
        type={type}
        user={user}
        genders={genders}
        roles={roles}
      />
    ),
    [formRef, type, user, genders, roles],
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
