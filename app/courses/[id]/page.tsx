import { redirect } from "next/navigation";

export default function PublicCoursePage({ params }: { params: { id: string } }) {
  // Instant Server-Side Redirect to the Dashboard Course Page
  redirect(`/dashboard/courses/${params.id}`);
}
