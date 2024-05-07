import { Message } from '@/models/user.model';
import React from 'react'


type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
  };

const MessageCard: React.FC<MessageCardProps> = ({message , onMessageDelete}) => {
  return (
    <div>MessageCard</div>
  )
}

export default MessageCard