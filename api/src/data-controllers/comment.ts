import Note from '../models/note';

const getComments = (noteId: string) =>
	Note.findById(noteId, { comments: 1 }).lean().exec();

const postComment = (noteId: string, userId: string, content: string) =>
	Note.findByIdAndUpdate(
		noteId,
		{
			$push: {
				comments: {
					userId,
					content,
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
		.exec();

const patchComment = (noteId: string, commentId: string, content: string) =>
	Note.findByIdAndUpdate(
		noteId,
		{
			'comments.$[commentField].content': content,
			'comments.$[commentField].timestamp': Date.now(),
		},
		{
			new: true,
			arrayFilters: [{ 'commentField._id': commentId }],
		}
	)
		.lean()
		.exec();

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
