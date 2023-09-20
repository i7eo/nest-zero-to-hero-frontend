import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
// import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { Link } from 'react-router-dom'
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
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/util/shadcn-ui.util'

const formSchema = z.object({
  email: z.string().email({
    message: '请输入正确的邮箱',
  }),
  password: z.string().min(6, {
    message: '密码长度至少大于6',
  }),
  remember: z.boolean().default(false).optional(),
})

async function sendRequest(
  url: string,
  { arg }: { arg: z.infer<typeof formSchema> },
) {
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify(arg),
  }).then((res) => res.json())
}

function LoginForm() {
  // const { data, error, isLoading, mutate } = useSWR('/api/v1/user/list')
  // console.log(data)
  // console.log(error)
  // console.log(isLoading)

  const { trigger } = useSWRMutation('/api/v1/login', sendRequest)

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)

    trigger(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          'w-10/12 space-y-4 rounded-lg border p-4 shadow-sm sm:w-6/12 lg:w-4/12 xl:w-[500px]',
        )}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input placeholder="请输入邮箱" {...field} />
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
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input placeholder="请输入密码" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remember"
          render={({ field }) => (
            <FormItem className={cn('inline-flex items-center justify-center')}>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className={cn('!mt-0 ml-2')}>记住我</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className={cn('flex flex-col gap-4')}>
          <Button
            type="submit"
            className={cn('bg-indigo-600 hover:bg-indigo-500')}
          >
            登录
          </Button>
          <Button asChild variant={'outline'}>
            <Link to={'/register'}>注册</Link>
          </Button>
        </div>
      </form>
    </Form>
  )
}

const LoginPage: React.FC = () => {
  return (
    <section className={cn('flex h-full items-center justify-center')}>
      <LoginForm />
    </section>
  )
}

export default LoginPage
