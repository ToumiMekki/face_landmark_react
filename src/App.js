import * as tf from "@tensorflow/tfjs"
import * as facemesh from "@tensorflow-models/facemesh"
import Webcam from "react-webcam";
import React,{useRef,useEffect} from "react";
import "./App.css"
import { drawMesh } from "./utilities";

function App() {

  //setup references
  const webcamRef = React.useRef(null)
  const canvasRef = React.useRef(null)

  // Load facemesh

  const runFacemesh = async () =>{
    const net = await facemesh.load({
      inputResolution:{width:640,height:480},scale:0.8
    })
    setInterval(()=>{
      detect(net)
    },100)
  }
  //Detect function 
  const detect = async (net)=>{
    if(webcamRef.current !=="undefined" && 
      webcamRef.current !== null && 
      webcamRef.current.video.readyState===4){
        //Get video Properties
        const video = webcamRef.current.video
        const videoWidth = webcamRef.current.video.videoWidth
        const videoHeight = webcamRef.current.video.videoHeight
        //Set video Width

        webcamRef.current.video.width = videoWidth
        webcamRef.current.video.height = videoHeight

        //Set Canvas width

        //Make detections
        const face = await net.estimateFaces(video)
        console.log(face)
        //get canvas context for drawing
        const ctx = canvasRef.current.getContext("2d")
        drawMesh(face,ctx)

      }
  }

  useEffect(()=>{runFacemesh()}, []);
  
  return (
    <div className="App">
      <header className="App-header">
      <Webcam ref={webcamRef} style={
        {
          position:'absolute',
          marginLeft:'auto',
          marginRight:'auto',
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:940,
          height:480,
          borderRadius:20,
        }
      } />
      <canvas ref={canvasRef} style={
        {
          position:'absolute',
          marginLeft:'auto',
          marginRight:'auto',
          left:0,
          right:0,
          textAlign:"center",
          zIndex:9,
          width:940,
          height:480,

        }
      } />
      </header>
    </div>
  );
}

export default App;
