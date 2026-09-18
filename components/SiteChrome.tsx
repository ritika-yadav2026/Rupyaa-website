"use client";

import type { ReactElement, ReactNode } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/home/Footer";
import { cn } from "@/utils/cn-utils";

export type SiteChromeProps = {
  readonly children: ReactNode;
  /** Include the shared footer. Default true. */
  readonly showFooter?: boolean;
  /**
   * Force-hide header/footer. When omitted, hides automatically for `?source=mobile`.
   */
  readonly hideChrome?: boolean;
  readonly className?: string;
  readonly mainClassName?: string;
  readonly mainId?: string;
};

type SiteChromeInnerProps = SiteChromeProps;

/**
 * Resolves whether site chrome should hide (explicit prop or mobile WebView source).
 */
function useShouldHideChrome(hideChrome: boolean | undefined): boolean {
  const searchParams = useSearchParams();
  if (hideChrome !== undefined) {
    return hideChrome;
  }
  return searchParams.get("source") === "mobile";
}

function SiteChromeInner({
  children,
  showFooter = true,
  hideChrome,
  className = "min-h-screen bg-white",
  mainClassName = "",
  mainId = "main-content",
}: SiteChromeInnerProps): ReactElement {
  const shouldHideChrome = useShouldHideChrome(hideChrome);

  let header: ReactNode = null;
  if (!shouldHideChrome) {
    header = <AppHeader />;
  }

  let footer: ReactNode = null;
  if (showFooter && !shouldHideChrome) {
    footer = <Footer />;
  }

  let mainPaddingClassName = "";
  if (!shouldHideChrome) {
    mainPaddingClassName = "pt-16";
  }

  return (
    <div className={className}>
      {header}
      <main
        id={mainId}
        tabIndex={-1}
        className={cn("outline-none", mainClassName, mainPaddingClassName)}
      >
        {children}
      </main>
      {footer}
    </div>
  );
}

function SiteChromeFallback({
  children,
  showFooter = true,
  className = "min-h-screen bg-white",
  mainClassName = "",
  mainId = "main-content",
}: Omit<SiteChromeProps, "hideChrome">): ReactElement {
  return (
    <div className={className}>
      <AppHeader />
      <main
        id={mainId}
        tabIndex={-1}
        className={cn("outline-none", mainClassName, "pt-16")}
      >
        {children}
      </main>
      {showFooter ? <Footer /> : null}
    </div>
  );
}

/**
 * Shared public-page shell: one AppHeader + optional Footer for all marketing/content screens.
 * Authenticated `(app)` routes keep using AppShell (which already mounts AppHeader).
 */
export default function SiteChrome(props: SiteChromeProps): ReactElement {
  return (
    <Suspense
      fallback={
        <SiteChromeFallback
          showFooter={props.showFooter}
          className={props.className}
          mainClassName={props.mainClassName}
          mainId={props.mainId}
        >
          {props.children}
        </SiteChromeFallback>
      }
    >
      <SiteChromeInner {...props} />
    </Suspense>
  );
}
