import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/verification';

export const metadata = {
  title: pageData.title,
};

export default function VerificationPage() {
  return <PageRenderer data={pageData} />;
}
