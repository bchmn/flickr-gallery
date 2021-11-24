import React from 'react';
import './App.scss';
import Gallery from '../Gallery';

class App extends React.Component {
  static propTypes = {
  };

  constructor() {
    super();
    this.state = {
      tag: 'art',
      isTagChanged: false
    };
  }

  handleIsTagChanged(){
    // this.state.isTagChanged? this.setState({ isTagChanged: false}) : this.setState({ isTagChanged: true})
    if(this.state.isTagChanged){
      this.setState({ isTagChanged: false}) 
      console.log("handleIsTagChanged");
    }
  }

  render() {
    return (
      <div className="app-root">
        <div className="app-header">
          <h2>Flickr Gallery</h2>
          <input className="app-input" onChange={event => this.setState({tag: event.target.value, isTagChanged: true})} value={this.state.tag}/>
        </div>
        <Gallery tag={this.state.tag} isTagChanged={this.state.isTagChanged} handleIsTagChanged={this.handleIsTagChanged.bind(this)}/>
      </div>
    );
  }
}

export default App;
