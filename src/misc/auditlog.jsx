import React, { useEffect, useState } from 'react';
import axios from 'axios'
import './auditlog.css'
import { saveAs } from 'file-saver'

function AuditLogPage(props) {

    const [audits, setAudits] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOSTNAME}/audit`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then(res => {
                setAudits(res.data)
            })
    }, [])

    function Lists(array) {
        return array.map((audit, index) => {
            return <div key={index} style={{ marginBottom: "10px", backgroundColor: "rgb(104 137 176)", padding: "5px" }}>
                <span>{audit.since} - {audit.action} <br /> {audit.act_by} - {audit.description}</span>
            </div>
        })
    }

    function ExportCSV() {
        axios.get(`${process.env.REACT_APP_HOSTNAME}/audit/csv`, {
            responseType: 'blob',
            headers: {
                Accept: "application/vnd.ms-excel",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            saveAs(response.data, 'ilost_audit-' + new Date().toJSON() + '.csv');
        });
    }

    return (
        <div className='AuditLogWindow'>
            <h2>Audit Log</h2>
            <div id="additem-button" onClick={() => ExportCSV()}>Export as CSV</div>
            <br />
            {Lists(audits)}
        </div>
    )
}

export default AuditLogPage;