const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://dejanvitomirov.com/warrantywallet";

export const marketingMetadata = {
  "/": {
    title: "Warranty Wallet | Store Guarantees and Receipts in One Place",
    description:
      "Never lose warranties and receipts again. Digitize, organize, and track all your guarantees easily and securely. Free application.",
    keywords:
      "warranty, receipt, digitization, warranty wallet, storing guarantees, electronic warranties",
    openGraph: {
      title: "Warranty Wallet: Digital Wallet for Your Guarantees",
      description:
        "Digitize all warranties and receipts. Easy management and reminders.",
    },
  },
  "/about": {
    title: "About Us",
    description:
      "Learn about the Warranty Wallet mission and how we simplify life for users.",
  },
  "/features": {
    title: "Features",
    description:
      "Overview of all advanced app features: automated reminders, AI chat, and secure document storage.",
  },
  "/faq": {
    title: "FAQ",
    description:
      "Answers to frequently asked questions about registration, document storage, and app security.",
  },
  "/login": {
    title: "Log In",
    description:
      "Sign in to your Warranty Wallet account to manage warranties and receipts.",
  },
};

export function buildPageMetadata(path) {
  const config = marketingMetadata[path] || marketingMetadata["/"];

  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
      url: path === "/" ? siteUrl : `${siteUrl}${path}`,
      siteName: "Warranty Wallet",
      locale: "en_US",
      type: "website",
    },
  };
}
