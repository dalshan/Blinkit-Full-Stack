import React, { useState, useEffect } from 'react';
import { FaRegEyeSlash } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import toast from 'react-hot-toast';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import { Link, useNavigate } from 'react-router-dom';
import fetchUserDetails from '../utils/fetchUserDetails';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../store/userSlice';

const Login = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const valideValue = Object.values(data).every(el => el);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await Axios({
                ...SummaryApi.login,
                data: data,
            });

            if (response.data.error) {
                toast.error(response.data.message);
            }

            if (response.data.success) {
                toast.success(response.data.message);
                localStorage.setItem('accesstoken', response.data.data.accesstoken);
                localStorage.setItem('refreshToken', response.data.data.refreshToken);

                const userDetails = await fetchUserDetails();
                dispatch(setUserDetails(userDetails.data));

                setData({
                    email: "",
                    password: "",
                });
                navigate("/");
            }

        } catch (error) {
            AxiosToastError(error);
        }
    };

    // Check for existing tokens on page load
    useEffect(() => {
        const accessToken = localStorage.getItem('accesstoken');
        if (accessToken) {
            // User already logged in (tokens exist)
            fetchUserDetails(accessToken)
                .then(response => {
                    dispatch(setUserDetails(response.data));
                    navigate('/'); // Redirect to homepage
                })
                .catch(error => {
                    // Handle errors (e.g., invalid token)
                    console.error('Error fetching user details:', error);
                    // Optionally clear tokens and redirect to login
                    localStorage.removeItem('accesstoken');
                    localStorage.removeItem('refreshToken'); 
                });
        }
    }, [dispatch, navigate]);

    return (
        <section className='w-full container mx-auto px-2'>
            <div className='bg-white my-4 w-full max-w-lg mx-auto rounded p-7'>
                <form className='grid gap-4 py-4' onSubmit={handleSubmit}>
                    {/* ... rest of the form */}
                </form>
                {/* ... rest of the component */}
            </div>
        </section>
    );
};

export default Login;

