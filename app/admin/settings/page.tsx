import { requireAdminSession } from '@/lib/auth';
import { prisma } from '@/lib/db';
import AdminShell from '@/components/admin/AdminShell';
import SettingsForm from '@/components/admin/SettingsForm';

export const metadata = { title: 'Settings' };

export default async function AdminSettingsPage() {
  await requireAdminSession();

  let settings = await prisma.siteSettings.findFirst({ where: { active: true } });
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }

  const settingsData = {
    id: settings.id,
    resortName: settings.resortName,
    tagline: settings.tagline,
    address: settings.address,
    phone: settings.phone,
    phoneE164: settings.phoneE164,
    messengerUrl: settings.messengerUrl,
    facebookUrl: settings.facebookUrl,
    instagramUrl: settings.instagramUrl,
    googleMapsUrl: settings.googleMapsUrl,
    logoUrl: settings.logoUrl,
    messengerLogoUrl: settings.messengerLogoUrl,
    footerText: settings.footerText,
  };

  return (
    <AdminShell title="Site Settings">
      <SettingsForm settings={settingsData} />
    </AdminShell>
  );
}
