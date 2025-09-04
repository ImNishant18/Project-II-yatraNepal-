
import React from "react"
import { Facebook, Twitter, Instagram, Github } from "lucide-react"
import "./footer.css"
import logo from "../../assets/logo.png"
export default function Footer() {
  return (
    <footer className="footercc">
      <div className="footer-container">
        <div className="footer-grid">
          {/* About yatraNepal */}
          <div className="footer-section">
            <h2>About yatraNepal</h2>
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/press">Press</a></li>
              <li><a href="/policies">Resources and Policies</a></li>
              <li><a href="/careers">Careers</a></li>
              <li><a href="/ir">Investor Relations</a></li>
              <li><a href="/trust">Trust & Safety</a></li>
              <li><a href="/contact">Contact us</a></li>
              <li><a href="/accessibility">Accessibility Statement</a></li>
              <li><a href="/bug">Bug Bounty Program</a></li>
            </ul>
          </div>

          {/* Explore */}
          <div className="footer-section">
            <h2>Explore</h2>
            <ul>
              <li><a href="/review">Write a review</a></li>
              <li><a href="/add">Add a Place</a></li>
              <li><a href="/join">Join</a></li>
              <li><a href="/traveller">Travelers' Choice</a></li>
              <li><a href="/help">Help Center</a></li>
              <li><a href="/stories">Travel Stories</a></li>
            </ul>
          </div>

          {/* Do Business With Us */}
          <div className="footer-section">
            <h2>Do Business With Us</h2>
            <ul>
              <li><a href="/owners">Owners</a></li>
              <li><a href="/business">Business Advantage</a></li>
              <li><a href="/sponsored">Sponsored Placements</a></li>
              <li><a href="/advertise">Advertise with Us</a></li>
              <li><a href="/affiliate">Become an Affiliate</a></li>
            </ul>

            <div className="mt-8">
              <h2>Get The App</h2>
              <ul>
                <li><a href="/ios">iPhone App</a></li>
                <li><a href="/android">Android App</a></li>
              </ul>
            </div>
          </div>

          {/* Tripadvisor Sites */}
          <div className="footer-section">
            <h2>Tripadvisor Sites</h2>
            <ul>
              <li>Book the best restaurants with <a href="/restaurants">yatraNepal</a></li>
              <li>Book tours and attraction tickets on <a href="/tours">Viator</a></li>
              <li>Read cruise reviews on <a href="/cruises">Cruise Critic</a></li>
              <li>Get airline seating charts on <a href="/seating">Seat Guru</a></li>
              <li>Search for holiday rentals on <a href="/rentals">Holiday Lettings</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-logo-section">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <img src={logo} alt="yatraNepal Logo" className="logo-images" />
              </div>
              <span className="footer-copyright">
                © 2025 yatraNepal LLC All rights reserved.
              </span>
            </div>

            <div className="footer-links">
              <a href="/terms">Terms of Use</a>
              <a href="/privacy">Privacy and Cookies Statement</a>
              <a href="/cookie">Cookie consent</a>
              <a href="/sitemap">Site Map</a>
              <a href="/how-it-works">How the site works</a>
              <a href="/contact">Contact us</a>
            </div>
          </div>

          {/* Social Media Icons */}
          <div className="footer-social">
            <a href="https://www.facebook.com/NeymardaSilvaSantosJr.Nishant" target="_blank" rel="noopener noreferrer">
              <Facebook />
            </a>
            <a href="https://x.com/im_nishantt18" target="_blank" rel="noopener noreferrer">
              <Twitter />
            </a>
            <a href="https://www.instagram.com/ni_sh_ant_u/" target="_blank" rel="noopener noreferrer">
              <Instagram />
            </a>
            <a href="https://github.com/ImNishant18" target="_blank" rel="noopener noreferrer">
              <Github />
            </a>
          </div>

          <p className="footer-disclaimer">
            This is the version of our website addressed to speakers of English in the United States.
            If you are a resident of another country or region, please select the appropriate version
            of Tripadvisor for your country or region in the drop-down menu.
            <button>more</button>
          </p>
        </div>
      </div>
    </footer>
  )
}
