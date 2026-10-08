import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/home';

export const metadata = {
  title: pageData.title,
};

export default function HomePage() {
  return <PageRenderer data={pageData} />;
}
