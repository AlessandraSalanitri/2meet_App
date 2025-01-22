import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "@/styles/index.css"; // Global styles

export const metadata = {
  title: "2Meet App",
  description: "Discover. Connect. Explore.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-wrapper">
          <Header />
          <main className="content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
