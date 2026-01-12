export default function PingPage() {
    return (
        <div className="p-10 font-mono text-xl text-green-600">
            PONG! Service is Alive.
            <br />
            Time: {new Date().toISOString()}
        </div>
    );
}
