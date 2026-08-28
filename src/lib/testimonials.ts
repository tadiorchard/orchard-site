import herdrichImg from "@/assets/1238-2024-09-11t220313-042.png";
import noggleImg from "@/assets/Todd.png";

/**
 * Shared by the homepage carousel and the full testimonials page, so the two
 * cannot drift apart — the page exists precisely to show every one of these.
 */
export type Testimonial = {
  quote: string;
  name: string;
  title?: string;
  /** Which side of the placement they sit on — a physician is not a client. */
  kind: "Provider" | "Client";
  /** Omit to show the stethoscope emblem instead of a headshot. */
  image?: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Orchard has been fantastic to work with — fast reimbursements, timely payments, and outstanding support. I highly recommend them. It's been a great experience!",
    name: "A. M. A., MD",
    kind: "Provider",
  },
  {
    quote:
      "As Director of Operations for a large healthcare system, I quickly recognized Orchard as our partner of choice for locum tenens hospitalists. Orchard consistently stood out for their quality outcomes, responsiveness, and strong relationships. When I moved to a new role overseeing 47 physician practices, I again chose Orchard for our staffing needs. They swiftly provided credentialed physicians who contributed to excellent quality metrics and positive patient experiences. Though we have since hired our own team, we value Orchard as a reliable partner when needed.",
    name: "Bob",
    title: "Vice President",
    kind: "Client",
    image: herdrichImg,
  },
  {
    quote:
      "It has been a true pleasure working with you and your team. I completely understand that some processes take a little extra time, but I really appreciate Orchard's dedication, responsiveness, and partnership throughout it all. Your support made a big difference!",
    name: "T. N.",
    title: "Sr. Credentialing Partner",
    kind: "Client",
  },
  {
    quote:
      "Working with Orchard has been a positive experience. Their team consistently delivers excellent service, always responsive, professional, and dedicated to finding the right fit for our needs. They work hard at making the staffing process seamless, and I couldn't be more satisfied with the results. Highly recommend!",
    name: "Todd",
    title: "Healthcare Administrator",
    kind: "Client",
    image: noggleImg,
  },
  {
    quote:
      "It has been a while since I've seen such a meticulously completed application! Thank you all for your consistent collaboration; it makes this process much smoother and easier for everyone.",
    name: "T. N.",
    title: "Sr. Credentialing Partner",
    kind: "Client",
  },
];
