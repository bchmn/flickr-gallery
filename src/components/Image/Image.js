import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import './Image.scss';

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    idx: PropTypes.number,
    onExpand: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.handleRotate = this.handleRotate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      rotation: 0,
      isDeleted: false,
      size: 200,
      top: 0,
      windowHeight: window.innerHeight
    };
  }

  calcImageSize() {
    const {galleryWidth} = this.props;
    const targetSize = 200;
    const imagesPerRow = Math.round(galleryWidth / targetSize);
    const size = (galleryWidth / imagesPerRow);
    this.setState({
      size
    });
  }

  calcImagePos() {
    this.setState({
      top: this.container.offsetTop
    });
  }

  isVisible() {
    const {top, size} = this.state;
    const {scrollY, windowHeight} = this.props;
    const isBelowTop = (top + size) >= scrollY;
    const isAboveBottom = top <= (scrollY + windowHeight);
    return isBelowTop && isAboveBottom;
  }

  componentDidMount() {
    this.calcImageSize();
    this.calcImagePos();
  }

  componentWillReceiveProps(newProps) {
    if (newProps.galleryWidth !== this.props.galleryWidth) {
      this.calcImageSize();
    }
    this.calcImagePos();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  handleRotate() {
    this.setState({
      rotation: (this.state.rotation + 90) % 360
    });
  }

  handleDelete() {
    this.setState({
      isDeleted: true
    });
  }

  render() {
    return !this.state.isDeleted && (
      <div
        className="image-root"
        ref={node => this.container = node}
        style={{
          backgroundImage: this.isVisible() ? `url(${this.urlFromDto(this.props.dto)})` : '',
          width: this.state.size + 'px',
          height: this.state.size + 'px',
          transform: `rotate(${this.state.rotation}deg)`
        }}
        >
        <div
          style={{
            transform: `rotate(-${this.state.rotation}deg)`
          }}
        >
          <FontAwesome className="image-icon" name="sync-alt" onClick={this.handleRotate}/>
          <FontAwesome className="image-icon" name="trash-alt" onClick={this.handleDelete}/>
          <FontAwesome className="image-icon" name="expand" onClick={() => this.props.onExpand(this.props.idx)}/>
        </div>
      </div>
    );
  }
}

export default Image;
