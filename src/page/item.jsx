import React, { useEffect, useState } from 'react';
import './item.css'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const hostname = process.env.REACT_APP_HOSTNAME;

function ItemPage(props) {

    const { "*": itemid } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState({
        loading: true,
        error: false,
    })

    const [enterOwnerName, setEnterOwnerName] = useState({
        window: false,
        submitted: false,
        ownername: '',
    })

    const [itemdet, setitemdet] = useState({
        title: '',
        founder: '',
        date: '',
        image: '',
        status: 'pending',
        permLevel: 255,
        foundlost_by: 0,
        foundbool: 0,
        owner: ''
    })

    const [reportWindow, setReportWindow] = useState({
        appear: false,
        submitted: false,
        reason: ''
    })

    const [session, setSession] = useState({
        id: 0
    })

    useEffect(() => {
        console.log(itemid)
        axios.get(`${hostname}/items/item?itemid=${itemid}`, {
            'headers': {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
            .then(res => {
                console.log(res.data)
                if (res.data === undefined || res.data === null || res.data === "") {
                    setLoading({
                        loading: false,
                        error: true,
                    })
                } else {
                    setitemdet({
                        title: res.data.item_name,
                        founder: res.data.username,
                        date: res.data.lost_since,
                        image: res.data.image,
                        status: res.data.status,
                        permLevel: res.data.permissionLevel,
                        foundlost_by: res.data.foundlost_by,
                        foundbool: res.data.founded.founded,
                        owner: res.data.founded.owner,

                    })
                    setLoading({
                        loading: false,
                        error: false,
                    })
                }
            })
            .catch(err => {
                console.log(err)
                setLoading({
                    loading: false,
                    error: true,
                })
            })
    }, [itemid])

    useEffect(() => {
        axios.get(`${hostname}/accounts/me?token=${localStorage.getItem('token')}`)
            .then((res) => {
                setSession({
                    id: res.data.userid
                })
            })
    }, [])

    return (
        <div className="ItemPage">
            {loading.loading ? (<div className="loading">Loading...</div>) : (loading.error ? (
                <span>
                    <div>No Item found or an error occurred</div>
                </span>
            ) : (<span>
                <h2>{itemdet.title}</h2>
                {itemdet.status === 'pending' ? (<div className="itempage-status-pending">This item is in review by staff<br /><br /></div>) : (null)}
                <span style={{
                    backgroundColor: "white",
                    display: "block",
                    padding: "15px",
                    width: "450px",
                    borderRadius: "7px"
                }}>
                    <img id="itempage-image" src={`${hostname}/cdn/image?img=${itemdet.image}`} alt="Lost Item" />
                    <p style={{ color: "black" }}>Lost since {itemdet.date} founded by {itemdet.founder}</p>
                </span>
                <br />
                {itemdet.permLevel <= 3 && itemdet.status === "pending" ? (<span>
                    <br />
                    <div id="itempage-sendmessage" onClick={() => {
                        if (window.confirm("Do you want to approve this item? This item will make it visible to all students.")) {
                            axios.post(`${hostname}/items/approve`, {
                                itemid: itemid
                            }, {
                                headers: {
                                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                                }
                            })
                                .then(res => {
                                    setitemdet({
                                        ...itemdet,
                                        status: 'approved'
                                    })
                                })
                        }
                    }}>Approve Item for Students</div><br />
                </span>) : (null)}
                {itemdet.foundbool === 1 ? (<div className="itempage-status-pending">This item has been returned to {itemdet.owner}<br /><br /></div>) : (
                    itemdet.permLevel <= 3 && itemdet.status === "approved" ? (
                        enterOwnerName.window ? (
                            enterOwnerName.submitted ? (<div>
                                This item has been returned to {enterOwnerName.ownername}<br /><br />
                            </div>) : (
                                <div>
                                    Enter Owner Name:<br />
                                    <input type="text" placeholder="Enter Owner Name" style={{ width: "50%" }} maxLength={50} onChange={(e) => setEnterOwnerName({ ...enterOwnerName, ownername: e.target.value })} value={enterOwnerName.ownername} /><br /><br />
                                    {enterOwnerName.ownername !== null && enterOwnerName.ownername !== undefined && enterOwnerName.ownername !== '' ? (
                                        <span><div id="itempage-sendmessage" onClick={() => {
                                            axios.post(`${hostname}/items/markfound`, {
                                                itemid: itemid,
                                                owner: enterOwnerName.ownername
                                            }, {headers: {
                                                Authorization: `Bearer ${localStorage.getItem('token')}`
                                            }})
                                            setEnterOwnerName({ ...enterOwnerName, submitted: true })
                                        }}>Mark Founded by {enterOwnerName.ownername}</div><br /></span>) : null}
                                    <div id="itempage-report" onClick={() => setEnterOwnerName({ ...enterOwnerName, window: false, ownername: '' })}>Cancel</div><br />
                                </div>
                            )) : (<div id="itempage-sendmessage" onClick={() => setEnterOwnerName({ ...enterOwnerName, window: true })}>Mark Founded</div>)
                    ) : (itemdet.permLevel > 3 ? (<div style={{padding: "10px"}}>You own this item? Please go to the facilities department to claim this lost item</div>) : (null)))}
                <br />
                {reportWindow.appear ? (
                    reportWindow.submitted ? (
                        <span>
                            <h2>Thanks for the report! The staff will review this item that isn't reliable!</h2>
                            <div id="itempage-report" onClick={() => setReportWindow({ ...reportWindow, appear: false, submitted: false })}>Close</div>
                        </span>
                    ) : (
                        <span>
                            <h2>Report Item</h2>
                            Please provide any details about the item that you think is not reliable<br />
                            <textarea value={reportWindow.reason} onChange={(e) => setReportWindow({ ...reportWindow, reason: e.target.value })}
                                style={{
                                    width: "100%",
                                    height: "150px"
                                }}>

                            </textarea>
                            <br />
                            <div id="itempage-report" onClick={() => {
                                axios.post(`${hostname}/items/report`, {
                                    itemid: itemid,
                                    reason: reportWindow.reason
                                }, {
                                    headers: {
                                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                                    }
                                })
                                setReportWindow({ ...reportWindow, submitted: true, reason: '' })
                            }}>Submit Report</div>
                            <br />
                            <div id="itempage-report" onClick={() => setReportWindow({ ...reportWindow, appear: false })}>Cancel</div>
                        </span>
                    )
                ) : (
                    <div id="itempage-report" onClick={() => setReportWindow({ ...reportWindow, appear: true })}>Report Item</div>
                )}
            </span>))}

            {itemdet.permLevel <= 3 || itemdet.foundlost_by === session.id ? (<span>
                <br />
                <div id="itempage-report" onClick={() => {
                    if (window.confirm("Do you want to delete this item?")) {
                        axios.delete(`${hostname}/items/delete`, {
                            data: {
                                itemid: itemid
                            },
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        })
                            .then(res => {
                                navigate('/')
                            })
                    }
                }}>Delete Item</div>
            </span>) : (null)}
        </div>
    )
}

export default ItemPage;