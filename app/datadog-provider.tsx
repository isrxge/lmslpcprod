"use client";

import { useEffect } from "react";
import { datadogRum } from "@datadog/browser-rum";
import { useUser } from "@clerk/nextjs";

export default function DatadogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  useEffect(() => {
    if (typeof window !== "undefined") {
      datadogRum.init({
        applicationId: "1ed1c791-b8b7-4901-a2fa-d0da1ca537d9",
        clientToken: "pubaf94b37b5f5344af0d07d162d5ee963e",
        // `site` refers to the Datadog site parameter of your organization
        // see https://docs.datadoghq.com/getting_started/site/
        site: "datadoghq.com",
        service: "lms-website",
        env: "prod",
        // Specify a version number to identify the deployed version of your application in Datadog
        version: "1.0.0",
        allowedTracingUrls: [
          "http://lms.lp.local/api",
          // Matches any subdomain of my-api-domain.com, such as https://foo.my-api-domain.com
          /^https:\/\/[^\/]+\.my-api-domain\.com/,
          // You can also use a function for advanced matching:
          (url) => url.startsWith("http://lms.lp.local/api"),
        ],
        sessionSampleRate: 100,
        sessionReplaySampleRate: 20,
        trackBfcacheViews: true,
        defaultPrivacyLevel: "mask-user-input",
        trackUserInteractions: true,
      });
      if (user) {
        datadogRum.setUser({
          id: user.id,
          name: user.fullName ? user.fullName : undefined,
          email: user.emailAddresses?.[0]?.emailAddress ?? undefined,
        });
      } else {
        datadogRum.clearUser();
      }
    }
  }, [user]);

  return children;
}
