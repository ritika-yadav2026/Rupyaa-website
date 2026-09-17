import icon from "@/public/images/icon.png";
import logo from "@/public/images/logo.png";
import zapcashLogo from "@/public/images/brand_logo.png";
import paymentSuccess from "@/public/images/payment_success.png";
import noLoan from "@/public/images/no-loan.png";
import noPendingDocuments from "@/public/images/no-pending-documents.png";

/** Centralized image paths for home landing page */
export const HOME_IMAGES = {
  logo: "/images/logo.png",
  phoneMockup1: "/images/White and Black Minimalist Phone Mockup Instagram Story (1) 1.png",
  phoneMockup2: "/images/White and Black Minimalist Phone Mockup Instagram Story (1) 2.png",
  mockDevice: "/images/mock-device.png",
  /** Drop your asset at `public/images/how-it-works-phone.png` */
  howItWorksPhone: "/images/how-it-works-phone.png",
  /** Drop your asset at `public/images/credit-score-promo.png` */
  creditScorePromo: "/images/credit-score-promo.png",
  safetyShield: "/images/safety-shield.png?v=4",
  indiaDotMap: "/images/india-dot-map.png",
} as const;

export const IMAGES = {
  icon: icon,
  logo: logo,
  zapcashLogo: zapcashLogo,
  paymentSuccess: paymentSuccess,
  noLoan: noLoan,
  noPendingDocuments: noPendingDocuments,
};