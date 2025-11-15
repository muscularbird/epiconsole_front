import { useState, useEffect } from 'react';
import { socket } from '../Socket';

export function useGameNetwork(gameID: string) {
    const [messages, setMessages] = useState<string[]>([]);
    const [commands, setCommands] = useState<{[socketID: string]: string[]}>({});
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (!gameID) return;

        console.log(`Setting up network for gameID: ${gameID}`);
        console.log(`My socket ID: ${socket.id}`);

        socket.emit('joinGame', { gameID });

        const handleJoinConfirm = (data: { gameID: string, socketID: string }) => {
            console.log(`Join confirmed for game ${data.gameID}, my socket ID: ${data.socketID}`);
        };

        const handleChatMessage = (data: { gameID: string, message: string, socketID?: string }) => {
            console.log("Chat message received:", data);
            if (data.gameID === gameID) {
                setMessages(prev => [...prev, data.message]);
            }
        };

        const handleCommands = (data: any) => {
            console.log("Raw command data received:", data);
            // console.log("Data type:", typeof data);
            // console.log("Data keys:", Object.keys(data));
            
            if (!data.gameID) {
                console.error("No gameID in command data!");
                return;
            }
            
            if (!data.commands) {
                console.error("No commands in command data!");
                return;
            }
            
            if (!data.socketID) {
                console.error("No socketID in command data!");
                // console.log("Full data object:", JSON.stringify(data, null, 2));
                return;
            }
            
            // console.log(`Command details: gameID=${data.gameID}, socketID=${data.socketID}, command=${data.commands}`);
            
            if (data.gameID === gameID) {
                // console.log("Command accepted for game", gameID);
                setCommands(prev => {
                    const newCommands = { ...prev };
                    
                    if (!newCommands[data.socketID]) {
                        newCommands[data.socketID] = [];
                    }
                    newCommands[data.socketID] = [...newCommands[data.socketID], data.commands];
                    
                    // console.log("Updated commands state:", newCommands);
                    return newCommands;
                });
            } else {
                console.log(`Command rejected - gameID mismatch: expected ${gameID}, got ${data.gameID}`);
            }
        };

        const handleConnect = () => {
            console.log(`Socket connected, ID: ${socket.id}`);
            setIsConnected(true);
        };

        const handleDisconnect = () => {
            console.log("Socket disconnected");
            setIsConnected(false);
        };

        socket.off('joinConfirm');
        socket.off('chat message');
        socket.off('commands');
        socket.off('connect');
        socket.off('disconnect');

        socket.on('joinConfirm', handleJoinConfirm);
        socket.on('chat message', handleChatMessage);
        socket.on('commands', handleCommands);
        socket.on('connect', handleConnect);
        socket.on('disconnect', handleDisconnect);

        setIsConnected(socket.connected);
        console.log(`Initial connection status: ${socket.connected}`);

        return () => {
            console.log(`Cleaning up network for gameID: ${gameID}`);
            socket.off('joinConfirm', handleJoinConfirm);
            socket.off('chat message', handleChatMessage);
            socket.off('commands', handleCommands);
            socket.off('connect', handleConnect);
            socket.off('disconnect', handleDisconnect);
            socket.emit('leaveGame', { gameID });
        };
    }, [gameID]);

    const sendMessage = (message: string) => {
        console.log(`Sending message: ${message} to game ${gameID}`);
        socket.emit('chat message', { gameID, message });
    };

    const sendCommand = (command: string) => {
        console.log(`Sending command: ${command} to game ${gameID}`);
        socket.emit('commands', { gameID, commands: command });
    };

    const clearCommands = () => {
        console.log("Clearing all commands");
        setCommands({});
    };

    return { 
        messages, 
        commands, 
        isConnected,
        sendMessage,
        sendCommand,
        clearCommands
    };
}
