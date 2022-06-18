import React from 'react';
import logo from './logo.svg';
import io from "socket.io-client";

let socket = io('http://101.50.0.208:5000')
let ENDPOINT = 'http://101.50.0.208:5000';
// let socket = io('http://localhost:5000');

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
      setMessages((prevState) => [...prevState, response])
    });

  }, [])


  const joinRoom = async () => {

    await fetch(`${ENDPOINT}/chat/${roomID}`)
      .then(res => res.json())
      .then(resJson => {
        setMessages(resJson)
      })

    console.log(roomID)
    socket.emit("join-room", {
      room: roomID
    })
  }

  const login = async () => {
  
    if (userName && roomID) {
      await fetch(`${ENDPOINT}/check/${roomID}/${userName}`)
        .then(res => res.json())
        .then(resJson => {
          alert("adadadad")
          if (resJson > 0) {
            alert("username exist")
            return
          }

          setLoginStatus(!loginStatus)
          joinRoom()
        })
    } else {
      alert("Username and Room ID cannot be empty")
    }
  }

  const sendMessage = e => {
    e.preventDefault();

    const newArr = [...messages]

    newArr.push({
      username: userName,
      room: roomID,
      message
    })
    setMessages(newArr)

    socket.emit("message", {
      username: userName,
      room: roomID,
      message
    })

    setMessage('')
  }

  const loginScreen = () => {
    return (
      <div className='h-screen flex items-center flex-col p-8'>
        <div className="text-lg mb-5 text-bold">
          Join Chat Room
        </div>
        {/* <form onSubmit={login}> */}
        <input
          className="w-full border bg-gray-100 rounded-md py-2 px-5 my-2"
          placeholder="Username"
          onChange={e => setUserName(e.target.value)}
          required
        >
        </input>
        <input
          className="w-full border bg-gray-100 rounded-md py-2 px-5 my-2"
          placeholder="Room ID"
          onChange={e => setRoomID(e.target.value)}
          required
        >
        </input>
        <div className="absolute p-5 bg-white w-full bottom-0">
          <div onClick={login} className=" w-full bg-green-700 text-white text-center rounded-full py-2 px-5 my-2">
            JOIN
          </div>
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
        <div className="flex justify-center items-center p-1 bg-white w-full ">
          {roomID}
        </div>

        {/* Chat Body */}
        <div className="flex flex-col p-5 bg-white w-full h-full pb-20">
          <div className="flex flex-col items-end pb-20 h-full overflow-y-scroll">
          {messages && messages.map((msg, i) =>
            <div key={i} className={`w-fit m-1 p-3 rounded  ${isMe(msg.username) ? `self-end  bg-blue-500 text-white` : `self-start bg-white border text-black`}`}>
              <div className={'text-xs'}>{msg.username}</div>
              {msg.message}
            </div>
          )}
          </div>
        </div>

        {/* Chat Footer */}
        <div className="absolute p-1 bg-white w-full bottom-0">
          <form className="flex w-full justify-between bg-slate-100 rounded-full py-2 px-2 my-2" onSubmit={sendMessage}>
            <input
              className="w-80 bg-slate-100"
              placeholder="Message here ..."
              onChange={e => setMessage(e.target.value)}
              value={message}
            />
            <button type="submit" className="flex justify-center items-center rounded-full bg-green-700 h-8 p-2 aspect-square">
              <img src={require('./assets/png/Vector.png')} />
            </button>

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
