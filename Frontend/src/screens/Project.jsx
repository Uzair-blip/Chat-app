import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'

const Project = () => {
    const [sidepanelOpen, setSidepanelOpen] = useState(false);
    
    const location=useLocation()
    console.log(location.state)
  return (
    <div>
        <main className='h-screen w-screen flex'>
<section className='left h-full flex flex-col min-w-96 relative border border-r-2'>
<header 
className='flex w-full p-4 justify-end bg-slate-200'
>
    <button onClick={()=>setSidepanelOpen(!sidepanelOpen)}>
<i className="ri-group-fill text-xl p-2 rounded-full bg-slate-400"></i>
    </button>
</header>
<div className="conversation-box flex-grow flex flex-col bg-slate-300 ">
    <div className="message flex flex-col flex-grow">
<div className="incoming-msg p-4 flex flex-col gap-1 max-w-56 m-2 min-h-10 rounded-lg bg-slate-50 mt-3">
<small className='opacity-65 text-xs'>ali@gmail.com</small>
<p className='leading-4 text-sm'>Lorem ipsum dolor sit amet.</p>
</div>
<div className="outgoing-msg p-4 ml-auto flex flex-col gap-1 w-56 m-2 min-h-10 rounded-lg bg-white mt-3">
<small className='opacity-65 text-xs'>ali@gmail.com</small>
<p className='leading-4 text-sm'>Lorem ipsum dolor sit amet.</p>
</div>


    </div>
    <div className="input flex w-full">
        <input className='p-2 px-4 border-none outline-none w-[85%]' type="text" placeholder='Enter message' id="" />
       <button className='flex-grow bg-white'><i className="ri-send-plane-fill text-2xl"></i></button>
</div>
</div>
<div className={`sidepanel w-full h-full flex flex-col gap-2 bg-white absolute top-0 transition-all  ${sidepanelOpen?"translate-x-0":"-translate-x-full"}`}>
<header 
className='flex w-full p-4 justify-end bg-slate-200'
>
    <button onClick={()=>setSidepanelOpen(!sidepanelOpen)}>
<i className="ri-close-fill text-xl p-2 rounded-full bg-white"></i>
    </button>
</header>
<div className="users flex flex-col gap-2 ">
<div className="user flex gap-3 cursor-pointer hover:bg-slate-200 p-2  ">
    <div className='p-4 aspect-square bg-slate-300 rounded-full w-fit h-fit items-center relative'>
    <i className='ri-user-fill w-fit h-fit absolute  top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'></i>
    </div>
    <h1 className='font-semibold'>username</h1>
</div>

</div>
</div>
</section>
{/* <section className='right h-full w-[80%]'></section> */}
        </main>
    </div>
  )
}

export default Project