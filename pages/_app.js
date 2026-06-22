import { Analytics } from '@vercel/analytics/next';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

export default function MyApp({ Component, pageProps }) {
    useEffect(() => {
          posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
                  api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com',
                  person_profiles: 'identified_only',
                  capture_pageview: true,
          });
    }, []);

  return (
        <PostHogProvider client={posthog}>
          <Component {...pageProps} />
        <Analytics />
    </PostHogProvider>
    );
}
