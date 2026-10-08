import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/signup';

export const metadata = {
  title: pageData.title,
};

export default function SignupPage() {
  return <PageRenderer data={pageData} />;
}
