import { ReactNode } from "react";
import "../styles/Layout.css"; 
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="layout">
      <header className="header">
        <h2>📱 พยากรณ์สมาร์ตโฟนที่เหมาะกับคุณ</h2>
      </header>

      <main className="main-content">{children}</main>

      <footer className="footer">
        <p>© 2025 Brand Predictor. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
