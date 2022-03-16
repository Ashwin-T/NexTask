import Navbar from '../../components/navbar/Navbar'
import Loading from '../../components/loading/Loading'
import {app} from '../../tools/Firebase'

import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';

import React from 'react';

import { getAuth } from 'firebase/auth';
import { getFirestore, getDoc, doc, collection, query, onSnapshot, where, setDoc } from 'firebase/firestore';

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import {GrUserAdmin, GrAdd, GrWorkshop} from 'react-icons/gr';

import './dashboard.css'
import Task from '../../components/task/Task';
const Dashboard = () => {
    const [loading, setLoading] = useState(true);
    const [inSystem, setInSystem] = useState(false);
    const [submitted, setSubmitted] = useState(localStorage.getItem('submitted'));

    const auth = getAuth(app);
    const db = getFirestore(app);

    const [data, setData] = useState({});
    const [pendingTasks, setPendingTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    
    const navigate = useNavigate();

    const handleSubmit = async(requestTeam) => {
        setLoading(true);
        const docRef = doc(db, requestTeam + '/pending/pending', auth.currentUser.uid);
        await setDoc(docRef, {
            email: auth.currentUser.email,
            name: auth.currentUser.displayName,
            role: 'member',
            shortName: auth.currentUser.displayName.split(' ')[0],
            team: requestTeam,
            uid: auth.currentUser.uid
        }).then(()=>{
            setSubmitted('yes');
            localStorage.setItem('submitted', 'yes');
        })
        setLoading(false);
        
    }


    useEffect(
        ()=>{
            const getData = async() => {
                const docRef = doc(db, "users", auth.currentUser.uid);
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()){
                    const data = docSnap.data();
                    setData(data);
                    setInSystem(true);
                    setLoading(false);
                    setSubmitted('yes');
                }
                else{
                    setInSystem(false);
                    setLoading(false);
                    return;
                }

                const q = query(collection(db, "users/" + auth.currentUser.uid + "/tasks"), where("status", "!=", "placeHolderLol"));
                onSnapshot(q, (querySnapshot) => {
                    const tempArr = [];
                    querySnapshot.forEach((doc) => {
                        tempArr.push(doc);
                    });
                    setPendingTasks(tempArr.filter((doc) => doc.data().status !== "green"));
                    setCompletedTasks(tempArr.filter((doc) => doc.data().status === "green")); 
                });                  
            }

            getData();
        }, [])

        const adminActions = [
            {
                icon: <GrUserAdmin size = {20}/>,
                name: 'Director Panel',
                onClick: () => {
                    navigate("/admin");
                }
            },
            {
                icon: <GrWorkshop size = {20}/>,
                name: 'Add Team Goal',
                onClick: () => {
                    navigate("/add-task/team");
            
                }
            },
            {
                icon: <GrAdd size = {20}/>,
                name: 'Add Task',
                onClick: () => {
                    navigate("/add-task/individual");
                }
            }
        ]


    return ( 
        <>
            {loading ? <Loading /> : 

                <>
                    {inSystem ?
                        <>
                            <Navbar />
                            <div className = 'dashboard-container' id = 'dashbaord'>
                                <div className='inner'>
                                    <div className='title'>
                                        <h1>Dashboard</h1>
                                        {data.role === "Director" && <h3 className='role'>{data.team} {data.role}</h3>} 
                                    </div>
                                    <div className='dashboard-content'>
                                        <div className="task-group-container">
                                            <h1>Your Pending Tasks</h1> 
                                            <br />
                                            {
                                                pendingTasks.map((task, index) => {
                                                    return <Task docz = {task} completedTaskArrayFunc = {setCompletedTasks} pendingTaskArray = {setPendingTasks} key = {task.id}/>
                                                })
                                            }
                                            {pendingTasks.length === 0 && <p style={{color: 'green'}}>You have no pending tasks!</p>}

                                            <br />
                                            <h1>Your Completed Tasks</h1> 
                                            <br />
                                            {
                                                completedTasks.map((task, index) => {
                                                    return <Task docz = {task} completedTaskArrayFunc = {setCompletedTasks} pendingTaskArray = {setPendingTasks} key = {task.id}/>
                                                })
                                            }
                                            {completedTasks.length === 0 && <p style = {{color: 'crimson'}}>You have no completed tasks!</p>}
                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {
                                data.role === "Director" && 
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
                            }
                        </>

                    : 
                        <>
                            {
                            <div className = 'apply-container'>
                                    {submitted === null ?
                                    <>
                                        <div className='apply-content'>
                                            <div className='title'>
                                                <h1>Apply Into The System</h1>
                                            </div>
                                            <h2>Click Which Team You Have Been Assigned/Chosen</h2> 
                                            <br />   
                                            <button onClick={()=>{handleSubmit('Event')}}>
                                                Event
                                            </button>  
                                            <br />   
                                            <button onClick={()=>{handleSubmit('Tech')}}>
                                                Tech
                                            </button>  
                                            <br />   
                                            <button onClick={()=>{handleSubmit('Outreach')}}>
                                                Outreach
                                            </button>             
                                        </div>
                                    </>

                                    :

                                    <>
                                        <div className='apply-content'>
                                            <div className='title'>
                                            <h1>Your request has been sent!</h1>
                                            </div>
                                            <h2>Now contact your director to approve your request!</h2>           
                                        </div>
                                    </>
                                    
                                    }
                                </div>
                            }
                        </>
                    }
                </>
            }
        </>
     );
}
 
export default Dashboard;