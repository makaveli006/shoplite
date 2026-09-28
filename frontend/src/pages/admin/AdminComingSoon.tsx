import { PagePlaceholder } from '@/components/PagePlaceholder'

/** Temporary content for the admin tabs that aren't built yet. */
export function AdminComingSoon({ title, lesson }: { title: string; lesson: string }) {
  return <PagePlaceholder title={title} lesson={lesson} />
}
