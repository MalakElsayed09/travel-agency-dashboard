import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { useState, useEffect } from "react";

interface Props {
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
}

const Header = ({ title, description, ctaText, ctaUrl }: Props) => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);
  const [ButtonComponent, setButtonComponent] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    if (ctaText && ctaUrl) {
      import("@syncfusion/ej2-react-buttons").then((module) => {
        setButtonComponent(() => module.ButtonComponent);
      });
    }
  }, [ctaText, ctaUrl]);

  return (
    <header className="header">
      <article>
        <h1 className={cn("text-dark-100")}>{title}</h1>
        <p className="text-gray-100">{description}</p>
      </article>

      {ctaText && ctaUrl && (
        <Link to={ctaUrl}>
          {mounted && ButtonComponent ? (
            <ButtonComponent>{ctaText}</ButtonComponent>
          ) : (
            <button className="e-btn">{ctaText}</button>
          )}
        </Link>
      )}
    </header>
  );
};

export default Header;
