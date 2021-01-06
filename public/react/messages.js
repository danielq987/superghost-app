import React from 'react';
import ScrollToBottom from 'react-scroll-to-bottom';
import '../css/messages.js';
import Message from '../react/message'

const Messages = ({messages, name}) => (
    <ScrollToBottom className="messages">
        {messages.map((message, i) => <div key={i}><Message message={message} name={name}/></div>)}
    </ScrollToBottom>
)

export default Messages;