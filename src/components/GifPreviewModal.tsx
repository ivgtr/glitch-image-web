import { useState, useEffect } from 'react';
import { Modal } from './Modal';

interface GifPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  gifBlob: Blob | null;
  filename?: string;
}

export const GifPreviewModal = ({
  isOpen,
  onClose,
  gifBlob,
  filename = 'glitch-animation.gif'
}: GifPreviewModalProps) => {
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  useEffect(() => {
    if (gifBlob && isOpen) {
      const url = URL.createObjectURL(gifBlob);
      setGifUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [gifBlob, isOpen]);

  const handleDownload = () => {
    if (!gifBlob) return;
    
    const url = URL.createObjectURL(gifBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!gifBlob) return;

    try {
      if (navigator.share && navigator.canShare) {
        const file = new File([gifBlob], filename, { type: 'image/gif' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'グリッチアニメーション',
            text: 'グリッチ画像ツールで作成したアニメーション',
            files: [file]
          });
          return;
        }
      }
      
      // Web Share API が使えない場合はクリップボードにコピー
      const url = URL.createObjectURL(gifBlob);
      await navigator.clipboard.writeText(url);
      alert('GIF URLがクリップボードにコピーされました');
    } catch (error) {
      console.error('共有に失敗しました:', error);
      handleDownload(); // フォールバック
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="GIFアニメーション プレビュー"
      size="lg"
    >
      <div className="space-y-4">
        {/* GIFプレビュー */}
        <div className="flex justify-center bg-gray-50 rounded-lg p-4">
          {gifUrl ? (
            <img
              src={gifUrl}
              alt="生成されたGIFアニメーション"
              className="max-w-full max-h-96 rounded-lg shadow-md"
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <div className="flex items-center justify-center w-64 h-64 bg-gray-200 rounded-lg">
              <div className="text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">プレビューを読み込み中...</p>
              </div>
            </div>
          )}
        </div>

        {/* ファイル情報 */}
        {gifBlob && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="text-sm font-medium text-gray-700 mb-2">ファイル情報</h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <span className="font-medium">ファイル名:</span>
                <span className="ml-2">{filename}</span>
              </div>
              <div>
                <span className="font-medium">ファイルサイズ:</span>
                <span className="ml-2">{Math.round(gifBlob.size / 1024)} KB</span>
              </div>
            </div>
          </div>
        )}

        {/* アクションボタン */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            閉じる
          </button>
          
          {'share' in navigator && 'canShare' in navigator && (
            <button
              onClick={handleShare}
              disabled={!gifBlob}
              className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              共有
            </button>
          )}
          
          <button
            onClick={handleDownload}
            disabled={!gifBlob}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            ダウンロード
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default GifPreviewModal;