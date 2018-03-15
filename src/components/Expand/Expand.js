import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Expand.scss';

class Expand extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    onClose: PropTypes.func,
    images: PropTypes.array.isRequired,
    expandIdx: PropTypes.number
  };

  constructor(props) {
    super(props);
    this.handleNext = this.handleNext.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.state = {
      idx: -1
    };
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  handleNext() {
    this.setState({
      idx: (this.state.idx + 1) % this.props.images.length
    });
  }

  handlePrev() {
    this.setState({
      idx: (this.state.idx - 1) % this.props.images.length
    });
  }

  componentWillReceiveProps(props) {
    this.setState({
      idx: props.expandIdx
    });
  }

  render() {
    return this.state.idx >= 0 && (
      <div
        className="expand-container"
        style={{
          backgroundImage: `url(${this.urlFromDto(this.props.images[this.state.idx])})`
        }}
        >
        <FontAwesome className="expand-closeIcon" name="times-circle" onClick={this.props.onClose}/>
        <FontAwesome className="expand-nextIcon" name="chevron-right" onClick={this.handleNext}/>
        <FontAwesome className="expand-prevIcon" name="chevron-left" onClick={this.handlePrev}/>
      </div>
    );
  }
}

export default Expand;
