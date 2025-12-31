import React from 'react'
import { Loader2 } from 'lucide-react'

const Loading = () => {
  return (
    <div>
      <Loader2 className='loading__spinner' />
      <p className='loading__text'>Loading...</p>
    </div>
  )
}

export default Loading
