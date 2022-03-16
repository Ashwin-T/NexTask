import { getAuth } from "firebase/auth";
import { getFirestore, getDoc, doc, query, where, onSnapshot, collection, getDocs } from "firebase/firestore";
import {useState, useEffect} from 'react';

import Loading from "../../components/loading/Loading";
import Navbar from "../../components/navbar/Navbar";
import Task from "../../components/task/Task";
import Approval from "../../components/approval/Approval";

import { useNavigate } from "react-router-dom";
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';


import {GiDirectorChair} from 'react-icons/gi';
import {AiOutlineDashboard} from 'react-icons/ai';
import {GrAdd, GrWorkshop} from 'react-icons/gr';


import './admin.css';
const Admin = () => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);

    const [allTeamTasks, setAllTeamTasks] = useState([]);
    const [directorTasks, setDirectorTasks] = useState([]);

    const [eventTasks, setEventTasks] = useState([]);
    const [techTasks, setTechTasks] = useState([]);
    const [outreachTasks, setOutreachTasks] = useState([]);
    const [requests, setRequests] = useState([]);

    const auth = getAuth();
    const db = getFirestore(); 
    let navigate = useNavigate();

   
    useEffect(() => {
        const getTeamData = async(teamTemp) => {
            const docRefMembers = doc(db, teamTemp, "members");
            const docSnapMembers = await getDoc(docRefMembers); 
            if(docSnapMembers.exists()){
                const tempMembArray = docSnapMembers.data().members;
                tempMembArray.forEach((member) => {
                    const q = query(collection(db, "users/" + member + "/tasks"), where("status", "!=", "placeHolderLol"));
                        onSnapshot(q, (querySnapshot) => {
                        const tempArr2 = [];
        
                        querySnapshot.forEach((doc) => {
                            tempArr2.push(doc);
                        });
                        if(teamTemp === 'Event'){
                            setEventTasks(tempArr2);
                        }
                        else if(teamTemp === 'Tech'){
                            setTechTasks(tempArr2);
                        }
                        else if(teamTemp === 'Outreach'){
                            setOutreachTasks(tempArr2);
                        }
                        setAllTeamTasks(tempArr2);
                    });       
                });    
            }
            else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }    

        const getData = async() => {
            setLoading(true)
            const docRef = doc(db, "users", auth.currentUser.uid);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()){
                setData(docSnap.data());
                if(docSnap.data().role === "Director" && docSnap.data().team !== "Lead"){
                    await getTeamData(docSnap.data().team);

                    const collectionRefRequests = collection(db, docSnap.data().team, 'pending', 'pending')
                    const querySnapshot = await getDocs(collectionRefRequests);
                    const tempArr = [];
                    querySnapshot.forEach((doc) => {
                        tempArr.push(doc);
                    });

                    setRequests(tempArr);
                }
                else if(docSnap.data().role === "Director" && docSnap.data().team === "Lead"){
                    await getTeamData("Event");
                    await getTeamData("Tech");
                    await getTeamData("Outreach");
                }
            }

            const q = query(collection(db, 'Director/members/tasks'), where("status", "!=", "placeHolderLol"));
            onSnapshot(q, (querySnapshot) => {
                const tempArr = [];
                querySnapshot.forEach((doc) => {
                    tempArr.push(doc);
                });
                setDirectorTasks(tempArr);
            })
               
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
                    {
                        data.role === "Director" ?
                        <>
                            <div className = 'admin-page-container'>
                                <div className='inner'>
                                    <div className='title'>
                                        <h1>Director Dashboard</h1> 
                                        {data.role === "Director" && <h3 className="role">{data.team} {data.role}</h3>} 
                                    </div>
                                    <div className='admin-page-content'>
                                        <div className="top">
                                            <h1>
                                                Director Team Tasks
                                            </h1>
                                            {directorTasks.length === 0 && <p style={{color: 'green'}}>You have no pending tasks!</p>}
                                            {
                                                directorTasks.map((task, index) => {
                                                    return(
                                                        <Task key = {task.id} docz = {task} editable = {false}/>
                                                    )
                                                })
                                            }

                                        </div>
                                        <div className="bottom">
                                            
                                            {
                                                data.team === "Lead" ?
                                                <>
                                                    <h1>
                                                        Event Team Tasks
                                                    </h1>
                                                    {
                                                        eventTasks.length === 0 && <p style={{color: 'green'}}>Event Team have no pending tasks!</p>
                                                    }

                                                    {
                                                        eventTasks.map((task, index) => {
                                                            return(
                                                                <Task key = {task.id} docz = {task} editable = {true}/>
                                                            )
                                                        })
                                                    }
                                                    <h1>
                                                        Tech Team Tasks
                                                    </h1>
                                                    {
                                                        techTasks.length === 0 && <p style={{color: 'green'}}>Tech Team have no pending tasks!</p>
                                                    }
                                                    {
                                                        techTasks.map((task, index) => {
                                                            return(
                                                                <Task key = {task.id} docz = {task} editable = {true}/>
                                                            )
                                                        })
                                                    }
                                                    <h1>
                                                        Outreach Team Tasks
                                                    </h1>
                                                    {
                                                        outreachTasks.length === 0 && <p style={{color: 'green'}}>Outreach Team have no pending tasks!</p>
                                                    }
                                                    {
                                                        outreachTasks.map((task, index) => {
                                                            return(
                                                                <Task key = {task.id} docz = {task} editable = {true}/>
                                                            )
                                                        })
                                                    }
                                                </>

                                                :

                                                <>
                                                    <h1>
                                                        {data.team} Team Tasks
                                                    </h1>
                                                    {
                                                        allTeamTasks.length === 0 && <p style={{color: 'green'}}>You have no pending tasks!</p>
                                                    }
                                                    {
                                                        allTeamTasks.map((task, index) => {
                                                            return(
                                                                <Task key = {task.id} docz = {task} editable = {true}/>
                                                            )
                                                        })
                                                    }</>
                                            }
                                            
                                            </div>

                                            <div className="">
                                                {
                                                    data.team !== "Lead" &&
                                                    <>
                                                        <h1>
                                                            {data.team} Team Requests
                                                        </h1>
                                                        {
                                                            requests.length === 0 && <p style={{color: 'green'}}>You have no pending requests!</p>
                                                        }   
                                                        {
                                                            requests.map((request, index) => {

                                                                return(
                                                                    <Approval key = {request.id} team = {data.team}request = {request}/>
                                                                )
                                                            })
                                                        }
                                                    </>
                                                }
                                            </div>
                                            <br />
                                        <div>  
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
 
export default Admin;