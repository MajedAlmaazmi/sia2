import Link from "next/link";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const router = useRouter();
  const currentRoute = router.pathname;
  console.log(currentRoute);
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <header className="bg-gray-500">
        <div className="container flex items-center md:items-baseline md:flex-col px-4 justify-between">
          <div className="my-6">
            <h1 className="text-2xl font-bold">نظام إدارة الأجازات</h1>
            <p>دائرة الشوؤن الإسلامية - الشارقة</p>
          </div>
          <div className="md:hidden">القائمة</div>
          <nav className="mt-12 hidden md:block">
            <ul>
              <li>
                <Link href="/home">الصفحة الرئيسية</Link>
              </li>
              <li>
                <Link
                  className={`${currentRoute === "/imams" ? "text-white" : ""}`}
                  href="/imams"
                >
                  الأئمة
                </Link>
              </li>
              <li>
                <Link
                  className={`${
                    currentRoute === "/freelancers" ? "text-white" : ""
                  }`}
                  href="/freelancers"
                >
                  الأئمة البدلاء
                </Link>
              </li>
              <li>
                <Link href="/mosques">المساجد</Link>
              </li>
              <li>
                <Link href="/requests">الإجازات</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main className="grow">{children}</main>
      {/* <footer>jjjj</footer> */}
    </div>
  );
}
