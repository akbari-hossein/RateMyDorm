interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  initData: string;
  initDataUnsafe: {
    user?: TelegramWebAppUser;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

function getWebApp(): TelegramWebApp | null {
  if (typeof window === "undefined") return null;
  return window.Telegram?.WebApp ?? null;
}

export function initTelegramWebApp() {
  const webApp = getWebApp();
  if (!webApp) return null;

  webApp.ready();
  webApp.expand();
  webApp.setHeaderColor("#0f172a");
  webApp.setBackgroundColor("#0f172a");
  return webApp;
}

export function getTelegramInitData(): string | null {
  return getWebApp()?.initData || null;
}

export function isTelegramWebApp(): boolean {
  return !!getTelegramInitData();
}

export function getTelegramUserName(): string | null {
  const user = getWebApp()?.initDataUnsafe?.user;
  if (!user) return null;
  return (
    [user.first_name, user.last_name].filter(Boolean).join(" ") ||
    user.username ||
    null
  );
}
