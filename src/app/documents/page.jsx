import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/documents';

export const metadata = {
  title: pageData.title,
};

export default function DocumentsPage() {
  return <PageRenderer data={pageData} />;
}
