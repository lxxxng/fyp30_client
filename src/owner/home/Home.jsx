import React, { useContext } from 'react'
import Posts from '../../user/components/posts/Posts';
import Share from '../components/share/Share';


function Home() {

  

  return (
    <div className='home'>
      <Share />
      <Posts/>
    </div>
  )
}

export default Home