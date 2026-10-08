import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/compliance';

export const metadata = {
  title: pageData.title,
};

export default function CompliancePage() {
  return <PageRenderer data={pageData} />;
}
