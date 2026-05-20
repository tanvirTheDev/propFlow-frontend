import { AuthCard } from '@/components/auth/auth-card';
import { InviteForm } from '@/components/auth/invite-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { Metadata } from 'next';
import type { InviteDetails } from '@/lib/api/types';

export const metadata: Metadata = {
  title: 'Accept Invitation — PropFlow',
};

interface Props {
  params: Promise<{ token: string }>;
}

async function fetchInvite(token: string): Promise<InviteDetails | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/invite/${token}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data ?? json) as InviteDetails;
  } catch {
    return null;
  }
}

export default async function InvitePage({ params }: Props) {
  const { token } = await params;
  const invite = await fetchInvite(token);

  if (!invite) {
    return (
      <AuthCard title="Invalid Invitation">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This invitation link is invalid or has expired. Please contact your landlord for a new
            invitation.
          </AlertDescription>
        </Alert>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Accept your invitation"
      subtitle={`You've been invited to join ${invite.orgName}`}
    >
      <p className="text-sm font-medium mb-4">Welcome, {invite.name}!</p>
      <InviteForm token={token} invite={invite} />
    </AuthCard>
  );
}
