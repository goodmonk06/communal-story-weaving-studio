export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold mb-6">
          Welcome to the Communal Story Weaving Studio
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Transform individual voices into powerful collective narratives using AI-powered story weaving.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a
            href="/fragments"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-3">📝 Story Fragments</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Collect and manage individual stories, experiences, and perspectives from community members.
            </p>
          </a>

          <a
            href="/projects"
            className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition border border-gray-200 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold mb-3">🧵 Weaving Projects</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Create projects that weave multiple fragments into cohesive, AI-generated narratives.
            </p>
          </a>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-3">How it works</h3>
          <ol className="space-y-3 list-decimal list-inside text-gray-700 dark:text-gray-300">
            <li>
              <strong>Collect Fragments:</strong> Community members share their stories, experiences, and perspectives.
            </li>
            <li>
              <strong>Create a Project:</strong> Define the theme and select relevant fragments to weave together.
            </li>
            <li>
              <strong>AI Weaving:</strong> Our AI analyzes and weaves fragments into a cohesive narrative that honors each voice.
            </li>
            <li>
              <strong>Review & Refine:</strong> View the woven story, track contributions, and regenerate as needed.
            </li>
          </ol>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-3">Use Cases</h3>
          <ul className="grid md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
            <li className="flex items-start">
              <span className="mr-2">📖</span>
              <span>Community blogs and publications</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">📚</span>
              <span>Collaborative books and anthologies</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🎥</span>
              <span>Documentary scripts and narratives</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🎓</span>
              <span>Educational case studies</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">💼</span>
              <span>Organizational storytelling</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">🌍</span>
              <span>Community impact reports</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
