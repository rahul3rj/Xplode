import React, { useEffect, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom';
import axios from '../utils/axios';

const Community = () => {
  const { name } = useParams();
  const location = useLocation();
  const [communityData, setCommunityData] = useState('');
  const [loading, setLoading] = useState(true);
  
  const fetchCommunityData = async () => {
    try {
      setLoading(true);
      let response;

      if (name) {
        // Dynamic route: /community/:name (POST request)
        response = await axios.post(`/community/${name}`);
        setCommunityData(response.data);
      } else if (location.pathname === '/community/trigger') {
        // Specific route: /community/trigger (GET request)
        response = await axios.get("/community/trigger");
        setCommunityData(response.data);
      } else {
        // Default case
        setCommunityData("Welcome to Community Page");
      }
    } catch (err) { 
      console.error("Failed to fetch community data:", err);
      setCommunityData("Error loading community data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCommunityData();
  }, [name, location.pathname]); 

  // Get current route info for display
  const getRouteInfo = () => {
    if (name) {
      return {
        type: "Game Community",
        route: `/community/${name}`,
        method: "POST"
      };
    } else if (location.pathname === '/community/trigger') {
      return {
        type: "Trigger Route", 
        route: "/community/trigger",
        method: "GET"
      };
    } else {
      return {
        type: "Community Home",
        route: "/community",
        method: "N/A"
      };
    }
  };

  const routeInfo = getRouteInfo();
  
  return (
    <div className='absolute h-screen w-full z-30 overflow-y-auto hide-scrollbar'>
      <img
        src="../bg.svg"
        alt=""
        className="fixed inset-0 w-full h-full object-cover pointer-events-none select-none saturate-140 -z-10"
        style={{ zIndex: -10 }}
      />
      <div className='absolute top-[12svh] left-[10%] h-[88svh] w-[90%] z-30 overflow-y-auto hide-scrollbar'>
        <div className='h-full w-full flex flex-col items-center justify-center gap-8'>
          
          {loading ? (
            <h1 className='text-2xl font-bold text-white'>Loading...</h1>
          ) : (
            <>
              {/* Route Information */}
              <div className='text-center mb-6'>
                <h2 className='text-2xl font-bold text-purple-400 mb-2'>
                  {routeInfo.type}
                </h2>
                <p className='text-gray-300 text-sm'>
                  Route: <code className='bg-gray-800 px-2 py-1 rounded'>{routeInfo.route}</code>
                </p>
                <p className='text-gray-300 text-sm'>
                  Method: <code className='bg-gray-800 px-2 py-1 rounded'>{routeInfo.method}</code>
                </p>
              </div>

              {/* API Response */}
              <div className='text-center'>
                <h1 className='text-4xl font-bold text-white mb-4'>
                  {communityData}
                </h1>
                <p className='text-gray-400 text-lg'>
                  Backend API Response
                </p>
              </div>

              {/* Navigation Info */}
              <div className='mt-8 text-center text-gray-500 text-sm'>
                <p>Try clicking different buttons in Community Section to see different responses</p>
              </div>

              {/* Refresh Button */}
              <button 
                onClick={fetchCommunityData}
                className='mt-6 px-6 py-2 bg-[#A641FF] text-white rounded-lg hover:bg-[#8A33CC] transition-colors'
              >
                Refresh Data
              </button>
            </>
          )}
          
        </div>
      </div>
    </div>
  )
}

export default Community;