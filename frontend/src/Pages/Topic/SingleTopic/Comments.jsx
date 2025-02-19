import { useState } from 'react';
import { Heart } from 'lucide-react';
import classNames from 'classnames';

const Comments = ({ 
  comments, 
  currentPage, 
  totalPages, 
  onPageChange, 
  onSubmitComment, 
  onLikeComment,
  loading 
}) => {
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onSubmitComment(newComment);
    setNewComment('');
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">댓글</h2>
      
      {/* 댓글 작성 폼 */}
      <form onSubmit={handleSubmit} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 작성해주세요..."
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
          rows="3"
        />
        <div className="flex justify-end mt-2">
          <button
            type="submit"
            disabled={!newComment.trim() || loading}
            className={classNames(
              "px-6 py-2 rounded-lg font-medium transition-all",
              !newComment.trim() || loading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            )}
          >
            댓글 작성
          </button>
        </div>
      </form>

      {/* 댓글 목록 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">{comment.user_name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleString('ko-KR')}
                </p>
              </div>
              <button
                onClick={() => onLikeComment(comment.id)}
                className={classNames(
                  "flex items-center space-x-1 text-sm transition-all",
                  comment.has_liked ? "text-emerald-500" : "text-gray-500 hover:text-emerald-500"
                )}
              >
                <Heart 
                  className={classNames(
                    "w-5 h-5",
                    comment.has_liked ? "fill-emerald-500" : "fill-none"
                  )}
                />
                <span>{comment.like_count}</span>
              </button>
            </div>
            <p className="mt-2 text-gray-700">{comment.content}</p>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-8">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => onPageChange(index + 1)}
              className={classNames(
                "px-4 py-2 rounded-lg transition-all",
                currentPage === index + 1
                  ? "bg-emerald-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              )}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Comments; 