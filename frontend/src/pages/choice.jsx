import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4} from "uuid"


export default function Choice() {

    const [btnPref, setBtnPref] = useState("");
    const [enterCode, setEnterCode] = useState("");
    const navigate = useNavigate();

    return (
        <>
            <div className="choice-container">
                <div className="login-pannel"></div>
                <div className="choice-option-container">
                    <div className="choice-pannel">
                        <button id="create-meet-btn" onClick={() => { 
                            setBtnPref("createMeet")
                            const id =uuidv4()
                            navigate(`/meet/${id}`) 
                        }} >Create Meet</button>
                        <button id="join-meet-btn" onClick={() => { setBtnPref("joinMeet") }} >Join Meet</button>
                        <br />
                        {btnPref === 'joinMeet' && (<>
                            <input type="text" placeholder="Enter meet code" id="meet-code-input" onChange={(e)=>{setEnterCode(e.target.value)}} />
                            <button onClick={()=>{navigate(`/meet/${enterCode}`)}} >Enter</button>
                        </>)}
                    </div>
                </div>
            </div>
        </>
    )
}