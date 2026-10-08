import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/notifications';

export const metadata = {
  title: pageData.title,
};

export default function NotificationsPage() {
  return <PageRenderer data={pageData} />;
}
