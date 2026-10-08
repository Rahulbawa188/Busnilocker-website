import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/contact';

export const metadata = {
  title: pageData.title,
};

export default function ContactPage() {
  return <PageRenderer data={pageData} />;
}
