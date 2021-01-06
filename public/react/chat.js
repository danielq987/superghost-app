import React, {useState, useEffect} from 'react';
import '../css/chat.css';
import * as db from '../helpers/db' 
import * as cookies from '../helpers/cookies' 

import InfoBar from '../react/infoBar';
import Input from '../react/input';
import Messages from '../react/messages';

var socket = io();

const Chat = () => {
    // Get room code
    let code = window.location.pathname.split('/')[2];

    // Get session ID
    let SID = cookies.getSession(socket)
    // Get username of player sending the message
    const { player_info } = db.getGameByCode(code);
    const userName = player_info[SID]['name'];
    console.log(`${userName}, it works!`)

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('message', message => {
            setMessages([...messages, message]);
        })
    }, [messages]);

    const sendMessage = (event) => {
        event.preventDefault(); 
        if(message) {
            socket.emit('sendMessage', code, message, () => setMessage(''));
        }
    }
 
    console.log(message, messages);

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={code}/>
                <Messages messages={messages} name={userName}/>
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage}></Input>
            </div>
        </div>
    );
}

const domContainer = document.querySelector('#chat_container');
ReactDOM.render(Chat, domContainer);

// 'use strict';

// const e = React.createElement;

// class LikeButton extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { liked: false };
//   }

//   render() {
//     if (this.state.liked) {
//       return 'You liked this.';
//     }

//     return e(
//       'button',
//       { onClick: () => this.setState({ liked: true }) },
//       'Like'
//     );
//   }
// }

// const domContainer = document.querySelector('#chat_container');
// export default ReactDOM.render(e(LikeButton), domContainer);