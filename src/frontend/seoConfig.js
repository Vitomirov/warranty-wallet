export const seoConfig = {
  // Public/Marketing Pages (Crucial for external SEO)
  "/": {
    title: "Warranty Wallet | Store Guarantees and Receipts in One Place",
    meta: [
      {
        name: "description",
        content:
          "Never lose warranties and receipts again. Digitize, organize, and track all your guarantees easily and securely. Free application.",
      },
      {
        name: "keywords",
        content:
          "warranty, receipt, digitization, warranty wallet, storing guarantees, electronic warranties",
      },
      {
        property: "og:title",
        content: "Warranty Wallet: Digital Wallet for Your Guarantees",
      },
      {
        property: "og:description",
        content:
          "Digitize all warranties and receipts. Easy management and reminders.",
      },
    ],
  },
  "/login": {
    title: "Login | Warranty Wallet",
    meta: [
      {
        name: "description",
        content:
          "Log in to Warranty Wallet and access your digital guarantees.",
      },
    ],
  },
  "/signup": {
    title: "Sign Up | Warranty Wallet",
    meta: [
      {
        name: "description",
        content:
          "Register for free and start digitizing your warranties and receipts today.",
      },
    ],
  },
  "/about": {
    title: "About Us | Warranty Wallet",
    meta: [
      {
        name: "description",
        content:
          "Learn about the Warranty Wallet mission and how we simplify life for users.",
      },
    ],
  },
  "/features": {
    title: "Features | Warranty Wallet",
    meta: [
      {
        name: "description",
        content:
          "Overview of all advanced app features: automated reminders, AI chat, and secure document storage.",
      },
    ],
  },
  "/faq": {
    title: "FAQ | Warranty Wallet",
    meta: [
      {
        name: "description",
        content:
          "Answers to frequently asked questions about registration, document storage, and app security.",
      },
    ],
  },

  // Private/Application Pages (Important for UX)
  "/dashboard": {
    title: "Dashboard | My Warranties",
    meta: [
      {
        name: "description",
        content:
          "Overview of all active and expired warranties with clear status.",
      },
    ],
  },
  "/myaccount": {
    title: "My Account | Warranty Wallet",
    meta: [
      {
        name: "description",
        content:
          "Manage your profile settings, subscription, and security preferences.",
      },
    ],
  },
  "/newwarranty": {
    title: "New Warranty | Add Document",
    meta: [
      {
        name: "description",
        content: "Form to easily upload and categorize new warranty documents.",
      },
    ],
  },

  // Dynamic Routes
  "/warranties/details/:id": {
    title: "Warranty Details | Viewing Document",
    meta: [
      {
        name: "description",
        content:
          "Viewing specific warranty details and attached proof of purchase.",
      },
    ],
  },
  "/warranties/delete/:id": {
    title: "Delete Warranty | Confirmation",
    meta: [
      {
        name: "description",
        content:
          "Confirmation step before permanently deleting a warranty document.",
      },
    ],
  },
};
