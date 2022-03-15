import './navbar.css'
import logo from '../../images/logo.png'
import { Link } from 'react-router-dom'
import {getAuth} from 'firebase/auth'
import {app} from '../../tools/Firebase'

const Navbar = () => {

    const auth = getAuth(app);
    
    const handleLogout = async() => {
        await auth.signOut();
    }

    return ( 
        <>
            <nav>
                <img src = {logo} alt = 'logo' />

                <div className="nav-content">
                    <Link className = 'hover-underline-animation' to = '/'>
                        <h3>
                            Dashboard
                        </h3>
                    </Link>

                    <Link className = 'hover-underline-animation' to ='/team'>
                        <h3>
                            Team Goals 
                        </h3>
                    </Link>
                    <div className = 'hover-underline-animation' onClick = {handleLogout}>
                        <h3>
                            Logout
                        </h3>
                    </div>
                </div>
                

            </nav>
        </>
     );
}
 
export default Navbar;