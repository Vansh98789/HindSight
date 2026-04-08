import { useState } from 'react'
import DecisionCard from '../../components/Decisioncards'

const dummyDecisions = [
  {
    id: 1,
    title: 'Should I quit my job?',
    description: 'I hate my manager, better opportunity elsewhere...',
    category: 'Career',
    confidence: 8,
    reviewStatus: '3 days left',
    reviewStatusColor: 'yellow' as const
  },
  {
    id: 2,
    title: 'Invest in crypto?',
    description: 'Market seems bullish, thinking of putting 10k...',
    category: 'Finance',
    confidence: 6,
    reviewStatus: 'Overdue!',
    reviewStatusColor: 'red' as const
  }
]

function Dashboard() {
  const [activeTab, setActiveTab] = useState('decisions')

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      <nav className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">HindSight</h1>
        <button className="text-sm text-gray-400 hover:text-white">Logout</button>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">

        <div className="flex gap-4 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('decisions')}
            className={`pb-3 font-medium ${activeTab === 'decisions' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
          >
            My Decisions
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`pb-3 font-medium ${activeTab === 'pending' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
          >
            Pending Reviews
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 font-medium ${activeTab === 'analytics' ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
          >
            Analytics
          </button>
        </div>

        {activeTab === 'decisions' && (
          <div className="grid gap-4">
            {dummyDecisions.map((decision) => (
              <DecisionCard
                key={decision.id}
                title={decision.title}
                description={decision.description}
                category={decision.category}
                confidence={decision.confidence}
                reviewStatus={decision.reviewStatus}
                reviewStatusColor={decision.reviewStatusColor}
              />
            ))}
          </div>
        )}

        {activeTab === 'pending' && (
          <div className="text-gray-400">No pending reviews at the moment.</div>
        )}

        {activeTab === 'analytics' && (
          <div className="text-gray-400">Analytics will be available once you have 5 decisions!</div>
        )}

      </main>

      <button className="fixed bottom-8 right-8 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-200">
        + New Decision
      </button>

    </div>
  )
}

export default Dashboard