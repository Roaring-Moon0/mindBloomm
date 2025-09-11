
// This layout is for routes that should not have the main site's header and footer,
// such as login, signup, and admin login pages.

export default function AuthRoutesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
