const { useState } = React;
const { useEffect } = React;

const e = React.createElement;

var socket = io();
let code = window.location.pathname.split('/')[2];
socket.emit("join room", code);

const Chat = () => {
    const [userName, setName] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    // Get session ID
    let SID = Cookies.get('session');
    SID = atob(SID).split('"SID":"').pop().split('"}')[0];

    // Get username of player 
    axios.get(`/api/games/${code}`)
    .then(function (response) {
        setName(response['data']['player_info'][SID]['name']);
    });

    useEffect(() => {
        socket.on('message', message => {
            setMessages(messages => [ ...messages, message ]);
        });
    },[]);

    const sendMessage = (event) => {
        event.preventDefault(); 
        if (message) {
            setMessage('');
            socket.emit('sendMessage', {code, message});
        }
    }

    return (
        <div className="outerContainer-chat">
            <div className="container-chat">
                
                {/* _______INFO BAR___________ */ }

                <div className="infoBar">
                    <div className="leftInnerContainer">
                        <h3>{code}</h3>
                    </div>
                    <div className="rightInnerContainer">
                        {/* <a href="/"><img src={closeIcon} alt="close button"/></a> */}
                    </div>
                </div>

                {/* _________ MESSAGES __________ */ }
                
                <ScrollToBottom className="messages">
                    {messages.map((message, i) => 
                        <div key={i}>
                            {(() => {
                                let isSentByCurrentUser = false;

                                const trimmedName = userName.trim();
                            
                                if (message['user'] === trimmedName) {
                                    isSentByCurrentUser = true;
                                }

                                if (isSentByCurrentUser)
                                {
                                    return(
                                    <div className="messageContainer justifyEnd">
                                        <p className="sentText pr-10">{userName}</p>
                                        <div className="messageBox backgroundBlue">
                                            <p className="messageText colorWhite">{((message['text']))}</p>
                                        </div>
                                    </div>
                                    )
                                }
                                else {
                                    return (
                                    <div className="messageContainer justifyStart">
                                        <div className="messageBox backgroundLight">
                                            <p className="messageText colorDark">{message['text']}</p>
                                        </div>
                                        <p className="sentText pl-10">{message['user']}</p>
                                    </div>
                                    )
                                }
                            })()}
                        </div>)}
                </ScrollToBottom>
                
                {/* _________ INPUT __________ */ }

                <form className="form-chat">
                    <input
                        className="input-chat"
                        type="text"
                        placeholder="Type a message"
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}
                    />
                    <button className="sendButton" onClick={(event) => sendMessage(event)}>Send</button>
                </form>
            </div>
        </div>
    );
}

const domContainer = document.querySelector('#chat_container');
ReactDOM.render(e(Chat), domContainer);