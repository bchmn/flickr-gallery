import React from "react";
import PropTypes from "prop-types";
import FontAwesome from "react-fontawesome";
import "./Image.scss";
import LightBoxEx from "../LightBox/LightBox";

class Image extends React.Component {
  static propTypes = {
    dto: PropTypes.object,
    galleryWidth: PropTypes.number,
    images: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.calcImageSize = this.calcImageSize.bind(this);
    this.handleRotateImg = this.handleRotateImg.bind(this);
    this.handleLargerImg = this.handleLargerImg.bind(this);

    this.state = {
      size: 150,
      isDelete: false,
      afterDeleteImg: [],
      rotation: 0,
      isOpen: false,
     
    };
  }


  calcImageSize() {
    const { galleryWidth } = this.props;
    const targetSize = 150;
    const imagesPerRow =Math.floor(Math.round(galleryWidth / targetSize)) ;
    const size = galleryWidth / imagesPerRow  ;
    this.setState({
      size,
    });
  }

  componentDidMount() {
    this.calcImageSize();
  }

  urlFromDto(dto) {
    return `https://farm${dto.farm}.staticflickr.com/${dto.server}/${dto.id}_${dto.secret}.jpg`;
  }

  handleRotateImg() {
    let newRotation = this.state.rotation + 90;
    if (newRotation >= 360) {
      newRotation = -360;
    }
    this.setState({
      rotation: newRotation,
    });
  }

  handleLargerImg() {
    this.setState({
      isOpen:true
    })
  }

  render() {
    const { rotation } = this.state;
    const {dto, handleDeleteImg, handleIsOpenImg, handleDrag, handleDrop  } = this.props 
    return (
      <div
        draggable={true}
        id={dto.id}
        onDragOver={(ev)=> ev.preventDefault()}
        onDragStart={handleDrag.bind(this)}
        onDrop={handleDrop.bind(this)}
        className="image-root"
        style={{
          backgroundImage: `url(${this.urlFromDto(dto)})` ,
          width: this.state.size + "px",
          height: this.state.size + "px",
          transform: `rotate(${rotation}deg)`,
        }}
        onClick={(ev)=>{console.log(ev.currentTarget);}}
      >
        <div>
          <FontAwesome
            className="image-icon"
            name="sync-alt"
            title="rotate"
            onClick={this.handleRotateImg}
          />
          <FontAwesome
            className="image-icon"
            name="trash-alt"
            title="delete"
            onClick={handleDeleteImg.bind(this)}
          />
          <FontAwesome
            className="image-icon"
            name="expand"
            title="expand"
            onClick={handleIsOpenImg.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default Image;
