import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "../Image";
import Modal from "../Modal";
import Loader from "../Loader";
import "./Gallery.scss";
import ExpandCarousel from "../ExpandCarousel/ExpandCarousel";

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
    numberOfImages: PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      numberOfImages: 100,
      imageIndex: 0,
      isExpanded: false,
      pageNumber: 1,
      isLoading: false,
    };
    this.deleteHandler = this.deleteHandler.bind(this);
    this.expandHandler = this.expandHandler.bind(this);
    this.onModalClose = this.onModalClose.bind(this);
    this.nextHandler = this.nextHandler.bind(this);
    this.previousHandler = this.previousHandler.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
    this.resizeHandler = this.resizeHandler.bind(this);
  }

  getGalleryWidth() {
    try {
      return document.body.clientWidth;
    } catch (e) {
      return 1000;
    }
  }

  getImages(tag, numberOfImages = 100, pageNumber = 1) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${numberOfImages}&format=json&nojsoncallback=1&page=${pageNumber}`;
    const baseUrl = "https://api.flickr.com/";
    return axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: "GET",
    })
      .then((res) => res.data)
      .then((res) => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          return res.photos.photo;
        }
      });
  }
  resizeHandler() {
    this.setState({ galleryWidth: this.getGalleryWidth() });
  }

  deleteHandler(imageId) {
    let imageRemovedArr = this.state.images.filter(
      (image) => image.id !== imageId
    );
    this.setState({ images: imageRemovedArr });
  }

  expandHandler(imageIndex) {
    this.setState({
      imageIndex,
      imageDto: this.state.images[imageIndex],
      isExpanded: true,
    });
  }

  scrollHandler() {
    const positionY = window.scrollY;
    const height = window.innerHeight;
    const isNeedMoreImages =
      positionY + height >= document.body.offsetHeight - 200;
    if (isNeedMoreImages) {
      const newPageNumber = this.state.pageNumber + 1;
      if (this.state.isLoading) return;
      this.setState({ isLoading: true });
      this.getImages(this.props.tag, 100, newPageNumber)
        .then((images) =>
          this.setState({
            images: [...this.state.images, ...images],
            pageNumber: newPageNumber,
            isLoading: false,
          })
        )
        .catch((err) => {
          this.setState({ isLoading: false });
          console.error(err);
        });
    }
  }

  nextHandler() {
    let newIndex = this.state.imageIndex + 1;
    if (newIndex >= this.state.images.length) {
      newIndex = 0;
    }
    this.setState({
      imageIndex: newIndex,
      imageDto: this.state.images[newIndex],
    });
  }

  previousHandler() {
    let newIndex = this.state.imageIndex - 1;
    if (newIndex < 0) {
      newIndex = this.state.images.length - 1;
    }
    this.setState({
      imageIndex: newIndex,
      imageDto: this.state.images[newIndex],
    });
  }

  onModalClose() {
    this.setState({ isExpanded: false });
  }

  componentDidMount() {
    window.addEventListener("scroll", this.scrollHandler);
    window.addEventListener("resize", this.resizeHandler);

    this.setState({ isLoading: true });
    this.getImages(this.props.tag)
      .then((images) =>
        this.setState({
          images,
          galleryWidth: this.getGalleryWidth(),
          isLoading: false,
        })
      )
      .catch((err) => {
        this.setState({ isLoading: false });
        console.error(err);
      });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag).then((images) =>
      this.setState({ images, pageNumber: 1 })
    );
  }
  render() {
    return (
      <div>
        <div
          className="gallery-root"
          style={{ overflowY: "auto" }}
          onScroll={this.handleScroll}
        >
          {this.state.images.map((dto, i) => {
            return (
              <Image
                key={"image-" + dto.id + i}
                dto={dto}
                galleryWidth={this.state.galleryWidth}
                deleteHandler={this.deleteHandler}
                expandHandler={this.expandHandler}
                index={i}
              />
            );
          })}
        </div>
        {this.state.isLoading && <Loader />}
        <Modal isOpen={this.state.isExpanded} onClose={this.onModalClose}>
          <ExpandCarousel
            dto={this.state.imageDto}
            prevHandler={this.previousHandler}
            nextHandler={this.nextHandler}
          />
        </Modal>
      </div>
    );
  }
}

export default Gallery;
