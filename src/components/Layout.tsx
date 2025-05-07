import { ReactNode } from "react";
import { HelmetProvider } from "react-helmet-async";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <HelmetProvider>
      <div className="layout">
        <header className="header">
          <h1>📱 Brand Predictor</h1>
        </header>

        <main className="main-content">{children}</main>

        <footer className="footer">
          <p>© 2025 Brand Predictor. All rights reserved.</p>
        </footer>
      </div>
    </HelmetProvider>
  );
};

export default Layout;
