import { ListContent, ListHeader, ListItem } from "semantic-ui-react";
import { rctClass, title } from "../../../../lib/utils";
import { Chat as IChat } from "../../../../models/chat.model";
import { useContext } from "react";
import { AuthContext } from "../../../../context/Auth.context";
import Avatar from "../../../../components/Avatar/Avatar";
import { User } from "../../../../models/user.model";
import { ChatMeta } from "../../Profile";

interface ChatProps {
  chatMeta: ChatMeta;
  chat: IChat;
  onClick: (e: any, chat: IChat, correspondent: Partial<User>) => void;
}

const Chat = ({ chat, onClick: handleClick, chatMeta }: ChatProps) => {
  const { currentUser } = useContext(AuthContext);
  const correspondent = chat.users!.find((user) => user.id !== currentUser!.id);
  const unread = !chat.seenBy.includes(currentUser!.id);
  const active = chat.id === chatMeta?.chatId;

  return (
    <>
      {correspondent && (
        <ListItem
          className={rctClass({ unread, active })}
          onClick={(e: any) => handleClick(e, chat, correspondent)}
        >
          <Avatar image={correspondent.avatar!} />
          <ListContent>
            <ListHeader>{title(correspondent.username!)}</ListHeader>
            <span className="last-message">{chat.lastMessage}</span>
          </ListContent>
        </ListItem>
      )}
    </>
  );
};

export default Chat;
