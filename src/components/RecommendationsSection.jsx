const videos = [
    {
        id: "1",
        title: "Learn HTML & CSS in 1 Hour",
        url: "https://www.youtube.com/watch?v=UB1O30fR-EE",
        thumbnail: "https://img.youtube.com/vi/UB1O30fR-EE/hqdefault.jpg"
    },
    {
        id: "2",
        title: "JavaScript Crash Course",
        url: "https://www.youtube.com/watch?v=hdI2bqOjy3c",
        thumbnail: "https://img.youtube.com/vi/hdI2bqOjy3c/hqdefault.jpg"
    },
    {
        id: "3",
        title: "Responsive Web Design Tutorial",
        url: "https://www.youtube.com/watch?v=srvUrASNj0s",
        thumbnail: "https://img.youtube.com/vi/srvUrASNj0s/hqdefault.jpg"
    }
];

export default function RecommendationsSection() {
    return (
        <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold text-indigo-700 mb-4">Recommended Videos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {videos.map(video => (
                    <a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block bg-indigo-50 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                    >
                        <img src={video.thumbnail} alt={video.title} className="w-full h-36 object-cover" />
                        <div className="p-3 text-gray-800 font-medium text-sm">{video.title}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
