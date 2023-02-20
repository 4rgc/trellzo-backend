## v0.4.0 (2023-02-20)

### Feat

- **auth**: use "secure" header for JWT cookies
- **https-proxy**: add docker image and nginx config for the proxy

## v0.3.5 (2023-01-29)

### Fix

- **ci**: push tags when bumping version and fix release tag names

## v0.3.4 (2023-01-29)

### Fix

- **ci**: use env.REVISION in bump workflow

## v0.3.3 (2023-01-29)

### Fix

- **ci**: use sudo for git commands in bump workflow
- **ci**: attempt at fixing commitizen bumping

## v0.3.2 (2023-01-28)

### Fix

- **ci**: manually bump version and fix commitizen gh action
- **cors**: set cors to trellzo.tech when not local

## v0.3.1 (2023-01-28)

### Fix

- **cd**: fix reusable workflow path

## v0.3.0 (2023-01-28)

### Feat

- **api**: use MongoUrl builder
- **mongo**: use prod files for seeding remote mongo server
- **mongo**: create dockerfile for seeding remote db

### Fix

- **api**: migrate code to mongoose 6
- **api**: fix typing for jwt

## v0.2.1 (2022-11-26)

### Fix

- **api-list**: instead of getting the first list get the list with id=listId

## v0.2.0 (2022-11-26)

### Feat

- **api-list**: add the moveNoteToList method to the list router
- **api-list**: add a moveNoteToList method to the list controller
- **api-list**: add the moveNoteToList method to the list data controller

### Fix

- **seed-data**: add note to notesOrder

## v0.1.5 (2022-08-14)

### Fix

- **ci**: load built images to use them in the docker-compose step

## v0.1.4 (2022-08-14)

### Fix

- **ci**: use cache-to and cache-from to store docker cache

## v0.1.3 (2022-08-14)

### Fix

- **ci**: write build results as images to avoid rebuilding the images

## v0.1.2 (2022-08-14)

### Fix

- **ci**: docker image build parameter name

## v0.1.1 (2022-08-14)

### Fix

- **ci**: fix yaml error in ci workflow

## v0.1.0 (2022-08-14)

### Feat

- add request logging when a flag is enabled
- allow localhost requests from the other ports
- add the changePassword route
- implement the changePassword controller method
- allow to change password when updating user
- add an api-docs route for swagger documentation
- move validation from comment controller to router
- move validation from checklist controller to router
- move validation from noteController to router
- move validation from list controller to router
- move validation from board controller to router
- move validation from auth controller to router
- move the verifyLogin method to the auth controller
- move validation from user controller to router
- implement middleware for request validation
- add postman collection file for testing with newman
- add test data for newman and seed data to work with
- allow to update checklistsOrder through updateNote
- allow to update notesOrder through updateList
- modify notesOrder on note add/delete
- add option to update listsOrder to the controllers
- modify listsOrder on list add/delete
- add boardId field on list creation
- reimplement note controller using boardId and listId fields
- add new fields to the note and list schemas
- add new fields to note and list entities
- add new fields to the seed data
- implement comment router and use it
- implement comment controller
- implement comment data controller
- implement checklist router and use it in the app
- implement the checklist controller
- implement checklist data controller
- change list data controller to use the board model
- implement note model
- implement partial note schema
- add userIds field to board seed data
- replace board schema with partial board schema in user
- implement partial board schema
- implement board model
- add userIds to board schema
- store partial board object in user
- import all seed data files
- decouple seed data
- use note router in the app
- implement note router
- implement note controller methods
- implement note data access methods
- implement and use list router
- implement list controller methods
- implement list data controller
- implement create board method
- add and use board routes
- implement board controller
- use new routers in the app
- use cookie parser middleware
- add more error handlers and validators
- add user router
- implement auth router
- implement user controller
- add getUser method to user data controller
- implement route handlers for authentication
- add jwt authentication methods
- update user schema to include password
- add functions for dealing with passwrods
- define data handlers for express routers
- assign routes for the new data controllers
- add data methods for boards
- change folder for data controllers and add more methods to user
- add temporary routes
- add user controller to test the model
- add schemas to the app
- add basic express server

### Fix

- **ci**: change branch name in the version bump GH action
- add path to cookies so that the browser can recognize them properly
- remove checkItemsOrder from the "add checklist" route
- properly init checkItemsOrder on checklist creation
- update checkItemsOrder in sync with checkItems
- remove required for dueDate field in CheckItem
- accept datetime in iso8601 format in the note router
- remove extra parameters from addNote test data
- rename tagIds request variable to tags in addNote
- include 'JWT ' in auth tokens in the test data
- prevent internal error on deleting non-existing list
- prevent double headers from being sent in list controller
- revert note creation if board update fails in createNote
- prevent weird validation error in updateNote and addNote
- replace remaining preset variables with data variables
- change expected behaviour for addChecklist
- update message when empty name passed to addList
- change expected outcome for addList
- change expected outcome for createBoard and updateBoard
- validate boardId in board controller
- weird postman behaviour not deleting all properties sometimes
- remove special case for empty params from updateUserProfile
- expected value for name in test data
- prevent double headers being sent in board controller
- expect access token change only if status code is 200
- prevent double headers sent in authErrorHandler
- prevent double headers sent in refreshAuthToken
- ambiguous behaviour when resetting cookies in the pre-request
- validate email and password in verifyLogin method
- double headers sent in some cases in user controller
- check for invalid name in registerUser method
- prevent important packages being deleted by npm
- move version check to the smoke check
- usage of board data controller
- disable streaming container stats on smoke tests
- remove tty flag from smoke test docker commands
- refer to the environment in the github workflow
- secrets usage and pinging on smoke test
- use static ip addresses in github actions
- remove blank lines in steps
- fix mistypings, add extra fields for correct test execution
- misentered objectIds for some seed data
- use ObjectId[] type for checkItemsOrder in checklists
- wrong id pushed to checklistsOrder on checklist creation
- checklistsOrder field name and type
- use ObjectId[] type for notesOrder field in lists
- change objectId types to string in board interface
- use ObjectId[] type for listsOrder field in boards
- remove unused params from note route paths
- wrong listId value in the seed data
- return only related comments from data methods
- variable naming and error message inconsistencies
- change data controller argument name
- edit only some fields when patching comment
- note id overwritten in board on note update
- code 500 error on any data request without an auth key
- wrong arguments passed to list data controller
- list interface to have partial note instead of note
- list schema to have partial notes instead of notes
- remove unused url parameter for get note route
- wrong arguments passed to the note data controller
- note data controller to work with note model
- note model name
- change tagIds property to tags in note schema
- export partial note schema
- wrong arguments passed to board data controller
- change the board data controller to work with board model
- give some required fields in note schema a default value
- send error to the next handler if irrelevant
- extend Document for certain interfaces to access _id
- chain promises with catch and handle board/list not found
- delete method not working
- list data methods return values
- wrong subroutes in list router
- use pull instead of setting to null on list delete
- **#3**: remove iat claim on token refresh
- await for update board method
- add the get user boards method
- delete board method to be async
- add delete method to board data controller
- typing for handler wrappers
- update data route to follow new user schema
- update data methods and the router to follow the new schema
- uncertainty whether user or board were not found
- add ids to boards in the seed data
- make some fields have defaults instead of being required
- lists order for the first user in seeding data

### Refactor

- rename all data controllers to end with '-data'
- separate data methods' inputs from express
- rename imported data controllers
- export named objects for data controllers
- define validating functions at module level
- use routers instead of data methods
- use global express error handlers
- implement routes using routers and data handlers
- remove express logic from data access methods
