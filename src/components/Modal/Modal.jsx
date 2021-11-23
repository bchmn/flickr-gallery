import React, { Component } from 'react'
import './Modal.scss'
export default class Modal extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            this.props.isOpen ?
                <div className="root">
                    <button className="close-btn" onClick={this.props.onClose}>&#128473;</button>
                    {this.props.children}
                </div> : null
        )
    }
}
