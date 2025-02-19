import { useState } from "react";
import { Heart, MessageCircle, X, Send, Trash2 } from "lucide-react";
import classNames from "classnames";
import { useLike } from "../../../hooks/useLike";
import { useReply } from "../../../hooks/useReply";

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

const ReplyForm = ({ onSubmit, onCancel }) => {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 mb-2">
      <div className="flex items-start space-x-2">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="답글을 작성해주세요..."
          className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-sm"
          rows="2"
        />
        <div className="flex flex-col space-y-2">
          <button
            type="submit"
            disabled={!content.trim()}
            className={classNames(
              "p-2 rounded-lg transition-all",
              content.trim()
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </form>
  );
};

const Reply = ({ reply, currentUserId, onDelete, refreshComments }) => {
  const { toggleReplyLike } = useLike();

  const handleLike = async () => {
    const result = await toggleReplyLike(reply.reply_id);
    if (result !== null) {
      refreshComments();
    }
  };

  return (
    <div className="pl-12 mt-3">
      <div className="flex items-start justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-600 font-medium text-sm">
              {reply.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="font-semibold text-gray-800 text-sm">
                {reply.username}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(new Date(reply.created_at).getTime() + 9 * 60 * 60 * 1000).toLocaleString("ko-KR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">
              {reply.content}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLike}
            className={classNames(
              "flex items-center space-x-1 px-3 py-1 rounded-full transition-all duration-200",
              reply.has_liked
                ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
                : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Heart
              className={classNames(
                "w-5 h-5 transition-colors duration-200",
                reply.has_liked
                  ? "fill-emerald-500 stroke-emerald-500"
                  : "fill-none stroke-current"
              )}
            />
            <span className="text-sm font-medium">{reply.like_count}</span>
          </button>
          {currentUserId === reply.user_id && (
            <button
              onClick={() => onDelete(reply.reply_id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Comments = ({
  comments = [],
  currentPage,
  totalPages,
  onPageChange,
  onSubmitComment,
  loading,
  refreshComments,
  currentUserId,
}) => {
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const { toggleCommentLike } = useLike();
  const { createReply, deleteReply } = useReply();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onSubmitComment(newComment);
    setNewComment("");
  };

  const handleLike = async (commentId) => {
    const result = await toggleCommentLike(commentId);
    if (result !== null) {
      refreshComments();
    }
  };

  const handleReplySubmit = async (content) => {
    if (!replyingTo) return;
    const result = await createReply(replyingTo, content);
    if (result) {
      setReplyingTo(null);
      refreshComments();
    }
  };

  const handleReplyDelete = async (replyId) => {
    const result = await deleteReply(replyId);
    if (result) {
      refreshComments();
    }
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
                      {new Date(new Date(comment.created_at).getTime() + 9 * 60 * 60 * 1000).toLocaleString("ko-KR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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
                  <button
                    onClick={() => setReplyingTo(comment.comment_id)}
                    className="flex items-center space-x-1 px-3 py-1 rounded-full text-gray-500 hover:bg-gray-50"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">답글</span>
                  </button>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">
                {comment.content}
              </p>

              {replyingTo === comment.comment_id && (
                <ReplyForm
                  onSubmit={handleReplySubmit}
                  onCancel={() => setReplyingTo(null)}
                />
              )}

              {comment.reply?.map((reply) => (
                <Reply
                  key={reply.reply_id}
                  reply={reply}
                  currentUserId={currentUserId}
                  onDelete={handleReplyDelete}
                  refreshComments={refreshComments}
                />
              ))}
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
