import "./Chat.css";
const Message = ({ text, sender, timestamp }: any) => {
  return (
    <div className={`message ${sender}`}>
      <div className="message-content">{text}</div>
      <div className="message-timestamp">{timestamp}</div>
    </div>
  );
};

export default Message;
