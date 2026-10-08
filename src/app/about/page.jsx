import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/about';

export const metadata = {
  title: pageData.title,
};

export default function AboutPage() {
  return <PageRenderer data={pageData} />;
}
