import PageRenderer from '@/components/PageRenderer';
import { pageData } from '@/data/pages/onboarding';

export const metadata = {
  title: pageData.title,
};

export default function OnboardingPage() {
  return <PageRenderer data={pageData} />;
}
