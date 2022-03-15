import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Loading from "../../components/loading/Loading";
import { useEffect, useState } from "react";
import { getFirestore, getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import './taskPage.css'
const TaskPage = () => {
    const {id} = useParams();
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();

    useEffect(() => {
        
        const getData = async () => {
            const docRef = doc(db, "users/" + auth.currentUser.uid + "/tasks", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setData( docSnap.data());
            }
            else{
                setData({});
            }
            setLoading(false);
        }

        getData();
    }, [])
    return (
        <>
                {
                    loading ? <Loading /> :

                    <>
                        <Navbar />
                        {data.title === undefined ? 

                        <div className = 'task-page-container'>
                            <div className='inner'>
                                <div className='title'>
                                    <h1>No Task Found</h1> 
                                    <p onClick = {()=>navigate('/')}>Click here to go back to your Dashboard</p>
                                </div>
                            </div>
                        </div>
                    :
                        
                        <div className = 'task-page-container'>
                            <div className='title'>
                                <h1>{data.title}</h1>
                                <h2>Assiged to <span style = {{color: 'var(--main-color)'}}>{data.assignedTo};</span> Due by <span style = {{color: 'var(--main-color)'}}>{data.by}</span></h2>
                            </div>
                            <div className='task-page-content'>
                                <h3>{data.description}</h3>
                                    <div className="vertical-button-group">
                                    <button onClick = {()=>navigate('/')}>Update Status</button>
                                    <br />
                                    {
                                        data.directorEmail !== null &&
                                        <>
                                            <button><a href = {'mailto:' + data.directorEmail} style = {{color: 'white'}}>Contact Director</a></button>
                                            <br />
                                        </>
                                        
                                    }
                                </div>
                            </div>
                        </div>
                        }
                    </>
                }

                
        </>
      );
}
export default TaskPage;