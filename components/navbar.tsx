import CardNav from './CardNav'


export const Navbar = () => {
  const items = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", href: "/about/company", ariaLabel: "About Company" },
        { label: "Careers", href: "/about/careers", ariaLabel: "About Careers" }
      ]
    },
    {
      label: "Projects", 
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Featured", href: "/projects/featured", ariaLabel: "Featured Projects" },
        { label: "Case Studies", href: "/projects/case-studies", ariaLabel: "Project Case Studies" }
      ]
    },
    {
      label: "Contact",
      bgColor: "#0D0716", 
      textColor: "#fff",
      links: [
        { label: "Email", href: "mailto:contact@company.com", ariaLabel: "Email us" },
        { label: "Twitter", href: "https://twitter.com/company", ariaLabel: "Twitter" },
        { label: "LinkedIn", href: "https://linkedin.com/company/company", ariaLabel: "LinkedIn" }
      ]
    }
  ];

  return (
    <CardNav
      logo="/images/logo.png"
      logoAlt="Company Logo"
      items={items}
      baseColor="#fff"
      menuColor="#000"
      buttonBgColor="#111"
      buttonTextColor="#fff"
      ease="power3.out"
    />
  );
};