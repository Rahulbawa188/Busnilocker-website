import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/public-profile';

export const metadata = {
  title: pageData.title,
};

export default function PublicProfilePage() {
  return <PageRenderer data={pageData} />;
}
