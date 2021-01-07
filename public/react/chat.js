const { useState } = React;
const { useEffect } = React;

const e = React.createElement;

var socket = io();
let code = window.location.pathname.split('/')[2];
socket.emit("join room", code);

const Chat = () => {
    // Get room code

    // Get session ID
    let SID = Cookies.get('session');
    SID = atob(SID).split('"SID":"').pop().split('"}')[0];

    // Get username of player 
    axios.get(`/api/games/${code}`)
    .then(function (response) {
        let userName = response['data']['player_info'][SID]['name'];
    });

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('message', (message) => {
            console.log("Hey, it's the on that doesn't work")
            setMessages([...messages, message]);
        })
    });

    const sendMessage = (event) => {
        event.preventDefault(); 
        if (message) {
            setMessage('');
            socket.emit('sendMessage', {code, message});
        }
    }
 
    console.log(message, messages);

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
                {/* <React.ScrollToBottom className="messages">
                    {messages.map((message, i) => <div key={i}>

                        
                        
                    </div>)}
                </React.ScrollToBottom> */}
                
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