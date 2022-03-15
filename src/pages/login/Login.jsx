
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import Landing from '../landing/Landing'
import {useState} from 'react';
import Landing from '../landing/Landing';
import logo from '../../images/logo.png';
import MainLogo from '../../images/mainLogo.png';
import './login.css';
const Login = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    const [page, setPage] = useState(1);
    const handleLogin = ()=>{
        signInWithPopup(auth, provider)
    }

    const LoginSubSection = () => {
        return(
            <div className="login-container">
                <div className="login-box">
                    <div>
                        <img src = {logo} alt="logo" className="login-logo"/>
                        <p>Presents</p>
                    </div>
                    <br />
                        <img src = {MainLogo} alt="logo" className="main-logo"/>
                    <br />
                    <button onClick = {handleLogin} className="loginButton">
                        Login with Google    
                    </button>
                </div>
            </div>
           
        )
    }

    return (  
        <>
            {page === 0 ? <Landing setPage={setPage}/> : <LoginSubSection/>}
        </>
    );
}
 
export default Login;