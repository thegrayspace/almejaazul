import { cookies } from 'next/headers';
import { InquiryModalProvider } from '@/components/public/InquiryModal';
import Nav from '@/components/public/Nav';
import Footer from '@/components/public/Footer';
import MessengerFloat from '@/components/public/MessengerFloat';
import SiteGateScreen from '@/components/public/SiteGateScreen';
import { isGateEnabled, isSiteUnlocked } from '@/lib/site-gate';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  if (isGateEnabled() && !(await isSiteUnlocked())) {
    const cookieStore = await cookies();
    const invalid = cookieStore.get('almeja_gate_flash')?.value === 'invalid';
    return <SiteGateScreen invalid={invalid} />;
  }

  return (
    <InquiryModalProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
      <MessengerFloat />
    </InquiryModalProvider>
  );
}
