import Link from "next/link";
//import { FaUserCircle } from 'react-icons/fa';
import { useState } from "react";
import { Button, useTheme, useMediaQuery } from "@mui/material";
//import { IoHome } from "react-icons/io5";
//import { MdDashboard } from "react-icons/md";

const TopBar = ({ appname, homename = 'index' }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    
    return (
      <div className="fixed top-0 left-0 w-full bg-gray-800 text-white flex justify-between items-center p-2 z-50">
        <div className="flex items-center space-x-2 mr-3">
          <Link href = '/index'>
            {/*<MdDashboard className="w-6 h-6 text-white" />*/}
          </Link>
        </div>
        <div className="flex-1">
          <p>
            {appname}
          </p>
        </div>
          <div className="flex items-center space-x-2 mr-3">
            <Link href = { homename }>
              {/*<IoHome className="w-6 h-6 text-white" />*/}
            </Link>
          </div>
      </div>
    );
  };
  
  export default TopBar;