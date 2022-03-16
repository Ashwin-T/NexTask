import './task.css';
import { useState } from 'react';
import { getFirestore, doc, updateDoc, deleteDoc} from 'firebase/firestore';
import {getAuth} from 'firebase/auth'; 
import {AiOutlineInfoCircle} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import {BsTrash} from 'react-icons/bs';

const Task = ({docz, editable,}) => {
    const [statusLocal, setStatusLocal] = useState(docz.data().status);

    const db = getFirestore();
    const auth = getAuth();
    let navigate = useNavigate();

    const cursor = editable ? {} :  {cursor: 'pointer'};

    const handleRedirect = () => {
        navigate('/task/' + docz.id)
    }


    const handleStatusChange = async() =>{       
        if(!editable){
            let temp = statusLocal;

            if(statusLocal === 'red'){
                temp = 'yellow';
            }
            else if(statusLocal === 'yellow'){
                temp = 'green';
            }
            else if(statusLocal === 'green'){
                temp = 'red';
            }
    
            setStatusLocal(temp);
            if(docz.data().assignedTo === 'Director'){
                const directorDocRef = doc(db, "Director", "members", "tasks", docz.id);
                await updateDoc(directorDocRef, {status: temp});
            }
            else if(docz.data().assignedTo === 'Event'){
                const eventDocRef = doc(db, "Event", "goals", "goals", docz.id);
                await updateDoc(eventDocRef, {status: temp});
            }
            else if(docz.data().assignedTo === 'Outreach'){
                const outreachDocRef = doc(db, "Outreach", "goals", "goals", docz.id);
                await updateDoc(outreachDocRef, {status: temp});
            }
            else if(docz.data().assignedTo === 'Tech'){
                const techDocRef = doc(db, "Tech", "goals", "goals", docz.id);
                await updateDoc(techDocRef, {status: temp});
            }
            else{
                const personalDocRef = doc(db, "users", docz.data().uid, "tasks", docz.id);
                await updateDoc(personalDocRef, {status: temp});
            }   
        }
        
    }
    
    const handleDelete = async() => {
        if(docz.data().assignedTo === 'Director'){
            const directorDocRef = doc(db, "Director", "members", "tasks", docz.id);
            await deleteDoc(directorDocRef);
        }
        else if(docz.data().assignedTo === 'Event'){
            const eventDocRef = doc(db, "Event", "goals", "goals", docz.id);
            await deleteDoc(eventDocRef);
        }
        else if(docz.data().assignedTo === 'Outreach'){
            const outreachDocRef = doc(db, "Outreach", "goals", "goals", docz.id);
            await deleteDoc(outreachDocRef);
        }
        else if(docz.data().assignedTo === 'Tech'){
            const techDocRef = doc(db, "Tech", "goals", "goals", docz.id);
            await deleteDoc(techDocRef);
        }
        else{
            const personalDocRef = doc(db, "users", docz.data().uid, "tasks", docz.id);
            await deleteDoc(personalDocRef);
        }
    }
    return (  
        <>
            <div className="task-container">
                <div className = 'task-header'>
                    <h1>{docz.data().title}</h1>
                    <AiOutlineInfoCircle style = {{color: '#6495ED', cursor: 'pointer'}} onClick = {handleRedirect}/>
                    {docz.data().directorEmail === auth.currentUser.email && <BsTrash style = {{color: 'red', cursor: 'pointer'}} onClick = {handleDelete}/>}
                </div>
                <div className={statusLocal + ' statusBar'} style = {cursor} onClick = {handleStatusChange}>
                    {statusLocal === "red" && <h3>Not Started</h3> || statusLocal === "green" && <h3>Completed</h3> || statusLocal === "yellow" && <h3>In Progress</h3>}   
                </div>
            </div>
            <br />

        </>
    );
}
 
export default Task;