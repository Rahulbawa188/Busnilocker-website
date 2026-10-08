import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/team';

export const metadata = {
  title: pageData.title,
};

export default function TeamPage() {
  return <PageRenderer data={pageData} />;
}
