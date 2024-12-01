import { useContext, useEffect } from "react";
import { rctClass } from "../../../../lib/utils";
import "./Message.scss";
import { AuthContext } from "../../../../context/Auth.context";
import { Message as IMessage } from "../../../../models/chat.model";
import { format } from "timeago.js";
import { Icon } from "semantic-ui-react";
import { SocketContext } from "../../../../context/Socket.context";
import { readMessage } from "../../../../services/chat";
import { ChatMeta } from "../../Profile";
import { useErrorToast } from "../../../../lib/hooks";

interface MessageProps {
  chatMeta: ChatMeta;
  message: IMessage;
}
const Message = ({ chatMeta, message }: MessageProps) => {
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);

  const errorToast = useErrorToast();

  const mine = message.senderId === currentUser!.id;

  useEffect(() => {
    if (!mine && !message.read) {
      (async function () {
        try {
          const { data } = await readMessage(chatMeta.chatId, message.id);
          socket?.emit("messageRead", {
            correspondentId: chatMeta.correspondent.id,
            data,
          });
        } catch (error) {
          errorToast(error);
        }
      })();
    }
  }, [message]);

  return (
    <div className={"chat-message" + rctClass({ mine })}>
      <div className="text">{message.text}</div>
      <div className="meta">
        <div className="ui mini yellow time label">
          {format(message.createdAt)}
        </div>
        {mine && (
          <div className="indicator">
            <Icon
              size="mini"
              name={message.send ? "circle" : "circle outline"}
              {...(message.failed && { color: "red" })}
            />
            {message.send && (
              <Icon
                size="mini"
                name={message.read ? "circle" : "circle outline"}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
