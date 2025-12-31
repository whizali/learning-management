import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <div className="footer">
      <p>Copyright &copy; 2025 Eduverse. All rights reserved.</p>
      <div className="footer__links">
        {["About", "Privacy Policy", "Licensing", "Contact Us"].map((item) => (
            <Link key={item} href={`/${item.toLowerCase().replace(' ', '-')}`} className='footer__link'>
                {item}
            </Link>
        ))}

        </div>
    </div>
  );
};

export default Footer;
