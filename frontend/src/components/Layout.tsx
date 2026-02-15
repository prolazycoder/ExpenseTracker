import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background text-foreground font-sans antialiased">
            <nav className="nav">
                <div className="container nav-content">
                    <h1 className="nav-title">ExpenseTracker</h1>
                    <div className="flex items-center gap-4">
                        {/* Future: User Profile / Settings */}
                        <span className="text-sm text-muted-foreground">Demo User</span>
                    </div>
                </div>
            </nav>
            <main className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
