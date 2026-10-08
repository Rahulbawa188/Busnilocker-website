import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/activity';

export const metadata = {
  title: pageData.title,
};

export default function ActivityPage() {
  return <PageRenderer data={pageData} />;
}
