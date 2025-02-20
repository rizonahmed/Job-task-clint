import React from 'react';
import Navbar from '../Components/Navbar';
import TaskBoard from '../Components/TaskBoard';

const Home = () => {
    return (
        <div className='bg-indigo-400'>
            <Navbar />
            <TaskBoard />
        </div>
    );
};

export default Home;