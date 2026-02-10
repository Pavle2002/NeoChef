import { Button } from '@/components/ui/button'
import { useStartFetchJob } from '@/mutations/use-start-fetch-job'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
  staticData: { title: 'Dashboard' },
})

function RouteComponent() {

  const {mutate} = useStartFetchJob()

  return (
    <Button onClick={() => mutate(0)}>Start FetchJob</Button>
  )
}
