import Joystick, { Direction } from 'rc-joystick';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { useGameNetwork } from '../utils/network';

function Arrows({ sendCommand}: { sendCommand: (direction: string) => void}) {
    const send = (direction: string) => {
        console.log(direction);
        sendCommand(direction);
    }
    return (
    
        <div className="m-auto w-10/12">
            {/* <h3>Bonjour</h3> */}
            <div onClick={() => send('Top')} className="flex w-1/2 m-auto mb-3 bg-blue-800 rounded-xl drop-shadow-xl drop-shadow-black active:drop-shadow-none">
                <img src="/fluent--triangle-32-filled.svg" className="w-30 m-auto"/>
            </div>
            <div className="flex flex-row w-full">
                <div onClick={() => send('Left')} className="flex w-1/2 ml-5 bg-green-800 rounded-xl items-center justify-center drop-shadow-xl drop-shadow-black active:drop-shadow-none"><img src="/fluent--triangle-left-32-filled.svg" className="w-30"/></div>
                <div onClick={() => send('Right')} className="flex w-1/2 ml-5 bg-red-800 rounded-xl items-center justify-center drop-shadow-xl drop-shadow-black active:drop-shadow-none"><img src="/fluent--triangle-right-32-filled.svg" className="w-30"/></div>
            </div>
            <div onClick={() => send('Bottom')} className="flex w-1/2 m-auto mt-3 bg-yellow-800 rounded-xl drop-shadow-xl drop-shadow-black active:drop-shadow-none">
                <img src="/fluent--triangle-down-32-filled.svg" className="w-30 m-auto"/>
            </div>
        </div>
    )
}

function MyJoystick({toggleFullSceen, sendCommand}: {toggleFullSceen: Function, sendCommand: (direction: string) => void}) {
    const send = (direction: Direction | String) => {
        if (direction == "Center") return;
        sendCommand(direction.toString());
    }
    return (
        <div className='m-auto items-center justify-between flex flex-col h-screen py-30'>
            <div></div> {/* Spacer */}
            <Joystick onDirectionChange={(direction: Direction | "Center" | "Right" | "RightTop" | "Top" | "TopLeft" | "Left" | "LeftBottom" | "Bottom" | "BottomRight") => send(direction) }/>
            <button onClick={() => toggleFullSceen()} className='btn btn-primary rounded-2xl p-1'>
                Toggle full screen mode
            </button>
        </div>
    )
}

export default function Controller() {
    const [mode, setMode] = useState('arrows')
    const [searchParams, setSearchParams] = useSearchParams();
    const navi = useNavigate();
    const [input, setInput] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [validated, setValidated] = useState(false);
    const gameID = searchParams.get('gameID');
    const { sendCommand, sendMessage } = useGameNetwork(gameID ? gameID : '');

    const toggleFullSceen = (): void => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };


    return (
        <div className="flex h-screen justify-center items-center align-middle">
            {gameID !== null && <h2 className="text-2xl top-14 left-5 absolute">Game ID: {gameID}</h2>}
            {gameID == null ? <div>
                <h2 className="text-3xl m-auto">Enter the Game ID</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    setSearchParams({gameID: input});
                }}>
                    <div className='m-auto'>
                        <input type="text" className="input input-bordered input-primary max-w-xs m-auto mt-5" placeholder="Game ID" onChange={(e) => setInput(e.target.value)} value={input}/>
                        <Button type='submit' disabled={!input} className='ml-5'>Submit</Button>
                    </div>
                </form>
            </div> :
                (!validated ?(
                    <div>
                        <h2 className="text-3xl m-auto">Select a Display Name</h2>
                        <form onSubmit={() => {
                            setValidated(true);
                            sendCommand("new player");
                            sendMessage(`${displayName} has joined the game!`);
                            }}>
                        <div className='justify-between'>
                            <input type="text" className="input input-bordered input-primary max-w-xs m-auto mt-5" placeholder="Display Name" onChange={(e) => setDisplayName(e.target.value)} value={displayName}/>
                            <Button type='submit' disabled={!displayName} className="ml-10">Submit</Button>
                        </div>
                        </form>
                    </div>
                ) : (
                    <div className='h-full'>
                        <div className='flex flex-row justify-between'>
                            <button onClick={() => navi('/')} className="absolute top-5 left-5 z-10 btn btn-primary bg-amber-300 rounded-2xl p-1 hover:shadow-xl">go to website</button>
                            <button onClick={() => setMode(mode == 'arrows' ? 'joystick' : 'arrows')} className="absolute top-5 right-5 z-10 btn btn-primary bg-amber-300 rounded-2xl p-1 hover:shadow-xl">{mode == 'arrows' ? 'Use joystick' : 'Use arrows'}</button>
                        </div>
                        {mode == 'arrows' && <Arrows sendCommand={sendCommand}/>}
                        {mode == 'joystick' && <MyJoystick toggleFullSceen={toggleFullSceen} sendCommand={sendCommand}/>}
                    </div>
                ))
            }
        </div>
    )
}