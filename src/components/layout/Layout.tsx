import React from 'react';
import Header from './Header.tsx';
import Footer from './Footer.tsx';
import UserRecommendations from "../../pages/recommendations/UserRecommendations.tsx";
import {useAuth} from "../../hooks/useAuth.ts";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
    const { user } = useAuth();

    return (
        <div className="flex flex-col min-h-screen font-sans bg-light/5 relative z-0">
            <Header />

            <div className="w-full flex flex-grow">

                {user && (
                    <aside className="bg-secondary max-w-2/5 p-6 border-r border-white/10">
                        <div className="sticky top-24">
                            <p className="text-3xl mb-4 font-bold">Recommandations</p>
                            <UserRecommendations />
                        </div>
                    </aside>
                )}

                <main className="lg:col-span-8 p-2 mx-auto w-full">
                    {children}
                </main>


            </div>

            <Footer />
        </div>
    );
};

export default Layout;