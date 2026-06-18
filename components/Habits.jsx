import React from 'react'
import OverallProgressCard from './OverallProgressCard'
import Habitcard from './Habitcard'
import Dailyprogessgraph from './Dailyprogessgraph';

function Habits() {
  return (
    <>
      <div>
        <div>
          <h1 className=" h-9 font-bold text-[30px] leading-9  
           tracking-normal text-[#0D1828] rounded-none">
            Habit Tracker
          </h1>
        </div>
        <div>
          <p
            className=" mt-1 h-5 font-normal text-[14px]  habi
            leading-5 tracking-normal text-[#475565] rounded-none">
            Track your daily habits and build consistency
          </p>
        </div>
      </div>
      <div>
        <div className='flex gap-3 align-center items-center'>
          <div className='flex mt-5'>
            <Habitcard />
          </div>
          <div className=' m-5' >
            <OverallProgressCard />
          </div>
        </div>
        <div>
          <div className=' mt-5'>
            <Dailyprogessgraph />
          </div>
        </div>
      </div>
    </>
  )
}

export default Habits;
