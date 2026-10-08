import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/billing';

export const metadata = {
  title: pageData.title,
};

export default function BillingPage() {
  return <PageRenderer data={pageData} />;
}
