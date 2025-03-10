import { useState } from "react";
import { Heart, MessageCircle, X, Send, Trash2, Edit } from "lucide-react";
import classNames from "classnames";
import { useLike } from "../../../hooks/useLike";
import { useReply } from "../../../hooks/useReply";
import { useAuth } from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useComment } from "../../../hooks/useComment";

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

const Reply = ({ reply, onDelete, refreshComments }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);
  const { user } = useAuth();
  const { toggleReplyLike } = useLike();
  const { updateReply } = useReply();

  const handleEdit = async () => {
    
    const success = await updateReply(reply.reply_id, editContent);
    if (success) {
      setIsEditing(false);
      refreshComments();
    }
  };

  const handleLike = async () => {
    const result = await toggleReplyLike(reply.reply_id);
    if (result !== null) {
      refreshComments();
    }
  };

  return (
    <div className="flex items-start justify-between bg-gray-50 p-3 rounded-lg border border-gray-100">
      <div className="flex items-start space-x-3 flex-grow">
        <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center">
          <span className="text-emerald-600 font-medium text-sm">
            {reply.username.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <p className="font-medium text-gray-800 text-sm">{reply.username}</p>
            <p className="text-xs text-gray-500">
              {new Date(reply.created_at).toLocaleString()}
            </p>
          </div>
          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                rows="2"
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={handleEdit}
                  disabled={!editContent.trim()}
                  className="px-2 py-1 text-xs rounded-md bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  수정
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 text-sm mt-1">{reply.content}</p>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={handleLike}
          className={classNames(
            "flex items-center space-x-1 px-2 py-1 rounded-full transition-all duration-200",
            reply.has_liked
              ? "text-emerald-500 bg-emerald-50 hover:bg-emerald-100"
              : "text-gray-500 hover:bg-gray-50"
          )}
        >
          <Heart
            className={classNames(
              "w-4 h-4 transition-colors duration-200",
              reply.has_liked
                ? "fill-emerald-500 stroke-emerald-500"
                : "fill-none stroke-current"
            )}
          />
          <span className="text-xs font-medium">{reply.like_count}</span>
        </button>
        {user && user.user_id === reply.user_id && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1 text-gray-400 hover:text-emerald-500 transition-colors"
              title="답글 수정"
            >
              <Edit className="w-3 h-3" />
            </button>
            <button
              onClick={() => onDelete(reply.reply_id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="답글 삭제"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const Comment = ({ comment, onDelete, refreshComments }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [replyingTo, setReplyingTo] = useState(null);
  const { user } = useAuth();
  const { toggleCommentLike } = useLike();
  const { updateComment } = useComment();
  const { createReply, deleteReply } = useReply();

  const handleEdit = async () => {
    const success = await updateComment(comment.comment_id, editContent);
    if (success) {
      setIsEditing(false);
      refreshComments();
    }
  };

  const handleReplySubmit = async (content) => {
    const result = await createReply(comment.comment_id, content);
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
    <div className="mb-6">
      <div className="flex items-start justify-between bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-start space-x-3 flex-grow">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <span className="text-emerald-600 font-medium">
              {comment.username.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
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
            {isEditing ? (
              <div className="mt-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                  rows="3"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-3 py-1 text-sm rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleEdit}
                    disabled={!editContent.trim()}
                    className="px-3 py-1 text-sm rounded-md bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50"
                  >
                    수정
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 mt-1 whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleCommentLike(comment.comment_id)}
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
            <span className="text-sm font-medium">{comment.like_count}</span>
          </button>
          <button
            onClick={() => setReplyingTo(comment.comment_id)}
            className="p-1 text-gray-400 hover:text-emerald-500 transition-colors"
            title="답글 작성"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          {user && user.user_id === comment.user_id && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-emerald-500 transition-colors"
                title="댓글 수정"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(comment.comment_id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="댓글 삭제"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
      {replyingTo === comment.comment_id && (
        <div className="ml-12 mt-2">
          <ReplyForm
            onSubmit={handleReplySubmit}
            onCancel={() => setReplyingTo(null)}
          />
        </div>
      )}
      <div className="ml-12 mt-2 space-y-2">
        {comment.reply?.map((reply) => (
          <Reply
            key={reply.reply_id}
            reply={reply}
            onDelete={handleReplyDelete}
            refreshComments={refreshComments}
          />
        ))}
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
  const { deleteComment } = useComment();
  const { user } = useAuth();

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
    const result = await createReply(comment.comment_id, content);
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

  const handleCommentDelete = async (commentId) => {
    const result = await Swal.fire({
      title: '댓글을 삭제하시겠습니까?',
      text: "삭제된 댓글은 복구할 수 없습니다.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: '삭제',
      cancelButtonText: '취소'
    });

    if (result.isConfirmed) {
      const success = await deleteComment(commentId);
      if (success) {
        refreshComments();
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        댓글 <span className="text-emerald-500">({comments.length})</span>
      </h2>

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
            <Comment
              key={comment.comment_id}
              comment={comment}
              onDelete={handleCommentDelete}
              refreshComments={refreshComments}
            />
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
