import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/company-assets';

export const metadata = {
  title: pageData.title,
};

export default function CompanyAssetsPage() {
  return <PageRenderer data={pageData} />;
}
