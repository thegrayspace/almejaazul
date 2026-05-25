import { InquiryModalProvider } from '@/components/public/InquiryModal';
import Nav from '@/components/public/Nav';
import Footer from '@/components/public/Footer';
import MessengerFloat from '@/components/public/MessengerFloat';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <InquiryModalProvider>
      <Nav />
      <main>{children}</main>
      <Footer />
      <MessengerFloat />
    </InquiryModalProvider>
  );
}
