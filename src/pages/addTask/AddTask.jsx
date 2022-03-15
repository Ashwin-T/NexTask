import { useState, useEffect } from "react";
import { getFirestore, addDoc, collection, query, doc, getDocs, where, getDoc } from "firebase/firestore";
// Add a new document with a generated id.
import { getAuth } from "firebase/auth";
import { useNavigate, useParams, Link } from "react-router-dom";
import './addTask.css'
import Navbar from "../../components/navbar/Navbar";
import Loading from "../../components/loading/Loading";
import {GiDirectorChair} from 'react-icons/gi';
import {AiOutlineDashboard} from 'react-icons/ai';
import {GrAdd, GrWorkshop, GrUserAdmin} from 'react-icons/gr';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import MuiAlert from '@mui/material/Alert';

const AddTask = () => {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [dueBy, setDueBy] = useState('');
    const [data, setData] = useState({});
    const [link, setLink] = useState('');
    const [submitted, setSubmitted] = useState(false);

    let {type} = useParams();
    let navigate = useNavigate();

    const [error, setError] = useState('');

    const [loading, setLoading] = useState(false);
    

    const db = getFirestore();
    const auth = getAuth();
    

    const adminActions = [
        {
            icon: <GrUserAdmin size = {20}/>,
            name: 'Director Panel',
            onClick: () => {
                navigate('/admin');
            }
        },
        {
            icon: <AiOutlineDashboard size = {20}/>,
            name: 'Dashboard',
            onClick: () => {
                navigate('/');
            }
        },
        {
            icon: <GiDirectorChair size = {20}/>,
            name: 'Add Director Task',
            onClick: () => {
                navigate('/add-task/director');
            }
        },
        {
            icon: <GrWorkshop size = {20}/>,
            name: 'Add Team Goal',
            onClick: () => {
                navigate('/add-task/team');
            }
        },
        {
            icon: <GrAdd size = {20}/>,
            name: 'Add Task',
            onClick: () => {
                navigate('/add-task/individual');
            }
        }
    ]

    useEffect(() => {

        const getData = async() => {
            setLoading(true)
            const docRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setData(docSnap.data());
            }
            setLoading(false);
        }

        getData();

    }, [db, auth])

    const handleSubmit = async(e) => {
        e.preventDefault();
        if(type === 'individual'){
            let uid = ''
            const q = query(collection(db, "users"), where("shortName", "==", name));

            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              uid = doc.id;
            });


            if(uid === '') {
                setError('This user does not exist or is not on your team yet!')
                return;
            }

            const collectionRef = collection(db, 'users/' + uid + '/tasks');
            await addDoc(collectionRef, {
                title: title,
                description: description,
                directorEmail: auth.currentUser.email,
                assignedTo: name,
                dueBy: dueBy,
                team: data.team,
                status: 'red',
                uid: uid,
                where: link
            }).then(()=>{
                setTitle('');
                setDescription('');
                setName('');
                setDueBy('');
                setLink('');
                setError('');
                console.log('Task added');
                setSubmitted(true);
            }).catch(err => setError(err.message));
        }
        else if(type === 'director'){
            const collectionRef = collection(db, 'Director/members/tasks/');
            await addDoc(collectionRef, {
                title: title,
                description: description,
                dueBy: dueBy,
                directorEmail: auth.currentUser.email,
                assignedTo: 'Director',
                uid: auth.currentUser.uid,
                status: 'red',
                where: link
            }).then(()=>{
                setTitle('');
                setDescription('');
                setName('');
                setDueBy('');
                setLink('');
                setError('');
                console.log('Task added');
                setSubmitted(true);
            }).catch(err => setError(err.message));
        }
        else if(type === 'team'){
            const collectionRef = collection(db, data.team + '/goals/goals');
            await addDoc(collectionRef, {
                title: title,
                description: description,
                dueBy: dueBy,
                directorEmail: auth.currentUser.email,
                assignedTo: data.team,
                uid: auth.currentUser.uid,
                status: 'red',
                where: link
            }).then(()=>{
                setTitle('');
                setDescription('');
                setName('');
                setDueBy('');
                setLink('');
                setError('');
                console.log('Task added');
                setSubmitted(true);
            }).catch(err => setError(err.message));
        }
    }

   
    return (
        <>
            {
                loading ? <Loading /> :
                    <>
                        <Navbar />
                        {
                            data.role === "Director" ?
                            <>
                                <div className = 'add-task-container'>
                                    <div className='inner'>
                                        <div className='title'>
                                            <h1>Add {type.charAt(0).toUpperCase() + type.slice(1)} {type !== 'team' ? 'Task' : 'Goal'}</h1> 
                                            {
                                                type !== 'director' && <Link to = '/add-task/director'><p style = {{color: 'var(--main-color)'}}>Only Non Lead Director Directors can assign tasks. To assign a Director Task click here</p></Link>
                                            }
                                        </div>
                                        <div className='add-task-content'>
                                            <div className="left">
                                                <form onSubmit={handleSubmit}>
                                                    <div className="form-group"> 
                                                    {/* IK this has unnessicary flex boxes.I will use this in the future for more things tho! */}
                                                        <div className="input-group">
                                                            <div className="input">
                                                                <h1 htmlFor="title">Title</h1>
                                                                <input type="text" required className="form-control" value = {title} id="title" placeholder="Enter title" onChange={(e) => setTitle(e.target.value)}/>
                                                            </div>
                                                        </div>
                                                        <div className="input-group">
                                                            <div className="input">
                                                                <h1 htmlFor="description">Description</h1>
                                                                <input type="text" required className="form-control" value = {description} placeholder="Enter description" onChange={(e) => setDescription(e.target.value)} />
                                                            </div>
                                                        </div>
                                                        {type === 'individual' &&
                                                            <div className="input-group">
                                                                    <div className="input">
                                                                    <h1 htmlFor="name">Assign To</h1>
                                                                    <input type="text" required className="form-control" value = {name} id="name" placeholder="Enter first name" onChange={(e) => setName(e.target.value)}/>
                                                                </div>
                                                            </div>
                                                        }
                                                        {
                                                            type !== 'team' &&
                                                            <div className="input-group">
                                                                <div className="input">
                                                                    <h1 htmlFor="where">Where/Link</h1>
                                                                    <input type="text" required className="form-control" value = {link} id="where" placeholder="Enter where/link" onChange={(e) => setLink(e.target.value)}/>
                                                                </div>
                                                            </div>
                                                        }
                                                        
                                                        <div className="input-group">
                                                            <div className="input">
                                                                <h1 htmlFor="dueBy">Finish by</h1>
                                                                <input type="text" required className="form-control" value = {dueBy} id="dueBy" placeholder="Enter due by" onChange={(e) => setDueBy(e.target.value)}/>
                                                            </div>
                                                        </div>
                                                        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column'}}>
                                                            {
                                                                error !== '' && 
                                                                <>
                                                                    <br />
                                                                    <MuiAlert severity="error" sx = {{width: '15rem'}}>{error}</MuiAlert >
                                                                </>
                                                            }
                                                            {
                                                                submitted && 
                                                                <>
                                                                    <br />
                                                                    <MuiAlert severity="info" sx = {{width: '15rem'}}>Task Added!</MuiAlert >                                                                
                                                                </>
                                                            }  
                                                            <br />
                                                            <button type="submit">Submit</button>
                                                            <br />
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="right">
                                            
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <SpeedDial
                                ariaLabel="SpeedDial basic example"
                                sx={{ position: 'absolute', bottom: 25, right: 25}}
                                icon={<SpeedDialIcon />}
                            >
                                    {
                                    adminActions.map((action) => (
                                        <SpeedDialAction
                                        key={action.name}
                                        icon={action.icon}
                                        tooltipTitle={action.name}
                                        onClick={action.onClick}
                                        />
                                    ))
                                    }
                                </SpeedDial>
                            
                            </>

                            :

                        
                            <>
                            <div className = 'task-page-container'>
                                <div className='inner'>
                                    <div className='title'>
                                        <h1>You do not have access to this URL</h1> 
                                        <p onClick = {()=>navigate('/')}>Click here to go back!</p>
                                    </div>
                                </div>
                            </div>
                        </>
                            
                        }
                    </>
            }
        
        </>

      );
}
 
export default AddTask;