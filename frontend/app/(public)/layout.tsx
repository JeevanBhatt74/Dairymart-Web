import Header from "./_components/Header";
import RedirectIfAdmin from "../_components/RedirectIfAdmin";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <RedirectIfAdmin>
            <section>
                <Header />
                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {children}
                </main>
            </section>
        </RedirectIfAdmin>
    );
}
