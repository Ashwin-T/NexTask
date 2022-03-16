import './approval.css';
import {doc, setDoc, getFirestore, deleteDoc, updateDoc, arrayUnion } from 'firebase/firestore'
const Approval = ({request, team}) => {

    const db = getFirestore();

    const handleDelete = async() => {
        const docRefDelete = doc(db, team + '/pending/pending', request.id);
        await deleteDoc(docRefDelete);
    }

    const handleAccept = async() => {
        const docRefSubmit = doc(db, 'users', request.data().uid);
        await setDoc(docRefSubmit, {
            email: request.data().email,
            name: request.data().name,
            role: request.data().role,
            shortName: request.data().shortName,
            team: request.data().team,
        })
        const updateDocRef = doc(db, request.data().team, 'members');
        await updateDoc(updateDocRef, {
            members: arrayUnion(request.data().uid)
        }) 

        handleDelete();
    }

   

    return (  
        <>
            <div className="approval-container">
                <h2>{request.data().name}</h2>
                <br />
                <div className="approval-accept">
                    <button className="approval-accept-button" style = {{backgroundColor: 'green'}} onClick = {handleAccept}>Accept</button>
                    <button className="approval-reject-button" style = {{backgroundColor: 'red'}} onClick = {handleDelete}>Reject</button>
                </div>
            </div>
        </>
    );
}
 
export default Approval;