import './globals.css';
import ToasterContext from './context/ToasterContext';
import AuthContext from './context/AuthContext';
// import ActiveStatus from './components/ActiveStatus';

export const metadata = {
    title: 'Messenger',
    description: 'Messenger Clone',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <AuthContext>
                    <ToasterContext />
                    {children}
                </AuthContext>
            </body>
        </html>
    );
}
