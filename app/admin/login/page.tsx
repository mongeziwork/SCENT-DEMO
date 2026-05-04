import { redirect } from 'next/navigation'

/** Legacy URL: use the same sign-in flow as the rest of the site. */
export default function AdminLoginRedirectPage() {
  redirect('/auth/sign-in?next=%2Fadmin')
}
