interface ImageDropZoneProps {
  isDragging: boolean;
  onImageSelect: () => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export const ImageDropZone = ({
  isDragging,
  onImageSelect,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop
}: ImageDropZoneProps) => {
  return (
    <div
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onImageSelect}
      className={`
        w-full max-w-2xl h-96 mx-auto
        border-2 border-dashed rounded-xl
        flex items-center justify-center cursor-pointer
        transition-all duration-300 ease-in-out
        ${
          isDragging
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
        }
      `}
    >
      <div className="text-center">
        <div className="mb-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-2">
          {isDragging ? '画像をドロップしてください' : '画像をクリックまたはドラッグ&ドロップ'}
        </p>
        <p className="text-sm text-gray-500">
          対応形式: PNG, JPG, GIF
        </p>
      </div>
    </div>
  );
};