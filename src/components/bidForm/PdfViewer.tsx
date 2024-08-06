import { Viewer, Worker } from '@react-pdf-viewer/core'
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout'
import * as pdfjs from 'pdfjs-dist'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/default-layout/lib/styles/index.css'

interface PdfViewerProps {
  file: string | null
}

const PdfViewer = ({ file }: PdfViewerProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin()
  return (
    <div className="flex justify-center items-center w-[100%] h-[100%]">
      <Worker
        workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`}
      >
        <Viewer fileUrl={file ?? ''} plugins={[defaultLayoutPluginInstance]} />
      </Worker>
    </div>
  )
}

export default PdfViewer
