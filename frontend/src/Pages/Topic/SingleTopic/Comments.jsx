import { useState } from "react";
import { Heart } from "lucide-react";
import classNames from "classnames";
import { useLike } from "../../../hooks/useLike";

const PaginationControls = ({ currentPage, totalPages, onPageChange }) => (
  <div className="flex justify-center gap-2 mt-4">
    <button
      onClick={() => onPageChange(currentPage - 1)}
      disabled={currentPage === 1}
      className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
    >
      이전
    </button>
    <span className="px-3 py-1">
      {currentPage} / {totalPages}
    </span>
    <button
      onClick={() => onPageChange(currentPage + 1)}
      disabled={currentPage === totalPages}
      className="px-3 py-1 rounded bg-gray-100 disabled:opacity-50"
    >
      다음
    </button>
  </div>
);

const Comments = ({
  comments = [],
  currentPage,
  totalPages,
  onPageChange,
  onSubmitComment,
  loading,
  refreshComments,
}) => {
  const [newComment, setNewComment] = useState("");
  const { toggleCommentLike } = useLike();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    onSubmitComment(newComment);
    setNewComment("");
  };

  const handleLike = async (commentId) => {
    await toggleCommentLike(commentId);
    refreshComments();
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">댓글</h2>

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

      <div className="space-y-6">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 font-medium">
                      {comment.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {comment.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleLike(comment.comment_id)}
                  className={classNames(
                    "flex items-center space-x-1 px-3 py-1 rounded-full transition-all duration-200",
                    comment.has_liked
                      ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                      : "text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <Heart
                    className={classNames(
                      "w-5 h-5 transition-colors duration-200",
                      comment.has_liked
                        ? "fill-emerald-500 stroke-emerald-500"
                        : "fill-none stroke-current"
                    )}
                  />
                  <span className="text-sm font-medium">
                    {comment.like_count}
                  </span>
                </button>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">아직 댓글이 없습니다.</p>
            <p className="text-gray-400 text-sm mt-1">
              첫 번째 댓글을 작성해보세요!
            </p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default Comments;
