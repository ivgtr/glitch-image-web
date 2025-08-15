import { useState, useRef } from 'react'

function GlitchImage() {
  const [image, setImage] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCanvasClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      
      {!image ? (
        <div 
          onClick={handleCanvasClick}
          style={{
            width: '600px',
            height: '400px',
            border: '2px dashed #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            margin: '0 auto',
            backgroundColor: '#f9f9f9'
          }}
        >
          <p>画像をクリックまたはドラッグ&ドロップしてアップロード</p>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: '100%',
            border: '1px solid #ccc',
            cursor: 'crosshair'
          }}
        />
      )}

      {image && (
        <div style={{ marginTop: '1rem' }}>
          <button onClick={handleCanvasClick} style={{ marginRight: '1rem' }}>
            別の画像を選択
          </button>
          <button>
            画像をダウンロード
          </button>
        </div>
      )}
    </div>
  )
}

export default GlitchImage