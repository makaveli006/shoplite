import type { ReactNode } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

/** Temporary content for pages we haven't built yet. */
export function PagePlaceholder({ title, lesson, children }: { title: string; lesson: string; children?: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>This page is built in {lesson}.</CardDescription>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  )
}
