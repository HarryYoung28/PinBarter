// temporary redirect to login page
import { redirect } from 'next/navigation'

export default function RootRedirect() {
  redirect('/login')
}
