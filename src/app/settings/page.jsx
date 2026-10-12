import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/settings';

export const metadata = {
  title: pageData.title,
};

export default function SettingsPage() {
  return <PageRenderer data={pageData} />;
}
