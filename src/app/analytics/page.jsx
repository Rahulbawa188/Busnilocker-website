import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/analytics';

export const metadata = {
  title: pageData.title,
};

export default function AnalyticsPage() {
  return <PageRenderer data={pageData} />;
}
