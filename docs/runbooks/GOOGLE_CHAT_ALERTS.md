# Google Chat Inquiry Alerts

Use this runbook to send new Almeja Azul inquiry alerts into Google Chat through an incoming webhook.

## Setup

1. Open Google Chat and create a space named `Inquiries`.
2. In the space, open **Apps & integrations**.
3. Go to **Webhooks**, add a webhook, and name it `Almeja Azul Site`.
4. Copy the generated webhook URL.
5. In Vercel, add these environment variables for the production project:
   - `GOOGLE_CHAT_WEBHOOK_URL`: the webhook URL from Google Chat
   - `NEXT_PUBLIC_SITE_URL`: the production site URL, for example `https://almejaazul.com`
6. Redeploy the site so Vercel picks up the new variables.

## Test With Curl

Replace the webhook URL before running:

```bash
curl -X POST "$GOOGLE_CHAT_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "cardsV2": [
      {
        "cardId": "test-inquiry",
        "card": {
          "header": {
            "title": "📩 New Test inquiry",
            "subtitle": "Test Guest"
          },
          "sections": [
            {
              "widgets": [
                {
                  "decoratedText": {
                    "topLabel": "Contact",
                    "text": "test@example.com | 09993088800",
                    "wrapText": true
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  }'
```

To disable Google Chat alerts, remove `GOOGLE_CHAT_WEBHOOK_URL` from the environment and redeploy.
