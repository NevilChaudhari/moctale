"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';

export default function loginCard() {
    const router = useRouter();

    const Login = () => {
        router.push('/home'); // redirect to /target-page
    };

    const [logintype1, setlogintype] = useState(true);
    const [visible, setVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNo, setPhoneNo] = useState('');
    const allFilled = (logintype1 ? username.trim() !== '' : phoneNo.trim() !== '') && password.trim() !== '';

    return (
        <div className="bg-white rounded-lg flex flex-col justify-center items-center w-[48%] h-auto p-5 md:max-w-90">
            <label className='text-black font-semibold text-2xl mb-3.5'>Login</label>

            <div className="bg-gray-100 rounded-lg w-full p-1 flex mb-4">
                <button className={`cursor-pointer border-0 rounded-md flex-1 py-2 text-sm font-medium ${logintype1 ? "bg-white text-black shadow-sm" : "text-gray-500"}`} onClick={() => setlogintype(!logintype1)}>
                    Username
                </button>
                <button className={`cursor-pointer bg-none border-0 rounded-md flex-1 py-2 text-sm font-medium ${!logintype1 ? "bg-white text-black shadow-sm" : "text-gray-500"}`} onClick={() => setlogintype(!logintype1)}>
                    Phone
                </button>
            </div>

            {/* Username */}
            {logintype1 && (<label className='text-black self-start text-sm mb-1 font-semibold'>Username</label>)}
            {logintype1 && (<input type='text' onChange={(e) => setUsername(e.target.value)} value={username} className='mb-2.5 border border-gray-300 w-full px-2 rounded-md h-10 text-black placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-black/10' placeholder='Enter Your Username'></input>)}

            {/* Phone */}
            {!logintype1 && (<label className='text-black self-start text-sm mb-1 font-semibold'>Phone Number</label>)}
            {!logintype1 && (<div className='mb-2.5 w-full flex items-center text-black'>
                <div className='bg-gray-100 p-2 border-r-0 border-l border-t border-b rounded-l-md border-gray-300'>+91</div>
                <input type="number" min={0} max={9} onChange={(e) => setPhoneNo(e.target.value)} value={phoneNo} className='no-spinner border border-gray-300 w-full px-2 rounded-r-md h-10 text-black placeholder:text-gray-400 focus:outline-0 focus:ring-1 focus:ring-black/10' placeholder='Enter Your 10-digit number'></input>
            </div>)}

            {/* Password */}
            <label className='text-black self-start text-sm mb-1 font-semibold'>Password</label>
            <div className="mb-2.5 w-full flex items-center border border-gray-300 rounded-md px-2 focus-within:ring-1 focus-within:ring-black/10">
                <input type={`${visible ? "text" : "password"}`} onChange={(e) => setPassword(e.target.value)} value={password} className='border-0 w-full px-2 rounded-md h-10 text-black placeholder:text-gray-400 focus:outline-0' placeholder='Create a Password'></input>
                {visible && (<i className="bi bi-eye text-gray-500 text-2xl cursor-pointer" onClick={() => { setVisible(!visible) }}></i>)}
                {!visible && (<i className="bi bi-eye-slash text-gray-500 text-2xl cursor-pointer" onClick={() => { setVisible(!visible) }}></i>)}
            </div>

            <button onClick={() => { allFilled ? Login() : null }} className={`w-full rounded-full py-2 mt-8 text-md font-semibold cursor-pointer hover:opacity-90 ${allFilled ? "bg-linear-to-r from-[#B048FF] to-[#8F44F0]" : "bg-gray-400"}`}>Login</button>
            <label className='underline text-gray-700 font-medium text-sm mt-3 cursor-pointer'>Forgot Password?</label>
            <style jsx>{`
  /* Chrome, Safari, Edge, Opera */
  input.no-spinner::-webkit-outer-spin-button,
  input.no-spinner::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  input.no-spinner[type=number] {
    -moz-appearance: textfield;
  }
`}</style>
        </div>
    )
}
