// Create standard header and footer for each page
createHeader();
createFooter();

const POST_BASE_URL = 'https://apiv2.pachira.ca';
const POST_CHALLENGE_ENDPOINT = `${POST_BASE_URL}/public/intern-challenge`;

const breakpoints = {
  'default': 0,
  'sm': 640,
  'md': 768,
  'lg': 1024,
  'xl': 1280
}

let prevWindowSize = getCurrentSize();
function getCurrentSize() {
  if (window.innerWidth < breakpoints.sm) return 'default';
  if (window.innerWidth >= breakpoints.sm && window.innerWidth < breakpoints.md) return 'sm';
  if (window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg) return 'md';
  if (window.innerWidth >= breakpoints.lg && window.innerWidth < breakpoints.xl) return 'lg';
  if (window.innerWidth >= breakpoints.xl) return 'xl';
}

window.addEventListener('load', onLoad);
window.addEventListener('resize', onResize);
window.addEventListener('scroll', onScroll);

function onScroll() {
  displayDownArrowOnFrontpage();
}

function onLoad() {
  if (document.getElementById('lpIndexPage')) {
    displayDownArrowOnFrontpage();
    offsetBgImage();
    addPartnerLogos();
  }

  if (document.getElementById('lpAboutUsPage')) {
    addTeamMemberInfo();
    addSocialThumbnails();
  }
  
  if (document.getElementById('lpFaqPage')) {
    addFaq();
  }
  
  if (document.getElementById('lpPartnersPage')) {
    addPopularPartnerLogos();
    addFeaturedDeals();
  }
}

function onResize() {
  const currentSize = getCurrentSize();
  let windowSizeChanged = false;
  if (prevWindowSize !== currentSize) {
    prevWindowSize = currentSize;
    windowSizeChanged = true;
  }    
  
  offsetBgImage();
  displayDownArrowOnFrontpage();
  if (windowSizeChanged) {    
    addPartnerLogos();
    addSocialThumbnails();
    addFeaturedDeals();
    adjustQNAListPanePosition();
  }

  // Hide mobile nav when outer width of browser window is wider than 'md' (768px)
  if (window.outerWidth >= breakpoints.md) {
    isMobileNavOpen = false;
    displayMobileNav();
  }
}

function displayDownArrowOnFrontpage() {
  if (document.getElementById('lpIndexPage')) {    
    const missionStmtRect = document.getElementById('missionStmtDIV').getBoundingClientRect();
    const isMissionStmtInWindow = (window.innerHeight > missionStmtRect.height + missionStmtRect.top);
    document.getElementById('bouncingDownArrow').style.display = isMissionStmtInWindow ? 'none' : 'block';      
  } 
}

let isMobileNavOpen = false;
function displayMobileNav() {
  document.getElementById('mobileNav').style.display = isMobileNavOpen ? 'block' : 'none';
  document.getElementById('mobileNavMenu').style.display = isMobileNavOpen ? 'none' : 'block';
  document.getElementById('mobileNavClose').style.display = isMobileNavOpen ? 'block' : 'none';  
}
function handleHamburger() {
  isMobileNavOpen = !isMobileNavOpen;
  displayMobileNav();
}

// Offset the backgournd image of Impact Section to match the background 
// pattern of the Mission Statement Section
function offsetBgImage() {
  if (!document.getElementById('lpIndexPage')) return;
  // The hardcoded value 8 is the width of the impactDIV's top border
  const bgImgOffset = `-${document.getElementById('missionStmtDIV').offsetHeight+8}px`;
  document.getElementById('impactDIV').style.backgroundPositionY = bgImgOffset;
}


// Challenge response submission handler
async function submitChallengeResponse() {
  if (!document.getElementById('lpChallengePage')) return;
  document.getElementById('form-validation-error').innerText = '';
  document.getElementById('form-submission-success').innerText = '';

  const reqBody = {
    "Cause": document.getElementById('challenge-q1').value,
    "Importance": document.getElementById('challenge-q2').value,
    "Solution": document.getElementById('challenge-q3').value,
    "Name": document.getElementById('challenge-name').value,
    "Email": document.getElementById('challenge-email').value,
  };
  
  let errorMessage = '';
  const fieldsFilled = (reqBody.Cause && reqBody.Importance 
    && reqBody.Solution && reqBody.Name && reqBody.Email);
  if (!fieldsFilled) { errorMessage = 'Please fill in all the required fields.'; }
  const validEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(reqBody.Email);
  if (fieldsFilled && !validEmail) { errorMessage = 'Invalid email address.'; }
  document.getElementById('form-validation-error').innerText = errorMessage;
  if (!fieldsFilled || !validEmail) return;
  
  const submitBtn = document.getElementById('challenge-submit');
  submitBtn.removeAttribute('onclick');
  submitBtn.removeEventListener('click', submitChallengeResponse);
  submitBtn.style.backgroundColor = '#909090';
  // POST challenge response to POST_CHALLENGE_ENDPOINT or http://localhost:4000/internship-challenge
  try {
    const res = await fetch(POST_CHALLENGE_ENDPOINT, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      body: JSON.stringify(reqBody)
    });
    const submissionResponse = await res.json();
    if (submissionResponse.status === 'OK') {
      document.getElementById('form-submission-success').innerText = submissionResponse.message;
    } else {
      document.getElementById('form-validation-error').innerText = 'Failed to submit.';
    }
  } catch (err) {
    document.getElementById('form-validation-error').innerText = 'Failed to submit.';
  }
  await setTimeout(_ => {
    submitBtn.addEventListener("click", submitChallengeResponse);
    submitBtn.style.backgroundColor = '#089D44';
  }, 3000);
}


// The function fills partner logos to 'Our Retail Partners' section
// of frontpage.
const partnerLogos = [
  { link: "https://fave.co/2Tm8KDC", logo: "images/partners/ae.png" },
  { link: "https://fave.co/2TD5S45", logo: "images/partners/indigo.png" },
  { link: "https://fave.co/33pCD9r", logo: "images/partners/puma.png" },
  { link: "https://www.amazon.ca/?tag=pachiraca-20&linkCode=ur1", logo: "images/partners/amazon.png" },
  { link: "https://fave.co/33rFy1o", logo: "images/partners/homedepot.png" },
  { link: "https://fave.co/2QlJGea", logo: "images/partners/aldo.png" },
  { link: "https://fave.co/38oX2fI", logo: "images/partners/canadiantire.png" },
  { link: "https://fave.co/2TSP0Yu", logo: "images/partners/athleta.png" },
  { link: "https://fave.co/2Wmccji", logo: "images/partners/ck.png" },
  { link: "https://fave.co/2Qp9GFd", logo: "images/partners/biotherm.png" },
  { link: "https://fave.co/2x6ZcUs", logo: "images/partners/disney.png" },
  { link: "https://fave.co/38riuk6", logo: "images/partners/staples.png" },
  { link: "https://fave.co/2IhcPmf", logo: "images/partners/expedia.png" },
  { link: "https://fave.co/3d0JeM0", logo: "images/partners/lego.png" },
  { link: "https://fave.co/3b4GLhH", logo: "images/partners/saucony.png" },
  { link: "https://fave.co/2Wo2VHt", logo: "images/partners/dell.png" },
  { link: "https://fave.co/3cyYsaA", logo: "images/partners/lenovo.png" },
  { link: "https://fave.co/3atnJBj", logo: "images/partners/tripadvisor.png" },
  { link: "https://fave.co/39tlD4k", logo: "images/partners/gap.png" },
  { link: "https://fave.co/2vDP3Ov", logo: "images/partners/katespade.png" },
  { link: "https://fave.co/39n6vW4", logo: "images/partners/adidas.png" },
  { link: "https://fave.co/2PPgNXc", logo: "images/partners/bodyshop.png" },
  { link: "https://fave.co/38Tooe1", logo: "images/partners/columbia.png" },
  { link: "https://fave.co/32PTbXT", logo: "images/partners/footlocker.png" },
  { link: "https://fave.co/2x2WCic", logo: "images/partners/lacoste.png" },
  { link: "https://fave.co/2wxb55O", logo: "images/partners/roots.png" },
  { link: "https://fave.co/39krqsS", logo: "images/partners/sephora.png" },
  { link: "https://fave.co/2VJeoRF", logo: "images/partners/urbanoutfitters.png" },
  { link: "https://fave.co/38ucG9O", logo: "images/partners/walmart.png" },
  { link: "https://fave.co/2weqx6M", logo: "images/partners/ysl.png" },
];
function addPartnerLogos() {
  const partnerLogosContainer = document.getElementById('partnerLogos');
  if (!partnerLogosContainer) return;

  const fragment = document.getElementById('partner-logo-template');
  
  // Clear out the content inside the div
  partnerLogosContainer.innerHTML = '';
  // Loop over the logo list and modify the given template
  let logoCount = partnerLogos.length;
  switch (prevWindowSize) {
    case 'md':
      logoCount = 16;
      break;    
    case 'lg':
      logoCount = 20;
      break;      
    case 'xl':
      logoCount = 18;
      break;
    default:
      logoCount = 20;
      break;
  }
  for (let i=0; i<logoCount; i++) {
    // Create an instance of the template content
    const instance = document.importNode(fragment.content, true);
    // Add src of <img> to the template
    instance.querySelector('.logo').src = partnerLogos[i].logo;
    // Add href of <a> to the template
    instance.querySelector('.logo-link').href = partnerLogos[i].link;
    // Append the instance to the DOM
    partnerLogosContainer.appendChild(instance);
  }
}

function addPopularPartnerLogos() {
  const partnerLogosContainer = document.getElementById('popularPartnerLogos');
  if (!partnerLogosContainer) return;
  
  const fragment = document.getElementById('popular-partner-logo-template');
  partnerLogosContainer.innerHTML = '';
  const logoCount = 30;
  for (let i=0; i<logoCount; i++) {
    const instance = document.importNode(fragment.content, true);
    instance.querySelector('.popular-logo').src = partnerLogos[i].logo;
    instance.querySelector('.popular-logo-link').href = partnerLogos[i].link;
    partnerLogosContainer.appendChild(instance);
  }
}

// The function fills team member information to 'Meet Our Team' section
// of About Us page.
const teamMemberInfoList = [
  {
    src: `images/team-jade.png`, name: `JADE O'HEARN`, title: `CEO / FOUNDER`, modal_title: `"Hustler"`, 
    modal_bio: `Project management and innovator, with strong legal and business development experience and acumen.`,
    modal_self: `I’ve been called tenacious and relentless, tunnel vision, when I am in pursuit of my goals…I’m OK with that.`
  },
  {
    src: `images/team-hong.png`, name: `HONG YAN`, title: `DIRECTOR, TECHNOLOGY`, modal_title: `"Hacker"`,
    modal_bio: `Software developer, IT project management and consultant. Currently, teaching and mentoring new “hackers.”`,
    modal_self: `I believe in a “can-do” attitude. Jade said, “If MacGyver has a twin in the tech-world, he would be me”. I’m OK with that too.`
  },
  {
    src: `images/team-carrie.png`, name: `CARRIE HUGHES`, title: `DIRECTOR, BIZ DEVELOPMENT`, modal_title: `"Hipster"`,
    modal_bio: `Over a decade in the  telecommunications industry, with a lifetime of relationship-building experience, and marching to her own tune...Independent, counter-culture thinker, a true hipster.`,
    modal_self: `I believe you must be your authentic-self. That’s how you build trust and relationships. Be genuine, that’s my mantra and I’m so OK with that.`
  },
  {
    src: `images/team-hasnain.png`, name: `HASNAIN BAKHTIAR`, title: `UX/UI Designer`, modal_title: `UX/UI Guru`,
    modal_bio: `Hasnain’s superpower is in knowing and designing...Knowing our users and designing our platform and services to their needs.`,
    modal_self: `My pursuit: creating amazing customer journey and experience while making tremendous impact in the world…is that too much to ask for?`
  },
  {
    src: `images/team-michaela.png`, name: `MICHAELA TOMIC`, title: `Strategic Marketing Manager`, modal_title: `Impact Cultivator`,
    modal_bio: `Michaela is perfecting her creativity and expanding her imagination in the world of digital marketing; finding different channels to engage our users.`,
    modal_self: `I’m calling out to all change agents and impact makers.  Let’s paint this world in beautiful colours and make the greatest impression upon it.`
  },
  {
    src: `images/team-meriam.png`, name: `MERIAM SENOUCI`, title: `Digital Marketing (Technology) Intern`, modal_title: `Jr. Hacker`,
    modal_bio: `Meriam is a University of Calgary Computer Science Major student.  She is our “HIT” girl…Hacker-in-Training…learning all the good and a little of the “bad” from Hong.`,
    modal_self: `I believe in humanizing technology for the greater good,” and she will do just that, one keystroke at a time.`
  },
];
function addTeamMemberInfo() {
  const teamMemberInfoContainer = document.getElementById('teamMemberInfo');
  if (!teamMemberInfoContainer) return;

  const fragment = document.getElementById('team-member-info-template');

  teamMemberInfoContainer.innerHTML = '';
  for (let i=0; i<teamMemberInfoList.length; i++) {
    const member = teamMemberInfoList[i];
    const instance = document.importNode(fragment.content, true);
    instance.querySelector('.team-member-photo').src = member.src;
    instance.querySelector('.team-member-photo').id = `team-member-${i}`;
    instance.querySelector('.team-member-photo').addEventListener("click", function(){ 
      onTeamMemberPhotoClick(i);
    });
    instance.querySelector('.team-member-name').innerHTML = member.name;
    instance.querySelector('.team-member-title').innerHTML = member.title;
    teamMemberInfoContainer.appendChild(instance);
  };
}
let isTeamMemberBioModalOpen = false;
function onTeamMemberPhotoClick(memberIndex) {
  const aboutUsPageWrap = document.getElementById('aboutUsPageWrap');
  const teamMemberBioContainer = document.getElementById('teamMemberBio');
  if (!teamMemberBioContainer || !aboutUsPageWrap ||
    memberIndex < 0 || memberIndex >= teamMemberInfoList.length) return;

  const fragment = document.getElementById('team-member-bio-template');
  teamMemberBioContainer.innerHTML = '';
  const member = teamMemberInfoList[memberIndex];
  const instance = document.importNode(fragment.content, true);
  instance.querySelector('.team-member-bio-close').addEventListener("click", hideTeamMemberBioModal);
  instance.querySelector('.team-member-photo').src = member.src;
  instance.querySelector('.team-member-name').innerHTML = member.name;
  instance.querySelector('.team-member-title').innerHTML = member.title;
  instance.querySelector('.team-member-bio-title').innerHTML = member.modal_title;
  instance.querySelector('.team-member-bio-text').innerHTML = member.modal_bio;  
  instance.querySelector('.team-member-bio-self').innerHTML = member.modal_self;
  teamMemberBioContainer.appendChild(instance);
  // Make the page blurry and less colorful.
  aboutUsPageWrap.style.webkitFilter = `blur(8px) grayscale(20%)`;
  aboutUsPageWrap.style.webkitTransform = `scale(0.99)`; 
  isTeamMemberBioModalOpen = true;
  aboutUsPageWrap.addEventListener("click", pageWrapOnClick);
}
function pageWrapOnClick(event) {
  const teamMemberBioContainer = document.getElementById('teamMemberBio');
  if (!teamMemberBioContainer) return;
  // Show the bio modal
  if (isTeamMemberBioModalOpen && teamMemberBioContainer.style.display !== 'block') {
    teamMemberBioContainer.style.display = 'block';
    return;
  }

  const isOutsideOfModal = !event.target.outerHTML.includes('teamMemberBio');
  // When the user clicks anywhere outside of the modal, close it
  if (isOutsideOfModal && isTeamMemberBioModalOpen) { hideTeamMemberBioModal(); }
}
function hideTeamMemberBioModal() {
  const aboutUsPageWrap = document.getElementById('aboutUsPageWrap');
  const teamMemberBioContainer = document.getElementById('teamMemberBio');
  if (!teamMemberBioContainer || !aboutUsPageWrap) return;

  teamMemberBioContainer.innerHTML = '';
  teamMemberBioContainer.style.display = 'none';
  aboutUsPageWrap.style.webkitFilter = ``;
  aboutUsPageWrap.style.webkitTransform = ``;
  aboutUsPageWrap.removeEventListener("click", pageWrapOnClick);
  isTeamMemberBioModalOpen = false;
}


function addSocialThumbnails() {
  const thumbnailImages = [
    {src: `images/social-preview-01.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-02.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-03.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-04.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-05.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-06.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-07.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-08.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-09.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-10.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-11.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
    {src: `images/social-preview-12.jpg`, overlaySocialIcon: `images/social-facebook-spring.png`},
  ];

  const socialThumbnailsContainer = document.getElementById('socialThumbnails');
  if (!socialThumbnailsContainer) return;

  const fragment = document.getElementById('social-thumbnail-template');

  socialThumbnailsContainer.innerHTML = '';
  const imgCount = (prevWindowSize === 'sm' || prevWindowSize === 'md') ? 10 : 12;
  for (let i=0; i<imgCount; i++) {
    const instance = document.importNode(fragment.content, true);
    instance.querySelector('.social-thumbnail-image').src = thumbnailImages[i].src;
    socialThumbnailsContainer.appendChild(instance);
  }
}


const FAQ_CLICK_ACTION = {
  'SHOW': 'show-answer',
  'HIDE': 'hide-answer',
};

function addFaq() {
  const faqList = [
    // NEW USERS related Q&A
    {
      anchor: 'new_users',
      title: 'NEW USERS'
    },
    {
      question: `I’m interested in joining.  How do I become a subscriber?`,
      answer: `Becoming a subscriber has never been easier.  Please visit <a href="https://www.pachira.ca" class="text-blue-600">www.pachira.ca</a> and click on our “Take Action” button at the top of our banner.  Then click on the “Subscribe for Impact”.  Please fill in the form, and that’s it! We will send you a welcome email to confirm that we have received your request.`,
    },
    {
      question: `Can minors become a Pachira subscriber?`,
      answer: `This is a yes and no answer.  Yes, indirectly a minor can become a subscriber through a parent’s/family account.  The “giving bank” account cannot be assigned to a minor because Pachira requires the subscriber to accept and agree to our Privacy Policy, Terms of Use and other legal agreements.`,
    },
    {
      question: `I have kids, can we make a family account?`,
      answer: `Yes, we highly recommend creating a family account in one of the parent’s/adult’s name.  This is the fastest way to accumulate money/savings in your account.  Please be mindful that donation receipts will be made in one (adult) name only.`,
    },
    // MAKE IMPACT related Q&A
    {
      anchor: 'make_impact',
      title: 'MAKE IMPACT'
    },
    {
      question: `How do I transfer money or payments for the world travel programs, fundraisers or other types of social initiative programs?`,
      answer: `This is the same process as donating to charity/NFPs. In your subscriber portal, click on the charity/NFPs icon, make your selection and Pachira does the rest.  You will see a “pending” donations/transaction on your account.  Once Pachira forwards the donations on your behalf, you will see the transaction in your “Donation History”.`,
    },
    {
      question: `How often can I donate?`,
      answer: `Pachira is built on the ability to make choices: choices in the organizations you want to support, choices in how much and when you want to donate.  Please be mindful that most registered charities will have a certain amount threshold before they will issue tax receipts; commonly a minimum of $25.  Therefore, Pachira has put a minimum amount of donation of $25.  This means, that if your balance is below $25, you will have to wait until you accumulate more money/savings before you can make donations.`,
    },
    {
      question: `What is the minimum donation amount?`,
      answer: `The minimum donation amount is $25 to align with most registered charities’ minimum threshold for a tax deductible receipt to be issued.`,
    },
    {
      question: `Do I get tax receipts for my donations?`,
      answer: `Charities that are registered and permitted by <a href="https://www.canada.ca/en/services/taxes/charities.html" class="text-blue-600">Canada Revenue Agency</a>. Please consult with your charity’s website/organization for their minimum donation threshold to obtain a tax deductible receipt.`,
    },
    {
      question: `What if I don’t have the minimum amount to make donations?`,
      answer: `If you don’t have the minimum $25 donation amount, the balance will remain in your account for 2 years from last commission payment or transaction in your account.  After 2 years, we will send three consecutive emails to you (at the account that you used at time of registration) to inform you that you have an outstanding balance and require you to make a transaction (accumulate more money through one of our programs). If we do not receive a response or if you do not make a transaction, the account will be closed and any balance in the account will be put into our escrow account to be directed to a randomly selected charity on our list.  You will not receive a tax receipt for this donation.`,
    },
    {
      question: `How do I make donations?`,
      answer: `In your subscriber portal, click on the charity/NFPs icon, make your selection and Pachira does the rest.  You will see a “pending” donations/transaction on your account.  Once Pachira forwards the donations on your behalf, you will see the transaction in your “Donation History”.`,
    },
    {
      question: `When will my donation be received by the organization I support to?  How will I know that they got the money?`,
      answer: `If you donate to a registered charity, you will receive a tax receipt.  You can also access and track your donation(s) and funding support to social causes on your user portal.`,
    },
    // PARTNERSHIP related Q&A
    {
      anchor: 'partnership',
      title: 'PARTNERSHIP'
    },
    {
      question: `What’s the difference between an affiliate program v. affinity program v. local businesses? And how much commission will I earn on these different types of programs?`,
      answer: `<p>An affiliate program is a marketing, advertisement partnership or arrangement between Pachira and multiple online retailers or merchants. Pachira belongs to several affiliate networks with over 22,000 retailers and receives commissions for directing traffic or shoppers to retail websites.  Commissions are often paid on the total purchase value (exclusive of taxes, shipping costs, discounts, coupons, etc.).  For a schedule of commission rates, please email us at <a href="mailto:info@pachira.ca" class="text-blue-600">info@pachira.ca</a> (subject: commission rates schedule).</p><br />
        <p>An affinity program, membership program, is an agreement between Pachira and companies that provide (monthly) recurring services or products such as utilities, mobilities/wireless, insurance products, etc.  Pachira has negotiated discounts and program fees with these companies.  Pachira receives program fees used for operations, R&D, platform maintenance and innovations that will improve our subscribers’ experience and programs; and our subscribers receive (monthly) discounts that are deposited into their virtual piggy banks.</p><br />
        <p>Local businesses are the local retailers, shops, restaurants, and merchants that provide products, services and programs that are not part of the affinity program. Like our affinity programs, Pachira negotiates discounts for our subscribers as savings in their virtual piggy bank(s).</p><br />
        <p>Watch our animation on how easy it is to start accumulating all these discounts and savings.</p>`,
    },
    {
      question: `I belong to other retail-reward points programs, if I become a Pachira subscriber, will I lose those points?  Will I keep making points with them as well?`,
      answer: `Pachira’s program and platform is independent of other loyalty, rewards points programs. We do not require you to belong exclusively to our program and therefore, you will earn savings/funds through us.  However, we cannot confirm that would be the same with your other programs.  We strongly advise that you confirm with your other loyalty programs to ensure you will not lose your points or earnings with them.`,
    },
    {
      question: `My favorite retailer/shop is not on your list. How can I get my store on your list of retailers?`,
      answer: `Pachira strongly believes in choices – especially your choices. If we don’t have your favorite retailers/merchants or shops on our list, please let us know!  Please email us at admin@pachira.ca (subject: requesting new service or product provider), please include a website and contact information of that organisation, if available. And that’s it! We will connect with that organisation and provide you with an update.`,
    },
    // CHARITIES related Q&A
    {
      anchor: 'charities',
      title: 'CHARITIES'
    },
    {
      question: `What are the types of not-for-profit organizations can I support?`,
      answer: `Not-for-profit organizations include entities or parties that have been created under the Societies Act and are not operated for profits.  Examples of not-for-profit organizations are: sports teams/associations, school fundraisers, world travel volunteer programs and churches.`,
    },
    {
      question: `My favorite charity is not on your list.  How can I get my charity or not-for-profit organizations on your program?`,
      answer: `Pachira strongly believes in choices – especially your choices.  If we don’t have your favorite not-for-profit organisations or charities on our list, please let us know!  Please email us at admin@pachira.ca (subject: requesting new charities/NFPs), please include a website and contact information of that organisation, if available. And that’s it! We will connect with that organisation and provide you with an update.`,
    },
    {
      question: `Do I get tax receipts if I support international non-for-profit organizations?`,
      answer: `If the not-for-profit organization is also a registered charity, as permitted/defined by <a href="https://www.canada.ca/en/services/taxes/charities.html" class="text-blue-600">Canada Revenue Agency</a>, and you meet their miminum donation threshold you will get a tax receipt.`,
    },
    {
      question: `How are the charities selected to donate to?`,
      answer: `Charities are chosen by the subscriber because what resonates with us may not necessarily resonate with you. What social impact you want to create may differ from the next individual.`,
    },
    // TRACK IMPACT related Q&A
    {
      anchor: 'track_impact',
      title: 'TRACK IMPACT'
    },
    {
      question: `How can I track my donations?`,
      answer: `Pachira’s portal provides a detailed list of donation activities. Please login the portal and click “Track Your Impact” for the information.`,
    },
    // ACCOUNT related Q&A
    {
      anchor: 'account',
      title: 'ACCOUNT'
    },
    {
      question: `Can I delete my account?`,
      answer: `Yes. If you are ready to say goodbye, you can permanently delete your account. This will wipe all your personal information and all traces of activities from Pachira’s server.`,
    },
    {
      question: `Can I transfer some or all my savings to another subscriber’s account?`,
      answer: `Yes, email <a href="mailto:admin@pachira.ca" class="text-blue-600">admin@pachira.ca</a> and make the request. We will ask that you sign a transfer agreement.  Please note this transaction does not constitute a taxable donation.`,
    },
    {
      question: `What happens if my account is idle for more than 2 years? What happens with my balance?`,
      answer: `We will attempt to connect with you to remind you to keep your account active by making a transaction, such as purchasing or donating. If we don’t hear back from you after three email attempts, your account will be archived. After 2 years, we will send three consecutive emails to you (at the account that you used at time of registration) to inform you that you have an outstanding balance and require you to make a transaction (accumulate more money through one of our programs). If we do not receive a response or if you do not make a transaction, the account will be closed and any balance in the account will be put into our escrow account to be directed to a randomly selected charity on our list. You will not receive a tax receipt for this donation.`,
    },
    {
      question: `I am not happy with the purchases or services I received from a company or service provider, can I get a refund? What can you do for me?`,
      answer: `<p>Pachira does not endorse or support any of the providers, retailers or merchants nor the charities or not-for-profit.  We cannot guarantee or provide warranty for any services or products that you have received.  If you are extremely dissatisfied with a company, please do let us know at admin@pachira and share your experience with us.</p><br />
        <p>In the future, we have planned for our subscribers to rate service providers, charities or not-for-profits.  Please be patient as we work to grow, develop and improve your experience with us.</p>`,
    },
    {
      question: `Can I cash the money in my Pachira account?`,
      answer: `No. The purpose and mission of Pachira is to empower giving and charitable actions. We hope that you joined Pachira for the same reason: to spread generosity and kindness and create impact in the world.  We want to encourage that spirit by asking that you donate discounts and savings earned through Pachira programs and Giving Cycles to social initiatives that resonate with you.`,
    },
    {
      question: `What do I get if I bring my friends and family to Pachira?`,
      answer: `From time to time, Pachira may have special promotions and referral credits.  Please sign-up for our newsletter so you don’t miss out on any of our news and promotions.`,
    },
    {
      question: `Is Pachira’s portal safe enough? Can it be hacked?`,
      answer: `We use AWS Cognito to secure user data. It supports multi-factor authentication and encryption of data-at-rest and in-transit. Amazon Cognito is HIPAA eligible and PCI DSS, SOC, ISO/IEC 27001, ISO/IEC 27017, ISO/IEC 27018, and ISO 9001 compliant. What Pachira can’t protect people from is phishing, skimming, and data breaches of other websites and stores. Please do not reuse your password.`,
    },
    {
      question: `Can I personalize my Pachira’s profile?`,
      answer: `Yes. You can change your first name, last name and avatar.`,
    },
    {
      question: `Can I login from my social media profiles?`,
      answer: `The answer is no for now. We plan to add social login in the future as part of our R&D and planned improvements.`,
    },
    {
      question: `I made a large purchase a week before I joined Pachira, can I go back and have it added?`,
      answer: `<p>No, unfortunately we are not able to back-date any of transactions made prior to joining our program. We can request retroactive commission payout requests. This is set out in our agreement with our program partners.  It is extremely important that all purchases for our affiliate programs are done through our links on our website: as this is the only way your purchases can be attributed to your account.</p><br />
        <p>To receive your discounts or savings, you MUST click through our website or portal for every online purchase.  For our affinity or local business programs, you must either enter your account number or transaction ID/no. And upload your receipt.</p>`,
    },
    {
      question: `How do I include my charitable work on the blog?`,
      answer: `We would love to hear from you! Please email your story or charitable work/experience to us at social@pachira.ca and we will review your story.  Once our team approves, we will post your story and experience on our blog.`,
    },
    {
      question: `I don’t see commissions for recent purchases.  When will commissions appear on my virtual piggy bank/account?`,
      answer: `According to our affiliate and affinity partnership agreements and local businesses, commissions can take 60-90 days (from date of  final delivery of services/products and/or invoicing) before they will be forwarded to Pachira and your account.  Retailers and businesses want to ensure that enough time is allotted for any returns or refunds.`,
    },
    // ABOUT PACHIRA related Q&A
    {
      anchor: 'about_pachira',
      title: 'ABOUT PACHIRA'
    },
    {
      question: `What does Pachira’s Logo represent?`,
      answer: `Pachira is Spanish for the money tree. In Asian culture it represents giving, giving to others, generosity, spreading kindness, and well wishes. The logo is a minimalist design of a tree, in the crown of the tree there is a design of a thumbprint. The thumbprint is symbolic of leaving an imprint - your imprint and your impact in this world.`,
    },
    {
      question: `Pachira is a Canadian brand, does Pachira have a Canadian identity?`,
      answer: `Absolutely! Canadians are known to be very generous, that is how the concept of Pachira was born - through the grace and kindness of other Canadians.`,
    },
    {
      question: `Where did the idea of Pachira come from?`,
      answer: `After noticing that around Christmas time people are spread thin with financial resources and unable to give to as many charities that reach out for donations, we realized there was a need for people to be able to give within their means.`,
    },
    {
      question: `Where did the idea for the give-back option from retailers come from?`,
      answer: `The whole concept of providing the financial tool came about after witnessing a company enable employees to give back through payroll deductions. Employees felt they were unable to give back because it became a disruption in their regular income, although they wanted to.  We realized people have an innate desire to want to do good, create social impact, and give back, so we thought about what can we create in order to provide them with that gap or missing link without it disrupting their income?`,
    },
    {
      question: `Generosity is Pachira’s main message. Are there any specific qualities you are looking for in these companies/charities that are affiliated with Pachira?`,
      answer: `That is going to be an ongoing process for Pachira, because one of the founding principles is empowering but that empowerment includes empowering individual choices and expression. We don’t want to put up any obstacles or deny any choices that the subscriber makes but at the same time we also recognize that there may be charities out there that may not align with Pachira’s principles. We stand firm against racism and human rights violations. If a charity or company does not align with Pachira’s principles then it may be filtered out of our program. If you find a charity in our database you feel doesn’t align with our values, please email us at <a href="mailto:info@pachira.ca" class="text-blue-600">info@pachira.ca</a>`,
    },
  ];

  const qAndAListContainer = document.getElementById('qAndAList');
  if (!qAndAListContainer) return;

  const catFragment = document.getElementById('qna-category-title-template');
  const fragment = document.getElementById('question-and-answer-template');
  qAndAListContainer.innerHTML = '';
  for (let i=0; i<faqList.length; i++) {
    const instance = document.importNode(fragment.content, true);
    const catInstance = document.importNode(catFragment.content, true);
    // Add anchor for the sidepane and category title
    if (faqList[i].anchor) {
      catInstance.querySelector('.qna-category-title').id = faqList[i].anchor;
      catInstance.querySelector('.qna-category-title').innerText = faqList[i].title;
      qAndAListContainer.appendChild(catInstance);
      continue;
    }
    const questionElem = instance.querySelector('.faq-question');
    questionElem.innerHTML = faqList[i].question;    
    questionElem.addEventListener("click", function(){ onFaqItemClick(FAQ_CLICK_ACTION.SHOW, i) });
    const answerElem = instance.querySelector('.faq-answer');
    answerElem.innerHTML = faqList[i].answer;
    answerElem.style.display = 'none';
    answerElem.id = `qna-answer-${i}`;
    instance.querySelector('.faq-show-answer').id = `qna-show-icon-${i}`;
    instance.querySelector('.faq-show-answer').addEventListener("click", function(){ onFaqItemClick(FAQ_CLICK_ACTION.SHOW, i) });
    instance.querySelector('.faq-hide-answer').id = `qna-hide-icon-${i}`;
    instance.querySelector('.faq-hide-answer').addEventListener("click", function(){ onFaqItemClick(FAQ_CLICK_ACTION.HIDE, i) });
    qAndAListContainer.appendChild(instance);
  };
  // Attach the bottom whitespace
  const bottomDiv = document.createElement('DIV');
  bottomDiv.style.height = '4rem';
  qAndAListContainer.appendChild(bottomDiv);
  // Shift the Q&A list DIV up if window is wider than or equal to 'sm'
  adjustQNAListPanePosition();
}

function adjustQNAListPanePosition() {
  if (!document.getElementById('lpFaqPage')) return;
  const qAndAListContainer = document.getElementById('qAndAList');
  const currentSize = getCurrentSize();
  if (currentSize !== 'default') {
    const sidePaneHeight = document.getElementById('faq-side-pane').getBoundingClientRect().height;
    qAndAListContainer.style.marginTop = `-${sidePaneHeight}px`;
  } else {
    qAndAListContainer.style.marginTop = `0px`;
  }
}

function onFaqItemClick(action, index) {
  const showBtn = document.getElementById(`qna-show-icon-${index}`);
  const hideBtn = document.getElementById(`qna-hide-icon-${index}`);
  const answerText = document.getElementById(`qna-answer-${index}`);

  if (action === FAQ_CLICK_ACTION.SHOW) {
    showBtn.style.display = 'none';
    hideBtn.style.display = 'block';
    answerText.style.display = 'block';
  }

  if (action === FAQ_CLICK_ACTION.HIDE) {
    showBtn.style.display = 'block';
    hideBtn.style.display = 'none';
    answerText.style.display = 'none';
  }  
}


function addFeaturedDeals() {
  const deals = [
    {
      'logo': 'images/partners/staples.png',
      'info': 'Earn 1% more in Discounts',
      'exp': 'Today Only'
    },
    {
      'logo': 'images/partners/amazon.png',
      'info': 'Earn 1.5% more in Discounts',
      'exp': 'Today Only'
    },
    {
      'logo': 'images/partners/gap.png',
      'info': 'Earn 1% more in Discounts',
      'exp': 'Today Only'
    },
    {
      'logo': 'images/partners/sportchek.png',
      'info': 'Earn 1% more in Discounts',
      'exp': 'Today Only'
    },
    {
      'logo': 'images/partners/canadiantire.png',
      'info': 'Earn 1% more in Discounts',
      'exp': 'Today Only'
    },
  ];

  const dealsContainer = document.getElementById('featuredDeals');
  if (!dealsContainer) return;

  const fragment = document.getElementById('featured-deal-template');

  dealsContainer.innerHTML = '';

  let dealCount = 3;
  switch (prevWindowSize) {
    case 'sm':
    case 'md':
    case 'lg':
      dealCount = 3;
      break;    
    case 'xl':
      dealCount = 4;
      break;
    default:
      dealCount = 2;
      break;
  }
  if (dealCount > deals.length) { 
    dealCount = delas.length;
  }

  for (let i=0; i<dealCount; i++) {
    const instance = document.importNode(fragment.content, true);
    instance.querySelector('.tlt-deal-logo').src = deals[i].logo;
    instance.querySelector('.tlt-deal-info').innerHTML = deals[i].info;
    instance.querySelector('.tlt-deal-exp').innerHTML = deals[i].exp;
    dealsContainer.appendChild(instance);
  }
}


function createHeader() {
  const header = document.getElementById('pageHeader');
  if (!header) return;
  
  header.innerHTML = `
    <div class="h-12 flex justify-between bg-white">
      <div class="flex-none z-10 ml-8 px-2 py-3">
        <a href="/"><img class="h-16 bg-white px-2 py-2" src="/images/p-logo.png" alt="Pachira Logo"></a>
      </div>
      <div class="hidden md:flex items-center text-sm font-semibold">
        <a href="about-us.html" class="px-2">ABOUT US</a>
        <a href="partners" class="px-2">OUR PARTNERS</a>
        <a href="faq.html" class="px-2">FAQ</a>
        <a href="news" class="px-2">NEWS</a>
        <a href="/impact" class="px-2">FOR IMPACT</a>
        <a href="tnc" class="ml-4 px-4 text-brand-emerald">Sign Up</a>
        <a href="https://portal.pachira.ca" class="mr-3 px-6 rounded-sm text-white bg-brand-emerald">Login</a>
      </div>
      <div class="md:hidden flex items-center text-xs font-semibold">
        <a href="tnc" class="px-3 text-brand-emerald">Sign Up</a>
        <a href="https://portal.pachira.ca" class="px-5 py-1 rounded-sm text-white bg-brand-emerald">Login</a>
        <button type="button" class="block px-3 focus:outline-none" id="mobileNavMenu" onclick="handleHamburger()">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M24 6h-24v-4h24v4zm0 4h-24v4h24v-4zm0 8h-24v4h24v-4z"/>
          </svg>
        </button>
        <button type="button" class="hidden px-3 focus:outline-none" id="mobileNavClose" onclick="handleHamburger()">
          <img class="w-5" src="/images/icon-close.svg">
        </button>
      </div>
    </div>   
    <!-- Hamburger Menu Items - Start -->
    <div class="hidden pb-2 text-right text-sm font-semibold bg-white" id="mobileNav">
      <a href="about-us.html" class="block px-4 mt-1">ABOUT US</a>
      <a href="partners" class="block px-4 mt-1">OUR PARTNERS</a>
      <a href="faq.html" class="block px-4 mt-1">FAQ</a>
      <a href="news" class="block px-4 mt-1">NEWS</a>
      <a href="/impact" class="block px-4 mt-1">FOR IMPACT</a>
    </div>
    <!-- Hamburger Menu Items - End -->
  `;
}

function createFooter() {
  const footer = document.getElementById('pageFooter');
  if (!footer) return;

  footer.innerHTML = `
    <div class="hidden md:block">
      <div class="flex py-8 bg-brand-emerald-dark text-white">
        <div class="w-1/4 mt-4 flex justify-center">
          <div class="h-24"><img src="images/p-logo-white.png" class="max-h-full"></div>
        </div>
        <div class="w-1/5 px-8 text-left">
          <div class="text-sm font-semibold text-brand-spring">ABOUT US</div>
          <a class="block mt-2 text-xxs" href="about-us.html#what-we-do-anchor">What we do</a>
          <a class="block mt-1 text-xxs" href="about-us.html#our-story-anchor">Our Story</a>
          <a class="block mt-1 text-xxs" href="about-us.html#meet-our-team-anchor">Meet our team</a>
          <a class="block mt-1 text-xxs" href="about-us.html#social-peg-anchor">#PachiraEmpowerGiving</a>
          <a class="block mt-1 text-xxs" href="about-us.html#contact-us-anchor">Contact us</a>
        </div>
        <div class="w-1/5 px-8 text-left">
          <div class="text-sm font-semibold text-brand-spring">QUICK LINKS</div>
          <a class="block mt-2 text-xxs" href="partners">Our Partners</a>
          <a class="block mt-1 text-xxs" href="https://portal.pachira.ca/charitydatabase" target="_blank">Charities</a>
          <a class="block mt-1 text-xxs" href="faq.html">FAQ</a>
          <a class="block mt-1 text-xxs" href="/impact">For Impact</a>
          <a class="block mt-1 text-xxs" href="#">Sitemap</a>
        </div>
        <div class="w-1/3 text-center mr-12">
          <div>
            <input class="inline-block align-middle h-8 md:w-11/12 lg:w-4/5 px-2 shadow appearance-none text-black border rounded placeholder-brand-emerald-dark" type="text" placeholder="Search">
            <div class="inline-block align-middle h-8 rounded bg-brand-spring" style="padding: 0.1rem 0.5rem; margin-left: -2.26rem;">
              <a href="#"><img class="w-4 filter-brand-gray" src="images/icon-search-white.svg" style="margin-top: 0.35rem;"></a>
            </div>
          </div>
          <div class="mt-6 py-3 text-xs font-semibold">CONNECT ON SOCIAL</div>
          <div class="flex justify-center">
            <a href="https://www.facebook.com/pachira.empower.giving"><img class="w-6 mx-4 filter-brand-spring" src="images/social-facebook.svg"></a>
            <a href="https://www.instagram.com/pachira.empower.giving/"><img class="w-6 mx-4 filter-brand-spring" src="images/social-insta.svg"></a>
            <a href="https://twitter.com/pachira_empower"><img class="w-6 mx-4 filter-brand-spring" src="images/social-twitter.svg"></a>
            <a href="https://www.linkedin.com/company/pachira-social-enterprise-inc/"><img class="w-6 mx-4 filter-brand-spring" src="images/social-linkedin.svg"></a>
          </div>
        </div>
      </div>
      <div class="py-4 bg-brand-emerald-dark text-xs text-center text-white border-t-2 border-brand-spring">
        <span>Copyright &#169; Pachira 2020-2021</span>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="#">Terms and Conditions</a>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="#">Privacy Policy</a>
      </div>
    </div>
    <div class="md:hidden py-8 px-4 bg-brand-emerald-dark text-center text-white text-xs">
      <p>Copyright &#169; Pachira 2020-2021</p>
      <div class="mt-6">
        <a href="#">Privacy</a>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="#">Terms</a>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href="about-us.html#contact-us-anchor">Contact Us</a>
      </div>
      <div class="mt-4 flex flex-col ">
        <div class="py-3 text-xs font-semibold">CONNECT ON SOCIAL</div>
        <div class="flex justify-center">
          <a href="https://www.facebook.com/pachira.empower.giving"><img class="w-6 mx-4 filter-brand-spring" src="images/social-facebook.svg"></a>
          <a href="https://www.instagram.com/pachira.empower.giving/"><img class="w-6 mx-4 filter-brand-spring" src="images/social-insta.svg"></a>
          <a href="https://twitter.com/pachira_empower"><img class="w-6 mx-4 filter-brand-spring" src="images/social-twitter.svg"></a>
          <a href="https://www.linkedin.com/company/pachira-social-enterprise-inc/"><img class="w-6 mx-4 filter-brand-spring" src="images/social-linkedin.svg"></a>
        </div>
      </div>
    </div>
  `;
}