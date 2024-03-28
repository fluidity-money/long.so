import { StyleLayout } from "@/app/StyleLayout";
import { Provider } from "@/app/Provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Provider>
        <StyleLayout>{children}</StyleLayout>
      </Provider>
    </html>
  );
}
