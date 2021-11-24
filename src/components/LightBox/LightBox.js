import React from "react";
import PropTypes from "prop-types";
import "./lightBox.scss";
import FontAwesome from "react-fontawesome";

class LightBoxEx extends React.Component {
  static propTypes = {
    currentImgForLightBox: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.showNext = this.showNext.bind(this);
    this.showPrev = this.showPrev.bind(this);
    this.state = {
      photoIndex: 0,
      isOpen: this.props.isOpen,
      lightBoxMood: this.props.currentImgForLightBox,
      imageToShow: `https://farm${this.props.currentImgForLightBox.farm}.staticflickr.com/${this.props.currentImgForLightBox.server}/${this.props.currentImgForLightBox.id}_${this.props.currentImgForLightBox.secret}.jpg`,
    };
  }

  showNext = (e) => {
    e.stopPropagation();
    const { images } = this.props;
    let currentIndex = images.indexOf(this.state.lightBoxMood);
    console.log(currentIndex);
    if (currentIndex >= images.length - 1) {
      this.setState({
        isOpen: false,
      });
    } else {
      let nextImage = images[currentIndex + 1];
      console.log(nextImage);
      this.setState({
        imageToShow: `https://farm${nextImage.farm}.staticflickr.com/${nextImage.server}/${nextImage.id}_${nextImage.secret}.jpg`,
        lightBoxMood: nextImage,
      });
    }
    // window.location.href = `https://farm${this.props.currentImgForLightBox.farm}.staticflickr.com/${this.props.currentImgForLightBox.server}/${this.props.currentImgForLightBox.id}_${this.props.currentImgForLightBox.secret}.jpg`
  };

  showPrev = (e) => {
    e.stopPropagation();
    const { images } = this.props;
    let currentIndex = images.indexOf(this.state.lightBoxMood);
    console.log(currentIndex);
    if (currentIndex >= images.length - 1) {
      this.setState({
        isOpen: false,
      });
    } else {
      let prevImage = images[currentIndex - 1];
      console.log(prevImage);
      this.setState({
        imageToShow: `https://farm${prevImage.farm}.staticflickr.com/${prevImage.server}/${prevImage.id}_${prevImage.secret}.jpg`,
        lightBoxMood: prevImage,
      });
    }
    // window.location.href = `https://farm${this.props.currentImgForLightBox.farm}.staticflickr.com/${this.props.currentImgForLightBox.server}/${this.props.currentImgForLightBox.id}_${this.props.currentImgForLightBox.secret}.jpg`
  };

  render() {
    return (
      <div className="continer-lightBox">
        <button className="lightBox-button" onClick={this.showPrev}>
          <i id="lightBox-i" className="fas fa-chevron-circle-left"></i>Prev
        </button>
        
        <img className="lightBox-img" src={`${this.state.imageToShow}`} />

        <button className="lightBox-button" onClick={this.showNext}>
          <i id="lightBox-i" className="fas fa-chevron-circle-right"></i>Next
        </button>
      </div>
    );
  }
}

export default LightBoxEx;
