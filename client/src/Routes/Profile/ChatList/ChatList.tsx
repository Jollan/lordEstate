import React, { useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { List } from "semantic-ui-react";
import { AuthContext } from "../../../context/Auth.context";
import { ChatContext } from "../../../context/Chat.context";
import { createChat } from "../../../services/chat";
import "./ChatList.scss";
import { ProfileContext } from "../../../context/Profile.context";
import { useNotificationStore } from "../../../store/notification.store";
import { Chat as IChat } from "../../../models/chat.model";
import { NavbarContext } from "../../../context/Navbar.context";
import { LoaderContext } from "../../../context/Loader.context";
import toast from "react-hot-toast";
import Chat from "./Chat/Chat";
import { User } from "../../../models/user.model";
import { ChatMeta } from "../Profile";
import { useSessionExpiredModal } from "../../../lib/hooks";

interface ChatsListProps {
  onOpenChat: (value: ChatMeta) => void;
  chatMeta: ChatMeta;
}

const ChatList = ({ onOpenChat: openChat, chatMeta }: ChatsListProps) => {
  const { state } = useLocation();
  const { setCollapse } = useContext(NavbarContext);
  const { currentUser } = useContext(AuthContext);
  const { setOwnerId, ownerId } = useContext(ProfileContext);
  const { chats, setChats } = useContext(ChatContext);
  const { setLoading } = useContext(LoaderContext);
  const decrease = useNotificationStore((state) => state.decrease);
  const modal = useSessionExpiredModal();

  const markAsRead = (chat: IChat) => {
    if (!chat.seenBy.includes(currentUser!.id)) {
      setChats((chats) => {
        const index = chats.findIndex((c) => c.id === chat.id);
        chat.seenBy.push(currentUser!.id);
        chats[index] = chat;
        return chats;
      });
      decrease();
    }
  };

  useEffect(() => {
    if (ownerId) {
      const chat = chats.find((chat) => chat.userIds.includes(ownerId));

      if (chat) {
        if (chatMeta?.chatId !== chat.id) {
          const correspondent = chat.users!.find((user) => {
            return user.id !== currentUser!.id;
          })!;

          openChat({ chatId: chat.id, correspondent });
          markAsRead(chat);
          setOwnerId!("");
          setCollapse(true);
        }
      } else {
        (async function () {
          setLoading(true);
          try {
            const { data: chat } = await createChat({
              correspondentId: ownerId,
            });
            setChats((chats) => [chat, ...chats]);
          } catch (error: any) {
            modal(error);
            toast.error(error.response.data.message);
          } finally {
            setLoading(false);
          }
        })();
      }
    } else if (ownerId ?? state) setOwnerId!(state.ownerId);
  }, [ownerId, chats, chatMeta]);

  const handleClick = (e: any, chat: IChat, correspondent: Partial<User>) => {
    if (chatMeta?.chatId !== chat.id) {
      openChat({ chatId: chat.id, correspondent });
      markAsRead(chat);

      setTimeout(() => {
        e.target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 250);
    }
  };

  return (
    <>
      {!!chats.length ? (
        <List className="chats" divided selection animated>
          {chats.map((chat, index) => (
            <React.Fragment key={index}>
              {(chat.lastMessage ||
                chat.userIds.at(0) === currentUser!.id) && (
                <Chat chat={chat} onClick={handleClick} chatMeta={chatMeta} />
              )}
            </React.Fragment>
          ))}
        </List>
      ) : (
        <div className="chat-list-placeholder">
          Your chats are displayed here.
        </div>
      )}
    </>
  );
};

export default ChatList;
