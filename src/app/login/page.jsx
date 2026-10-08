import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/login';

export const metadata = {
  title: pageData.title,
};

export default function LoginPage() {
  return <PageRenderer data={pageData} />;
}
