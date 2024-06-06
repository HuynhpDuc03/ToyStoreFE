import React from 'react'
import HearderComponent from '../HearderComponent/HearderComponent'
import FooterComponent from '../FooterComponent/FooterComponent'

const DefaultComponent = ({ children }) => {
    return (
        <div className='Header'>
            <HearderComponent />
            {children}
            <FooterComponent />
        </div>
    )
}

export default DefaultComponent