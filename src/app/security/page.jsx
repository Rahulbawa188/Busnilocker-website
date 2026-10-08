import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/security';

export const metadata = {
  title: pageData.title,
};

export default function SecurityPage() {
  return <PageRenderer data={pageData} />;
}
