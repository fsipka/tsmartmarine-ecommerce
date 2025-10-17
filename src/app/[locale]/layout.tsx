import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import "../css/euclid-circular-a-font.css";
import "../css/style.css";
import ClientLayout from "./ClientLayout";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};
export default async function LocaleLayout({
  children,
  params,
}: Props) {
  const { locale } = await params;

  // Load messages dynamically
  let messages;
  try {
    messages = (await import(`../../i18n/messages/${locale}.json`)).default;
  } catch (error) {
    messages = {};
  } 
  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientLayout>{children}</ClientLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'tr' }];
}
