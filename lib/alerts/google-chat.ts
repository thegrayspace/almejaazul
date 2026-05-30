import type { Inquiry } from '@prisma/client';

function formatDate(date: Date | null | undefined) {
  if (!date) return 'Not provided';
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/$/, '');
}

function valueOrFallback(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return 'Not provided';
  return String(value);
}

function decoratedText(label: string, text: string) {
  return {
    decoratedText: {
      topLabel: label,
      text,
      wrapText: true,
    },
  };
}

type GoogleChatWidget =
  | ReturnType<typeof decoratedText>
  | {
      buttonList: {
        buttons: Array<{
          text: string;
          onClick: {
            openLink: {
              url: string;
            };
          };
        }>;
      };
    };

export async function sendGoogleChatAlert(inquiry: Inquiry): Promise<void> {
  const webhookUrl = process.env.GOOGLE_CHAT_WEBHOOK_URL;
  if (!webhookUrl) return;

  const siteUrl = getSiteUrl();
  const adminUrl = siteUrl ? `${siteUrl}/admin/inquiries/${inquiry.id}` : '';
  const dateRange = inquiry.departurDate
    ? `${formatDate(inquiry.requestedDate)} - ${formatDate(inquiry.departurDate)}`
    : formatDate(inquiry.requestedDate);

  const widgets: GoogleChatWidget[] = [
    decoratedText('Contact', `${inquiry.email}${inquiry.phone ? ` | ${inquiry.phone}` : ''}`),
    decoratedText('Dates', dateRange),
    decoratedText('Guest count', valueOrFallback(inquiry.guestCount)),
    decoratedText('Source page', valueOrFallback(inquiry.sourcePage)),
  ];

  if (adminUrl) {
    widgets.push({
      buttonList: {
        buttons: [
          {
            text: 'Open inquiry',
            onClick: {
              openLink: {
                url: adminUrl,
              },
            },
          },
        ],
      },
    });
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      cardsV2: [
        {
          cardId: `inquiry-${inquiry.id}`,
          card: {
            header: {
              title: `📩 New ${inquiry.inquiryType} inquiry`,
              subtitle: inquiry.name,
            },
            sections: [
              {
                widgets,
              },
            ],
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Chat alert failed with ${response.status}`);
  }
}
