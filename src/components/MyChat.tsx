import { useGameNetwork } from '../utils/network';

export function MyChat({gameID}: {gameID: string}) {
  const { messages } = useGameNetwork(gameID);

  console.log("gameID", gameID);

  return (
    <div className="max-h-60 w-3/12 border rounded-lg p-4">
      <h3 className="font-bold mb-2">Chat</h3>
      {messages.length === 0 ? (
        <p className="text-gray-500">No messages yet...</p>
      ) : (
        messages.map((msg, index) => (
          <p key={index} className="mb-1">{msg}</p>
        ))
      )}
    </div>
  );
}