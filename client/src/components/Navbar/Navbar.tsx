import {
  Button,
  Dimmer,
  Icon,
  Label,
  Menu,
  MenuItem,
  Sidebar,
} from "semantic-ui-react";
import "./Navbar.scss";
import { ReactNode, useContext, useEffect, useState } from "react";
import Avatar from "../Avatar/Avatar";
import { Link, NavLink } from "react-router-dom";
import { rctClass, title } from "../../lib/utils";
import { NavbarContext } from "../../context/Navbar.context";
import { AuthContext } from "../../context/Auth.context";
import { logout } from "../../services/auth";
import toast from "react-hot-toast";
import { useNotificationStore } from "../../store/notification.store";
import { SocketContext } from "../../context/Socket.context";
import { SemanticICONS } from "semantic-ui-react/dist/commonjs/generic";
import { LoaderContext } from "../../context/Loader.context";
import { useSessionExpiredModal } from "../../lib/hooks";

type MenuItem = { icon: SemanticICONS; label: string; to?: string };

interface NavbarProps {
  children: ReactNode;
}

const Navbar = ({ children }: NavbarProps) => {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [collapse, setCollapse] = useState(false);
  const [responsivity, setResponsivity] = useState<boolean>(false);

  const { currentUser, updateCurrentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const { setLoading } = useContext(LoaderContext);

  const fetch = useNotificationStore((state) => state.fetch);
  const count = useNotificationStore((state) => state.count);
  const modal = useSessionExpiredModal();

  useEffect(() => {
    if (currentUser && socket) {
      fetch((error) => {
        modal(error);
        toast.error("Failed to fetch unread notifications count.");
      });
      socket.on("messageReceived", () => {
        fetch((error) => {
          modal(error);
          toast.error("Failed to fetch unread notifications count.");
        });
      });
      return () => {
        socket.off("messageReceived");
      };
    }
  }, [currentUser, socket]);

  const menuItemList: MenuItem[] = [
    { icon: "home", label: "Home", to: "/" },
    { icon: "info", label: "About" },
    { icon: "phone", label: "Contact" },
    { icon: "users", label: "Agents" },
  ];
  const sidebarList: MenuItem[] = [
    ...menuItemList,
    { icon: "user", label: "Profile", to: "/profile" },
    { icon: "sign-in", label: "Connexion", to: "/authen" },
    { icon: "sign-out", label: "Logout" },
  ];

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      socket?.disconnect();
      updateCurrentUser(null);
      toast.success("Logout successful.");
      window.location.href = "/";
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <nav className={rctClass({ responsivity })}>
        <ul className="topbar">
          <div className="nav left">
            <li className="logo">
              <Link to="/">
                <img src="/logo.png" alt="logo" />
              </Link>
              <span>LordEstate</span>
            </li>
            {menuItemList.map((item, index) => (
              <MenuItem
                key={index}
                as="li"
                content={
                  item.to ? (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        rctClass({ active: isActive })
                      }
                    >
                      {item.label}
                    </NavLink>
                  ) : (
                    item.label
                  )
                }
              />
            ))}
          </div>
          <div className="nav right">
            <div className="wrapper">
              {currentUser ? (
                <>
                  <li style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Avatar image={currentUser.avatar!} />
                    <b>{title(currentUser.username)}</b>
                  </li>
                  <li>
                    <Button
                      inverted
                      content="Logout"
                      size="small"
                      color="red"
                      onClick={handleLogout}
                    />
                  </li>
                  <li style={{ position: "relative" }}>
                    <NavLink
                      to="/profile"
                      end
                      tabIndex={0}
                      className={({ isActive }) =>
                        "small ui yellow button" +
                        rctClass({ disabled: isActive })
                      }
                    >
                      {!!count && (
                        <Label color="red" floating circular>
                          {count}
                        </Label>
                      )}
                      Profile
                    </NavLink>
                  </li>
                </>
              ) : (
                <li>
                  <NavLink
                    to="/authen"
                    tabIndex={0}
                    className={({ isActive }) =>
                      "large ui secondary button" +
                      rctClass({ hidden: isActive })
                    }
                  >
                    Connexion
                  </NavLink>
                </li>
              )}
            </div>
          </div>
        </ul>
        <Dimmer
          className="navbar"
          active={sidebarActive}
          page
          onClick={() => setSidebarActive(false)}
        />
        <Icon
          className={rctClass({ collapse })}
          id="sm-md-block"
          name="chevron right"
          size="big"
          onClick={() => setCollapse(!collapse)}
        />
        <div id="sm-md-block" style={{ position: "relative" }}>
          <Button
            circular
            icon="bars"
            color="black"
            size="large"
            onClick={() => setSidebarActive(true)}
          />
          {!!count && (
            <Label
              color="red"
              size="tiny"
              floating
              circular
              style={{ left: "90%" }}
            >
              {count}
            </Label>
          )}
        </div>
        <Sidebar
          animation="overlay"
          direction="right"
          icon="labeled"
          width="thin"
          visible={sidebarActive}
          as={Menu}
          inverted
          vertical
        >
          {sidebarList.map((item, index) => {
            if (currentUser) {
              if (item.icon === "sign-in") return;
            } else {
              if (["sign-out", "user"].includes(item.icon)) {
                return;
              }
            }
            return (
              <MenuItem
                key={index}
                as={item.to ? NavLink : "div"}
                {...(item.to && {
                  to: item.to,
                  end: true,
                })}
                onClick={() => {
                  setSidebarActive(false);
                  if (item.icon === "sign-out") {
                    handleLogout();
                  }
                }}
              >
                <Icon name={item.icon} />
                {item.label}
                {!!count && item.icon === "user" && (
                  <Label
                    color="red"
                    floating
                    circular
                    style={{ left: "65%", top: "5%" }}
                  >
                    {count}
                  </Label>
                )}
              </MenuItem>
            );
          })}
        </Sidebar>
      </nav>
      <NavbarContext.Provider
        value={{
          collapse,
          setCollapse,
          responsivity,
          setResponsivity,
        }}
      >
        {children}
      </NavbarContext.Provider>
    </>
  );
};

export default Navbar;
