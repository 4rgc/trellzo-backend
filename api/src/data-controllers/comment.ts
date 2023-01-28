import Note from '../models/note.js';

const getComments = (noteId: string) =>
	Note.findById(noteId, { comments: 1 })
		.lean()
		.exec()
		.then((n) => n?.comments);

const postComment = (noteId: string, userId: string, contents: string) =>
	Note.findByIdAndUpdate(
		noteId,
		{
			$push: {
				comments: {
					userId,
					contents,
					timestamp: Date.now(),
				},
			},
		},
		{
			new: true,
			fields: {
				comments: 1,
			},
		}
	)
		.lean()
		.exec()
		.then((n) => n?.comments.slice(-1)[0]);

const patchComment = (noteId: string, commentId: string, contents: string) =>
	Note.findByIdAndUpdate(
		noteId,
		{
			'comments.$[commentField].contents': contents,
			'comments.$[commentField].timestamp': Date.now(),
		},
		{
			new: true,
			arrayFilters: [{ 'commentField._id': commentId }],
			fields: { comments: 1 },
		}
	)
		.lean()
		.exec()
		.then((n) => n?.comments.filter((c) => c._id == commentId)[0]);

const deleteComment = (noteId: string, commentId: string) =>
	Note.findByIdAndUpdate(
		noteId,
		{
			$pull: {
				comments: { _id: commentId },
			},
		},
		{
			fields: { comments: 1 },
		}
	)
		.lean()
		.exec()
		.then((n) => n?.comments?.filter((c) => c._id == commentId)[0]);

const commentDataController = {
	getComments,
	postComment,
	patchComment,
	deleteComment,
};

export default commentDataController;
