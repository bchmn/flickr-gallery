import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Image from '../Image';
import Expand from '../Expand';
import './Gallery.scss';

class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string
  };

  constructor(props) {
    super(props);
    window.addEventListener('scroll', this.getMoreImagesIfNeeded.bind(this));
    window.addEventListener('resize', this.resizeGallery.bind(this));

    this.handleExpand = this.handleExpand.bind(this);

    this.state = {
      images: [],
      page: 1,
      expandIdx: -1,
      galleryWidth: this.getGalleryWidth()
    };
  }

  getGalleryWidth(){
    try {
      return document.body.getBoundingClientRect().width;
    } catch (e) {
      return 1000;
    }
  }

  resizeGallery() {
    this.setState({
      galleryWidth: this.getGalleryWidth()
    });
  }

  getImages(tag) {
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=100&page=${this.state.page}&format=json&nojsoncallback=1`;
    const baseUrl = 'https://api.flickr.com/';
    axios({
      url: getImagesUrl,
      baseURL: baseUrl,
      method: 'GET'
    })
      .then(res => res.data)
      .then(res => {
        if (
          res &&
          res.photos &&
          res.photos.photo &&
          res.photos.photo.length > 0
        ) {
          // console.log(res.photos.photo);
          this.gettingImages = false;
          this.setState({images: this.state.images.concat(res.photos.photo)});
        }
      });
  }

  getMoreImagesIfNeeded() {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    this.setState({
      scrollY,
      windowHeight
    });
  
    const scrollRemainder = document.body.clientHeight - scrollY - window.innerHeight;
    if (scrollRemainder < 500 && !this.gettingImages) {
      this.gettingImages = true;
      this.setState({
        page: this.state.page + 1
      }, () => {
        this.getImages(this.props.tag);
      });
    }
  }

  handleExpand(expandIdx) {
    this.setState({
      expandIdx
    });
  }

  resetImages(tag) {
    this.setState({
      page: 1,
      images: []
    }, () => {
      this.getImages(tag);
    });
  }

  componentDidMount() {
    this.resetImages(this.props.tag);
  }

  componentWillReceiveProps(props) {
    this.resetImages(props.tag);
  }

  render() {
    return (
      <div className="gallery-root">
        {this.state.images.map((dto, idx) => {
          return <Image key={'image-' + dto.id} dto={dto} idx={idx} onExpand={this.handleExpand} galleryWidth={this.state.galleryWidth} scrollY={this.state.scrollY} windowHeight={this.state.windowHeight} />;
        })}
        <Expand images={this.state.images} expandIdx={this.state.expandIdx} onClose={() => this.handleExpand(-1)}/>
      </div>
    );
  }
}

export default Gallery;
