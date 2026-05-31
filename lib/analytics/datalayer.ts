type InquirySubmittedPayload = {
  event_id: string;
  inquiry_type?: string;
  source_page?: string;
};

type DataLayerEventMap = {
  InquirySubmitted: InquirySubmittedPayload;
};

type DataLayerWindow = Window & {
  dataLayer?: Array<Record<string, unknown>>;
};

export function pushDataLayer<E extends keyof DataLayerEventMap>(
  event: E,
  payload: DataLayerEventMap[E],
): void {
  if (typeof window === 'undefined') return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload });
}
