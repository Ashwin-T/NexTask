import Source from "./pages/Source"
import Login from './pages/login/Login'


import { useAuthState } from "react-firebase-hooks/auth"
import { getAuth } from "firebase/auth"

import Loading from "./components/loading/Loading"

import {app} from './tools/Firebase'

const App =()=>{

  const [user, loadingUser, errorUser] = useAuthState(getAuth(app));

  return (
    <>
      {loadingUser || errorUser ? <Loading /> : user ? <Source /> : <Login />}
    </>
  )
}

export default App
