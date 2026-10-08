import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/features';

export const metadata = {
  title: pageData.title,
};

export default function FeaturesPage() {
  return <PageRenderer data={pageData} />;
}
