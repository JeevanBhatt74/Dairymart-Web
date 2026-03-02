import Header from "./_components/Header";
import Footer from "./_components/Footer";
import RedirectIfAdmin from "../_components/RedirectIfAdmin";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <RedirectIfAdmin>
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-24">
                    {children}
                </main>
                <Footer />
            </div>
        </RedirectIfAdmin>
    );
}
