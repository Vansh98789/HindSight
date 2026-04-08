type DecisionCardProps = {
  title: string
  description: string
  category: string
  confidence: number
  reviewStatus: string
  reviewStatusColor: 'yellow' | 'red' | 'green'
}

function DecisionCard({
  title,
  description,
  category,
  confidence,
  reviewStatus,
  reviewStatusColor
}: DecisionCardProps) {

  const colorMap = {
    yellow: 'text-yellow-400',
    red: 'text-red-400',
    green: 'text-green-400'
  }

  return (
    <div className="border border-gray-800 rounded-xl p-5 hover:border-gray-600 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-medium">{title}</h3>
        <span className="text-xs bg-gray-800 px-2 py-1 rounded-full">{category}</span>
      </div>
      <p className="text-gray-400 text-sm mb-4">{description}</p>
      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-400">
          Confidence: <span className="text-white">{confidence}/10</span>
        </span>
        <span className="text-gray-400">
          Review: <span className={colorMap[reviewStatusColor]}>{reviewStatus}</span>
        </span>
      </div>
    </div>
  )
}

export default DecisionCard