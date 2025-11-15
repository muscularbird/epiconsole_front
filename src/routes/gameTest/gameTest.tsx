import { Application, extend, useTick } from '@pixi/react';
import { useState, useRef, useCallback } from 'react';
import { useGameNetwork } from '../../utils/network';
import {
    Container,
    Graphics,
    Sprite
} from 'pixi.js';

extend({
    Container,
    Graphics,
    Sprite
});

interface Player {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    score: number;
}

interface GameState {
    players: { [socketID: string]: Player };
    enemies: Array<{ x: number, y: number, width: number, height: number }>;
    gameOver: boolean;
    gameStarted: boolean;
}

const PLAYER_COLORS = ['blue', 'green', 'orange', 'purple', 'yellow', 'cyan'];

export default function GameTest() {
    const [gameState, setGameState] = useState<GameState>({
        players: {},
        enemies: [],
        gameOver: false,
        gameStarted: false
    });

    const { commands, clearCommands } = useGameNetwork(localStorage.getItem('gameID') || '');
    const gameStateRef = useRef(gameState);
    const commandQueueRef = useRef<Array<{ socketID: string, command: string }>>([]);
    
    gameStateRef.current = gameState;

    function GameLoop() {
        useTick((delta) => {
            // if (gameStateRef.current.gameOver || !gameStateRef.current.gameStarted) return;

            handleEvents();
            updateGame(delta);
        });

        return null;
    }

    // 1. EVENT HANDLING
    const handleEvents = useCallback(() => {
        for (const [socketID, commandList] of Object.entries(commands)) {
            commandList.forEach(command => {
                console.log("cmd :" , command, socketID);
                commandQueueRef.current.push({ socketID, command });
            });
        }
        
        while (commandQueueRef.current.length > 0) {
            const { socketID, command } = commandQueueRef.current.shift()!;
            processCommand(socketID, command);
        }
        
        if (Object.keys(commands).length > 0) {
            clearCommands();
        }
    }, [commands, clearCommands]);

    const processCommand = (socketID: string, command: string) => {
        setGameState(prev => {
            const newState = { ...prev };
            
            if (!newState.players[socketID]) {
                const playerCount = Object.keys(newState.players).length;
                const color = PLAYER_COLORS[playerCount % PLAYER_COLORS.length];
                
                newState.players[socketID] = {
                    id: socketID,
                    x: 50 + (playerCount * 100), // Spread players horizontally
                    y: 100,
                    width: 20,
                    height: 40,
                    color: color,
                    score: 0
                };
                
                if (!newState.gameStarted) {
                    newState.gameStarted = true;
                }
                return newState;
            }
            
            if (newState.players[socketID]) {
                const player = { ...newState.players[socketID] };
                const moveSpeed = 5;
                
                switch (command) {
                    case 'Top':
                        player.y = Math.max(0, player.y - moveSpeed);
                        break;
                    case 'Bottom':
                        player.y = Math.min(560, player.y + moveSpeed);
                        break;
                    case 'Left':
                        player.x = Math.max(0, player.x - moveSpeed);
                        break;
                    case 'Right':
                        player.x = Math.min(780, player.x + moveSpeed);
                        break;
                }
                
                newState.players[socketID] = player;
            }
            
            return newState;
        });
    };

    const updateGame = useCallback((delta: number | import('pixi.js').Ticker) => {
        const numericDelta = typeof delta === 'number'
            ? delta
            : ((delta as any).delta ?? (delta as any).deltaTime ?? 1);

        setGameState(prev => {
            if (prev.gameOver || !prev.gameStarted) return prev;
            
            const newState = { ...prev };
            
            // Spawn enemies
            if (Math.random() < 0.02) {
                newState.enemies = [...prev.enemies, {
                    x: Math.random() * 760,
                    y: -20,
                    width: 20,
                    height: 20
                }];
            }
            
            // Move enemies
            newState.enemies = prev.enemies
                .map(enemy => ({ ...enemy, y: enemy.y + 2 * numericDelta }))
                .filter(enemy => enemy.y < 620);
            
            // Check collisions for each player
            const playersArray = Object.values(newState.players);
            // let anyPlayerHit = false;
            
            playersArray.forEach(player => {
                const playerHit = newState.enemies.some(enemy => 
                    checkCollision(player, enemy)
                );
                
                if (playerHit) {
                    // Respawn player at bottom with score penalty
                    newState.players[player.id] = {
                        ...player,
                        y: 500,
                        score: Math.max(0, player.score - 100)
                    };
                }
            });
            
            Object.keys(newState.players).forEach(socketID => {
                newState.players[socketID].score += Math.floor(numericDelta);
            });
            
            // if (Object.keys(newState.players).length === 0) {
            //     newState.gameOver = true;
            // }
            
            return newState;
        });
    }, []);

    const checkCollision = (rect1: any, rect2: any) => {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    };

    const PlayersGraphics = useCallback(() => {
        return (
            <>
                {Object.values(gameState.players).map((player) => {
                    const draw = useCallback((g: any) => {
                        g.clear();
                        g.rect(0, 0, player.width, player.height);
                        g.fill(player.color);
                        
                        // Add a border to distinguish players
                        g.rect(0, 0, player.width, player.height);
                        g.stroke({ width: 2, color: 'white' });
                    }, [player]);

                    return (
                        <pixiGraphics 
                            key={player.id}
                            draw={draw} 
                            x={player.x} 
                            y={player.y} 
                        />
                    );
                })}
            </>
        );
    }, [gameState.players]);

    const EnemiesGraphics = useCallback(() => {
        return (
            <>
                {gameState.enemies.map((enemy, index) => {
                    const draw = useCallback((g: any) => {
                        g.clear();
                        g.rect(0, 0, enemy.width, enemy.height);
                        g.fill('red');
                    }, [enemy]);

                    return (
                        <pixiGraphics 
                            key={index}
                            draw={draw} 
                            x={enemy.x} 
                            y={enemy.y} 
                        />
                    );
                })}
            </>
        );
    }, [gameState.enemies]);

    const UIOverlay = () => (
        <div style={{
            position: 'absolute',
            top: 10,
            left: 10,
            color: 'white',
            fontSize: '16px',
            fontFamily: 'Arial',
            zIndex: 1000,
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: '10px',
            borderRadius: '5px'
        }}>
            <div style={{marginBottom: '10px', fontSize: '18px', fontWeight: 'bold'}}>
                Multiplayer Game
            </div>
            <div>Players: {Object.keys(gameState.players).length}</div>
            {/* <div>Enemies: {gameState.enemies.length}</div> */}
            <div style={{marginTop: '10px'}}>
                <strong>Scoreboard:</strong>
                {Object.values(gameState.players)
                    .sort((a, b) => b.score - a.score)
                    .map((player, index) => (
                        <div key={player.id} style={{
                            color: player.color,
                            marginLeft: '10px'
                        }}>
                            {index + 1}. Player {player.id.slice(-4)}: {player.score}
                        </div>
                    ))}
            </div>
            {!gameState.gameStarted && (
                <div style={{color: 'yellow', marginTop: '10px'}}>
                    Waiting for players to join...
                </div>
            )}
            {gameState.gameOver && (
                <div style={{color: 'red', fontSize: '20px', marginTop: '10px'}}>
                    GAME OVER!
                </div>
            )}
        </div>
    );

    return (
        <div style={{ position: 'relative' }}>
            <UIOverlay />
            <Application width={1000} height={700} background={0x1e1e1e}>
                <GameLoop />
                <PlayersGraphics />
                <EnemiesGraphics />
            </Application>
        </div>
    );
}
