export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-background/80 backdrop-blur-md py-8">
            <div className="container flex flex-col items-center justify-between gap-6 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built with privacy in mind. Powered by <span className="text-primary font-medium">Zcash</span>.
                </p>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <a href="#" className="hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                </div>
            </div>
        </footer>
    );
}
