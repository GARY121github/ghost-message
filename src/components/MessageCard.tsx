"use client";
import { Message } from '@/models/user.model';
import { Trash2 } from 'lucide-react';
import React from 'react'


type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void;
  };

const MessageCard: React.FC<MessageCardProps> = ({message , onMessageDelete}) => {
  const formattedDate = new Date(message.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div className="bg-white text-black rounded-lg">
      <div className="p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">{message.content}</h1>
          <button
            onClick={() => onMessageDelete(message._id)}
            className="text-red-500"
          >
            <Trash2 />
          </button>
        </div>
        <p className="text-sm mt-2">{formattedDate}</p>
      </div>

    </div>
  )
}

export default MessageCard