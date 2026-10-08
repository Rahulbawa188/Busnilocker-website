import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/share-room';

export const metadata = {
  title: pageData.title,
};

export default function ShareRoomPage() {
  return <PageRenderer data={pageData} />;
}
