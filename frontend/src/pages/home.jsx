import { useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate();
    return(
        <>
            <div className="home">
                <div className="home-nav-bar">
                    <div className="home-nav-head">
                        <h2>WebMeet</h2>
                    </div>
                    <div className="home-nav-acc">
                        <button onClick={()=>{navigate('/login')}}>SignIn</button>
                        <button onClick={()=>{navigate('/login')}}>SignUp</button>
                    </div>
                </div>
                <div className="main-content">
                    <p>Connectivity can improves ideas and thoughts...</p>
                    <button>Let Connect</button>
                </div>
            </div>
        </>
    )
}
 
export default Home;