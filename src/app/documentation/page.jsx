import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/documentation';

export const metadata = {
  title: pageData.title,
};

export default function DocumentationPage() {
  return <PageRenderer data={pageData} />;
}
