import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import Image from "../Image";
import "./Gallery.scss";
import LightBoxEx from "../LightBox/LightBox";
import InfiniteScroll from "react-infinite-scroll-component";


class Gallery extends React.Component {
  static propTypes = {
    tag: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.getImages = this.getImages.bind(this, this.props.tag);

    this.state = {
      images: [],
      galleryWidth: this.getGalleryWidth(),
      isOpen: false,
      currentImgForLightBox: {},
      numberOfPhotos: 0,
      currentTag: this.props.tag,
      dragId: "",
      order:0,
    };
  }

  getGalleryWidth() {
    try {
      return window.innerWidth;
    } catch (e) {
      return 1000;
    }
  }
  getImages(tag2) {
    const { isTagChanged, handleIsTagChanged, tag } = this.props;
    const getImagesUrl = `services/rest/?method=flickr.photos.search&api_key=522c1f9009ca3609bcbaf08545f067ad&tags=${tag}&tag_mode=any&per_page=${100}&format=json&nojsoncallback=${1}`;
    const baseUrl = "https://api.flickr.com/";
    axios({
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
          if (!isTagChanged) {
            const nonReplicatedSet = new Set();
           const nonReplicatedImages = [...this.state.images, ...res.photos.photo].map(
              (img) => {
                this.setState({order: this.state.order +1})
                nonReplicatedSet.add(img, this.state.order);
                if (nonReplicatedSet.has(img.id)) {
                  nonReplicatedSet.clear(img)
                }
              }
            );
            console.log(nonReplicatedSet);
            this.setState({ images: Array.from(nonReplicatedSet) });
          } else {

            // if(this.state.order > 0){
            //   this.setState({order: 0})
            // }

            this.setState({order: this.state.order + 1})
            const withoutDuplication = new Set();

            [...res.photos.photo].filter((img)=>{
              withoutDuplication.add(img, this.state.order);
              if (withoutDuplication.has(img.id)) {
                withoutDuplication.clear(img)
              }
            })
            this.setState({ images: Array.from(withoutDuplication)});
            handleIsTagChanged(); // false
          }
        }
      });
  }

  //change the order of the images
  handleDrag = (ev) => {
    this.setState({ dragId: ev.currentTarget.id });
  };

  handleDrop = (ev) => {
    const { images, dragId } = this.state;

    const dragImg = images.find((img) => img.id === dragId);
    const dropImg = images.find((img) => img.id === ev.currentTarget.id);

    const dragImgOrder = dragImg.id;
    const dropImgOrder = dropImg.id;
    
    const newImgState = images.map((img) => {
      if (img.id === dragId) {
         img.order = dropImgOrder;
       

      }
      if (img.id === ev.currentTarget.id) {
         img.order = dragImgOrder;
        

      }

      return img;
    });
    this.setState({ images: newImgState });
  };


  componentDidMount() {
    this.getImages(this.props.tag);
    this.setState({
      galleryWidth: window.innerWidth,
    });
  }

  componentWillReceiveProps(props) {
    this.getImages(props.tag);
  }

  handleDeleteImg(imgToDelete) {
    const arrAfterDeleteImg = this.state.images.filter(
      (img) => img.id !== imgToDelete.id
    );
    this.setState({ images: arrAfterDeleteImg });
  }

  handleIsOpenImg(currentImg) {
    this.setState({ currentImgForLightBox: currentImg });
    this.setState({ isOpen: true });
  }
  
  hideLightBox() {
    this.setState({
      isOpen: false,
    });
  }

  handleScroll() {}

  render() {
    const uniqId = new Date();
    const random = Math.floor(Math.random(uniqId.setMilliseconds() * 10));
    const {tag} = this.props;
    const { isOpen, currentImgForLightBox, images, galleryWidth } = this.state;

    return (
      <div className={isOpen ? "gallery-root" : "active"}>
        {isOpen ? (
          <div
            className="gallery-lightBox"
            onClick={this.hideLightBox.bind(this)}
          >
            <LightBoxEx
              images={images}
              currentImgForLightBox={currentImgForLightBox}
              isOpen={isOpen}
              galleryWidth={galleryWidth}
            />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={images.length}
            next={this.getImages.bind(tag)}
            hasMore={true}
            loader={<h4>Loading...</h4>}
            scrollThreshold={0.3}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {/* <div className={isOpen ? "gallery-root" : "active"}> */}
              {images
                .sort((a, b) => a.order - b.order)
                .map((dto, index) => {
                  return (
                    <Image
                      handleIsOpenImg={this.handleIsOpenImg.bind(this, dto)}
                      key={
                        "image-" +
                        uniqId.getFullYear().toString() +
                        index +
                        random +
                        dto.id
                      }
                      dto={dto}
                      handleDeleteImg={this.handleDeleteImg.bind(this, dto)}
                      images={images}
                      galleryWidth={galleryWidth}
                      handleDrag={this.handleDrag.bind(this)}
                      handleDrop={this.handleDrop.bind(this)}
                    />
                  );
                  
                })}
            {/* </div> */}
          </InfiniteScroll>
        )}
      </div>
    );
  }
}

export default Gallery;
