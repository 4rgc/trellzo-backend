import ICheckItem from '../interfaces/checkItem';
import IOrder from '../interfaces/order';
import Note from '../models/note';

const updateChecklist = (
	noteId: string,
	checklistId: string,
	name: string,
	checkItems: ICheckItem[],
	checkItemsOrder: IOrder[]
) =>
	Note.findByIdAndUpdate(
		noteId,
		{
			'checklists.$[checklistField].name': name,
			'checklists.$[checklistField].checkItems': checkItems,
			'checklists.$[checklistField].checkItemsOrder': checkItemsOrder,
		},
		{
			arrayFilters: [{ 'checklistField._id': checklistId }],
			new: true,
			omitUndefined: true,
		}
	)
		.lean()
		.exec()
		.then((n) => n?.checklists.find((c) => c._id == checklistId));

const createChecklist = (
	noteId: string,
	name: string,
	checkItems: ICheckItem[],
	checkItemsOrder: string[]
) =>
	Note.findByIdAndUpdate(
		noteId,
		{
			$push: {
				checklists: {
					name,
					checkItems,
					checkItemsOrder,
				},
			},
		},
		{
			new: true,
			omitUndefined: true,
		}
	)
		.lean()
		.exec()
		.then((n) => n?.checklists.slice(-1)[0])
		.then((c) =>
			Note.findByIdAndUpdate(noteId, {
				$push: {
					checklistsOrder: c?._id,
				},
			}).then(() => c)
		);

const deleteChecklist = (noteId: string, checklistId: string) =>
	Note.findByIdAndUpdate(
		noteId,
		{
			$pull: {
				checklists: { _id: checklistId },
				checklistsOrder: checklistId,
			},
		},
		{
			omitUndefined: true,
			fields: { checklists: { $elemMatch: { _id: checklistId } } },
		}
	)
		.lean()
		.exec()
		.then((n) => n?.checklists && n?.checklists[0]);

const checklistDataController = {
	updateChecklist,
	createChecklist,
	deleteChecklist,
};

export default checklistDataController;
