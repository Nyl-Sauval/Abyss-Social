const Footer = () => {
    return (
        <footer className="bg-primary border-t border-white/10 text-light/80 py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div>
                    <h3 className="text-white font-bold mb-4">ABYSS-SOCIAL</h3>
                    <p className="text-sm leading-relaxed">
                        Exploration sous-marine, évènements et étoiles de mer.
                        Partagez vos meilleurs souvenirs sur Abyss !
                    </p>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4">Liens utiles</h4>
                    <ul className="text-sm space-y-2">
                        <li><a href="/me" className="hover:text-accent">Mon profil</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-semibold mb-4">Nous contacter</h4>
                    <ul className="text-sm space-y-1">
                        <li className="flex items-center gap-3">
                            <span className="text-accent text-lg">📍</span>
                            <span>12 rue de l'Abysse, 13007 Marseille</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-accent text-lg">📞</span>
                            <span>04 91 00 00 00</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="text-accent text-lg">✉️</span>
                            <a href="mailto:contact@abysssocial.fr" className="hover:text-secondary transition-colors underline decoration-secondary/30">
                                contact@abysssocial.fr
                            </a>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-white/5 text-center text-xs">
                © 2026 Abyss-Social - App-5 Edition
            </div>
        </footer>
    );
};

export default Footer;