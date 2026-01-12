export default function TestVersionPage() {
    return (
        <div className="p-10 font-bold text-3xl text-red-600">
            Build Status: SUCCESS
            <br />
            Version: v3.1 (Test Page)
            <br />
            Time: {new Date().toISOString()}
        </div>
    );
}
