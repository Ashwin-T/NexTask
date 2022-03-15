import {BrowserRouter, Routes, Route} from 'react-router-dom'

import Dashboard from './dashboard/Dashboard';
import Team from './team/Team';
import TaskPage from './task/TaskPage';
import Admin from './admin/Admin';
import AddTask from './addTask/AddTask';
const Source = () => {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route exact path = '/' element = {<Dashboard />}/>
                    <Route path = '/team/' element = {<Team />}/>
                    <Route path = '/task/:id' element = {<TaskPage />}/>
                    <Route path = '/add-task/:type' element = {<AddTask />}/>
                    <Route path = '/admin' element = {<Admin />}/>
                </Routes>
            </BrowserRouter>
        </>
    );
}
 
export default Source;
