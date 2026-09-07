export const personalLoanSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://zapcash.in/personal-loan#webpage",
        url: "https://zapcash.in/personal-loan",
        name: "Personal Loan - ZapCash",
        description:
          "Apply for an unsecured personal loan of up to Rs. 5,00,000 through ZapCash with digital KYC, transparent charges, and lender approval.",
        isPartOf: { "@id": "https://zapcash.in/#website" },
        about: { "@id": "https://zapcash.in/personal-loan#loan" },
        inLanguage: "en-IN",
      },
      {
        "@type": "LoanOrCredit",
        "@id": "https://zapcash.in/personal-loan#loan",
        name: "Personal Loan from ZapCash",
        description:
          "Apply for an unsecured personal loan of up to Rs. 5,00,000 through ZapCash, subject to eligibility, KYC, credit profile, and lending partner approval.",
        provider: { "@id": "https://zapcash.in/#organization" },
        loanType: "Personal loan",
        amount: {
          "@type": "MonetaryAmount",
          currency: "INR",
          maxValue: 500000,
        },
        areaServed: { "@type": "Country", name: "India" },
      },
      {
        "@type": "FAQPage",
        "@id": "https://zapcash.in/personal-loan#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Who can I contact for grievances or support?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can reach out to customer support or the grievance redressal officer through the contact details provided on the website, app, or loan documents.",
            },
          },
          {
            "@type": "Question",
            name: "How can I avail a business loan from you?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You can select and apply for a suitable loan for your business needs through our website or you can submit your contact details with requirement and our team will contact you.",
            },
          },
          {
            "@type": "Question",
            name: "Where can I use this loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The loan must be utilized strictly for the purpose for which it has been sanctioned. For example, a business loan should be used only for business-related activities. In the case of a personal loan, the borrower may use the funds for any legitimate purpose. However, under no circumstances shall the loan be used for any unlawful activities, including fraud or activities related to terrorism, in compliance with applicable KYC/AML guidelines and the provisions of the Prevention of Money Laundering Act (PMLA).",
            },
          },
          {
            "@type": "Question",
            name: "What documents are needed to apply?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "You may be required to submit valid identity proof, address proof, PAN, income-related documents, and bank statements, as applicable. Additional documents may be requested based on the loan type and internal policies.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to arrange a collateral for this loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No, this is an unsecured loan, so no collateral or security is required. The loan is sanctioned based on eligibility, creditworthiness, and repayment capacity.",
            },
          },
        ],
      },
    ],
  };


export const zapcashJsonLdSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "FinancialService"],
      "@id": "https://zapcash.in/#organization",
      name: "ZapCash",
      legalName: "Omnistack Innovation Private Limited",
      url: "https://zapcash.in/",
      telephone: "+91-8503090309",
      address: {
        "@type": "PostalAddress",
        streetAddress: "379, Ground Floor, World Trade Centre",
        addressLocality: "Babar Lane",
        addressRegion: "New Delhi",
        postalCode: "110001",
        addressCountry: "IN",
      },
      logo: {
        "@type": "ImageObject",
        "@id": "https://zapcash.in/#logo",
        url: "https://zapcash.in/images/logo.png",
      },
      image:
        "https://zapcash-assets.s3.ap-south-1.amazonaws.com/zapcash-og-image.jpg",
      priceRange: "Personal loans up to Rs. 5,00,000",
      description:
        "ZapCash helps eligible users apply for unsecured personal loans of up to Rs. 5,00,000 through a digital process.",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
      brand: {
        "@type": "Brand",
        name: "ZapCash",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer support",
          telephone: "+91-8503090309",
          url: "https://zapcash.in/support",
          areaServed: "IN",
          availableLanguage: ["en-IN", "hi-IN"],
        },
      ],
      sameAs: ["https://play.google.com/store/apps/details?id=com.zapcash.loan"],
    },
    {
      "@type": "WebSite",
      "@id": "https://zapcash.in/#website",
      name: "ZapCash",
      url: "https://zapcash.in/",
      publisher: {
        "@id": "https://zapcash.in/#organization",
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "MobileApplication",
      "@id": "https://zapcash.in/#mobileapp",
      name: "ZapCash",
      operatingSystem: "Android",
      applicationCategory: "FinanceApplication",
      url: "https://play.google.com/store/apps/details?id=com.zapcash.loan",
      publisher: {
        "@id": "https://zapcash.in/#organization",
      },
    },
  ],
};


  export const emiCalculatorSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://zapcash.in/emi-calculator#webpage",
        url: "https://zapcash.in/emi-calculator",
        name: "Free Personal Loan EMI Calculator - ZapCash",
        description:
          "Use the ZapCash EMI calculator to estimate monthly EMI, repayment amount, interest, and tenure for a personal loan.",
        isPartOf: { "@id": "https://zapcash.in/#website" },
        inLanguage: "en-IN",
      },
      {
        "@type": "WebApplication",
        "@id": "https://zapcash.in/emi-calculator#calculator",
        name: "Personal Loan EMI Calculator",
        url: "https://zapcash.in/emi-calculator",
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        publisher: { "@id": "https://zapcash.in/#organization" },
      },
    ],
  };


  export const lendersPageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://zapcash.in/lenders#webpage",
        url: "https://zapcash.in/lenders",
        name: "ZapCash Lending Partners",
        description:
          "ZapCash works with Weekline Investment and Trading Company Ltd, an RBI-registered NBFC, for loan sanction and ownership.",
        isPartOf: { "@id": "https://zapcash.in/#website" },
        about: { "@id": "https://zapcash.in/lenders#weekline" },
        inLanguage: "en-IN",
      },
      {
        "@type": "FinancialService",
        "@id": "https://zapcash.in/lenders#weekline",
        name: "Weekline Investment and Trading Company Ltd",
        description: "RBI-registered NBFC lending partner for ZapCash loans.",
        address: {
          "@type": "PostalAddress",
          streetAddress: "79, Ground Floor, World Trade Centre, Barar Lane",
          addressLocality: "New Delhi",
          postalCode: "110001",
          addressCountry: "IN",
        },
        email: "grievance@weekline.in",
        identifier: {
          "@type": "PropertyValue",
          name: "RBI Registration Number",
          value: "14.01001",
        },
      },
    ],
  };


  export const homepageSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://zapcash.in/#webpage",
        url: "https://zapcash.in/",
        name: "ZapCash - Instant Personal Loan App",
        description:
          "Apply for an unsecured personal loan of up to Rs. 5,00,000 with ZapCash through a secure digital process, subject to eligibility and lender approval.",
        isPartOf: {
          "@id": "https://zapcash.in/#website",
        },
        about: {
          "@id": "https://zapcash.in/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://zapcash.in/images/bannerNew.png",
        },
        inLanguage: "en-IN",
      },
      {
        "@type": "LoanOrCredit",
        "@id": "https://zapcash.in/#loan-product",
        name: "ZapCash Personal Loan",
        description:
          "Unsecured personal loan of up to Rs. 5,00,000, subject to borrower eligibility, KYC, credit profile, and lending partner approval.",
        provider: {
          "@id": "https://zapcash.in/#organization",
        },
        loanType: "Personal loan",
        amount: {
          "@type": "MonetaryAmount",
          currency: "INR",
          maxValue: 500000,
        },
        areaServed: {
          "@type": "Country",
          name: "India",
        },
      },
      {
        "@type": "FAQPage",
        "@id": "https://zapcash.in/#faq",
        mainEntity: [
          {
            "@type": "Question",
            name: "Do I need to arrange a collateral for this loan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No, this is an unsecured loan, and therefore, no collateral or security is required to avail of the loan. The loan is sanctioned based on the borrower's eligibility, creditworthiness, and repayment capacity.",
            },
          },
          {
            "@type": "Question",
            name: "What is the interest rate and processing fee?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Interest starts from 3% per month. A one-time processing fee of up to 10% plus GST is charged when the loan is approved.",
            },
          },
          {
            "@type": "Question",
            name: "What is the Key Fact Statement (KFS) and when is it provided?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Key Fact Statement (KFS) summarizes important loan terms, including interest rate, charges, and repayment details. It is provided before execution of the loan agreement.",
            },
          },
        ],
      },
    ],
  };


  export const supportPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://zapcash.in/support#webpage",
    url: "https://zapcash.in/support",
    name: "ZapCash Support",
    description:
      "Contact ZapCash support for questions about loan applications, repayment, documents, or complaints.",
    isPartOf: { "@id": "https://zapcash.in/#website" },
    about: { "@id": "https://zapcash.in/#organization" },
    inLanguage: "en-IN",
  };

export const creditScoreSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://zapcash.in/credit-score#webpage",
      url: "https://zapcash.in/credit-score",
      name: "Check Credit Score Free — Instant Report Online",
      description:
        "Check your credit score and full report free in under a minute. Understand the new RBI weekly reporting rules effective 1 July 2026.",
      inLanguage: "en-IN",
      isPartOf: { "@id": "https://zapcash.in/#website" },
      publisher: { "@id": "https://zapcash.in/#organization" },
      dateModified: "2026-08-04",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://zapcash.in/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Credit Score",
            item: "https://zapcash.in/credit-score",
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": "https://zapcash.in/credit-score#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is checking my credit score on ZapCash really free?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. There is no charge and no card required. You get your Equifax score and full report at no cost.",
          },
        },
        {
          "@type": "Question",
          name: "Will checking my score affect it?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. This is a soft enquiry, a consumer-initiated check that is not visible to lenders and has no effect on your score.",
          },
        },
        {
          "@type": "Question",
          name: "Why is the score here different from my CIBIL score?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "This page shows your Equifax score. Different bureaus use different scoring models, and not every lender reports to every bureau. A gap of 30 to 50 points is normal and does not mean either score is inaccurate.",
          },
        },
        {
          "@type": "Question",
          name: "How often does my credit score update?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Since 1 July 2026, lenders report to credit bureaus four times a month on the 9th, 16th, 23rd and the last day, with a full file submission by the 5th of the following month.",
          },
        },
        {
          "@type": "Question",
          name: "What is a good credit score in India?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "750 and above is generally treated as strong. 700 to 749 is good. Below 650, lenders examine the rest of your profile more closely.",
          },
        },
        {
          "@type": "Question",
          name: "Can I check my credit score with only an Aadhaar card?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. A PAN is required. Credit bureaus use PAN as the primary identifier for consumer credit records.",
          },
        },
        {
          "@type": "Question",
          name: "What does NA or NH mean on my credit report?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It means there is no credit history to score, either because you have never borrowed or because there has been no reportable activity in the last 24 months. It is not a negative mark.",
          },
        },
        {
          "@type": "Question",
          name: "How do I fix a mistake on my credit report?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Raise a dispute with the bureau that issued the report. The bureau is required to investigate with the lender that submitted the data and correct anything found to be incorrect.",
          },
        },
      ],
    },
  ],
};