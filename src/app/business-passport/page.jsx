import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/business-passport';

export const metadata = {
  title: pageData.title,
};

export default function BusinessPassportPage() {
  return <PageRenderer data={pageData} />;
}
