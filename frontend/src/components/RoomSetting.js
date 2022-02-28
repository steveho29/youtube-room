import React, { Component } from "react";
import {  Grid, Typography, Button, FormControl, FormControlLabel, FormHelperText, RadioGroup, Radio, TextField, Collapse} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default class RoomSetting extends Component {
    constructor(props){
        super(props);
        this.state = {
            videoId: this.props.videoId,
            guestCanControl: this.props.guestCanControl,
            updateStatus: null,
        }

        this.handleGuestCanControlChange = this.handleGuestCanControlChange.bind(this);
        this.handleSubmitButtonPressed = this.handleSubmitButtonPressed.bind(this);
        this.handleTextChange = this.handleTextChange.bind(this);
        this.renderRadioButton = this.renderRadioButton.bind(this);
    }

    
    
    
    render(){
        return (
            <Grid container xs={12} justifyContent="center" align="center">
                <Grid item xs={4}  align="center">
                    <Collapse in={this.state.updateStatus != null}>
                        {this.state.updateStatus ? (
                        <Alert
                            severity="success"
                            onClose={() => {
                            this.setState({ updateStatus: null });
                            }}
                        >
                            Update Success
                        </Alert>) : (
                        <Alert
                            severity="error"
                            onClose={() => {
                            this.setState({ updateStatus: null });
                            }}
                        >
                            Update Error
                        </Alert>
                        )
                        }
                    </Collapse>
                </Grid>
                
                <Grid item xs={12} align="center">
                    {this.props.isHost ? this.renderRadioButton() : null}
                </Grid>

                {/* <Grid item xs={12} align="center"> */}
                    {/* <FormControl> */}
                        {/* <TextField
                            require={true}
                            type="number"
                            onChange={this.handleVotesChange}
                            defaultValue={this.state.votesToSkip}
                            inputProps={{
                                min:1,
                                style:{
                                    textAlign: "center"
                                }
                            }}
                        /> */}

                        {/* <TextField
                        label="Video ID"
                        placeholder="Enter Video ID"
                        value={this.props.videoId}
                        helperText=""
                        variant="outlined"
                        onChange = {this.handleTextChange} */}
                    {/* />   */}
                        {/* <FormHelperText>
                            <div align="center">Votes to skip song</div>
                        </FormHelperText> */}
                    {/* </FormControl> */}
                {/* </Grid> */}


                {/* <Grid item xs={12} align="center">
                    <Button 
                        color="primary" 
                        variant="contained" 
                        onClick={this.handleSubmitButtonPressed} >
                        Submit
                    </Button>
                </Grid> */}
            </Grid>
        )
    }
}