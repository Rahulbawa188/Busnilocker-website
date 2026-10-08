import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/trust-center';

export const metadata = {
  title: pageData.title,
};

export default function TrustCenterPage() {
  return <PageRenderer data={pageData} />;
}
