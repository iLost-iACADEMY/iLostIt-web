import React, { useState } from 'react';
import './item.css'

function ItemPage(props) {
    return (
        <div className="ItemPage">
            <h2>Item</h2>
            <span style={{
                backgroundColor: "white",
                display: "block",
                padding: "15px",
                width: "450px",
                borderRadius: "7px"
            }}>
                <img id="itempage-image" src={null} alt="Lost Item" />
                <p style={{color: "black"}}>Lost since {"01-01-2023"} founded by {"moritz the isip bata web developer"}</p>
            </span>
            <br />
            <div id="itempage-sendmessage">Conatct Founder</div>
        </div>
    )
}

export default ItemPage;