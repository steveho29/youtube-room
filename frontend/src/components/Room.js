import { Component } from "react";
import React from "react";
import { Grid, Typography, Button, Card, TextField, FormHelperText, RadioGroup, Radio, IconButton } from "@material-ui/core";
import { FormControl, Collapse, FormControlLabel } from "@material-ui/core";
import YoutubePlayer from "./YoutubePlayer";
import Alert from "@material-ui/lab/Alert";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import PauseIcon from "@material-ui/icons/Pause";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import { makeStyles } from '@material-ui/core/styles';


export default class Room extends Component {
    constructor(props){
        super(props);
        this.state = {
            roomCode: this.props.match.params.roomCode,
            guestCanControl: false,
            tmpGuestCanControl: false,
            isHost: false,
            showSetting: false,
            videoId: "",
            tmpVideoId: "",
            opts: {
                height: '300',
                width: '300',
                playerVars: {
                  // https://developers.google.com/youtube/player_parameters
                  autoplay: 0,
                  controls: 0,
                },
              },
            updateStatus: null,
            status: -1,
            triggerAlert: false,
            alertValue: ""
        };

        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.getRoomDetails();

        this.handleLeaveRoom = this.handleLeaveRoom.bind(this);
        this.renderSettings = this.renderSettings.bind(this);
        this.renderYoutubePlayer = this.renderYoutubePlayer.bind(this);

        
        // Setting Buttons
        this.handleGuestCanControlChange = this.handleGuestCanControlChange.bind(this);
        this.handleSubmitButtonPressed = this.handleSubmitButtonPressed.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.renderRadioButton = this.renderRadioButton.bind(this);
        this.checkRoomCode = this.checkRoomSettings.bind(this);
        this.checkRoomSettings = this.checkRoomSettings.bind(this);

        this.statusCallBack = this.statusCallBack.bind(this);
        this.renderAlert = this.renderAlert.bind(this);
        
    }   
    
    statusCallBack(value){
        this.setState({
            status: value,
        })
    }

    checkRoomSettings(){
        fetch('/api/get-room?code='+this.state.roomCode)
            .then((response) => {
                if (!response.ok){
                    this.props.leaveRoomCallBack();
                    this.setState({
                        roomCode: "NOT EXISTS",
                    })
                }
                return response.json()
            })
            .then((data) =>{
                if (data.video_id != this.state.videoId || data.guest_can_control != this.state.guestCanControl)
                    this.getRoomDetails();
            })
    }

    componentDidMount() {
        this.interval = setInterval(this.checkRoomSettings, 1000);
      }
    
    componentWillUnmount() {
        clearInterval(this.interval);
      }

    getRoomDetails(){
        fetch('/api/get-room?code='+this.state.roomCode)
            .then((response) => {
                if (!response.ok){
                    this.props.leaveRoomCallBack();
                    this.setState({
                        roomCode: "NOT EXISTS",
                    })
                }
                return response.json()
            })
            .then((data) =>{
                this.setState({
                    videoId: data.video_id,
                    tmpVideoId: data.video_id,
                    guestCanControl: data.guest_can_control,
                    tmpGuestCanControl: data.guest_can_control,
                    isHost: data.is_host,
                    roomCode: data.code,
                    opts: {
                        height: '300',
                        width: '300',
                        playerVars: {
                            autoplay: 1,
                            // controls: (data.is_host || data.guest_can_control) ? 1 : 0,
                            controls: (data.is_host) ? 1 : 0,
                            // controls: 0,
                        },
                    }
                });
            });
    }


    handleLeaveRoom(){
        const requestOptions={
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },

        }
        fetch('/api/leave-room/', requestOptions)
            .then((_response) => {
                this.props.leaveRoomCallBack();
                this.props.history.push('/');
            });
    }
    

    // Setting Functions Here

    updateShowSetting(value){
        this.setState({
            showSetting: value,
        })
    }


    handleTextChange(e){
        this.setState({
            tmpVideoId: e.target.value,
        })
    }


    handleGuestCanControlChange(e){
        this.setState({
            tmpGuestCanControl: e.target.value === "true" ? true : false,
        });
    }

    handleSubmitButtonPressed(){
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                {
                    code: this.state.roomCode,
                    guest_can_control: this.state.tmpGuestCanControl,
                    video_id: this.state.tmpVideoId,
                }
            )
        };

        fetch('/api/update-room/', requestOptions)
            .then((response) => {
                if (response.ok){
                    this.setState({
                        updateStatus: true,
                    })
                    this.getRoomDetails();
                }
                else{
                    this.setState({
                        updateStatus: false,
                    })
                }
            })
    }

    renderRadioButton(){
        return (
            <FormControl component="fieldset">
                <FormHelperText>
                        <div align="center">Guest control music player</div>
                </FormHelperText>
                <RadioGroup row defaultValue={this.state.tmpGuestCanControl.toString()} onChange={this.handleGuestCanControlChange}>
                    <FormControlLabel 
                        value="true" 
                        control={<Radio color="primary" />} 
                        label="Yup"
                        labelPlacement="bottom"
                    />

                    <FormControlLabel
                        value="false"
                        control={<Radio color="secondary" />}
                        label="No control"
                        labelPlacement="bottom"
                    />
                </RadioGroup>
            </FormControl>
        )
    }


    renderSettingButton(){
        return (
        <Grid item xs={12}>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => this.updateShowSetting(true)}>
                Settings
            </Button>
        </Grid>)
    }

    renderSettings(){
        return (
            <Grid container spacing={1} justifyContent="center" align="center">
                
                <Grid item xs={12}>
                    <FormControl>
                        <TextField
                            label="Video ID"
                            placeholder="Enter Video ID"
                            value={this.state.tmpVideoId}
                            helperText=""
                            variant="outlined"
                            onChange = {this.handleTextChange}
                        />
                    /</FormControl>
                </Grid>
                
                
                <Grid item xs={12} align="center">
                    <Button 
                        color="primary" 
                        variant="contained" 
                        onClick={this.handleSubmitButtonPressed} >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        )
    }
  
    
    renderYoutubePlayer(){
        return (
            <YoutubePlayer {...this.state} statusCallBack={this.statusCallBack} />
        )
    }

    renderAlert(){
        return (
        <Alert severity="info" onClose={()=>{this.setState({triggerAlert: false})}}> {this.state.alertValue} </Alert>)
    }
    render () {
            const card = {
            borderRadius: 16,
            boxShadow: '0 15px 20px 0 #BDC9D7',
            overflow: 'hidden',};
        return (
                <Grid  container spacing={3} justifyContent="center" align="center">
                <div style={card}>
                <Card >
                    {this.renderYoutubePlayer()}
                    <IconButton onClick={() => {
                        const alerts = ['Man starts over again everyday, in spite of all he knows, against all he knows. 😊', 'All great beginnings start in the dark, when the moon greets you to a new day at midnight. 🙂',  'Never underestimate the power you have to take your life in a new direction. 😄' , "It's a new dawn, It's a new day, It's a new life for me. And I'm feeling good. 😜"]
                        this.setState({alertValue: alerts[Math.floor(Math.random() * alerts.length)]}); 
                        this.setState({triggerAlert: true});
                        }}>

                        {this.state.status != 1 ? <PlayArrowIcon /> : <PauseIcon />}
              </IconButton>
                </Card>
                </div>
                <Grid container item justifyContent="center">

                {this.state.triggerAlert ? this.renderAlert() : null}
                        </Grid>
                <Grid container item justifyContent="center">
                         <Collapse in={this.state.updateStatus != null}>
                            {this.state.updateStatus ? (
                                <Alert
                                    severity="success"
                                    onClose={() => {this.setState({ updateStatus: null });}}
                                >
                                    Update Success
                                </Alert>) : (
                                <Alert
                                    severity="error"
                                    onClose={() => {this.setState({ updateStatus: null });}}
                                >
                                    Update Error
                                </Alert>)}
                        </Collapse>
                    </Grid>
                <Grid item xs={12}>
                    <Typography variant="h4" component="h4">
                        Room Code: {this.state.roomCode}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    {this.state.isHost ? this.renderRadioButton() : null}
                </Grid>

                {(this.state.isHost || this.state.guestCanControl) ? this.renderSettings() : null}
                

                <Grid item xs={12}>
                    <Button variant="contained" color="secondary" onClick={this.handleLeaveRoom}>
                        Leave Room
                    </Button>
                </Grid>
            </Grid>
                
        )
    }
}