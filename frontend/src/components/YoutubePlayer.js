import React, { Component } from "react";
import {
  Grid,
  Typography,
  Card,
  IconButton,
  LinearProgress,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import YouTube from "react-youtube";

export default class YoutubePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
        player: null,
        status: -1,
        author: "",
        title: "",
        currentTime: 0,
        duration: 1,
    }
    this._onReady = this._onReady.bind(this);
    this._onStateChange = this._onStateChange.bind(this);
    this.updateVideo = this.updateVideo.bind(this);
    this.updatePlayer = this.updatePlayer.bind(this);

    console.log(this.state);

  }
  
  componentDidMount(){
    this.interval = setInterval(this._onStateChange, 1000);
    this.updatePlayerInterval = setInterval(this.updatePlayer, 1000);
    
  }


  updateVideo(){
    if (!this.state.player || !this.props.isHost && !this.props.guestCanControl)
      return;
    
  }

  _onReady(event) {
    // access to player in all event handlers via event.target
    this.setState({
      player: event.target,
    })
    console.log(this.state);
    event.target.playVideo();
    event.target.playVideo();
  }

  _onStateChange(event){
    if (!this.state.player)
      return;
    
    if (!this.props.isHost && !this.props.guestCanControl)
      return;

    const info = this.state.player.playerInfo;

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: this.props.roomCode,
        video_id: this.props.videoId,
        video_status: info.playerState,
        video_duration: info.duration,
        video_current_time: info.currentTime,
      })
      
    }
    this.props.statusCallBack(info.playerState);

    this.setState({status: info.playerState});
    if (this.state.status != -1)
    fetch('/api/update-video-room/', requestOptions)
      .then((response) => {
        if (!response.ok)
          return response.json()
      })
      .then((data) => console.log(data))
  }


  updatePlayer(){
    if (this.props.isHost)
      return;
    if (!this.state.player){
      return;
    }
    fetch('/api/current-video/')
      .then((response) => {
        if(response.ok){
          return response.json();
        }
          return;
      })
      .then((data) => {
        this.setState({
          videoId: data.id,
          status: data.status,
          duration: data.duration,
        });
        if (this.state.currentTime+5 < data.time || this.state.currentTime > data.time+5){
          this.state.player.seekTo(data.time);
        }
        this.props.statusCallBack(data.status);
        if (data.status == 1)
            this.state.player.playVideo();
        else{
          if (this.state.currentTime != data.time)
            this.state.player.seekTo(data.time+0.2);
          this.state.player.pauseVideo();
          
        }
        this.setState({currentTime: data.time+0.2})

      });
    
  }

  render() {
        const songProgress = (this.state.currentTime / this.state.duration )*100;
        return (
              <YouTube 
                videoId={this.props.videoId} 
                opts={this.props.opts} 
                onStateChange={this._onStateChange} 
                onReady={this._onReady} />
        );
    }
        
         
    ;
    
}