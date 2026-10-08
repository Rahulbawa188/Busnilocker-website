import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/integrations';

export const metadata = {
  title: pageData.title,
};

export default function IntegrationsPage() {
  return <PageRenderer data={pageData} />;
}
