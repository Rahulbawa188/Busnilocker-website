import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/renewals';

export const metadata = {
  title: pageData.title,
};

export default function RenewalsPage() {
  return <PageRenderer data={pageData} />;
}
