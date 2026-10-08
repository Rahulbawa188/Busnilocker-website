import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/admin-review';

export const metadata = {
  title: pageData.title,
};

export default function AdminReviewPage() {
  return <PageRenderer data={pageData} />;
}
