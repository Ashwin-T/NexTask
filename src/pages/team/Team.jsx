import './team.css'
import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc, query, where, onSnapshot, collection } from "firebase/firestore";

import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';

import {GiDirectorChair} from 'react-icons/gi';
import {AiOutlineDashboard} from 'react-icons/ai';
import {GrAdd, GrWorkshop} from 'react-icons/gr';

import {useState, useEffect} from 'react';

import Loading from "../../components/loading/Loading";
import Task from "../../components/task/Task";
import Navbar from '../../components/navbar/Navbar'

import { useNavigate } from 'react-router-dom';

const Team = () => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [goals, setGoals] = useState([]);

    const [eventGoals, setEventGoals] = useState([]);
    const [techGoals, setTechGoals] = useState([]);
    const [outreachGoals, setOutreachGoals] = useState([]);
    

    const auth = getAuth();
    const db = getFirestore();
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async() => {
            setLoading(true)
            const docRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setData(docSnap.data());

                if(docSnap.data().team !== "Lead"){
                    const q = query(collection(db, docSnap.data().team + '/goals/goals'), where("status", "!=", "placeHolderLol"));
                    onSnapshot(q, (querySnapshot) => {
                        const tempArr = [];
                        querySnapshot.forEach((doc) => {
                            tempArr.push(doc);
                        });
                        setGoals(tempArr);
                    })
                }
                else if(docSnap.data().role === "Director" && docSnap.data().team === "Lead"){
                    const q = query(collection(db, 'Event' + '/goals/goals'), where("status", "!=", "placeHolderLol"));
                    onSnapshot(q, (querySnapshot) => {
                        const tempArr = [];
                        querySnapshot.forEach((doc) => {
                            tempArr.push(doc);
                        });
                        setEventGoals(tempArr);
                    })

                    const q2 = query(collection(db, 'Tech' + '/goals/goals'), where("status", "!=", "placeHolderLol"));
                    onSnapshot(q2, (querySnapshot) => {
                        const tempArr = [];
                        querySnapshot.forEach((doc) => {
                            tempArr.push(doc);
                        });
                        setTechGoals(tempArr);
                    })

                    const q3 = query(collection(db, 'Outreach' + '/goals/goals'), where("status", "!=", "placeHolderLol"));
                    onSnapshot(q3, (querySnapshot) => {
                        const tempArr = [];
                        querySnapshot.forEach((doc) => {
                            tempArr.push(doc);
                        });
                        setOutreachGoals(tempArr);
                    })

                }
            }
            
            setLoading(false); 

        }
        getData();
    }, [db])
        

    const adminActions = [
        {
            icon: <AiOutlineDashboard size = {20}/>,
            name: 'Back To Dashboard',
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

    return (
        <>
            {loading ? <Loading /> : 
                <>
                    <Navbar />
                    <div className = 'admin-page-container'>
                        <div className='inner'>
                            <div className='title'>
                                <h1>Team Goals</h1> 
                               <h3 className="role">{data.team === 'Lead' ? 'Sonav View' : data.team + ' Team'}</h3>
                            </div>
                            <div className='admin-page-content'>
                                <div className="top">
                                {
                                    data.team === "Lead" ? 
                                        <>
                                        <h1>
                                            Event Team Goals
                                        </h1>
                                        {
                                            eventGoals.length === 0 && <p style={{color: 'green'}}>Event Team has no pending goals!</p>
                                        }

                                        {
                                            eventGoals.map((task, index) => {
                                                return(
                                                    <Task key = {task.id} docz = {task} editable = {true}/>
                                                )
                                            })
                                        }
                                        <h1>
                                            Tech Team Goals
                                        </h1>
                                        {
                                            techGoals.length === 0 && <p style={{color: 'green'}}>Tech Team has no pending goals!</p>
                                        }
                                        {
                                            techGoals.map((task, index) => {
                                                return(
                                                    <Task key = {task.id} docz = {task} editable = {true}/>
                                                )
                                            })
                                        }
                                        <h1>
                                            Outreach Team Goals
                                        </h1>
                                        {
                                            outreachGoals.length === 0 && <p style={{color: 'green'}}>Outreach Team has no pending goals!</p>
                                        }
                                        {
                                            outreachGoals.map((task, index) => {
                                                return(
                                                    <Task key = {task.id} docz = {task} editable = {true}/>
                                                )
                                            })
                                        }
                                    </>
                                    :
                                    <>
                                        <h1>
                                            {data.team} Team Goals
                                        </h1>
                                        {
                                            goals.length === 0 && <p style={{color: 'var(--main-color)'}}>{data.team} has no pending goals!</p>
                                        }
                                        {
                                            goals.map((goal, index) => {
                                                return <Task key = {goal.id} docz = {goal} editable = {data.role !== "Director"} />
                                            })
                                        }
                                    </>
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                    {data.role === "Director"&& <SpeedDial
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
                    </SpeedDial>    }                
                </>
            }
        </>
      );
}

 
export default Team;