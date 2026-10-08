import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/identity';

export const metadata = {
  title: pageData.title,
};

export default function IdentityPage() {
  return <PageRenderer data={pageData} />;
}
