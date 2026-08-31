/**
 * The marketing pages, indexed for the sitewide search overlay.
 *
 * Hand-written rather than derived from the route tree. A route knows its own
 * path but not what somebody would type to look for it: "hire a physician",
 * "request coverage" and "staffing request" all have to find /client-inquiry,
 * and only a person can write that down.
 *
 * Kept in step with the sitemap's static routes. The coming-soon pages that
 * carry a noindex are deliberately absent — if we are telling Google not to
 * index them, we should not be surfacing them in our own search either.
 */
export type SearchPage = {
  title: string;
  path: string;
  blurb: string;
  /** Words people search for that the title does not contain. */
  keywords: string;
};

export const SEARCH_PAGES: SearchPage[] = [
  {
    title: "Home",
    path: "/",
    blurb: "Physician-founded locum tenens and permanent staffing",
    keywords: "orchard home main start",
  },
  {
    title: "Open Jobs",
    path: "/jobs",
    blurb: "Search every live assignment",
    keywords: "job board openings roles positions vacancies search assignments work shifts",
  },
  {
    title: "Jobs by State & Specialty",
    path: "/locum-tenens-jobs",
    blurb: "Browse locum tenens roles by where and what",
    keywords: "locum tenens browse states specialties location map where",
  },
  {
    title: "Services",
    path: "/services",
    blurb: "Locum tenens, permanent placement and credentialing",
    keywords: "staffing solutions what we do offerings permanent perm placement credentialing",
  },
  {
    title: "Request Coverage",
    path: "/client-inquiry",
    blurb: "For hospitals and clinics that need a provider",
    keywords:
      "hospital facility client hire hiring need staff cover shift vacancy employer request coverage",
  },
  {
    title: "Locum Tenens for Providers",
    path: "/provider-inquiry",
    blurb: "Join the network and tell us what you are looking for",
    keywords:
      "provider physician doctor nurse crna pa np join network apply register sign up candidate",
  },
  {
    title: "Refer a Friend",
    path: "/refer-a-friend",
    blurb: "Refer a colleague to Orchard",
    keywords: "referral refer colleague bonus recommend friend",
  },
  {
    title: "About Us",
    path: "/about",
    blurb: "Who Orchard is and how we got here",
    keywords: "about company story history mission values who we are nalto napr",
  },
  {
    title: "Leadership",
    path: "/leadership",
    blurb: "The team behind Orchard",
    keywords: "leadership team founders ceo executives management saladi medical director",
  },
  {
    title: "Testimonials",
    path: "/testimonials",
    blurb: "What providers and hospitals say",
    keywords: "testimonials reviews references feedback quotes what people say",
  },
  {
    title: "Careers at Orchard",
    path: "/careers",
    blurb: "Work for Orchard, not through Orchard",
    keywords: "careers internal jobs work for us hiring recruiter employment join our team",
  },
  {
    title: "Investors",
    path: "/investors",
    blurb: "Invest in our growth",
    keywords: "investors investment funding raise capital growth partners shareholders",
  },
  {
    title: "Get in Touch",
    path: "/inquiry",
    blurb: "General enquiries",
    keywords: "contact us email phone call reach message enquiry inquiry get in touch support help",
  },
  {
    title: "Terms and Conditions",
    path: "/terms",
    blurb: "Website terms",
    keywords: "terms conditions legal policy agreement",
  },
  {
    title: "SMS Terms",
    path: "/sms-terms",
    blurb: "Text message programme terms",
    keywords: "sms text message terms opt in consent messaging",
  },
  {
    title: "SMS Privacy Policy",
    path: "/sms-privacy",
    blurb: "How we handle text message data",
    keywords: "sms privacy data policy text message opt out",
  },
];
