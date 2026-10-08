import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/support';

export const metadata = {
  title: pageData.title,
};

export default function SupportPage() {
  return <PageRenderer data={pageData} />;
}
