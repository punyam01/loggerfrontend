import React from 'react'

const Y_AXIS_STEP = 0.5
const FIXED_MAX_Y = 5 // Y-axis always goes from 0 to 5

const SymptomChart = ({ symptoms }) => {
  if (!symptoms || symptoms.length === 0) {
    return <p className='text-gray-500'>No symptom data available.</p>
  }

  // last 5 entries
  const topSymptoms = symptoms.slice(-5)

  const maxY = FIXED_MAX_Y
  const barAreaHeight = 224 // px

  // Y axis ticks, from 0 to 5 in steps of 0.5
  const ticks = []
  for (let y = 0; y <= maxY + 1e-6; y += Y_AXIS_STEP) {
    ticks.push(Number(y.toFixed(1)))
  }

  return (
    <div className='w-full max-w-full overflow-x-auto px-2'>
      <div className='relative flex pt-2'>
        {/* Y axis ticks/lines */}
        <div
          className='relative flex flex-col justify-between h-56 pr-2'
          style={{ minWidth: '30px' }}
        >
          {ticks
            .slice()
            .reverse()
            .map(tick => (
              <div
                key={tick}
                className='flex items-center'
                style={{ height: `${barAreaHeight / (ticks.length - 1)}px` }}
              >
                <span
                  className='text-xs text-gray-400'
                  style={{ width: '24px', textAlign: 'right' }}
                >
                  {tick.toFixed(1)}
                </span>
              </div>
            ))}
        </div>
        {/* Bars and x-axis labels */}
        <div
          className='flex-1 flex items-end justify-between h-56 border-t border-gray-200'
          style={{ position: 'relative' }}
        >
          {/* Grid lines */}
          {ticks.slice(1, -1).map(tick => (
            <div
              key={`grid-${tick}`}
              className='absolute left-0 right-0 w-full'
              style={{
                bottom: `${((tick - 0) / (maxY - 0)) * barAreaHeight}px`,
                height: '1px',
                borderTop: '1px dashed #E5E7EB',
                zIndex: 0
              }}
            ></div>
          ))}
          {/* Bars */}
          {topSymptoms.map((symptom, index) => {
            const score = parseFloat(symptom.averageSymptomScore) || 0
            const barHeight = (Math.min(score, maxY) / maxY) * barAreaHeight
            return (
              <div
                key={`${symptom.logId || symptom.date}-${index}`}
                className='flex flex-col items-center flex-1 z-10'
                style={{ minWidth: '40px' }}
              >
                {/* Value */}
                <div className='text-xs text-gray-600 mb-2 text-center'>
                  {score.toFixed(1)}
                </div>
                {/* Bar */}
                <div
                  className='w-8 sm:w-10 bg-blue-500 rounded-t shadow-md transition-all duration-300 hover:bg-blue-600'
                  style={{ height: `${barHeight}px` }}
                />
                {/* Label */}
                <div className='text-xs text-gray-700 mt-2 text-center font-medium'>
                  {new Date(symptom.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SymptomChart
