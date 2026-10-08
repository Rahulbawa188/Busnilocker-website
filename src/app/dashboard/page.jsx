import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/dashboard';

export const metadata = {
  title: pageData.title,
};

export default function DashboardPage() {
  return <PageRenderer data={pageData} />;
}
