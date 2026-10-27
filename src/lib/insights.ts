import articleHero from "@/assets/info-consultation.jpg";
import locumCoverageHero from "@/assets/article-2.png";
import locumCoveragePlanning from "@/assets/article-2.1.png";
import physicianLocumHero from "@/assets/Article-3.png";
import assignmentChecklistHero from "@/assets/Article-4.png";

/**
 * Insights & Resources — the articles and the shape they are written in.
 *
 * Bodies are blocks rather than a string of HTML. The article page renders
 * them, the index derives its previews from them, and the Article schema takes
 * its word count and headline from the same source — so nothing can drift
 * between what a reader sees and what a crawler is told.
 *
 * To publish another piece, add an entry. Everything else — the index card,
 * the sitemap, the schema, the related links — follows from it.
 */
export type Block =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "ul"; items: string[] }
  /** An in-body image. `src` is an imported asset, for the same reason as `image`. */
  | { kind: "img"; src: string; alt: string };

export type Article = {
  slug: string;
  /**
   * Imported asset for the article hero. Imported rather than a string path so
   * a missing file is a build error instead of a broken image in production,
   * and so the hashed filename comes from the bundler.
   */
  image: string;
  /** What the hero shows — never decorative, it carries the page's meaning. */
  imageAlt: string;
  title: string;
  /** Shown on the card and used as the meta description. Keep under 155. */
  summary: string;
  /** ISO date. Drives both the visible date and datePublished. */
  published: string;
  /** Reading time is computed, never typed — see readingMinutes(). */
  topic: string;
  audience: "Hospitals" | "Providers" | "Both";
  body: Block[];
  /**
   * The closing call to action. Omit it and the article gets
   * DEFAULT_ARTICLE_CTA, which asks organisations about coverage — the right
   * close for a piece written for them, and the wrong one for a piece written
   * for physicians, who should be pointed at the board instead.
   */
  cta?: ArticleCta;
};

export type ArticleCta = {
  heading: string;
  paragraphs: string[];
  /** Button text. The arrow is the page's, not part of the label. */
  label: string;
  /** Internal route the button goes to, e.g. "/jobs". */
  to: string;
};

export const DEFAULT_ARTICLE_CTA: ArticleCta = {
  heading: "Partner with Orchard for your healthcare staffing needs",
  paragraphs: [
    "Staffing challenges do not always have a simple solution. Every organization has different requirements, specialties, timelines, and workforce goals — whether you are facing a physician vacancy, preparing for an upcoming leave, navigating a difficult recruitment process, or exploring locum tenens coverage.",
    "Tell us what your organization needs, and our team can help you explore staffing solutions that fit your goals.",
  ],
  label: "Talk to Orchard about your staffing needs",
  to: "/inquiry",
};

export const ARTICLES: Article[] = [
  {
    slug: "strategic-approach-to-healthcare-staffing",
    image: articleHero,
    imageAlt: "A physician sitting with a patient during a consultation",
    title: "Beyond Filling Vacancies: A Strategic Approach to Healthcare Staffing",
    summary:
      "Why coverage gaps are a workforce planning problem, not a recruiting one — and how flexible staffing fits alongside permanent hiring.",
    published: "2026-09-10",
    topic: "Workforce Strategy",
    audience: "Hospitals",
    body: [
      {
        kind: "p",
        text: "Healthcare organizations face staffing challenges for many reasons. Physician vacancies, provider shortages, extended leaves of absence, changing patient volumes, and lengthy recruitment and credentialing processes can make it difficult to maintain consistent clinical coverage.",
      },
      {
        kind: "p",
        text: "Effective healthcare staffing is about more than filling an open position. It means understanding an organization's immediate needs while also considering long-term workforce goals, patient care, clinical operations, and the ability to respond to change.",
      },
      {
        kind: "p",
        text: "Flexible staffing solutions, including locum tenens, can provide organizations with additional options when traditional recruitment timelines do not meet immediate coverage needs. When incorporated into a broader workforce strategy, these solutions can help maintain coverage, support clinical teams, and provide greater flexibility during periods of transition.",
      },

      { kind: "h2", text: "The Changing Healthcare Workforce" },
      {
        kind: "p",
        text: "Healthcare organizations depend on qualified providers to meet the needs of their patients, but maintaining appropriate staffing levels is not always easy.",
      },
      {
        kind: "p",
        text: "A physician may leave unexpectedly, a provider may take an extended leave, patient volume may increase, or a permanent recruitment search may take longer than anticipated. Licensing, credentialing, and onboarding can also add time to the process.",
      },
      { kind: "p", text: "Meanwhile, patient care continues." },
      {
        kind: "p",
        text: "For healthcare leaders, this creates the need to address immediate staffing requirements while keeping long-term workforce plans in place.",
      },

      { kind: "h2", text: "Moving Beyond a Vacancy-Focused Approach" },
      {
        kind: "p",
        text: "When a provider position becomes vacant, the natural response is to begin searching for a replacement. Permanent recruitment remains essential to building a strong clinical workforce, but it may not solve an immediate coverage gap.",
      },
      {
        kind: "p",
        text: "A strategic approach considers both the immediate need and the long-term objective.",
      },
      {
        kind: "p",
        text: "For example, an organization can continue its search for a permanent physician while exploring temporary coverage options. This can help maintain services while giving the recruitment team time to find a provider who is the right long-term fit.",
      },
      {
        kind: "p",
        text: "The goal is not simply to fill a vacancy as quickly as possible. It is to develop a staffing plan that supports patient care, clinical teams, and organizational priorities.",
      },

      { kind: "h2", text: "The Role of Flexible Healthcare Staffing Solutions" },
      {
        kind: "p",
        text: "Flexible staffing can be particularly useful when an organization's needs do not align with a traditional hiring timeline.",
      },
      {
        kind: "p",
        text: "Locum tenens is one option that healthcare organizations can consider. Depending on the need, locum providers can offer coverage for short-term assignments, extended periods, or ongoing staffing requirements.",
      },
      { kind: "p", text: "Flexible staffing may be helpful when organizations are managing:" },
      {
        kind: "ul",
        items: [
          "Physician vacancies",
          "Planned or unexpected leaves of absence",
          "Changes in patient volume",
          "Recruitment and credentialing timelines",
          "Expansion of clinical services",
          "Short-term or long-term coverage needs",
          "Unexpected changes in provider availability",
        ],
      },
      {
        kind: "p",
        text: "The right solution depends on factors such as specialty, schedule, length of coverage, clinical setting, and provider qualifications.",
      },

      { kind: "h2", text: "Supporting Clinical Teams and Continuity of Care" },
      {
        kind: "p",
        text: "A staffing shortage affects more than an organization's schedule. When a position remains open, existing physicians and clinical staff may take on additional responsibilities.",
      },
      {
        kind: "p",
        text: "Over time, this can create additional pressure on the team and affect day-to-day operations.",
      },
      {
        kind: "p",
        text: "Temporary provider coverage can help distribute responsibilities while an organization continues working toward a longer-term staffing solution.",
      },
      {
        kind: "p",
        text: "Staffing decisions also have an impact on patients. Provider vacancies can affect appointment availability, service capacity, and access to care. Maintaining appropriate coverage can help organizations continue serving their communities while managing workforce transitions.",
      },

      { kind: "h2", text: "Balancing Immediate Needs With Long-Term Goals" },
      {
        kind: "p",
        text: "Temporary coverage and permanent recruitment do not have to be competing strategies. In many situations, they can work together.",
      },
      {
        kind: "p",
        text: "An organization may need a provider immediately while continuing to search for a permanent member of its clinical team. A locum provider can help address the immediate need while the organization takes the necessary time to evaluate permanent candidates.",
      },
      {
        kind: "p",
        text: "This can be especially valuable for difficult-to-recruit specialties or positions where finding the right long-term provider may take time.",
      },
      {
        kind: "p",
        text: "By considering immediate coverage and permanent recruitment as parts of the same healthcare workforce strategy, organizations can create more flexibility in how they respond to staffing challenges.",
      },

      { kind: "h2", text: "The Importance of the Right Provider-Organization Match" },
      {
        kind: "p",
        text: "Finding a qualified provider is only one part of successful provider staffing.",
      },
      {
        kind: "p",
        text: "Organizations should also consider clinical experience, specialty, schedule, practice environment, patient population, location, and other requirements. Providers have their own professional preferences and goals as well.",
      },
      { kind: "p", text: "A strong match takes both sides into consideration." },
      {
        kind: "p",
        text: "An experienced healthcare staffing partner can help organizations evaluate these factors and connect them with providers whose qualifications and availability align with the specific need.",
      },
      {
        kind: "p",
        text: "The goal should be to find the right provider for the right opportunity, rather than simply the first provider available.",
      },

      { kind: "h2", text: "Building a Proactive Workforce Strategy" },
      {
        kind: "p",
        text: "Not every staffing challenge can be predicted, but organizations can prepare for potential workforce changes.",
      },
      { kind: "p", text: "A proactive approach may include:" },
      {
        kind: "ul",
        items: [
          "Identifying difficult-to-recruit specialties",
          "Reviewing potential coverage gaps",
          "Planning for known leaves of absence",
          "Monitoring changes in patient volume",
          "Understanding recruitment and credentialing timelines",
          "Evaluating temporary staffing options",
          "Maintaining relationships with qualified providers",
        ],
      },
      {
        kind: "p",
        text: "Planning ahead gives healthcare organizations more options when a staffing need arises and can reduce the pressure of making decisions at the last minute.",
      },

      { kind: "h2", text: "Choosing the Right Healthcare Staffing Partner" },
      {
        kind: "p",
        text: "Healthcare staffing involves many moving parts, and every organization has different requirements.",
      },
      {
        kind: "p",
        text: "A strong staffing partner should take the time to understand the organization's specialty needs, coverage requirements, clinical environment, provider qualifications, and timeline.",
      },
      {
        kind: "p",
        text: "Clear communication is equally important. Organizations should understand the staffing process and expectations, while providers should have a clear understanding of the opportunity.",
      },
      {
        kind: "p",
        text: "Whether the need involves physician recruitment, locum tenens, or other healthcare staffing solutions, the right partner can help organizations navigate the process more effectively.",
      },

      { kind: "h2", text: "Looking Ahead" },
      {
        kind: "p",
        text: "Healthcare workforce needs will continue to change. Patient demand, provider availability, recruitment timelines, and organizational priorities can all influence when staffing support is needed.",
      },
      {
        kind: "p",
        text: "Healthcare staffing should therefore be viewed as more than a response to an open position. It is an ongoing process of aligning qualified providers with the organizations and communities that need them.",
      },
      {
        kind: "p",
        text: "By combining permanent recruitment with flexible staffing strategies when appropriate, healthcare organizations can create workforce plans that are better prepared to respond to both immediate challenges and long-term needs.",
      },

      { kind: "h2", text: "Conclusion" },
      {
        kind: "p",
        text: "Healthcare organizations need more than a quick solution to today's vacancy. They need staffing strategies that can adapt as their needs evolve.",
      },
      {
        kind: "p",
        text: "Whether an organization is managing an unexpected physician departure, supporting a team during an extended leave, navigating a lengthy recruitment process, or responding to increased patient demand, flexible staffing can provide valuable support.",
      },
      {
        kind: "p",
        text: "Ultimately, strategic healthcare staffing is about finding the right balance between immediate coverage, long-term workforce planning, provider fit, and continuity of care.",
      },
      {
        kind: "p",
        text: "The goal is not simply to fill a vacancy. It is to help healthcare organizations build stronger, more flexible clinical teams prepared to serve their patients and communities.",
      },
    ],
  },
  {
    slug: "locum-tenens-coverage-flexible-staffing-solution",
    image: locumCoverageHero,
    imageAlt: "A physician talking with two colleagues in scrubs in a hospital corridor",
    title: "Locum Tenens Coverage: A Flexible Solution for Healthcare Staffing Needs",
    summary:
      "How temporary physician coverage helps organizations hold services steady through vacancies, leaves, rising patient volume, and credentialing delays.",
    published: "2026-09-22",
    topic: "Locum Tenens",
    audience: "Hospitals",
    body: [
      {
        kind: "p",
        text: "Healthcare organizations need qualified physicians to provide consistent patient care, but staffing needs can change quickly. Physician vacancies, extended leaves of absence, increased patient volume, recruitment delays, and unexpected coverage gaps can all create challenges for healthcare teams.",
      },
      {
        kind: "p",
        text: "Locum tenens coverage can provide a flexible way for organizations to address these staffing needs while continuing to focus on long-term workforce planning.",
      },
      {
        kind: "p",
        text: "Whether coverage is needed for a few weeks, several months, or an ongoing period, locum tenens can help organizations maintain access to qualified physicians when they need additional support.",
      },

      { kind: "h2", text: "What Is Locum Tenens Coverage?" },
      {
        kind: "p",
        text: "Locum tenens refers to physicians who provide temporary clinical services for a healthcare organization.",
      },
      {
        kind: "p",
        text: "The length and structure of an assignment can vary depending on the organization's needs. Some physicians may provide coverage for a short-term absence, while others may support an organization for several months or longer.",
      },
      {
        kind: "p",
        text: "Locum tenens coverage can be used across a wide range of specialties and healthcare settings, making it a flexible option for organizations managing different types of staffing challenges.",
      },
      {
        kind: "p",
        text: "Rather than committing to a permanent staffing decision immediately, organizations can use temporary physician coverage to address an immediate need while determining the best long-term solution.",
      },

      { kind: "h2", text: "When Is Locum Tenens Coverage Used?" },
      {
        kind: "p",
        text: "Healthcare organizations may consider locum tenens coverage for several different situations.",
      },

      { kind: "h2", text: "Physician Vacancies" },
      {
        kind: "p",
        text: "Recruiting a permanent physician can take time. During the recruitment process, an organization may still need to maintain patient access and clinical coverage.",
      },
      {
        kind: "p",
        text: "A locum tenens physician can provide support while the organization continues searching for a permanent provider. This can give healthcare leaders additional time to evaluate candidates without leaving an ongoing coverage gap.",
      },

      { kind: "h2", text: "Extended Leaves of Absence" },
      {
        kind: "p",
        text: "A physician's extended absence can create scheduling challenges and place additional responsibilities on other members of the clinical team.",
      },
      {
        kind: "p",
        text: "Locum tenens coverage can help maintain staffing during planned or unexpected leaves, providing temporary support until the permanent physician returns.",
      },

      { kind: "h2", text: "Increased Patient Volume" },
      {
        kind: "p",
        text: "Patient demand can fluctuate throughout the year. Seasonal trends, changes in community needs, or the expansion of services may temporarily increase the demand for physician services.",
      },
      {
        kind: "p",
        text: "Temporary physician coverage can provide additional clinical capacity during these periods while an organization evaluates its longer-term staffing requirements.",
      },

      { kind: "h2", text: "Recruitment and Credentialing Delays" },
      {
        kind: "p",
        text: "Finding a permanent physician is only one part of the hiring process. Licensing, credentialing, privileging, and onboarding can require additional time before a new provider can begin practicing.",
      },
      {
        kind: "p",
        text: "Locum tenens can help bridge the gap between selecting a permanent candidate and that provider's start date, allowing organizations to maintain coverage during the transition.",
      },

      { kind: "h2", text: "How Does Locum Tenens Coverage Work?" },
      {
        kind: "p",
        text: "The process typically begins by identifying the organization's specific staffing needs.",
      },
      {
        kind: "p",
        text: "This may include the specialty required, anticipated start date, assignment length, schedule, clinical responsibilities, licensing requirements, and other qualifications.",
      },
      {
        kind: "img",
        src: locumCoveragePlanning,
        alt: "A physician, an administrator, and a nurse reviewing staffing documents together at a table",
      },
      {
        kind: "p",
        text: "A staffing partner can then help identify physicians whose experience, availability, and credentials align with the assignment.",
      },
      {
        kind: "p",
        text: "Once a physician is identified, the organization and physician can work through the necessary credentialing, licensing, scheduling, and onboarding requirements. The physician then provides coverage according to the agreed-upon assignment.",
      },
      {
        kind: "p",
        text: "Because every organization has different requirements, the structure of a locum tenens assignment can vary. Some assignments may involve a limited number of shifts, while others may provide coverage for several months or longer.",
      },

      { kind: "h2", text: "Benefits of Locum Tenens Coverage for Healthcare Organizations" },
      { kind: "p", text: "One of the primary benefits of locum tenens is flexibility." },
      {
        kind: "p",
        text: "Organizations can consider temporary coverage based on the specific nature and duration of their staffing needs. This can be particularly useful when circumstances are changing or when the organization is not yet ready to make a permanent staffing decision.",
      },
      { kind: "p", text: "Locum tenens coverage may also help organizations:" },
      {
        kind: "ul",
        items: [
          "Maintain physician coverage during recruitment",
          "Support clinical teams during extended absences",
          "Respond to temporary increases in patient volume",
          "Maintain access to services during staffing transitions",
          "Provide time to identify the right permanent candidate",
          "Address short-term, long-term, or ongoing coverage needs",
        ],
      },
      {
        kind: "p",
        text: "Temporary coverage can also help reduce pressure on existing physicians and clinical staff when an open position or unexpected absence creates additional workload.",
      },

      { kind: "h2", text: "What Should Organizations Consider When Arranging Coverage?" },
      {
        kind: "p",
        text: "Before arranging locum tenens coverage, healthcare organizations should clearly define what they need.",
      },
      { kind: "p", text: "Important considerations may include:" },
      {
        kind: "ul",
        items: [
          "Specialty and qualifications: What specialty and level of experience are required?",
          "Schedule: What shifts, call responsibilities, or coverage dates need to be filled?",
          "Duration: Is coverage needed for several weeks, several months, or an ongoing period?",
          "Licensing and credentialing: Does the physician need a specific state license, and how long will credentialing take?",
          "Clinical environment: What type of facility, patient population, and practice setting will the physician support?",
          "Long-term staffing plans: Is temporary coverage intended to address an immediate gap while permanent recruitment continues?",
        ],
      },
      {
        kind: "p",
        text: "Having clear answers to these questions can help organizations and staffing partners identify physicians who are better aligned with the assignment.",
      },

      { kind: "h2", text: "Locum Tenens and Permanent Recruitment Can Work Together" },
      { kind: "p", text: "Locum tenens does not have to replace permanent recruitment." },
      { kind: "p", text: "In many situations, the two approaches can work alongside one another." },
      {
        kind: "p",
        text: "For example, an organization may begin recruiting for a permanent physician while using a locum tenens provider to maintain coverage during the search. This allows the organization to address an immediate staffing need while taking the time necessary to identify a permanent provider who fits its clinical and organizational requirements.",
      },
      {
        kind: "p",
        text: "This can be especially valuable when recruitment timelines are uncertain or when qualified candidates are difficult to find.",
      },

      { kind: "h2", text: "Need Locum Tenens Coverage?" },
      {
        kind: "p",
        text: "Every healthcare organization has different staffing needs. At Orchard, we work with healthcare organizations to understand their coverage requirements and connect them with qualified physicians based on specialty, experience, availability, licensing, and assignment needs.",
      },
      {
        kind: "p",
        text: "Whether you need short-term coverage, support during a recruitment process, or an ongoing physician staffing solution, our team can help you explore flexible options.",
      },

      { kind: "h2", text: "Conclusion" },
      {
        kind: "p",
        text: "Locum tenens coverage can give healthcare organizations greater flexibility when staffing needs change.",
      },
      {
        kind: "p",
        text: "From physician vacancies and extended leaves to increased patient volume and recruitment delays, temporary physician coverage can help organizations maintain clinical support during periods of transition.",
      },
      {
        kind: "p",
        text: "The key is finding the right physician for the right assignment and ensuring the coverage aligns with both immediate needs and long-term workforce plans.",
      },
      {
        kind: "p",
        text: "Ultimately, effective healthcare staffing is about having the right provider coverage at the right time. With flexible staffing options and thoughtful workforce planning, healthcare organizations can be better prepared to support their clinical teams and the patients they serve.",
      },
    ],
  },
  {
    slug: "is-locum-tenens-right-for-you",
    image: physicianLocumHero,
    imageAlt: "Two physicians reviewing a tablet together in a hospital corridor",
    title: "Is Locum Tenens Right for You? What Physicians Should Know",
    summary:
      "What to weigh before taking a locum tenens assignment: schedule flexibility, new clinical settings, compensation, licensing, and contract terms.",
    published: "2026-10-13",
    topic: "Physician Careers",
    audience: "Providers",
    body: [
      {
        kind: "p",
        text: "Choosing your next career move as a physician is about more than finding your next position. It is about deciding how you want to practice medicine, where you want to work, and how your career can support your professional goals and personal life.",
      },
      {
        kind: "p",
        text: "For physicians seeking a different approach to their careers, locum tenens can offer an opportunity to explore new practice environments, gain clinical experience, and discover greater flexibility. However, like any career path, it comes with considerations that deserve careful thought.",
      },
      {
        kind: "p",
        text: "Could locum tenens be the right fit for you? Here is what to know before taking the next step.",
      },

      { kind: "h2", text: "What Is Locum Tenens?" },
      {
        kind: "p",
        text: "Locum tenens is a form of temporary physician staffing that allows healthcare professionals to fill short term coverage needs at hospitals, clinics, and other healthcare facilities. Assignments can range from a few days to several months, depending on the facility's needs and the physician's availability.",
      },
      {
        kind: "p",
        text: "Physicians may choose locum tenens between permanent positions, as a way to supplement their current work when permitted, or as a primary career path. Opportunities vary by specialty, location, schedule, and assignment requirements.",
      },
      {
        kind: "p",
        text: "Rather than following one fixed career structure, physicians can explore assignments that align with their qualifications, availability, and professional priorities.",
      },

      { kind: "h2", text: "5 Potential Benefits of Locum Tenens" },

      { kind: "h2", text: "1. More Flexibility in Your Schedule" },
      {
        kind: "p",
        text: "One of the main reasons physicians consider locum tenens is the opportunity to have more input into when and where they work. Depending on available assignments, you may be able to select schedules that better accommodate family commitments, personal interests, continuing education, or time away from clinical practice.",
      },
      {
        kind: "p",
        text: "Flexibility varies by assignment, so it is important to discuss shift expectations, call responsibilities, and scheduling requirements before accepting an opportunity.",
      },

      { kind: "h2", text: "2. Experience in Different Clinical Settings" },
      {
        kind: "p",
        text: "Working in different facilities can expose you to new teams, patient populations, clinical workflows, and approaches to care. These experiences may help you broaden your perspective, strengthen your adaptability, and discover the practice environment that suits you best.",
      },
      {
        kind: "p",
        text: "For physicians exploring a specialty related to their training or considering a future permanent role, locum tenens can also provide valuable insight into different healthcare organizations.",
      },

      { kind: "h2", text: "3. Opportunities to Support Underserved Communities" },
      {
        kind: "p",
        text: "Healthcare facilities across the country experience staffing gaps that can affect access to care. Locum tenens physicians help organizations maintain services, support existing medical teams, and provide continuity when permanent coverage is unavailable.",
      },
      {
        kind: "p",
        text: "For physicians who value making a difference in different communities, these assignments can offer a meaningful way to apply their expertise where it is needed.",
      },

      { kind: "h2", text: "4. Potential for Competitive Compensation" },
      {
        kind: "p",
        text: "Locum tenens assignments may offer attractive compensation, depending on specialty, location, demand, schedule, and contract terms. Some opportunities may also include travel or lodging arrangements.",
      },
      {
        kind: "p",
        text: "However, compensation should be evaluated alongside expenses, benefits, taxes, malpractice coverage, and the possibility of gaps between assignments. Understanding the complete financial picture can help you determine whether an opportunity supports your goals.",
      },

      { kind: "h2", text: "5. A Chance to Explore Your Career Direction" },
      {
        kind: "p",
        text: "Not every physician wants the same long term career. Some value the stability of a permanent position, while others want variety, greater independence, or the opportunity to explore different professional environments.",
      },
      {
        kind: "p",
        text: "Locum tenens can help you evaluate what matters most to you before making a longer term commitment. It may also provide a transition between career stages, depending on your circumstances and available opportunities.",
      },

      { kind: "h2", text: "What Should You Consider Before Accepting an Assignment?" },
      {
        kind: "p",
        text: "Although locum tenens can provide valuable opportunities, preparation is essential.",
      },
      {
        kind: "ul",
        items: [
          "Licensing and credentialing: Confirm that you meet the licensing, board certification, and credentialing requirements for the assignment. Processing times can vary, so begin early.",
          "Schedule and workload: Review shift lengths, call duties, patient volume, expected responsibilities, and the assignment duration. Make sure the requirements are realistic for your needs.",
          "Location and travel: Consider travel time, housing, transportation, and the practical demands of working away from home.",
          "Compensation and contract terms: Clarify the payment structure, covered expenses, cancellation policies, malpractice coverage, and any other contractual obligations before committing.",
          "Professional support: Ask what onboarding, clinical orientation, administrative assistance, and communication support will be available. Understanding expectations before your first shift can help you prepare for a smoother transition.",
        ],
      },

      { kind: "h2", text: "How Do You Know If Locum Tenens Are Right for You?" },
      {
        kind: "p",
        text: "Start by identifying what you want from your medical career. Are you looking for more control over your schedule? Interested in experiencing different facilities? Hoping to support communities with critical coverage needs? Or simply ready to explore a new direction?",
      },
      {
        kind: "p",
        text: "Next, consider your practical priorities, including income expectations, preferred locations, availability, and willingness to travel. Speak with an experienced recruiter who can help you understand available assignments and the requirements involved.",
      },
      {
        kind: "p",
        text: "You do not need to have every detail of your future career figured out before exploring your options. A thoughtful conversation can help you determine whether locum tenens aligns with your current goals.",
      },

      { kind: "h2", text: "Your Next Chapter in Medicine Starts With Orchard" },
      {
        kind: "p",
        text: "You have invested years in developing your medical expertise. Your next opportunity should recognize your qualifications, support your professional goals, and fit the life you want to lead.",
      },
      {
        kind: "p",
        text: "At Orchard, we connect physicians with locum tenens opportunities nationwide. We work to understand your specialty, experience, availability, preferred locations, and career priorities so you can explore assignments that align with your goals.",
      },
      {
        kind: "p",
        text: "Whether you are seeking greater flexibility, new clinical experiences, or your next professional challenge, our team can help you explore potential opportunities.",
      },
      {
        kind: "p",
        text: "Your skills are needed. Your goals matter. Your next opportunity is worth exploring.",
      },
      {
        kind: "p",
        text: "Orchard: Connecting Healthcare Organizations With the Providers They Need.",
      },
    ],
    cta: {
      heading: "Take the Next Step in Your Medical Career With Orchard",
      paragraphs: [
        "Your expertise is valuable, and your next career move should reflect your goals. Whether you are seeking greater flexibility, new clinical experiences, or opportunities to practice in different communities, Orchard can help you explore locum tenens opportunities nationwide.",
        "Your next opportunity starts with a conversation.",
      ],
      label: "Find Your Next Locum Tenens Opportunity",
      to: "/jobs",
    },
  },
  {
    slug: "before-accepting-a-locum-tenens-assignment",
    image: assignmentChecklistHero,
    imageAlt: "A physician reviewing assignment details on a laptop at a desk",
    title: "What Physicians Should Consider Before Accepting a Locum Tenens Assignment",
    summary:
      "Seven things to check before saying yes: the schedule, clinical duties, licensing, pay, malpractice cover, the location, and whether it fits your goals.",
    published: "2026-10-27",
    topic: "Physician Careers",
    audience: "Providers",
    body: [
      {
        kind: "p",
        text: "Before accepting a locum tenens assignment, physicians should review more than the job description. Understanding the schedule, clinical responsibilities, compensation, licensing requirements, and contract terms can help you determine whether an opportunity meets your expectations.",
      },
      {
        kind: "p",
        text: "Every assignment is different, and asking the right questions early can help you prepare for a successful experience. Here are seven important factors to consider before making your decision.",
      },

      { kind: "h2", text: "1. Review the Schedule and Assignment Duration" },
      {
        kind: "p",
        text: "Before committing, make sure the schedule works with your availability and personal responsibilities. Some assignments require consistent weekday shifts, while others include nights, weekends, or on-call duties.",
      },
      {
        kind: "p",
        text: "Ask about the expected work hours, shift length, start date, assignment duration, and any potential schedule changes. If you have existing professional or personal commitments, communicate them early.",
      },
      {
        kind: "p",
        text: "It is also helpful to clarify whether extensions may be available and how much notice is required if scheduling needs change.",
      },
      {
        kind: "p",
        text: "Understanding these details in advance can help you decide whether the assignment is a practical fit.",
      },

      { kind: "h2", text: "2. Understand the Clinical Responsibilities" },
      {
        kind: "p",
        text: "A job title alone may not explain what your daily responsibilities will involve. Before accepting an assignment, ask about the patient population, expected caseload, procedures, and clinical services you will be expected to provide.",
      },
      {
        kind: "p",
        text: "You should also understand the facility's available resources, including support staff, equipment, electronic health records, and consultation services.",
      },
      { kind: "p", text: "Consider asking:" },
      {
        kind: "ul",
        items: [
          "What is the typical daily patient volume?",
          "Which procedures or clinical services are required?",
          "What physicians and support staff will be available?",
          "Will orientation or training on facility procedures and systems be provided?",
        ],
      },
      {
        kind: "p",
        text: "These details can help you evaluate whether the assignment aligns with your qualifications, experience, and preferred practice setting.",
      },

      { kind: "h2", text: "3. Confirm Licensing and Credentialing Requirements" },
      {
        kind: "p",
        text: "Licensing and credentialing are important steps in preparing for a locum tenens assignment. Requirements vary by state, specialty, and healthcare facility, so it is essential to confirm them early.",
      },
      {
        kind: "p",
        text: "Ask whether an active state license is required before accepting the position or before the start date. If you need a license in another state, clarify whether assistance is available and how the process may affect your timeline.",
      },
      {
        kind: "p",
        text: "Credentialing may require documentation of your education, training, board certification, work history, references, and professional records. Some facilities may also require additional approvals or clinical privileges.",
      },
      {
        kind: "p",
        text: "Responding promptly to document requests and confirming outstanding requirements can help prevent avoidable delays.",
      },

      { kind: "h2", text: "4. Review Compensation and Covered Expenses" },
      {
        kind: "p",
        text: "Compensation is an important part of evaluating an assignment, but it is helpful to understand the complete payment arrangement before making a decision.",
      },
      {
        kind: "p",
        text: "Confirm whether the rate is hourly, daily, or based on shifts. Ask how overtime, on-call duties, callback hours, and additional shifts are compensated, if applicable.",
      },
      {
        kind: "p",
        text: "If travel is required, clarify whether transportation, lodging, and other eligible expenses are covered. Ask about reimbursement procedures, payment schedules, and any documentation requirements.",
      },
      {
        kind: "p",
        text: "You should also understand the cancellation policy and whether changes to the assignment could affect your expected compensation.",
      },
      {
        kind: "p",
        text: "Having these details in writing makes it easier to compare opportunities and understand the financial terms before committing.",
      },

      { kind: "h2", text: "5. Understand Malpractice Coverage and Contract Terms" },
      {
        kind: "p",
        text: "Before signing an agreement, review the terms carefully. Confirm that the assignment dates, schedule, compensation, responsibilities, and cancellation provisions reflect what you discussed.",
      },
      {
        kind: "p",
        text: "Malpractice coverage deserves particular attention. Ask whether coverage is provided, what limits apply, and whether the policy is occurrence-based or claims-made. If the policy is claims-made, clarify whether tail coverage is included or whether separate arrangements may be necessary.",
      },
      {
        kind: "p",
        text: "You should also understand any contractual obligations that continue after the assignment ends.",
      },
      {
        kind: "p",
        text: "If a term is unclear, request clarification before signing. For provisions with significant legal or financial implications, consider consulting a qualified attorney.",
      },

      { kind: "h2", text: "6. Evaluate the Location and Facility Support" },
      {
        kind: "p",
        text: "The location and work environment can influence your experience throughout an assignment. If you will be traveling, consider the distance from home, transportation options, housing arrangements, and the time needed to settle into a new location.",
      },
      {
        kind: "p",
        text: "It is equally important to understand how the facility operates. Ask about the clinical team, administrative support, onboarding process, and communication procedures for questions or concerns during the assignment.",
      },
      {
        kind: "p",
        text: "If you are unfamiliar with the facility's electronic health record system or clinical workflows, find out what guidance will be available before your first shift.",
      },
      {
        kind: "p",
        text: "Knowing what to expect can help you prepare for the transition and understand the resources available to support your work.",
      },

      { kind: "h2", text: "7. Make Sure the Opportunity Aligns With Your Goals" },
      {
        kind: "p",
        text: "Once you understand the practical details, consider how the assignment fits your professional and personal priorities.",
      },
      {
        kind: "p",
        text: "You may prioritize a particular location, a consistent schedule, specific clinical responsibilities, or an assignment length that works with your plans. Other physicians may be interested in gaining experience in a different facility or exploring a new region.",
      },
      {
        kind: "p",
        text: "Make a list of your essential requirements and the factors you are willing to be flexible about. This can help you compare opportunities based on what matters most to you rather than focusing on a single factor.",
      },
      {
        kind: "p",
        text: "A clear understanding of your priorities also makes it easier to communicate your preferences to a recruiter and identify suitable openings.",
      },

      { kind: "h2", text: "Prepare for Your Next Locum Tenens Assignment With Orchard" },
      {
        kind: "p",
        text: "Accepting an assignment is an important professional decision. Reviewing the schedule, clinical responsibilities, licensing requirements, compensation, contract terms, and available support can help you move forward with a clearer understanding of the opportunity.",
      },
      {
        kind: "p",
        text: "At Orchard Corp, we connect physicians with locum tenens opportunities nationwide. Our team works to understand each physician's specialty, experience, availability, and preferences to help identify assignments that align with their professional goals.",
      },
      {
        kind: "p",
        text: "Whether you are considering your first assignment or planning your next one, taking the time to ask questions can help you make an informed decision.",
      },
    ],
    // Physician-facing, like the piece before it, so it closes on the board
    // rather than on the default ask for organisations to request coverage.
    cta: {
      heading: "Take the Next Step in Your Medical Career With Orchard",
      paragraphs: [
        "Your expertise is valuable, and your next career move should reflect your goals. Whether you are seeking greater flexibility, new clinical experiences, or opportunities to practice in different communities, Orchard can help you explore locum tenens opportunities nationwide.",
        "Your next opportunity starts with a conversation.",
      ],
      label: "Browse Current Locum Tenens Opportunities",
      to: "/jobs",
    },
  },
];

/** Newest first. The index and the sitemap both read this order. */
export const articlesByDate = (): Article[] =>
  [...ARTICLES].sort((a, b) => b.published.localeCompare(a.published));

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articlePath(slug: string): string {
  return `/insights/${slug}`;
}

/** Words in the body, counted from the blocks so it cannot fall out of step. */
export function wordCount(article: Article): number {
  return article.body.reduce((n, b) => {
    if (b.kind === "img") return n;
    const text = b.kind === "ul" ? b.items.join(" ") : b.text;
    return n + text.trim().split(/\s+/).length;
  }, 0);
}

/** 220 wpm, rounded up. Honest enough for a "5 min read" and never zero. */
export function readingMinutes(article: Article): number {
  return Math.max(1, Math.round(wordCount(article) / 220));
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
