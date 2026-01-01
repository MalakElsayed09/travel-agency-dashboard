import { NavLink, useNavigate } from "react-router";
import { useLoaderData } from "react-router";
import { sidebarItems } from "~/constants";
import { logoutUser } from "~/appwrite/oauth";
import { cn } from "~/lib/utils";

interface NavItemsProps {
  onHandleClick?: () => void;
}

export default function NavItems({ onHandleClick }: NavItemsProps) {
  const user = useLoaderData() as any;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate("/sign-in");
  };

  return (
    <section className="nav-items">
      <a href="/" className="link-logo">
        <img src="/assets/icons/logo.svg" alt="logo" className="size-[30px]" />
        <h1>Tour Visto</h1>
      </a>

      <div className="container">
        <nav>
          {sidebarItems.map(({ id, href, icon, label }) => (
            <NavLink key={id} to={href} onClick={onHandleClick}>
              {({ isActive }) => (
                <div
                  className={cn("group nav-item", {
                    "bg-primary-100 !text-white": isActive,
                  })}
                >
                  <img
                    src={icon}
                    alt={label}
                    className={`size-5 group-hover:brightness-0 group-hover:invert ${
                      isActive ? "brightness-0 invert" : "text-dark-200"
                    }`}
                  />
                  {label}
                </div>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <footer className="nav-footer">
        <img
          src={user?.imageURL || "/assets/images/avatar.png"}
          alt={user?.name}
          referrerPolicy="no-referrer"
          className="rounded-full size-8"
        />
        <article>
          <h2>{user?.name || "Guest"}</h2>
          <p className="truncate">{user?.email || ""}</p>
        </article>
        <button onClick={handleLogout} className="cursor-pointer">
          <img src="/assets/icons/logout.svg" alt="logout" className="size-6" />
        </button>
      </footer>
    </section>
  );
}
