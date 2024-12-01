import { ReactElement, useContext, useEffect } from "react";
import "./Page.scss";
import { rctClass } from "../../lib/utils";
import { Dimmer } from "semantic-ui-react";
import { NavbarContext } from "../../context/Navbar.context";

interface PageProps {
  children: ReactElement;
  className: string;
  responsivity?: boolean;
}

interface PageRight {
  children: ReactElement;
  className?: string;
}

interface PageLeft {
  children: ReactElement;
  className?: string;
}

const Page: React.FC<PageProps> & {
  PageRight: React.FC<PageRight>;
  PageLeft: React.FC<PageLeft>;
} = ({ children, className, responsivity }) => {
  const { setResponsivity, setCollapse } = useContext(NavbarContext);

  useEffect(() => {
    setResponsivity(!!responsivity);
  }, [responsivity]);

  useEffect(() => {
    return () => {
      setResponsivity(false);
      setCollapse(false);
    };
  }, []);

  return <div className={className}>{children}</div>;
};

const kls = "ui dimmable dimmed";

Page.PageLeft = ({ className: cls, children }) => {
  const { collapse, setCollapse, responsivity } = useContext(NavbarContext);

  const klass =
    responsivity && kls + rctClass({ ["collapse blurring"]: collapse });

  return (
    <div className={`page left ${cls ?? (klass || "")}`}>
      {responsivity && collapse && (
        <Dimmer inverted simple onClick={() => setCollapse(false)} />
      )}
      {children}
    </div>
  );
};

Page.PageRight = ({ className: cls, children }) => {
  const { collapse, setCollapse, responsivity } = useContext(NavbarContext);

  const klass = responsivity && kls + rctClass({ blurring: !collapse });

  return (
    <div className={`page right ${cls ?? (klass || "")}`}>
      {responsivity && !collapse && (
        <Dimmer inverted simple onClick={() => setCollapse(true)} />
      )}
      {children}
    </div>
  );
};

export default Page;
