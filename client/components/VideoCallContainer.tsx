/*
import React, {
  useState, useRef, useEffect, MutableRefObject,
} from 'react';
import { Button, TextField, IconButton } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Peer from 'simple-peer';
import { io, Socket } from 'socket.io-client';
import env from '../config/env';

interface IVideoCallProps {}

const VideoCallContainer: React.FC<IVideoCallProps> = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  useEffect(() => {
    const s = io(env.socket);
    setSocket(s);
    return () => {
      s.emit('before-disconnect', s.id);
      s.disconnect();
    };
  }, []);

  const [me, setMe] = useState('');
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState('');
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const myVideo: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const userVideo: MutableRefObject<HTMLVideoElement | null> = useRef(null);
  const connectionRef: MutableRefObject<Peer.Instance | null> = useRef(null);

  useEffect(() => {
    if (navigator) {
      navigator.mediaDevices.getUserMedia(
        { video: true, audio: true },
      )
        .then((mediaStream: MediaStream) => {
          setStream(mediaStream);
          if (myVideo.current !== null) {
            myVideo.current.srcObject = mediaStream;
          }
        })
        .catch((e) => {
          console.log(e);
        });

      if (socket !== null) {
        socket.on('me', (id) => { setMe(id); });
        socket.on('callUser', (data) => {
          setReceivingCall(true);
          setCaller(data.from);
          setName(data.name);
          setCallerSignal(data.singal);
        });
      }
    }
  }, []);

  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      if (socket !== null) {
        socket.emit('callUser', {
          userToCall: id,
          signalData: data,
          from: me,
          name,
        });
      }
    });

    peer.on('stream', (videoStream) => {
      // other person's video
      userVideo!.current!.srcObject = videoStream;
    });

    if (socket !== null) {
      socket.on('callAccepted', (signal) => {
        setCallAccepted(true);
        peer.signal(signal);
      });
    }

    // helps to end the call
    connectionRef!.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on('signal', (data) => {
      if (socket !== null) {
        socket.emit('answerCall', { signal: data, to: caller });
      }
    });

    peer.on('stream', (videoStream) => {
      if (userVideo.current !== null) {
        userVideo.current.srcObject = videoStream;
      }
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    if (connectionRef.current !== null) {
      connectionRef.current.destroy();
    }
  };

  return (
    <>
      <div className='container'>
        <div className='video-container'>
          <div className='video'>
            {stream && (
              <video
                playsInline
                muted
                ref={myVideo}
                autoPlay
                style={{ width: '300px' }}
              />
            )}
          </div>
          <div className='video'>
            {callAccepted && !callEnded
              ? (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  playsInline
                  ref={userVideo}
                  autoPlay
                  style={{ width: '300px' }}
                />
              )
              : null}
          </div>
        </div>
        <div className='myId'>
          <TextField
            id='filled-basic'
            label='Name'
            variant='filled'
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <div style={{ marginBottom: '2rem' }}>
            <CopyToClipboard
              text={me}
            >

              <Button variant='contained' color='primary' startIcon={<AssignmentIcon fontSize='large' />}>
                Copy ID
                {' '}
              </Button>

            </CopyToClipboard>

          </div>

          <TextField
            id='filled-basic'
            label='ID to call'
            variant='filled'
            value={idToCall}
            onChange={(e) => setIdToCall(e.target.value)}
          />
          <div className='call-button'>
            {callAccepted && !callEnded ? (
              <Button variant='contained' color='secondary' onClick={leaveCall}>
                End Call
              </Button>
            ) : (
              <IconButton color='primary' aria-label='call' onClick={() => callUser(idToCall)}>
                <PhoneInTalkIcon fontSize='large' />
              </IconButton>
            )}
            {idToCall}
          </div>
        </div>
        <div>
          {receivingCall && !callAccepted ? (
            <div className='caller'>
              <h1>
                {name}
                {' '}
                is calling...
              </h1>
              <Button variant='contained' color='primary' onClick={answerCall}>
                Answer
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};
*/

import React from 'react';

interface IVideoCallContainerProps {}

const VideoCallContainer: React.FC<IVideoCallContainerProps> = () => (<div>Vedio call container</div>);

export default VideoCallContainer;
