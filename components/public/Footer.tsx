import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <img src="/uploads/Almeja_Logo_Large_PNG.png" alt="Almeja Azul" />
          <p>Five hectares of white sand on Samal Island, Davao del Norte.</p>
          <div className="footer-social">
            <a href="https://www.facebook.com/AlmejaAzulResort/" target="_blank" rel="noopener noreferrer" className="f-soc">FB</a>
            <a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer" className="f-soc">M</a>
          </div>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/stay">Stay</Link></li>
            <li><Link href="/day-tour">Day Tour</Link></li>
            <li><Link href="/fun">Fun</Link></li>
            <li><Link href="/build">Build</Link></li>
            <li><Link href="/see">See</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Rooms</h4>
          <ul>
            <li><Link href="/stay">Seaside Room</Link></li>
            <li><Link href="/stay">Deluxe Beachfront</Link></li>
            <li><Link href="/stay">Family Suite</Link></li>
            <li><Link href="/stay">Mangrove Villa</Link></li>
            <li><Link href="/stay">Grand Estate</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Spaces</h4>
          <ul>
            <li><Link href="/stay#spaces">Function Hall</Link></li>
            <li><Link href="/stay#spaces">Meeting Room</Link></li>
            <li><Link href="/stay#spaces">Cabana A</Link></li>
            <li><Link href="/stay#spaces">Cabana B</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Book</h4>
          <ul>
            <li><a href="https://m.me/AlmejaAzulResort" target="_blank" rel="noopener noreferrer">Facebook Messenger</a></li>
            <li><a href="tel:09993088800">0999 308 8800</a></li>
            <li><a href="https://www.facebook.com/AlmejaAzulResort/" target="_blank" rel="noopener noreferrer">Facebook Page</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Almeja Azul · Brgy. Adecor, Samal Island</span>
        <span>0999 308 8800</span>
      </div>
    </footer>
  );
}
