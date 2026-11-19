import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DEFAULT_AVATAR_URL = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';

export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        } else {
            setSearchTerm('');
        }
    }, [location.search]);

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to='/'>
                    <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                        <span className='text-slate-500'>Nuhand</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </Link>

                <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input
                        type="text"
                        placeholder="Search..."
                        className='bg-transparent focus:outline-none w-24 sm:w-64'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type='submit'>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>  
        <ul className='flex gap-4'>
            <Link to ='/'>
            <li className='hidden sm:inline text-slate-700 hover:underline'>Home</li>
            </Link>
            
            <Link to='/About'>
             <li className='hidden sm:inline text-slate-700 hover:underline'>About</li>
            </Link>


             <Link to='/profile'>
             {currentUser ? ( 
               
                <img
                    className='rounded-full h-7 w-7 object-cover'
                    src={currentUser.avatar || DEFAULT_AVATAR_URL}
                    onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = DEFAULT_AVATAR_URL;
                    }}
                    alt='profile'
                />

                ): <li className=' text-slate-700 hover:underline'>SignIn</li>
                    
                }

           </Link>
            
           

            </ul> 
        </div>
        
    </header>
  )
}
