import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Header />
            <main className="flex-grow-1 h-100">
                <div>
                    {children}
                </div>
            </main>
            <Footer />
        </div>
    );
}
