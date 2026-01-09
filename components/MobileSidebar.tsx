// @ts-nocheck
import { Link } from "react-router";
import { useEffect, useRef, useState } from "react";
import NavItems from "./NavItems";

const MobileSidebar = () => {
  const sidebarRef = useRef<any>(null);
  const [SidebarComponent, setSidebarComponent] =
    useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    import("@syncfusion/ej2-react-navigations").then((mod) => {
      setSidebarComponent(() => mod.SidebarComponent);
    });
  }, []);

  const toggleSidebar = () => {
    sidebarRef.current?.toggle();
  };

  if (!SidebarComponent) return null;

  return (
    <div className="mobile-sidebar wrapper">
      <header>
        <Link to="/">
          <img
            src="/assets/icons/logo.svg"
            alt="Logo"
            className="size-[30px]"
          />
          <h1>Tourvisto</h1>
        </Link>

        <button onClick={toggleSidebar}>
          <img src="/assets/icons/menu.svg" alt="menu" className="size-7" />
        </button>
      </header>

      <SidebarComponent
        width={270}
        ref={sidebarRef}
        created={() => sidebarRef.current?.hide()}
        closeOnDocumentClick={true}
        showBackdrop={true}
        type="over"
      >
        <NavItems handleClick={toggleSidebar} />
      </SidebarComponent>
    </div>
  );
};

export default MobileSidebar;
