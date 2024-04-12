export default function HeadWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <title>Adria | Notification System</title>
        </head>
        {children}
      </html>
    </>
  );
}
