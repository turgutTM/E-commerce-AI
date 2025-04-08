"use client";
import Navbar from "./components/Navbar";
import "./globals.css";
import { usePathname } from "next/navigation";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { ToastContainer } from "react-toastify";

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const shouldShowNavbar =
    pathname !== "/register" &&
    pathname !== "/login" &&
    !pathname.startsWith("/blog/");

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <div className="flex flex-col">
              {shouldShowNavbar && <Navbar />}
              {children}
              <ToastContainer />
            </div>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
