import { type PropsWithChildren, useState } from 'react'
import useSWRMutation from 'swr/mutation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  // AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { buildFetcher } from '@/utils/fetcher'
// import { Button } from '@/components/ui/button'

interface DeleteDialogProps extends PropsWithChildren {
  id: string
}

const DeleteDialog: React.FC<DeleteDialogProps> = ({ id, children }) => {
  const [open, setOpen] = useState(false)
  const { trigger } = useSWRMutation('/api/v1/users', (url: string) =>
    buildFetcher('DELETE', `${url}/${id}`),
  )

  async function handleContinue() {
    try {
      await trigger()
    } catch (e) {
      console.log(e)
    }
  }

  function handleCancel() {
    setOpen(false)
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {/* <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog</Button>
      </AlertDialogTrigger> */}
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete user and
            remove user data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteDialog
