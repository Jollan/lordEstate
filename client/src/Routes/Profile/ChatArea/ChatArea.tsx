import { Button, Form, Icon, TextArea } from "semantic-ui-react";
import Avatar from "../../../components/Avatar/Avatar";
import "./ChatArea.scss";
import { useContext, useEffect, useRef, useState } from "react";
import Picker from "@emoji-mart/react";
import { Chat, Message as IMessage } from "../../../models/chat.model";
import { title } from "../../../lib/utils";
import { AuthContext } from "../../../context/Auth.context";
import { createMessage, getChat, readChat } from "../../../services/chat";
import { SocketContext } from "../../../context/Socket.context";
import { without } from "lodash-es";
import { ChatContext } from "../../../context/Chat.context";
import { useNotificationStore } from "../../../store/notification.store";
import toast from "react-hot-toast";
import Message from "./Message/Message";
import { LoaderContext } from "../../../context/Loader.context";
import { ChatMeta } from "../Profile";
import { useSessionExpiredModal } from "../../../lib/hooks";

interface ChatAreaProps {
  chatMeta: ChatMeta;
  onCloseChat: () => void;
}

const ChatArea = ({ chatMeta, onCloseChat: closeChat }: ChatAreaProps) => {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [text, setText] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { setLoading } = useContext(LoaderContext);
  const { socket } = useContext(SocketContext);
  const [currentChat, setCurrentChat] = useState<Chat>(null!);

  const { setChats } = useContext(ChatContext);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fetch = useNotificationStore((state) => state.fetch);
  const modal = useSessionExpiredModal();

  useEffect(() => {
    if (chatMeta) {
      (async function () {
        setLoading(true);
        try {
          const { data } = await getChat(chatMeta.chatId);
          setCurrentChat(data);
        } catch (error) {
          modal(error);
          closeChat();
          toast.error("For some reason the chat could not be opened.");
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [chatMeta]);

  useEffect(() => {
    if (currentChat) {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentChat?.messages!.length]);

  useEffect(() => {
    if (socket) {
      socket.on("messageReceived", (data: IMessage) => {
        const seenBy: string[] = [];
        if (chatMeta?.chatId === data.chatId) {
          seenBy.push(currentUser!.id);
          setCurrentChat((chat) => {
            return {
              ...chat,
              messages: [...chat.messages!, data],
            };
          });
          (async function () {
            try {
              await readChat(chatMeta.chatId);
            } catch (error: any) {
              modal(error);
              // toast.error("Something went wrong.");
            }
          })();
        } else {
          fetch(() => {
            toast.error("Failed to fetch unread notifications count.");
          });
        }

        setChats((chats) => {
          const index = chats.findIndex((chat) => chat.id === data.chatId);
          return [
            { ...data.chat!, seenBy, lastMessage: data.text },
            ...(index !== -1 ? without(chats, chats[index]) : chats),
          ];
        });
      });

      socket.on("messageRead", (data: IMessage) => {
        if (chatMeta?.chatId === data.chatId) {
          setCurrentChat((chat) => {
            const index = chat.messages!.findIndex((m) => m.id === data.id);
            chat.messages![index] = data;
            return { ...chat };
          });
        }
      });

      return () => {
        socket.off("messageReceived").off("messageRead");
      };
    }
  }, [socket, chatMeta]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.currentTarget.value);
  };

  const handleSelect = (emoji: any) => {
    setText((text) => text + emoji.native);
  };

  const handleSend = async () => {
    setOpenEmojiPicker(false);

    if (!text.trim()) return;

    const createdAt = new Date().toString();
    try {
      const message = {
        text,
        senderId: currentUser!.id,
        createdAt,
      } as IMessage;

      setCurrentChat((chat) => {
        return {
          ...chat,
          messages: [...chat.messages!, message],
        };
      });
      setChats((chats) => {
        const index = chats.findIndex((chat) => chat.id === chatMeta.chatId);
        return [
          { ...chats[index], lastMessage: text },
          ...without(chats, chats[index]),
        ];
      });
      setText("");

      const { data } = await createMessage(chatMeta.chatId, {
        text: message.text,
      });
      setCurrentChat((chat) => {
        const index = chat.messages!.findIndex(
          (m) => m.createdAt === createdAt
        );
        if (index !== -1) {
          chat.messages![index] = data;
        }
        return { ...chat };
      });

      socket?.emit("messageSent", {
        correspondentId: chatMeta.correspondent.id,
        data,
      });
    } catch (error) {
      modal(error);
      setCurrentChat((chat) => {
        const index = chat.messages!.findIndex(
          (m) => m.createdAt === createdAt
        );
        if (index !== -1) {
          chat.messages![index].failed = true;
        }
        return { ...chat };
      });
      toast.error("For some reason the message could not be sent.");
    }
  };

  return (
    <>
      {currentChat && (
        <div className="ctn">
          <div className="chat-area">
            <div className="head">
              <div className="user">
                <Avatar image={chatMeta.correspondent.avatar!} />
                <b>{title(chatMeta.correspondent.username!)}</b>
              </div>
              <Icon
                link
                name="close"
                size="large"
                onClick={() => {
                  closeChat();
                  setCurrentChat(null!);
                  setOpenEmojiPicker(false);
                  setText("");
                }}
              />
            </div>
            <div className="middle">
              <div className="messages">
                {currentChat.messages!.map((message, index) => (
                  <Message key={index} message={message} chatMeta={chatMeta} />
                ))}
              </div>
              <div ref={messageEndRef}></div>
            </div>
            <div className="foot">
              <Form>
                <div className="input">
                  <TextArea
                    rows={3}
                    placeholder="Message"
                    onChange={handleChange}
                    value={text}
                  />
                </div>
                <div className="emoji">
                  <Icon
                    link
                    name="smile outline"
                    size="large"
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  />
                  {openEmojiPicker && (
                    <Picker theme="light" onEmojiSelect={handleSelect} />
                  )}
                </div>
                <div className="button">
                  <Button
                    type="button"
                    color="yellow"
                    size="small"
                    onClick={handleSend}
                  >
                    Send
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatArea;
