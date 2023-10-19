import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm, useFormContext } from 'react-hook-form'
import { capitalize, merge } from 'lodash-es'
import useSWR from 'swr'
import { type IProfile, type IRole, type IUser , IDictionary} from './data-table'
import type { PropsWithChildren } from 'react'
// import useSWR from 'swr'
// import useSWRMutation from 'swr/mutation'
// import { Link, useNavigate } from 'react-router-dom'
// import { Label } from '@/components/ui/label'
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
import { cn } from '@/util/shadcn-ui.util'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// const profileZodObject = z.object({
//   id: z.string(),
//   avator: z.string(),
//   email: z.string().email({
//     message: 'You have to enter correct email.',
//   }),
//   address: z.string(),
//   gender: z.number(),
// }) satisfies z.ZodType<IProfile>

// const profileFormSchema = profileZodObject.omit({
//   id: true
// })

// const roleZodObject = z.object({
//   id: z.string(),
//   name: z.string(),
// }) satisfies z.ZodType<IRole>

// const roleFormSchema = roleZodObject.omit({
//   id: true
// })

const formSchema = z.object({
  username: z.string(),
  profile: z.object({
    avator: z.string(),
    email: z.string().email({
      message: 'You have to enter correct email.',
    }),
    address: z.string(),
    gender: z.string(),
  }),
  roles: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .array(),
}) satisfies z.ZodType<IUser>

interface CreateOrUpdateFormProps extends PropsWithChildren {
  user?: IUser
  genders: IDictionary[]
  roles: IDictionary[]
}

const CreateOrUpdateForm = forwardRef<
  {
    onSubmit(): void
  },
  CreateOrUpdateFormProps
>(({ user, genders, roles }, ref) => {
  let defaultValues: z.infer<typeof formSchema> = {
    username: '',
    profile: {
      avator: '',
      email: '',
      address: '',
      gender: '1',
    },
    roles: [],
  }
  if (user) {
    defaultValues = merge(defaultValues, { ...user })
  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  const handleSubmit = form.handleSubmit(onSubmit)

  useImperativeHandle(ref, () => ({
    onSubmit() {
      handleSubmit()
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
                <Input placeholder="Please enter username" {...field} />
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
                                !!field.value?.find(
                                  (value) => value.value === role.value,
                                )
                              }
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      { ...role },
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value.value !== role.id,
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
  user?: z.infer<typeof formSchema>
  genders: IDictionary[]
  roles: IDictionary[]
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
    onSubmit(): void
  } | null>(null)
  const memoCreateOrUpdateForm = useMemo(
    () => (
      <CreateOrUpdateForm
        ref={formRef}
        user={user}
        genders={genders}
        roles={roles}
      />
    ),
    [formRef, user, genders, roles],
  )
  const handleCancel = () => {
    setOpen(false)
  }
  const handleSave = () => {
    formRef.current?.onSubmit()
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
