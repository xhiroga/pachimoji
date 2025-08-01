// Google Analytics イベント送信のヘルパー関数
export const sendGAEvent = (
  eventName: string, 
  parameters: {
    event_category: string
    event_label: string
    [key: string]: string | number | boolean
  }
) => {
  if (typeof window !== 'undefined' && 'gtag' in window) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const gtag = (window as { gtag: (command: string, eventName: string, parameters: Record<string, any>) => void }).gtag
    gtag('event', eventName, parameters)
  }
}