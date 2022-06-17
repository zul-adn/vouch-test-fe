import React from 'react';
import logo from './logo.svg';
import io from "socket.io-client";

let socket = io('http://localhost:5000')

let msgs = []

const App = () => {

  // const API = 'http://103.140.206.20:3005/';

  const [roomID, setRoomID] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState('');
  const [loginStatus, setLoginStatus] = React.useState(false);


  React.useEffect(() => {

    socket.on("message", (response) => {
      // alert(response)
      setMessages((prevState) => [...prevState, response])
    
    });
  }, [])


  const joinRoom = () => {
    console.log(roomID)
    socket.emit("join-room", {
      room: roomID
    })
  }

  const login = () => {
    setLoginStatus(!loginStatus)
    joinRoom()
  }

  const sendMessage = e => {
    e.preventDefault();

    const newArr = [...messages]

    newArr.push({
      nama: userName,
      room: roomID,
      message
    })
    setMessages(newArr)
    
    socket.emit("message", {
      nama: userName,
      room: roomID,
      message
    })

    setMessage('')
  }

  const loginScreen = () => {
    return (
      <div className='h-screen flex justify-center items-center flex-col p-8'>
        <input
          className="w-full border border-black rounded py-2 px-5 my-2"
          placeholder="Room ID"
          onChange={e => setRoomID(e.target.value)}
          required
        >
        </input>
        <input
          className="w-full border border-black rounded py-2 px-5 my-2"
          placeholder="Username"
          onChange={e => setUserName(e.target.value)}
          required
        >
        </input>
        <div onClick={login} className="w-full border border-indigo-600 bg-indigo-600 text-white text-center rounded py-2 px-5 my-2">
          Join Chat
        </div>
      </div>
    )
  }

  const chatScreen = () => {

    const isMe = (v) => {
      return v === userName
    }

    return (
      <div className='relative h-screen flex flex-col'>

        {/* Chat Header */}
        <div className="p-5 bg-white w-full">
          {roomID}
        </div>

        {/* Chat Body */}
        <div className="flex flex-col p-5 bg-slate-100 w-full h-full">
          {messages && messages.map((msg, i) =>
            <div className={`w-fit m-1 p-3 rounded  ${isMe(msg.nama) ? `self-end  bg-blue-500 text-white` : `self-start bg-white border text-black`}`}>
              {/* <span style={{ backgroundColor:'red' }}> */}
                <div className={'text-xs'}>{msg.nama}</div>
                {msg.message}
              {/* </span> */}
            </div>
          )}
        </div>

        {/* Chat Footer */}
        <div className="absolute p-5 bg-white w-full bottom-0">
          <form onSubmit={sendMessage}>
            <input
              className="w-full bg-slate-100 rounded py-3 px-5 my-2"
              placeholder="Text your message here"
              onChange={e => setMessage(e.target.value)}
              value={message}
            >
            </input>
          </form>
        </div>

      </div>
    )
  }

  return (
    <div className='h-screen md:px-60 lg:px-96 xl:px-96'>
      <div className='h-screen border-x border-black-200'>
        {loginStatus ? chatScreen() : loginScreen()}
      </div>
    </div>
  );
}

export default App;
