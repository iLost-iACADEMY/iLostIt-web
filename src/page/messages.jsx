import React, { useEffect, useState } from 'react';
import './register.css'
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const hostname = process.env.REACT_APP_HOSTNAME;

export function MessagesPage(props) {
    const [messagelist, setMessageList] = useState([]);

    useEffect(() => {
        axios.get(`${hostname}/messages/list`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            setMessageList(res.data)
        })
    }, [])

    function MessageList() {
        return (<div>
            
        </div>)
    }

    return (
        <div style={{padding: "10px"}}>
            <h2>Messages</h2>
            {messagelist.map((message, index) => {
                console.log(message)
                return (
                    <Link to={`/messages/${message.item}/${message.accid}`}><div key={index} style={{
                        marginTop: "80px",
                        marginBottom: "10px",
                        paddingBottom: "20px",
                        color: "#FFFFFF"
                    }}>
                        <img src={`${hostname}/cdn/image?img=${message.image}`} style={{
                            maxHeight: "80px",
                            position: 'absolute',
                            marginTop: "-80px"
                        }} />
                        <span>{message.item_name} - {message.username}</span>
                        
                    </div></Link>
                )
            })}
        </div>
    )
}


export function DirectMessagePage(props) {
    const { ":item": itemid } = useParams();
    const { ":user": userid } = useParams();

    const [messages, setMessages] = useState();

    function message() {

    }

    return (
        <div style={{padding: "10px"}}>
            <h2>Message</h2>

        </div>
    )
}