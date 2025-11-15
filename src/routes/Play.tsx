import {QRCodeSVG} from 'qrcode.react';
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select"
import { MyChat } from '../components/MyChat'
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';
import axios from 'axios';

export default function Play() {
  const [gameID, setGameID] = useState<string>(localStorage.getItem('gameID') || '');
  const [isDark, setIsDark] = useState(false);
  const [game, setGame] = useState<string>("");
  const navigate = useNavigate();


  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    
    checkTheme();

    axios.get(`http://localhost:5000/gameID`).then(response => {
      setGameID(response.data.gameID);
      localStorage.setItem('gameID', response.data.gameID);
    }).catch(error => {
      console.error('Error fetching game ID:', error);
    });
  
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'] 
    });
    
    return () => observer.disconnect();

  }, []);

  const runGame = (selectedGame: string) => {
    // Logic to start the selected game
    navigate('/gameTest');
    console.log(`Starting game: ${selectedGame} with Game ID: ${gameID}`);
    // You can add more logic here to actually launch the game
  }

  return (
    <div>
      <h1 className="flex text-4xl justify-center text-center mt-4 font-bold">Welcome to my Epiconsole</h1>
      <div className="flex justify-end mr-10 mt-10">
        <MyChat gameID={gameID}/>
      </div>
      <div className='flex flex-row justify-between'>
        {/* QR Code Section */}
        <div className="flex flex-col justify-center mt-20 ml-32">
          <h3>Scan the QR code below to start playing</h3>
          <QRCodeSVG
            value={`http://${import.meta.env.VITE_IP}:${import.meta.env.VITE_PORT}/controller?gameID=${gameID}`}
            className="m-5 w-60 h-60"
            bgColor={isDark ? '#1a1a1a' : 'transparent'}
            fgColor={isDark ? '#ffffff' : '#000000'}
          />
          <p className="text-sm">Or go to http://{import.meta.env.VITE_IP}:{import.meta.env.VITE_PORT}/controller</p>
          <p className="text-sm">And enter the game ID: <span className="font-bold text-lg">{gameID}</span></p>
        </div>
        {/* game selection Section */}
        <div className="flex flex-col justify-center mt-20 mr-60">
          <Canvas camera={{ position: [2, 2, 2] }}>
            {/* <ambientLight intensity={0.5} /> */}
            <mesh>
                <boxGeometry args={[2, 3, 2]} />
                <meshPhongMaterial color={0x00bfff} />
            </mesh>
            <directionalLight position={[2, 5, 1]} />
            <OrbitControls 
                enableZoom={true} 
                enablePan={false}
                enableRotate={true}
            />
          </Canvas>
          <div className='flex flex-row items-center align-middle justify-between'>
            <Select onValueChange={setGame}>
              <SelectTrigger className="w-52 mt-5">
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="snake">Snake</SelectItem>
                <SelectItem value="pong">Pong</SelectItem>
              </SelectContent>
            </Select>
            {game && <Button onClick={() => runGame(game)}>Start</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}
