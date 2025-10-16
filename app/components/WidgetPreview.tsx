'use client'

interface WidgetPreviewProps {
  config: any
  url: string
}

export default function WidgetPreview({ config, url }: WidgetPreviewProps) {
  if (!config) {
    return (
      <div className="bg-white rounded-lg p-6 window-frame">
        <div className="border-b-2 border-gray-200 pb-2 mb-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
        </div>
        <div className="flex items-center justify-center h-[450px] text-gray-400">
          <div className="text-center">
            <div className="text-6xl mb-4">📱</div>
            <p className="text-sm">위젯 설정을 완료하면</p>
            <p className="text-sm">여기에 미리보기가 표시됩니다</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg p-6 window-frame">
      <div className="border-b-2 border-gray-200 pb-2 mb-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <span className="text-xs text-gray-500">미리보기</span>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-md overflow-hidden">
        <iframe
          src={url}
          className="w-full h-[450px] border-0"
          title="Widget Preview"
        />
      </div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">
        * 실제 위젯은 Notion 데이터를 실시간으로 불러옵니다
      </p>
    </div>
  )
}

