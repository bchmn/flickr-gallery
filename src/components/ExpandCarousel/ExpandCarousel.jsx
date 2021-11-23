import React from 'react'
import './ExpandCarousel.scss'
export default function ExpandCarousel(props) {
    const urlFromDto = dto => `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`



return (
    <div className='expand-container'>
        <button className='previous-btn' onClick={props.prevHandler}>&#8249;</button>

        <div className="image-container">
            <img src={urlFromDto(props.dto)} alt="" />
        </div>
        <button className='next-btn' onClick={props.nextHandler}>&#8250;</button>

    </div>
)
}
